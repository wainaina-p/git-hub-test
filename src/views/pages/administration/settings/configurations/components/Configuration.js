import React, { useState, useEffect } from 'react';
import { Card, List, Input, InputNumber, Tabs, Switch } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import '../../assets/style.css';
import { useHistory } from 'react-router-dom';
import { debounce } from 'lodash';
import { configService } from '_services';

const { TabPane } = Tabs;

const Configuration = () => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [accountSettings, setAccountSettings] = useState([]);
  const [clinicalSettings, setClinicalSettings] = useState([]);
  const [systemSettings, setSystemSettings] = useState([]);
  const [securitySettings, setSecuritySettings] = useState([]);
  const [types, setTypes] = useState([
    // 'Security',
    // 'Queue',
    // 'Clinical',
    'System',
  ]);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = (params) => {
    params = { ...params, pageSize: 100 };
    configService
      .fetchConfigList(params)
      .then((response) => {
        let data = response.data.content;

        // let account = data.filter((config) => config.group === 'Queue');
        // let clinical = data.filter((config) => config.group === 'Clinical');
        let system = data.filter((config) => config.group === 'System');
        // let security = data.filter((config) => config.group === 'Security');
        // setSecuritySettings(security);
        // setClinicalSettings(clinical);
        // setAccountSettings(account);
        setSystemSettings(system);
      })
      .catch((error) => {});
  };

  const editConfig = (id, config, index) => {
    configService
      .editConfig(id, config)
      .then((response) => {
        let data = response.data;

        switch (data.group) {
          // case 'Security':
          //   const security = securitySettings;
          //   security[index] = config;
          //   setSecuritySettings(security);
          //   break;
          case 'System':
            const system = systemSettings;
            system[index] = config;
            setSystemSettings(system);
            break;
          // case 'Clinical':
          //   const clinical = clinicalSettings;
          //   clinical[index] = config;
          //   setClinicalSettings(clinical);
          //   break;
          // case 'Queue':
          //   const account = accountSettings;
          //   account[index] = config;
          //   setAccountSettings(account);
          //   break;
          default:
            break;
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const changeValue = debounce((state, item, index) => {
    let config = {
      ...item,
      value: state,
    };
    setLoading(true);
    editConfig(item.id, config, index);
  }, 2000);

  return (
    <div>
      <Card
        type='inner'
        title={
          <>
            <ArrowLeftOutlined
              onClick={() => history.goBack()}
              className='arrow-left'
              style={{
                fontSize: '1.15em',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            />
            <span>Global Configurations</span>
          </>
        }
      >
        <Tabs defaultActiveKey='0' tabPosition='left'>
          {types.map((type, key) => (
            <TabPane tab={`${type}`} key={key}>
              <List
                itemLayout='horizontal'
                dataSource={ systemSettings
                  // type === 'Security'
                  //   ? securitySettings
                  //   : type === 'Queue'
                  //   ? accountSettings
                  //   : type === 'System'
                  //   ? systemSettings
                  //   : type === 'Clinical'
                  //   ? clinicalSettings
                  //   : null
                }
                loading={isLoading}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<b>{item.name}</b>}
                      description={item.description}
                    />
                    <div>
                      {item.field_type === 'Boolean' ? (
                        <Switch
                          onChange={(state) =>
                            changeValue(state === true ? '1' : '0', item, index)
                          }
                          checked={item.value === '1' ? true : false}
                          checkedChildren='Enabled'
                          unCheckedChildren='Disabled'
                        />
                      ) : item.field_type === 'String' ? (
                        <Input
                          value={item.value}
                          onChange={(e) =>
                            changeValue(e.target.value, item, index)
                          }
                        />
                      ) : item.field_type === 'Double' ? (
                        <InputNumber
                          min={0}
                          step={0.01}
                          value={Number(item.value)}
                          onChange={(num) => changeValue(num, item, index)}
                        />
                      ) : item.field_type === 'Integer' ? (
                        <InputNumber
                          min={0}
                          value={Number(item.value)}
                          onChange={(num) => changeValue(num, item, index)}
                        />
                      ) : null}
                    </div>
                  </List.Item>
                )}
              />
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default Configuration;
