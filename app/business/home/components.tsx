import { useStoreGrowthAnalytics } from "@/hooks/useAnalyics";
import { useGetStoreGrowthQuery } from "@/redux/business/slices/growthSlice";
import { BoxIcon, Currency, EyeIcon, ShoppingBagIcon, Truck, UserPlus } from "lucide-react-native";
import React, { ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export const CardIcons: any = {
    total_sales: Currency,
    total_views: EyeIcon,
    total_orders: Truck,
    total_products: BoxIcon,
    followers: UserPlus,
    cart_and_saved: ShoppingBagIcon
}

const StatComponent = ({ stat, note, dropdown }: { stat: string, note: string, dropdown: ReactNode }) => {
    return (
        <View className="absolute w-[85%] px-1 -top-20 left-0 flex items-center justify-between flex-row">
            <View>
                <Text className="text-4xl font-bold text-gray-700 dark:text-gray-50">
                    {stat}
                </Text>
                <Text className="text-[12px] text-left text-gray-400 dark:text-blue-100 font-medium">
                    {note}
                </Text>
            </View>
            {dropdown}
        </View>
    )
}
