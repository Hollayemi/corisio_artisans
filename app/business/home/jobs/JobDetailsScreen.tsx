// app/business/home/jobs/JobDetailsScreen.tsx
import StoreWrapper from '@/components/wrapper/business';
import {
    Job,
    addAppliedJob,
    selectAppliedJobs,
    useApplyToJobMutation,
    useGetJobByIdQuery,
} from '@/redux/business/slices/jobsSlice';
import toaster from '@/config/toaster';
import { router, useLocalSearchParams } from 'expo-router';
import {
    Banknote,
    Calendar,
    CheckCircle2,
    Clock,
    MapPin,
    MessageCircle,
    Phone,
    Tag,
    User,
    Zap,
} from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryColor, timeAgo } from './JobCard';

// ─── Info row ─────────────────────────────────────────────────────────────────

const InfoRow = ({
    icon,
    label,
    value,
    valueColor,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    valueColor?: string;
}) => (
    <View className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
        <View className="w-8 items-center">{icon}</View>
        <View className="ml-2 flex-1">
            <Text className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</Text>
            <Text className={`text-sm font-medium ${valueColor ?? 'text-gray-900 dark:text-white'}`}>
                {value}
            </Text>
        </View>
    </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function JobDetailsScreen() {
    const { jobId } = useLocalSearchParams<{ jobId: string }>();
    const isDark = useColorScheme() === 'dark';
    const iconColor = isDark ? '#9ca3af' : '#6b7280';
    const dispatch = useDispatch();
    const appliedJobs = useSelector(selectAppliedJobs);

    const { data, isLoading } = useGetJobByIdQuery(jobId ?? '');
    const [applyToJob, { isLoading: applying }] = useApplyToJobMutation();

    const job: Job | undefined = data?.data;

    const isApplied = appliedJobs.some((aj) => aj.job.id === jobId);

    // ── Actions ───────────────────────────────────────────────────────────────

    const handleCall = () => {
        if (!job) return;
        Linking.openURL(`tel:${job.phone}`).catch(() =>
            Alert.alert('Error', 'Cannot open phone dialler.')
        );
    };

    const handleSms = () => {
        if (!job) return;
        const body = encodeURIComponent(
            `Hi ${job.clientName}, I saw your job request "${job.title}" on Coristen and I am available to help. When would be a good time to discuss?`
        );
        Linking.openURL(`sms:${job.phone}?body=${body}`).catch(() =>
            Alert.alert('Error', 'Cannot open SMS app.')
        );
    };

    const handleApply = async () => {
        if (!job) return;
        if (isApplied) {
            toaster({ type: 'error', message: 'Already applied to this job' });
            return;
        }
        try {
            await applyToJob(job.id).unwrap();
            dispatch(addAppliedJob(job));
            toaster({ type: 'success', message: 'Application sent!' });
        } catch {
            toaster({ type: 'error', message: 'Failed to apply. Please try again.' });
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────────

    if (isLoading || !job) {
        return (
            <StoreWrapper headerTitle="Job Details" hasFooter={false}>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            </StoreWrapper>
        );
    }

    const catColor = getCategoryColor(job.category);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <StoreWrapper headerTitle="Job Details" hasFooter={false}>
            <View className="flex-1 bg-gray-50 dark:bg-gray-900">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 140 }}
                >
                    {/* Hero header */}
                    <View className="bg-white dark:bg-gray-800 px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                        <View className="flex-row items-start">
                            {/* Category icon */}
                            <View
                                className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${catColor.bg}`}
                            >
                                <Text style={{ fontSize: 26 }}>{job.categoryIcon ?? '🛠️'}</Text>
                            </View>

                            <View className="flex-1">
                                {/* Urgency */}
                                {job.urgency === 'urgent' && (
                                    <View className="flex-row items-center mb-1.5">
                                        <Zap size={12} color="#ef4444" />
                                        <Text className="text-xs font-bold text-red-500 ml-1 uppercase tracking-wide">
                                            Urgent
                                        </Text>
                                    </View>
                                )}
                                <Text className="text-[17px] font-bold text-gray-900 dark:text-white leading-snug">
                                    {job.title}
                                </Text>
                                <View className={`self-start mt-2 px-3 py-1 rounded-full ${catColor.bg}`}>
                                    <Text className={`text-xs font-semibold ${catColor.text}`}>
                                        {job.category}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Budget */}
                        {job.budget && (
                            <View className="mt-4 flex-row items-center bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3">
                                <Banknote size={18} color="#16a34a" />
                                <View className="ml-2">
                                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                                        Budget
                                    </Text>
                                    <Text className="text-xl font-bold text-green-700 dark:text-green-300">
                                        ₦{job.budget.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Description */}
                    <View className="bg-white dark:bg-gray-800 mx-4 mt-4 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                        <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Description
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-300 leading-6">
                            {job.description}
                        </Text>
                    </View>

                    {/* Details */}
                    <View className="bg-white dark:bg-gray-800 mx-4 mt-4 rounded-2xl px-4 border border-gray-100 dark:border-gray-700">
                        <InfoRow
                            icon={<MapPin size={16} color={iconColor} />}
                            label="Location"
                            value={job.location}
                        />
                        <InfoRow
                            icon={<MapPin size={16} color="#4f46e5" />}
                            label="Distance"
                            value={`${job.distance.toFixed(1)} km from you`}
                            valueColor="text-indigo-600 dark:text-indigo-400"
                        />
                        <InfoRow
                            icon={<User size={16} color={iconColor} />}
                            label="Posted by"
                            value={job.clientName}
                        />
                        <InfoRow
                            icon={<Clock size={16} color={iconColor} />}
                            label="Posted"
                            value={timeAgo(job.createdAt)}
                        />
                        <InfoRow
                            icon={<Tag size={16} color={iconColor} />}
                            label="Category"
                            value={job.category}
                        />
                        <InfoRow
                            icon={<Phone size={16} color={iconColor} />}
                            label="Contact"
                            value={job.phone}
                        />
                    </View>

                    {/* Applied confirmation */}
                    {isApplied && (
                        <View className="mx-4 mt-4 flex-row items-center bg-green-50 dark:bg-green-900/20 rounded-2xl px-4 py-3 border border-green-100 dark:border-green-800">
                            <CheckCircle2 size={18} color="#22c55e" />
                            <Text className="text-sm font-semibold text-green-700 dark:text-green-300 ml-2">
                                You have already applied to this job
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Bottom action bar */}
                <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4">
                    <View className="flex-row gap-2">
                        {/* Call */}
                        <TouchableOpacity
                            onPress={handleCall}
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-center bg-blue-50 dark:bg-blue-900/20 py-4 rounded-2xl border border-blue-200 dark:border-blue-700"
                        >
                            <Phone size={16} color="#1d4ed8" />
                            <Text className="text-sm font-semibold text-blue-700 dark:text-blue-300 ml-2">
                                Call
                            </Text>
                        </TouchableOpacity>

                        {/* SMS */}
                        <TouchableOpacity
                            onPress={handleSms}
                            activeOpacity={0.8}
                            className="flex-1 flex-row items-center justify-center bg-green-50 dark:bg-green-900/20 py-4 rounded-2xl border border-green-200 dark:border-green-700"
                        >
                            <MessageCircle size={16} color="#16a34a" />
                            <Text className="text-sm font-semibold text-green-700 dark:text-green-300 ml-2">
                                SMS
                            </Text>
                        </TouchableOpacity>

                        {/* Apply */}
                        <TouchableOpacity
                            onPress={handleApply}
                            disabled={isApplied || applying}
                            activeOpacity={0.8}
                            className={`flex-[1.5] flex-row items-center justify-center py-4 rounded-2xl ${
                                isApplied
                                    ? 'bg-gray-200 dark:bg-gray-700'
                                    : 'bg-indigo-600'
                            }`}
                        >
                            {applying ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <CheckCircle2
                                        size={16}
                                        color={isApplied ? '#9ca3af' : '#fff'}
                                    />
                                    <Text
                                        className={`text-sm font-semibold ml-2 ${
                                            isApplied
                                                ? 'text-gray-400 dark:text-gray-500'
                                                : 'text-white'
                                        }`}
                                    >
                                        {isApplied ? 'Applied' : 'Apply Now'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </StoreWrapper>
    );
}
