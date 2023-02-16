import React, { useState } from 'react';
import { Statistic, Button, Col, Row } from 'antd';

const Home = (props) => {
  const [appointmentCounter, setAppointmentCounter] = useState(1);

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col md={8} sm={24}  xs={24}>
          <Statistic
            style={{
              padding: '14px',
              backgroundColor: '#F9F9F9',
              color: 'rgb(0, 0, 0)',
              backgroundImage:
                'linear-gradient(to bottom right, #F9F9F9 , #FFFFFF)',

              boxShadow:
                '0 2px 3px 0 rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
            title='Active Visits'
            groupSeparator={','}
            value={appointmentCounter}
            valueStyle={{ color: '#33D457' }}
            // suffix={
            //   <Button
            //     type='link'
            //     primary='true'
            //     disabled={appointmentCounter > 0 ? false : true}
            //     // onClick={(e) => onClick('activeVisitsBtn')}
            //   >
            //     View more{' '}
            //   </Button>
            // }
          />
        </Col>

        <Col md={8} sm={24} xs={24}>
          <Statistic
            style={{
              padding: '14px',
              backgroundColor: '#F9F9F9',
              color: 'rgb(0, 0, 0)',
              backgroundImage:
                'linear-gradient(to bottom right, #F9F9F9 , #FFFFFF)',

              boxShadow:
                '0 2px 3px 0 rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
            title='Total Members'
            groupSeparator={','}
            value={appointmentCounter}
            valueStyle={{ color: '#0079FB' }}
            // suffix={
            //   <Button
            //     type='link'
            //     primary='true'
            //     disabled={appointmentCounter > 0 ? false : true}
            //     // onClick={(e) => onClick('activeVisitsBtn')}
            //   >
            //     View more{' '}
            //   </Button>
            // }
          />
        </Col>

        <Col md={8} sm={24}  xs={24}>
          <Statistic
            style={{
              padding: '14px',
              backgroundColor: '#F9F9F9',
              color: 'rgb(0, 0, 0)',
              backgroundImage:
                'linear-gradient(to bottom right, #F9F9F9 , #FFFFFF)',

              boxShadow:
                '0 2px 3px 0 rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
            title='Total Claims'
            groupSeparator={','}
            value={appointmentCounter}
            valueStyle={{ color: '#FDBD00' }}
            // suffix={
            //   <Button
            //     type='link'
            //     primary='true'
            //     disabled={appointmentCounter > 0 ? false : true}
            //     // onClick={(e) => onClick('activeVisitsBtn')}
            //   >
            //     View more{' '}
            //   </Button>
            // }
          />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
