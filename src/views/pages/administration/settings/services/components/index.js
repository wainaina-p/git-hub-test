import React, { useState, useEffect } from "react";
import { Row, Col, Button, Card, Table, Tag, Popconfirm, message } from "antd";
import "../../assets/style.css";
import { useHistory } from "react-router-dom";
import { servicesColumns } from "./columns";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import windowsDimension from "constants/DeviceSize";
import { servicesService } from "_services";

const ServicesSetup = () => {
  const history = useHistory();
  const [services, setServices] = useState([]);
  const [isServiceId, setIsServiceId] = useState();
  const defaultPage = { pageNo: 0, pageSize: 9 };
  const [page, setPage] = useState(defaultPage);
  const [total_elements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const { width } = windowsDimension();
  const [searchParams, setSearchParams] = useState({ ...defaultPage });

  const columns = [
    ...servicesColumns,
    {
      title: "    ",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (text, record) => (
        <>
          <Tag
            color="purple"
            style={{
              cursor: "pointer",
              boxShadow: "2px 3px 5px -3px rgba(0,0,0,0.52)",
              WebkitBoxShadow: "2px 3px 5px -3px rgba(0,0,0,0.52)",
              MozBoxShadow: "2px 3px 5px -3px rgba(0,0,0,0.52)",
            }}
            onClick={() => {
              history.push({
                pathname: "/settings/system/services/edit-service",
                state: { serviceInfo: record },
              });
            }}
          >
            <EditOutlined style={{ cursor: "pointer" }} />
          </Tag>

          <Tag
            color="error"
            style={{
              cursor: "pointer",
              boxShadow: "2px 3px 5px -3px rgba(0,0,0,0.52)",
              WebkitBoxShadow: "2px 3px 5px -3px rgba(0,0,0,0.52)",
              MozBoxShadow: "2px 3px 5px -3px rgba(0,0,0,0.52)",
            }}
          >
            <Popconfirm
              placement="topRight"
              title="Are you sure to delete this service?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                loading: isLoading,
              }}
            >
              <DeleteOutlined
                onClick={() => {
                  setIsServiceId(record.id);
                }}
                style={{ cursor: "pointer" }}
              />
            </Popconfirm>
          </Tag>
        </>
      ),
      fixed: width < 1000 && "right",
    },
  ];

  function cancel(e) {}
  function confirm(e) {
    setLoading(true);
    servicesService
      .deleteService(isServiceId)
      .then((resp) => {
        if (resp.status === 202) {
          message.success("Service deleted successfully");
          getServices();
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log("Error deleting \n", e);
        setLoading(false);
      });
  }
  useEffect(() => {
    getServices();
  }, []);

  const getServices = (params) => {
    setLoading(true);
    servicesService
      .fetchServices(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setServices(content);
        setTotalElements(resp.data?.page_details?.total_elements || 0);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const handleTableChange = (data) => {
    let current_page = {
      pageNo: Number(data?.current - 1),
      pageSize: data?.pageSize,
    };
    setSearchParams({ ...searchParams, ...current_page });
    setPage(current_page);
  };

  return (
    <div>
      <Card
        type="inner"
        title={
          <>
            <ArrowLeftOutlined
              onClick={() => history.goBack()}
              className="arrow-left"
              style={{
                fontSize: "1.15em",
                cursor: "pointer",
                marginRight: "10px",
              }}
            />
            <span>Services</span>
          </>
        }
        extra={
          <Button
            size="small"
            type="primary"
            onClick={() => {
              history.push({
                pathname: "/settings/system/services/edit-service",
                state: { isAddNew: true },
              });
            }}
          >
            Add Service
          </Button>
        }
      >
        <Row gutter={[12, 24]}></Row>
        <Row className="mt-2">
          <Col span={24}>
            <Table
              size={"small"}
              onChange={handleTableChange}
              columns={columns}
              dataSource={services}
              rowKey={(record) => Math.random()}
              loading={isLoading}
              scroll={{ x: width < 1000 && 900 }}
              pagination={{
                pageSize: page.pageSize,
                current: page?.pageNo + 1,
                total: total_elements,
              }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ServicesSetup;
