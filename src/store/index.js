import { configureStore } from "@reduxjs/toolkit";
import listsReducer from "./listsSlice";
import tasksReducer from "./tasksSlice";
import authReducer  from "./authSlice";   // ✅ new

const store = configureStore({
    reducer: {
        auth:  authReducer,
        lists: listsReducer,
        tasks: tasksReducer,
    },
});

export default store;