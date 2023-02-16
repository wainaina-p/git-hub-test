import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Descriptions } from 'antd';
import { Link } from 'react-router-dom';
import {
  faHeartbeat,
  faMedkit,
  faFlask,
  faScissors,
  faStethoscope,
  faUserMd,
  faPills,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { servicePointsService } from '_services';

const ServicePoint = () => {
  const [currentServicePoint, setCurrentServicePoint] = useState([]);

  useEffect(() => {
    getServicePoints();
  }, []);

  const getServicePoints = (params) => {

    params = { ...params, facilityId:  localStorage.getItem('facility_id') };
    servicePointsService
      .fetchServicePointsAndPatientOnQueue(params)
      .then((resp) => {
        let respData = resp?.data || [];
        setCurrentServicePoint(respData);
      });
  };

  return (
    <div>
      <Card type='inner' title='Queue Management'>
        <Row></Row>
        <Row gutter={[9, 12]}>
          {currentServicePoint.map((servicePoint, index) => (
            <Col lg={6} md={8} sm={12} xs={24} key={index}>
              <Link
                to={{
                  pathname: `queue/point/${
                    servicePoint?.service_point_name
                      ? servicePoint?.service_point_name.toLowerCase()
                      : servicePoint?.id
                  }`,
                  state: servicePoint,
                }}
              >
                <Card
                  title={null}
                  style={{
                    boxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                    WebkitBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                    MozBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                    margin: 0,
                    padding: 0,
                  }}
                  hoverable
                >
                  <Descriptions
                    style={{ margin: 0, padding: 0 }}
                    title={
                      (servicePoint.service_point_name === 'Triage' && (
                        <span>
                          <FontAwesomeIcon
                            icon={faHeartbeat}
                            style={{ marginRight: '7px', color: '#a90329' }}
                          />
                          {servicePoint.service_point_name}
                        </span>
                      )) ||
                      (servicePoint.service_point_name === 'Consultation' && (
                        <span>
                          <FontAwesomeIcon
                            icon={faUserMd}
                            style={{ marginRight: '7px', color: '#87cc38' }}
                          />
                          {servicePoint.service_point_name}
                        </span>
                      )) ||
                      (servicePoint.service_point_name === 'Pharmacy' && (
                        <span>
                          <FontAwesomeIcon
                            icon={faPills}
                            style={{ marginRight: '7px', color: '#356e35' }}
                          />
                          {servicePoint.service_point_name}
                        </span>
                      )) ||
                      (servicePoint.service_point_name === 'Laboratory' && (
                        <span>
                          <FontAwesomeIcon
                            icon={faFlask}
                            style={{ marginRight: '7px', color: '#b09b5b' }}
                          />
                          {servicePoint.service_point_name}
                        </span>
                      )) ||
                      (servicePoint.service_point_name === 'Procedures' && (
                        <span>
                          <FontAwesomeIcon
                            icon={faScissors}
                            style={{
                              marginRight: '7px',
                              color: '#a90329',
                            }}
                          />
                          {servicePoint.service_point_name}
                        </span>
                      )) ||
                      (servicePoint.service_point_name === 'Radiology' && (
                        <span>
                          <FontAwesomeIcon
                            icon={faStethoscope}
                            style={{ marginRight: '7px', color: '#4d8bac' }}
                          />
                          {servicePoint.service_point_name}
                        </span>
                      )) || (
                        <span>
                          <FontAwesomeIcon
                            icon={faMedkit}
                            style={{ marginRight: '7px', color: '#87d068' }}
                          />
                          {servicePoint.service_point_name}
                        </span>
                      )
                    }
                    column={24}
                  >
                    <Descriptions.Item
                      span={24}
                      label={
                        <span style={{ color: '#87d068', fontWeight: 'bold' }}>
                          Scheduled Appt
                        </span>
                      }
                    >
                      <span style={{ color: '#87d068' }}>
                        {Number(
                          servicePoint?.total_patient_with_status_pre_arrival +
                            servicePoint?.total_patient_with_status_active
                        ) || 0}
                      </span>
                    </Descriptions.Item>

                    <Descriptions.Item
                      span={24}
                      label={
                        <span style={{ color: '#1089ff', fontWeight: 'bold' }}>
                          In-Queue
                        </span>
                      }
                    >
                      <span style={{ color: '#1089ff' }}>
                        {servicePoint?.total_patient_with_status_active || 0}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item
                      span={24}
                      label={
                        <span style={{ color: '#ff6f26', fontWeight: 'bold' }}>
                          Pre-Arrival
                        </span>
                      }
                    >
                      <span style={{ color: '#ff6f26' }}>
                        {servicePoint?.total_patient_with_status_pre_arrival ||
                          0}
                      </span>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default ServicePoint;
