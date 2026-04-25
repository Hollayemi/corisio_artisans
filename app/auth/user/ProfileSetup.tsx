import Button from "@/components/form/Button";
import InputField from "@/components/form/storeTextInputs";
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import { RegisterUserPayload, useRegisterUserMutation } from "@/redux/authService/authSlice";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
import { PageHeader } from "./component";

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

// Manual validation functions
const validateFullname = (value: string): string => {
    if (!value.trim()) return "Fullname is required";
    if (value.length > 100) return "Max 100 characters";
    return "";
};

const validateEmail = (value: string): string => {
    if (!value.trim()) return ""; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email address";
    return "";
};

const validateReferralCode = (value: string): string => {
    return ""; // Referral code is optional with no validation
};

export default function ProfileSetup() {
    const [apiError, setApiError] = useState("");
    const [registerStore, { isLoading }] = useRegisterUserMutation();
    
    // Form state
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        referralCode: "",
    });
    
    // Validation errors
    const [errors, setErrors] = useState({
        fullname: "",
        email: "",
        referralCode: "",
    });
    
    // Touched state for showing errors
    const [touched, setTouched] = useState({
        fullname: false,
        email: false,
        referralCode: false,
    });

    // Handle field changes
    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Validate on change
        let error = "";
        switch (field) {
            case "fullname":
                error = validateFullname(value);
                break;
            case "email":
                error = validateEmail(value);
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
            case "fullname":
                error = validateFullname(formData.fullname);
                break;
            case "email":
                error = validateEmail(formData.email);
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
            validateFullname(formData.fullname) === "" &&
            validateEmail(formData.email) === "" &&
            validateReferralCode(formData.referralCode) === ""
        );
    };

    // Check if form is dirty (has any non-empty values)
    const isDirty = () => {
        return formData.fullname.trim() !== "" || 
               formData.email.trim() !== "" || 
               formData.referralCode.trim() !== "";
    };

    const handleSubmit = async () => {
        // Validate all fields on submit
        const fullnameError = validateFullname(formData.fullname);
        const emailError = validateEmail(formData.email);
        const referralCodeError = validateReferralCode(formData.referralCode);
        
        setErrors({
            fullname: fullnameError,
            email: emailError,
            referralCode: referralCodeError,
        });
        
        setTouched({
            fullname: true,
            email: true,
            referralCode: true,
        });
        
        // Check if form is valid
        if (fullnameError || emailError || referralCodeError) {
            return;
        }
        
        setApiError("");
        const payload: RegisterUserPayload = {
            fullname: formData.fullname,
            email: formData.email,
            ...(formData.referralCode && { referralCode: formData.referralCode }),
        };

        try {
            console.log({ payload });
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
                            title="Set Up Your Account"
                            subtitle="Tell us about your yourself to help us personalize your experience and connect you with the right customers."
                        />

                        <View className="px-6">
                            <InputField
                                label="Fullname *"
                                placeholder="e.g. Samuel Precious"
                                value={formData.fullname}
                                onChangeText={handleChange("fullname")}
                                onBlur={handleBlur("fullname")}
                                error={touched.fullname ? errors.fullname : ""}
                            />
                            <InputField
                                label="Email Address"
                                placeholder="Your email address (optional, but helps boost your profile visibility)"
                                value={formData.email}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                error={touched.email ? errors.email : ""}
                            />

                            <InputField
                                label="Referral Code"
                                placeholder="Were you referred? Enter their code"
                                value={formData.referralCode}
                                onChangeText={handleChange("referralCode")}
                                onBlur={handleBlur("referralCode")}
                                error={touched.referralCode ? errors.referralCode : ""}
                            />

                            {apiError ? (
                                <View className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-4">
                                    <Text className="text-[13px] text-red-700 dark:text-red-400">
                                        {apiError}
                                    </Text>
                                </View>
                            ) : null}

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