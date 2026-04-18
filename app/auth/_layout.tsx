import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="Login" options={{ headerShown: false }} />
            <Stack.Screen name="PhoneEntry" options={{ headerShown: false }} />
            <Stack.Screen name="PhoneVerify" options={{ headerShown: false }} />
            {/* =============USER ACCOUNT */}
            <Stack.Screen name="user" options={{ headerShown: false }} />
        </Stack>
    );
}
