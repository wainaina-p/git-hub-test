import Loadable from "react-loadable";
import { Loading } from "common/navigation";

const EditUser = Loadable({
  loader: () => import("./components/userForm"),
  loading: Loading,
});

export const userRoutes = [
  {
    path: "/user-management/user/edit-user",
    exact: true,
    name: "Edit User",
    component: EditUser,
  },

];
