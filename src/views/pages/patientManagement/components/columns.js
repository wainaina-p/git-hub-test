import React from 'react';
import { Tag, Tooltip, Popover, Badge } from 'antd';
import moment from 'moment';
export const staffsRegisterColumns = [
  {
    title: 'Payroll No',
    dataIndex: 'payrollNo',
    key: 'payrollNo',
    width: '10%',
  },
  {
    title: 'Staff Name',
    dataIndex: ['firstName', ' secondName', 'surname'],
    key: 'firstName',

    render: (text, record) => (
      <>
        <span>
          {record.firstName} {record.secondName} {record.surname}
        </span>
      </>
    ),
  },
  {
    title: 'National ID.',
    dataIndex: 'idNo',
    key: 'idNo',
    width: '10%',
  },
  {
    title: 'Mobile No.',
    dataIndex: 'mobileNo',
    key: 'mobileNo',
    width: '10%',
    render: (text, row) => (
      <>
        <a href={`tel:${text ? text : ''}`}>{text}</a>
      </>
    ),
  },
  {
    title: 'Email',
    dataIndex: 'emailAddress',
    key: 'emailAddress',
    render: (text, row) => (
      <>
        <a href={`mailto:${text ? text : ''}`}>{text}</a>
      </>
    ),
  },
  {
    title: 'Disability',
    dataIndex: 'isDisabled',
    width: '10%',
    key: 'isDisabled',
    render: (text, record) => (
      // eslint-disable-next-line no-lone-blocks
      <>
        {text && (
          <Tag color={!text ? 'green' : 'red'}>
            {text ? 'Normal' : 'Disabled' || 'Normal'}
          </Tag>
        )}
      </>
    ),
  },
];

const content = (start, end) => (
  <div>
    <p>
      <b>Start Date-:{` `}</b>
      {moment(start).format('MMMM Do YYYY, h:mm:ss a')}
    </p>
    <p>
      <b>End Date-:{` `}</b>
      {moment(end).format('MMMM Do YYYY, h:mm:ss a')}
    </p>
  </div>
);

const popover = (start, end, days) => (
  <Popover content={content(start, end)} title='Dates'>
    <Badge title='' style={{ cursor: 'pointer' }} count={days} />
  </Popover>
);

export const patientVisitsColumns = [
  {
    title: 'Member Name',
    dataIndex: 'member_name',
    width: '15%',
    fixed: 'left',
  },
  {
    title: 'Member No',
    dataIndex: 'member_number',
    width: '12%',
  },
  {
    title: 'Patient No',
    dataIndex: 'patient_number',
    width: '9%',
  },
  {
    title: 'Visit Number',
    dataIndex: 'visit_number',
    width: '11%',
  },
  {
    title: 'Visit Date',
    dataIndex: 'start_datetime',
    width: '9%',
    render: (text, record) => (
      <>
        <Tooltip title={moment(text).format('MMMM Do YYYY, h:mm:ss a')}>
          {moment(text).fromNow()}
        </Tooltip>
      </>
    ),
  },
  {
    title: 'Length of stay (Days)',
    dataIndex: ['start_datetime', 'stop_datetime'],
    width: '9%',
    render: (text, record) => {
      let given = moment(record.stop_datetime, 'YYYY-MM-DD');
      let current = moment(record.start_datetime).startOf('day');

      //Difference in number of days
      //  <Popover content={<></>} title='Title'>
      //    <Button type='primary'>Hover me</Button>
      //  </Popover>;
      // return moment.duration(given.diff(current)).asDays();
      // moment.duration(given.diff(current)).asDays();
      return popover(
        record.start_datetime,
        record.stop_datetime,
        moment.duration(given.diff(current)).asDays()
      );
    },
  },
  {
    title: 'Payer Code',
    dataIndex: 'payer_code',
    width: '8%',
    // sortDirections: ['descend', 'ascend'],
    // sorter: (a, b) => a.payer_code - b.payer_code,
    render: (text, row) =>
      row.payer_name ? (
        <Tooltip title={row.payer_name}>{text}</Tooltip>
      ) : (
        <span>{text}</span>
      ),
  },
  {
    title: 'Scheme Name',
    dataIndex: 'scheme_name',
    width: '15%',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '9%',
    render: (text, row) => (
      <>
        <Tag
          color={
            text === 'PENDING'
              ? 'processing'
              : text === 'EXPIRED'
              ? 'error'
              : 'green'
          }
        >
          {text && text === 'PENDING'
            ? 'Pending'
            : text === 'EXPIRED'
            ? 'Expired'
            : 'Active'}
        </Tag>
      </>
    ),
  },
];
