import React, { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FacilityServicescolumns } from "./columns";
import { FacilityInsuranceColums } from "./columns";
import "../components/assets/css/index.css";

const FacilityView = (props) => {
  const facilityRowData = props.location.state.facilityRowData;
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (facilityRowData) {
    }
  }, [facilityRowData]);

  const formatString = (val) => {
    let newVal;
    if (val) {
      val = val.toLocaleLowerCase();
      newVal = val.charAt(0).toUpperCase() + val.slice(1);
      newVal = newVal.replaceAll("_", " ");
    }
    return newVal;
  };
  return (
    <div>
      <Card
        loading={isLoading}
        type="inner"
        title={
          <>
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="arrow-left"
              style={{ cursor: "pointer", marginRight: "8px" }}
              onClick={() => {
                history.push({
                  pathname: "/provider-setup",
                  state: { isFromFacilityForm: true },
                });
              }}
            />{" "}
            <span>View Facility</span>
          </>
        }
      >
        <Row className="d-flex flex-column align-items-center text-center">
          <div className="banner">
            {facilityRowData?.facility_name && (
              <div className=" mb-4">
                <h1> {facilityRowData?.facility_name}</h1>
              </div>
            )}
            {facilityRowData?.facility_class && (
              <>
                <h4> {formatString(facilityRowData?.facility_class)}</h4>
              </>
            )}
          </div>
        </Row>
        <Row className="mt-4" gutter={[12, 16]}>
          <Col lg={12} md={24} sm={24} xs={24}>
            <Card
              title="Contact and Location Information"
              headStyle={{ backgroundColor: "#dbd9d9" }}
              style={{
                boxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                WebkitBoxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                MozBoxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                margin: 0,
                padding: 0,
              }}
            >
              <Descriptions key="0" layout="horizontal" size="small" bordered>
                <Descriptions.Item
                  span={3}
                  label="Contact Person:"
                >{`              ${
                  facilityRowData?.contact_person || ""
                }`}</Descriptions.Item>

                <Descriptions.Item key="2" span={3} label="Primary Contact:">
                  <a href={`tel:${facilityRowData?.primary_contact}`}>
                    <span>{facilityRowData?.primary_contact}</span>
                  </a>
                </Descriptions.Item>
                <Descriptions.Item key="2" span={3} label="Secondary Contact:">
                  <a href={`tel:${facilityRowData?.secondary_contact}`}>
                    <span>{facilityRowData?.secondary_contact}</span>
                  </a>
                </Descriptions.Item>
                <Descriptions.Item
                  span={3}
                  label="Longitude:"
                >{`              ${
                  facilityRowData?.longitude || ""
                }`}</Descriptions.Item>
                <Descriptions.Item span={3} label="Latitude:">{`              ${
                  facilityRowData?.latitude || ""
                }`}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col lg={12} md={24} sm={24} xs={24}>
            <Card
              title="Basic Information"
              headStyle={{ backgroundColor: "#dbd9d9" }}
              style={{
                boxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                WebkitBoxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                MozBoxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                margin: 0,
                padding: 0,
              }}
            >
              <Descriptions key="0" layout="horizontal" size="small" bordered>
                <Descriptions.Item
                  span={3}
                  label="Facility Type:"
                >{`              ${
                  facilityRowData?.facility_type || ""
                }`}</Descriptions.Item>
                <Descriptions.Item
                  span={3}
                  label="Facility Class:"
                >{`              ${
                  formatString(facilityRowData?.facility_class) || ""
                }`}</Descriptions.Item>

                <Descriptions.Item
                  key="2"
                  span={3}
                  label="Registration Number:"
                >
                  {`              ${
                    facilityRowData?.facility_code || ""
                  }`}
                </Descriptions.Item>
                <Descriptions.Item key="2" span={3} label="Tax Number:">
                  {`              ${facilityRowData?.tax_number || ""}`}
                </Descriptions.Item>
                <Descriptions.Item
                  key="2"
                  span={3}
                  label="Identification Number:"
                >
                  {`              ${
                    facilityRowData?.identification_number || ""
                  }`}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>{" "}
          {facilityRowData?.facility_service_data.length > 0 ||
          facilityRowData?.facility_insurance_data.length > 0 ? (
            <Col className=" mb-4" lg={12} md={24} sm={24} xs={24}>
              <Card
                headStyle={{ backgroundColor: "#dbd9d9" }}
                title={null}
                style={{
                  boxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                  WebkitBoxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                  MozBoxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                  margin: 0,
                  padding: 0,
                }}
              >
                <Row>
                  {" "}
                  {facilityRowData?.facility_insurance_data.length > 0 && (
                    <Col
                      span={
                        facilityRowData?.facility_service_data.length > 0
                          ? 12
                          : 24
                      }
                    >
                      <Table
                        dataSource={facilityRowData?.facility_insurance_data}
                        size="small"
                        loading={isLoading}
                        columns={FacilityInsuranceColums}
                        rowKey={(record) => record.id}
                        pagination={false}
                      />
                    </Col>
                  )}
                  {facilityRowData?.facility_service_data.length > 0 && (
                    <Col
                      span={
                        facilityRowData?.facility_insurance_data.length > 0
                          ? 12
                          : 24
                      }
                    >
                      <Table
                        dataSource={facilityRowData?.facility_service_data}
                        size="small"
                        loading={isLoading}
                        columns={FacilityServicescolumns}
                        rowKey={(record) => record.id}
                        pagination={false}
                      />{" "}
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          ) : null}
          {facilityRowData?.working_hours && (
            <Col lg={12} md={24} sm={24} xs={24}>
              <Card
                title="Working Hours"
                headStyle={{ backgroundColor: "#dbd9d9" }}
                style={{
                  boxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                  WebkitBoxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                  MozBoxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                  margin: 0,
                  padding: 0,
                }}
              >
                <p>{facilityRowData?.working_hours}</p>
              </Card>
            </Col>
          )}
          {facilityRowData?.footer_message && (
            <Col span={24}>
              <Card
                title="Footer Message"
                headStyle={{ backgroundColor: "#dbd9d9" }}
                style={{
                  boxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                  WebkitBoxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                  MozBoxShadow: "3px 3px 5px -2px rgba(0,0,0,0.4)",
                  margin: 0,
                  padding: 0,
                }}
              >
                <p>{facilityRowData?.footer_message}</p>
              </Card>
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};
export default FacilityView;
