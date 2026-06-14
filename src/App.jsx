import { RouterProvider } from "react-router";
import { useAuthContext } from "./context/AuthContext/AuthContextExport";
import { open_routes } from "./routes/open-route";
import { private_routes } from "./routes/private-route";

export function App() {
  const { getData } = useAuthContext();
  const { isAuth } = getData();

  const router = isAuth ? private_routes : open_routes;
  return <RouterProvider router={router} />;
}
