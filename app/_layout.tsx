// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import store, { RootState } from '../redux/index';
import { loginSuccess, logout } from '@/redux/actions/userSlice';

const AuthLayout = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const segments = useSegments();
    const { isAuthenticated } = useSelector((state: RootState) => state.users);
    const [isLoading, setIsLoading] = useState(true);

    // Restore user info on app start
    useEffect(() => {
        const bootstrapAsync = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                dispatch(loginSuccess(JSON.parse(token)));
            } else {
                dispatch(logout());
            }
            setIsLoading(false);
        };
        bootstrapAsync();
    }, [dispatch]);

    // Redirect based on auth state:
    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated && !['login', 'signup', 'forgot-password'].includes(segments[0] || '')) {
                router.replace('/login');
            }
            if (isAuthenticated && ['login', 'signup', 'forgot-password'].includes(segments[0] || '')) {
                router.replace('/');
            }
        }
    }, [isLoading, isAuthenticated, segments, router]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Stack screenOptions={{headerShown:false}} />;
};

export default function Layout() {
    return (
        <Provider store={store}>
            <AuthLayout />
        </Provider>
    );
}
