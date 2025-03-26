// app/index.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
    const router = useRouter();

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token'); // or use 'currentUser' based on your storage key
            console.log(token)
            if (token!==null) {
                router.replace('/home');
            } else {
                router.replace('/signup');
            }
        };
        checkToken();
    }, [router]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
