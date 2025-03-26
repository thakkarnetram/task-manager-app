// app/add-task.tsx
import React, {useEffect, useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { addTask } from '@/redux/actions/taskSlice';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ROOT_URL} from "@/constant";

const API_URL = ROOT_URL;

export default function AddTaskScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [jwt, setJwt] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const token = await AsyncStorage.getItem('token');
            setJwt(token);
        };
        fetchToken();
    }, []);


    const handleAddTask = async () => {
        if (!title.trim() || !description.trim()) {
            alert('Please enter both title and description');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' , 'Authorization' : `Bearer ${jwt}` },
                body: JSON.stringify({ title, description }),
            });
            if (!response.ok) throw new Error('Failed to add task');
            const newTask = await response.json();
            dispatch(addTask(newTask));
            router.back();
        } catch (error) {
            alert((error as Error).message);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Add Task" />
                <Card.Content>
                    <TextInput
                        label="Title"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />
                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        style={[styles.input, { height: 100 }]}
                        multiline
                    />
                </Card.Content>
                <Card.Actions>
                    <Button mode="contained" onPress={handleAddTask}>Add Task</Button>
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
