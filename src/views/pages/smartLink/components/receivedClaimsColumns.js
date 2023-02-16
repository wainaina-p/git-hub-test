import React from "react";
import moment from "moment";
export const receivedClaimsColumns = [
  {
    title: "Claim Code",
    dataIndex: "claim_code",
    key: "claim_code",

    width: "15%",
    fixed: "left",
  },
  {
    title: "Patient No",
    dataIndex: "patient_number",
    key: "patient_number",
  },
  {
    title: "Patient Name",
    dataIndex: "patient_name",
    key: "patient_name",
  },
  {
    title: "Visit Start",
    dataIndex: "visit_start",
    key: "visit_start",
    render: (text, row) => (
      <>
        <span>{moment(text).format("YYYY-MM-DD")}</span>
      </>
    ),
    showOnResponse: true,
    showOnDesktop: true,
  },

  {
    title: "Gross Amount",
    dataIndex: "gross_amount",
    key: "gross_amount",
  },
];
export const invoicecolums = [
  {
    title: "Inv No",
    dataIndex: "invoice_number",
    fixed: "left",
  },
  {
    title: "Inv Date",
    dataIndex: "invoice_date",
    render: (text, row) => (
      <>
        <span>{moment(text).format("YYYY-MM-DD")}</span>
      </>
    ),
  },

  {
    title: "Gross Amt",
    dataIndex: "gross_amount",
  },

  {
    title: "Inv Ref No",
    dataIndex: "invoice_ref_number",
  },

  {
    title: "Amt",
    dataIndex: "amount",
  },
  {
    title: "Svc Type",
    dataIndex: "service_type",
  },
];
export const InvoiceLineItemscolums = [
  {
    title: "Item Code",
    dataIndex: "item_code",
    fixed: "left",
    width: "20%",
  },
  {
    title: "Item Name",
    dataIndex: "item_name",
  },
  {
    title: "Svc Group",
    dataIndex: "service_group",
  },
  {
    title: "Unt Price",
    dataIndex: "unit_price",
  },
  {
    title: "Qty",
    dataIndex: "quantity",
  },

  {
    title: "Amt",
    dataIndex: "amount",
  },
];
