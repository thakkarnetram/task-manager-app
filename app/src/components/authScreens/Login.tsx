import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/actions/userSlice";

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const response = await fetch("https://your-api.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                dispatch(loginSuccess(data.user));
                navigation.replace("Home");
            } else {
                Alert.alert("Login Failed", data.message || "Invalid credentials");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Text>Email:</Text>
            <TextInput style={{ borderBottomWidth: 1 }} value={email} onChangeText={setEmail} />
            <Text>Password:</Text>
            <TextInput style={{ borderBottomWidth: 1 }} value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Signup" onPress={() => navigation.navigate("Signup")} />
        </View>
    );
}
