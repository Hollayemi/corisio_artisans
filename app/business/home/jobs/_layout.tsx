// app/business/home/jobs/_layout.tsx
import { Stack } from "expo-router";

export default function JobsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="JobDetailsScreen" options={{ headerShown: false }} />
        </Stack>
    );
}
