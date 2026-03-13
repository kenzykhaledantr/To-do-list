import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    },
    textlogin: {
        fontSize: 40,
        fontWeight: "bold",
        marginTop: 50,
        color: "#261CC1"
    },
    input: {
        borderRadius: 7,
        backgroundColor: "white",
        height: 50,
        width: 250,
        marginTop: 20,
        paddingLeft: 10,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation:8
        
    },
    buttonview: {
        backgroundColor: "#261CC1",
        width: 250,
        marginTop: 20,
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    buttontext: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
     containersigninbuttons: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
         backgroundColor: '#f5f5f5',
         marginTop:30,
    
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 12,
  },
  button: {
    width: 72,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ebebeb',
    },
  
   inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 8,
        alignSelf: 'flex-start',
        marginLeft: 60,
        marginTop:5
    },
    textforget: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 150,
        color: "#261CC1"
    }

})

export default style;