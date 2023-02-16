import Loadable from "react-loadable";
import { Loading } from "common/navigation";

const CodesManagement = Loadable({
  loader: () => import("./components/index"),
  loading: Loading,
});
const EditCodesValue = Loadable({
  loader: () => import("./components/manageCodesForm"),
  loading: Loading,
});

export const codesmanagementRoutes = [
  {
    path: "/settings/system/codes",
    exact: true,
    component: CodesManagement,
    name: "CodesManagement",
  },
  {
    path: "/settings/system/codes/edit-codes-value",
    exact: true,
    component: EditCodesValue,
    name: "EditCodesValue",
  },
];
