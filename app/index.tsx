import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux";

export default function Index() {
    const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);

    if (isAuthenticated) {
        return <Redirect href="/src/components/actionScreens/HomeScreen" />;
    } else {
        return <Redirect href="/src/components/authScreens/Login" />;
    }
}
