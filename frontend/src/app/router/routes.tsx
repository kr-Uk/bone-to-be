import { createBrowserRouter } from "react-router-dom";

import ErrorLayout from "@/app/layouts/ErrorLayout";
import RootLayout from "@/app/layouts/RootLayout";
import BasicInfoPage from "@/pages/diagnosis/BasicInfoPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorLayout />,
    children: [
      {
        path: "diagnosis/basic-info",
        element: <BasicInfoPage />,
      },
    ],
  },
]);
