import { ThemedLinkButton } from "../ThemedLinkButton";
import { ThemedPressable } from "../ThemedPressable";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Link } from "expo-router";
import React from "react";
import { Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest, ResponseType } from "expo-auth-session";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { server } from "@/redux/state/slices/api/baseApi";

export type InputProps = {
    register?: boolean;
};

export default function LoginProcess({ register }: InputProps) {
    const router = useRouter();

    // Your server's Google OAuth URL
    const googleAuthUrl = `https://corislo-backend.onrender.com/api/v1/auth/google?mobile=true`;
    console.log(googleAuthUrl);
    const handleGoogleSignIn = async () => {
        try {
            // Open the Google OAuth URL in a browser
            console.log("here1");
            const result = await WebBrowser.openAuthSessionAsync(
                googleAuthUrl,
                Linking.createURL("/auth") // Redirect back to your app
            );
            console.log("here2", result);
            if (result.type === "success") {
                // Extract the authorization code from the redirect URL
                const url = result.url;
                const params = Linking.parse(url).queryParams;

                if (params && params.code) {
                    const authorizationCode = params.code;

                    // Send the authorization code to your backend
                    const serverResponse = await fetch(
                        `${server}auth/google/callback`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ code: authorizationCode }),
                        }
                    );

                    const data = await serverResponse.json();

                    if (serverResponse.ok) {
                        // Handle successful sign-in (e.g., save token, navigate to home screen)
                        console.log("Google Sign-In successful:", data);
                        router.replace("/home"); // Navigate to the home screen
                    } else {
                        console.error("Google Sign-In failed:", data.error);
                    }
                } else {
                    console.error(
                        "Authorization code not found in redirect URL"
                    );
                }
            } else {
                console.error("Google Sign-In was canceled or failed");
            }
        } catch (error) {
            console.error("Error during Google Sign-In:", error);
        }
    };
    return (
        <>
            <ThemedText className=" !text-2xl my-8 text-center">
                or {register ? "register" : "login"} with
            </ThemedText>
            <ThemedView className="flex flex-row !items-center !bg-transparent !justify-center">
                <ThemedPressable
                    icon={
                        <Image
                            source={require("@/assets/images/logos/google.png")}
                            style={{
                                width: 17,
                                height: 17,
                                marginRight: 10,
                            }}
                        />
                    }
                    label="Google"
                    theme="dark"
                    darkColor="#2A347E"
                    onPress={() => handleGoogleSignIn()}
                    className="w-5/12 max-w-52 px-6 mr-2 border h-14 rounded-full text-center !text-4xl"
                />
                <ThemedPressable
                    icon={
                        <Image
                            source={require("@/assets/images/logos/facebook.png")}
                            style={{
                                width: 11,
                                height: 17,
                                marginRight: 10,
                            }}
                        />
                    }
                    // theme="dark"
                    darkColor="#2A347E"
                    label="Facebook"
                    className="w-5/12 max-w-52 px-6 ml-2 border h-14 rounded-full text-center !text-4xl"
                >
                    facebook
                </ThemedPressable>
            </ThemedView>
            {!register ? (
                <ThemedText className="!text-gray-600 !text-xl w-68 mt-10  text-center">
                    Don’t have an account?{" "}
                    <Link
                        href="/register"
                        className="!text-orange-600 !text-xl !font-bold"
                    >
                        Register
                    </Link>
                </ThemedText>
            ) : (
                <ThemedText className="!text-gray-600 !text-xl w-68 mt-10  text-center">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="!text-orange-600 !text-xl !font-bold"
                    >
                        Log in
                    </Link>
                </ThemedText>
            )}
        </>
    );
}
