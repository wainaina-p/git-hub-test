import { message } from 'antd';
import { getAccessToken } from '_helpers/globalVariables';
import $ from 'jquery';

// const BASE_URL = 'http://192.180.3.26:8200'
const BASE_URL = 'http://localhost:3000';
const TOKEN = getAccessToken();

var test = null;

var state = document.getElementById('content-capture');

var myVal = ''; // Drop down selected value of reader
var disabled = true;
var startEnroll = false;

var currentFormat = window.Fingerprint.SampleFormat.PngImage;
var deviceTechn = {
  0: 'Unknown',
  1: 'Optical',
  2: 'Capacitive',
  3: 'Thermal',
  4: 'Pressure',
};

var deviceModality = {
  0: 'Unknown',
  1: 'Swipe',
  2: 'Area',
  3: 'AreaMultifinger',
};

var deviceUidType = {
  0: 'Persistent',
  1: 'Volatile',
};

export var FingerprintSdk = (function () {
  function FingerprintSdk() {
    //var _instance = this;
    this.operationToRestart = null;
    this.acquisitionStarted = false;
    this.sdk = new window.Fingerprint.WebApi();
    this.sdk.onDeviceConnected = function (e) {
      // Detects if the deveice is connected for which acquisition started
      //showMessage("Device is ready");
    };
    this.sdk.onDeviceDisconnected = function (e) {
      // Detects if device gets disconnected - provides deviceUid of disconnected device
      //showMessage("Device disconnected");
    };
    this.sdk.onCommunicationFailed = function (e) {
      // Detects if there is a failure in communicating with U.R.U web SDK
      //showMessage("Communinication Failed")
    };
    this.sdk.onSamplesAcquired = function (s) {
      // Sample acquired event triggers this function
      sampleAcquired(s);
    };
    this.sdk.onQualityReported = function (e) {
      // Quality of sample aquired - Function triggered on every sample acquired
      document.getElementById('qualityInputBox').value =
        window.Fingerprint.QualityCode[e.quality];
    };
  }

  FingerprintSdk.prototype.startCapture = function () {
    if (this.acquisitionStarted)
      // Monitoring if already started capturing
      return;
    var _instance = this;
    showMessage('');
    this.operationToRestart = this.startCapture;
    this.sdk.startAcquisition(currentFormat, myVal).then(
      function () {
        _instance.acquisitionStarted = true;

        //Disabling start once started
        disableEnableStartStop();
      },
      function (error) {
        showMessage(error.message);
      }
    );
  };
  FingerprintSdk.prototype.stopCapture = function () {
    if (!this.acquisitionStarted)
      //Monitor if already stopped capturing
      return;
    var _instance = this;
    showMessage('');
    this.sdk.stopAcquisition().then(
      function () {
        _instance.acquisitionStarted = false;

        //Disabling stop once stoped
        disableEnableStartStop();
      },
      function (error) {
        showMessage(error.message);
      }
    );
  };

  FingerprintSdk.prototype.getInfo = function () {
    var _instance = this;
    return this.sdk.enumerateDevices();
  };

  FingerprintSdk.prototype.getDeviceInfoWithID = function (uid) {
    var _instance = this;
    return this.sdk.getDeviceInfo(uid);
  };

  return FingerprintSdk;
})();

function showMessage(messageObj) {
  // var _instance = this;
  if (messageObj !== '') {
    message.info(messageObj);
  }
  var statusWindow = document.getElementById('status');
  statusWindow.value = messageObj ? messageObj : '';
}

export function resetCachedData() {
  localStorage.setItem('imageSrc', '');
  localStorage.setItem('haas-fmd', '');

  var vDiv = document.getElementById('imagediv');
  vDiv.innerHTML = '';
  var image = document.createElement('img');
  image.id = 'image';
  image.src = localStorage.getItem('imageSrc');
  vDiv.appendChild(image);
}

export function onClear() {
  var vDiv = document.getElementById('imagediv');
  vDiv.innerHTML = '';
  localStorage.setItem('imageSrc', '');
  localStorage.setItem('wsq', '');
  localStorage.setItem('raw', '');
  localStorage.setItem('intermediate', '');

  disableEnableExport(true);
}
export function onStart() {
  console.log('Starting....');
  assignFormat();
  if (currentFormat == '') {
    alert('Please select a format.');
  } else {
    test.startCapture();
  }
}
export function onStartVerification() {
  console.log('Starting....');
  assignFormat();
  if (currentFormat == '') {
    alert('Please select a format.');
  } else {
    test.startCapture();
  }
}

export function onStop() {
  test.stopCapture();
}
export function onGetInfo() {}

export function checkOnly() {}
export function onImageDownload() {}

function assignFormat() {
  currentFormat = window.Fingerprint.SampleFormat.PngImage;
}

