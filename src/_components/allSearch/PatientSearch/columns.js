import React from 'react';
import moment from 'moment';

export const patientColumns = [
  {
    title: 'Patient No',
    dataIndex: 'patient_no',
    key: 'patient_no',
  },
  {
    title: 'Name',
    dataIndex: 'firstName',
    key: 'firstName',
    render: (text, row) => (
      <span>{`${text ? text : ''} ${row?.surname ? row?.surname : ''} ${
        row?.secondName ? row?.secondName : ''
      }`}</span>
    ),
  },
  {
    title: 'Age',
    dataIndex: 'dob',
    key: 'dob',
    render: (text) => {
      let a = moment();
      let b = moment(text);

      let years = a.diff(b, 'year');
      b.add(years, 'years');

      let months = a.diff(b, 'months');
      b.add(months, 'months');

      let days = a.diff(b, 'days');

      return (
        <span>{`${years} ${years === 1 ? 'year' : 'years'} ${months}  ${
          months === 1 ? 'month' : 'months'
        } ${days} ${days === 1 ? 'day' : 'days'}`}</span>
      );
    },
    // <>{`${text && moment().diff(text, 'years', false)} years`}</>
  },
  {
    title: 'Phone Number',
    dataIndex: 'primary_contact',
    key: 'primary_contact',
    render: (text, row) => (
      <>
        <a href={`tel:${text ? text : row?.secondary_contact}`}>
          {text ? text : row?.secondary_contact}
        </a>
      </>
    ),
  },
  {
    title: 'National ID',
    dataIndex: 'national_id',
    key: 'national_id',
  },
  {
    title: 'Residence',
    dataIndex: 'residence',
    key: 'residence',
  },
];
