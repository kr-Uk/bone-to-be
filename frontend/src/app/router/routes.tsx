import { createBrowserRouter } from "react-router-dom";

import type { ReactElement } from "react";

import ErrorLayout from "@/app/layouts/ErrorLayout";
import { MainLayout } from "@/layouts/MainLayout";
import AboutPage from "@/pages/AboutPage/AboutPage";
import CommunityPage from "@/pages/community/CommunityPage";
import BasicInfoPage from "@/pages/diagnosis/BasicInfoPage";
import ReportPage from "@/pages/diagnosis/ReportPage";
import ForbiddenPage from "@/pages/Forbidden/Forbidden";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { LoginPage } from "@/pages/LoginPage";
import MainPage from "@/pages/mainpage/MainPage";
import NotFound from "@/pages/NotFound/NotFound";
import { PasswordChangePage } from "@/pages/PasswordChangePage";
import { PasswordResetPage } from "@/pages/PasswordResetPage";
import PhotoCapturePage from "@/pages/photo-capture/PhotoCapturePage";
import ProfilePage from "@/pages/profile/profile";
import ProfileEditPage from "@/pages/profile/ProfileEditPage";
import { WithdrawPage } from "@/pages/WithdrawPage";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";

// Helper function to wrap components with ProtectedRoute
const withAuth = (element: ReactElement) => <ProtectedRoute>{element}</ProtectedRoute>;

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
            element: withAuth(<BasicInfoPage />),
          },
          {
            path: "photo-capture",
            element: withAuth(<PhotoCapturePage />),
          },
          {
            path: "report/:reportId",
            element: withAuth(<ReportPage />),
          },
        ],
      },
      {
        path: "profile",
        element: withAuth(<ProfilePage />),
      },
      {
        path: "profile/:userId",
        element: withAuth(<ProfilePage />),
      },
      {
        path: "community",
        element: withAuth(<CommunityPage />),
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
    element: withAuth(<PasswordChangePage />),
  },
  {
    path: "/withdraw",
    element: withAuth(<WithdrawPage />),
  },
  {
    path: "/profile/edit",
    element: withAuth(<ProfileEditPage />),
  },
  {
    path: "/forbidden",
    element: withAuth(<ForbiddenPage />),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
