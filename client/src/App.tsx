import { useEffect } from "react";
import Routes from "./Routes";
import { fetchMe, useAuthStore } from "./features/auth";

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    fetchMe().then((user) => {
      if (user) setUser(user);
      else clearUser();
    });
  }, [clearUser, setUser]);

  return <Routes />;
}
