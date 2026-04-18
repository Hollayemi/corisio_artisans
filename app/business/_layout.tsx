import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StoreDataProvider } from "@/context/storeContext";
import { isAuthenticated } from "@/redux/business/slices/api/axiosBaseQuery";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function BusinessLayout() {
    return (
        <SafeAreaProvider>
            {/* <AndroidSafeAreaView
                style={{ flex: 1, backgroundColor: "#f9fafb" }}
            > */}
                <StoreDataProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        {!isAuthenticated() && <Stack.Screen
                            name="(welcome)"
                            options={{ headerShown: false }}
                        />}
                        <Stack.Screen name="home" options={{ headerShown: false }} />
                        <Stack.Screen name="chat" options={{ headerShown: false }} />
                        <Stack.Screen name="auth" options={{ headerShown: false }} />
                    </Stack>
                </StoreDataProvider>
            <StatusBar style="auto" />

            {/* </AndroidSafeAreaView> */}
        </SafeAreaProvider>
    );
}
