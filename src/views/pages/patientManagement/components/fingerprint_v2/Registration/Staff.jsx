import React, { Component } from 'react';
import Styles from './Styles';
import { Field } from 'react-final-form';
// import PatientCard from '../../PatientCard';
import Wizard from './Wizard';
import lefthandimage from '../img/left-hand.png';
import righthandimage from '../img/right-hand.png';
import { biometricService } from '_services';
import '../fingerprints/pretty-checkbox.min.css';
import './fingerprints.css';
import 'es6-shim/es6-shim.min.js';
import { FingerprintsSDK } from '../FingerprintSDK';
import { message, Row, Card, Button, Table, Tag, notification } from 'antd';
import { history } from '_helpers/history';
import { DeleteOutlined } from '@ant-design/icons';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const hands = [
  {
    indicator: 'RT',
    name: 'Right Thumb',
  },
  {
    indicator: 'RI',
    name: 'Right Index Finger',
  },
  {
    indicator: 'RM',
    name: 'Right Middle Finger',
  },
  {
    indicator: 'RR',
    name: 'Right Ring Finger',
  },
  {
    indicator: 'RP',
    name: 'Right Pinkie Finger',
  },

  {
    indicator: 'LT',
    name: 'Left Thumb',
  },
  {
    indicator: 'LI',
    name: 'Left Index Finger',
  },
  {
    indicator: 'LM',
    name: 'Left Middle Finger',
  },
  {
    indicator: 'LR',
    name: 'Left Ring Finger',
  },
  {
    indicator: 'LP',
    name: 'Left Pinkie Finger',
  },
];

const { Column } = Table;

