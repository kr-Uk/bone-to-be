import { createBrowserRouter } from "react-router-dom";

import ErrorLayout from "@/app/layouts/ErrorLayout";
import RootLayout from "@/app/layouts/RootLayout";
import BasicInfoPage from "@/pages/diagnosis/BasicInfoPage";
import MainPage from "@/pages/mainpage/MainPage";
import PhotoCapturePage from "@/pages/photo-capture/PhotoCapturePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
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
