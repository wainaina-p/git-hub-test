import React, { useState, useEffect } from 'react';
import moment from 'moment';

let intrvl;

const Timer = (props) => {
  let timeData = JSON.parse(localStorage.getItem('TAT_SC'));

  const [foundTimeData, setFoundtimeData] = useState(false);
  const [seconds, setSeconds] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [hours, setHours] = useState('00');

  useEffect(() => {
    const { data, currentPatient } = props;
    console.log('time data:\n', timeData);
    console.log('Props:\n', props);
    if (timeData && timeData.length > 0) {
      let currentTimeData = null;
      if (currentPatient) {
        currentTimeData = timeData.filter(
          (item) => item.patientNo === currentPatient.patient_no
        );
      } else {
        currentTimeData = timeData.filter(
          (item) => item.patientNo === data.patient_no
        );
      }
      if (currentTimeData.length > 0) {
        setFoundtimeData(true);
        console.log('currentTimeData:\n', currentTimeData);

        let elapsedSeconds = 0;
        let startTime = moment(currentTimeData[0].currentTime, 'hh:mm:ss');
        let currentTime = moment().format('hh:mm:ss');
        let now = moment(currentTime, 'hh:mm:ss');

        elapsedSeconds = now.diff(startTime, 'seconds');

        startTimer(elapsedSeconds);
      } else {
        setFoundtimeData(false);
      }
    } else {
      stopTimer();
    }
  }, [props.params, props.data, props.currentPatient]);

  // useEffect(() => {
  //   const { data, currentPatient } = props;
  //   let currentTimeData;

  //   currentTimeData=

  //   if (currentPatient) {
  //     if (currentPatient.patient_no === timeData.patientNo)
  //       if (timeData.length > 0) {
  //         let elapsedSeconds = 0;
  //         let startTime = moment(timeData, 'hh:mm:ss');
  //         let currentTime = moment().format('hh:mm:ss');
  //         let now = moment(currentTime, 'hh:mm:ss');

  //         elapsedSeconds = now.diff(startTime, 'seconds');

  //         startTimer(elapsedSeconds);
  //       } else {
  //         stopTimer();
  //       }
  //   } else {
  //   }
  // }, [props.data, props.currentPatient, props.params]);

  //start timer
  const startTimer = (elapsedSeconds) => {
    let ss =
        elapsedSeconds === 0 ? 0 : Math.floor((elapsedSeconds % 3600) % 60),
      mm = elapsedSeconds === 0 ? 0 : Math.floor((elapsedSeconds % 3600) / 60),
      hh = elapsedSeconds === 0 ? 0 : Math.floor(elapsedSeconds / 3600);

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
    setSeconds('00');
    setMinutes('00');
    setHours('00');

    clearInterval(intrvl);
  }; // stop timer ends

  const setZeros = (i) => {
    if (i < 10) return '0' + i;
    return i;
  };

  return (
    <div className='counter'>
      <h3 className='count-timer'>
        {foundTimeData
          ? hours + ' : ' + minutes + ' : ' + seconds
          : '00 : 00 : 00'}
      </h3>
    </div>
  );
};

export default Timer;
