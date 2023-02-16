import { Tag, Popover, Badge } from "antd";
import { PhoneOutlined } from "@ant-design/icons";

const formatString = (val) => {
  let newVal;
  if (val) {
    val = val.toLocaleLowerCase();
    newVal = val.charAt(0).toUpperCase() + val.slice(1);
    newVal = newVal.replaceAll("_", " ");
  }
  return newVal;
};
export const facilitiesColumns = [
  {
    title: "Facility Name",
    dataIndex: "facility_name",
    key: "facility_name",
  },
  {
    title: "Facility Type",
    dataIndex: "facility_type",
    key: "facility_type",
    width: "8%",
    render: (text, record) => (
      <>
        <span> {formatString(record.facility_type)}</span>
      </>
    ),
  },
  {
    title: "Facility Class",
    dataIndex: "facility_class",
    key: "facility_class",
    render: (text, record) => (
      <>
        <span> {formatString(record.facility_class)}</span>
      </>
    ),
  },
  {
    title: "Facility Code",
    dataIndex: "facility_code",
    key: "facility_code",
  },
  {
    title: "Identification Number",
    dataIndex: "identification_number",
    key: "identification_number",
    width: "11%",
  },

  {
    title: "Contact Person",
    dataIndex: "contact_person",
    key: "contact_person",
  },
  {
    title: "Contact(s)",
    dataIndex: ["primary_contact", "secondary_contact"],
    key: "Contacts",
    render: (text, row) => (
      <>
        {row?.secondary_contact ? (
          <>
            <a href={`tel:${row?.primary_contact}`}>{row?.primary_contact}</a>{" "}
            <Popover
              content={
                <a href={`tel:${row?.secondary_contact}`}>
                  <PhoneOutlined style={{ marginRight: "2.5px" }} />
                  <span>{row?.secondary_contact}</span>
                </a>
              }
              title="Secondary Contact"
            >
              <Tag
                color={"gold"}
                style={{ fontSize: "10px", marginLeft: "7px" }}
              >
                + <PhoneOutlined />
              </Tag>
            </Popover>
          </>
        ) : (
          <a href={`tel:${text ? text : row?.primary_contact}`}>
            {text ? text : row?.primary_contact}
          </a>
        )}
      </>
    ),
  },
  {
    title: "Insurances Accepted",
    dataIndex: "doctor_facilities",
    key: "facility_insurance_data",
    width: "10%",
    render: (text, row) => (
      <>
        {row?.facility_insurance_data &&
        row?.facility_insurance_data.length > 0 ? (
          <Popover
            content={
              <>
                {
                  <ol>
                    {row?.facility_insurance_data.map((insurance) => (
                      <li key={insurance.id}>{insurance.insurance_name}</li>
                    ))}
                  </ol>
                }
              </>
            }
            title="Insurance Accepted"
          >
            <Badge
              count={row?.facility_insurance_data.length}
              style={{ background: "#52c41a" }}
              title={""}
            />
          </Popover>
        ) : (
          <Badge
            title={""}
            showZero
            count={0}
            style={{ background: "#f5222d" }}
          />
        )}
      </>
    ),
  },
];
export const FacilityInsuranceColums = [
  {
    title: "Insurances Accepted",
    dataIndex: "insurance_name",
    key: "insurance_name",
  },
];
export const FacilityServicescolumns = [
  {
    title: "Services Offered",
    dataIndex: "service_name",
    key: "service_name",
  },
];
