import Loadable from 'react-loadable';
import { Loading } from 'common/navigation';

const ConfirmAndQueue = Loadable({
  loader: () => import('./components/confirmAndQueue'),
  loading: Loading,
});

export const appointmentRoutes = [
  {
    path: '/staff-management/appointments/confirm-appointment-and-queue',
    exact: true,
    name: 'Confirm And Queue',
    component: ConfirmAndQueue,
  },
];
