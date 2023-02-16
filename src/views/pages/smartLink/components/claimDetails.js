import { Descriptions, Card, Row, Col } from "antd";

import React, { useEffect, useState } from "react";

import ReceivedClaimInvoice from "./Invoices";

const ClaimDetails = (props) => {
  const [claimData, setClaimData] = useState(null);

  useEffect(() => {
    setClaimData(props.claimDetails);
  }, [props.claimDetails]);

  return (
    <div id="content">
      <Row gutter={[0, 16]}>
        <Row>
          <Card
            type="inner"
            title="Claim Details"
            size="small"
            headStyle={{ backgroundColor: "#dbd9d9" }}
          >
            <Descriptions
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="Payer name">
                {claimData?.payer_name || null}
              </Descriptions.Item>
              <Descriptions.Item label="Scheme name">
                {claimData?.scheme_name || null}
              </Descriptions.Item>
              <Descriptions.Item label="Claim Status">
                {claimData?.claim_status || null}
              </Descriptions.Item>

              <Descriptions.Item label="Visit Number">
                {claimData?.visit_number || null}
              </Descriptions.Item>

              <Descriptions.Item label="Service Location">
                {claimData?.service_location_name || null}
              </Descriptions.Item>

              <Descriptions.Item label="Gross Amount">
                {claimData?.gross_amount || null}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Row>
        <Col lg={24} md={24} sm={24}>
          <ReceivedClaimInvoice invoiceData={props.claimDetails?.invoices} />
        </Col>
      </Row>
    </div>
  );
};
export default ClaimDetails;
