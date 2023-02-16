import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Tabs,
  Button,
  Table,
  DatePicker,
  message,
  Modal,
  Menu,
  Select,
  Dropdown,
} from 'antd';
import { appointmentsService } from '_services/appointments.service';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import windowsDimension from 'constants/DeviceSize';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { pendingAppointmentColumns } from './columns';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { codeValuesService } from '_services';
import {
  faClipboardCheck,
  faClose,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DoctorSearch } from '_components/allSearch';

let providerId = JSON.parse(localStorage.getItem('provider_api_client_id'));

const Main = (props) => {
  const { Option } = Select;
  const { TabPane } = Tabs;
  const location = props.location.state;
  const [appointments, setAppointments] = useState([]);
  const [total_elements_pending, setTotalElementsPending] = useState(0);
  const [total_elements_cancelled, setTotalElementsCancelled] = useState(0);
  const [total_elements_confirmed, setTotalElementsConfirmed] = useState(0);
  const history = useHistory();
  const { width } = windowsDimension();
  const { confirm } = Modal;
  const { RangePicker } = DatePicker;
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [page, setPage] = useState(defaultPage);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const showSpecialization = true;
  const [dateValue, setDateValue] = useState([]);
  const [key, setKey] = useState(
    location?.isFromConfirmedAppointments
      ? '3_confirmed'
      : location?.isFromCancelledAppointments
      ? '2_cancelled'
      : '1_pending'
  );
  const dateRange = `${moment().format('YYYY-MM-DD')}..${moment().format(
    'YYYY-MM-DD'
  )}`;
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
    appointmentStatus: 'Pending',
    providerId: providerId,
    dateRange,
  });

  const pendingColums = [
    ...pendingAppointmentColumns,
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

      fixed: width < 1100 && 'right',
      width: width < 1100 && '13%',
    },
  ];

  const confirmedColums = [
    ...pendingAppointmentColumns,
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (text, row) => (
        <>
          <Dropdown overlay={confirmedApptMenu(row)}>
            <Button size='small'>Action</Button>
          </Dropdown>
        </>
      ),

      fixed: width < 1100 && 'right',
      width: width < 1100 && '15%',
    },
  ];
  const showCancelAppt = (row) => {
    confirm({
      title: 'Do you want to cancel this appointment?',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',

      onOk() {
        let params = {
          appointment_number: row?.appointment_number,
          provider_id: providerId,
        };
        appointmentsService
          .cancelAppointment(params)
          .then((resp) => {
            if (resp.status === 200) {
              message.success('Appointment cancelled successfully');
              getAppointments(searchParams);
            }
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
          });
      },

      onCancel() {},
    });
  };
  const showConfirmAppt = (row) => {
    confirm({
      title: 'Do you confirm this appointment?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        let params = {
          appointment_number: row?.appointment_number,
          provider_id: providerId,
        };
        appointmentsService
          .confirmAppointment(params)
          .then((resp) => {
            if (resp.status === 200) {
              message.success('Appointment confirmed successfully');
              getAppointments(searchParams);
            }

            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
          });
      },

      onCancel() {},
    });
  };

  const menu = (row) => {
    return (
      <Menu onClick={(e) => handleMenuClick(row, e)}>
        <Menu.Item
          key='1_confirm'
          icon={
            <FontAwesomeIcon
              icon={faClipboardCheck}
              style={{
                color: '#1089ff',
              }}
            />
          }
        >
          Confirm Appointment
        </Menu.Item>

        <Menu.Item
          key='2_confirm_and_send_to'
          icon={
            <FontAwesomeIcon
              icon={faShare}
              style={{
                color: 'purple',
              }}
            />
          }
        >
          Confirm and Send To
        </Menu.Item>

        <Menu.Item
          key='3_cancel'
          icon={
            <FontAwesomeIcon
              icon={faClose}
              style={{
                color: '#b7b7b7',
              }}
            />
          }
        >
          Cancel Appointment
        </Menu.Item>
      </Menu>
    );
  };

  const confirmedApptMenu = (row) => {
    return (
      <Menu onClick={(e) => handleApptMenuClick(row, e)}>
        <Menu.Item
          key='1_confirm_and_send_to'
          icon={
            <FontAwesomeIcon
              icon={faShare}
              style={{
                color: 'purple',
              }}
            />
          }
        >
          Send To ServicePoint
        </Menu.Item>
      </Menu>
    );
  };

  const handleMenuClick = (row, e) => {
    if (e) {
      if (e.key === '1_confirm') {
        showConfirmAppt(row);
      } else if (e.key === '2_confirm_and_send_to') {
        history.push({
          pathname:
            '/staff-management/appointments/confirm-appointment-and-queue',
          state: { appointmentInfo: row, ProviderId: providerId },
        });
      } else if (e.key === '3_cancel') {
        showCancelAppt(row);
      }
    }
  };

  const handleApptMenuClick = (row, e) => {
    if (e) {
      if (e.key === '1_confirm_and_send_to') {
        history.push({
          pathname:
            '/staff-management/appointments/confirm-appointment-and-queue',
          state: { appointmentInfo: row, ProviderId: providerId },
        });
      }
    }
  };

  useEffect(() => {
    getAppointments(searchParams);
  }, [searchParams]);

  useEffect(() => {
    getAppointmentTypes({ codes: 'AppointmentTypes' });
  }, []);

  const getAppointmentTypes = (params) => {
    codeValuesService
      .getCodevalues(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setAppointmentTypes(content);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getAppointments = (params) => {
    setLoading(true);
    appointmentsService
      .fetchAppointments(params)
      .then((resp) => {
        let respData = resp?.data || [];
        let content = respData?.content || [];
        setAppointments(content);
        if (content.length > 0) {
        }
        if (key === '1_pending') {
          setTotalElementsPending(respData.page_details?.total_elements || 0);
        } else if (key === '2_cancelled') {
          setTotalElementsCancelled(respData.page_details?.total_elements || 0);
        } else if (key === '3_confirmed') {
          setTotalElementsConfirmed(respData.page_details?.total_elements || 0);
        }

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

    let params = {
      ...searchParams,
      ...current_page,
    };
    setSearchParams({ ...searchParams, ...params });
    setPage(current_page);
  };
  const onTabChange = (tabkey) => {
    setDateValue([moment(), moment()]);
    let appointmentStatus =
      tabkey === '1_pending'
        ? 'Pending'
        : tabkey === '2_cancelled'
        ? 'Cancelled'
        : '3_confirmed'
        ? 'Confirmed'
        : tabkey;

    let params = {
      providerId: providerId,
      ...defaultPage,
      appointmentStatus,
      dateRange,
    };
    setKey(tabkey);
    setSearchParams(params);
  };

  const handleSearchByAppointmentType = (value) => {
    let params;
    if (value) {
      params = {
        ...searchParams,
        ...defaultPage,
        appointmentType: value,
      };
    } else {
      params = {
        ...searchParams,
        ...defaultPage,
        appointmentType: null,
      };
    }

    setSearchParams(params);
    setPage(defaultPage);
  };

  const handleSearchDateRange = (data) => {
    setDateValue(data);
    let params;
    if (data) {
      if (!data.length < 1) {
        let date = `${data[0].format('YYYY-MM-DD')}..${data[1].format(
          'YYYY-MM-DD'
        )}`;
        params = { dateRange: date };

        setSearchParams({ ...searchParams, ...defaultPage, ...params });
      }
    } else {
      params = { dateRange: null };
    }

    setSearchParams({ ...searchParams, ...defaultPage, ...params });
    setPage(defaultPage);
  };

  const handleSearchByDoctorId = (id) => {
    let params;
    if (id) {
      params = {
        ...searchParams,
        ...defaultPage,
        doctorUserId: id,
      };
    } else {
      params = {
        ...searchParams,
        ...defaultPage,
        doctorUserId: null,
      };
    }
    setSearchParams(params);
    setPage(defaultPage);
  };

  const handleDoctor = (data) => {
    if (data) {
      handleSearchByDoctorId(data.id);
    } else {
      handleSearchByDoctorId(null);
    }
  };

  const AppointmentTable = (
    <>
      <Row className='d-flex justify-content-end' gutter={[10, 10]}>
        <Col lg={5} md={8} sm={24} xs={24}>
          <Select
            showSearch
            allowClear
            onChange={handleSearchByAppointmentType}
            size='small'
            placeholder='Search appt type'
            style={{ width: '100%' }}
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {appointmentTypes &&
              appointmentTypes.map((appointmentTypes, index) => (
                <Option key={index} value={appointmentTypes.code_value}>
                  {appointmentTypes.code_value}
                </Option>
              ))}
          </Select>
        </Col>

        <Col lg={showSpecialization ? 8 : 5} md={8} sm={24} xs={24}>
          <DoctorSearch
            doctor={handleDoctor}
            showSpecializations={showSpecialization}
          />
        </Col>
        <Col lg={5} md={8} sm={24} xs={24}>
          <RangePicker
            size='small'
            separator={'~'}
            defaultValue={[moment(), moment()]}
            style={{ width: '100%' }}
            onChange={handleSearchDateRange}
            value={dateValue && [moment(dateValue[0]), moment(dateValue[1])]}
          />
        </Col>
      </Row>

      <Row className='mt-2'>
        <Col span={24}>
          <PerfectScrollbar style={{ height: '60vh' }}>
            <Table
              loading={isLoading}
              size={'small'}
              onChange={handleTableChange}
              columns={
                key === '1_pending'
                  ? pendingColums
                  : key === '2_cancelled'
                  ? pendingAppointmentColumns
                  : confirmedColums
              }
              dataSource={appointments}
              scroll={{ x: width < 1000 && 900 }}
              rowKey={(record) => Math.random()}
              pagination={{
                pageSize: page.pageSize,
                current: page?.pageNo + 1,
                total:
                  key === '1_pending'
                    ? total_elements_pending
                    : key === '2_cancelled'
                    ? total_elements_cancelled
                    : total_elements_confirmed,
              }}
            />
          </PerfectScrollbar>
        </Col>
      </Row>
    </>
  );

  return (
    <div>
      <Card
        type='inner'
        title='Appointments'
        extra={
          <>
            <Button
              type='primary'
              onClick={() =>
                history.push('/staff-management/appointments/create')
              }
              size={width < 500 && 'small'}
            >
              New Appointment
            </Button>
          </>
        }
      >
        <Tabs onChange={onTabChange}>
          <TabPane tab='Pending' key={`1_pending`}>
            {AppointmentTable}
          </TabPane>

          <TabPane tab='Cancelled' key={`2_cancelled`}>
            {AppointmentTable}
          </TabPane>

          <TabPane tab='Confirmed' key={`3_confirmed`}>
            {AppointmentTable}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Main;
