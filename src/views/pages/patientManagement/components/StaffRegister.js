import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { staffsRegisterColumns } from './columns';
import {
  Table,
  Card,
  Row,
  Col,
  Input,
  Button,
  Tag,
  Modal,
  message,
  Dropdown,
  Menu,
} from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { staffsService } from '_services';
import { debounce } from 'lodash';
import windowsDimension from 'constants/DeviceSize';
import { dummyData } from './DummyData';
import { MdOutlineFingerprint } from 'react-icons/md';
import {
  AiOutlineDown,
  AiOutlineMenuUnfold,
  AiOutlineEdit,
} from 'react-icons/ai';
import * as fingerprintpatientverification from './fingerprint/fingerprintpatientverification';
import axios from 'axios';

const StaffRegister = (props) => {
  const [staffs, setStaffs] = useState([]);
  const prefix = <SearchOutlined />;
  const history = useHistory();
  const { width } = windowsDimension();
  const start_page = { pageNo: 0, pageSize: 10 };
  const [total_elements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [currentKey, setCurrentKey] = useState(null);
  const [page, setPage] = useState(start_page);
  const [searchParams, setSearchParams] = useState(null);

  // useEffect(() => {
  //   axios.defaults.headers.common['Authorization'] =
  //     'Bearer ' + JSON.parse(localStorage.getItem('naks_token'));
  //   axios
  //     .get('http://localhost:8080/api/person')
  //     .then((response) => {
  //       console.log('Response:\n', response);
  //     })
  //     .catch((error) => console.log('Error:\n', error));
  // }, []);

  const { confirm } = Modal;
  const columns = [
    ...staffsRegisterColumns,

    {
      title: '',
      dataIndex: '',
      key: 'action',
      render: (text, record) => (
        <Dropdown
          overlay={
            <Menu onClick={(e) => handleMenuClick(record, e)}>
              <Menu.Item key='edit_staff_details'>
                <AiOutlineEdit
                  style={{ color: '#e34c8c', marginRight: '5px' }}
                />
                Edit Details
              </Menu.Item>
              <Menu.Item key='staff_details'>
                <AiOutlineMenuUnfold
                  style={{ color: '#06cbff', marginRight: '5px' }}
                />
                Staff Details
              </Menu.Item>

              <Menu.Item key='register_staff_fingerprint'>
                <MdOutlineFingerprint
                  style={{ color: '#52c990', marginRight: '5px' }}
                />
                Register Fingerprint
              </Menu.Item>
            </Menu>
          }
        >
          <Button size='small' color='blue'>
            Action <AiOutlineDown />
          </Button>
        </Dropdown>
      ),
    },
  ];

  // const handleSearchQueryTerm = (queryTerm) => {
  //   if (queryTerm !== '' && queryTerm !== 'BIOMETRIC_SEARCH') {
  //     this.setState({ loading: true });
  //     PatientAction.filterPatients({ term: queryTerm }).then((response) => {
  //       this.setState({ patientList: response.data.content, loading: false });
  //       // console.log('Patient data:\n\n', response.data.content)
  //     });
  //   } else if (queryTerm === 'BIOMETRIC_SEARCH') {
  //     try {
  //       fingerprintpatientverification.onStart(
  //         new fingerprintpatientverification.veririficationFingerprintSdk(),
  //         this.searchPersonFP
  //       );
  //     } catch (error) {}
  //   } else {
  //     if (this.state.currentKey !== 4) {
  //       try {
  //         fingerprintpatientverification.onStart(
  //           new fingerprintpatientverification.veririficationFingerprintSdk(),
  //           this.searchPersonFP
  //         );
  //       } catch (error) {
  //         // console.log(error);
  //       }
  //     }
  //   }
  // };

  const handleMenuClick = (record, e) => {
    if (e.key === 'edit_staff_details') {
      setCurrentKey('edit_staff_details');
      history.push({
        pathname: '/staff-management/new-staff',
        state: { staffRowData: record },
      });
    } else if (e.key === 'staff_details') {
      setCurrentKey('staff_details');
      //ToDo: Move to show/edit details
      history.push({
        pathname: '/staff-management/new-staff',
        state: { staffRowData: { ...record } },
      });
    } else if (e.key === 'register_staff_fingerprint') {
      setCurrentKey('register_staff_fingerprint');
      localStorage.setItem('current_staff_fingerprint_reg', record.id);

      // fingerprintpatientverification.onStart(
      //   new fingerprintpatientverification.veririficationFingerprintSdk(),
      //   'STOPPED'
      // );

      props.history.push({
        pathname: '/capture-staff-fp',
        state: {
          record,
        },
      });
    } else {
      setCurrentKey(null);
    }
  };

  useEffect(() => {
    getStaffs(searchParams?.id);
  }, [searchParams]);

  const getStaffs = useCallback((params) => {
    setLoading(true);
    staffsService
      .fetchStaff(params)
      .then((resp) => {
        console.log('Reponse:\n', resp);
        let data = resp.data;

        if (resp.data?.body) {
          if (Array.isArray(data?.body)) {
            setStaffs(data?.body || []);
            setTotalElements(
              data.page_details ? data.page_details.total_elements : 10
            );
          } else {
            let arr = [data?.body];
            setStaffs(arr);
          }
        } else {
          setStaffs([]);
        }

        setLoading(false);
      })
      .catch((e) => {
        setStaffs(dummyData);
        setLoading(false);
      });

    // //For dummy data ONLY

    // setStaffs(dummyData);
    // setLoading(false);
  }, []);

  const handleTableChange = debounce((value) => {
    let current_page = { pageNo: value?.current - 1, pageSize: 10 };

    let params = {
      ...searchParams,
      ...current_page,
    };

    // setSearchParams({ ...searchParams, ...params });
    setPage(current_page);
  }, 700);

  const handleSearch = debounce((val) => {
    console.log('handle search:\t', val);
    if (val !== '' && val !== 'BIOMETRIC_SEARCH') {
      console.log('Normal search');
      // setSearchParams({ ...searchParams, ...start_page, term: val });
    } else {
      console.log('handleSearch:\n', val);
      try {
        fingerprintpatientverification.onStart(
          new fingerprintpatientverification.veririficationFingerprintSdk(),
          searchPersonFP
        );
      } catch (error) {}
    }
    setPage(start_page);
  }, 700);

  const searchPersonFP = (param) => {
    console.log('Params:\t', param);
    setSearchParams({ id: param });
  };

  const handleSearchByStaffNo = debounce((val) => {
    if (val) {
      // setSearchParams({ ...searchParams, ...start_page, patientNumber: val });
    } else {
      // setSearchParams({ ...searchParams, ...start_page, patientNumber: null });
    }
    setPage(start_page);
  }, 700);

  const handleSearchByNationalId = (val) => {
    if (val) {
      // setSearchParams({ ...searchParams, nationalID: val });
    } else {
      // setSearchParams({ ...searchParams, nationalID: null });
    }
    setPage(start_page);
  };

  return (
    <div id='content'>
      <Card
        type='inner'
        size='small'
        title='Staff Register'
        extra={
          <Button
            size='small'
            type='primary'
            icon={<UserAddOutlined />}
            onClick={() => history.push('/staff-management/new-staff')}
          >
            New Staff
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col lg={5} md={5} sm={24} xs={24}>
            <Input
              size='small'
              prefix={prefix}
              placeholder='Search '
              allowClear={true}
              addonAfter={
                <div
                  style={{ cursor: 'pointer', height: '100%', width: '100%' }}
                  onClick={() => handleSearch('BIOMETRIC_SEARCH')}
                >
                  <MdOutlineFingerprint />
                </div>
              }
              onChange={(e) => handleSearch(e?.target?.value || null)}
            />
          </Col>

          <Col lg={5} md={5} sm={24} xs={24}>
            <Input
              size='small'
              prefix={prefix}
              placeholder='Staff no '
              allowClear={true}
              onChange={(e) => handleSearchByStaffNo(e?.target?.value || null)}
            />
          </Col>

          <Col lg={5} md={5} sm={24} xs={24}>
            <Input
              size='small'
              prefix={prefix}
              placeholder='National Id'
              allowClear={true}
              onChange={(e) =>
                handleSearchByNationalId(e?.target?.value || null)
              }
            />
          </Col>
        </Row>

        <Row className='mt-2'>
          <Col span={24}>
            <Table
              columns={columns}
              size={'small'}
              dataSource={staffs}
              scroll={{ x: 800 }}
              loading={isLoading}
              pagination={{
                current: page.pageNo + 1,
                pageSize: 10,
                total: total_elements,
              }}
              onChange={handleTableChange}
              rowKey={(record) => record.id}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default StaffRegister;
