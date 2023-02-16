import { CHANGE_THEME } from './actionTypes';
import * as LocalStorage from '../../util/localstorage';

export default (
  state = { theme: LocalStorage.get('proivder_api_skin') || 'light' },
  action
) => {
  switch (action.type) {
    case CHANGE_THEME:
      LocalStorage.put('proivder_api_skin', action.payload);
      return { theme: action.payload };
    default:
      return state;
  }
};
