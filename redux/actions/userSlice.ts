import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

interface LoginInputs {
    email: string;
    password: string;
}

interface SignupInputs {
    name: string;
    email: string;
    password: string;
}

interface UserState {
    users: User[];
    isAuthenticated: boolean;
    currentUser: User | null;
    loginInputs: LoginInputs;
    signupInputs: SignupInputs;
}

const initialState: UserState = {
    users: [],
    isAuthenticated: false,
    currentUser: null,
    loginInputs: { email: '', password: '' },
    signupInputs: { name: '', email: '', password: '' },
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        // When a user signs up
        signup: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            state.signupInputs = { name: '', email: '', password: '' };
        },
        // On successful login
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            state.loginInputs = { email: '', password: '' };
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.currentUser = null;
        },
        // Update login form input field
        updateLoginInput: (
            state,
            action: PayloadAction<{ field: keyof LoginInputs; value: string }>
        ) => {
            state.loginInputs[action.payload.field] = action.payload.value;
        },
        // Clear login inputs
        clearLoginInputs: (state) => {
            state.loginInputs = { email: '', password: '' };
        },
        // Update signup form input field
        updateSignupInput: (
            state,
            action: PayloadAction<{ field: keyof SignupInputs; value: string }>
        ) => {
            state.signupInputs[action.payload.field] = action.payload.value;
        },
        // Clear signup inputs
        clearSignupInputs: (state) => {
            state.signupInputs = { name: '', email: '', password: '' };
        },
    },
});

export const { signup, loginSuccess, logout, updateLoginInput, clearLoginInputs, updateSignupInput, clearSignupInputs } = userSlice.actions;
export default userSlice.reducer;
