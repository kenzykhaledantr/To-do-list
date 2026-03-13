import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_LISTS = [
    { id: "myDay",      name: "My Day",         icon: "sunny-outline" },
    { id: "important",  name: "Important",      icon: "star-outline" },
    { id: "planned",    name: "Planned",        icon: "calendar-outline" },
    { id: "assigned",   name: "Assigned to me", icon: "person-outline" },
    { id: "flagged",    name: "Flagged email",  icon: "flag-outline" },
    { id: "tasks",      name: "Tasks",          icon: "checkmark-circle-outline" },
    { id: "today",      name: "Today",          icon: "list-outline" },
    { id: "yesterday",  name: "Yesterday",      icon: "list-outline" },
    { id: "hello",      name: "Hello",          icon: "list-outline" },
];

const listsSlice = createSlice({
    name: "lists",
    initialState: {
        items: DEFAULT_LISTS,
        activeListId: "hello",
    },
    reducers: {
        setActiveList: (state, action) => {
            state.activeListId = action.payload;
        },
        setLists: (state, action) => {
            const userLists = action.payload || [];
            state.items = [...DEFAULT_LISTS, ...userLists];
        },
        addList: (state, action) => {
            state.items.push(action.payload);
        },
        renameList: (state, action) => {
            const { id, name } = action.payload;
            const list = state.items.find((l) => l.id === id);
            if (list) list.name = name;
        },
        removeList: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((l) => l.id !== id);
            if (state.activeListId === id && state.items.length > 0) {
                state.activeListId = state.items[0].id;
            }
        },
    },
});

export const { setActiveList, setLists, addList, renameList, removeList } = listsSlice.actions;
export default listsSlice.reducer;