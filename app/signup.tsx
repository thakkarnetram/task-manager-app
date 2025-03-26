// app/signup.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signup, updateSignupInput } from '@/redux/actions/userSlice';
import { RootState } from '@/redux';
import { useRouter } from 'expo-router';
import {ROOT_URL} from "@/constant";

const API_URL = ROOT_URL;

export default function SignupScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { name, email, password } = useSelector((state: RootState) => state.users.signupInputs);

    const handleSignup = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (!response.ok) throw new Error('Signup failed');
            const newUser = await response.json();
            await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
            dispatch(signup(newUser));
            router.replace('/home');
        } catch (error) {
            alert((error as Error).message);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Sign Up" />
                <Card.Content>
                    <TextInput
                        label="Name"
                        value={name}
                        onChangeText={(value) => dispatch(updateSignupInput({ field: 'name', value }))}
                        style={styles.input}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={(value) => dispatch(updateSignupInput({ field: 'email', value }))}
                        style={styles.input}
                        keyboardType="email-address"
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={(value) => dispatch(updateSignupInput({ field: 'password', value }))}
                        style={styles.input}
                        secureTextEntry
                    />
                </Card.Content>
                <Card.Actions>
                    <Button mode="contained" onPress={handleSignup}>Sign Up</Button>
                </Card.Actions>
                <Card.Actions>
                    <Button onPress={() => router.push('/login')}>Already have an account? Log In</Button>
                </Card.Actions>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    card: { padding: 10 },
    input: { marginBottom: 10 },
});
