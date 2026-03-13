import { Text, View, TextInput,TouchableOpacity, Animated } from "react-native";
import style from "./stylelogin";
import React, { useRef, useState } from 'react';
import { auth, db } from '../../firebaseconfig';
import { signInWithEmailAndPassword,  signInWithCredential } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import Svg, { Path, G, Rect, Circle } from 'react-native-svg';
import Ionicons from "@expo/vector-icons/Ionicons";
import { setUser } from "../store/authSlice";
import { clearTasks } from "../store/tasksSlice";
import { useSelector, useDispatch } from "react-redux";




const GoogleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 48 48">
    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <Path fill="none" d="M0 0h48v48H0z"/>
  </Svg>
);

const FacebookIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </Svg>
);

const TwitterIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path
      fill="#1DA1F2"
      d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
    />
  </Svg>
);


const SocialButton = ({ icon: Icon, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={[style.buttonWrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={style.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Icon />
      </TouchableOpacity>
    </Animated.View>
  );
};




const login = ({ navigation }) => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  
  
    
     const validateEmail = (Email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(Email);
    };
const validate = () => {
        const newErrors = {};

        if (!Email.trim()) {
            newErrors.Email = 'Email is required';
        } else if (!validateEmail(Email)) {
            newErrors.Email = 'Please enter a valid email';
        }

        if (!Password.trim()) {
            newErrors.Password = 'Password is required';
  }
        

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const dispatch = useDispatch();
    const handleSignIn = async() => {
        if (!validate()) return;
        console.log('Signing in with', Email, Password);
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, Email, Password);
            // Fetch user profile from Firestore
            const profileRef = doc(db, "users", userCredential.user.uid);
            const profileSnap = await getDoc(profileRef);
            const profileData = profileSnap.exists() ? profileSnap.data() : null;

            dispatch(setUser({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                name: profileData?.name || userCredential.user.displayName || "",
            }));

            navigation.navigate('Home');
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/invalid-credential':
                    setErrors({ general: 'Invalid email or password' });
                    break;
                case 'auth/wrong-password':
                    setErrors({ general: 'Invalid email or password' });
                    break;
                case 'auth/too-many-requests':
                    setErrors({ general: 'Too many attempts. Try again later.' });
                    break;
                default:
                    setErrors({ general: 'Something went wrong. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };




    return (
        <View style={style.container}>
            <Text style={style.textlogin}>
                Login
        </Text>
        
            <TextInput placeholder="Email"
                style={[style.input, errors.Email && style.inputError]}
                keyboardType="email-address"
                value={Email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (errors.Email) setErrors((prev) => ({ ...prev, Email: null }));
                }}
                autoCapitalize="none"
            />

            {errors.Email && <Text style={style.errorText}>{errors.Email}</Text>}

            <View style={[style.input, errors.Password && style.inputError, { flexDirection: "row", alignItems: "center" }]}>
                <TextInput
                    placeholder="Password"
                    style={{ flex: 1 }}
                    keyboardType="default"
                    secureTextEntry={!showPassword}
                    value={Password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (errors.Password) setErrors((prev) => ({ ...prev, Password: null }));
                    }}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={{marginRight:10}}>
                    <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#8a8a9a"
                    />
                </TouchableOpacity>
            </View>
        {errors.Password && <Text style={style.errorText}>{errors.Password}</Text>}
        
        {errors.general && <Text style={style.errorText}>{errors.general}</Text>}

            <TouchableOpacity onPress={handleSignIn} disabled={loading}>
                <View style={style.buttonview}>
                <Text style={style.buttontext}>
              {loading ? 'Signing In...' : 'Sign In'}
              
                    </Text>
                    </View>
        </TouchableOpacity>
        
        <View style={{marginTop:15}}>
<Text>
            Forget {' '}
            <Text style={{color:"#261CC1",fontWeight:"600"} } onPress={()=>{navigation.navigate("ForgetPass")}}>
                        Password?

                    </Text>
            
        </Text>
        </View>
        
        

            <View style={{marginTop:60}}>
                <Text style={{fontSize:15,fontWeight:"bold",color:"gray"}}>
                    - Or sign in with -
                </Text>
            </View>
          
            <View style={style.containersigninbuttons}>
      <View style={style.row}>
        <SocialButton icon={GoogleIcon} onPress={() => console.log('Google')} />
        <SocialButton icon={FacebookIcon} onPress={() => console.log('Facebook')} />
        <SocialButton icon={TwitterIcon} onPress={() => console.log('Twitter')} />
      </View>
            </View>
            
            <View style={{marginTop:150}}>
                <Text style={{fontSize:15}}>
                    Don't have an account? {''}
                    <Text style={{color:"#261CC1",fontWeight:"600"}  } onPress={()=>{navigation.navigate("signup")}}>
              Sign Up
              

                    </Text>
                </Text>
            </View>
            


            

        </View>
    );
}
export default login