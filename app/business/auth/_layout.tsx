import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="Availability" options={{ headerShown: false }} />
            <Stack.Screen name="StoreImages" options={{ headerShown: false }} />
            <Stack.Screen name="ProfilePicture" options={{ headerShown: false }} />
            <Stack.Screen name="Category" options={{ headerShown: false }} />            
        </Stack>
    );
}
