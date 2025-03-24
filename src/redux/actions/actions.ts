import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Task {
    id: string;
    title: string;
    description: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

interface AppState {
    tasks: Task[];
    users: User[];
}

const initialState: AppState = {
    tasks: [],
    users: []
};

