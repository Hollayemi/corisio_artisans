import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>           
            <Stack.Screen name="ProfileSetup" options={{ headerShown: false }} />
            <Stack.Screen name="map" options={{ headerShown: false }} /> 
            <Stack.Screen name="Login" options={{ headerShown: false }} /> 
            <Stack.Screen name="UpdatePassword" options={{ headerShown: false }} />
            <Stack.Screen name="Created" options={{ headerShown: false }} />
            <Stack.Screen name="Verify" options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} /> 
        </Stack>
    );
}
