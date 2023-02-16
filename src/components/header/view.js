import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Dropdown, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import * as LocalStorage from '../../util/localstorage';
import styles from './header.module.css';
// import HeaderSearch from '../HeaderSearch';
import LanguageSelector from '../i18n/LanguageSelector';
import {
  PoweroffOutlined,
  UserOutlined,
  DownOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import WindowDimensions from 'constants/DeviceSize';

const Header = ({ collapsed, setCollapsed }) => {
  const history = useHistory();
  const { height, width } = WindowDimensions();

  useEffect(() => {
    if (width && width <= 990) {
      setCollapsed(true);
    } else if (width && width > 990) {
      setCollapsed(false);
    }
  }, [width, height]);

  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <Link to='/my-profile'>
          <UserOutlined />
          &nbsp;Account & Profile
        </Link>
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item key='2'>
        <a
          onClick={() => {
            localStorage.removeItem('naks_current_user');
            localStorage.removeItem('naks_token');
            localStorage.removeItem('current_active_key_provider_api');

            history.push('/');
            window.location.reload();
          }}
        >
          <PoweroffOutlined />
          &nbsp;Sign Out
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles['header-wrapper']}>
      <span
        className={styles['header-collapsed']}
        onClick={() => setCollapsed(!collapsed)}
      >
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: 'trigger',
            onClick: setCollapsed,
          }
        )}
      </span>

      <span
        style={{
          marginLeft: '40px',
          cursor: 'default',
          fontWeight: 'bold',
          color: 'white',
          fontSize: '14.5px',
          padding: '3px',
          boxShadow: '10px 10px 7px -8px rgba(0,0,0,0.34) inset',
        }}
      >
        {/* {JSON.parse(localStorage.getItem('facility_name'))} */}
      </span>

      <div className={styles['header-user-info']}>
        {/* <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder='search'
          dataSource={[]}
          onSearch={(value) => {
            console.log('input', value);
          }}
        /> */}
        {width > 500 && <LanguageSelector />}
        <Dropdown overlay={menu} placement='bottomRight'>
          {width > 500 ? (
            <span className={styles['header-dropdown-link']}>
              <UserOutlined /> {LocalStorage.get('naks_current_user')}
            </span>
          ) : (
            <Button
              style={{
                margin: '-6px',
                borderColor: 'white',
                paddingTop: '0',
                // color:"orange",
                backgroundColor: 'white',
              }}
              // type="primary"
              shape='circle'
            >
              <PoweroffOutlined />
            </Button>
          )}
        </Dropdown>
      </div>
    </div>
  );
};
export default Header;
