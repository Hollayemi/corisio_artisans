// app/business/home/_layout.tsx  (updated — adds jobs stack)
import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen name="index"              options={{ headerShown: false }} />
            <Stack.Screen name="product"            options={{ headerShown: false }} />
            <Stack.Screen name="orders/list"        options={{ headerShown: false }} />
            <Stack.Screen name="orders/orderView"   options={{ headerShown: false }} />
            <Stack.Screen name="settings/index"     options={{ headerShown: false }} />
            <Stack.Screen name="profile"            options={{ headerShown: false }} />
            <Stack.Screen name="earnings/index"     options={{ headerShown: false }} />
            <Stack.Screen name="jobs"               options={{ headerShown: false }} /> {/* ← new */}
        </Stack>
    );
}
