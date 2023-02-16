import { message } from 'antd';

var verificationFPSDk = null;

var deviceStatus = false;
var searchPersonFP = null;
var isStopped = false;

var verificationDeviceVal = ''; // Drop down selected value of reader

var currentFormat = window.Fingerprint.SampleFormat.PngImage;

export var veririficationFingerprintSdk = (function () {
  function verificationFingerprintSdk() {
    //var _instance = this;
    this.operationToRestart = null;
    this.acquisitionStarted = false;
    this.sdk = new window.Fingerprint.WebApi();
    this.sdk.onDeviceConnected = function (e) {
      // Detects if the deveice is connected for which acquisition started
      markDeviceAsActive(true);
    };
    this.sdk.onDeviceDisconnected = function (e) {
      // Detects if device gets disconnected - provides deviceUid of disconnected device
      //   console.log('FP device disconnected');
      markDeviceAsActive(false);
    };
    this.sdk.onCommunicationFailed = function (e) {
      // Detects if there is a failure in communicating with U.R.U web SDK
      console.log('FP device communication failed');
      markDeviceAsActive(false);
    };
    this.sdk.onSamplesAcquired = function (s) {
      // Sample acquired event triggers this function
      sampleAcquired(s);
    };
    this.sdk.onQualityReported = function (e) {
      // Quality of sample aquired - Function triggered on every sample acquired
      //document.getElementById("qualityInputBox").value = window.Fingerprint.QualityCode[(e.quality)];
    };
  }

  verificationFingerprintSdk.prototype.startCapture = function () {
    if (this.acquisitionStarted) {
      // Monitoring if already started capturing
      return;
    } else {
      var _instance = this;
      // console.log('capturing');
      this.operationToRestart = this.startCapture;
      // console.log(verificationDeviceVal);
      verificationDeviceVal = findActiveDevice();
      // console.log(verificationDeviceVal);

      this.sdk.startAcquisition(currentFormat, verificationDeviceVal).then(
        function () {
          _instance.acquisitionStarted = true;
        },
        function (error) {
          showMessage(error.message);
        }
      );
    }
  };

  verificationFingerprintSdk.prototype.stopCapture = function () {
    if (!this.acquisitionStarted)
      //Monitor if already stopped capturing
      return;
    var _instance = this;
    this.sdk.stopAcquisition().then(
      function () {
        _instance.acquisitionStarted = false;
      },
      function (error) {
        showMessage(error.message);
      }
    );
  };

  verificationFingerprintSdk.prototype.getInfo = function () {
    var _instance = this;
    return this.sdk.enumerateDevices();
  };

  verificationFingerprintSdk.prototype.getDeviceInfoWithID = function (uid) {
    var _instance = this;
    return this.sdk.getDeviceInfo(uid);
  };

  return verificationFingerprintSdk;
})();

function findActiveDevice() {
  verificationFPSDk = new veririficationFingerprintSdk();
  var allReaders = verificationFPSDk.getInfo();
  allReaders.then(
    function (sucessObj) {
      for (let i = 0; i < sucessObj.length; i++) {
        // console.log('sucessObj[i]', sucessObj[i]);
        return sucessObj[i];
      }
    },
    function (error) {
      showMessage(error.message);
    }
  );
}

function showMessage(messageObj) {
  // var _instance = this;
  //   console.log(messageObj);
  // if (messageObj !== "") {
  //     message.info(messageObj);
  // }
}
export function onStart(fp, paramFunc) {
  //   console.log('Starting....');
  //activate fp sdk

  if (currentFormat === '') {
    alert('Please select a format.');
  } else {
    if (paramFunc === 'STOPPED') {
      verificationFPSDk = null;
      this.acquisitionStarted = false;
      isStopped = true;
      markDeviceAsActive(false);
      // verificationFPSDk.onStop();
      return;
    } else {
      console.log('Inside else func:\n', paramFunc);
      verificationFPSDk = fp;
      searchPersonFP = paramFunc;
      assignFormat();

      verificationFPSDk.startCapture();
    }
  }
}

export function onStop() {
  verificationFPSDk.stopCapture();
}

function assignFormat() {
  currentFormat = window.Fingerprint.SampleFormat.PngImage;
}

function sampleAcquired(s) {
  if (currentFormat === window.Fingerprint.SampleFormat.PngImage) {
    // If sample acquired format is PNG- perform following call on object recieved
    // Get samples from the object - get 0th element of samples as base 64 encoded PNG image
    var samples = JSON.parse(s.samples);
    localStorage.removeItem('person_veririfcation_FMD');
    localStorage.setItem(
      'person_veririfcation_FMD',
      window.Fingerprint.b64UrlTo64(samples[0])
    );

    //get response and filter data
    const personFMD = localStorage.getItem('person_veririfcation_FMD');
    let fingerData = { finger_data: personFMD };
    verifySampleAcquired(fingerData).then((response) => {
      // console.log('Response ', response);
      if (response.header.responseCode === 200) {
        searchPersonFP(response.body?.id);
        // message.success({
        //   title: 'Success',
        //   content:
        //     'Patient No. :' +
        //     response.data.patient_number +
        //     '\n' +
        //     'Patient Name:' +
        //     response.data.full_name,
        // });
        onStop();
      } else {
        searchPersonFP();
        message.warning({
          title: 'No Patient Found',
          content: response.data,
          onOk() {},
          onCancel() {},
        });
      }

      //onfilter stop capture
      //onStop();
    });
  } else {
    alert('Capture Format Error');
  }
}

export function verifySampleAcquired(obj) {
  let token = localStorage.getItem('naks_token')
    ? JSON.parse(localStorage.getItem('naks_token'))
    : '';
  return fetch('http://localhost:8080/api/user/verify', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return error;
    });
}

function markDeviceAsActive(val) {
  deviceStatus = val;
}

export function checkIfDeviceIsActive() {
  return deviceStatus;
}
