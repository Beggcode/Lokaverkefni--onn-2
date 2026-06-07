import { useEffect } from "react";
import Routes from "./Routes";
import { fetchMe, useAuth } from "./features/auth";

export default function App() {
	const { setUser, clearUser } = useAuth();

	useEffect(() => {
		fetchMe().then((user) => {
			if (user) setUser(user);
			else clearUser();
		});
	}, [clearUser, setUser]);

	return <Routes />;
}
