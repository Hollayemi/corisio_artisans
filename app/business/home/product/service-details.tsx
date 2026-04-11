import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
} from "react-native";
import StoreWrapper from "@/components/wrapper/business";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetFeaturedCategoriesQuery } from "@/redux/business/slices/growthSlice";
import type { Category, Group, SpecializationFormData } from "./types/specializations";
import { collectSpecFromGroups, prettyKey } from "./types/specializations";

const SpecQuestion = ({
    questionKey,
    options,
    selected,
    onChange,
}: {
    questionKey: string;
    options: string[];
    selected: string;
    onChange: (key: string, value: string) => void;
}) => {
    return (
        <View className="mb-5">
            <Text className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">
                {prettyKey(questionKey)}
            </Text>
            <View className="flex-row flex-wrap gap-2">
                {options.map((opt) => {
                    const active = selected === opt;
                    return (
                        <TouchableOpacity
                            key={opt}
                            onPress={() => onChange(questionKey, active ? "" : opt)}
                            activeOpacity={0.7}
                            className={`px-3 py-2 rounded-xl border ${
                                active
                                    ? "bg-indigo-600 border-indigo-600"
                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            <Text
                                className={`text-sm font-medium ${
                                    active
                                        ? "text-white"
                                        : "text-gray-700 dark:text-gray-300"
                                }`}
                            >
                                {opt}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const SpecSheet = ({
    categories,
    selectedGroupIds,
    specAnswers,
    onAnswerChange,
}: {
    categories: Category[];
    selectedGroupIds: Set<string>;
    specAnswers: Record<string, string>;
    onAnswerChange: (key: string, value: string) => void;
}) => {
    const mergedSpec = useMemo(() => {
        const allGroups: Group[] = [];
        for (const cat of categories) {
            for (const sub of cat.sub_category) {
                for (const g of sub.groups) {
                    if (selectedGroupIds.has(g._id)) {
                        allGroups.push(g);
                    }
                }
            }
        }
        return collectSpecFromGroups(allGroups);
    }, [categories, selectedGroupIds]);

    const specEntries = Object.entries(mergedSpec);

    if (selectedGroupIds.size === 0) {
        return (
            <View className="items-center py-10 px-6">
                <Ionicons name="construct-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-400 dark:text-gray-500 text-center mt-3 text-sm leading-5">
                    No specializations selected
                </Text>
            </View>
        );
    }

    if (specEntries.length === 0) {
        return (
            <View className="items-center py-8">
                <Text className="text-gray-400 dark:text-gray-500 text-sm">
                    No additional details required for selected specializations
                </Text>
            </View>
        );
    }

    return (
        <View>
            {specEntries.map(([key, options]) => (
                <SpecQuestion
                    key={key}
                    questionKey={key}
                    options={options}
                    selected={specAnswers[key] ?? ""}
                    onChange={onAnswerChange}
                />
            ))}
        </View>
    );
};

const SpecProgress = ({
    specAnswers,
    totalKeys,
}: {
    specAnswers: Record<string, string>;
    totalKeys: number;
}) => {
    const answered = Object.values(specAnswers).filter(Boolean).length;
    const pct = totalKeys === 0 ? 0 : Math.round((answered / totalKeys) * 100);

    return (
        <View className="mb-5">
            <View className="flex-row justify-between mb-1.5">
                <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Profile completeness
                </Text>
                <Text className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {answered}/{totalKeys} answered
                </Text>
            </View>
            <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <View
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${pct}%` }}
                />
            </View>
        </View>
    );
};

export default function ServiceDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { data: cates, isLoading } = useGetFeaturedCategoriesQuery("true");
    
    const categories: Category[] = cates?.data ?? [];
    
    // Get selected groups from navigation params
    const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
    const [specAnswers, setSpecAnswers] = useState<Record<string, string>>({});

    useEffect(() => {
        if (params.selectedGroups) {
            try {
                const groups = JSON.parse(params.selectedGroups as string);
                setSelectedGroupIds(new Set(groups));
            } catch (e) {
                console.error("Failed to parse selected groups", e);
            }
        }
    }, [params.selectedGroups]);

    const handleAnswerChange = useCallback((key: string, value: string) => {
        setSpecAnswers((prev) => ({ ...prev, [key]: value }));
    }, []);

    const totalSpecKeys = useMemo(() => {
        const allGroups: Group[] = [];
        for (const cat of categories) {
            for (const sub of cat.sub_category) {
                for (const g of sub.groups) {
                    if (selectedGroupIds.has(g._id)) allGroups.push(g);
                }
            }
        }
        return Object.keys(collectSpecFromGroups(allGroups)).length;
    }, [categories, selectedGroupIds]);

    const handleSubmit = async () => {
        const payload: SpecializationFormData = {
            selectedGroups: Array.from(selectedGroupIds),
            specifications: specAnswers,
        };
        
        console.log("Submitting:", JSON.stringify(payload, null, 2));
        
        // TODO: Call your API here
        // try {
        //     await updateStoreSpecializations(payload).unwrap();
        //     Alert.alert("Success", "Specializations saved successfully");
        //     router.back();
        // } catch (error) {
        //     Alert.alert("Error", "Failed to save specializations");
        // }
        
        Alert.alert("Success", "Specializations saved successfully");
    };

    if (isLoading) {
        return (
            <StoreWrapper>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            </StoreWrapper>
        );
    }

    return (
        <StoreWrapper headerTitle="Service Details" hasFooter={false}>
            <View className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
                >
                    <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                        {selectedGroupIds.size > 0 && (
                            <SpecProgress
                                specAnswers={specAnswers}
                                totalKeys={totalSpecKeys}
                            />
                        )}
                        <SpecSheet
                            categories={categories}
                            selectedGroupIds={selectedGroupIds}
                            specAnswers={specAnswers}
                            onAnswerChange={handleAnswerChange}
                        />
                    </View>
                </ScrollView>

                {/* Bottom Bar */}
                <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-xs text-gray-400 dark:text-gray-500">
                            {selectedGroupIds.size} specialization{selectedGroupIds.size !== 1 ? "s" : ""}
                            {" · "}
                            {Object.values(specAnswers).filter(Boolean).length} specs answered
                        </Text>
                        {selectedGroupIds.size > 0 && (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedGroupIds(new Set());
                                    setSpecAnswers({});
                                }}
                            >
                                <Text className="text-xs text-red-400 font-medium">
                                    Clear all
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={selectedGroupIds.size === 0}
                        activeOpacity={0.8}
                        className={`py-4 mb-4 rounded-2xl items-center ${
                            selectedGroupIds.size === 0
                                ? "bg-gray-200 dark:bg-gray-700"
                                : "bg-indigo-600"
                        }`}
                    >
                        <Text
                            className={`font-bold text-base ${
                                selectedGroupIds.size === 0
                                    ? "text-gray-400 dark:text-gray-500"
                                    : "text-white"
                            }`}
                        >
                            Save Specializations
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </StoreWrapper>
    );
}