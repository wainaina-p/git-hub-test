import React, { useEffect, useState } from 'react';

import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import windowsDimension from 'constants/DeviceSize';
import { Row, Col, Table, Tag, Popconfirm, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { facilityService } from '_services';
import { facilitiesColumns } from './columns';
import PerfectScrollbar from 'react-perfect-scrollbar';

const Facilities = (props) => {
  const [facilities, setFacilities] = useState([]);
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [page, setPage] = useState(defaultPage);
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
    showFacilityServices: true,
    showFacilityInsurances: true,
  });
  const [total_elements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const { width } = windowsDimension();
  const history = useHistory();
  const [isFacilityId, setIsFacilityId] = useState();

  const columns = [
    ...facilitiesColumns,

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
            <Col span={8}>
              <Popconfirm
                placement='topRight'
                title='Are you sure to delete this facility?'
                onConfirm={confirm}
                onCancel={cancel}
                okText='Yes'
                cancelText='No'
                okButtonProps={{
                  loading: isLoading,
                }}
              >
                <DeleteOutlined
                  onClick={() => {
                    setIsFacilityId(record.id);
                  }}
                  style={{
                    // cursor: "pointer",
                    color: '#f70505',
                    opacity: '0.85',
                  }}
                />
              </Popconfirm>
            </Col>
          </Row>
        </>
      ),
      fixed: width < 1000 && 'right',
    },
  ];

  function cancel() {}
  function confirm() {
    setLoading(true);
    facilityService
      .deleteProvider(isFacilityId)
      .then((resp) => {
        if (resp.status === 202) {
          message.success('Facility deleted successifully');
          getFacilities(searchParams);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log('Error Deleting \n', e);
        setLoading(false);
      });
  }

  useEffect(() => {
    getFacilities(searchParams);
  }, [searchParams]);

  const getFacilities = (params) => {
    setLoading(true);
    facilityService
      .fetchAllFacilities(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setFacilities(content);
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
      pageNo: Number(data?.current - 1),
      pageSize: data?.pageSize,
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
              dataSource={facilities}
              loading={isLoading}
              rowKey={(record) => Math.random()}
              scroll={{ x: width < 1000 && 900 }}
              pagination={{
                pageSize: page.pageSize,
                current: page?.pageNo + 1,
                total: total_elements,
              }}
            />
          </PerfectScrollbar>
        </Col>
      </Row>
    </div>
  );
};
export default Facilities;
