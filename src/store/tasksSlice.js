import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
    name: "tasks",
    initialState: {
        items: {},
        loading: false,
        error: null,
    },
    reducers: {
        setTasks: (state, action) => {
            // payload: { listId, tasks[] }
            const { listId, tasks } = action.payload;
            state.items[listId] = tasks;
        },
        setLoading: (state, action) => { state.loading = action.payload; },
        setError:   (state, action) => { state.error   = action.payload; },

        // Optimistic updates (instant UI, then Firestore syncs)
        addTaskLocal: (state, action) => {
            const { listId, task } = action.payload;
            if (!state.items[listId]) state.items[listId] = [];
            state.items[listId].push(task);
        },
        toggleCompleteLocal: (state, action) => {
            const { listId, taskId } = action.payload;
            const task = state.items[listId]?.find((t) => t.id === taskId);
            if (task) task.completed = !task.completed;
        },
        toggleStarLocal: (state, action) => {
            const { listId, taskId } = action.payload;
            const task = state.items[listId]?.find((t) => t.id === taskId);
            if (task) task.starred = !task.starred;
        },
        deleteTaskLocal: (state, action) => {
            const { listId, taskId } = action.payload;
            if (state.items[listId]) {
                state.items[listId] = state.items[listId].filter(
                    (t) => t.id !== taskId
                );
            }
        },
        removeTasksForList: (state, action) => {
            const listId = action.payload;
            if (state.items[listId]) {
                delete state.items[listId];
            }
        },
        clearTasks: (state) => {
            // Called on logout
            state.items = {};
        },
    },
});

export const {
    setTasks, setLoading, setError,
    addTaskLocal, toggleCompleteLocal, toggleStarLocal,
    deleteTaskLocal, removeTasksForList, clearTasks,
} = tasksSlice.actions;
export default tasksSlice.reducer;