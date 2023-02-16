import React, { useState, useEffect } from 'react';
import {
  Steps,
  Result,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  InputNumber,
  Radio,
  Divider,
  Space,
  notification,
} from 'antd';
import moment from 'moment';
import { useStepsForm } from 'sunflower-antd';
import { staffsService } from '_services';
import { useHistory } from 'react-router-dom';
import 'antd/dist/antd.css';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import '../css/style.css';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Avatar from './imageUploader';

const { Step } = Steps;

const NewPatient = (props) => {
  const { Option } = Select;
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [hasDisability, setHasDisability] = useState(false);
  const [fileToSave, setFileToSave] = useState(null);
  const [useForm] = Form.useForm();
  const staffLocationData = props.location.state;

  const selectBefore = (
    <Form.Item name='title' noStyle>
      <Select
        size='small'
        className='select-before'
        placeholder='Mr'
        name='title'
        allowClear
        dropdownStyle={{ minWidth: '15%' }}
      >
        <Option value='mr'>Mr</Option>
        <Option value='mrs'>Mrs.</Option>
        <Option value='ms'>Ms.</Option>
        <Option value='miss'>Miss.</Option>
        <Option value='dr'>Dr.</Option>
        <Option value='Prof'>Prof</Option>
        <Option value='Honorable'>Honorable</Option>
        <Option value='Justice'>Justice</Option>
        <Option value='Ambassandor'>Ambassador</Option>
      </Select>
    </Form.Item>
  );

  const { form, current, gotoStep, formProps, submit } = useStepsForm({
    submit(data) {
      setLoading(true);
      console.log('Form values:\n', data);
      let params = {
        ...data,
      };
      console.log('Params for new Patient \t', params);
      staffsService
        .createStaff(params)
        .then((resp) => {
          if (resp.status === 201) {
            notification.success({ message: 'Person saved successfully' });
            gotoStep(current + 1);
          }
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          gotoStep(0);
          setLoading(false);
        });
    },
    total: 4,
  });

  const formList = [
    <>
      <Row gutter={12}>
        <Col lg={24} md={24} sm={24}>
          <Form.Item name='potrait'>
            <Avatar fileToSave={setFileToSave} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='First Name'
            name='firstName'
            initialValue={staffLocationData?.staffRowData?.firstName}
            rules={[
              {
                required: true,
                message: 'Please input first name',
              },
            ]}
          >
            <Input
              size='small'
              addonBefore={selectBefore}
              placeholder='First name'
            />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Second Name'
            name='secondName'
            initialValue={staffLocationData?.staffRowData?.secondName}
          >
            <Input size='small' placeholder='Second name' />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Surname'
            name='surname'
            initialValue={staffLocationData?.staffRowData?.surname}
            rules={[
              {
                required: true,
                message: 'Please input surname',
              },
            ]}
          >
            <Input size='small' placeholder='Surname' />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Mobile No'
            name='mobileNo'
            initialValue={staffLocationData?.staffRowData?.mobileNo}
            rules={[
              {
                required: true,
                message: 'Please input mobile number',
              },
            ]}
          >
            <PhoneInput
              maxLength={11}
              defaultCountry={'KE'}
              placeholder='Enter mobile no.'
            />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='E-mail Address'
            name='emailAddress'
            initialValue={staffLocationData?.staffRowData?.emailAddress}
            rules={[
              {
                required: false,
                type: 'email',
                message: 'Please input e-mail address',
              },
            ]}
          >
            <Input size='small' placeholder='E-mail' />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            name='dob'
            label='Date of Birth'
            initialValue={
              staffLocationData?.staffRowData?.dob &&
              moment(staffLocationData?.staffRowData?.dob)
            }
            rules={[
              {
                required: true,
                message: 'Please select date of birth',
              },
            ]}
          >
            <DatePicker
              size='small'
              placeholder='dob'
              format={'YYYY-MM-DD'}
              style={{ width: '100%' }}
              disabledDate={(current) => {
                return current && current > moment();
              }}
            />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='National ID'
            name='idNo'
            initialValue={staffLocationData?.staffRowData?.idNo}
            rules={[
              {
                required: true,
                message: 'Please input national ID no.',
              },
            ]}
          >
            <InputNumber
              size='small'
              placeholder='National ID No.'
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label={`Is living with disability?`}
            name='isDisabled'
            initialValue={staffLocationData?.staffRowData?.isDisabled}
            rules={[
              {
                required: true,
                message: 'Please indicate if this staff is disabled',
              },
            ]}
          >
            <Radio.Group onChange={(e) => setHasDisability(!hasDisability)}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        {hasDisability && (
          <>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item
                label='Nature of Disability'
                name='natureOfDisability'
                initialValue={
                  staffLocationData?.staffRowData?.natureOfDisability
                }
                rules={[
                  {
                    required: true,
                    message: 'Nature of disability is required!',
                  },
                ]}
              >
                <Input size='small' placeholder='Nature of disability' />
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item
                label='Registration No. (NCPWD)'
                name='ncpwd'
                initialValue={staffLocationData?.staffRowData?.ncpwd}
                rules={[
                  {
                    required: true,
                    message: 'Registration no. with NCPWD is required!',
                  },
                ]}
              >
                <Input size='small' placeholder='NCPWD reg no.' />
              </Form.Item>
            </Col>
          </>
        )}

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Postal Address'
            name='postalAddress'
            initialValue={staffLocationData?.staffRowData?.postalAddress}
            rules={[
              {
                required: false,
                message: 'Postal address is required!',
              },
            ]}
          >
            <Input size='small' placeholder='Postal address' />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Code'
            name='code'
            initialValue={staffLocationData?.staffRowData?.code}
            rules={[
              {
                required: false,
                message: 'Code is required!',
              },
            ]}
          >
            <Input size='small' placeholder='Code' />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='City/Town'
            name='cityTown'
            initialValue={staffLocationData?.staffRowData?.cityTown}
            rules={[
              {
                required: false,
                message: 'Please specify a city or a town!',
              },
            ]}
          >
            <Input size='small' placeholder='City/town' />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item {...tailLayout}>
        <Col
          span={24}
          style={{
            textAlign: 'right',
          }}
        >
          <Button type='primary' onClick={() => gotoStep(current + 1)}>
            Next
          </Button>
        </Col>
      </Form.Item>
    </>,
    <>
      <Row gutter={12}>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Payroll No.'
            name='payrollNo'
            initialValue={staffLocationData?.staffRowData?.payrollNo}
          >
            <Input allowClear size='small' placeholder='Payroll no.' />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label={
              <span>
                Date of 1<sup>st</sup> appointment
              </span>
            }
            name='firstAppointmentDate'
            initialValue={
              staffLocationData?.staffRowData?.firstAppointmentDate &&
              moment(staffLocationData?.staffRowData?.firstAppointmentDate)
            }
          >
            <DatePicker
              size='small'
              placeholder='First appointment date'
              format={'YYYY-MM-DD'}
              style={{ width: '100%' }}
              disabledDate={(current) => {
                return current && current > moment();
              }}
            />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Designation & J/G'
            name='firstDesignation'
            initialValue={staffLocationData?.staffRowData?.firstDesignation}
          >
            <Input size='small' placeholder='Designation & J/G' />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label={<span>Date of current appointment</span>}
            name='currentAppointmentDate'
            initialValue={
              staffLocationData?.staffRowData?.currentAppointmentDate &&
              moment(staffLocationData?.staffRowData?.currentAppointmentDate)
            }
          >
            <DatePicker
              size='small'
              placeholder='Current appointment date'
              format={'YYYY-MM-DD'}
              style={{ width: '100%' }}
              disabledDate={(current) => {
                return current && current > moment();
              }}
            />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Designation & J/G'
            name='currentDesignation'
            initialValue={staffLocationData?.staffRowData?.currentDesignation}
          >
            <Input size='small' placeholder='Designation & J/G' />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Department'
            name='department'
            initialValue={staffLocationData?.staffRowData?.department}
            rules={[
              {
                required: false,
                message: 'Department is required!',
              },
            ]}
          >
            <Input size='small' placeholder='Department' />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Section'
            name='section'
            initialValue={staffLocationData?.staffRowData?.section}
            rules={[
              {
                required: false,
                message: 'Section is required!',
              },
            ]}
          >
            <Input size='small' placeholder='Section' />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Name of Immediate Supervisor'
            name='immediateSupervisorName'
            initialValue={
              staffLocationData?.staffRowData?.immediateSupervisorName
            }
            rules={[
              {
                required: false,
                message: 'Name of immediate supervisor is required!',
              },
            ]}
          >
            <Input size='small' placeholder="Supervisor's name" />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Current Workstation'
            name='currentWorkstation'
            initialValue={staffLocationData?.staffRowData?.currentWorkstation}
            rules={[
              {
                required: false,
                message: 'Current workstation is required!',
              },
            ]}
          >
            <Input size='small' placeholder='Current workstation' />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Ward'
            name='ward'
            initialValue={staffLocationData?.staffRowData?.ward}
            rules={[
              {
                required: false,
                message: 'Ward is required!',
              },
            ]}
          >
            <Input size='small' placeholder='Ward' />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Sub County'
            name='subCounty'
            initialValue={staffLocationData?.staffRowData?.subCounty}
            rules={[
              {
                required: false,
                message: 'Sub county is required!',
              },
            ]}
          >
            <Input size='small' placeholder='Sub county' />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item {...tailLayout}>
        <Col
          span={24}
          style={{
            textAlign: 'right',
          }}
        >
          <Space>
            <Button onClick={() => gotoStep(current - 1)}>Prev</Button>
            <Button type='primary' onClick={() => gotoStep(current + 1)}>
              Next
            </Button>
          </Space>
        </Col>
      </Form.Item>
    </>,
    <>
      <Row gutter={12}>
        <Divider className='panel-title' orientation='left'>
          KCSE QUALIFICATIONS
        </Divider>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Start Year'
            name='startYear'
            initialValue={
              staffLocationData?.staffRowData?.startYear &&
              moment(staffLocationData?.staffRowData?.startYear)
            }
            rules={[
              {
                required: true,
                message: 'Start year is required!',
              },
            ]}
          >
            <DatePicker
              size='small'
              placeholder='Start date'
              format={'YYYY'}
              style={{ width: '100%' }}
              disabledDate={(current) => {
                return current && current > moment();
              }}
            />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Completion Year'
            name='completionYear'
            initialValue={
              staffLocationData?.staffRowData?.completionYear &&
              moment(staffLocationData?.staffRowData?.completionYear)
            }
            rules={[
              {
                required: false,
                message: 'Completion year is required!',
              },
            ]}
          >
            <DatePicker
              size='small'
              placeholder='Completion date'
              format={'YYYY'}
              style={{ width: '100%' }}
              // disabledDate={(current) => {
              //   return current && current < moment();
              // }}
            />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Grade'
            name='grade'
            initialValue={staffLocationData?.staffRowData?.grade}
            rules={[
              {
                required: false,
                message: 'Grade is required!',
              },
            ]}
          >
            <Input size='small' placeholder='Grade e.g A, B+' />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Divider className='panel-title' orientation='left'>
          HIGHEST ACADEMIC QUALIFICATION
        </Divider>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Start Year'
            name='highestAcademicStartYear'
            initialValue={
              staffLocationData?.staffRowData?.highestAcademicStartYear &&
              moment(staffLocationData?.staffRowData?.highestAcademicStartYear)
            }
            rules={[
              {
                required: false,
                message: 'Start year is required!',
              },
            ]}
          >
            <DatePicker
              size='small'
              placeholder='Start date'
              format={'YYYY'}
              style={{ width: '100%' }}
              disabledDate={(current) => {
                return current && current > moment();
              }}
            />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Completion Year'
            name='highestAcademicCompletioYear'
            initialValue={
              staffLocationData?.staffRowData?.highestAcademicCompletioYear &&
              moment(
                staffLocationData?.staffRowData?.highestAcademicCompletioYear
              )
            }
            rules={[
              {
                required: false,
                message: 'Completion year is required!',
              },
            ]}
          >
            <DatePicker
              size='small'
              placeholder='Completion date'
              format={'YYYY'}
              style={{ width: '100%' }}
              // disabledDate={(current) => {
              //   return current && current > moment();
              // }}
            />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Level'
            name='level'
            initialValue={staffLocationData?.staffRowData?.level}
            rules={[
              {
                required: false,
                message: 'Level is required!',
              },
            ]}
          >
            <Select
              size='small'
              className='select-before'
              placeholder='- Select level - '
              name='title'
              allowClear
              dropdownStyle={{ minWidth: '15%' }}
            >
              <Option value='Certificate' key='cert'>
                Certificate
              </Option>
              <Option value='Diploma' key='diploma'>
                Diploma
              </Option>
              <Option value='Higher_Diploma' key='higher_diploma'>
                Higher Diploma
              </Option>
              <Option value='Degree' key='degree'>
                Degree
              </Option>
              <Option value='Masters' key='masters'>
                Masters
              </Option>
              <Option value='PHD' key='phd'>
                PHD
              </Option>
            </Select>
          </Form.Item>
        </Col>

        <Col lg={8} md={12} sm={24} xs={24}>
          <Form.Item
            label='Area of Specialization'
            name='areaOfSpecialization'
            initialValue={staffLocationData?.staffRowData?.areaOfSpecialization}
            rules={[
              {
                required: false,
                message: 'Area of specialization is required!',
              },
            ]}
          >
            <Input size='small' placeholder='Specialization' />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Divider className='panel-title' orientation='left'>
          CURRENT REGISTRATION/MEMBERSHIP TO PROFESSIONAL BODIES
        </Divider>
        <Form.List name='memberships'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row gutter={[8, 8]} key={key}>
                  <Col lg={11} md={11} sm={22} xs={22}>
                    <Form.Item
                      {...restField}
                      name={[name, 'professionalBody']}
                      initialValue={
                        staffLocationData?.staffRowData?.memberships[key]
                          ?.professionalBody
                      }
                      rules={[
                        {
                          required: true,
                          message: 'Professional body is required!',
                        },
                      ]}
                    >
                      <Input size='small' placeholder='Professional body' />
                    </Form.Item>
                  </Col>

                  <Col lg={11} md={11} sm={22} xs={22}>
                    <Form.Item
                      {...restField}
                      name={[name, 'mbrRegistrationNo']}
                      initialValue={
                        staffLocationData?.staffRowData?.memberships[key]
                          ?.mbrRegistrationNo
                      }
                      rules={[
                        {
                          required: true,
                          message:
                            'Membership registration number is required!',
                        },
                      ]}
                    >
                      <Input
                        size='small'
                        placeholder='Membership Registration Number'
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={11} md={11} sm={22} xs={22}>
                    <Form.Item
                      {...restField}
                      name={[name, 'mbrTypeAssociate']}
                      initialValue={
                        staffLocationData?.staffRowData?.memberships[key]
                          ?.mbrTypeAssociate
                      }
                      rules={[
                        {
                          required: true,
                          message: 'Membership type-associate is required!',
                        },
                      ]}
                    >
                      <Input
                        size='small'
                        placeholder='Membership type-associate'
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={11} md={11} sm={22} xs={22}>
                    <Form.Item
                      {...restField}
                      name={[name, 'mbrRenewalDate']}
                      initialValue={
                        staffLocationData?.staffRowData?.memberships[key]
                          ?.mbrRenewalDate &&
                        moment(
                          staffLocationData?.staffRowData?.memberships[key]
                            ?.mbrRenewalDate
                        )
                      }
                      rules={[
                        {
                          required: true,
                          message: 'Membership renewal date is required!',
                        },
                      ]}
                    >
                      <DatePicker
                        size='small'
                        placeholder='Membership renewal date'
                        format={'YYYY-MM-DD'}
                        style={{ width: '100%' }}
                        disabledDate={(current) => {
                          return current && current < moment();
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                  <Col
                    span={24}
                    className='d-flex justify-content-center'
                    style={{ paddingTop: '0' }}
                  >
                    <Col
                      lg={20}
                      md={20}
                      sm={20}
                      xs={20}
                      style={{ paddingTop: '0' }}
                    >
                      <Divider dashed style={{ paddingTop: '0' }} />
                    </Col>
                  </Col>
                </Row>
              ))}
              <Col span={24}>
                <Form.Item>
                  <Col lg={6} md={8} sm={12} xs={12}>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add field
                    </Button>
                  </Col>
                </Form.Item>
              </Col>
            </>
          )}
        </Form.List>
      </Row>
      <Form.Item {...tailLayout}>
        <Col
          span={24}
          style={{
            textAlign: 'right',
          }}
        >
          <Space>
            <Button onClick={() => gotoStep(current - 1)}>Prev</Button>
            <Button
              type='primary'
              loading={isLoading}
              onClick={() => {
                submit();
              }}
            >
              Submit
            </Button>
          </Space>
        </Col>
      </Form.Item>
    </>,
  ];

  useEffect(() => {
    if (staffLocationData?.staffRowData) {
      let data = staffLocationData?.staffRowData;

      // getDoctor({ doctorLicense: data?.doctor_license });
    }
  }, [staffLocationData]);

  return (
    <div id='content'>
      <Card type='inner' size='small' title='New Staff'>
        <div>
          <Steps current={current} size='small'>
            <Step title='Personal Details' />
            <Step title='Work-related Details' />
            <Step title='Other Details' />
            <Step title='Finish' />
          </Steps>

          <div style={{ marginTop: 40 }}>
            <Form
              {...layout}
              {...formProps}
              // form={useForm}
              // initialValues={staffLocationData?.staffRowData}
            >
              {formList[current]}
            </Form>

            {current === 3 && (
              <Result
                className='animated bounceInRight'
                status='success'
                title='Staff registered successfully'
                extra={
                  <>
                    <Button
                      htmlType='submit'
                      type='primary'
                      onClick={() => {
                        form.resetFields();
                        gotoStep(0);
                      }}
                    >
                      New Staff
                    </Button>
                    <Button
                      style={{ marginTop: 10 }}
                      onClick={() =>
                        history.push('/staff-management/staff-register')
                      }
                    >
                      Staffs Register
                    </Button>
                  </>
                }
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const layout = {
  layout: 'vertical',
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

export default NewPatient;
