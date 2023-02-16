import React, { useEffect, useState } from "react";
import { Table, Card, Row, Col } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import { invoicecolums } from "./receivedClaimsColumns";

const ReceivedClaimInvoice = (props) => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [currentSelectedInvoice, setCurrentSelectedInvoice] = useState();

  const columns = [
    ...invoicecolums,
    {
      title: "#",
      dataIndex: "status",
      key: "status",
      width: "4%",
      fixed: "right",

      render: (text, row) => (
        <>
          {currentSelectedInvoice && currentSelectedInvoice === row ? (
            <ArrowDownOutlined style={{ color: "#2db7f5" }} />
          ) : (
            <ArrowDownOutlined style={{ color: "#c7c7c7" }} />
          )}
        </>
      ),
    },
  ];
  useEffect(() => {
    setInvoiceData(props.invoiceData);
    let invoiceContent = props.invoiceData;
    if (invoiceContent.length > 0) {
      setCurrentSelectedInvoice(invoiceContent[0]);
    }
  }, [props.invoiceData]);

  return (
    <div>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Card
            type="inner"
            size="small"
            title="Invoice List"
            headStyle={{ backgroundColor: "#dbd9d9" }}
          >
            <Table
              columns={columns}
              size={"small"}
              dataSource={invoiceData}
              rowKey={(record) => record.invoice_number}
              scroll={{ x: 540 }}
              rowClassName={(record, index) =>
                currentSelectedInvoice && currentSelectedInvoice === record
                  ? "table-row-selected"
                  : "table-row-not-selected"
              }
              onRow={(row) => {
                return {
                  onClick: (event) => {
                    setCurrentSelectedInvoice(row);
                  },
                };
              }}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default ReceivedClaimInvoice;
