import { formatDistance } from '@/utils/format';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import type { Job } from '@/redux/business/slices/jobsSlice';

function timeAgo(isoString: string): string {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function formatBudget(amount?: number, currency = 'NGN'): string | null {
    if (!amount) return null;
    return `₦${amount.toLocaleString()}`;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    Plumbing:    { bg: 'bg-gray-100 dark:bg-gray-800',   text: 'text-gray-700 dark:text-gray-300' },
    Electricals: { bg: 'bg-gray-100 dark:bg-gray-800',   text: 'text-gray-700 dark:text-gray-300' },
    Painting:    { bg: 'bg-gray-100 dark:bg-gray-800',   text: 'text-gray-700 dark:text-gray-300' },
    Tiling:      { bg: 'bg-gray-100 dark:bg-gray-800',   text: 'text-gray-700 dark:text-gray-300' },
    Carpentry:   { bg: 'bg-gray-100 dark:bg-gray-800',   text: 'text-gray-700 dark:text-gray-300' },
    Cleaning:    { bg: 'bg-gray-100 dark:bg-gray-800',   text: 'text-gray-700 dark:text-gray-300' },
    'AC Repair': { bg: 'bg-gray-100 dark:bg-gray-800',   text: 'text-gray-700 dark:text-gray-300' },
};

function getCategoryColor(category: string) {
    return CATEGORY_COLORS[category] ?? {
        bg:   'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface JobCardProps {
    job: Job;
    isApplied?: boolean;
    /** Show action buttons (Call / SMS / Apply) inline on the card */
    showActions?: boolean;
    onApply?: (job: Job) => void;
    onCall?: (phone: string) => void;
    onSms?: (phone: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({
    job,
    isApplied = false,
    showActions = false,
    onApply,
    onCall,
    onSms,
}) => {
    const isDark = useColorScheme() === 'dark';
    const catColor = getCategoryColor(job.category);
    const budget = formatBudget(job.budget, job.currency);

    // Get first letter of category for placeholder
    const categoryInitial = job.category.charAt(0).toUpperCase();

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
                router.push({
                    pathname: '/business/home/jobs/JobDetailsScreen',
                    params: { jobId: job.id },
                })
            }
            className="bg-white dark:bg-gray-900 mb-3 border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
            {/* Top row */}
            <View className="flex-row items-start p-4 pb-3">
                {/* Initial bubble */}
                <View className={`w-12 h-12 rounded items-center justify-center mr-3 ${catColor.bg}`}>
                    <Text className={`text-base font-semibold ${catColor.text}`}>
                        {categoryInitial}
                    </Text>
                </View>

                {/* Title + meta */}
                <View className="flex-1">
                    <View className="flex-row items-start justify-between">
                        <Text
                            numberOfLines={2}
                            className="text-[15px] font-bold text-[#2A347E] dark:text-gray-100 flex-1 pr-2 leading-snug"
                        >
                            {job.title}
                        </Text>
                        {job.urgency === 'urgent' && (
                            <View className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5">
                                <Text className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                    Urgent
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Category pill */}
                    <View className="flex-row items-center mt-1.5 gap-2 flex-wrap">
                        <View className={`px-2 py-0.5 ${catColor.bg}`}>
                            <Text className={`text-[11px] font-medium ${catColor.text}`}>
                                {job.category}
                            </Text>
                        </View>
                        {budget && (
                            <View className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800">
                                <Text className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                                    {budget}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>


            <View className="flex-row items-center justify-between px-4 pb-3">
                <View className="flex-row items-center flex-1">
                    <View className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600 mr-1" />
                    <Text
                        numberOfLines={1}
                        className="text-xs text-gray-600 dark:text-gray-400 ml-1 flex-1"
                    >
                        {job.location}
                    </Text>
                    <Text className="text-xs text-gray-400 dark:text-gray-600 mx-2">•</Text>
                    <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {job.distance.toFixed(1)} km
                    </Text>
                </View>
                <View className="flex-row items-center ml-3">
                    <View className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600 mr-1" />
                    <Text className="text-[11px] text-gray-500 dark:text-gray-500 ml-1">
                        {timeAgo(job.createdAt)}
                    </Text>
                </View>
            </View>

            {/* Applied badge OR inline action buttons */}
            {isApplied ? (
                <View className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-t border-gray-200 dark:border-gray-800">
                    <View className="flex-row items-center">
                        <View className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mr-2" />
                        <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Application submitted
                        </Text>
                    </View>
                </View>
            ) : showActions ? (
                <View className="flex-row gap-2 px-4 pb-4 pt-1">
                    <TouchableOpacity
                        onPress={() => onCall?.(job.phone)}
                        className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-800 py-2.5"
                        activeOpacity={0.7}
                    >
                        <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Call
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onSms?.(job.phone)}
                        className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-800 py-2.5"
                        activeOpacity={0.7}
                    >
                        <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Message
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onApply?.(job)}
                        className="flex-1 items-center justify-center bg-[#2A347E] dark:bg-gray-100 py-2.5"
                        activeOpacity={0.7}
                    >
                        <Text className="text-xs font-medium text-white dark:text-[#2A347E]">
                            Apply
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

export default JobCard;
export { timeAgo, getCategoryColor };