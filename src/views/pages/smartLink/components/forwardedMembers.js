import React, { useEffect, useState } from "react";
import { membersService } from "_services";
import { Table, Card, Row, Col, Input, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import moment from "moment";
import Tag from "antd/es/tag";
import windowsDimension from "constants/DeviceSize";

const ForwardedMembers = () => {
  const dateRange = `${moment().format("YYYY-MM-DD")}..${moment().format(
    "YYYY-MM-DD"
  )}`;

  const [data, setData] = useState([]);
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [page, setPage] = useState(defaultPage);
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
    dateRange,
  });
  const [total_elements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const { width } = windowsDimension();
  const { RangePicker } = DatePicker;

  const prefix = <SearchOutlined />;

  useEffect(() => {
    getMembers(searchParams);
  }, [searchParams]);

  const columns = [
    {
      title: "Member Name",
      dataIndex: "member_name",
      width: "15%",
      sorter: (a, b) => a.member_name.length - b.member_name.length,
      sortDirections: ["descend", "ascend"],
      fixed: "left",
    },
    {
      title: "Country",
      dataIndex: "policy_country",
      width: "9%",
      sorter: (a, b) => a.policy_country - b.policy_country,
      sortDirections: ["descend", "ascend"],
      render: (text, row) => (
        <>
          <Tag color="success">
            <span>{text}</span>
          </Tag>
        </>
      ),
    },

    {
      title: "Medical Scheme",
      dataIndex: "medicalaid_scheme_name",
      width: "15%",
    },

    {
      title: "Medical Aid Code",
      dataIndex: "medicalaid_code",
      width: "14%",
    },
    {
      title: "Medical Aid No",
      dataIndex: "medicalaid_number",
      width: "15%",
    },
    {
      title: "Medical Aid Reg and Exp Date",
      dataIndex: ["medicalaid_regdate", "medicalaid_expiry"],
      width: "20%",
      render: (text, record) => (
        <>
          <Tag color="purple">
            <span>
              {record.medicalaid_regdate &&
                moment(record.medicalaid_regdate).format("YYYY-MM-DD")}{" "}
              {record.medicalaid_expiry &&
                "- " + moment(record.medicalaid_expiry).format("YYYY-MM-DD")}
            </span>
          </Tag>
        </>
      ),
    },
  ];

  const getMembers = (params) => {
    setLoading(true);
    membersService
      .fetchMembers(params)
      .then((resp) => {
        let respData = resp.data;
        setData(respData?.content || []);
        setTotalElements(respData.page_details?.total_elements || 0);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const handleSearchByMedicalAidCode = debounce((value) => {
    let params;

    if (value) {
      params = {
        medicalaidCode: value,
      };
    } else {
      params = {
        medicalaidCode: null,
      };
    }

    setSearchParams({ ...searchParams, ...defaultPage, ...params });
    setPage(defaultPage);
  }, 500);

  const handleSearchByMedicalAidNumber = debounce((value) => {
    let params;
    if (value) {
      params = {
        memberaidNumber: value,
      };
    } else {
      params = {
        memberaidNumber: null,
      };
    }

    setSearchParams({ ...searchParams, ...defaultPage, ...params });
    setPage(defaultPage);
  }, 500);

  const handleSearchDateRange = (data) => {
    let params;
    if (data) {
      if (!data.length < 1) {
        let date = `${data[0].format("YYYY-MM-DD")}..${data[1].format(
          "YYYY-MM-DD"
        )}`;
        params = { dateRange: date };

        setSearchParams({ ...searchParams, ...defaultPage, ...params });
        setPage(defaultPage);
      }
    } else {
      params = { dateRange: null };
    }

    setSearchParams({ ...searchParams, ...defaultPage, ...params });
    setPage(defaultPage);
  };
  const handleTableChange = (data) => {
    let current_page = {
      pageNo: Number(data?.current - 1),
      pageSize: 10,
    };

    let params = {
      ...searchParams,
      ...current_page,
    };

    setSearchParams({ ...searchParams, ...params });
    setPage(current_page);
  };

  return (
    <div id="content">
      <Card size="small" title="Member List">
        <Row className="d-flex justify-content-end" gutter={[10, 10]}>
          <Col lg={5} md={8} sm={24} xs={24}>
            <Input
              size="small"
              prefix={prefix}
              placeholder="Medical aid code"
              allowClear={true}
              onChange={(e) => handleSearchByMedicalAidCode(e.target.value)}
            />
          </Col>
          <Col lg={5} md={8} sm={24} xs={24}>
            <Input
              size="small"
              prefix={prefix}
              placeholder="Medical aid no"
              allowClear={true}
              onChange={(e) => handleSearchByMedicalAidNumber(e.target.value)}
            />
          </Col>
          <Col lg={5} md={8} sm={24} xs={24}>
            <RangePicker
              size="small"
              separator={"~"}
              style={{ width: "100%" }}
              defaultValue={[moment(), moment()]}
              onChange={handleSearchDateRange}
            />
          </Col>
        </Row>

        <Row className="mt-2">
          <Col span={24}>
            <Table
              columns={columns}
              size={"small"}
              dataSource={data}
              loading={isLoading}
              scroll={{ x: width < 1000 && 900, y: 350 }}
              rowKey={(record) => Math.random()}
              onChange={handleTableChange}
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

export default ForwardedMembers;
