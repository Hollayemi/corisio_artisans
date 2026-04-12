import { useThemeColor } from "@/hooks/useThemeColor copy";
import { MaterialIcons } from "@expo/vector-icons";
import React, { JSX, ReactElement, useState } from "react";
import { View, Text, TextInput, TextInputProps, Pressable, Image } from "react-native";

type prop = {
    placeholder: string;
    label: string;
    password?: boolean;
    others?: TextInputProps;
    Icon?: JSX.Element;
    value: string;
    onChangeText: any;
    onBlur: any;
};

export default function Input({
    placeholder,
    password,
    Icon,
    value,
    others = {},
    onChangeText,
    label,
    onBlur,
}: prop) {
    return (
        <View className="flex-row items-center justify-between rounded-md bg-[#e1e4f1]  dark:bg-slate-800 px-[4%] pt-2 pb-2 my-2">
            <View className="flex-[0.5]">
                <Text className="text-sm text-[#474545] dark:text-[#eee] ">{label}</Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    placeholder={placeholder}
                    className="bg- text-[#242222] py-0 !w-80 dark:text-gray-100   h-8 text-[15px] font-medium"
                    secureTextEntry={password ? true : false}
                    {...others}
                />
            </View>
            {Icon}
        </View>
    );
}


export function Input2({
    placeholder,
    password,
    Icon,
    others = {},
    value,
    onChangeText,
    label,
    onBlur,
}: prop) {
    return (
        <View className="flex-row items-center justify-between rounded my-1 mt-8 w-full">
            <View className="flex-1">
                <Text className="text-[16px] text-gray-500 dark:text-gray-400 mb-2.5">{label}</Text>
                <View className="relative">
                    <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        className="bg-transparent border border-[#C5C5C5] dark:!border-gray-600 rounded-lg px-4 pb-2 h-12 text-[#424242] dark:text-gray-200 text-lg font-medium"
                        secureTextEntry={password ? true : false}
                        {...others}
                    />
                    {Icon && (
                        <View className="absolute right-3 top-4">
                            {Icon}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}


export type InputProps = TextInputProps & {
    theme?: "light" | "dark";
    password?: boolean;
    error?: string | any;
    icon?: ReactElement;
    label?: string;
    placeholder?: string;
    lightColor?: string;
    darkColor?: string;
    iconClass?: string;
};


export function RoundedTextInput({
    label,
    placeholder,
    icon,
    error,
    password = false,
    className,
    iconClass,
    ...props
}: InputProps) {
    // const { isLight } = useUserData() as any;
    const isLight = true;
    const [showPassword, setShow] = useState(password);
    const color = useThemeColor({ light: "#000", dark: "#fff" }, "text");

    return (
        <View className="w-full mb-3 relative">
            <TextInput
                className={`w-full h-14 border px-12 ${
                    isLight ? "!border-gray-300" : "!border-gray-800"
                } bg-transparent pr-10 !rounded-full !text-[20px] ${className}`}
                placeholder={placeholder}
                style={[{ color }]}
                placeholderTextColor="#A1A1A1"
                secureTextEntry={showPassword ? true : false}
                {...props}
            />
            <Image
                source={require("@/assets/images/search-normal.png")}
                className={"w-6 h-6 absolute top-3 left-6 " + iconClass}
            />

            <Pressable
                onPress={() => setShow(!showPassword)}
                className={
                    "!absolute top-3 right-5 w-6 h-6 !bg-gray-400 rounded-full flex justify-center items-center " +
                    iconClass
                }
            >
                <MaterialIcons name="close" color="white" className="white" />
            </Pressable>
        </View>
    );
}