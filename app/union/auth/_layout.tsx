import { Stack } from "expo-router";

export default function UnionAuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="PhoneEntry" options={{ headerShown: false }} />
            <Stack.Screen name="PhoneVerify" options={{ headerShown: false }} />
            <Stack.Screen name="UserDetails" options={{ headerShown: false }} />
        </Stack>
    );
}
