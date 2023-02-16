import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  Table,
  Tag,
  Popconfirm,
  message,
  Select,
  Input,
} from "antd";
import "../../assets/style.css";
import { useHistory } from "react-router-dom";
import { codeManagementColumns } from "./columns";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import windowsDimension from "constants/DeviceSize";
import { codeValuesService } from "_services";
import debounce from "lodash.debounce";

const CodeManagement = () => {
  const history = useHistory();
  const [codeValues, setCodeValues] = useState([]);
  const [codeTypes, setCodeTypes] = useState();
  const [isCodeValueId, setIsCodeValuesId] = useState();
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [page, setPage] = useState(defaultPage);
  const [searchParams, setSearchParams] = useState({ ...defaultPage });
  const [total_elements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const { width } = windowsDimension();
  const prefix = <SearchOutlined />;
  const { Option } = Select;
  const columns = [
    ...codeManagementColumns,
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
                pathname: "/settings/system/codes/edit-codes-value",
                state: { codeValueInfo: record, codeTypes: codeTypes },
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
              title="Are you sure to delete this code value?"
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
                  setIsCodeValuesId(record.id);
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
    codeValuesService
      .deleteCodeValue(isCodeValueId)
      .then((resp) => {
        if (resp.status === 202) {
          message.success("Code value deleted successfully");
          getCodeValues();
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log("Error deleting \n", e);
        setLoading(false);
      });
  }
  useEffect(() => {
    getCodeValues(searchParams);
  }, [searchParams]);

  useEffect(() => {
    getCodeTypes();
  }, []);

  const getCodeValues = (params) => {
    setLoading(true);
    codeValuesService
      .getCodevalues(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setCodeValues(content);
        setTotalElements(resp.data?.page_details?.total_elements || 0);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const getCodeTypes = (params) => {
    setLoading(true);
    codeValuesService
      .getCodeTypes(params)
      .then((resp) => {
        let codes_type = resp?.data || [];
        setCodeTypes(codes_type);
        setTotalElements(resp.data?.page_details?.total_elements || 0);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const handleSearchByCodeType = (value) => {
    let params;
    if (value) {
      params = {
        codes: value,
        ...defaultPage,
      };
    } else {
      params = {
        codes: null,
        ...defaultPage,
      };
    }
    setSearchParams(params);
    setPage(defaultPage);
  };
  const handleTableChange = (data) => {
    let current_page = {
      pageNo: Number(data?.current - 1),
      pageSize: data?.pageSize,
    };
    setSearchParams({ ...searchParams, ...current_page });
    setPage(current_page);
  };
  const handleSearchByCodeValue = debounce((val) => {
    if (val) {
      setSearchParams({ ...searchParams, ...defaultPage, CodeValue: val });
    } else {
      setSearchParams({ ...searchParams, ...defaultPage, CodeValue: null });
    }
    setPage(defaultPage);
  }, 700);

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
            <span>Manage Codes</span>
          </>
        }
        extra={
          <Button
            size="small"
            type="primary"
            onClick={() => {
              history.push({
                pathname: "/settings/system/codes/edit-codes-value",
                state: { isAddNew: true, codeTypes: codeTypes },
              });
            }}
          >
            Add Code Value
          </Button>
        }
      >
        <Row gutter={[12, 24]}>
          <Col lg={7} md={7} sm={12} xs={24}>
            <Select
              showSearch
              allowClear
              placeholder="Search code type"
              onChange={handleSearchByCodeType}
              style={{ width: "100%" }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option
                value={""}
                key={"empty"}
                style={{ color: "rgba(0,0,0,0.35)" }}
              >
                - Select code type -
              </Option>
              {codeTypes &&
                codeTypes.map((codeTypes, index) => (
                  <Option key={index} value={codeTypes}>
                    {codeTypes}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col lg={7} md={7} sm={12} xs={24}>
            <Input
              prefix={prefix}
              placeholder="Search code value"
              allowClear={true}
              onChange={(e) =>
                handleSearchByCodeValue(e?.target?.value || null)
              }
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col span={24}>
            <Table
              size={"small"}
              onChange={handleTableChange}
              columns={columns}
              dataSource={codeValues}
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

export default CodeManagement;
