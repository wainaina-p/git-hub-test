import { CHANGE_THEME, I18N_INIT, I18N_SELECT } from './actionTypes';
import { i18n, defaultLocale, locales } from '../../i18n';

export const changeAppTheme = (theme) => ({
    type: CHANGE_THEME,
    payload: theme,
});


export function i18nInit() {
    return dispatch => {
        dispatch({
            type: I18N_INIT,
            payload: locales
        });
    };
}

export function i18nSelect(lang) {
    const { key } = lang;
    const tolang = key ? key : defaultLocale;
    return dispatch => {
        i18n.activate(tolang)
        dispatch({
            type: I18N_SELECT,
            payload: tolang
        });
    }
}
