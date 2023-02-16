import React from 'react';

console.log('Before Current format:\n');
console.log('window.Fingerprint:\n', window.Fingerprint);
const currentFormat = window?.Fingerprint?.SampleFormat?.PngImage;
console.log('currentFormat:\n', currentFormat);
// var currentFormat = window.Fingerprint.SampleFormat.Raw;

var selectedReader = '';

export var FingerprintsSDK = (function () {
  function FingerprintsSDK() {
    var _instance = this;
    this.operationToRestart = null;
    this.acquisitionStarted = false;

    this.sdk = new window.Fingerprint.WebApi();

    this.sdk.onDeviceConnected = function (e) {
      // console.log('Scan your finger');
      showMessage('Scan your finger');
    };
    this.sdk.onDeviceDisconnected = function (e) {
      // console.log('Device disconnected');
      showMessage('Device disconnected');
    };
    this.sdk.onCommunicationFailed = function (e) {
      // console.log('Communinication Failed');
      showMessage('Communinication Failed');
    };
    this.sdk.onSamplesAcquired = function (s) {
      // console.log('Sample Acquired : ', s);
      showMessage('Sample Acquired');
      sampleAcquired(s);
    };
    this.sdk.onQualityReported = function (e) {
      // console.log(window.Fingerprint.QualityCode[e.quality]);
      document.getElementById('qualityInputBox').value =
        window.Fingerprint.QualityCode[e.quality];
      if (window.Fingerprint.QualityCode[e.quality] === 'Good') {
        document.getElementById('qualityInputBox').style.color = '#2db7f5';
      } else {
        document.getElementById('qualityInputBox').style.color = '#f50';
      }
    };
  }

  FingerprintsSDK.prototype.startCapture = function () {
    if (this.acquisitionStarted)
      // Monitoring if already started capturing
      return;
    var _instance = this;
    this.operationToRestart = this.startCapture;
    this.sdk.startAcquisition(currentFormat, selectedReader).then(
      function () {
        _instance.acquisitionStarted = true;
        //Disabling start once started
        // disableEnableStartStop();
      },
      function (error) {
        console.log(error.message);
      }
    );
  };

  FingerprintsSDK.prototype.stopCapture = function () {
    if (!this.acquisitionStarted)
      //Monitor if already stopped capturing
      return;
    var _instance = this;
    this.sdk.stopAcquisition().then(
      function () {
        _instance.acquisitionStarted = false;

        //Disabling stop once stoped
        // disableEnableStartStop();
      },
      function (error) {
        showMessage(error.message);
        console.log(error.message);
      }
    );
  };

  FingerprintsSDK.prototype.getDeviceList = function () {
    return this.sdk.enumerateDevices();
  };

  return FingerprintsSDK;
})();

