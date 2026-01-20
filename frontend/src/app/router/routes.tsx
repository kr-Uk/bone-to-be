import { createBrowserRouter } from "react-router-dom";

import ErrorLayout from "@/app/layouts/ErrorLayout";
// import RootLayout from "@/app/layouts/RootLayout";
import MainPage from "@/pages/mainpage/MainPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    errorElement: <ErrorLayout />,
  },
]);
