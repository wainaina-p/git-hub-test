import Loadable from "react-loadable";
import { Loading } from "common/navigation";

const EditFacility = Loadable({
  loader: () => import("./components/facilityForm"),
  loading: Loading,
});
const FacilityView = Loadable({
  loader: () => import("./components/facilityView"),
  loading: Loading,
});

export const facilityRoutes = [
  {
    path: "/provider-setup/facilities/edit-facility",
    exact: true,
    name: "Edit Facility",
    component: EditFacility,
  },
  {
    path: "/provider-setup/facilities/view-facility",
    exact: true,
    name: "Facility View",
    component: FacilityView,
  },
];
