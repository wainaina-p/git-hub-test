export const UsersColumns = [
  {
    title: 'Name',
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
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Roles',
    dataIndex: 'user_roles',
    key: 'user_roles',
  },
  {
    title: 'Email',
    dataIndex: 'emailAddress',
    key: 'emailAddress',
  },
  {
    title: 'Primary Contact',
    dataIndex: 'primary_contact',
    key: 'primary_contact',
    render: (text, row) => (
      <>
        <a href={`tel:${text ? text : row?.primary_contact}`}>
          {text ? text : row?.primary_contact}
        </a>
      </>
    ),
  },
];
