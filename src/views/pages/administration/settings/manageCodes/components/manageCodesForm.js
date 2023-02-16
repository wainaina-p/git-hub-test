import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Form, Input, message, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { codeValuesService } from "_services";

const EditCodeValues = (props) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [isNewCodeValue, setisNewCodeValue] = useState(false);
  const location = props.location.state;
  const { Option } = Select;
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setisNewCodeValue(location.isAddNew);
  }, [location.isAddNew]);

  const newCodeValue = (values) => {
    setLoading(true);
    codeValuesService
      .createCodeValue(values)
      .then((resp) => {
        if (resp.status === 201) {
          message.success("Code value added successfully");
          history.goBack();
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log("Error posting \n", e);
        history.goBack();
        setLoading(false);
      });
  };

  const updateCodeValue = (values) => {
    setLoading(true);
    codeValuesService
      .updateCodeValue(location.codeValueInfo.id, values)
      .then((resp) => {
        if (resp.status === 201) {
          message.success("Code value updated successfully");
          history.goBack();
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log("Error updating \n", e);
        history.goBack();
        setLoading(false);
      });
  };
  const onFinish = (data) => {
    isNewCodeValue ? newCodeValue(data) : updateCodeValue(data);
  };

  return (
    <div>
      <Card
        type="inner"
        title={
          <>
            <FontAwesomeIcon
              className="arrow-left"
              icon={faArrowLeft}
              style={{ cursor: "pointer", marginRight: "8px" }}
              onClick={() => {
                history.goBack();
              }}
            />{" "}
            <span> {`${isNewCodeValue ? "New" : "Update"}`} Code Value</span>
          </>
        }
      >
        <Form
          id="form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={location.codeValueInfo}
          form={form}
        >
          <Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Code"
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: "Please input code",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Code"
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {location.codeTypes &&
                      location.codeTypes.map((codeTypes, index) => (
                        <Option key={index} value={codeTypes}>
                          {codeTypes}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Code Value"
                  name="code_value"
                  rules={[
                    {
                      required: true,
                      message: "Please input code value",
                    },
                  ]}
                >
                  <Input allowClear placeholder="Code value" />
                </Form.Item>
              </Col>
            </Row>
          </Row>

          {isNewCodeValue ? (
            <Col
              span={24}
              style={{
                textAlign: "right",
              }}
            >
              <Button
                style={{
                  margin: "0 8px",
                }}
                onClick={() => {
                  history.goBack();
                }}
              >
                Close
              </Button>
              <Button loading={isLoading} type="primary" htmlType="submit">
                Submit
              </Button>
            </Col>
          ) : (
            <Col
              span={24}
              style={{
                textAlign: "right",
              }}
            >
              <Button loading={isLoading} type="primary" htmlType="submit">
                Update
              </Button>
            </Col>
          )}
        </Form>
      </Card>
    </div>
  );
};
export default EditCodeValues;
