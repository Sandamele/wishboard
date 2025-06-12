import { Route, Routes } from "react-router";
import App from "../../App";
import Register from '../../auth/register';
import AuthLayout from "../../auth/AuthLayout";
import Login from '../../auth/login';
export const NavRoutes = () => {
  return (
    <Routes>
      <Route path="/" index element={<App />} />
      <Route element={<AuthLayout />}>
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
      </Route>
    </Routes>
  );
};
