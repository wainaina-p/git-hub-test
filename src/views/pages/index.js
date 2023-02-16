import Loadable from 'react-loadable';
import { Loading } from 'common/navigation';
import { routes as adminRoutes } from './administration';
import { doctorRoutes } from './providerSetup/doctorProfile';
import { facilityRoutes } from './providerSetup/facility';
import { servicePointsRoutes } from './providerSetup/servicePoints';
import { codesmanagementRoutes } from './administration/settings/manageCodes';
import { appointmentRoutes } from './appointments';
import { patientmanagentRoutes } from './patientManagement';
import { servicesSetupRoutes } from './administration/settings/services';
import { userRoutes } from './userManagement/Users';

const Dashboard = Loadable({
  loader: () => import('./homeDash'),
  loading: Loading,
});

// const MembersManagement = Loadable({
//   loader: () => import('./members/components/members'),
//   loading: Loading,
// });

const ClaimsManagement = Loadable({
  loader: () => import('./claimsManagement'),
  loading: Loading,
});

const AccountProfile = Loadable({
  loader: () => import('./accountProfile'),
  loading: Loading,
});

const UserandRoles = Loadable({
  loader: () => import('./userManagement'),
  loading: Loading,
});

const ReceivedClaims = Loadable({
  loader: () => import('./smartLink/components/receivedClaims'),
  loading: Loading,
});

const ForwardedMembers = Loadable({
  loader: () => import('./smartLink/components/forwardedMembers'),
  loading: Loading,
});

const PersonRegister = Loadable({
  loader: () => import('./patientManagement/components/StaffRegister'),
  loading: Loading,
});
const NewPatient = Loadable({
  loader: () => import('./patientManagement/components/NewStaff'),
  loading: Loading,
});

const LaunchSL = Loadable({
  loader: () => import('./smartLink/components/launchSL'),
  loading: Loading,
});

const SLSetup = Loadable({
  loader: () => import('./smartLink/components/setup/setup'),
  loading: Loading,
});

const Queue = Loadable({
  loader: () => import('./queue/components/servicePoints'),
  loading: Loading,
});

const QueuePoint = Loadable({
  loader: () => import('./queue/components/queueManagement'),
  loading: Loading,
});

const Appointments = Loadable({
  loader: () => import('./appointments/components'),
  loading: Loading,
});

const CreateAppointment = Loadable({
  loader: () => import('./appointments/components/NewAppointment'),
  loading: Loading,
});

const ProviderSetup = Loadable({
  loader: () => import('./providerSetup'),
  loading: Loading,
});

export const routes = [
  ...adminRoutes,
  ...doctorRoutes,
  ...facilityRoutes,
  ...servicePointsRoutes,
  ...codesmanagementRoutes,
  ...appointmentRoutes,
  ...patientmanagentRoutes,
  ...servicesSetupRoutes,
  ...userRoutes,

  {
    path: '/',
    exact: true,
    name: 'Dashboard',
    component: Dashboard,
  },

  {
    path: '/smart-link/launch',
    exact: true,
    component: LaunchSL,
    name: 'LaunchSL',
  },

  {
    path: '/staff-management/appointments',
    exact: true,
    component: Appointments,
    name: 'Appointments',
  },
  {
    path: '/staff-management/appointments/create',
    exact: true,
    component: CreateAppointment,
    name: 'Create Appointment',
  },

  {
    path: '/smart-link/forwarded-members',
    exact: true,
    component: ForwardedMembers,
    name: 'Forwarded Members',
  },
  {
    path: '/staff-management/staff-register',
    exact: true,
    component: PersonRegister,
    name: 'Patient Register',
  },
  {
    path: '/staff-management/new-staff',
    exact: true,
    component: NewPatient,
    name: 'New patient',
  },

  {
    path: '/smart-link/received-claims',
    exact: true,
    component: ReceivedClaims,
    name: 'Received Claims',
  },

  {
    path: '/smart-link/setup',
    exact: true,
    component: SLSetup,
    name: 'SL Setup',
  },

  {
    path: '/queue',
    exact: true,
    component: Queue,
    name: 'Queue',
  },

  {
    path: '/queue/point/:id',
    exact: true,
    component: QueuePoint,
    name: 'Queue',
  },

  {
    path: '/my-profile',
    exact: true,
    name: 'My Profile',
    component: AccountProfile,
  },

  {
    path: '/user-management',
    exact: true,
    name: 'User & Roles',
    component: UserandRoles,
  },

  {
    path: '/provider-setup',
    exact: true,
    name: 'Provider Setup',
    component: ProviderSetup,
  },
];

export { AccountProfile, ClaimsManagement };
