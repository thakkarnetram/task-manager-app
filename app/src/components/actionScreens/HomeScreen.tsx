import React from "react";
import { View, Text, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/userSlice";
import { RootState } from "../../redux/index";

export default function HomeScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.users.currentUser);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Welcome, {user?.name || "Guest"}!</Text>
            <Button title="Logout" onPress={() => { dispatch(logout()); navigation.replace("Login"); }} />
        </View>
    );
}
