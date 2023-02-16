import Loadable from 'react-loadable';
import { Loading } from 'common/navigation';

const Configuration = Loadable({
  loader: () => import('./components/Configuration'),
  loading: Loading,
});

export const configurationRoutes = [
  {
    path: '/settings/system/configuration',
    exact: true,
    component: Configuration,
    name: 'Configuration',
    // permission: 'edit_configurations',
  },
];
