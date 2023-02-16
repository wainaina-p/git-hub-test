import React from 'react';
import { Menu, Dropdown } from 'antd';
import { connect } from 'react-redux';
import { i18nSelect } from '../i18n/actions';
import styles from '../header/header.module.css';
import * as LocalStorage from '../../util/localstorage';

class LanguageSelector extends React.Component {
  handleClick = (e) => {
    console.log('click ', e);
    this.props.selectLanguage(e);
    LocalStorage.put('provider_api_locale', e.key);
  };

  render() {
    console.log('my props ... ', this.props);
    let locales = this.props.locales;
    let language = this.props.language;

    if (!this.props.language) return <div />;
    const menu = (
      <Menu onClick={this.handleClick}>
        {Object.keys(locales).map((locale) => (
          <Menu.Item key={locale}>&nbsp;{locales[locale]}</Menu.Item>
        ))}
      </Menu>
    );
    return (
      <>
        <Dropdown overlay={menu} placement='bottomRight'>
          <span className={styles['header-dropdown-link']}>
            <span>{locales[language]}</span>
          </span>
        </Dropdown>
      </>
    );
  }
  selectLanguage = (language) => {
    this.props.selectLanguage(language);
  };
}

const mapStateToProps = (state) => ({
  locales: state.i18ning.locales,
  language: state.i18ning.language,
});
const mapDispachToProps = (dispatch, props) => ({
  selectLanguage: (lang) => {
    dispatch(i18nSelect(lang));
  },
});
export default connect(mapStateToProps, mapDispachToProps)(LanguageSelector);