export function readersDropDownPopulate(checkForRedirecting, fp) {
  myVal = '';
  test = fp;
  var allReaders = test.getInfo();
  allReaders.then(
    function (sucessObj) {
      var readersDropDownElement = document.getElementById('readersDropDown');
      readersDropDownElement.innerHTML = '';
      //First ELement
      var option = document.createElement('option');
      option.selected = 'selected';
      option.value = '';
      option.text = 'Select Reader';
      readersDropDownElement.add(option);
      for (let i = 0; i < sucessObj.length; i++) {
        var option = document.createElement('option');
        option.value = sucessObj[i];
        option.text = sucessObj[i];
        readersDropDownElement.add(option);
      }

      disableEnable(); // Disabling enabling buttons - if reader not selected
      enableDisableScanQualityDiv('content-reader'); // To enable disable scan quality div
      disableEnableExport(true);
      //Check if readers are available get count and  provide user information if no reader available,
      //if only one reader available then select the reader by default and sennd user to capture tab
      checkReaderCount(sucessObj, checkForRedirecting);
    },
    function (error) {
      showMessage(error.message);
    }
  );
}

// Stop-- Optional to make GUI user freindly

function enableDisableScanQualityDiv(id) {
  if (id == 'content-reader') {
    document.getElementById('Scores').style.display = 'none';
  } else {
    document.getElementById('Scores').style.display = 'block';
  }
}

//Enable disable buttons
function disableEnable() {
  if (myVal != '') {
    disabled = false;
    $('#start').prop('disabled', false);
    $('#stop').prop('disabled', false);
    //showMessage("");
    disableEnableStartStop();
  } else {
    disabled = true;
    $('#start').prop('disabled', true);
    $('#stop').prop('disabled', true);
    //showMessage("Please select a reader");
    onStop();
  }
}

function disableEnableExport(val) {
  if (val) {
    $('#saveImagePng').prop('disabled', true);
  } else {
    $('#saveImagePng').prop('disabled', false);
  }
}

// Start-- Optional to make GUi user frindly
//To make Start and stop buttons selection mutually exclusive
$('body').click(function () {
  disableEnableStartStop();
});

function disableEnableStartStop() {
  if (!myVal == '') {
    if (test.acquisitionStarted) {
      $('#start').prop('disabled', true);
      $('#stop').prop('disabled', false);
    } else {
      $('#start').prop('disabled', false);
      $('#stop').prop('disabled', true);
    }
  }
}

function checkReaderCount(sucessObj, checkForRedirecting) {
  if (sucessObj.length == 0) {
    alert('No reader detected. Please connect a reader.');
  } else if (sucessObj.length == 1) {
    document.getElementById('readersDropDown').selectedIndex = '1';
    if (checkForRedirecting) {
      enableDisableScanQualityDiv('content-capture'); // To enable disable scan quality div
      //setActive('Capture', 'Reader'); // Set active state to capture
    }
  }

  selectChangeEvent(); // To make the reader selected
}

function selectChangeEvent() {
  var readersDropDownElement = document.getElementById('readersDropDown');
  myVal =
    readersDropDownElement.options[readersDropDownElement.selectedIndex].value;
  disableEnable();
  onClear();
  document.getElementById('imageGallery').innerHTML = '';

  //Make capabilities button disable if no user selected
  if (myVal == '') {
    $('#capabilities').prop('disabled', true);
  } else {
    $('#capabilities').prop('disabled', false);
  }
}

function setActive(element1, element2) {
  document.getElementById(element2).className = '';

  // And make this active
  document.getElementById(element1).className = 'active';
}

function sampleAcquired(s) {
  if (currentFormat == window.Fingerprint.SampleFormat.PngImage) {
    // If sample acquired format is PNG- perform following call on object recieved
    // Get samples from the object - get 0th element of samples as base 64 encoded PNG image
    console.log('Sample acquired');
    localStorage.removeItem('imageSrc');
    localStorage.removeItem('patient_FMD');
    localStorage.setItem('imageSrc', '');
    var samples = JSON.parse(s.samples);
    console.log('Sample acquired ready');
    console.log('Samples aquired:\n\n', JSON.stringify(samples));
    localStorage.setItem(
      'imageSrc',
      'data:image/png;base64,' + window.Fingerprint.b64UrlTo64(samples[0])
    );
    localStorage.setItem(
      'patient_FMD',
      window.Fingerprint.b64UrlTo64(samples[0])
    );
    //if (state == document.getElementById("content-capture")) {
    console.log('Sample acquired state');
    var vDiv = document.getElementById('imagediv');
    vDiv.innerHTML = '';
    var image = document.createElement('img');
    image.id = 'image';
    image.src = localStorage.getItem('imageSrc');
    vDiv.appendChild(image);
    //}

    disableEnableExport(false);
  } else {
    alert('Format Error');
    //disableEnableExport(true);
  }
}

export function submitSampleAcquired(obj) {
  // let token = getAccessToken()
  return fetch(BASE_URL + 'api/biometrics/patient/enroll', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
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
export function verifySampleAcquired(obj) {
  return fetch(BASE_URL + 'api/biometrics/patient/verify', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
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
