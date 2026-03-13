import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { registerRootComponent } from 'expo';
import { Provider } from "react-redux";          // ✅ import Provider
import store from "./src/store";                  // ✅ import your store

import login from "./src/screens/login";
import SignUp from "./src/screens/signup";
import Home from "./src/screens/home";
import ForgetPass from "./src/screens/ForgetPassword";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>             
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="login"      component={login} />
          <Stack.Screen name="signup"     component={SignUp} />
          <Stack.Screen name="Home"       component={Home}     options={{ headerShown: false ,headerStyle: { backgroundColor: "#1c1c2e" } }} />
          <Stack.Screen name="ForgetPass" component={ForgetPass} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>                         
  );
}

registerRootComponent(App);
