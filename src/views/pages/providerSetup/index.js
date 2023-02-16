import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import ServicePoints from './servicePoints/components';
import Facilities from './facility/components';
import ProviderProfile from './providerProfile/components';
import DoctorProfile from './doctorProfile/components';
import { useHistory } from 'react-router-dom';
import '../administration/settings/assets/style.css';

const tabList = [
  {
    key: 'providerProfile',
    tab: 'Provider Profile',
  },
  {
    key: 'facilities',
    tab: 'Facilities',
  },
  {
    key: 'servicePoints',
    tab: 'Service Points',
  },
  {
    key: 'doctorProfile',
    tab: 'Doctor Profile',
  },
];

const contentList = {
  providerProfile: <ProviderProfile />,
  doctorProfile: <DoctorProfile />,
  facilities: <Facilities />,
  servicePoints: <ServicePoints />,
};

const ProviderSetup = (props) => {
  const location = props.location.state;

  const [currentKey, setCurrentKey] = useState(
    location?.isFromFacilityForm
      ? 'facilities'
      : location?.isFromServicePointForm
      ? 'servicePoints'
      : location?.isFromDoctorForm
      ? 'doctorProfile'
      : 'providerProfile'
  );
  const history = useHistory();

  const onTabChange = (e) => {
    setCurrentKey(e);
  };
  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  return (
    <div>
      <Card
        title='Provider Setup'
        type='inner'
        tabList={tabList}
        defaultActiveTabKey={currentKey}
        tabBarExtraContent={
          (currentKey === 'doctorProfile' && (
            <Button
              size='small'
              type='primary'
              onClick={() => {
                history.push({
                  pathname: '/provider-setup/edit-doctor',
                  state: { isAddNew: true },
                });
              }}
            >
              New Doctor
            </Button>
          )) ||
          (currentKey === 'facilities' && (
            <Button
              size='small'
              type='primary'
              onClick={() => {
                history.push({
                  pathname: '/provider-setup/facilities/edit-facility',
                  state: { isAddNew: true },
                });
              }}
            >
              New Facility
            </Button>
          )) ||
          (currentKey === 'servicePoints' && (
            <Button
              size='small'
              type='primary'
              onClick={() => {
                history.push({
                  pathname: '/provider-setup/edit-service-points',
                  state: { isAddNew: true },
                });
              }}
            >
              New Service Point
            </Button>
          ))
        }
        activeTabKey={currentKey}
        onTabChange={(key) => {
          onTabChange(key);
        }}
      >
        {contentList[currentKey]}
      </Card>
    </div>
  );
};

export default ProviderSetup;
