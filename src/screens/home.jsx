import React, { useState, useEffect, useRef } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    FlatList, SafeAreaView, StatusBar, Animated, Alert, Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { setActiveList, setLists, addList, renameList, removeList } from "../store/listsSlice";
import { loadTasks, addTask, toggleComplete, toggleStar, deleteTask } from "../store/taskThunks";
import { removeTasksForList, clearTasks } from "../store/tasksSlice";
import { clearUser } from "../store/authSlice";
import { deleteAllTasksForList } from "../services/taskService";
import { fetchListsFromFirestore, addListToFirestore, renameListInFirestore, deleteListFromFirestore } from "../services/listService";
import styles from "./styles";

const SIDEBAR_OPEN_WIDTH  = 220;
const SIDEBAR_CLOSED_WIDTH = 70;   // icon-only strip

const TodoScreen = ({ navigation }) => {
    const dispatch   = useDispatch();
    const lists      = useSelector((s) => s.lists.items);
    const activeId   = useSelector((s) => s.lists.activeListId);
    const allTasks   = useSelector((s) => s.tasks.items);
    const tasks      = allTasks[activeId] || [];
    const activeList = lists.find((l) => l.id === activeId);
    const user       = useSelector((s) => s.auth.user);
    const uid        = user?.uid;

    const [newTask,     setNewTask]     = useState("");
    const [newList,     setNewList]     = useState("");
    const [addingList,  setAddingList]  = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [renamingListId, setRenamingListId] = useState(null);
    const [renameValue, setRenameValue] = useState("");

    const sidebarAnim = useRef(new Animated.Value(SIDEBAR_OPEN_WIDTH)).current;

    const toggleSidebar = () => {
        const toValue = sidebarOpen ? SIDEBAR_CLOSED_WIDTH : SIDEBAR_OPEN_WIDTH;
        Animated.timing(sidebarAnim, {
            toValue,
            duration: 250,
            useNativeDriver: false,
        }).start();
        setSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!uid) return;
        (async () => {
            try {
                const userLists = await fetchListsFromFirestore(uid);
                dispatch(setLists(userLists));
            } catch (e) {
                // ignore fetch errors for now
            }
        })();
    }, [uid]);

    useEffect(() => {
        if (uid && activeId) dispatch(loadTasks(uid, activeId));
    }, [uid, activeId]);

    const handleAddList = async () => {
        const name = newList.trim();
        if (!name || !uid) return;
        try {
            const list = await addListToFirestore(uid, name);
            dispatch(addList(list));
        } catch (e) {
            // ignore error for now
        } finally {
            setNewList("");
            setAddingList(false);
        }
    };

    const handleAddTask = () => {
        if (newTask.trim()) {
            dispatch(addTask(uid, activeId, newTask.trim()));
            setNewTask("");
        }
    };

    const handleToggle = (task) => dispatch(toggleComplete(uid, activeId, task.id, task.completed));
    const handleStar   = (task) => dispatch(toggleStar(uid, activeId, task.id, task.starred));
    const handleDelete = (id)   => dispatch(deleteTask(uid, activeId, id));

    const taskCounts = lists.reduce((acc, l) => {
        acc[l.id] = (allTasks[l.id] || []).length;
        return acc;
    }, {});

    const handleListLongPress = (item) => {
        if (!uid) return;
        Alert.alert(
            item.name,
            "What would you like to do?",
            [
                {
                    text: "Edit name",
                    onPress: () => {
                        setRenamingListId(item.id);
                        setRenameValue(item.name);
                    },
                },
                {
                    text: "Delete list",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteListFromFirestore(uid, item.id);
                            await deleteAllTasksForList(uid, item.id);
                        } catch (e) {
                            // ignore Firestore error for now
                        }
                        dispatch(removeTasksForList(item.id));
                        dispatch(removeList(item.id));
                    },
                },
                { text: "Cancel", style: "cancel" },
            ],
            { cancelable: true }
        );
    };

    // ── Sidebar list item ──────────────────────────────────────────────────
    const renderListItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.listItem, activeId === item.id && styles.listItemActive]}
            onPress={() => dispatch(setActiveList(item.id))}
            onLongPress={() => handleListLongPress(item)}
            delayLongPress={400}
        >
            <Ionicons
                name={item.icon}
                size={18}
                color={activeId === item.id ? "#fff" : "#8a8a9a"}
                style={{ marginRight: sidebarOpen ? 10 : 0 }}
            />
            {/* Only show text when open */}
            {sidebarOpen && (
                <Text style={[styles.listItemText, activeId === item.id && styles.listItemTextActive]}
                    numberOfLines={1}>
                    {item.name}
                </Text>
            )}
            {sidebarOpen && taskCounts[item.id] > 0 && (
                <Text style={styles.badge}>{taskCounts[item.id]}</Text>
            )}
        </TouchableOpacity>
    );

    // ── Task item ──────────────────────────────────────────────────────────
    const renderTask = ({ item }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => handleToggle(item)} style={styles.checkBtn}>
                <Ionicons
                    name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={item.completed ? "#5a5af0" : "#8a8a9a"}
                />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                <Text style={[styles.taskTitle, item.completed && styles.taskDone]}>
                    {item.title}
                </Text>
                {item.completed && <Text style={styles.taskSub}>Complete Task</Text>}
            </View>
            <TouchableOpacity onPress={() => handleStar(item)} style={{ padding: 6 }}>
                <Ionicons
                    name={item.starred ? "star" : "star-outline"}
                    size={18}
                    color={item.starred ? "#f5a623" : "#8a8a9a"}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ padding: 6 }}>
                <Ionicons name="trash-outline" size={16} color="#8a8a9a" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>

                {/* ── Animated Sidebar ──────────────────────────────────── */}
                <Animated.View style={[styles.sidebar, { width: sidebarAnim, overflow: "hidden" }]}>

                    {/* ── TOP: avatar + toggle button ─────────────────── */}
                    <View style={[styles.userRow, { 
    justifyContent: sidebarOpen ? "flex-start" : "center",  // ✅ center when collapsed
    paddingHorizontal: sidebarOpen ? 5 : 0,
    flexWrap: "nowrap",
                    }]}>
                        
                        {sidebarOpen && (
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {(user?.name || user?.email || "U")
                                        .split(" ")
                                        .map((part) => part[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </Text>
                            </View>
                        )}

                        

                        {/* Name + email — hidden when collapsed */}
                        {sidebarOpen && (
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.userName} numberOfLines={1}>
                                    {user?.name || "User"}
                                </Text>
                                <Text style={styles.userEmail} numberOfLines={1}>
                                    {user?.email || ""}
                                </Text>
                            </View>
                        )}

                        {/* ✅ Toggle button always visible in sidebar */}
                        <TouchableOpacity onPress={toggleSidebar} style={{ padding: 4 }}>
                            <Ionicons
                                name={sidebarOpen ? "chevron-back-outline" : "chevron-forward-outline"}
                                size={20}
                                color="#8a8a9a"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* ── Search — hidden when collapsed ──────────────── */}
                    {sidebarOpen && (
                        <View style={styles.searchBox}>
                            <Ionicons name="search-outline" size={15} color="#8a8a9a" style={{ marginRight: 6 }} />
                            <TextInput
                                placeholder="Search"
                                placeholderTextColor="#8a8a9a"
                                style={styles.searchInput}
                            />
                        </View>
                    )}

                    {/* ── Lists (icons only when collapsed) ───────────── */}
                    <FlatList
                        data={lists}
                        keyExtractor={(l) => l.id}
                        renderItem={renderListItem}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* ── Add List — hidden when collapsed ────────────── */}
                    {sidebarOpen && (
                        <View style={styles.addListRow}>
                            {addingList ? (
                                <TextInput
                                    value={newList}
                                    onChangeText={setNewList}
                                    placeholder="List name..."
                                    placeholderTextColor="#8a8a9a"
                                    style={styles.addListInput}
                                    autoFocus
                                    onSubmitEditing={handleAddList}
                                    onBlur={() => setAddingList(false)}
                                />
                            ) : (
                                <TouchableOpacity style={styles.newListBtn} onPress={() => setAddingList(true)}>
                                    <Ionicons name="add" size={18} color="#8a8a9a" />
                                    <Text style={styles.newListText}>New List</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </Animated.View>

                {/* ── Main Panel ────────────────────────────────────────── */}
                <View style={styles.main}>
                    <View style={styles.mainHeader}>
                        <Text style={styles.mainTitle}>{activeList?.name}</Text>
                        <View style={styles.headerActions}>
                            <Ionicons name="git-branch-outline" size={20} color="#8a8a9a" style={{ marginRight: 14 }} />
                            <TouchableOpacity
                                onPress={() => {
                                    dispatch(clearTasks());
                                    dispatch(clearUser());
                                    navigation.replace("login");
                                }}
                                style={{ flexDirection: "row", alignItems: "center" }}
                            >
                                <Ionicons name="log-out-outline" size={20} color="#8a8a9a" style={{ marginRight: 4 }} />
                                <Text style={{ color: "#8a8a9a", fontSize: 13 }}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <FlatList
                        data={tasks}
                        keyExtractor={(t) => t.id}
                        renderItem={renderTask}
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}
                    />

                    <View style={styles.addTaskRow}>
                        <Ionicons name="add" size={18} color="#8a8a9a" style={{ marginRight: 8 }} />
                        <TextInput
                            value={newTask}
                            onChangeText={setNewTask}
                            placeholder="Add a Task"
                            placeholderTextColor="#8a8a9a"
                            style={styles.addTaskInput}
                            onSubmitEditing={handleAddTask}
                            returnKeyType="done"
                        />
                    </View>
                </View>

                {/* ── Rename List Modal ─────────────────────────────────── */}
                <Modal
                    transparent
                    animationType="fade"
                    visible={!!renamingListId}
                    onRequestClose={() => setRenamingListId(null)}
                >
                    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" }}>
                        <View style={{ backgroundColor: "#1f1f2a", padding: 16, borderRadius: 8, width: "80%" }}>
                            <Text style={{ color: "white", fontSize: 16, marginBottom: 8 }}>Edit list name</Text>
                            <TextInput
                                value={renameValue}
                                onChangeText={setRenameValue}
                                placeholder="List name"
                                placeholderTextColor="#8a8a9a"
                                style={{ borderWidth: 1, borderColor: "#333", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, color: "white", marginBottom: 12 }}
                                autoFocus
                            />
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <TouchableOpacity onPress={() => setRenamingListId(null)} style={{ marginRight: 12 }}>
                                    <Text style={{ color: "#8a8a9a" }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={async () => {
                                        const trimmed = renameValue.trim();
                                        if (trimmed && renamingListId && uid) {
                                            dispatch(renameList({ id: renamingListId, name: trimmed }));
                                            try {
                                                await renameListInFirestore(uid, renamingListId, trimmed);
                                            } catch (e) {
                                                // ignore error
                                            }
                                        }
                                        setRenamingListId(null);
                                    }}
                                >
                                    <Text style={{ color: "#5a5af0", fontWeight: "600" }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        </SafeAreaView>
    );
};

export default TodoScreen;

