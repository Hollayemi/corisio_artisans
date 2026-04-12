import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            {/* <Stack.Screen
                name="food/category"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="food/favorite"
                options={{ headerShown: false }}
            />
            <Stack.Screen name="food/dish" options={{ headerShown: false }} />
            <Stack.Screen
                name="food/restaurant"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="food/orderDetails"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="food/deliveryMap"
                options={{ headerShown: false }}
            /> */}
            <Stack.Screen
                name="others/service"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
