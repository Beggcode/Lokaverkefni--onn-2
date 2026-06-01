import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore, logoutUser } from "../../features/auth";

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    clearUser();
    navigate({ to: "/" });
  }

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/products">Products</Link>
        {" | "}
        <Link to="/cart">Cart</Link>
        {" | "}
        {user ? (
          <>
            <span>{user.name}</span>{" "}
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            {" | "}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <main>{children}</main>
    </>
  );
}
