import {
    collection, doc, getDocs,
    addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch,
} from "firebase/firestore";
import { db } from "../../firebaseconfig";

// Path: users/{uid}/lists/{listId}/tasks
const tasksRef = (uid, listId) =>
    collection(db, "users", uid, "lists", listId, "tasks");

const taskDocRef = (uid, listId, taskId) =>
    doc(db, "users", uid, "lists", listId, "tasks", taskId);

// ── Fetch all tasks for a list ─────────────────────────────────────────────
export const fetchTasksFromFirestore = async (uid, listId) => {
    const snapshot = await getDocs(tasksRef(uid, listId));
    return snapshot.docs.map((d) => {
        const data = d.data();
        // Normalize Firestore Timestamp to a serializable primitive
        let createdAt = null;
        if (data.createdAt && typeof data.createdAt.toMillis === "function") {
            createdAt = data.createdAt.toMillis(); // number (ms since epoch)
        }
        return {
            id: d.id,
            ...data,
            createdAt,
        };
    });
};

// ── Add task ───────────────────────────────────────────────────────────────
export const addTaskToFirestore = async (uid, listId, title) => {
    const docRef = await addDoc(tasksRef(uid, listId), {
        title,
        completed: false,
        starred:   false,
        createdAt: serverTimestamp(),
    });
    return docRef.id; // return the Firestore-generated ID
};

// ── Toggle complete ────────────────────────────────────────────────────────
export const toggleCompleteInFirestore = async (uid, listId, taskId, current) => {
    await updateDoc(taskDocRef(uid, listId, taskId), {
        completed: !current,
    });
};

// ── Toggle star ────────────────────────────────────────────────────────────
export const toggleStarInFirestore = async (uid, listId, taskId, current) => {
    await updateDoc(taskDocRef(uid, listId, taskId), {
        starred: !current,
    });
};

// ── Delete task ────────────────────────────────────────────────────────────
export const deleteTaskFromFirestore = async (uid, listId, taskId) => {
    await deleteDoc(taskDocRef(uid, listId, taskId));
};

// ── Delete all tasks for a list ────────────────────────────────────────────
export const deleteAllTasksForList = async (uid, listId) => {
    const snapshot = await getDocs(tasksRef(uid, listId));
    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.forEach((d) => {
        batch.delete(d.ref);
    });
    await batch.commit();
};