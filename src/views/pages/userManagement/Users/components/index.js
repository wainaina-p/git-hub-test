import React, { useEffect, useState } from 'react';

import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import windowsDimension from 'constants/DeviceSize';
import { Row, Col, Table, Tag, Popconfirm, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { userService } from '_services';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { UsersColumns } from './colums';

const Users = (props) => {
  const [users, setUsers] = useState([]);
  const defaultPage = { page: 0, size: 10 };
  const [page, setPage] = useState(defaultPage);
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,

  });
  const [total_elements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const { width } = windowsDimension();
  const history = useHistory();

  const columns = [
    ...UsersColumns,

    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: '8%',
      render: (text, record) => (
        <>
          <Row gutter={[7, 10]} className='d-flex'>
            <Col span={8}>
              <EyeOutlined
                className='action-icon'
                style={{ color: '#66c938', opacity: '0.85' }}
                onClick={() => {
                  history.push({
                    pathname: '/provider-setup/facilities/view-facility',
                    state: { facilityRowData: record },
                  });
                }}
              />
            </Col>
            <Col span={8}>
              <EditOutlined
                onClick={() => {
                  history.push({
                    pathname: '/provider-setup/facilities/edit-facility',
                    state: { facilityInfo: record },
                  });
                }}
                style={{ cursor: 'pointer', color: '#1089ff', opacity: '0.85' }}
              />
            </Col>
        
          </Row>
        </>
      ),
      fixed: width < 1000 && 'right',
    },
  ];

  useEffect(() => {
    getUsers(searchParams);
  }, [searchParams]);

  const getUsers = (params) => {
    setLoading(true);
    userService
      .fetchUsers(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setUsers(content);
        setTotalElements(resp.data.page_details?.total_elements || 0);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const handleTableChange = (data) => {
    let current_page = {
      page: Number(data?.current - 1),
      size: data?.size,
    };
    setSearchParams({ ...searchParams, ...current_page });
    setPage(current_page);
  };

  return (
    <div>
      <Row className='mt-2'>
        <Col span={24}>
          <PerfectScrollbar style={{ height: '60vh' }}>
            <Table
              size={'small'}
              onChange={handleTableChange}
              columns={columns}
              dataSource={users}
              loading={isLoading}
              rowKey={(record) => Math.random()}
              scroll={{ x: width < 1000 && 900 }}
              pagination={{
                size: page.size,
                current: page?.page + 1,
                total: total_elements,
              }}
            />
          </PerfectScrollbar>
        </Col>
      </Row>
    </div>
  );
};
export default Users;
