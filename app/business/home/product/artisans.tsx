import StoreWrapper from "@/components/wrapper/business";
import { useGetFeaturedCategoriesQuery } from "@/redux/business/slices/growthSlice";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import type { Category, Group, SubCategory } from "./types/specializations";
import { useRouter } from "expo-router";

const GroupRow = ({ group }: { group: Group }) => (
    <View className="flex-row items-center px-3 py-2.5 rounded-xl mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <Text className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {group.label}
        </Text>
    </View>
);

const SubCategorySection = ({
    sub,
    isOpen,
    onToggleOpen,
}: {
    sub: SubCategory;
    isOpen: boolean;
    onToggleOpen: () => void;
}) => {
    return (
        <View className="mb-3">
            {/* SubCategory Header - CLICKABLE for collapse/expand */}
            <TouchableOpacity
                onPress={onToggleOpen}
                activeOpacity={0.7}
                className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3.5"
            >
                <View className="flex-1">
                    <Text className="text-base font-bold text-gray-800 dark:text-gray-100">
                        {sub.label}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {sub.groups.length} specializations
                    </Text>
                </View>
                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6B7280"
                />
            </TouchableOpacity>

            {/* Groups - only show when expanded */}
            {isOpen && (
                <View className="mt-2 px-1">
                    {sub.groups.map((group) => (
                        <GroupRow key={group._id} group={group} />
                    ))}
                </View>
            )}
        </View>
    );
};

export default function ArtisansSpecializations() {
    const router = useRouter();
    const {
        data: cates,
        isLoading,
        refetch,
    } = useGetFeaturedCategoriesQuery("true");

    const categories: Category[] = cates?.data ?? [];

    const [openSubCategories, setOpenSubCategories] = useState<Record<string, boolean>>({});

    const handleToggleSubCategory = (subId: string) => {
        setOpenSubCategories((prev) => ({
            ...prev,
            [subId]: !prev[subId],
        }));
    };

    const handleCategoryPress = (category: Category) => {
        // Collect ALL groups from this category
        const allGroupIds: string[] = [];
        
        for (const sub of category.sub_category) {
            for (const group of sub.groups) {
                allGroupIds.push(group._id);
            }
        }
        
        // Navigate to service details with all groups from this category
        router.push({
            pathname: "/business/home/product/service-details",
            params: { 
                selectedGroups: JSON.stringify(allGroupIds),
                categoryName: category.category
            }
        });
    };

    // Calculate total groups in a category
    const getCategoryGroupCount = (category: Category) => {
        return category.sub_category.reduce((total, sub) => {
            return total + sub.groups.length;
        }, 0);
    };

    return (
        <StoreWrapper headerTitle="Specializations" hasFooter={false}>
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            ) : (
                <View className="flex-1">
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
                    >
                        {categories.map((cat) => {
                            const groupCount = getCategoryGroupCount(cat);
                            
                            return (
                                <View key={cat._id} className="mb-6">
                                    {/* Category Header - CLICKABLE to navigate to service details */}
                                    <TouchableOpacity
                                        onPress={() => handleCategoryPress(cat)}
                                        activeOpacity={0.7}
                                        className="flex-row items-center justify-between mb-3"
                                    >
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-1 h-5 bg-indigo-600 rounded-full mr-3" />
                                            <Text className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                                {cat.category}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center gap-2">
                                            <View className="bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded-full">
                                                <Text className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                                                    {groupCount} services
                                                </Text>
                                            </View>
                                            <Ionicons name="arrow-forward" size={18} color="#4f46e5" />
                                        </View>
                                    </TouchableOpacity>

                                    {/* SubCategories - collapsible */}
                                    <View className="ml-1">
                                        {cat.sub_category.map((sub) => (
                                            <SubCategorySection
                                                key={sub._id}
                                                sub={sub}
                                                isOpen={openSubCategories[sub._id] ?? true}
                                                onToggleOpen={() => handleToggleSubCategory(sub._id)}
                                            />
                                        ))}
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            )}
        </StoreWrapper>
    );
}