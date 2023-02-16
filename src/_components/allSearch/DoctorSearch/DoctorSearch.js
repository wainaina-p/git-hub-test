import React, { useEffect, useState } from 'react';
import { Select, Input } from 'antd';
import './style.css';
import { specializations } from './specializations';
import { doctorService } from '_services';
import { debounce } from 'lodash';

const { Option } = Select;

export const DoctorSearch = ({
  showSpecializations = true,
  showDoctorServicePoints = false,
  showDoctorFacilities = false,
  showDoctorAvailability = false,
  size = 'small',
  ...props
}) => {
  const [practitioners, setPractitioners] = useState([]);
  const [specls, setSpecializations] = useState([]);
  const defaultPage = { pageNo: 0, pageSize: 9 };
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
    showDoctorServicePoints: showDoctorServicePoints,
    showDoctorFacilities: showDoctorFacilities,
    showDoctorAvailability: showDoctorAvailability,
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    setSpecializations(specializations);
  }, []);

  useEffect(() => {
    getDoctors(searchParams);
  }, [searchParams]);

  const getDoctors = (params) => {
    doctorService.fetchAllDoctors(params).then((resp) => {
      let respData = resp.data?.content || [];
      setPractitioners(respData);
    });
  };

  const formatString = (val) => {
    let newVal;
    if (val) {
      val = val.toLocaleLowerCase();
      newVal = val.charAt(0).toUpperCase() + val.slice(1);
      newVal = newVal.replaceAll('_', ' ');
    }
    return newVal;
  };

  const handleSelectSpecialization = (val) => {
    let params = { ...searchParams };
    if (val) {
      params = { ...params, specialization: val };
    } else {
      params = { ...params, specialization: null };
    }
    setSearchParams(params);
  };

  const handleOnSearchPractitioner = debounce((val) => {
    let params = { ...searchParams };
    if (val) {
      params = { ...params, name: val };
    } else {
      params = { ...params, name: null };
    }
    setSearchParams(params);
  }, 700);

  const handleSelect = (data) => {
    if (data) {
      data = JSON.parse(data);
      setSelectedDoctor(data);
      props.doctor(data);
    } else {
      setSelectedDoctor(null);
      props.doctor(null);
    }
  };

  return (
    <>
      <div></div>
      <div>
        <Input.Group compact size={size}>
          {showSpecializations && (
            <Select
              showSearch
              size={size}
              style={{ width: '40%' }}
              placeholder='Specializations'
              dropdownStyle={{ minWidth: 250 }}
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              onSelect={handleSelectSpecialization}
            >
              <Option value='' key='empty' style={{ color: '#aeaeae' }}>
                - Select specialization -
              </Option>
              {specls.map((item, index) => (
                <Option value={item} key={index}>
                  {/* {item && item.toLocaleLowerCase()} */}
                  {formatString(item)}
                </Option>
              ))}
            </Select>
          )}

          <Select
            defaultValue={props?.initialDoctorData}
            allowClear
            showSearch
            placeholder='Practitioners'
            size={size}
            style={{ width: showSpecializations ? '60%' : '100%' }}
            optionFilterProp='children'
            onSearch={handleOnSearchPractitioner}
            onSelect={handleSelect}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            <Option value='' key='empty' style={{ color: '#aeaeae' }}>
              - Select practitioner -
            </Option>
            {practitioners.map((item, index) => (
              <Option value={JSON.stringify(item)} key={item.id}>
                {item?.firstName + ' ' + item?.surname + ' ' + item?.secondName}
              </Option>
            ))}
          </Select>
        </Input.Group>
      </div>
    </>
  );
};
