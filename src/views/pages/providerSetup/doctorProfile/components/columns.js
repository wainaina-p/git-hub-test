import { Tag, Badge, Popover, Avatar, Button } from 'antd';
import { PhoneOutlined, UserOutlined } from '@ant-design/icons';

export const doctorColumns = [
  {
    title: null,
    dataIndex: 'portait_data.image',
    key: 'portait_data.image',
    width: '6.5%',
    render: (text, record) => {
      if (text)
        return (
          <Avatar
            size={'default'}
            icon={<UserOutlined />}
            src={`data:image/*;base64,${text}`}
          />
        );

      return <Avatar size={'default'} icon={<UserOutlined />} />;
    },
  },
  {
    title: 'License No.',
    dataIndex: 'doctor_license',
    key: 'doctor_license',
    render: (text) => (
      <>
        {text ? (
          <Button type='link' size='small'>
            {text}
          </Button>
        ) : (
          <Tag color='magenta'>Missing</Tag>
        )}
      </>
    ),
  },
  {
    title: 'Name',
    dataIndex: 'full_name',
    key: 'full_name',
    render: (text, row) => (
      <>
        {text ? (
          <span>{text}</span>
        ) : (
          <span>
            {row?.firstName}
            {` ` + row?.secondName}
            {` ` + row?.surname}
          </span>
        )}
      </>
    ),
  },
  {
    title: 'Contact(s)',
    dataIndex: 'primary_contact',
    key: 'primary_contact',
    render: (text, row) => (
      <>
        {text && row?.secondary_contact ? (
          <>
            <a href={`tel:${text}`}>{text}</a>{' '}
            <Popover
              content={
                <a href={`tel:${row?.secondary_contact}`}>
                  <PhoneOutlined style={{ marginRight: '2.5px' }} />
                  <span>{row?.secondary_contact}</span>
                </a>
              }
              title='Secondary Contact'
            >
              <Tag
                color={'gold'}
                style={{ fontSize: '10px', marginLeft: '6px' }}
              >
                + <PhoneOutlined />
              </Tag>
            </Popover>
          </>
        ) : (
          <a href={`tel:${text ? text : row?.secondary_contact}`}>
            {text ? text : row?.secondary_contact}
          </a>
        )}
      </>
    ),
  },
  {
    title: 'Specialization',
    dataIndex: 'specialization',
    key: 'specialization',
  },
  {
    title: 'Email',
    dataIndex: 'emailAddress',
    key: 'emailAddress',
  },
  {
    title: 'Active Facilities',
    dataIndex: 'doctor_facilities',
    key: 'doctor_facilities',
    width: '5%',
    render: (text, row) => (
      <>
        {row?.doctor_facilities && row?.doctor_facilities.length > 0 ? (
          <Badge
            count={row?.doctor_facilities.length}
            style={{ background: '#52c41a' }}
          />
        ) : (
          <Badge count={0} style={{ background: '#f5222d' }} />
        )}
      </>
    ),
  },
];
export const facilities = [
  {
    title: 'License No.',
    dataIndex: 'doctor_license',
    key: 'doctor_license',
    render: (text) => (
      <>
        {text ? (
          <Button type='link' size='small'>
            {text}
          </Button>
        ) : (
          <Tag color='magenta'>Missing</Tag>
        )}
      </>
    ),
  },
  {
    title: 'Name',
    dataIndex: 'full_name',
    key: 'full_name',
    render: (text, row) => (
      <>
        {text ? (
          <span>{text}</span>
        ) : (
          <span>
            {row?.firstName}
            {` ` + row?.secondName}
            {` ` + row?.surname}
          </span>
        )}
      </>
    ),
  },
  {
    title: 'Contact(s)',
    dataIndex: 'primary_contact',
    key: 'primary_contact',

    render: (text, row) => (
      <>
        {text && row?.secondary_contact ? (
          <>
            <a href={`tel:${text}`}>{text}</a>{' '}
            <Popover
              content={
                <a href={`tel:${row?.secondary_contact}`}>
                  <PhoneOutlined style={{ marginRight: '2.5px' }} />
                  <span>{row?.secondary_contact}</span>
                </a>
              }
              title='Secondary Contact'
            >
              <Tag
                color={'gold'}
                style={{ fontSize: '10px', marginLeft: '6px' }}
              >
                + <PhoneOutlined />
              </Tag>
            </Popover>
          </>
        ) : (
          <a href={`tel:${text ? text : row?.secondary_contact}`}>
            {text ? text : row?.secondary_contact}
          </a>
        )}
      </>
    ),
  },
];
export const doctorAvailability = [
  {
    title: 'Facility',
    dataIndex: 'facility_name',
    key: 'facility_name',
  },
  {
    title: 'Day',
    dataIndex: 'day_of_week',
    key: 'day_of_week',
  },
  {
    title: 'Time',
    dataIndex: ['start_time', 'end_time'],
    key: 'day_of_week',
    render: (text, row) => (
      <>
        <Tag color='success'>
          {' '}
          <span>
            {row.start_time || ''} - {row.end_time || ''}
          </span>
        </Tag>
      </>
    ),
  },
];

export const doctorFacilities = [
  {
    title: 'Facility',
    dataIndex: 'facility_name',
    key: 'facility_name',
  },
];
