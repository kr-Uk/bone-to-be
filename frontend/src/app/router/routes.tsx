import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import type { ReactElement } from "react";

import ErrorLayout from "@/app/layouts/ErrorLayout";
import { MainLayout } from "@/layouts/MainLayout";
import MainPage from "@/pages/mainpage/MainPage";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { RouteFallback } from "@/shared/components/RouteFallback";

// Helper function to wrap components with ProtectedRoute
const withAuth = (element: ReactElement) => <ProtectedRoute>{element}</ProtectedRoute>;
const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

const AboutPage = lazy(() => import("@/pages/AboutPage/AboutPage"));
const CommunityPage = lazy(() => import("@/pages/community/CommunityPage"));
const BasicInfoPage = lazy(() => import("@/pages/diagnosis/BasicInfoPage"));
const ReportPage = lazy(() => import("@/pages/diagnosis/ReportPage"));
const PhotoCapturePage = lazy(() => import("@/pages/photo-capture/PhotoCapturePage"));
const ProfilePage = lazy(() => import("@/pages/profile/profile"));
const ProfileEditPage = lazy(() => import("@/pages/profile/ProfileEditPage"));
const ForbiddenPage = lazy(() => import("@/pages/Forbidden/Forbidden"));
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((mod) => ({ default: mod.LoginPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/pages/ForgotPasswordPage").then((mod) => ({ default: mod.ForgotPasswordPage })),
);
const PasswordResetPage = lazy(() =>
  import("@/pages/PasswordResetPage").then((mod) => ({ default: mod.PasswordResetPage })),
);
const PasswordChangePage = lazy(() =>
  import("@/pages/PasswordChangePage").then((mod) => ({ default: mod.PasswordChangePage })),
);
const WithdrawPage = lazy(() =>
  import("@/pages/WithdrawPage").then((mod) => ({ default: mod.WithdrawPage })),
);

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
            element: withAuth(withSuspense(<BasicInfoPage />)),
          },
          {
            path: "photo-capture",
            element: withAuth(withSuspense(<PhotoCapturePage />)),
          },
          {
            path: "report/:reportId",
            element: withAuth(withSuspense(<ReportPage />)),
          },
        ],
      },
      {
        path: "profile",
        element: withAuth(withSuspense(<ProfilePage />)),
      },
      {
        path: "profile/:userId",
        element: withAuth(withSuspense(<ProfilePage />)),
      },
      {
        path: "community",
        element: withAuth(withSuspense(<CommunityPage />)),
      },
      {
        path: "about",
        element: withSuspense(<AboutPage />),
      },
    ],
  },
  {
    path: "/login",
    element: withSuspense(<LoginPage />),
  },
  {
    path: "/findPW",
    element: withSuspense(<ForgotPasswordPage />),
  },
  {
    path: "/password-reset",
    element: withSuspense(<PasswordResetPage />),
  },
  {
    path: "/profile/password",
    element: withAuth(withSuspense(<PasswordChangePage />)),
  },
  {
    path: "/withdraw",
    element: withAuth(withSuspense(<WithdrawPage />)),
  },
  {
    path: "/profile/edit",
    element: withAuth(withSuspense(<ProfileEditPage />)),
  },
  {
    path: "/forbidden",
    element: withAuth(withSuspense(<ForbiddenPage />)),
  },
  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
]);
