import { createBrowserRouter } from "react-router-dom";

import ErrorLayout from "@/app/layouts/ErrorLayout";
import { MainLayout } from "@/layouts/MainLayout";
import CommunityPage from "@/pages/community/CommunityPage";
import BasicInfoPage from "@/pages/diagnosis/BasicInfoPage";
import ReportPage from "@/pages/diagnosis/ReportPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { LoginPage } from "@/pages/LoginPage";
import MainPage from "@/pages/mainpage/MainPage";
import { PasswordResetPage } from "@/pages/PasswordResetPage";
import PhotoCapturePage from "@/pages/photo-capture/PhotoCapturePage";
import ProfilePage from "@/pages/profile/profile";
import { WithdrawPage } from "@/pages/WithdrawPage";

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
        path: "diagnosis",
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
            path: "report/:reportId",
            element: <ReportPage />,
          },
        ],
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "profile/:nickname",
        element: <ProfilePage />,
      },
      {
        path: "community",
        element: <CommunityPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/findPW",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/password-reset",
    element: <PasswordResetPage />,
  },
  {
    path: "/withdraw",
    element: <WithdrawPage />,
  },
]);
