import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import UnionHeader from "./components/UnionHeader";

// ─── Data ─────────────────────────────────────────────────────────────────────

const UNIONS = [
    "National Union of Road Transportation Workers ( NURTW)",
    "Raod Transport Employers Association ( RTEAN)",
    "National Union of Road Transportation Workers ( NURTW)",
    "Maritime Workers Union of nigeria",
    "National Association of Nigeria Trader ( NANTS)",
    "Amalgamated Commerical Tricycle & motorcycles Owner ( ACTMOR)",
    "National Union of Petroleum and Nature Gas ( NURTW)",
];

const STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
    "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti",
    "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
    "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun",
    "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
    "Yobe", "Zamfara", "FCT (Abuja)",
];

type Role = "transport_worker" | "trader" | "rider";

interface RoleOption {
    key: Role;
    label: string;
    emoji: string;
}

const ROLES: RoleOption[] = [
    { key: "transport_worker", label: "Transport worker", emoji: "🚌" },
    { key: "trader", label: "Trader", emoji: "🛒" },
    { key: "rider", label: "Rider", emoji: "🏍️" },
];

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function DropdownField({
    label,
    placeholder,
    value,
    options,
    onSelect,
}: {
    label: string;
    placeholder: string;
    value: string;
    options: string[];
    onSelect: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <View className="mb-5">
            <Text className="text-[14px] font-medium text-gray-700 mb-2">{label}</Text>

            <TouchableOpacity
                onPress={() => setOpen(!open)}
                className="flex-row items-center justify-between h-12 px-4 rounded-xl border border-gray-200 bg-gray-50"
                activeOpacity={0.7}
            >
                <Text
                    className={`text-[15px] ${value ? "text-gray-900" : "text-gray-400"}`}
                    numberOfLines={1}
                    style={{ flex: 1 }}
                >
                    {value || placeholder}
                </Text>
                <Ionicons
                    name={open ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#9CA3AF"
                />
            </TouchableOpacity>

            {open && (
                <View
                    className="rounded-xl border border-gray-200 bg-white mt-1 overflow-hidden"
                    style={{
                        maxHeight: 200,
                        elevation: 6,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 3 },
                    }}
                >
                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                        {options.map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => {
                                    onSelect(opt);
                                    setOpen(false);
                                }}
                                className={`px-4 py-3 border-b border-gray-100 flex-row items-center justify-between ${
                                    value === opt ? "bg-green-50" : ""
                                }`}
                            >
                                <Text
                                    className={`text-[14px] flex-1 ${
                                        value === opt
                                            ? "text-[#2d6a2d] font-semibold"
                                            : "text-gray-800"
                                    }`}
                                    numberOfLines={2}
                                >
                                    {opt}
                                </Text>
                                {value === opt && (
                                    <Ionicons name="checkmark" size={16} color="#2d6a2d" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

// ─── Role Card ────────────────────────────────────────────────────────────────

function RoleCard({
    option,
    selected,
    onPress,
}: {
    option: RoleOption;
    selected: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.75}
            className={`flex-row items-center justify-between px-4 py-3 rounded-xl border mb-3 ${
                selected
                    ? "bg-green-50 border-[#2d6a2d]"
                    : "bg-gray-50 border-gray-200"
            }`}
        >
            <View className="flex-row items-center">
                <Text style={{ fontSize: 20, marginRight: 12 }}>{option.emoji}</Text>
                <Text
                    className={`text-[15px] font-medium ${
                        selected ? "text-[#2d6a2d]" : "text-gray-800"
                    }`}
                >
                    {option.label}
                </Text>
            </View>
            {selected && (
                <View className="w-6 h-6 rounded-full bg-[#2d6a2d] items-center justify-center">
                    <Ionicons name="checkmark" size={14} color="white" />
                </View>
            )}
        </TouchableOpacity>
    );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function UserDetails() {
    const { phone } = useLocalSearchParams<{ phone: string }>();

    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [union, setUnion] = useState("");
    const [state, setState] = useState("");
    const [localGovt, setLocalGovt] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleRole = (role: Role) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    const canSubmit =
        fullName.trim() &&
        userName.trim() &&
        union &&
        state &&
        selectedRoles.length > 0 &&
        !isLoading;

    const handleContinue = async () => {
        if (!canSubmit) return;
        setIsLoading(true);
        try {
            // TODO: call your register endpoint with the collected data
            await new Promise((r) => setTimeout(r, 800));
            router.push("/union/home" as any);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <UnionHeader currentStep={3} showBack />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 24 }}
                >
                    <View className="px-6 pt-6">
                        {/* Heading */}
                        <Text className="text-2xl font-bold text-gray-900 mb-1">
                            Tell us about yourself
                        </Text>
                        <Text className="text-gray-500 text-[14px] mb-6 leading-5">
                            Please fill the form below with your details
                        </Text>

                        {/* Full Name */}
                        <View className="mb-5">
                            <Text className="text-[14px] font-medium text-gray-700 mb-2">
                                Full Name
                            </Text>
                            <TextInput
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Input Full Name"
                                placeholderTextColor="#9CA3AF"
                                className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[15px] text-gray-900"
                            />
                        </View>

                        {/* User Name */}
                        <View className="mb-5">
                            <Text className="text-[14px] font-medium text-gray-700 mb-2">
                                User Name
                            </Text>
                            <TextInput
                                value={userName}
                                onChangeText={setUserName}
                                placeholder="Input User Name"
                                placeholderTextColor="#9CA3AF"
                                className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[15px] text-gray-900"
                            />
                        </View>

                        {/* Select Union */}
                        <DropdownField
                            label="Select Union"
                            placeholder="Choose Your Union"
                            value={union}
                            options={UNIONS}
                            onSelect={setUnion}
                        />

                        {/* State */}
                        <DropdownField
                            label="State"
                            placeholder="Select Your State"
                            value={state}
                            options={STATES}
                            onSelect={setState}
                        />

                        {/* Local Government */}
                        <View className="mb-6">
                            <Text className="text-[14px] font-medium text-gray-700 mb-2">
                                Local Goverment
                            </Text>
                            <TextInput
                                value={localGovt}
                                onChangeText={setLocalGovt}
                                placeholder="Input Local Goverment"
                                placeholderTextColor="#9CA3AF"
                                className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[15px] text-gray-900"
                            />
                        </View>

                        {/* Get started as */}
                        <View className="mb-6">
                            <Text className="text-[14px] font-medium text-gray-700 mb-3">
                                Get started as
                            </Text>
                            {ROLES.map((role) => (
                                <RoleCard
                                    key={role.key}
                                    option={role}
                                    selected={selectedRoles.includes(role.key)}
                                    onPress={() => toggleRole(role.key)}
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Continue button */}
                <View className="px-6 pb-8 pt-4 bg-white border-t border-gray-100">
                    <TouchableOpacity
                        onPress={handleContinue}
                        activeOpacity={0.85}
                        disabled={!canSubmit}
                        className="rounded-full h-14 items-center justify-center"
                        style={{
                            backgroundColor: "#2d6a2d",
                            opacity: canSubmit ? 1 : 0.6,
                        }}
                    >
                        <Text className="text-white text-[16px] font-semibold">
                            {isLoading ? "Please wait…" : "Continue"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