function sampleAcquired(s) {
  if (currentFormat === window.Fingerprint.SampleFormat.PngImage) {
    // console.log('window.Fingerprint.SampleFormat.PngImage\n');
    localStorage.setItem('imageSrc', '');
    var samples = JSON.parse(s.samples);
    // console.log('Samples data:\n', samples);
    localStorage.setItem(
      'imageSrc',
      'data:image/png;base64,' + window.Fingerprint.b64UrlTo64(samples[0])
    );

    // var sampleData = window.Fingerprint.b64UrlTo64(samples[0].Data);
    // var decodedData = JSON.parse(window.Fingerprint.b64UrlToUtf8(sampleData));

    var vDiv = document.getElementById('imagediv');
    vDiv.innerHTML = '';
    var image = document.createElement('img');
    image.id = 'image';
    image.src = localStorage.getItem('imageSrc');

    localStorage.setItem('haas-fmd', window.Fingerprint.b64UrlTo64(samples[0]));

    vDiv.appendChild(image);
  } else if (currentFormat === window.Fingerprint.SampleFormat.Raw) {
    // console.log('window.Fingerprint.SampleFormat.Raw\n');
    localStorage.setItem('haas-fmd', '');
    var samples = JSON.parse(s.samples);
    var sampleData = window.Fingerprint.b64UrlTo64(samples[0].Data);
    var decodedData = JSON.parse(window.Fingerprint.b64UrlToUtf8(sampleData));
    localStorage.setItem(
      'haas-fmd',
      window.Fingerprint.b64UrlTo64(decodedData.Data)
    );

    let vDiv = (document.getElementById('imagediv').innerHTML =
      '<div id="animateText" style="display:none">RAW Sample Acquired <br>' +
      Date() +
      '</div>');
    setTimeout(delayAnimate('animateText', 'table-cell'), 100);
  } else if (currentFormat === window.Fingerprint.SampleFormat.Compressed) {
    // console.log('window.Fingerprint.SampleFormat.Compressed\n');
    localStorage.setItem('haas-fmd', '');
    let samples = JSON.parse(s.samples);
    let sampleData = window.Fingerprint.b64UrlTo64(samples[0].Data);
    let decodedData = JSON.parse(window.Fingerprint.b64UrlToUtf8(sampleData));
    localStorage.setItem(
      'haas-fmd',
      'data:application/octet-stream;base64,' +
        window.Fingerprint.b64UrlTo64(decodedData.Data)
    );

    let vDiv = (document.getElementById('imagediv').innerHTML =
      '<div id="animateText" style="display:none">WSQ Sample Acquired <br>' +
      Date() +
      '</div>');
    setTimeout(delayAnimate('animateText', 'table-cell'), 100);
  } else if (currentFormat === window.Fingerprint.SampleFormat.Intermediate) {
    // console.log('window.Fingerprint.SampleFormat.Intermediate\n');
    localStorage.setItem('haas-fmd', '');
    var samples = JSON.parse(s.samples);
    var sampleData = window.Fingerprint.b64UrlTo64(samples[0].Data);
    localStorage.setItem('haas-fmd', btoa(sampleData));

    var vDiv = (document.getElementById('imagediv').innerHTML =
      '<div id="animateText" style="display:none,height:200px">Intermediate Sample Acquired <br>' +
      Date() +
      '</div>');
    setTimeout(delayAnimate('animateText', 'table-cell'), 100);
  } else {
    alert('Format Error');
    //disableEnableExport(true);
  }
}

function showMessage(message) {
  var _instance = this;
  var x = document.getElementById('status');
  // x = state.querySelectorAll("#status");
  // x = document.getElementById("status");
  // x.innerHTML=message;

  // if(x.length != 0){
  //     x[0].innerHTML = message;
  // }
}

export function delayAnimate(id, visibility) {
  document.getElementById(id).style.display = visibility;
}

// function oldsampleAcquired(s) {
//   if (currentFormat === window.Fingerprint.SampleFormat.PngImage) {
//     localStorage.setItem('imageSrc', '');
//     localStorage.setItem('haas-fmd', '');
//     var samples = JSON.parse(s.samples);
//     localStorage.setItem(
//       'imageSrc',
//       'data:image/png;base64,' + window.Fingerprint.b64UrlTo64(samples[0])
//     );

//     // localStorage.setItem("haas-fmd", window.Fingerprint.b64UrlTo64(samples[0]));
//     localStorage.setItem('haas-fmd', window.Fingerprint.b64UrlTo64(samples[0]));

//     var vDiv = document.getElementById('imagediv');
//     vDiv.innerHTML = '';
//     var image = document.createElement('img');
//     image.id = 'image';
//     image.src = localStorage.getItem('imageSrc');
//     vDiv.appendChild(image);
//   } else if (currentFormat === window.Fingerprint.SampleFormat.Intermediate) {
//     localStorage.setItem('haas-fmd', '');
//     var samples = JSON.parse(s.samples);
//     var sampleData = window.Fingerprint.b64UrlTo64(samples[0].Data);
//     localStorage.setItem('haas-fmd', sampleData);
//   }
// }

// function b64EncodeUnicode(str) {
//   // first we use encodeURIComponent to get percent-encoded UTF-8,
//   // then we convert the percent encodings into raw bytes which
//   // can be fed into btoa.
//   return btoa(
//     encodeURIComponent(str).replace(
//       /%([0-9A-F]{2})/g,
//       function toSolidBytes(match, p1) {
//         return String.fromCharCode('0x' + p1);
//       }
//     )
//   );
// }
