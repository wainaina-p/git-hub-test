import Tag from "antd/es/tag";

export const servicePointColumns = [
  {
    title: "Service Point Name",
    dataIndex: "service_point_name",
    key: "service_point_name",
    width: "10%",
  },
  {
    title: "Decription",
    dataIndex: "description",
    key: "description",
    width: "55%",
  },
  
  {
    title: "Appointment Allowed",
    dataIndex: "book_appointment",
    key: "book_appointment",
    width: "10%",
    render: (text, row) => text === false ? <Tag color='red'>Not-Allowed</Tag> : <Tag color='success'>Allowed</Tag>

  },
  
];

