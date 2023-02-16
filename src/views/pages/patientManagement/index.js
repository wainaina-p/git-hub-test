import Loadable from 'react-loadable';
import { Loading } from 'common/navigation';

const EditPatientRecord = Loadable({
  loader: () => import('./components/patientRegisterForm'),
  loading: Loading,
});


const CaptureFP = Loadable({
  loader: () => import('./components/fingerprint_v2/Registration/Staff'),
  // loader: () => import('./components/fingerprint/patientsfpcapture'),
  loading: Loading,
});

export const patientmanagentRoutes = [
  {
    path: '/staff-management/staff-register/edit-patient-record',
    exact: true,
    name: 'Edit Patient Record',
    component: EditPatientRecord,
  },
  {
    path: '/capture-staff-fp',
    exact: true,
    component: CaptureFP,
    name: 'CaptureFP',
  },
  
];
