import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Button, Text, Card, Appbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '@/redux';
import { deleteTask, setTasks } from '@/redux/actions/taskSlice';
import { logout } from '@/redux/actions/userSlice';
import {ROOT_URL} from "@/constant";

const API_URL = ROOT_URL;

export default function HomeScreen() {
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [jwt, setJwt] = useState<string | null>(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
            const token = await AsyncStorage.getItem('token');
            setJwt(token);
        };
        fetchToken();
    }, []);

    const fetchTasks = async (token: string) => {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log('Fetched tasks', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch tasks');
            }

            // Convert `_id` to `id`
            const formattedTasks = data.map((task: any) => ({
                id: task._id,
                title: task.title,
                description: task.description,
            }));

            dispatch(setTasks(formattedTasks));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchTokenAndTasks = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setJwt(token);
                fetchTasks(token);
            }
        };
        fetchTokenAndTasks();
    }, [tasks]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (jwt) {
            await fetchTasks(jwt);
        }
        setRefreshing(false);
    }, [jwt]);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete task');

            dispatch(deleteTask(id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        dispatch(logout());
        router.replace('/login');
    };

    const renderItem = ({ item }: { item: any }) => (
        <Card style={styles.card} onPress={() => router.push({ pathname: '/edit-task', params: { id: item.id } })}>
            <Card.Title title={item.title} />
            <Card.Content>
                <Text>{item.description}</Text>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => handleDelete(item.id)}>Delete</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="My Tasks" />
                <Appbar.Action icon="logout" onPress={handleLogout} />
            </Appbar.Header>

            <FlatList
                data={tasks}
                keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text>No tasks added yet.</Text>}
                style={{marginTop:25}}
            />
            <Button mode="contained" onPress={() => router.push('/add-task')} style={styles.button}>
                Add Task
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    card: { marginBottom: 10 },
    button: { marginTop: 10 },
});
