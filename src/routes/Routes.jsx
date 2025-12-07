import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from "../layouts/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
        Component: MainLayout,

        children:[
            {

            },
        ]
  },
]);

export default router;