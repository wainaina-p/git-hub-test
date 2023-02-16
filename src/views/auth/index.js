import Loadable from 'react-loadable';
import Loader from '../../components/Loader';
import PageLoading from '../../components/PageLoading';

const Login = Loadable({
  loader: () => import('./components/Login'),
  loading: PageLoading,
});



// const ResetPassword = Loadable({
//   loader: () => import("./components/ResetPassword"),
//   loading: PageLoading,
// });

const OnboardProvider = Loadable({
  loader: () => import('./components/onboarding'),
  loading: PageLoading,
});

export const routes = [
  {
    path: '/login',
    exact: true,
    name: 'Login',
    component: Login,
  },
 

  // {
  //   path: "/password-reset",
  //   exact: true,
  //   name: "Forgot",
  //   component: ResetPassword,
  // },
  {
    path: '/onboarding',
    exact: true,
    name: 'Onboard Provider',
    component: OnboardProvider,
  },
];
