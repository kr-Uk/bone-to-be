import { createBrowserRouter } from "react-router-dom";

import ErrorLayout from "@/app/layouts/ErrorLayout";
import { MainLayout } from "@/layouts/MainLayout";
import BasicInfoPage from "@/pages/diagnosis/BasicInfoPage";
import MainPage from "@/pages/mainpage/MainPage";
import { LoginPage } from "@/pages/LoginPage";
import PhotoCapturePage from "@/pages/photo-capture/PhotoCapturePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "diagnosis/basic-info",
        element: <BasicInfoPage />,
      },
      {
        path: "diagnosis/photo-capture",
        element: <PhotoCapturePage />,
      },
    ],
  },
]);
