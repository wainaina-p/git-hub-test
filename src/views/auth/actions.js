let CryptoJS = require("crypto-js");

export const USER_LOADED = "USER_LOADED";
export const USER_LOADING = "USER_LOADING";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "USER_LOADED";
export const REGISTER_FAIL = "USER_LOADED";
export const encryptFacilityCode = (facilityCode) => {
  var secretkey = "CONNECTAPPCONNECTAPPCONNECTAPP57";
  var key = CryptoJS.enc.Utf8.parse(secretkey);
  var iv = CryptoJS.enc.Utf8.parse(secretkey.substring(0, 16));

  /*-- Encryption --*/
  var cipherText = CryptoJS.AES.encrypt(facilityCode, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return cipherText;
};
