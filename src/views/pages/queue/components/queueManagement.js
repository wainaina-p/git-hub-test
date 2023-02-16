import React, { useState, useEffect } from 'react';
import {
  Card,
  Col,
  Row,
  Collapse,
  Menu,
  Dropdown,
  Button,
  Modal,
  Tabs,
  Tag,
  Input,
  Popover,
  Table,
  message,
  Select,
  DatePicker,
} from 'antd';
import {
  ArrowLeftOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import { servicePointColumns, servicePointPreArrivalColumns } from './columns';
import '../css/index.css';
import {
  faClipboardCheck,
  faForward,
  faClose,
  faUserClock,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/index.css';
import QueueManagementSkeleton from './queueManagementSkeleton';
import WindowDimensions from 'constants/DeviceSize';
import Timer from 'constants/timer';
import moment from 'moment';
import SendToAnotherServicePoint from './sendToServicePoint';
import { useHistory } from 'react-router-dom';
import { patientsQueueService } from '_services';

const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const dateFormat = 'YYYY-MM-DD';

const QueuePoint = (props) => {
  const history = useHistory();
  let timeData = [];
  timeData = JSON.parse(localStorage.getItem('TAT_SC'))
    ? JSON.parse(localStorage.getItem('TAT_SC'))
    : [];

  const [initialState, setInitialState] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [defaultKey, setDefaultKey] = useState('1_patient_list');
  const { height, width } = WindowDimensions();
  const [currentTab, setCurrentTab] = useState('1_inqueue');
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [startTimer, setStartTimer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [servicePointFrom, setServicePointFrom] = useState(null);
  const [ticketNo, setTicketNo] = useState(null);
  const defaultPage = { pageNo: 0, pageSize: 9 };
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
    status: 'Active',
  });
  const [currentPatient, setCurrentPatient] = useState(null);
  let locationData = props.location.state;

  useEffect(() => {
    // localStorage.removeItem('TAT_SC');
    console.log('timeData:\n', timeData);
    console.log('location data:\n', locationData);
    if (currentTab === '1_inqueue') {
      setSelectedStatus('Active');
      setSearchParams({ ...searchParams, status: 'Active', dateRange: null });
    } else if (currentTab === '2_prearrival') {
      setSearchParams({
        ...searchParams,
        status: 'Pre_Arrival',
        dateRange: null,
      });
    } else if (currentTab === 'served_patients') {
      setSearchParams({ ...searchParams, status: 'CheckedOut' });
    } else if (currentTab === 'scheduled_appointments') {
      setSearchParams({ ...searchParams, status: null, dateRange: null });
    }
  }, [currentTab]);

  useEffect(() => {
    if (width && width <= 990) {
      setDefaultKey([]);
    } else if (width && width > 990) {
      setDefaultKey('1_patient_list');
    }
  }, [width, height]);

  useEffect(() => {
    if (locationData) {
      setInitialState(locationData);
      setSearchParams({ ...searchParams, servicePointId: locationData?.id });
    }
  }, [locationData]);

  useEffect(() => {
    if (locationData && searchParams?.servicePointId !== null) {
      fetchStaffOnQueue({
        ...searchParams,
        servicePointId: locationData?.id,
      });
    }
  }, [searchParams, locationData]);

  const contentFromSendToButton = (
    <div>
      <SendToAnotherServicePoint
        dataSource={dataSource}
        isFromSendToButton={false}
      />
    </div>
  );
  const content = (row) => (
    <div>
      <SendToAnotherServicePoint
        TicketNo={ticketNo}
        ServicePointFrom={servicePointFrom}
        isFromSendToButton={true}
        dataSource={row}
      />
    </div>
  );
  const fetchStaffOnQueue = (params) => {
    patientsQueueService
      .fetchAllPatientsInQueue(params)
      .then((resp) => {
        let data = resp.data?.content || [];
        if (data.length > 0) {
          if (currentTab === '1_inqueue') {
            let arr = data.sort((a, b) =>
              a.activation_time > b.activation_time ? 1 : -1
            );
            setDataSource(arr);
          } else {
            setDataSource(data);
          }
        } else {
          if (params.status === 'Active') {
            setSearchParams({ ...searchParams, status: 'CheckedIn' });
            setSelectedStatus('CheckedIn');
          } else if (params.status === 'Pre_Arrival') {
            setCurrentTab('1_inqueue');
          } else {
            setDataSource(data);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns =
    currentTab === '1_inqueue'
      ? [
          ...servicePointColumns,

          {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (text, row) => (
              <>
                <Dropdown overlay={menu(row)}>
                  <Button size='small'>
                    Action <DownOutlined />
                  </Button>
                </Dropdown>
              </>
            ),

            fixed: width < 700 && 'right',
            width: width < 700 && '13%',
          },
        ]
      : currentTab === 'served_patients'
      ? [
          ...servicePointPreArrivalColumns,
          // {
          //   title: '',
          //   dataIndex: 'action',
          //   key: 'action',
          //   render: (text, row) => (
          //     <>
          //       <Popover content={content} title='Transfer to' trigger='click'>
          //         <Tag
          //           color='purple'
          //           style={{
          //             cursor: 'pointer',
          //             boxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
          //             WebkitBoxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
          //             MozBoxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
          //           }}
          //         >
          //           <FontAwesomeIcon icon={faShare} /> Send To
          //         </Tag>
          //       </Popover>
          //     </>
          //   ),
          //   fixed: width < 700 && 'right',
          //   width: width < 700 && '13%',
          // },
        ]
      : [
          ...servicePointPreArrivalColumns,
          {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (text, row) => (
              <>
                {row && row?.status === 'Pre_Arrival' ? (
                  <Tag
                    color='#2db7f5'
                    style={{
                      cursor: 'pointer',
                      boxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
                      WebkitBoxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
                      MozBoxShadow: '2px 3px 5px -3px rgba(0,0,0,0.52)',
                    }}
                    onClick={() => handleOnAddQueue(row)}
                  >
                    <FontAwesomeIcon icon={faUserClock} /> Queue
                  </Tag>
                ) : null}
              </>
            ),
            fixed: width < 700 && 'right',
            width: width < 700 && '12.5%',
          },
        ];

  const handleMenuClick = (row, e) => {
    if (e) {
      if (e.key === '3_skip') {
        handleOnSkip(row);
      } else if (e.key === '1_checkin') {
        setStartTimer(true);
        handleCheckIn(row);
      } else if (e.key === '2_checkout') {
        setStartTimer(false);
        handleOnCheckout(row);
      } else if (e.key === '4_send_to') {
        setServicePointFrom(row?.service_point_to_id || null);
        setTicketNo(row?.ticket_no || null);
      }
    }
  };

  const handleCollapseChange = (e) => {
    if (e.length > 0) {
      setDefaultKey(e[0]);
    } else {
      setDefaultKey([]);
    }
  };

  const menu = (row) => {
    return (
      <Menu onClick={(e) => handleMenuClick(row, e)}>
        <Menu.Item
          disabled={row.status !== 'Active'}
          key='1_checkin'
          icon={
            <FontAwesomeIcon
              icon={faClipboardCheck}
              style={{
                color: row?.status !== 'Active' ? '#b7b7b7' : '#1089ff',
              }}
            />
          }
        >
          Check-In
        </Menu.Item>
        <Menu.Item
          key='2_checkout'
          disabled={
            row.status === 'Active' ||
            row.status === 'Pre_Arrival' ||
            row.status === 'CheckedOut'
          }
          icon={
            <FontAwesomeIcon
              icon={faClose}
              style={{
                color:
                  row.status === 'Active' ||
                  row.status === 'Pre_Arrival' ||
                  row.status === 'CheckedOut'
                    ? '#b7b7b7'
                    : '#cc1e38',
              }}
            />
          }
        >
          Checkout
        </Menu.Item>
        <Menu.Item
          disabled={row.status === 'CheckedIn' || row.status === 'Skipped'}
          key='3_skip'
          icon={
            <FontAwesomeIcon
              icon={faForward}
              style={{
                color:
                  row.status === 'CheckedIn' || row.status === 'Skipped'
                    ? '#b7b7b7'
                    : '#ff8b26',
              }}
            />
          }
        >
          Skip
        </Menu.Item>
        <Popover
          disabled={row && row.status === 'CheckedOut'}
          content={content(row)}
          title='Transfer to'
          trigger='click'
        >
          <Menu.Item
            key='4_send_to'
            disabled={row && row.status === 'CheckedOut'}
            icon={
              <FontAwesomeIcon
                icon={faShare}
                style={{
                  color: 'purple',
                }}
              />
            }
          >
            Send To
          </Menu.Item>
        </Popover>
      </Menu>
    );
  };

  const handleOnSkip = (row) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to skip this patient?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        // localStorage.removeItem('TAT_SC');
        // let newTimeDataList = timeData.filter(
        //   (item) => item.patient_no !== row.patient_no
        // );
        // localStorage.setItem('TAT_SC', JSON.stringify(newTimeDataList));
        setStartTimer(false);

        let data = {
          ticketNo: row?.ticket_no || null,
          servicePointToId: row?.service_point_to_id || null,
        };
        patientsQueueService
          .skipPatient(data.ticketNo, data.servicePointToId)
          .then((resp) => {
            if (resp.status === 201) {
              message.success('Patient skipped successfully');

              setCurrentPatient(resp.data?.content || null);
              fetchStaffOnQueue(searchParams);
            }
          })
          .catch((e) => {});
      },
      onCancel() {},
    });
  };

  const handleOnSkipButton = () => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to skip this patient?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        setStartTimer(false);

        let data = {
          ticket_no:
            currentPatient?.ticket_no || dataSource[0]?.ticket_no || null,
          service_point_to_id:
            currentPatient?.service_point_to_id ||
            dataSource[0]?.service_point_to_id ||
            null,
        };
        patientsQueueService
          .skipPatient(data.ticket_no, data.service_point_to_id)
          .then((resp) => {
            if (resp.status === 201) {
              message.success('Patient skipped successfully');
              setCurrentPatient(resp.data?.content || null);
              fetchStaffOnQueue(searchParams);
            }
          })
          .catch((e) => {
            setCurrentPatient(null);
          });
      },
      onCancel() {},
    });
  };

  const onTabClick = (e) => {
    setCurrentTab(e);
  };

  const handleCheckIn = (row) => {
    setStartTimer(!startTimer);
    let currentTime = moment().format('hh:mm:ss');

    let data = {
      ticketNo:
        row?.ticket_no ||
        currentPatient?.ticket_no ||
        dataSource[0]?.ticket_no ||
        null,
      servicePointId:
        row?.service_point_to_id ||
        currentPatient?.service_point_to_id ||
        dataSource[0]?.service_point_to_id ||
        null,
    };

    patientsQueueService
      .checkInpatient(data.ticketNo, data.servicePointId)
      .then((resp) => {
        if (resp.status === 201) {
          console.log('Check in response:\n', resp);

          message.success('Patient checked in successfully');
          setSearchParams({ ...searchParams, status: 'Active' });
          // fetchStaffOnQueue({ ...searchParams, status: 'Active' });
          let respData = resp.data?.content || null;
          setCurrentPatient(respData);
          console.log('timeData (Q.M):\n', timeData);
          let newTimeDataList = [];
          // let newTimeDataList = [];
          console.log('newTimeDataList (Q.M):\n', newTimeDataList);
          if (respData) {
            //Record time stamp
            let timerData = {
              currentTime: currentTime,
              patientNo: respData.patient_no,
            };
            timeData.push(timerData);
            // localStorage.removeItem('TAT_SC');
            // push(timerData); //Add the record of the newly checked in patient
          }
          newTimeDataList = timeData;
          localStorage.setItem('TAT_SC', JSON.stringify(newTimeDataList));
        }
      })
      .catch((e) => {
        setCurrentPatient(null);
      });
  };

  const handleOnAddQueue = (row) => {
    setStartTimer(!startTimer);
    let currentTime = moment().format('hh:mm:ss');
    let data = {
      ticketNo: row?.ticket_no || dataSource[0]?.ticket_no || null,
    };

    patientsQueueService
      .activatePreArrivalPatient(data.ticketNo)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('Patient added to queue successfully');
          setSearchParams({ ...searchParams, status: 'Pre_Arrival' });
        }
      })
      .catch((e) => {});
  };

  const handleOnCheckout = (row) => {
    setStartTimer(false);
    let data = {
      ticketNo: row?.ticket_no || null,
      servicePointId: row?.service_point_to_id || null,
    };
    patientsQueueService
      .checkOutpatient(data.ticketNo, data.servicePointId)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('Patient checked out successfully');
          fetchStaffOnQueue(searchParams);
          //Remove the checkouted patient from the time data list
          // localStorage.removeItem('TAT_SC');
          let newTimeDataList = timeData.filter(
            (item) => item.patient_no !== row.patient_no
          );
          localStorage.setItem('TAT_SC', JSON.stringify(newTimeDataList));
        }
      })
      .catch((e) => {});
  };

  const handleOnCheckoutButton = () => {
    setStartTimer(false);
    let data = {
      ticket_no: currentPatient
        ? currentPatient?.ticket_no
        : dataSource[0]?.ticket_no || null,
      service_point_to_id: currentPatient
        ? currentPatient?.service_point_to_id
        : dataSource[0]?.service_point_to_id || null,
    };
    patientsQueueService
      .checkOutpatient(data.ticket_no, data.service_point_to_id)
      .then((resp) => {
        if (resp.status === 201) {
          console.log('Checkouted Patient (resp):\n', resp);
          message.success('Patient checked out successfully');
          if (resp.data?.content.status !== 'CheckedOut') {
            setCurrentPatient(resp.data?.content || null);
            fetchStaffOnQueue(searchParams);
          } else {
            setCurrentPatient(null);
            fetchStaffOnQueue(searchParams);
          }
        }
      })
      .catch((e) => {
        setCurrentPatient(null);
      });

    //Remove time stamp
    // localStorage.removeItem('TAT_SC');
  };

  const handleOnCheckoutNext = () => {
    setStartTimer(false);
    let data = {
      ticketNo: currentPatient
        ? currentPatient?.ticket_no
        : dataSource[0]?.ticket_no || null,
      servicePointId: currentPatient
        ? currentPatient?.service_point_to_id
        : dataSource[0]?.service_point_to_id || null,
    };
    patientsQueueService
      .checkOutAndNext(data.ticketNo, data.servicePointId)
      .then((resp) => {
        let respData = resp?.data || null;
        let currentTime = moment().format('hh:mm:ss');
        if (resp.status === 201) {
          setCurrentPatient(resp.data?.content || null);
          fetchStaffOnQueue(searchParams);

          // localStorage.removeItem('TAT_SC');
          let newTimeDataList = timeData.filter((item) =>
            item.patient_no !== currentPatient
              ? currentPatient?.patient_no
              : dataSource[0]?.patient_no
          );

          if (respData) {
            let timerData = {
              currentTime: currentTime,
              patientNo: respData.patient_no,
            };
            newTimeDataList.push(timerData); //Add the record of the newly checked in patient
          }
          localStorage.setItem('TAT_SC', JSON.stringify(newTimeDataList));
        }
      })
      .catch((e) => {
        setCurrentPatient(null);
      });
  };

  const onOk = () => {
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
  };

  const handleOnNextButton = () => {
    setStartTimer(false);
    let params = {
      ticketNo: currentPatient?.ticket_no || dataSource[0]?.ticket_no || null,
      servicePointId:
        currentPatient?.service_point_to_id ||
        dataSource[0]?.service_point_to_id ||
        null,
    };
    patientsQueueService
      .nextPatient(params)
      .then((resp) => {
        if (resp.status === 201) {
          setCurrentPatient(resp.data?.content || null);
        }
      })
      .catch((e) => {
        setCurrentPatient(null);
      });
  };

  const sendToAnotherServicePoint = () => {
    let data = {
      service_point_to_id: 0,
      ticket_no: currentPatient?.ticket_no || dataSource[0]?.ticket_no || null,
      service_point_from_id:
        currentPatient?.service_point_to_id ||
        dataSource[0]?.service_point_to_id ||
        null,
    };
  };

  const search = (
    <Input prefix={<SearchOutlined />} size='small' placeholder='Search..' />
  );

  const onDateChange = (date, dateString) => {
    let dateRange = null;
    if (date.length > 0) {
      dateRange = dateString.join('..');
      setSearchParams({ ...searchParams, dateRange: dateRange });
    } else {
      dateRange = null;

      setSearchParams({ ...searchParams, dateRange: dateRange });
    }
  };

  return (
    <div>
      <Card
        type='inner'
        title={
          <>
            <span>
              <ArrowLeftOutlined
                style={{
                  marginTop: '0px',
                  marginRight: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
                onClick={() => props.history.push('/queue')}
              />
            </span>
            {initialState && initialState.name}
          </>
        }
      >
        <Row gutter={[8, 10]}>
          <Col lg={10} md={24} sm={24} xs={24}>
            <Card
              hoverable
              type='inner'
              title='Manage Queue'
              actions={[
                <Popover
                  content={contentFromSendToButton}
                  title='Transfer to'
                  trigger='click'
                  disabled={
                    currentPatient
                      ? currentPatient?.status === 'CheckedOut'
                      : dataSource.length > 0 &&
                        dataSource[0]?.status === 'CheckedOut'
                  }
                >
                  <Button
                    type='primary'
                    disabled={
                      currentPatient
                        ? currentPatient?.status === 'CheckedOut'
                        : dataSource.length > 0 &&
                          dataSource[0]?.status === 'CheckedOut'
                    }
                    style={{
                      backgroundColor: currentPatient
                        ? currentPatient?.status === 'CheckedOut'
                          ? '#f5f5f5'
                          : 'purple'
                        : dataSource.length > 0 &&
                          dataSource[0]?.status === 'CheckedOut'
                        ? '#f5f5f5'
                        : 'purple',
                    }}
                    onClick={() => {}}
                  >
                    Send To
                  </Button>
                </Popover>,
                <Button
                  type='primary'
                  onClick={() =>
                    history.push('/staff-management/appointments/create')
                  }
                >
                  {width < 460 ? `New Appt` : `New Appointment`}
                </Button>,
              ]}
            >
              {currentPatient || dataSource.length > 0 ? (
                <div>
                  <Col span={24}>
                    <Row>
                      <Col span={24} className='d-flex justify-content-center'>
                        <h6
                          style={{
                            fontWeight: 'bolder',
                          }}
                        >
                          {currentPatient
                            ? currentPatient?.patient_name
                            : dataSource[0]?.patient_name}
                        </h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className='d-flex justify-content-center'>
                        <p
                          style={{
                            fontSize: '11px',
                            fontWeight: 'light',
                            marginBottom: 0,
                            paddingBottom: 2,
                            opacity: '0.5',
                          }}
                        >
                          Ticket number
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className='d-flex justify-content-center'>
                        <span
                          style={{
                            fontSize:
                              (currentPatient
                                ? currentPatient?.ticket_no && '45px'
                                : dataSource[0]?.ticket_no && '45px') || '35px',
                            padding:
                              currentPatient?.ticket_no &&
                              currentPatient?.ticket_no <= 9
                                ? '0px 12px'
                                : (currentPatient?.ticket_no > 99 &&
                                    '6px 8px') ||
                                  (dataSource[0]?.ticket_no &&
                                    dataSource[0]?.ticket_no <= 9)
                                ? '0px 12px'
                                : (dataSource[0]?.ticket_no > 99 &&
                                    '6px 8px') ||
                                  '0px 20px',
                            // padding: '6px 8px',
                            color: 'white',
                            backgroundColor:
                              (currentPatient?.ticket_no && '#6ccd3c') ||
                              (dataSource[0]?.ticket_no && '#6ccd3c') ||
                              '#f22443',
                            borderRadius: '50%',
                          }}
                        >
                          {currentPatient
                            ? currentPatient?.ticket_no &&
                              currentPatient?.ticket_no <= 9
                              ? `0` + currentPatient?.ticket_no
                              : currentPatient?.ticket_no || `?`
                            : dataSource[0]?.ticket_no &&
                              dataSource[0]?.ticket_no <= 9
                            ? `0` + dataSource[0]?.ticket_no
                            : dataSource[0]?.ticket_no || `?`}
                        </span>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24} className='d-flex justify-content-center'>
                        <p
                          style={{
                            fontSize: '11px',
                            fontWeight: 'light',
                            marginBottom: 0,
                            paddingBottom: 2,
                            opacity: '0.63',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 'bold',
                              opacity: '0.9 !important',
                            }}
                          >
                            Visit No:
                          </span>
                          {` `}
                          {currentPatient
                            ? currentPatient?.visit_no
                            : dataSource[0]?.visit_no}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className='d-flex justify-content-center'>
                        <p
                          style={{
                            fontSize: '11px',
                            fontWeight: 'light',
                            marginBottom: 0,
                            paddingBottom: 2,
                            opacity: '0.63',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 'bold',
                              opacity: '0.9 !important',
                            }}
                          >
                            Patient No:
                          </span>
                          {` `}
                          {currentPatient
                            ? currentPatient?.patient_no
                            : dataSource[0]?.patient_no}
                        </p>
                      </Col>
                    </Row>
                    <Row className='mb-1'>
                      <Col span={24} className='d-flex justify-content-center'>
                        <p
                          style={{
                            fontSize: '11px',
                            fontWeight: 'light',
                            marginBottom: 0,
                            paddingBottom: 2,
                            opacity: '0.63',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 'bold',
                              opacity: '0.9 !important',
                            }}
                          >
                            Visit Date:
                          </span>
                          {` `}
                          {currentPatient
                            ? currentPatient?.visit_date &&
                              moment(currentPatient?.visit_date).format(
                                'MM Do YYYY, h:mm:ss a'
                              )
                            : dataSource[0]?.visit_date &&
                              moment(dataSource[0]?.visit_date).format(
                                'MM Do YYYY, h:mm:ss a'
                              )}
                        </p>
                      </Col>
                    </Row>
                    {/* Timer panel */}
                    <Row className='mb-1'>
                      <Col span={24} className='d-flex justify-content-center'>
                        <div
                          style={{
                            fontSize: '15px',
                            fontWeight: 'light',
                            marginBottom: 0,
                            paddingBottom: 2,
                            opacity: '0.63',
                          }}
                        >
                          {currentTab === '1_inqueue' && (
                            <Timer
                              params={startTimer}
                              data={dataSource[0]}
                              currentPatient={currentPatient}
                            />
                          )}
                        </div>
                      </Col>
                    </Row>
                    {currentPatient?.status === 'Pre_Arrival' ||
                    dataSource[0]?.status === 'Pre_Arrival' ? (
                      <Row className='mt-4'>
                        <Col
                          span={24}
                          className='d-flex justify-content-center'
                        >
                          {currentTab === '2_prearrival' ? (
                            <Row>
                              <Row gutter={[10, 10]}>
                                <Col
                                  span={24}
                                  className='d-flex justify-content-center'
                                >
                                  <Button
                                    onClick={handleOnAddQueue}
                                    type='primary'
                                  >
                                    Add to Queue
                                  </Button>
                                </Col>
                              </Row>
                            </Row>
                          ) : (
                            currentTab === 'scheduled_appointments' && (
                              <Row>
                                <Row gutter={[10, 10]}>
                                  <Col
                                    span={24}
                                    className='d-flex justify-content-center'
                                  >
                                    <Button
                                      onClick={handleOnAddQueue}
                                      disabled={
                                        dataSource[0]?.status !== 'Pre_Arrival'
                                      }
                                      type='primary'
                                    >
                                      Add to Queue
                                    </Button>
                                  </Col>
                                </Row>
                              </Row>
                            )
                          )}
                        </Col>
                      </Row>
                    ) : (
                      ((currentPatient?.status !== 'CheckedOut' ||
                        dataSource[0]?.status !== 'CheckedOut' ||
                        currentPatient?.status !== 'Pre_Arrival' ||
                        dataSource[0]?.status !== 'Pre_Arrival') && (
                        <>
                          <Row className='mt-4'>
                            <Col
                              span={24}
                              className='d-flex justify-content-center'
                            >
                              <Row>
                                <Row gutter={[10, 10]}>
                                  <Col
                                    xl={12}
                                    lg={12}
                                    md={12}
                                    sm={24}
                                    xs={24}
                                    className='d-flex justify-content-center'
                                  >
                                    <Button
                                      disabled={
                                        currentPatient
                                          ? currentPatient?.status !== 'Active'
                                          : dataSource[0]?.status !== 'Active'
                                      }
                                      type='primary'
                                      style={{
                                        backgroundColor: currentPatient
                                          ? currentPatient.status ===
                                              'Active' && '#6ccd3c'
                                          : dataSource[0]?.status ===
                                              'Active' && '#6ccd3c',
                                      }}
                                      onClick={handleCheckIn}
                                    >
                                      Check-In
                                    </Button>
                                  </Col>

                                  <Col
                                    xl={12}
                                    lg={12}
                                    md={12}
                                    sm={24}
                                    xs={24}
                                    className='d-flex justify-content-center'
                                  >
                                    <Button
                                      type='danger'
                                      disabled={
                                        currentPatient
                                          ? currentPatient.status ===
                                              'Active' ||
                                            currentPatient.status ===
                                              'Pre_Arrival' ||
                                            currentPatient.status ===
                                              'CheckedOut'
                                          : dataSource[0]?.status ===
                                              'Active' ||
                                            dataSource[0]?.status ===
                                              'Pre_Arrival' ||
                                            dataSource[0]?.status ===
                                              'CheckedOut'
                                      }
                                      onClick={handleOnCheckoutButton}
                                    >
                                      Checkout
                                    </Button>
                                  </Col>
                                </Row>
                              </Row>
                            </Col>
                          </Row>

                          <Row className='mt-2'>
                            <Col
                              span={24}
                              className='d-flex justify-content-center'
                            >
                              <Row>
                                <Row gutter={[10, 10]}>
                                  <Col
                                    span={24}
                                    className='d-flex justify-content-center'
                                  >
                                    <Button
                                      disabled={
                                        currentPatient
                                          ? currentPatient.status ===
                                              'Active' ||
                                            currentPatient.status ===
                                              'Pre_Arrival' ||
                                            currentPatient.status ===
                                              'CheckedOut'
                                          : dataSource[0]?.status ===
                                              'Active' ||
                                            dataSource[0]?.status ===
                                              'Pre_Arrival' ||
                                            dataSource[0]?.status ===
                                              'CheckedOut'
                                      }
                                      type='primary'
                                      onClick={handleOnCheckoutNext}
                                    >
                                      Checkout & Next
                                    </Button>
                                  </Col>
                                </Row>
                              </Row>
                            </Col>
                          </Row>

                          <Row className='mt-2'>
                            <Col
                              span={24}
                              className='d-flex justify-content-center'
                            >
                              <Row gutter={[10, 10]}>
                                <Col span={12}>
                                  <Button
                                    disabled={
                                      currentPatient
                                        ? currentPatient?.status ===
                                            'CheckedIn' ||
                                          currentPatient?.status === 'Skipped'
                                        : dataSource[0]?.status ===
                                            'CheckedIn' ||
                                          dataSource[0]?.status === 'Skipped'
                                    }
                                    type='danger'
                                    style={{
                                      color: currentPatient
                                        ? currentPatient?.status ===
                                            'CheckedIn' ||
                                          currentPatient?.status === 'Skipped'
                                          ? ''
                                          : 'white'
                                        : dataSource[0]?.status ===
                                            'CheckedIn' ||
                                          dataSource[0]?.status === 'Skipped'
                                        ? ''
                                        : 'white',
                                      backgroundColor: currentPatient
                                        ? currentPatient?.status ===
                                            'CheckedIn' ||
                                          currentPatient?.status === 'Skipped'
                                          ? ''
                                          : '#f50'
                                        : dataSource[0]?.status ===
                                            'CheckedIn' ||
                                          dataSource[0]?.status === 'Skipped'
                                        ? ''
                                        : '#f50',
                                    }}
                                    onClick={handleOnSkipButton}
                                  >
                                    Skip
                                  </Button>
                                </Col>

                                <Col span={12}>
                                  <Button
                                    disabled={
                                      currentPatient
                                        ? currentPatient.status === 'Active' ||
                                          currentPatient.status ===
                                            'Pre_Arrival' ||
                                          currentPatient.status === 'CheckedOut'
                                        : dataSource[0]?.status === 'Active' ||
                                          dataSource[0]?.status ===
                                            'Pre_Arrival' ||
                                          dataSource[0]?.status === 'CheckedOut'
                                    }
                                    type='primary'
                                    style={{
                                      color: currentPatient
                                        ? (currentPatient?.status ===
                                            'CheckedIn' ||
                                            currentPatient?.status ===
                                              'OnHold' ||
                                            currentPatient?.status ===
                                              'Skipped') &&
                                          'white'
                                        : (dataSource[0]?.status ===
                                            'CheckedIn' ||
                                            dataSource[0]?.status ===
                                              'OnHold' ||
                                            dataSource[0]?.status ===
                                              'Skipped') &&
                                          'white',
                                      backgroundColor: currentPatient
                                        ? (currentPatient?.status ===
                                            'CheckedIn' ||
                                            currentPatient?.status ===
                                              'OnHold' ||
                                            currentPatient?.status ===
                                              'Skipped') &&
                                          '#969D3B'
                                        : (dataSource[0]?.status ===
                                            'CheckedIn' ||
                                            dataSource[0]?.status ===
                                              'OnHold' ||
                                            dataSource[0]?.status ===
                                              'Skipped') &&
                                          '#969D3B',
                                    }}
                                    onClick={handleOnNextButton}
                                  >
                                    Next
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </>
                      )) ||
                      null
                    )}
                  </Col>
                </div>
              ) : (
                <QueueManagementSkeleton />
              )}
            </Card>
          </Col>

          <Col lg={14} md={24} sm={24} xs={24}>
            <Collapse
              defaultActiveKey={[defaultKey]}
              activeKey={defaultKey}
              onChange={handleCollapseChange}
            >
              <Panel key='1_patient_list' header='Patient List'>
                <Tabs
                  onTabClick={onTabClick}
                  defaultActiveKey={currentTab}
                  activeKey={currentTab}
                >
                  <TabPane key='1_inqueue' tab={'In-Queue'}>
                    <Row
                      className={
                        width > 800 ? 'd-flex justify-content-end mb-3' : 'mb-3'
                      }
                      gutter={[8, 10]}
                    >
                      <Col lg={6} md={8} sm={24} xs={24}>
                        <Col span={24}>
                          {' '}
                          <Select
                            placeholder='Select status'
                            showSearch
                            defaultValue={selectedStatus}
                            value={selectedStatus}
                            style={{ width: '100%' }}
                            size='small'
                            onChange={(e) => {
                              setSelectedStatus(e);
                              setSearchParams({ ...searchParams, status: e });
                            }}
                          >
                            <Option
                              key='empty'
                              value=''
                              style={{ color: 'rgba(0,0,0,.4)' }}
                            >
                              - Select status -
                            </Option>
                            <Option key='1' value='Active'>
                              Active
                            </Option>
                            <Option key='2' value='CheckedIn'>
                              Checked In
                            </Option>
                            <Option key='3' value='OnHold'>
                              On-Hold
                            </Option>
                            <Option key='4' value='Skipped'>
                              Skipped
                            </Option>
                          </Select>
                        </Col>
                      </Col>
                      <Col lg={9} md={11} sm={24} xs={24}>
                        <Col span={24}> {search}</Col>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <Table
                          columns={columns}
                          dataSource={dataSource}
                          rowKey={(record) => record.id}
                          scroll={{ x: width < 700 && 830 }}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  {locationData &&
                    locationData.total_patient_with_status_pre_arrival > 0 && (
                      <TabPane key='2_prearrival' tab={'Pre-Arrival'}>
                        <Row
                          className={
                            width > 800
                              ? 'd-flex justify-content-end mb-3'
                              : 'mb-3'
                          }
                        >
                          <Col lg={9}>
                            <Col span={24}> {search}</Col>
                          </Col>
                        </Row>

                        <Row>
                          <Col span={24}>
                            <Table
                              columns={columns}
                              dataSource={dataSource}
                              scroll={{ x: width < 700 && 750 }}
                            />
                          </Col>
                        </Row>
                      </TabPane>
                    )}
                  <TabPane tab={'Served Patients'} key={'served_patients'}>
                    <Row
                      className={
                        width > 800 ? 'd-flex justify-content-end mb-3' : 'mb-3'
                      }
                      gutter={[8, 10]}
                    >
                      <Col lg={9} md={12} sm={24} xs={24}>
                        <Col span={24}> {search}</Col>
                      </Col>
                      <Col lg={11} md={12} sm={24} xs={24}>
                        <Col span={24}>
                          <RangePicker
                            onChange={onDateChange}
                            separator={'..'}
                            defaultValue={[
                              moment(moment(), dateFormat),
                              moment(moment(), dateFormat),
                            ]}
                            size='small'
                            style={{ width: '100%' }}
                          />
                        </Col>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <Table
                          columns={columns}
                          dataSource={dataSource}
                          scroll={{ x: width < 700 && 765 }}
                        />
                      </Col>
                    </Row>
                  </TabPane>

                  <TabPane
                    tab={'Scheduled Appointments'}
                    key={'scheduled_appointments'}
                  >
                    <Row
                      className={
                        width > 800 ? 'd-flex justify-content-end mb-3' : 'mb-3'
                      }
                    >
                      <Col lg={9}>
                        <Col span={24}> {search}</Col>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <Table
                          columns={columns}
                          dataSource={dataSource}
                          scroll={{ x: width < 700 && 765 }}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </Card>

      <Modal
        title='Modal'
        type='confirm'
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText='Send'
        cancelText='Cancel'
      >
        <SendToAnotherServicePoint />
      </Modal>
    </div>
  );
};

export default QueuePoint;
