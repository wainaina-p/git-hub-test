import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  message,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
} from "antd";
import { providerProfileService } from "_services";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { facilityClass } from "../../facility/components/facilityClasses";

const ProviderProfile = (props) => {
  let client_id = JSON.parse(localStorage.getItem("provider_api_client_id"));
  const [providerInfo, setProviderInfo] = useState();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { Option } = Select;
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getProviderProfile(client_id);
  }, []);

  useEffect(() => {
    if (providerInfo) {
      setLoading(true);
      form.setFieldsValue(providerInfo);
      setLoading(false);
    }
  }, [providerInfo]);

  const getProviderProfile = (params) => {
   
    providerProfileService
      .getProviderByClientId(params)
      .then((resp) => {
        let content = resp.data?.content || [];

        if (!Array.isArray(content)) {
          setProviderInfo(content);
          
        }
      })
      .catch((e) => {
        console.log(e);
       
      });
  };
  const updateProviderProfile = (values) => {
    let data = { ...values, client_id };
    setLoading(true);
    providerProfileService
      .updateProvider(providerInfo.id, data)
      .then((resp) => {
        if (resp.status === 200) {
          message.success(" Provider profile updated successfully");
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log("Error updating \n", e);
        setLoading(false);
      });
  };
  // const newProviderProfile = (values) => {
  //   let data = { ...values, client_id };
  //   setLoading(true);
  //   providerProfileService
  //     .createProvider(data)
  //     .then((resp) => {
  //       if (resp.status === 200) {
  //         message.success(" Provider profile created successfully");
  //         setLoading(false);
  //       }
  //     })
  //     .catch((e) => {
  //       console.log("Error creating \n", e);
  //       setLoading(false);
  //     });
  // };
  const onFinish = (values) => {
    // providerInfo ?
     updateProviderProfile(values) 
    // : newProviderProfile(values);
  };

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
      <Form id="form"  layout="vertical" onFinish={onFinish} form={form}>
        <Row gutter={14}>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label="Provider Name"
              name="provider_name"
              rules={[
                {
                  required: true,
                  message: "Please input provider name",
                },
              ]}
            >
              <Input allowClear placeholder="Provider name" />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label="Identification Number"
              name="identification_number"
              rules={[
                {
                  required: false,
                  message: "Please input identification number ",
                },
              ]}
            >
              <Input allowClear placeholder="Identification number" />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tax Number"
              name="tax_number"
              rules={[
                {
                  required: false,
                  message: "Please input tax number",
                },
              ]}
            >
              <Input allowClear placeholder="Tax number" />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              name="provider_type"
              label="Provider Type"
              rules={[
                { required: false, message: "Please select provider type" },
              ]}
            >
              <Select
                showSearch
                allowClear
                placeholder="Search provider type"
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {facilityClass &&
                  facilityClass.map((facilityClass, index) => (
                    <Option key={index} value={facilityClass}>
                      {formatString(facilityClass)}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label="Primary Contact"
              name="primary_contact"
              rules={[
                {
                  required: false,
                  message: "Please input primary contact",
                },
              ]}
            >
              <PhoneInput
                maxLength={11}
                defaultCountry={"KE"}
                placeholder="Enter primary number"
              />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label="Secondary Contact"
              name="secondary_contact"
              rules={[
                {
                  required: false,
                  message: "Please input secondary contact",
                },
              ]}
            >
              <PhoneInput
                maxLength={11}
                defaultCountry={"KE"}
                placeholder="Enter secondary number"
              />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label="Latitude"
              name="geo_location_latitude"
              rules={[
                {
                  required: false,
                  message: "Please input latitude ",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Latitude" />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label="Longitude"
              name="geo_location_longitude"
              rules={[
                {
                  required: false,
                  message: "Please input longitude ",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Longitude" />
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item label="Status" name="status">
              <Select allowClear placeholder="Status">
                <Option key="ACTIVE" value="ACTIVE">
                  ACTIVE
                </Option>
                <Option key=" INACTIVE" value="INACTIVE">
                  INACTIVE
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Form.Item label="Website URL" name="website_url">
              <TextArea
                allowClear
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="Website URL"
              />
            </Form.Item>
          </Col>

          <Col
            span={24}
            style={{
              textAlign: "right",
            }}
          >
            <Button loading={isLoading} type="primary" htmlType="submit">
              {providerInfo ? "Update" : "Save"}
            </Button>            
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProviderProfile;
