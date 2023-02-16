import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Select, message } from "antd";
import { patientsQueueService, servicePointsService } from "_services";

const { Option } = Select;

const SendToAnotherServicePoint = (props) => {
  const [currentServicePoint, setCurrentServicePoint] = useState([]);

  useEffect(() => {
    getServicePoints();
  }, []);

  const getServicePoints = () => {
    let params = { AppointmentAllowed: true };
    servicePointsService.fetchServicePoints(params).then((resp) => {
      let respData = resp.data?.content || [];
      setCurrentServicePoint(respData);
    });
  };

  const onFinish = (values) => {
    let data;

    props?.isFromSendToButton
      ? (data = {
          ticket_no: props.dataSource.dataSource[0]?.ticket_no || null,
          service_point_from_id:
            props.dataSource.dataSource[0]?.service_point_to_id || null,
          service_point_to_id: values?.service_point || null,
        })
      : (data = {
          ticket_no: props.TicketNo?.ticketNo || null,
          service_point_from_id:
            props.ServicePointFrom?.servicePointFrom || null,
          service_point_to_id: values?.service_point || null,
        });

    patientsQueueService
      .sendToAnotherServicePointAndCallNextPatient(data)
      .then((resp) => {
        if (resp.status === 201) {
          message.success(`Patient sent to service point successfully`);
        }
      })
      .catch((e) => {});
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <div>
      <Row>
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={[8, 2]}>
            <Col span={24}>
              <Form.Item
                label="Service point"
                name="service_point"
                rules={[
                  { required: true, message: "Service point is required!" },
                ]}
              >
                <Select
                  placeholder="Select service point"
                  style={{ width: "100%" }}
                  size="small"
                >
                  <Option
                    value={null}
                    key={"empty"}
                    style={{ color: "#b6b6b6" }}
                  >
                    - Select service point -
                  </Option>
                  {currentServicePoint.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.service_point_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24} className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit" size="small">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </div>
  );
};

export default SendToAnotherServicePoint;
