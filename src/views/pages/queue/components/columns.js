import moment from 'moment';
import { Tag } from 'antd';

export const servicePointColumns = [
  {
    title: 'Patient No.',
    dataIndex: 'patient_no',
    key: 'patient_no',
  },
  {
    title: 'Visit No.',
    dataIndex: 'visit_no',
    key: 'visit_no',
  },
  {
    title: 'Patient Name',
    dataIndex: 'patient_name',
    key: 'patient_name',
  },
  {
    title: 'Ticket No.',
    dataIndex: 'ticket_no',
    key: 'ticket_no',
    render: (text, row) => (
      <>
        <span>
          {text ? (
            <Tag
              color='#52c41a'
              style={{
                borderRadius: '50%',
                padding:
                  row?.ticket_no && row.ticket_no <= 9
                    ? '0px 6px'
                    : row?.ticket_no && row.ticket_no > 9 && row.ticket_no <= 99
                    ? '0px 4px'
                    : '3px',
                fontWeight: 'bold',
              }}
            >
              {text}
            </Tag>
          ) : (
            <Tag color='magenta'>Missing</Tag>
          )}
        </span>
      </>
    ),
  },
  {
    title: 'Visit Date',
    dataIndex: 'visit_date_time',
    key: 'visit_date_time',
    width: '200',
    render: (text, row) => (
      <>
        <span>{moment(text).format('MM Do YYYY, h:mm:ss a')}</span>
      </>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text, row) => (
      <Tag
        color={
          text
            ? (text === 'CheckedIn' && 'green') ||
              (text === 'Active' && 'blue') ||
              (text === 'Pre_Arrival' && 'cyan') ||
              (text === 'OnHold' && 'gold') ||
              (text === 'Skipped' && 'orange') ||
              (text === 'CheckedOut' && 'magenta')
            : 'red'
        }
      >
        {text
          ? (text === 'CheckedIn' && 'Checked-In') ||
            (text === 'Active' && 'Active') ||
            (text === 'Pre_Arrival' && 'Pre-Arrival') ||
            (text === 'OnHold' && 'On-Hold') ||
            (text === 'Skipped' && 'Skipped') ||
            (text === 'CheckedOut' && 'Checked-Out')
          : 'Missing'}
      </Tag>
    ),
  },
];

export const servicePointPreArrivalColumns = [
  {
    title: 'Patient No.',
    dataIndex: 'patient_no',
    key: 'patient_no',
  },
  {
    title: 'Visit No.',
    dataIndex: 'visit_no',
    key: 'visit_no',
  },
  {
    title: 'Patient Name',
    dataIndex: 'patient_name',
    key: 'patient_name',
  },
  {
    title: 'Visit Date',
    dataIndex: 'visit_date_time',
    key: 'visit_date_time',
    render: (text, row) => (
      <>
        <span>{moment(text).format('MM Do YYYY, h:mm:ss a')}</span>
      </>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text, row) => (
      <Tag
        color={
          text
            ? (text === 'CheckedIn' && 'green') ||
              (text === 'Active' && 'blue') ||
              (text === 'Pre_Arrival' && 'cyan') ||
              (text === 'OnHold' && 'gold') ||
              (text === 'Skipped' && 'orange') ||
              (text === 'CheckedOut' && 'magenta')
            : 'red'
        }
      >
        {text
          ? (text === 'CheckedIn' && 'Checked-In') ||
            (text === 'Active' && 'Active') ||
            (text === 'Pre_Arrival' && 'Pre-Arrival') ||
            (text === 'OnHold' && 'On-Hold') ||
            (text === 'Skipped' && 'Skipped') ||
            (text === 'CheckedOut' && 'Checked-Out')
          : 'Missing'}
      </Tag>
    ),
  },
];
