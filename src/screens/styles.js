import { StyleSheet } from "react-native";

const BG  = "#1c1c2e";
const SDB = "#16162a";
const CARD = "#23233a";

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: BG,
        marginTop: 30
    },
    container: {
        flex: 1,
        flexDirection: "row"
    },

    // Sidebar
    sidebar: {
        width: 200,
        backgroundColor: SDB,
        paddingTop: 16,
        
        paddingHorizontal: 12
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#5a5af0",
        alignItems: "center",
        justifyContent: "center",
        
        marginRight: 8
    },
    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12
    },
    userName: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600"
    },
    userEmail: {
        color: "#8a8a9a",
        fontSize: 11
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: CARD,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 12
    },
    searchInput: {
        flex: 1,
        color: "#fff",
        fontSize: 13
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 9,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginBottom: 2
    },
    listItemActive:  { backgroundColor: CARD },
    listItemText: {
        flex: 1,
        color: "#8a8a9a",
        fontSize: 13
    },
    listItemTextActive: { color: "#fff" },
    badge: {
        color: "#8a8a9a",
        fontSize: 12
    },
    addListRow: {
        borderTopWidth: 1,
        borderTopColor: "#2a2a45",
        paddingTop: 10,
        paddingBottom: 8
    },
    newListBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom:25
    },
    newListText: {
        color: "#8a8a9a",
        fontSize: 13,
        marginLeft: 6
    },
    addListInput: {
        color: "#fff",
        fontSize: 13,
        paddingVertical: 4
    },

    // Main
    main: {
        flex: 1,
        backgroundColor: BG,
        paddingHorizontal: 20,
        paddingTop: 20
    },
    mainHeader: {
        flexDirection: "row",
        alignItems: "center",
        
        marginBottom: 20
    },
    mainTitle: {
        color: "#fff",
        fontSize: 26,
        fontWeight: "700",
        flex: 1
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center"
    },
    taskItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: CARD,
        
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 8
    },
    checkBtn: {
        marginRight: 12 
        
    },
    taskTitle: {
        color: "#fff",
        fontSize: 15
    },
    taskDone: {
        textDecorationLine: "line-through",
        color: "#8a8a9a"
    },
    taskSub: {
        color: "#8a8a9a",
        fontSize: 12,
        marginTop: 2
    },
    addTaskRow: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        
        borderTopColor: "#2a2a45",
        paddingVertical: 14
    },
    addTaskInput: {
        flex: 1,
        color: "#fff",
        
        fontSize: 14
    },
});
export default styles;