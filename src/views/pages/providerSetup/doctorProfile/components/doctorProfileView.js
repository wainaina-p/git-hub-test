import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Descriptions, Avatar, Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { doctorService, servicePointsService } from '_services';
import { UserOutlined } from '@ant-design/icons';
import '../assets/index.css';
import { doctorAvailability } from './columns';
import { doctorFacilities } from './columns';
import windowsDimension from 'constants/DeviceSize';

const DoctorProfileView = (props) => {
  const doctorData = props.location.state;
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [servicePoints, setServicePoints] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [doctorFormattedFacilities, setDoctorfacilities] = useState([]);
  const { width } = windowsDimension();
  const doctorFacilitiesColumns = [
    ...doctorFacilities,
    {
      title: 'Service Point',
      dataIndex: 'service_point_id',
      key: 'service_point_id',
      render: (text, row) => (
        <>
          {servicePoints
            .filter(function (servicePoint) {
              return servicePoint.id === parseInt(row.service_point_id);
            })
            .map(function (servicePoint) {
              return servicePoint.service_point_name;
            }) || ''}
        </>
      ),
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
    },
  ];

  useEffect(() => {
    if (doctorData?.doctorRowData) {
      let data = doctorData?.doctorRowData;
      getServicePoints({ facilityId: localStorage.getItem('facility_id') });

      getDoctor({ doctorLicense: data?.doctor_license });
    }
  }, [doctorData]);

  const formatString = (val) => {
    let newVal;
    if (val) {
      val = val.toLocaleLowerCase();
      newVal = val.charAt(0).toUpperCase() + val.slice(1);
      newVal = newVal.replaceAll('_', ' ');
    }
    return newVal;
  };

  const getDoctor = async (params) => {
    setLoading(true);
    params = {
      ...params,
      pageNo: 0,
      pageSize: 9,
      showDoctorFacilities: true,
      showDoctorAvailability: true,
      showDoctorServicePoints: true,
    };

    try {
      let response = await doctorService.fetchAllDoctors(params);

      let data = response.data;

      let doctorData = data?.content[0] || null;

      let formattedFacilities = [];
      let fac = doctorData.doctor_facilities;
      for (let x = 0; x < fac.length; x++) {
        formattedFacilities.push({
          ...fac[x],
          service_point_id:
            doctorData.doctor_service_points[x].service_point_id,
        });
      }

      setDoctorfacilities(formattedFacilities);
      setDoctorDetails(doctorData);
      setLoading(false);
    } catch (e) {}
  };
  const getServicePoints = async (params) => {
    try {
      let response = await servicePointsService.fetchServicePoints(params);

      let respContent = response.data?.content || [];
      setServicePoints(respContent);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Card
        loading={isLoading}
        type='inner'
        title={
          <>
            <FontAwesomeIcon
              icon={faArrowLeft}
              className='arrow-left'
              style={{ cursor: 'pointer', marginRight: '8px' }}
              onClick={() => {
                history.push({
                  pathname: '/provider-setup',
                  state: { isFromDoctorForm: true },
                });
              }}
            />{' '}
            <span>Doctor Profile</span>
          </>
        }
      >
        <Row className='d-flex flex-column align-items-center text-center'>
          <div>
            <div className='banner'></div>

            <Avatar
              className='img-circle mx-auto mb-0'
              size={100}
              icon={<UserOutlined />}
            />
            {doctorDetails?.full_name && (
              <div className=' mb-1'>
                <h3> {doctorDetails?.full_name}</h3>
              </div>
            )}
            {doctorDetails?.specialization && (
              <div>
                <h6>
                  {' '}
                  {formatString(doctorDetails?.specialization)} specialist
                </h6>
              </div>
            )}
          </div>
        </Row>
        <Row gutter={[12, 16]}>
          <Col
            lg={doctorDetails.doctor_availability?.length > 0 ? 8 : 24}
            md={doctorDetails.doctor_availability?.length > 0 ? 8 : 24}
            sm={24}
            xs={24}
          >
            <Card
              title='Basic Information'
              headStyle={{ backgroundColor: '#dbd9d9' }}
              style={{
                boxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                WebkitBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                MozBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                margin: 0,
                padding: 0,
              }}
            >
              <Descriptions
                key='0'
                layout={
                  doctorDetails.doctor_availability?.length > 0
                    ? 'vertical'
                    : 'horizontal'
                }
                size='small'
                bordered
              >
                <Descriptions.Item span={3} label='Doctor Licence:'>
                  {doctorDetails?.doctor_license || ''}
                </Descriptions.Item>

                <Descriptions.Item key='1' span={3} label='Email:'>
                  <a href={`mailto:${doctorDetails?.emailAddress}`}>
                    {doctorDetails?.emailAddress}
                  </a>
                </Descriptions.Item>

                <Descriptions.Item key='2' span={3} label='Primary Contact:'>
                  <a href={`tel:${doctorDetails.primary_contact}`}>
                    <span>{doctorDetails.primary_contact}</span>
                  </a>
                </Descriptions.Item>
                <Descriptions.Item key='2' span={3} label='Secondary Contact:'>
                  <a href={`tel:${doctorDetails.secondary_contact}`}>
                    <span>{doctorDetails.secondary_contact}</span>
                  </a>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {doctorDetails.doctor_availability?.length > 0 && (
            <Col lg={16} md={16} sm={24} xs={24}>
              {doctorDetails.doctor_availability?.length > 0 && (
                <Col className=' mb-4' lg={24} md={24} sm={24} xs={24}>
                  <Card
                    headStyle={{ backgroundColor: '#dbd9d9' }}
                    title='Doctor Availability'
                    style={{
                      boxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                      WebkitBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                      MozBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <Table
                      dataSource={doctorDetails?.doctor_availability}
                      size='small'
                      loading={isLoading}
                      columns={doctorAvailability}
                      rowKey={(record) => record.id}
                      scroll={{ x: width < 600 && 250 }}
                    />
                  </Card>
                </Col>
              )}
              {doctorFacilities?.length > 0 && (
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Card
                    title='Doctor Facilities'
                    headStyle={{ backgroundColor: '#dbd9d9' }}
                    style={{
                      boxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                      WebkitBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                      MozBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <Table
                      dataSource={doctorFormattedFacilities}
                      size='small'
                      loading={isLoading}
                      columns={doctorFacilitiesColumns}
                      rowKey={(record) => record.id}
                      scroll={{ x: width < 600 && 250 }}
                    />
                  </Card>
                </Col>
              )}
            </Col>
          )}

          <Col span={24}>
            {doctorDetails?.profile_description && (
              <Card
                title='Profile Description'
                headStyle={{ backgroundColor: '#dbd9d9' }}
                style={{
                  boxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                  WebkitBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                  MozBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                  margin: 0,
                  padding: 0,
                }}
              >
                <p>{doctorDetails?.profile_description}</p>
              </Card>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default DoctorProfileView;
