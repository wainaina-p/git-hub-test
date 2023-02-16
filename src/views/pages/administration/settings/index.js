import Loadable from 'react-loadable';
import { Loading } from 'common/navigation';
import { configurationRoutes } from './configurations';

const Setups = Loadable({
  loader: () => import('./setup'),
  loading: Loading,
});

export const settingRoutes = [
  ...configurationRoutes,
  {
    path: '/settings/system',
    exact: true,
    component: Setups,
    name: 'Setups',
  },
];
