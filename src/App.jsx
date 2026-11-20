import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { useAuthContext } from "./context/AuthContext/AuthContextExport";
import { open_routes } from "./routes/open-route";
import { private_routes } from "./routes/private-route";
import { LoadingScreen } from "./components/motion/LoadingScreen";

export function App() {
  const { getData } = useAuthContext();
  const { isAuth } = getData();

  const router = isAuth ? private_routes : open_routes;
  return (
    <Suspense fallback={<LoadingScreen fullScreen label="Loading" />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
