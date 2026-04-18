import Button from "@/components/form/Button";
import InputField from "@/components/form/storeTextInputs";
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import { RegisterUserPayload, useRegisterUserMutation } from "@/redux/authService/authSlice";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
import * as yup from "yup";
import { PageHeader } from "./component";

const ProfileSchema = yup.object().shape({
    fullname: yup.string().max(100, "Max 100 characters").required("Fullname name is required"),
    email: yup.string().email("Invalid email address").optional(),
    referralCode: yup.string().optional(),
});



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



export default function ProfileSetup() {
    const [apiError, setApiError] = useState("");
    const [registerStore, { isLoading }] = useRegisterUserMutation();

    const handleSubmit = async (values: {
        fullname: string;
        email: string;
        referralCode: string;
    }) => {
        setApiError("");
        const payload: RegisterUserPayload = {
            fullname: values.fullname,
            email: values.email,
            ...(values.referralCode && { referralCode: values.referralCode }),
        };

        try {
            console.log({ payload })
            await registerStore(payload).then(res => {
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

                <Formik
                    validationSchema={ProfileSchema}
                    initialValues={{
                        fullname: "",
                        email: "",
                        referralCode: "",
                    }}
                    onSubmit={handleSubmit}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit: formikSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isValid,
                        dirty,
                    }) => (
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
                                    {/* <SectionLabel text="Required Information" /> */}
                                    <InputField
                                        label="Fullname *"
                                        placeholder="e.g. Samuel Precious"
                                        value={values.fullname}
                                        onChangeText={handleChange("fullname")}
                                        onBlur={handleBlur("fullname")}
                                        error={touched.fullname ? errors.fullname : ""}
                                    />
                                    <InputField
                                        label="Email Address"
                                        placeholder="Your email address (optional, but helps boost your profile visibility)"
                                        value={values.email}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        error={touched.email ? errors.email : ""}
                                    />

                                    <InputField
                                        label="Referral Code"
                                        placeholder="Were you referred? Enter their code"
                                        value={values.referralCode}
                                        onChangeText={handleChange("referralCode")}
                                        onBlur={handleBlur("referralCode")}
                                    />

                                    {/* <SectionLabel text="Add to reach 100%" /> */}

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
                                            onPress={formikSubmit}
                                            isLoading={isLoading}
                                            loadingText="Saving…"
                                            disabled={!(isValid && dirty) || isLoading}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
