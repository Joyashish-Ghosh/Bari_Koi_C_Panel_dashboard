import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

// import Dashboard from "./Components/Dashboard/DashboardHome.jsx";
// import About from "./Components/Pages/About.jsx";
// import DashboardHome from "./Components/Dashboard/DashboardHome.jsx";
import CRUD from "./Components/Pages/CRUD.jsx";
import Main from "./Components/main.jsx";
import DashboardPage from "./Components/Pages/DashboardPage.jsx";
import Home from "./Components/Pages/Home.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
    
    children: [
      // {
      //   path: "/",
      //   element: <DashboardHome />, // Dashboard page within layout
      // },
      
      // {
      //   path: "dashboardpage",
      //   element: <DashboardPage/>, // Dashboard page within layout
      // },
      
    
      // {
      //   path: "employee",
      //   element: <About></About>,
      // },
      // {
      //   path: "about",
      //   element: <About></About>,
      // },
      {
        path: "/",
        element: <DashboardPage></DashboardPage>,
      },
      // {
      //   path: "crud",
      //   element: <CRUD></CRUD>,
      // },
      {
        path:"/home",
        element: <Home></Home>,
      }
    ],
  },
]);

// Render to DOM
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
