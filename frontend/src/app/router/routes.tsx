import { createBrowserRouter } from "react-router-dom";

import DiagnosisLayout from "../layouts/DiagnosisLayout";

import ErrorLayout from "@/app/layouts/ErrorLayout";
import { MainLayout } from "@/layouts/MainLayout";
import CommunityPage from "@/pages/community/CommunityPage";
import BasicInfoPage from "@/pages/diagnosis/BasicInfoPage";
import ReportPage from "@/pages/diagnosis/ReportPage";
import { LoginPage } from "@/pages/LoginPage";
import MainPage from "@/pages/mainpage/MainPage";
import PhotoCapturePage from "@/pages/photo-capture/PhotoCapturePage";
import ProfilePage from "@/pages/profile/profile";

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
        path: "diagnosis",
        element: <DiagnosisLayout />,
        children: [
          {
            path: "basic-info",
            element: <BasicInfoPage />,
          },
          {
            path: "photo-capture",
            element: <PhotoCapturePage />,
          },
          {
            path: "report",
            element: <ReportPage />,
          },
        ],
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "community",
        element: <CommunityPage />,
      },
    ],
  },
]);
