"use client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Animated } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRef } from "react";
import { useWindowDimensions } from "react-native";
import themeConfig from "@/config/themeConfig";

const { createContext, useEffect, useState } = require("react");
const getToken = async () => await AsyncStorage.getItem("user_token");

const defaultProvider = {
    userInfo: {},
    theme: "light",
    token: getToken(),
    loading: false,
    setLoading: () => { },
};

const AuthDataContext = createContext(defaultProvider);

const AuthDataProvider = ({ children }: any) => {
    const [loading, setLoading] = useState(true);




    interface alertProps {
        title: string;
        message: string;
        buttons?: [];
    }

    const showAlert = ({ title, message, buttons = [] }: alertProps) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                ...buttons,
            ],
            { cancelable: false }
        );
    };


    return (
        <AuthDataContext.Provider
            value={{
                // userInfo: (!userErr && !userIsLoading && userInfo) || { },
               
            }}
        >
            {children}
        </AuthDataContext.Provider>
    );
};
export { AuthDataProvider, AuthDataContext };
