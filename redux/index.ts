import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./actions/userSlice";
import taskReducer from "./actions/taskSlice";

const store = configureStore({
    reducer: {
        users: userReducer,
        tasks:taskReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
