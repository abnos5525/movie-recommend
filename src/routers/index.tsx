import { createBrowserRouter } from "react-router-dom";
import Offline from "../Offline";
import { map } from "./map";
import Template from "../templates";
import { lazy } from "react";

const Home = lazy(() => import('../components/Home'));

export const routers = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      {
        index: true,
        path: map.home,
        element: <Home />,
      },
      // اضافه کردن سایر روت‌ها به صورت فرزند
      // {
      //   path: "about",
      //   element: <About />,
      // },
    ],
  },
  {
    path: map.offline,
    element: <Offline />,
  },
]);