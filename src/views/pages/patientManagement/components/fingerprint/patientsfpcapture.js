import React from 'react';
import { Input, Button, Modal, Card, Row, Col, Form } from 'antd';
// import PatientCard from '../PatientCard';
// import '../../../../common/fingerprintlib/app.css';
import * as fingerprintactions from './fingerprintactions';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

class FPRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patient_data: [],
      fingerlist: [],
      showReaderDetailsModal: false,
    };
  }
  componentDidMount() {
    this.fingersdk = new fingerprintactions.FingerprintSdk();

    if (this.props.location.state) {
      this.setState({
        patient_data: this.props.location.state.patient_data,
      });
    }
    fingerprintactions.readersDropDownPopulate(true, this.fingersdk);
  }

  componentWillUnmount() {
    this.fingersdk.stopCapture();
  }

  populatePopUpModal = () => {
    this.setState({ showReaderDetailsModal: true });
  };

  handleSubmitPatientFP = () => {
    const findex = 'UK';
    const personFMD = localStorage.getItem('patient_FMD');
    let fingeritem = {
      indicator: findex,
      data: personFMD,
    };
    this.state.fingerlist.push(fingeritem);

    this.setState(this.state);

    //localStorage.setItem("biometric_data", "");
    //localStorage.setItem('biometric_data', JSON.stringify(this.state.fingerlist));
    let obj = {
      patient_number: this.state.patient_data.patient_number,
      biometric: this.state.fingerlist,
    };
    console.log(obj);
    fingerprintactions.submitSampleAcquired(obj).then((response) => {
      if (response.success === true) {
        Modal.success({
          title: 'Success',
          content: response.message,
          onOk() {
            fingerprintactions.onClear();
          },
          onCancel() {},
        });
      } else {
        Modal.error({
          title: 'Error',
          content: response.details,
          onOk() {},
          onCancel() {},
        });
      }
    });
  };

  handleVerifyPatientFP = () => {
    const personFMD = localStorage.getItem('patient_FMD');

    let fingerData = { finger_data: personFMD };
    console.log(fingerData);
    fingerprintactions.verifySampleAcquired(fingerData).then((response) => {
      console.log(response);
      if (response.success === true) {
        Modal.success({
          title: 'Success',
          content:
            'Fingerprint matches patient number ' +
            response.data.patient_number,
          onOk() {
            fingerprintactions.onClear();
          },
          onCancel() {},
        });
      } else {
        Modal.error({
          title: 'Error',
          content: response.data,
          onOk() {},
          onCancel() {},
        });
      }
    });
  };

  render() {
    let { patient_data } = this.state;
    const {
      onClear,
      onStart,
      onStop,
      onGetInfo,
      onImageDownload,
      readersDropDownPopulate,
      submitSampleAcquired,
    } = fingerprintactions;

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } =
      this.props.form;
    // Only show error after a field is touched.
    const given_nameError =
      isFieldTouched('given_name') && getFieldError('given_name');
    return (
      <div id='content'>
        <Card>
          <Row>{/* <PatientCard patient_data={patient_data} /> */}</Row>
          <Row>
            <div id='content-reader'>
              <div style={{ width: '50%', marginLeft: '25%' }}>
                <h6>Available Reader :</h6>
                <select className='form-control' id='readersDropDown'></select>
              </div>
              <div id='readerDivButtons'>
                <table
                  style={{ width: '70%', align: 'center', display: 'none' }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type='button'
                          className='btn btn-primary hidden'
                          id='refreshList'
                          value='Refresh List'
                        />
                      </td>
                      <td>
                        <input
                          type='button'
                          className='btn btn-primary hiddens'
                          id='capabilities'
                          value='Capabilities'
                          onClick={this.populatePopUpModal}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* <!-- Modal - Pop Up window content--> */}
                <div className='modal fade' id='myModal' role='dialog'>
                  <div className='modal-dialog'>
                    {/* <!-- Modal content --> */}
                    <div className='modal-content' id='modalContent'>
                      <div className='modal-header'>
                        <button
                          type='button'
                          className='close'
                          data-dismiss='modal'
                        >
                          &times;
                        </button>
                        <h4 className='modal-title'>Reader Information</h4>
                      </div>
                      <div
                        className='modal-body'
                        id='ReaderInformationFromDropDown'
                      ></div>
                      <div className='modal-footer'>
                        <button
                          type='button'
                          className='btn btn-default'
                          data-dismiss='modal'
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id='Scores'>
              <h5>
                Scan Quality :
                <input
                  type='text'
                  id='qualityInputBox'
                  size='20'
                  style={{ backgroundColor: '#DCDCDC', textAlign: 'center' }}
                />
              </h5>
            </div>
          </Row>
          <Row>
            <Form layout='horizontal' className='fp_reg_form'>
              <div id='content-capture'>
                <div id='status'></div>
                <div id='imagediv'></div>
                <div id='contentButtons'>
                  <table
                    style={{
                      width: '50%',
                      align: 'center',
                      position: 'absolute',
                      left: '250px',
                    }}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type='button'
                            className='btn btn-primary hidden'
                            id='clearButton'
                            value='Clear'
                            onClick={onClear}
                          />
                        </td>

                        <td>
                          <input
                            type='button'
                            className='btn btn-primary'
                            id='start'
                            value='Start'
                            onClick={onStart}
                          />
                        </td>
                        <td
                          data-toggle='tooltip'
                          title='Will work with the .png format.'
                        >
                          <input
                            type='button'
                            className='btn btn-primary'
                            id='save'
                            value='Save'
                            onClick={this.handleSubmitPatientFP}
                          />
                        </td>
                        <td>
                          <input
                            type='button'
                            className='btn btn-primary'
                            id='stop'
                            value='Stop'
                            onClick={onStop}
                          />
                        </td>
                        <td>
                          <input
                            type='button'
                            className='btn btn-primary'
                            id='info'
                            value='Verify'
                            onClick={this.handleVerifyPatientFP}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div id='imageGallery'></div>
                <div id='deviceInfo'></div>

                <div id='saveAndFormats' className='hidden'>
                  {/* <form name="myForm"  */}
                  <div style={{ border: 'solid grey', padding: '5px' }}>
                    <b>Acquire Formats :</b>
                    <br />
                    <table>
                      <tbody>
                        <tr
                          data-toggle='tooltip'
                          title='Will save data to a .png file.'
                        >
                          <td>
                            <input
                              type='checkbox'
                              name='PngImage'
                              defaultChecked
                              value='4'
                            />{' '}
                            PNG
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* </form> */}
                  <br />
                  <input
                    type='button'
                    className='btn btn-primary'
                    id='saveImagePng'
                    value='Export'
                    onClick={onImageDownload}
                  />
                </div>
              </div>
            </Form>
          </Row>
        </Card>
      </div>
    );
  }
}

export default Form.create({ name: 'fp_reg_form' })(FPRegistration);
