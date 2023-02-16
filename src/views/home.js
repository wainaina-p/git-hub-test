import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeAppTheme } from '../components/i18n/actions';
import { view as Header } from '../components/header';
import { view as Sidebar } from '../components/sidebar';
import { routes } from '../routes';
import NotFound from './404';
import styles from './home.module.css';
import { Layout, Button, Space } from 'antd';
import ScrollBar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Row, Col } from 'antd';
import windowsDimension from 'constants/DeviceSize';
import version from '../../package.json';
import { LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';

const HomePage = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const { width } = windowsDimension();

  const sidebarWidth = () => {
    let sideWidth;
    if (!collapsed) {
      sideWidth = 256;
    } else {
      sideWidth = width < 800 ? 35 : 80;
    }
    return sideWidth;
  };

  // const sidebarWidth = collapsed ? 35 : 256;
  const sidebarStyle = {
    flex: '0 0 ' + sidebarWidth() + 'px',
    width: sidebarWidth() + 'px',
  };
  const onThemeChange = (theme) => {
    props.changeTheme(theme);
  };
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='ant-layout ant-layout-has-sider'>
      <div
        style={sidebarStyle}
        className={`ant-layout-sider ant-layout-sider-${props.theme}`}
      >
        <Sidebar
          collapsed={collapsed}
          onThemeChange={onThemeChange}
          theme={props.theme}
        />
      </div>
      <div className={`${styles['content-wrapper']} ant-layout`}>
        <div
          className={`${styles.header}`}
          style={{
            width: collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)',
          }}
        >
          <Header
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            locales={props.locales}
          />
        </div>
        <ScrollBar
          style={{ minHeight: '100vh', height: '100vh' }}
          options={{
            suppressScrollX: true,
          }}
        >
          <div style={{ minHeight: '93vh' }}>
            <div
              className={`${styles.content} ant-layout-content`}
              style={{ textDecoration: 'none !important' }}
            >
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={(props) => <route.component {...props} />}
                    />
                  ) : null;
                })}
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
          <div style={{ marginTop: '5px' }}>
            <Layout.Footer
              style={{
                textAlign: width > 800 ? '' : 'center',
                height: width > 800 ? '35px' : '80px',
                backgroundColor: '#eaeef2',
                color: '#a6192e',
                lineHeight: '0px',
                padding: '15px',
                position: width > 800 ? 'fixed' : 'static',
                bottom: 0,
                width: '100%',
              }}
            >
              <Row gutter={[4, 24]}>
                {' '}
                <Col lg={8} md={8} sm={24} xs={24}>
                  <span>
                    &copy; {new Date().getFullYear()}&nbsp;
                    wawerusimes@gmail.com | All rights reserved.
                  </span>
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                  <span>Version {version?.version}</span>
                </Col>
              </Row>
            </Layout.Footer>
          </div>
        </ScrollBar>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  theme: state.theming.theme,
  locales: state.i18ning.locales,
});
const mapDispachToProps = (dispatch, props) => ({
  changeTheme: (theme) => {
    dispatch(changeAppTheme(theme));
  },
});
export default connect(mapStateToProps, mapDispachToProps)(HomePage);
