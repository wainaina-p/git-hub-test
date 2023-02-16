import React, { useState, useEffect } from 'react';
import moment from 'moment';

let start = 0;
let intrvl;

const Timer = (props) => {
  const [seconds, setSeconds] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [hours, setHours] = useState('00');

  const timeStamp = localStorage.getItem('TAT_SC');

  useEffect(() => {}, []);

  useEffect(() => {
    const { params } = props;
    console.log('Time stamp fron draft:\n', timeStamp);

    if (params) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [props.params]);

  //start timer
  const startTimer = () => {
    // if startTimer is already running
    if (start === 1) return;

    start = 1; // set startTimer is running
    let ss = 0,
      mm = 0,
      hh = 0;
    intrvl = setInterval(() => {
      ss++;
      if (ss === 60) {
        ss = 0;
        mm++;
      }
      if (mm === 60) {
        mm = 0;
        hh++;
      }

      setSeconds(setZeros(ss));
      setMinutes(setZeros(mm));
      setHours(setZeros(hh));
    }, 1000);
  };

  const stopTimer = () => {
    if (start === 0) return;
    start = 0;

    setSeconds('00');
    setMinutes('00');
    setHours('00');

    clearInterval(intrvl);
  }; // stop timer ends

  const setZeros = (i) => {
    console.log('set zero (i):\n', i);
    if (i < 10) return '0' + i;
    return i;
  };

  return (
    <div className='counter'>
      <h3 className='count-timer'>
        {hours + ' : ' + minutes + ' : ' + seconds}
      </h3>
    </div>
  );
};

export default Timer;
