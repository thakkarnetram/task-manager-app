import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../app/src/redux/index"; // Adjust path if needed

export default function Layout() {
    return (
        <Provider store={store}>
            <Stack screenOptions={{ headerShown: false }} />
        </Provider>
    );
}
