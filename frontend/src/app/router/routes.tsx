import { createBrowserRouter } from "react-router-dom";

import ErrorLayout from "@/app/layouts/ErrorLayout";
import { MainLayout } from "@/layouts/MainLayout";
import AboutPage from "@/pages/AboutPage/AboutPage";
import CommunityPage from "@/pages/community/CommunityPage";
import BasicInfoPage from "@/pages/diagnosis/BasicInfoPage";
import ReportPage from "@/pages/diagnosis/ReportPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { LoginPage } from "@/pages/LoginPage";
import MainPage from "@/pages/mainpage/MainPage";
import { PasswordChangePage } from "@/pages/PasswordChangePage";
import { PasswordResetPage } from "@/pages/PasswordResetPage";
import PhotoCapturePage from "@/pages/photo-capture/PhotoCapturePage";
import ProfilePage from "@/pages/profile/profile";
import ForbiddenPage from "@/pages/Forbidden/Forbidden";
import ProfileEditPage from "@/pages/profile/ProfileEditPage";
import { WithdrawPage } from "@/pages/WithdrawPage";
import NotFound from "@/pages/NotFound/NotFound";

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
        path: "profile/:userId",
        element: <ProfilePage />,
      },
      {
        path: "community",
        element: <CommunityPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
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
    path: "/profile/password",
    element: <PasswordChangePage />,
  },
  {
    path: "/withdraw",
    element: <WithdrawPage />,
  },
  {
    path: "/profile/edit",
    element: <ProfileEditPage />,
  },
  {
    path: "/forbidden",
    element: <ForbiddenPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
