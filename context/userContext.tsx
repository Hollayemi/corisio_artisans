"use client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Animated } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRef } from "react";
import { useWindowDimensions } from "react-native";
import themeConfig from "@/config/themeConfig";
import { useGetUserAccountQuery, useGetUserNotificationsQuery } from "@/redux/user/slices/userSlice";

const { createContext, useEffect, useState } = require("react");
const getToken = async () => await AsyncStorage.getItem("user_token");

const defaultProvider = {
    openMenu: {},
    userInfo: {},
    theme: "light",
    token: getToken(),
    notifications: [],
    loading: false,
    setLoading: () => { },
    overLay: null,
    showMapScreen: () => { },
    popMap: false,
    temp: {},
    addTemp: () => { },
};

const DataContext = createContext(defaultProvider);

const UserDataProvider = ({ children }: any) => {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotification] = useState([]);
    const { height, width } = useWindowDimensions();
    const deductFromHeight = themeConfig("light").deductFromHeight;
    const adjustedHeight = height - deductFromHeight;
    const menuValueOffset = useRef(new Animated.Value(0)).current;
    const bodyHeight = useRef(new Animated.Value(height + 3)).current;
    const marginTopValue = useRef(new Animated.Value(-3)).current;

    const [isMenuOpen, openMenu] = useState(false);
    const handleMenuIconPress = (open: any) => {
        console.log("Menu icon pressed. Open:", open);
        const newState = !isMenuOpen;
        Animated.parallel([
            Animated.timing(bodyHeight, {
                toValue: newState ? adjustedHeight : height + 3,
                duration: 500,
                useNativeDriver: false,
            }),

            Animated.timing(menuValueOffset, {
                toValue: newState ? 1 : 0,
                useNativeDriver: false,
            }),

            Animated.timing(marginTopValue, {
                toValue: newState ? deductFromHeight / 2 : -3,
                duration: 500,
                useNativeDriver: false,
            }),
        ]).start();
        openMenu(newState);
    };

    const theme = useColorScheme() ?? "light";

    const {
        data: userInfo,
        error: userErr,
        isLoading: userIsLoading,
    } = useGetUserAccountQuery();

    // const {
    //     data: notif,
    //     error: notifErr,
    //     isLoading: notifIsLoading,
    // } = useGetUserNotificationsQuery();

    // const loadNotif = (!notifErr && !notifIsLoading && notif?.data) || [];

    // useEffect(() => {
    //     setNotification(loadNotif);
    // }, [notif]);

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
        <DataContext.Provider
            value={{
                ...defaultProvider,
                userInfo: (!userErr && !userIsLoading && userInfo) || { },
                loading,
                setLoading: setLoading,
                showAlert,
                isLight: theme === "light",
                theme,
                menuValueOffset,
                openMenu: handleMenuIconPress,
                isMenuOpen,
                bodyHeight,
                marginTopValue,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
export { UserDataProvider, DataContext };
