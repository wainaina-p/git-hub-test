import React, { useEffect, useState } from "react";
import { Row, Col, Table, Input, Select, Popconfirm, message } from "antd";
import { useHistory } from "react-router-dom";
import {
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { doctorColumns } from "./columns";
import windowsDimension from "constants/DeviceSize";
import { doctorService } from "_services";
import { specializations } from "_components/allSearch/DoctorSearch/specializations";
import { debounce } from "lodash";

const { Option } = Select;
const Doctors = (props) => {
  const history = useHistory();
  const { width } = windowsDimension();
  const [doctors, setDoctors] = useState([]);
  const [isDoctorId, setIsDoctorId] = useState();
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [page, setPage] = useState({ ...defaultPage });
  const [isLoading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
    showDoctorFacilities: true,
  });

  useEffect(() => {
    getDoctors(searchParams);
  }, [searchParams]);

  const getDoctors = async (params) => {
    setLoading(true);
    try {
      let response = await doctorService.fetchAllDoctors(params);

      let data = response.data;

      setDoctors(data?.content || []);
      setTotalElements(data?.page_details?.total_elements || 0);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
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

  const handleOnSelect = (val) => {
    let params = { ...searchParams };
    if (val) {
      params = { ...params, ...defaultPage, specialization: val };
    } else {
      params = { ...params, specialization: null };
    }

    setSearchParams(params);
    setPage(defaultPage);
  };

  const handleSearchChange = debounce((val) => {
    let params = { ...searchParams };
    if (val) {
      params = { ...params, ...defaultPage, term: val };
    } else {
      params = { ...params, term: null };
    }

    setSearchParams(params);
    setPage(defaultPage);
  }, 700);

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

  function cancel() {}
  function confirm() {
    setLoading(true);
    doctorService
      .deleteDoctor(isDoctorId)
      .then((resp) => {
        if (resp.status === 200) {
          message.success("Doctor profile deleted successifully");
          getDoctors();
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log("Error Deleting \n", e);
        setLoading(false);
      });
  }

  const columns = [
    ...doctorColumns,
    {
      title: null,
      dataIndex: "action",
      key: "action",
      width: "7%",
      render: (text, row) => (
        <>
          <Row gutter={[10, 10]} className="d-flex">
            <Col span={8}>
              <EyeOutlined
                className="action-icon"
                style={{ color: "#66c938", opacity: "0.85" }}
                onClick={() => {
                  history.push({
                    pathname: "/provider-setup/view-doctor",
                    state: { doctorRowData: row },
                  });
                }}
              />
            </Col>

            <Col span={8}>
              <EditOutlined
                className="action-icon"
                style={{ color: "#1089ff", opacity: "0.85" }}
                onClick={() => {
                  history.push({
                    pathname: "/provider-setup/edit-doctor",
                    state: { editing: true, doctorRowData: row },
                  });
                }}
              />
            </Col>
            <Col span={8}>
              <Popconfirm
                placement="topRight"
                title="Are you sure to delete this doctor?"
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
                    setIsDoctorId(row.id);
                  }}
                  style={{
                    cursor: "pointer",
                    color: "#f70505",
                    opacity: "0.85",
                  }}
                />
              </Popconfirm>
            </Col>
          </Row>
        </>
      ),
      fixed: width < 1000 && "right",
    },
  ];
  return (
    <>
      <Row gutter={[8, 12]} className="mb-3">
        <Col span={24} className="d-flex justify-content-end">
          <Col lg={6} md={8} sm={12} xs={24}>
            <Input
              allowClear
              onChange={(e) => handleSearchChange(e.target?.value)}
              prefix={<SearchOutlined />}
              placeholder="Search..."
            />
          </Col>
          <Col lg={6} md={8} sm={12} xs={24}>
            <Select
              placeholder="Specialization"
              style={{ width: "100%" }}
              showSearch
              onSelect={handleOnSelect}
            >
              <Option
                value={""}
                key={"empty"}
                style={{ color: "rgba(0,0,0,0.35)" }}
              >
                - Select specialization -
              </Option>
              {specializations.map((item, index) => (
                <Option value={item} key={index}>
                  {formatString(item)}
                </Option>
              ))}
            </Select>
          </Col>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col span={24}>
          <Table
            dataSource={doctors}
            size="small"
            loading={isLoading}
            onChange={handleTableChange}
            columns={columns}
            rowKey={(record) => record.id}
            pagination={{
              pageSize: page.pageSize,
              current: page?.pageNo + 1,
              total: totalElements,
            }}
            scroll={{ x: width < 1000 && 950 }}
          />
        </Col>
      </Row>
    </>
  );
};

export default Doctors;
