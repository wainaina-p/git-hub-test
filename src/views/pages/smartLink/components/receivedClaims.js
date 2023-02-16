import React, { useEffect, useState } from "react";
import { claimsService } from "_services";
import { Table, Card, Row, Col, Input, DatePicker, Select } from "antd";
import ClaimDetails from "./claimDetails";
import "./css/index.css";
import { exchangeLocationsService } from "_services";
import PerfectScrollbar from "react-perfect-scrollbar";
import { receivedClaimsColumns } from "./receivedClaimsColumns";
import debounce from "lodash/debounce";
import moment from "moment";
import windowsDimension from "constants/DeviceSize";
import InvoiceLineItems from "./InvoiceLineItems";
import {
  SearchOutlined,
  ArrowRightOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import "./css/index.css";

const ReceivedClaims = () => {
  const dateRange = `${moment().format("YYYY-MM-DD")}..${moment().format(
    "YYYY-MM-DD"
  )}`;
  const [dataSource, setData] = useState([]);
  const defaultPage = { pageNo: 0, pageSize: 9 };
  const [page, setPage] = useState(defaultPage);
  const [total_elements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [currentClaimData, setCurrentClaimData] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [exchangeLocations, setExchangeLocations] = useState([]);
  const { width } = windowsDimension();
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
    dateRange,
  });
  const { RangePicker } = DatePicker;
  const prefix = <SearchOutlined />;
  const { Option } = Select;

  useEffect(() => {
    getClaims(searchParams);
  }, [searchParams]);

  useEffect(() => {
    getExchageLocations();
  }, []);

  const getExchageLocations = (params) => {
    exchangeLocationsService
      .getAllExchangeLocations(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setExchangeLocations(content);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = [
    ...receivedClaimsColumns,
    {
      title: "#",
      dataIndex: "status",
      key: "status",
      width: "3%",
      fixed: "right",

      render: (text, row) => (
        <>
          <span>
            {currentClaimData && currentClaimData === row ? (
              <ArrowRightOutlined
                style={{ color: "#2db7f5" }}
                type="arrow-right"
              />
            ) : (
              <SwapRightOutlined
                style={{ color: "#c7c7c7" }}
                type="swap-right"
              />
            )}
          </span>
        </>
      ),
    },
  ];

  const getClaims = (params) => {
    claimsService
      .fetchClaims(params)
      .then((resp) => {
        let respData = resp?.data;
        setData(respData?.content || []);
        let content = respData?.content || [];

        if (content.length > 0) {
          setCurrentClaimData(content[0]);
          setInvoiceData(content[0].invoices[0]?.lines);
        } else {
          setCurrentClaimData(null);
          setInvoiceData(null);
        }

        setTotalElements(respData.page_details?.total_elements || 0);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const handleSelectByStatus = (value) => {
    let params;

    if (value) {
      params = {
        claimStatus: value,
      };
    } else {
      params = {
        claimStatus: null,
      };
    }
    setSearchParams({ ...searchParams, ...defaultPage, ...params });
    setPage(defaultPage);
  };
  const handleSelectByVisitType = (value) => {
    let params;

    if (value) {
      params = {
        visitType: value,
      };
    } else {
      params = {
        visitType: null,
      };
    }
    setSearchParams({ ...searchParams, ...defaultPage, ...params });
    setPage(defaultPage);
  };

  const handleSearchByScheme = debounce((value) => {
    let params;

    if (value) {
      params = {
        schemeCode: value,
      };
    } else {
      params = {
        schemeCode: null,
      };
    }

    setSearchParams({ ...searchParams, ...defaultPage, ...params });
    setPage(defaultPage);
  }, 500);

  const handleSearchByServicePointID = debounce((value) => {
    let params;

    if (value) {
      params = {
        servicePointId: value,
      };
    } else {
      params = {
        servicePointId: null,
      };
    }

    setSearchParams({ ...searchParams, ...defaultPage, ...params });
    setPage(defaultPage);
  }, 500);

  const handleSearchByPayerCode = debounce((value) => {
    let params;

    if (value) {
      params = {
        payerCode: value,
      };
    } else {
      params = {
        payerCode: null,
      };
    }

    setSearchParams({ ...searchParams, ...defaultPage, ...params });
    setPage(defaultPage);
  }, 500);

  const handleTableChange = (data) => {
    let current_page = {
      pageNo: Number(data?.current - 1),
      pageSize: data?.pageSize,
    };

    let params = {
      ...searchParams,
      ...current_page,
    };
    setPage(current_page);
    setSearchParams({ ...searchParams, ...params });
  };
  const handleSearchDateRange = (data) => {
    let params;
    if (data) {
      if (!data.length < 1) {
        let date = `${data[0].format("YYYY-MM-DD")}..${data[1].format(
          "YYYY-MM-DD"
        )}`;
        params = { dateRange: date };

        setSearchParams({ ...searchParams, ...defaultPage, ...params });
      }
    } else {
      params = { dateRange: null };
    }

    setSearchParams({ ...searchParams, ...defaultPage, ...params });
  };

  const handleSearch = debounce((val) => {
    if (val) {
      setSearchParams({ ...searchParams, ...defaultPage, term: val });
    } else {
      setSearchParams({ ...searchParams, ...defaultPage, term: null });
    }
    setPage(defaultPage);
  }, 700);

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
    <div id="content">
      <Card size="small" title="Received Claims List">
        <Row
          type="flex"
          className="d-flex justify-content-end"
          gutter={[16, 16]}
        >
          <Col lg={4} md={8} sm={12} xs={24}>
            <Input
              size="small"
              prefix={prefix}
              placeholder="Search "
              allowClear={true}
              onChange={(e) => handleSearch(e?.target?.value || null)}
            />
          </Col>
          <Col lg={4} md={8} sm={12} xs={24}>
            <Select
              size="small"
              showSearch
              allowClear
              placeholder="Select status"
              onSelect={handleSelectByStatus}
              style={{ width: "100%" }}
            >
              <Option
                value={""}
                key={"empty"}
                style={{ color: "rgba(0,0,0,0.35)" }}
              >
                - Select status -
              </Option>
              <Option key="Pending" value="Pending">
                Pending
              </Option>
              <Option key="Billed" value="Billed">
                Billed
              </Option>
              <Option key="Cancelled" value="Cancelled">
                Cancelled
              </Option>
            </Select>
          </Col>
          <Col lg={4} md={8} sm={12} xs={24}>
            <Input
              size="small"
              prefix={prefix}
              placeholder="Scheme code"
              allowClear={true}
              onChange={(e) => handleSearchByScheme(e.target.value)}
            />
          </Col>

          <Col lg={4} md={8} sm={12} xs={24}>
            <Select
              size="small"
              showSearch
              allowClear
              placeholder="Select visit type"
              onSelect={handleSelectByVisitType}
              style={{ width: "100%" }}
            >
              <Option
                value={""}
                key={"empty"}
                style={{ color: "rgba(0,0,0,0.35)" }}
              >
                - Select visit type -
              </Option>
              <Option key="Inpatient" value="Inpatient">
                Inpatient
              </Option>
              <Option key="Outpatient" value="Outpatient">
                Outpatient
              </Option>
              =
            </Select>
          </Col>
          <Col lg={4} md={8} sm={12} xs={24}>
            <Select
              size="small"
              showSearch
              allowClear
              placeholder="Select exchange location"
              onChange={handleSearchByServicePointID}
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
                - Select exchange location -
              </Option>
              {exchangeLocations &&
                exchangeLocations.map((ExchangeLocation, index) => (
                  <Option key={index} value={ExchangeLocation.sp_id}>
                    {formatString(ExchangeLocation.location_description)}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col lg={4} md={8} sm={12} xs={24}>
            <Input
              size="small"
              prefix={prefix}
              placeholder="Payer code"
              allowClear={true}
              onChange={(e) => handleSearchByPayerCode(e.target.value)}
            />
          </Col>

          <Col lg={8} md={8} sm={12} xs={24}>
            <RangePicker
              size="small"
              separator={"~"}
              style={{ width: "100%" }}
              defaultValue={[moment(), moment()]}
              onChange={handleSearchDateRange}
            />
          </Col>
        </Row>

        <Row type="flex" gutter={[24, 16]} className="mt-3">
          <Col lg={12} md={24} sm={24}>
            <PerfectScrollbar
              style={{ height: width < 1000 ? "50vh" : "70vh" }}
            >
              <Table
                columns={columns}
                size={"small"}
                dataSource={dataSource}
                scroll={{ x: 700 }}
                rowKey={(record) => Math.random()}
                loading={isLoading}
                rowClassName={(record, index) =>
                  currentClaimData && currentClaimData === record
                    ? "table-row-selected"
                    : "table-row-not-selected"
                }
                onChange={handleTableChange}
                onRow={(row) => {
                  return {
                    onClick: (event) => {
                      setCurrentClaimData(row);
                      setInvoiceData(row.invoices[0]?.lines);
                    },
                  };
                }}
                pagination={{
                  pageSize: page.pageSize,
                  current: page.pageNo + 1,
                  total: total_elements,
                }}
              />
            </PerfectScrollbar>
          </Col>
          <Col lg={12} md={24} sm={24}>
            {currentClaimData ? (
              <div>
                <ClaimDetails claimDetails={currentClaimData} />
              </div>
            ) : null}
          </Col>
          {invoiceData && (
            <Col span={24}>
              {" "}
             {invoiceData && <InvoiceLineItems invoiceLineData={invoiceData} />}
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default ReceivedClaims;
