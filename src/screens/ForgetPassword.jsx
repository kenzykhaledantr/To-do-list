import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import style from "./stylelogin";
import React, { useState } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseconfig"; 

const ForgetPass = () => {
    const [email, setEmail] = useState("");  
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email.trim()); 
            Alert.alert(
                "Email Sent ✅",
                "A password reset link has been sent to your email. Please check your inbox.",
                [{ text: "OK" }]
            );
            setEmail("");
        } catch (error) {
            let errorMessage = "Something went wrong. Please try again.";
            switch (error.code) {
                case "auth/user-not-found":
                    errorMessage = "No account found with this email address.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "The email address is not valid.";
                    break;
                case "auth/too-many-requests":
                    errorMessage = "Too many attempts. Please wait a moment and try again.";
                    break;
                case "auth/network-request-failed":
                    errorMessage = "Network error. Please check your connection.";
                    break;
            }
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={style.container}>
            <Text style={style.textforget}>Forget Password</Text>

            <TextInput
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={style.input}
            />

            <TouchableOpacity onPress={handleResetPassword} disabled={loading}>
                <View style={style.buttonview}>
                    
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={style.buttontext}>Send Reset Link</Text>
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ForgetPass;