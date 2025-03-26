// app/login.tsx
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput, Button, Card} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginSuccess, updateLoginInput} from '@/redux/actions/userSlice';
import {RootState} from '@/redux';
import {useRouter} from 'expo-router';
import {ROOT_URL} from "@/constant";

const API_URL = ROOT_URL;

export default function LoginScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const {email, password} = useSelector((state: RootState) => state.users.loginInputs);

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        email, password
                    }
                ),
            });
            const user = await response.json();
            if (response.ok) {
                console.log(user)
                await AsyncStorage.setItem('token', user.token);
                dispatch(loginSuccess(user));
                router.replace('/home');
            } else {
               alert(user.message)
            }
        } catch (error) {
            alert((error as Error).message);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Login"/>
                <Card.Content>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={(value) => dispatch(updateLoginInput({field: 'email', value}))}
                        style={styles.input}
                        keyboardType="email-address"
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={(value) => dispatch(updateLoginInput({field: 'password', value}))}
                        style={styles.input}
                        secureTextEntry
                    />
                </Card.Content>
                <Card.Actions>
                    <Button mode="contained" onPress={handleLogin}>Log In</Button>
                </Card.Actions>
                <Card.Actions>
                    <Button onPress={() => router.push('/signup')}>Sign Up</Button>
                    <Button onPress={() => router.push('/forgot-password')}>Forgot Password</Button>
                </Card.Actions>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', padding: 20},
    card: {padding: 10},
    input: {marginBottom: 10},
});
