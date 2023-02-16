import React, { Component } from 'react';
import logo from '../../../assets/images/smart_logo.png';
import styles from './auth.module.css';

const Forgot = (props) => (
  <div>
    <div className={styles.header}>
      <div className={styles['header-wrapper']}>
        <header>
          <a href='/'>
            <img src={logo} alt='Proivder API' />
          </a>
          <div className={styles['nav-wrapper']}>
            <nav>
              <ul>
                <li>
                  <a href='#' target='_blank' rel='noopener noreferrer'>
                    Help
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </div>
    Password Reset
    <div className={styles['footer']}>
      {' '}
      © wawerusimes@gmail.com. All rights reserved
    </div>
  </div>
);

export default Forgot;
