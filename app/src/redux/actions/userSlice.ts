import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

interface UserState {
    users: User[];
    isAuthenticated: boolean;
    currentUser: User | null;
}

const initialState: UserState = {
    users: [],
    isAuthenticated: false,
    currentUser: null
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        signup: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
            state.currentUser = action.payload;
            state.isAuthenticated = true;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.currentUser = null;
        }
    }
});

export const { signup, loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
