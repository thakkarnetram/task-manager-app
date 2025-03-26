// app/forgot-password.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import {ROOT_URL} from "@/constant";

const API_URL = ROOT_URL;

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

    const handleReset = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) throw new Error('Failed to send reset link');
            setSnackbar({ visible: true, message: 'Password reset link sent!' });
            setTimeout(() => router.push('/login'), 2000);
        } catch (error) {
            setSnackbar({ visible: true, message: (error as Error).message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Forgot Password</Text>
            <TextInput
                label="Email"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleReset} loading={loading} disabled={loading}>
                Reset Password
            </Button>
            <Snackbar
                visible={snackbar.visible}
                onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
                duration={3000}
            >
                {snackbar.message}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 15 },
});
