import * as LocalStorage from '../../util/localstorage';
import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_FAIL } from './actions';


const initialState = {
    isAuthenticated: null,
    user: null,
    isLoading: false,
    token: LocalStorage.get('token'),
}

export default (state = initialState, action) => {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            LocalStorage.remove('token');
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
                token: action.token
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            return {
                ...state,
                isAuthenticated: falsle,
                isLoading: false,
                user: null,
                token: null
            };
        default:
            return state;
    }
}