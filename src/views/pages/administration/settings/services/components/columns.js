export const servicesColumns = [
  {
    title: 'Service Name ',
    dataIndex: 'service_name',
    key: 'service_name',
    width: '17%',
  },
  {
    title: 'Service Fee',
    dataIndex: 'service_fee',
    key: 'service_fee',
    width: '14%',
    align: 'center',
    render: (text, row) => <>{text ? text : '-'}</>,
  },
  {
    title: 'Service Description',
    dataIndex: 'service_description',
    key: 'service_description',
  },
];
