import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseconfig";

// Path: users/{uid}/lists/{listId}
const listsRef = (uid) => collection(db, "users", uid, "lists");

const listDocRef = (uid, listId) => doc(db, "users", uid, "lists", listId);

// Fetch all lists for a user
export const fetchListsFromFirestore = async (uid) => {
    const snapshot = await getDocs(listsRef(uid));
    return snapshot.docs.map((d) => {
        const data = d.data();
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

// Add a new list for a user
export const addListToFirestore = async (uid, name) => {
    const docRef = await addDoc(listsRef(uid), {
        name,
        icon: "list-outline",
        createdAt: serverTimestamp(),
    });

    return {
        id: docRef.id,
        name,
        icon: "list-outline",
    };
};

// Rename an existing list
export const renameListInFirestore = async (uid, listId, name) => {
    await updateDoc(listDocRef(uid, listId), { name });
};

// Delete a list document
export const deleteListFromFirestore = async (uid, listId) => {
    await deleteDoc(listDocRef(uid, listId));
};

