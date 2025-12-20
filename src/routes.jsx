import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/features/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { Users, Roles, Privileges } from "@/pages/admin";
import ProtectedRoute from "@/router/ProtectedRoute";
import { ROLES } from "@/constants/roles";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <ProtectedRoute element={<Home />} requiredRoles={[ROLES.READ_REPORTS]} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <ProtectedRoute element={<Profile />} />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <ProtectedRoute element={<Tables />} />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <ProtectedRoute element={<Notifications />} />,
      },
    ],
  },
  {
    layout: "dashboard",
    title: "admin",
    pages: [
      {
        icon: <UserCircleIcon {...icon} />,
        name: "users",
        path: "/users",
        element: <ProtectedRoute element={<Users />} requiredRoles={[ROLES.READ_USERS]} />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "roles",
        path: "/roles",
        element: <ProtectedRoute element={<Roles />} requiredRoles={[ROLES.READ_ROLE]} />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "privileges",
        path: "/privileges",
        element: <ProtectedRoute element={<Privileges />} requiredRoles={[ROLES.READ_PRIVILEGES]} />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
