import { setupI18n } from '@lingui/core';
import * as LocalStorage from './util/localstorage';

export const locales = {
  en: 'English',
  sw: 'Swahili',
  fr: 'French',
};

export const defaultLocale = LocalStorage.get('provider_api_locale') || 'en';

function loadCatalog(locale) {
  return import(
    /* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */
    `./locales/${locale}/messages.js`
  );
}

export const i18n = setupI18n();
i18n.load(loadCatalog);
