import { Link, useNavigate } from "@tanstack/react-router";
import { Route } from "./login.route";
import { useAuthStore } from "../index";
import LoginForm from "../components/LoginForm";

export default function Login() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const setUser = useAuthStore((s) => s.setUser);

  return (
    <>
      <LoginForm
        onSuccess={(user) => {
          setUser(user);
          navigate({ to: redirect });
        }}
      />
      <Link to="/register">Register</Link>
    </>
  );
}
