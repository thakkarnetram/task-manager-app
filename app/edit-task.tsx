// app/edit-task.tsx
import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, deleteTask, updateTaskInput } from '@/redux/actions/taskSlice';
import { RootState } from '@/redux';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ROOT_URL} from "@/constant";

const API_URL = ROOT_URL;

export default function EditTaskScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const dispatch = useDispatch();
    const router = useRouter();
    const task = useSelector((state: RootState) =>
        state.tasks.tasks.find(task => task.id === id)
    );
    const { title, description } = useSelector((state: RootState) => state.tasks.taskInput);
    const [jwt, setJwt] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const token = await AsyncStorage.getItem('token');
            setJwt(token);
        };
        fetchToken();
    }, []);

    useEffect(() => {
        if (!task) {
            Alert.alert('Error', 'Task not found');
            router.back();
        } else {
            // Optionally prefill Redux state with task values here if desired.
            dispatch(updateTaskInput({ field: 'title', value: task.title }));
            dispatch(updateTaskInput({ field: 'description', value: task.description }));
        }
    }, [task, dispatch, router]);

    const handleUpdate = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Both title and description are required');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' ,
                    'Authorization' : `Bearer ${jwt}`
                },
                body: JSON.stringify({ title, description }),
            });
            if (!response.ok) throw new Error('Failed to update task');
            const updatedTask = await response.json();
            dispatch(updateTask(updatedTask));
            router.back();
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        }
    };

    const handleDelete = async () => {
        Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
            { text: 'Cancel' },
            {
                text: 'Delete', onPress: async () => {
                    try {
                        const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
                        if (!response.ok) throw new Error('Failed to delete task');
                        dispatch(deleteTask(id!));
                        router.back();
                    } catch (error) {
                        Alert.alert('Error', (error as Error).message);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Edit Task" />
                <Card.Content>
                    <TextInput
                        label="Title"
                        value={title}
                        onChangeText={(value) => dispatch(updateTaskInput({ field: 'title', value }))}
                        style={styles.input}
                    />
                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={(value) => dispatch(updateTaskInput({ field: 'description', value }))}
                        style={[styles.input, { height: 100 }]}
                        multiline
                    />
                </Card.Content>
                <Card.Actions>
                    <Button mode="contained" onPress={handleUpdate}>Update Task</Button>
                    <Button onPress={handleDelete} color="red">Delete Task</Button>
                </Card.Actions>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    card: { padding: 10 },
    input: { marginBottom: 10 },
});
