import Loadable from "react-loadable";
import { Loading } from "common/navigation";


const ServicesSetup = Loadable({
  loader: () => import("./components/index"),
  loading: Loading,
});
const EditService = Loadable({
  loader: () => import("./components/servicesForm"),
  loading: Loading,
});

export const servicesSetupRoutes = [
  {
    path: "/settings/system/services",
    exact: true,
    component: ServicesSetup,
    name: "Services Setup",
  },
  {
    path: "/settings/system/services/edit-service",
    exact: true,
    component: EditService,
    name: "Edit Service",
  },
];
