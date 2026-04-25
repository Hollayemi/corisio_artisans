import Button from "@/components/form/Button";
import InputField from "@/components/form/storeTextInputs";
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import {
    RegisterStorePayload,
    useRegisterStoreMutation,
} from "@/redux/authService/authSlice";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PageHeader } from "./component";

// Abuja LGAs
const ABUJA_LGAS = [
    "Abaji",
    "Abuja Municipal Area Council",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali",
];

// ── Validation functions ──
const validateStoreName = (value: string): string => {
    if (!value.trim()) return "Business name is required";
    if (value.length > 100) return "Max 100 characters";
    return "";
};

const validateOwnerInfo = (value: string): string => {
    if (!value.trim()) return "Owner name is required";
    if (value.length > 80) return "Max 80 characters";
    return "";
};

const validateAddressRaw = (value: string): string => {
    if (!value.trim()) return "Address is required";
    return "";
};

const validateLga = (value: string): string => {
    if (!value.trim()) return "LGA is required";
    return "";
};

const validateDescription = (value: string): string => {
    if (value.length > 500) return "Max 500 characters";
    return "";
};

const validateWebsite = (value: string): string => {
    if (!value.trim()) return "";
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(value)) return "Enter a valid URL (https://...)";
    return "";
};

const validateReferralCode = (value: string): string => {
    return "";
};

// ── Score calculator (mirrors server-side logic) ──
const calcScore = (
    values: { 
        storeName: string; 
        ownerInfo: string; 
        addressRaw: string; 
        lga: string; 
        description: string; 
        website: string 
    }, 
    hasCoords: boolean
) => {
    let total = 0;
    if (values.storeName) total += 15;
    total += 10; // phone already verified
    if (values.ownerInfo) total += 10;
    total += 10; // category already selected upstream
    if (values.addressRaw && values.lga) total += 15;
    if (values.description) total += 10;
    if (values.website) total += 5;
    // photo (+15) and openingHours (+10) come from sub-screens
    return Math.min(total, 100);
};

// ── Subcomponents ──────────────────────────────────────────────────────────

function CompletionBar({ score }: { score: number }) {
    const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
    return (
        <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">
                    Profile Completeness
                </Text>
                <Text className="text-[13px] font-bold" style={{ color }}>
                    {score}%
                </Text>
            </View>
            <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <View
                    className="h-2 rounded-full"
                    style={{ width: `${score}%`, backgroundColor: color }}
                />
            </View>
            {score >= 50 ? (
                <Text className="text-[12px] text-green-600 dark:text-green-400 mt-1.5 font-medium">
                    ✓ Ready to submit for verification!
                </Text>
            ) : (
                <Text className="text-[12px] text-amber-600 dark:text-amber-400 mt-1.5">
                    Complete more fields to submit for verification.
                </Text>
            )}
        </View>
    );
}

