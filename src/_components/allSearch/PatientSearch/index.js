import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Input, Modal } from 'antd';
import { SearchOutlined, DeleteTwoTone } from '@ant-design/icons';
import { debounce } from 'lodash';
import { patientColumns as columns } from './columns';
import { staffsService } from '_services';

export const PatientSearch = ({ size = 'small', ...props }) => {
  const start_page = { page: 1, pageSize: 10 };

  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState({ ...start_page });
  const [searchParams, setSearchParams] = useState({ ...start_page });
  const [total_elements, setTotalElements] = useState(10);
  const [search, setSearch] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatients(searchParams);
  }, [searchParams]);

  useEffect(() => {
    if (props?.selectedPatient) {
      let patient = props?.selectedPatient;
      setValue(
        `${patient?.firstName ? patient?.firstName : ''} ${
          patient?.surname ? patient?.surname : ''
        } ${patient?.secondName ? patient?.secondName : ''} `
      );
      setDisabled(true);
    }
  }, [props?.selectedPatient]);

  const getPatients = async (params) => {
    try {
      let response = await staffsService.fetchStaff(params);

      let data = response.data;

      setPatients(data?.content || []);
      setTotalElements(
        data.page_details ? data.page_details.total_elements : 10
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = (e) => {
    setVisible(false);
  };

  const handleSearch = debounce((params) => {
    setSearchParams({ term: params, ...start_page });
    setSearch(params);
    setPage(start_page);
  }, 500);

  const handleTableChange = (value) => {
    let current_page = { page: value.current, pageSize: 10 };
    let params = { search, ...current_page };

    setSearchParams(params);
    setPage(current_page);
  };

  const handleRowClick = (record) => {
    return {
      onClick: (event) => {
        props.patient(record);
        setValue(
          `${record?.firstName ? record?.firstName : ''} ${
            record?.surname ? record?.surname : ''
          } ${record?.secondName ? record?.secondName : ''} `
        );
        setDisabled(true);
        setVisible(false);
        setSearchParams(start_page);
        setSearch(null);
        setPage(start_page);
      },
    };
  };

  const handleClear = (params) => {
    setValue(null);
    setDisabled(false);
    props.patient(null);
    setSearchParams(start_page);
    setPage(start_page);
  };

  return (
    <>
      <Input
        size={size}
        defaultValue={value}
        value={value}
        suffix={<SearchOutlined />}
        addonAfter={
          <DeleteTwoTone twoToneColor='#c42b1c' onClick={handleClear} />
        }
        placeholder='Search patient'
        onClick={showModal}
        disabled={disabled}
      />

      <Modal
        destroyOnClose={true}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <Row className='d-flex justify-content-start'>
          <Col span={6}>
            <Input
              allowClear
              size='small'
              suffix={<SearchOutlined />}
              placeholder='search...'
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
        </Row>
        <br />
        <Table
          columns={columns}
          dataSource={patients}
          pagination={{
            current: page.page,
            pageSize: 10,
            total: total_elements,
          }}
          onChange={handleTableChange}
          size='small'
          bordered
          loadinghandlePatient={isLoading}
          onRow={handleRowClick}
          rowKey={(data) => data.id}
        />
      </Modal>
    </>
  );
};
