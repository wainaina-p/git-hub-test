import React, {useState} from 'react';
// import UsersList from './Users/viewUsers';
import Users from './Users/components';
import RolesandPermissions from './RolesandPermissions/RolesandPermissions';
import { Button, Card, Tabs } from 'antd';
import { useHistory } from 'react-router-dom';


const { TabPane } = Tabs;


const UserManagement = (props) => {
  const location = props.location.state;
  const [currentKey, setCurrentKey] = useState( 
     location?.isRolesForm
    ? 'Roles & Permissions'
    : "Users"
)
  const history = useHistory();
  return (
    <>
      <Card>
        <Tabs  defaultActiveKey={currentKey} 
            tabBarExtraContent={
              (currentKey === 'Users' && (
                <Button
                  size='small'
                  type='primary'
                  onClick={() => {
                    history.push({
                      pathname: '/user-management/user/edit-user',
                      state: { isAddNew: true },
                    });
                  }}
                >
                  New User
                </Button>
              )) ||
              (currentKey === 'Roles & Permissions' && (
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
                  New Role
                </Button>
              )) 
            }>
          <TabPane key={1} tab='Users'>
            <Users />
          </TabPane>

          <TabPane key={2} tab='Roles & Permissions'>
            <RolesandPermissions />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};

export default UserManagement;
