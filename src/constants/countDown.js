import React, { Component } from 'react';

function setZeros(i) {
  if (i < 10) return '0' + i;
  return i;
}

class Counter extends Component {
  constructor() {
    super();

    let start = 0,
      intrvl;

    this.state = {
      s: '00',
      m: '00',
      h: '00',
    };

    //start timer
    this.startTimer = () => {
      // if startTimer is already running
      if (this.start === 1) return;

      this.start = 1; // set startTimer is running
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
        this.setState({
          s: setZeros(ss),
          m: setZeros(mm),
          h: setZeros(hh),
        });
      }, 1000);
    }; // start timer ends

    //stop timer
    this.stopTimer = () => {
      if (this.start == 0) return;
      this.start = 0;
      this.setState({
        s: '00',
        m: '00',
        h: '00',
      });
      clearInterval(intrvl);
    }; // stop timer ends
  }

  render() {
    let { s, m, h } = this.state;
    return (
      <div className='counter'>
        <div className='start' onClick={this.startTimer}>
          <h1>START</h1>
        </div>
        <div className='stop' onClick={this.stopTimer}>
          <h1>STOP</h1>
        </div>
        <h3 className='count-timer'>{h + ' : ' + m + ' : ' + s}</h3>
      </div>
    );
  }
}

export default Counter;
