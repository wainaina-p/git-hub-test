import Loadable from "react-loadable";
import { Loading } from "common/navigation";

const EditServicePoints = Loadable({
  loader: () => import("./components/servicePointsForm"),
  loading: Loading,
});

export const servicePointsRoutes = [
  {
    path: "/provider-setup/edit-service-points",
    exact: true,
    name: "Edit Service Points",
    component: EditServicePoints,
  },
];
