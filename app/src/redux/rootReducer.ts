import { combineReducers } from '@reduxjs/toolkit';
import taskReducer from './actions/taskSlice';
import userReducer from './actions/userSlice';

const rootReducer = combineReducers({
    tasks: taskReducer,
    users: userReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
