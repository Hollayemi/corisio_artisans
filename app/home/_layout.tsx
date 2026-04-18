import { UserDataProvider } from "@/context/userContext";
import { store } from "@/redux/user/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function TabLayout() {
    return (
            <UserDataProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="others/service"
                        options={{ headerShown: false }}
                    />
                </Stack>
            </UserDataProvider>
    );
}
