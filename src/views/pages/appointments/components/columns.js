import moment from 'moment';
import Tag from 'antd/es/tag';

export const pendingAppointmentColumns = [
  {
    title: 'Pt No.',
    dataIndex: 'patient_no',
    key: 'patient_no',
    width: '9%',
  },
  {
    title: ' Patient Name',
    dataIndex: ['firstName', ' secondName', 'surname'],
    key: 'firstName',
    width: '20%',
    render: (text, record) => (
      <>
        <span>
          {record.firstName} {record.secondName} {record.surname}
        </span>
      </>
    ),
  },
  {
    title: 'Appt Type',
    dataIndex: 'appointment_type',
    key: 'appointment_type',
    width: '12%',
  },
  {
    title: 'Appt No',
    dataIndex: 'appointment_number',
    key: 'appointment_type',
    width: '12%',
  },
  {
    title: 'Appt Date',
    dataIndex: 'appointment_date',
    key: 'appointment_date',
    width: '13%',
    render: (text, row) => (
      <>
        <Tag color='purple'>
          <span>{moment(text).format('YYYY-MM-DD')}</span>
        </Tag>
      </>
    ),
  },

  {
    title: 'Time',
    dataIndex: ['start_time', 'end_time'],
    key: 'time',
    width: '20%',
    render: (text, record) => (
      <>
        {' '}
        <Tag color='success'>
          {' '}
          <span>
            {record.start_time} - {record.end_time}
          </span>
        </Tag>
      </>
    ),
  },

  {
    title: 'Doctor Name',
    dataIndex: 'doctor_name',
    key: 'doctor_name',
    width: '12%',
  },
  {
    title: 'Primary Contact',
    dataIndex: 'primary_contact',
    key: 'primary_contact',
    width: '15%',
    render: (text, row) => (
      <>
        <a href={`tel:${text ? text : row?.primary_contact}`}>
          {text ? text : row?.primary_contact}
        </a>
      </>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '11%',
    render: (text, row) => (
      <>
        <Tag
          color={
            text === 'Pending'
              ? 'processing'
              : text === 'Cancelled'
              ? 'error'
              : 'Confirmed'
              ? 'green'
              : 'sucess'
          }
        >
          {text && text.toLowerCase()}
        </Tag>
      </>
    ),
  },
  {
    title: 'Comments',
    dataIndex: 'comments',
    key: 'comments',
    width: '15%',
  },
];
