import React, { useEffect, useState } from 'react';
import data from './navigation-data.json';
import { Link } from 'react-router-dom';
import { Menu, Switch } from 'antd';
import styles from './sidebar.module.css';
import ScrollBar from '../ScrollBar';
import { Trans } from '@lingui/macro';
import * as AntdIcons from '@ant-design/icons';
import nakuruLogo from '../../assets/images/nakuru_county_mini_mini_logo.png';

const { SubMenu } = Menu;
const active_key = localStorage.getItem('current_active_key_provider_api');

const Sidebar = ({ collapsed, onThemeChange, theme }) => {
  const [current, setCurrent] = useState('Dashboard');
  const [newData, setNewData] = useState([]);

  useEffect(() => {
    setNewData(data);
  }, []);

  useEffect(() => {
    if (active_key) {
      setCurrent(active_key);
    }
  }, [active_key]);

  // A function to get service points
  const getServicePoints = () => {};

  const CustomIcon = (type) => {
    const AntdIcon = AntdIcons[type]; // not AntdIcons[iconDetails.render] as @Cea mention;
    return <AntdIcon />;
  };

  const handleMenuChange = (e) => {
    if (e) {
      setCurrent(e.key);
      localStorage.removeItem('current_active_key_provider_api');
      localStorage.setItem('current_active_key_provider_api', e.key);
    }
  };

  return (
    <div>
      <div className={styles.logo}>
        <a href='/'>
          {collapsed ? (
            <div
              type='flex'
              justify='center'
              align='left'
              style={{
                color: 'white',
                fontWeight: 'bold',
                padding: 0,
                margin: 0,
              }}
            >
              <img src={nakuruLogo} />
            </div>
          ) : theme === 'dark' ? (
            <div
              type='flex'
              justify='center'
              align='left'
              style={{
                color: 'white',
                fontWeight: 'bold',
                padding: 0,
                margin: 0,
              }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                <img src={nakuruLogo} />
                Nakuru Staffs
              </span>
            </div>
          ) : (
            <div
              type='flex'
              justify='center'
              align='left'
              style={{
                color: 'white',
                fontWeight: 'bold',
                padding: 0,
                margin: 0,
              }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                {/* Biometric Registration */}
                <img src={nakuruLogo} />
                Nakuru Staffs
              </span>
            </div>
          )}
        </a>
      </div>
      <ScrollBar
        style={{ height: '94vh' }}
        options={{
          suppressScrollX: true,
        }}
      >
        <Menu
          theme={theme}
          onClick={(e) => handleMenuChange(e)}
          style={{
            padding: '0px 0',
            width: '100%',
            marginTop: '50px',
          }}
          defaultOpenKeys={['overview', 'sub-res', 'sub-other']}
          selectedKeys={[current]}
          mode='inline'
          inlineCollapsed={collapsed}
        >
          {newData.map((item) => {
            if (item.children instanceof Array) {
              return (
                <SubMenu
                  key={item.key}
                  title={
                    <span>
                      {CustomIcon(item.icon)}
                      <span>
                        {/* <Trans>{item.label}</Trans> */}
                        {item.label}
                      </span>
                    </span>
                  }
                >
                  {item.children.map((subItem) => (
                    <Menu.Item key={subItem.key}>
                      <Link to={subItem.url}>
                        {/* <Trans>{subItem.label}</Trans> */}
                        {subItem.label}
                      </Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            } else {
              return (
                <Menu.Item key={item.key}>
                  <Link to={item.url}>
                    {CustomIcon(item.icon)}
                    <span>
                      {/* <Trans>{item.label}</Trans> */}
                      {item.label}
                    </span>
                  </Link>
                </Menu.Item>
              );
            }
          })}
        </Menu>
      </ScrollBar>
      {collapsed ? null : (
        <div
          className={`${styles.switchTheme} d-flex justify-content-start`}
          style={{ marginTop: '10px' }}
        >
          <Switch
            onChange={onThemeChange.bind(
              this,
              theme === 'dark' ? 'light' : 'dark'
            )}
            defaultChecked={theme === 'dark'}
            checkedChildren={`Dark`}
            unCheckedChildren={`Light`}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
