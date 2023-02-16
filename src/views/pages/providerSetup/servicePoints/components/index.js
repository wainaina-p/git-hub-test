import React, { useEffect, useState } from 'react';
import { servicePointsService } from '_services';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import windowsDimension from 'constants/DeviceSize';
import { useHistory } from 'react-router-dom';
import { Row, Col, Table, Tag, Popconfirm, message, Select } from 'antd';
import { servicePointColumns } from './columns';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { facilityService } from '_services';

const ServicePoints = () => {
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [page, setPage] = useState(defaultPage);
  const [searchParams, setSearchParams] = useState({ ...defaultPage });
  const [total_elements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [servicepoints, setServicePoints] = useState([]);
  const { width } = windowsDimension();
  const history = useHistory();
  const [isServicePointId, setIsServicePointId] = useState();
  const [facilities, setFacilities] = useState([]);
  const { Option } = Select;

  const columns = [
    ...servicePointColumns,
    {
      title: 'Facility Name',
      dataIndex: 'facility_id',
      key: 'facility_id',
      width: '15%',
      render: (text, row) => (
        <>
          {facilities
            .filter(function (facility) {
              return facility.id === parseInt(row.facility_id);
            })
            .map(function (facility) {
              return facility.facility_name;
            }) || ''}
        </>
      ),
    },

    {
      title: '    ',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <>
          <Tag
            color='purple'
            style={{
              cursor: 'pointer',
              boxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
              WebkitBoxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
              MozBoxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
            }}
            onClick={() => {
              history.push({
                pathname: '/provider-setup/edit-service-points',
                state: { servicePointInfo: record },
              });
            }}
          >
            <EditOutlined style={{ cursor: 'pointer' }} />
          </Tag>

          <Tag
            color='error'
            style={{
              cursor: 'pointer',
              boxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
              WebkitBoxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
              MozBoxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
            }}
          >
            <Popconfirm
              placement='topRight'
              title='Are you sure to delete this service?'
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
                  setIsServicePointId(record.id);
                }}
                style={{ cursor: 'pointer' }}
              />
            </Popconfirm>
          </Tag>
        </>
      ),
      fixed: width < 1000 && 'right',
    },
  ];

  function cancel(e) {}
  function confirm(e) {
    setLoading(true);
    servicePointsService
      .deleteServicePoints(isServicePointId)
      .then((resp) => {
        if (resp.status === 202) {
          message.success('Service point deleted successfully');
          getServicePoints(searchParams);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log('Error deleting \n', e);
        setLoading(false);
      });
  }

  useEffect(() => {
    getFacilities(searchParams);
  }, []);

  const getFacilities = (params) => {
    setLoading(true);
    facilityService
      .fetchAllFacilities(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setFacilities(content);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const handleSearchByFacilityId = (value) => {
    let params;
    if (value) {
      params = {
        facilityId: value,
        ...defaultPage,
      };
    } else {
      params = {
        facilityId: null,
      };
    }
    setSearchParams(params);
    setPage(defaultPage);
  };

  useEffect(() => {
    getServicePoints(searchParams);
  }, [searchParams]);

  const getServicePoints = (params) => {
    setLoading(true);
    servicePointsService
      .fetchServicePoints(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setServicePoints(content);
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
      <Row className='mb-1'>
        <Col lg={7} md={7} sm={12} xs={24}>
          <Select
            size='small'
            showSearch
            allowClear
            placeholder='Search facility'
            onChange={handleSearchByFacilityId}
            style={{ width: '100%' }}
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option
              value={''}
              key={'empty'}
              style={{ color: 'rgba(0,0,0,0.35)' }}
            >
              - Select facility -
            </Option>
            {facilities &&
              facilities.map((facility, index) => (
                <Option key={index} value={facility.id}>
                  {facility.facility_name}
                </Option>
              ))}
          </Select>
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col span={24}>
          <PerfectScrollbar style={{ height: '60vh' }}>
            <Table
              size={'small'}
              onChange={handleTableChange}
              columns={columns}
              dataSource={servicepoints}
              rowKey={(record) => Math.random()}
              loading={isLoading}
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

export default ServicePoints;
