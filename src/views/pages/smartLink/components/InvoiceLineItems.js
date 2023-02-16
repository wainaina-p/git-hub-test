import React, { useEffect, useState } from "react";
import { Table, Card } from "antd";
import { InvoiceLineItemscolums } from "./receivedClaimsColumns";

const InvoiceLineItems = (props) => {
  const [invoiceLineData, setInvoiceLineData] = useState([]);

  useEffect(() => {
    setInvoiceLineData(props.invoiceLineData);
  }, [props.invoiceLineData]);

  return (
    <div>
      <Card
        size="small"
        title="Line Items"
        headStyle={{ backgroundColor: "#dbd9d9" }}
      >
        <Table
          columns={InvoiceLineItemscolums}
          size={"small"}
          dataSource={invoiceLineData}
          scroll={{ x: 600 }}
          rowKey={(record) => record.id}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default InvoiceLineItems;
