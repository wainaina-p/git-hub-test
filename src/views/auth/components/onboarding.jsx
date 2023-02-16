import React from 'react';
import { Tabs } from 'antd';
import {
  faUserFriends,
  faHospitalAlt,
  faHospitalSymbol,
  faUmbrella,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProviderProfile from './providerOnboard';
import InsuranceOnboarding from './insuranceOnboarding';
import AKIOnboarding from './AKIOnboard';
import './onboardingStyle.css';
import background from 'assets/images/background.png';
import smartlogo from 'assets/images/smart_logo.png';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;

const Onboarding = () => {
  return (
    <div className=' card-container'>
      <Tabs
        className='container-fluid'
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100vw 33vh',
        }}
        defaultActiveKey='aki_onboarding'
      >
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 3,
            backgroundColor: 'rgba(255, 255, 255, .5)',
            borderRadius: '0px 0px 0px 4px',
            cursor: 'pointer',
          }}
        >
          <a href='https://smartapplicationsgroup.com/' target={'_blank'}>
            <img src={smartlogo} alt='Smart Logo' height='30' width='100' />
          </a>
        </div>
        <TabPane
          className='container'
          key={'aki_onboarding'}
          tab={
            <>
              <FontAwesomeIcon
                icon={faUmbrella}
                className='font-icon aki-icon'
              />{' '}
              <span className='tabpane-title'>AKI&nbsp;Onboarding</span>
            </>
          }
        >
          <AKIOnboarding
            style={{ minHeight: '', boxShadow: '10px 5px 5px red' }}
          />
        </TabPane>
        <TabPane
          className='container'
          key={'insurance_onboarding'}
          tab={
            <>
              <FontAwesomeIcon
                icon={faHospitalAlt}
                className='font-icon insurance-icon'
              />{' '}
              <span className='tabpane-title'>Insurance&nbsp;Onboarding</span>
            </>
          }
        >
          <InsuranceOnboarding />
        </TabPane>
        <TabPane
          className='container'
          key={'provider_onboarding'}
          tab={
            <>
              <FontAwesomeIcon
                icon={faHospitalSymbol}
                className='font-icon provider-icon'
              />{' '}
              <span className='tabpane-title'>Provider&nbsp;Onboarding</span>
            </>
          }
        >
          <ProviderProfile />
        </TabPane>

        {/* <TabPane
          className='container'
          key={'member_onboarding'}
          tab={
            <>
              <FontAwesomeIcon
                icon={faUserFriends}
                className='font-icon member-icon'
              />{' '}
              <span className='tabpane-title'>Member&nbsp;Onboarding</span>
            </>
          }
        ></TabPane> */}
      </Tabs>
    </div>
  );
};

export default Onboarding;
