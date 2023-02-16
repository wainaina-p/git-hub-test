import Loadable from 'react-loadable';
import { Loading } from 'common/navigation';

const EditDoctor = Loadable({
  loader: () => import('./components/doctorForm'),
  loading: Loading,
});
const ViewDoctor = Loadable({
  loader: () => import('./components/doctorProfileView'),
  loading: Loading,
});


export const doctorRoutes = [
  {
    path: '/provider-setup/edit-doctor',
    exact: true,
    name: 'Edit Doctor',
    component: EditDoctor,
  },
  {
    path: '/provider-setup/view-doctor',
    exact: true,
    name: 'View Doctor',
    component: ViewDoctor,
  },
];