class Patient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fingerlist: [],
      person_data: [],
      currentFinger: '',
      currentFingerData: '',
    };

    this.fingersdk = new FingerprintsSDK();
  }
  handleStartCapturing = (e) => {
    this.fingersdk.startCapture();
  };
  handleStopCapturing = (e) => {
    this.fingersdk.stopCapture();
  };

  componentDidMount() {
    this.handleStartCapturing();
    if (this.props.location.state) {
      console.log(
        'this.props.location.state.record:\n',
        this.props.location.state.record
      );
      this.setState({
        person_data: this.props.location.state.record,
      });
    }
    // let data = localStorage.getItem('biometric_data');
    // if (data) {
    //   // localStorage.removeItem('biometric_data');
    //   if (
    //     localStorage.getItem('current_staff_fingerprint_reg') ===
    //     localStorage.getItem('current_staff_fingerprint')
    //   ) {
    //     console.log('Updating fingerlist. Mounting...');
    //     this.setState({ fingerlist: JSON.parse(data) });
    //   }
    // }
    this.fetchEarlierSavedFPs();
  }

  componentWillUnmount() {
    this.handleStopCapturing();
  }

  fetchEarlierSavedFPs = () => {
    let data = localStorage.getItem('biometric_data');
    if (data) {
      // localStorage.removeItem('biometric_data');
      if (
        localStorage.getItem('current_staff_fingerprint_reg') ===
        localStorage.getItem('current_staff_fingerprint')
      ) {
        console.log('Updating fingerlist. Mounting...');
        this.setState({ fingerlist: JSON.parse(data) });
      }
    }
  };

  onSubmit = async (values) => {
    await sleep(300);
    // window.alert(JSON.stringify(values, 0, 2))

    let fingerdata = null;
    if (
      localStorage.getItem('current_staff_fingerprint_reg') ===
      localStorage.getItem('current_staff_fingerprint')
    ) {
      fingerdata = JSON.parse(localStorage.getItem('biometric_data'));

      values.biometric_data = fingerdata;
    } else {
      values.biometric_data = null;
    }

    // console.log(JSON.stringify(values, 0, 2))
    let params = {
      biometric: values.biometric_data,
      personId: this.state.person_data.id,
    };

    // console.log('\n\nParams samples:\n\n', params)
    // console.log('Patient data:\n\n', this.state.person_data)

    if (fingerdata !== null) {
      for (let x = 0; x < fingerdata.length; x++) {
        let data = fingerdata[x].data;
        let indicator = fingerdata[x].indicator;
        let finger = hands.filter((finger) => finger.indicator === indicator);

        if (data === '') {
          message.warning(`Kindly recapture ${finger[x].name}`);
          this.setState({ fingerlist: [] });
          localStorage.clear();
          return;
        } else {
          if (x === fingerdata.length - 1) {
            biometricService
              .enrollPerson(params)
              .then((response) => {
                if (response.status === 200 || response.status === 201) {
                  message.success('Fingerprint(s) enrolled successfully');
                  this.setState({ fingerlist: [] });
                  localStorage.removeItem('haas-fmd');
                  localStorage.removeItem('imageSrc');
                  localStorage.removeItem('biometric_data');
                  // fingerdata = [];
                }
              })
              .catch((error) => {
                message.error(
                  "An error occured while enrolling the patient's fingerprints"
                );
                // console.log('Fingerprints eror:\n\n', error);
              });
          }
        }
      }
    } else {
      message.warning('No fingerprint has been captured yet');
    }
  };

  onAddItem = (event) => {
    event.preventDefault();
    const findex = this.state.currentFinger;
    const haasdata = localStorage.getItem('haas-fmd');
    let fingeritem = {
      indicator: findex,
      data: haasdata,
    };

    console.log('haasdata:\n', haasdata);
    console.log('fingeritem:\n', fingeritem);

    if (haasdata === '' || haasdata === null) {
      let finger = hands.filter((finger) => finger.indicator === findex);

      message.warning(`Kindly recapture ${finger[0].name}`);
      return;
    } else {
      this.state.fingerlist.push(fingeritem);
      console.log('this.state.fingerlist:\n', this.state.fingerlist);
    }

    this.setState(this.state);
    localStorage.setItem('imageSrc', '');
    localStorage.setItem('haas-fmd', '');
    // localStorage.clear();
    localStorage.setItem('biometric_data', null);
    localStorage.setItem(
      'biometric_data',
      JSON.stringify(this.state.fingerlist)
    );
    console.log('this.state.person_data:\n', this.state.person_data);
    localStorage.setItem(
      'current_staff_fingerprint',
      this.state.person_data.id
    );
    console.log(
      "localStorage.getItem('current_staff_fingerprint_reg'):\n",
      localStorage.getItem('current_staff_fingerprint_reg')
    );

    console.log(
      "localStorage.getItem('current_staff_fingerprint'):\n",
      localStorage.getItem('current_staff_fingerprint')
    );
    this.fetchEarlierSavedFPs();
    notification.success({ message: 'Fingerprint added!' });
  };

  onDeleteFP = (row) => {
    const { fingerlist } = this.state;
    if (row) {
      let newData = fingerlist.filter((item) => item.data !== row.data);
      this.setState({ fingerlist: newData });
      localStorage.removeItem('biometric_data');
      localStorage.setItem('biometric_data', JSON.stringify(newData));
    }
  };

  _handleOnChange = (e) => {
    const item = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      this.setState({ currentFinger: item });
    }
  };

  handleBack = () => {
    this.props.history.push('/staff-management/staff-register');
  };

  render() {
    return (
      <div className='card'>
        <div className='card-body'>
          <Row className='mb-5'>
            {/* <PatientCard person_data={this.state.person_data} /> */}
          </Row>
          <Card
            size='small'
            title={
              <p>
                <strong>Fingers to Enroll</strong>
              </p>
            }
            extra={
              <Button
                type='link'
                size='small'
                onClick={() => this.handleBack()}
              >
                Back
              </Button>
            }
          >
            <Styles>
              <Wizard
                initialValues={{
                  country: 'Kenya',
                  provider_id: '',
                  patient_no: '',
                }}
                onSubmit={this.onSubmit}
              >
                {/* biometrics */}
                <Wizard.Page>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='row'>
                        <div className='col-md-4 ml-1'>
                          <div id='left-hand'>
                            <div>
                              <Field
                                name='biometric_data'
                                value='LP'
                                component='input'
                                type='checkbox'
                                className='LP'
                                onClick={this._handleOnChange}
                              />
                              <Field
                                name='biometric_data'
                                value='LR'
                                component='input'
                                type='checkbox'
                                className='LR'
                                onClick={this._handleOnChange}
                              />
                              <Field
                                name='biometric_data'
                                value='LM'
                                component='input'
                                type='checkbox'
                                className='LM'
                                onClick={this._handleOnChange}
                              />
                              <Field
                                name='biometric_data'
                                value='LI'
                                component='input'
                                type='checkbox'
                                className='LI'
                                onClick={this._handleOnChange}
                              />
                              <Field
                                name='biometric_data'
                                value='LT'
                                component='input'
                                type='checkbox'
                                className='LT'
                                onClick={this._handleOnChange}
                              />
                            </div>
                            <img
                              id='ContentPlaceHolder1_Image1'
                              src={lefthandimage}
                              alt='left hand'
                            />
                          </div>
                        </div>
                        <div className='col-md-4 ml-5'>
                          <div className='' id='right-hand'>
                            <div>
                              <Field
                                name='biometric_data'
                                value='RT'
                                component='input'
                                type='checkbox'
                                className='RT'
                                onClick={this._handleOnChange}
                              />
                              <Field
                                name='biometric_data'
                                value='RI'
                                component='input'
                                type='checkbox'
                                className='RI'
                                onClick={this._handleOnChange}
                              />
                              <Field
                                name='biometric_data'
                                value='RM'
                                component='input'
                                type='checkbox'
                                className='RM'
                                onClick={this._handleOnChange}
                              />
                              <Field
                                name='biometric_data'
                                value='RR'
                                component='input'
                                type='checkbox'
                                className='RR'
                                onClick={this._handleOnChange}
                              />
                              <Field
                                name='biometric_data'
                                value='RP'
                                component='input'
                                type='checkbox'
                                className='RP'
                                onClick={this._handleOnChange}
                              />
                            </div>
                            <img
                              id='ContentPlaceHolder1_Image3'
                              src={righthandimage}
                              alt='Right hand'
                            />
                          </div>
                        </div>
                      </div>
                      <div className='row mt-2 ml-4'>
                        <div className='col-md-8'>
                          <div
                            className='btn-group d-flex justify-content-center'
                            role='group'
                          >
                            <button
                              onClick={this.onAddItem}
                              disabled={!this.state.currentFinger}
                              className='btn btn-secondary'
                            >
                              Add Fingerprint
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Table */}
                      {localStorage.getItem('current_staff_fingerprint') ===
                        localStorage.getItem('current_staff_fingerprint_reg') &&
                      this.state.fingerlist &&
                      this.state.fingerlist.length > 0 ? (
                        <div className='row mt-4 ml-2'>
                          <div className='col-md-10 col-sm-16'>
                            <Card type='inner' title='Scanned fingerprints'>
                              <Table
                                size='small'
                                rowKey={(record) => record.data}
                                dataSource={this.state.fingerlist}
                                // dataSource={localStorage
                                //   .getItem('biometric_data')
                                //   .JSON.parse(this.state.fingerlist)}
                              >
                                <Column
                                  title='Indicator'
                                  dataIndex='indicator'
                                  key='indicator'
                                  align='left'
                                  render={(text) => (
                                    <span
                                      title={
                                        hands.filter(
                                          (item) => item.indicator === text
                                        ).name
                                      }
                                    >
                                      {/* {text} */}
                                      {
                                        hands.filter(
                                          (item) => item.indicator === text
                                        )[0].name
                                      }
                                    </span>
                                  )}
                                />
                                <Column
                                  title='Data'
                                  dataIndex='data'
                                  key='data'
                                  align='left'
                                  render={(text) => (
                                    <Tag color={text ? 'green' : 'magenta'}>
                                      {text ? 'Ok' : 'Missing'}
                                    </Tag>
                                  )}
                                />
                                <Column
                                  title='#'
                                  dataIndex='action'
                                  key='action'
                                  align='left'
                                  render={(text, row) => (
                                    <DeleteOutlined
                                      style={{ color: '#ff4c4f' }}
                                      type='delete'
                                      onClick={() => this.onDeleteFP(row)}
                                    />
                                  )}
                                />
                              </Table>
                            </Card>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className='col-md-6'>
                      <div id='content-capture'>
                        <div id='status' />
                        <div id='imagediv' />
                        <div id='Scores'>
                          <h6>
                            <input type='text' id='qualityInputBox' readOnly />
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </Wizard.Page>
              </Wizard>
            </Styles>
          </Card>
        </div>
      </div>
    );
  }
}

export default Patient;
