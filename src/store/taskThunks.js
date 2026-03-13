import {
    setTasks, setLoading, setError,
    addTaskLocal, toggleCompleteLocal,
    toggleStarLocal, deleteTaskLocal,
} from "./tasksSlice";
import {
    fetchTasksFromFirestore, addTaskToFirestore,
    toggleCompleteInFirestore, toggleStarInFirestore,
    deleteTaskFromFirestore,
} from "../services/taskService";

// ── Load tasks for a list ──────────────────────────────────────────────────
export const loadTasks = (uid, listId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const tasks = await fetchTasksFromFirestore(uid, listId);
        dispatch(setTasks({ listId, tasks }));
    } catch (e) {
        dispatch(setError(e.message));
    } finally {
        dispatch(setLoading(false));
    }
};

// ── Add task (optimistic) ──────────────────────────────────────────────────
export const addTask = (uid, listId, title) => async (dispatch) => {
    const tempId = `temp-${Date.now()}`;
    // 1. Update UI immediately
    dispatch(addTaskLocal({
        listId,
        task: { id: tempId, title, completed: false, starred: false },
    }));
    try {
        // 2. Save to Firestore and get real ID
        const realId = await addTaskToFirestore(uid, listId, title);
        // 3. Reload to sync real Firestore ID
        const tasks = await fetchTasksFromFirestore(uid, listId);
        dispatch(setTasks({ listId, tasks }));
    } catch (e) {
        dispatch(setError("Failed to add task"));
    }
};

// ── Toggle complete (optimistic) ───────────────────────────────────────────
export const toggleComplete = (uid, listId, taskId, current) => async (dispatch) => {
    dispatch(toggleCompleteLocal({ listId, taskId }));
    try {
        await toggleCompleteInFirestore(uid, listId, taskId, current);
    } catch (e) {
        // Rollback on failure
        dispatch(toggleCompleteLocal({ listId, taskId }));
    }
};

// ── Toggle star (optimistic) ───────────────────────────────────────────────
export const toggleStar = (uid, listId, taskId, current) => async (dispatch) => {
    dispatch(toggleStarLocal({ listId, taskId }));
    try {
        await toggleStarInFirestore(uid, listId, taskId, current);
    } catch (e) {
        dispatch(toggleStarLocal({ listId, taskId }));
    }
};

// ── Delete task (optimistic) ───────────────────────────────────────────────
export const deleteTask = (uid, listId, taskId) => async (dispatch) => {
    dispatch(deleteTaskLocal({ listId, taskId }));
    try {
        await deleteTaskFromFirestore(uid, listId, taskId);
    } catch (e) {
        dispatch(setError("Failed to delete task"));
    }
};