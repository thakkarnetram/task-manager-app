import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
    id: string;
    title: string;
    description: string;
}

interface TaskFormInputs {
    title: string;
    description: string;
}

interface TaskState {
    tasks: Task[];
    taskInput: TaskFormInputs;
}

const initialState: TaskState = {
    tasks: [],
    taskInput: { title: '', description: '' },
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        },
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
            state.taskInput = { title: '', description: '' };
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
            state.taskInput = { title: '', description: '' };
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
        updateTaskInput: (
            state,
            action: PayloadAction<{ field: keyof TaskFormInputs; value: string }>
        ) => {
            state.taskInput[action.payload.field] = action.payload.value;
        },
        clearTaskInput: (state) => {
            state.taskInput = { title: '', description: '' };
        },
    },
});

export const { setTasks, addTask, updateTask, deleteTask, updateTaskInput, clearTaskInput } = taskSlice.actions;
export default taskSlice.reducer;