function LgaPicker({
    selected,
    onSelect,
    error,
    touched,
}: {
    selected: string;
    onSelect: (v: string) => void;
    error?: string;
    touched?: boolean;
}) {
    const [open, setOpen] = useState(false);

    return (
        <View className="mb-6">
            <Text className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                Area / LGA *
            </Text>
            <TouchableOpacity
                onPress={() => setOpen(!open)}
                className={`flex-row items-center justify-between border-2 rounded-xl px-4 h-14 bg-gray-50 dark:bg-gray-800
                    ${error && touched ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
            >
                <Text
                    className={
                        selected
                            ? "text-gray-900 dark:text-white text-[15px]"
                            : "text-gray-400 text-[15px]"
                    }
                >
                    {selected || "Select your LGA"}
                </Text>
                <Ionicons
                    name={open ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#9CA3AF"
                />
            </TouchableOpacity>
            {open && (
                <View className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 mt-1 overflow-hidden shadow-md">
                    {ABUJA_LGAS.map((lga) => (
                        <TouchableOpacity
                            key={lga}
                            onPress={() => { onSelect(lga); setOpen(false); }}
                            className={`px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 flex-row items-center justify-between
                                ${selected === lga ? "bg-blue-50 dark:bg-blue-950" : ""}`}
                        >
                            <Text
                                className={`text-[15px] ${selected === lga
                                    ? "text-[#2A347E] dark:text-[#FDB415] font-semibold"
                                    : "text-gray-800 dark:text-gray-200"
                                    }`}
                            >
                                {lga}
                            </Text>
                            {selected === lga && (
                                <Ionicons name="checkmark" size={18} color="#2A347E" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {error && touched ? (
                <Text className="text-red-500 text-[12px] mt-1">{error}</Text>
            ) : null}
        </View>
    );
}

function GpsButton({
    onCapture,
    coords,
}: {
    onCapture: (coords: [number, number]) => void;
    coords: [number, number] | null;
}) {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const capture = async () => {
        setLoading(true);
        setErr("");
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErr("Location permission denied.");
                return;
            }
            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            // API wants [lng, lat] (GeoJSON order)
            onCapture([loc.coords.longitude, loc.coords.latitude]);
        } catch {
            setErr("Could not get location. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="mb-6">
            <Text className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Location (GPS)
            </Text>
            <TouchableOpacity
                onPress={capture}
                disabled={loading}
                className={`flex-row items-center justify-between border-2 rounded-xl px-4 h-14
                    ${coords
                        ? "bg-green-50 dark:bg-green-950 border-green-400 dark:border-green-600"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
            >
                <View className="flex-row items-center">
                    <Ionicons
                        name={coords ? "location" : "location-outline"}
                        size={20}
                        color={coords ? "#22c55e" : "#9CA3AF"}
                    />
                    <Text
                        className={`ml-3 text-[15px] ${coords
                            ? "text-green-700 dark:text-green-400 font-medium"
                            : "text-gray-400"
                            }`}
                    >
                        {coords
                            ? `${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}`
                            : "Tap to capture store location"}
                    </Text>
                </View>
                {loading ? (
                    <ActivityIndicator size="small" color="#2A347E" />
                ) : (
                    <Text className="text-[13px] text-[#2A347E] dark:text-[#FDB415] font-semibold">
                        {coords ? "Recapture" : "Use GPS"}
                    </Text>
                )}
            </TouchableOpacity>
            {err ? (
                <Text className="text-red-500 text-[12px] mt-1">{err}</Text>
            ) : null}
        </View>
    );
}

function SectionLabel({ text }: { text: string }) {
    return (
        <View className="flex-row items-center mb-4 mt-2">
            <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <Text className="mx-3 text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {text}
            </Text>
            <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </View>
    );
}

function CharCount({ current, max }: { current: number; max: number }) {
    const over = current > max;
    return (
        <Text
            className={`text-[11px] text-right -mt-4 mb-4 mr-1 ${over ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}
        >
            {current}/{max}
        </Text>
    );
}

function SubScreenCard({
    icon,
    title,
    subtitle,
    onPress,
}: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    title: string;
    subtitle: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 mb-3"
        >
            <View className="w-10 h-10 rounded-full bg-[#2A347E]/10 dark:bg-[#FDB415]/10 items-center justify-center mr-4">
                <Ionicons name={icon} size={20} color="gray" />
            </View>
            <View className="flex-1">
                <Text className="text-[15px] font-semibold text-gray-900 dark:text-white">
                    {title}
                </Text>
                <Text className="text-[12px] text-green-600 dark:text-green-400 font-medium mt-0.5">
                    {subtitle}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
    );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function ProfileSetup() {
    const { categories } = useLocalSearchParams<{ categories: any }>();
    const [coords, setCoords] = useState<[number, number] | null>(null);
    const [apiError, setApiError] = useState("");
    
    // Form state
    const [formData, setFormData] = useState({
        storeName: "",
        ownerInfo: "",
        addressRaw: "",
        lga: "",
        description: "",
        website: "",
        referralCode: "",
    });
    
    // Validation errors
    const [errors, setErrors] = useState({
        storeName: "",
        ownerInfo: "",
        addressRaw: "",
        lga: "",
        description: "",
        website: "",
        referralCode: "",
    });
    
    // Touched state for showing errors
    const [touched, setTouched] = useState({
        storeName: false,
        ownerInfo: false,
        addressRaw: false,
        lga: false,
        description: false,
        website: false,
        referralCode: false,
    });

    console.log({categories})

    // ── RTK Query mutation ──
    const [registerStore, { isLoading }] = useRegisterStoreMutation();

    // Handle field changes
    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Validate on change
        let error = "";
        switch (field) {
            case "storeName":
                error = validateStoreName(value);
                break;
            case "ownerInfo":
                error = validateOwnerInfo(value);
                break;
            case "addressRaw":
                error = validateAddressRaw(value);
                break;
            case "lga":
                error = validateLga(value);
                break;
            case "description":
                error = validateDescription(value);
                break;
            case "website":
                error = validateWebsite(value);
                break;
            case "referralCode":
                error = validateReferralCode(value);
                break;
        }
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    // Handle blur for showing errors
    const handleBlur = (field: keyof typeof touched) => () => {
        setTouched(prev => ({ ...prev, [field]: true }));
        
        // Validate on blur
        let error = "";
        switch (field) {
            case "storeName":
                error = validateStoreName(formData.storeName);
                break;
            case "ownerInfo":
                error = validateOwnerInfo(formData.ownerInfo);
                break;
            case "addressRaw":
                error = validateAddressRaw(formData.addressRaw);
                break;
            case "lga":
                error = validateLga(formData.lga);
                break;
            case "description":
                error = validateDescription(formData.description);
                break;
            case "website":
                error = validateWebsite(formData.website);
                break;
            case "referralCode":
                error = validateReferralCode(formData.referralCode);
                break;
        }
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    // Check if form is valid
    const isValid = () => {
        return (
            validateStoreName(formData.storeName) === "" &&
            validateOwnerInfo(formData.ownerInfo) === "" &&
            validateAddressRaw(formData.addressRaw) === "" &&
            validateLga(formData.lga) === "" &&
            validateDescription(formData.description) === "" &&
            validateWebsite(formData.website) === "" &&
            validateReferralCode(formData.referralCode) === ""
        );
    };

    // Check if form is dirty (has any filled required fields or changes)
    const isDirty = () => {
        return (
            formData.storeName.trim() !== "" ||
            formData.ownerInfo.trim() !== "" ||
            formData.addressRaw.trim() !== "" ||
            formData.lga.trim() !== "" ||
            formData.description.trim() !== "" ||
            formData.website.trim() !== "" ||
            formData.referralCode.trim() !== ""
        );
    };

    const handleSubmit = async () => {
        // Validate all fields on submit
        const storeNameError = validateStoreName(formData.storeName);
        const ownerInfoError = validateOwnerInfo(formData.ownerInfo);
        const addressRawError = validateAddressRaw(formData.addressRaw);
        const lgaError = validateLga(formData.lga);
        const descriptionError = validateDescription(formData.description);
        const websiteError = validateWebsite(formData.website);
        const referralCodeError = validateReferralCode(formData.referralCode);
        
        setErrors({
            storeName: storeNameError,
            ownerInfo: ownerInfoError,
            addressRaw: addressRawError,
            lga: lgaError,
            description: descriptionError,
            website: websiteError,
            referralCode: referralCodeError,
        });
        
        setTouched({
            storeName: true,
            ownerInfo: true,
            addressRaw: true,
            lga: true,
            description: true,
            website: true,
            referralCode: true,
        });
        
        // Check if form is valid
        if (storeNameError || ownerInfoError || addressRawError || lgaError || 
            descriptionError || websiteError || referralCodeError) {
            return;
        }
        
        setApiError("");

        const payload: RegisterStorePayload = {
            storeName: formData.storeName,
            ownerInfo: formData.ownerInfo,
            // category is the first item in categories JSON; server stores it on the account
            category: categories,
            address: {
                raw: formData.addressRaw,
                lga: formData.lga,
                state: "FCT",
                ...(coords && {
                    coordinates: {
                        type: "Point",
                        coordinates: coords, // [lng, lat]
                    },
                }),
            },
            ...(formData.description && { description: formData.description }),
            ...(formData.website && { website: formData.website }),
            ...(formData.referralCode && { referralCode: formData.referralCode }),
        };

        try {
            console.log({payload})
            await registerStore(payload).then((res:any) => {
                router.replace("/business/auth/StoreImages");
            });
        } catch (err: any) {
            setApiError(err?.data?.message ?? "Could not save your profile. Please try again.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ProgressHeader currentStep={4} />

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="pt-6">
                        <PageHeader
                            title="Set Up Your Business"
                            subtitle="Tell us about your business so customers can discover you."
                        />

                        <View className="px-6">
                            <CompletionBar score={calcScore(formData, !!coords)} />

                            {/* ── Required ── */}
                            <SectionLabel text="Required Information" />

                            <InputField
                                label="Business Name *"
                                placeholder="e.g. Amina's Boutique"
                                value={formData.storeName}
                                onChangeText={handleChange("storeName")}
                                onBlur={handleBlur("storeName")}
                                error={touched.storeName ? errors.storeName : ""}
                            />

                            <InputField
                                label="Owner Name *"
                                placeholder="Your full name"
                                value={formData.ownerInfo}
                                onChangeText={handleChange("ownerInfo")}
                                onBlur={handleBlur("ownerInfo")}
                                error={touched.ownerInfo ? errors.ownerInfo : ""}
                            />

                            <InputField
                                label="Street Address *"
                                placeholder="e.g. 12 Wuse Market Road"
                                value={formData.addressRaw}
                                onChangeText={handleChange("addressRaw")}
                                onBlur={handleBlur("addressRaw")}
                                error={touched.addressRaw ? errors.addressRaw : ""}
                            />

                            <LgaPicker
                                selected={formData.lga}
                                onSelect={(v) => {
                                    setFormData(prev => ({ ...prev, lga: v }));
                                    const error = validateLga(v);
                                    setErrors(prev => ({ ...prev, lga: error }));
                                    setTouched(prev => ({ ...prev, lga: true }));
                                }}
                                error={errors.lga}
                                touched={touched.lga}
                            />

                            <GpsButton onCapture={setCoords} coords={coords} />

                            {/* ── Optional ── */}
                            <SectionLabel text="Optional (boosts your score)" />

                            <InputField
                                label="Description"
                                placeholder="Tell customers what makes your store special…"
                                value={formData.description}
                                onChangeText={handleChange("description")}
                                onBlur={handleBlur("description")}
                                multiline
                                error={touched.description ? errors.description : ""}
                            />
                            <CharCount current={formData.description.length} max={500} />

                            <InputField
                                label="Website"
                                placeholder="https://yourstore.com"
                                value={formData.website}
                                onChangeText={handleChange("website")}
                                onBlur={handleBlur("website")}
                                keyboardType="url"
                                error={touched.website ? errors.website : ""}
                            />

                            <InputField
                                label="Referral Code"
                                placeholder="Were you referred? Enter their code"
                                value={formData.referralCode}
                                onChangeText={handleChange("referralCode")}
                                onBlur={handleBlur("referralCode")}
                                error={touched.referralCode ? errors.referralCode : ""}
                            />

                            {/* ── Sub-screen shortcuts (add to score) ── */}
                            <SectionLabel text="Add to reach 100%" />

                            <SubScreenCard
                                icon="camera"
                                title="Add Business Photos"
                                subtitle="+15 points"
                                onPress={() => router.push("/business/auth/ProfilePicture")}
                            />

                            {/* ── API-level error ── */}
                            {apiError ? (
                                <View className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-4">
                                    <Text className="text-[13px] text-red-700 dark:text-red-400">
                                        {apiError}
                                    </Text>
                                </View>
                            ) : null}

                            {/* ── Submit ── */}
                            <View className="mt-2 mb-10">
                                <Button
                                    title="Save & Continue"
                                    onPress={handleSubmit}
                                    isLoading={isLoading}
                                    loadingText="Saving…"
                                    disabled={!(isValid() && isDirty()) || isLoading}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}