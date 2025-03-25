import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { signup } from "../../redux/actions/userSlice";

export default function SignupScreen({ navigation }: any) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleSignup = async () => {
        try {
            const response = await fetch("https://your-api.com/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                dispatch(signup(data.user));
                navigation.replace("Home");
            } else {
                Alert.alert("Signup Failed", data.message || "Something went wrong");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Text>Name:</Text>
            <TextInput style={{ borderBottomWidth: 1 }} value={name} onChangeText={setName} />
            <Text>Email:</Text>
            <TextInput style={{ borderBottomWidth: 1 }} value={email} onChangeText={setEmail} />
            <Text>Password:</Text>
            <TextInput style={{ borderBottomWidth: 1 }} value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Signup" onPress={handleSignup} />
            <Button title="Login" onPress={() => navigation.navigate("Login")} />
        </View>
    );
}
