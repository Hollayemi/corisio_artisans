// app/business/home/jobs/JobsScreen.tsx
import NoRecord from '@/components/noRecord';
import StoreWrapper from '@/components/wrapper/business';
import {
    AppliedJob,
    Job,
    addAppliedJob,
    selectAppliedJobs,
    selectIsApplied,
    useApplyToJobMutation,
    useGetAvailableJobsQuery,
} from '@/redux/business/slices/jobsSlice';
import toaster from '@/config/toaster';
import { Search, Filter, Briefcase, Phone, Mail, CheckCircle, Clock, Eye, XCircle } from 'lucide-react-native';
import React, { useCallback, useMemo, useState, useRef } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Linking,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
    ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import JobCard from './JobCard';

// ─── Category filter chips (horizontal scroll) ─────────────────────────────────

const CATEGORIES = [
    'All',
    'Plumbing',
    'Electricals',
    'Painting',
    'Tiling',
    'Carpentry',
    'Cleaning',
    'AC Repair',
    'HVAC',
    'Landscaping',
    'Roofing',
    'Flooring',
];

const CategoryChip = ({
    label,
    active,
    onPress,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
}) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={`px-4 py-2 rounded-full mr-2 ${
            active
                ? 'bg-[#2A347E] shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800'
        }`}
    >
        <Text
            className={`text-[13px] font-medium ${
                active 
                    ? 'text-white' 
                    : 'text-gray-700 dark:text-gray-300'
            }`}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

// ─── Applied job row (My Jobs tab) ────────────────────────────────────────────

const ApplicationStatusBadge = ({
    status,
}: {
    status: AppliedJob['applicationStatus'];
}) => {
    const config = {
        pending:  { 
            label: 'Pending',  
            icon: Clock,
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            text: 'text-yellow-700 dark:text-yellow-400'
        },
        viewed:   { 
            label: 'Viewed',   
            icon: Eye,
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-700 dark:text-blue-400'
        },
        accepted: { 
            label: 'Accepted', 
            icon: CheckCircle,
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-700 dark:text-green-400'
        },
        rejected: { 
            label: 'Rejected', 
            icon: XCircle,
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-600 dark:text-red-400'
        },
    }[status];
    
    const Icon = config.icon;
    
    return (
        <View className={`flex-row items-center px-3 py-1.5 rounded-full ${config.bg}`}>
            <Icon size={14} color={config.text.includes('text-') ? undefined : config.text} />
            <Text className={`text-xs font-semibold ml-1.5 ${config.text}`}>
                {config.label}
            </Text>
        </View>
    );
};

// ─── Main screen ──────────────────────────────────────────────────────────────

type TabKey = 'available' | 'mine';

export default function JobsScreen() {
    const isDark = useColorScheme() === 'dark';
    const dispatch = useDispatch();
    const appliedJobs = useSelector(selectAppliedJobs);
    const scrollViewRef = useRef<ScrollView>(null);

    const [activeTab, setActiveTab] = useState<TabKey>('available');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const {
        data,
        isLoading,
        refetch,
    } = useGetAvailableJobsQuery();

    const [applyToJob, { isLoading: applying }] = useApplyToJobMutation();

    const allJobs: Job[] = data?.data ?? [];

    const filteredJobs = useMemo(() => {
        let result = allJobs;
        if (selectedCategory !== 'All') {
            result = result.filter((j) => j.category === selectedCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (j) =>
                    j.title.toLowerCase().includes(q) ||
                    j.category.toLowerCase().includes(q) ||
                    j.location.toLowerCase().includes(q)
            );
        }
        return result;
    }, [allJobs, selectedCategory, searchQuery]);

    const handleCall = useCallback((phone: string) => {
        Linking.openURL(`tel:${phone}`).catch(() =>
            toaster({ type: 'error', message: 'Cannot open phone app' })
        );
    }, []);

    const handleSms = useCallback((phone: string) => {
        const body = encodeURIComponent(
            'Hi, I saw your job request on Coristen and I am available to help. Please let me know if you are still looking.'
        );
        Linking.openURL(`sms:${phone}?body=${body}`).catch(() =>
            toaster({ type: 'error', message: 'Cannot open SMS app' })
        );
    }, []);

    const handleApply = useCallback(
        async (job: Job) => {
            const alreadyApplied = appliedJobs.some((aj) => aj.job.id === job.id);
            if (alreadyApplied) {
                toaster({ type: 'error', message: 'Already applied to this job' });
                return;
            }
            try {
                await applyToJob(job.id).unwrap();
                dispatch(addAppliedJob(job));
                toaster({ type: 'success', message: 'Application sent!' });
            } catch {
                toaster({ type: 'error', message: 'Failed to apply. Try again.' });
            }
        },
        [appliedJobs, applyToJob, dispatch]
    );

    // ── Render helpers ────────────────────────────────────────────────────────

    const renderAvailableJob = useCallback(
        ({ item }: { item: Job }) => {
            const isApplied = appliedJobs.some((aj) => aj.job.id === item.id);
            return (
                <JobCard
                    job={item}
                    isApplied={isApplied}
                    showActions={!isApplied}
                    onCall={handleCall}
                    onSms={handleSms}
                    onApply={handleApply}
                />
            );
        },
        [appliedJobs, handleCall, handleSms, handleApply]
    );

    const renderAppliedJob = useCallback(
        ({ item }: { item: AppliedJob }) => (
            <JobCard job={item.job} isApplied />
        ),
        []
    );

    // ── Tab bar ───────────────────────────────────────────────────────────────

    const TabBar = () => (
        <View className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <View className="flex-row px-6 pt-3">
                {(
                    [
                        { key: 'available', label: 'Available', icon: Briefcase },
                        { key: 'mine', label: 'My Jobs', icon: CheckCircle },
                    ] as { key: TabKey; label: string; icon: any }[]
                ).map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    const count = tab.key === 'available' ? allJobs.length : appliedJobs.length;
                    
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => setActiveTab(tab.key)}
                            activeOpacity={0.7}
                            className={`flex-row items-center mr-6 pb-3 ${
                                isActive ? 'border-b-2 border-[#2A347E]' : ''
                            }`}
                        >
                            <Icon 
                                size={18} 
                                color={isActive ? '#2563eb' : (isDark ? '#9ca3af' : '#6b7280')} 
                            />
                            <Text
                                className={`ml-2 text-[15px] font-semibold ${
                                    isActive
                                        ? 'text-[#2A347E] dark:text-blue-400'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                {tab.label}
                            </Text>
                            {count > 0 && (
                                <View className={`ml-2 px-2 py-0.5 rounded-full ${
                                    isActive 
                                        ? 'bg-blue-100 dark:bg-blue-900/30' 
                                        : 'bg-gray-100 dark:bg-gray-800'
                                }`}>
                                    <Text className={`text-xs font-semibold ${
                                        isActive
                                            ? 'text-blue-700 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                        {count}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    // ── Header (search + filter) ──────────────────────────────────────────────

    const ListHeader = () => (
        <View className="pt-4 pb-2">
            {/* Search bar with filter button */}
            {activeTab === 'available' && (
                <>
                    <View className="flex-row items-center gap-3 px-4 mb-4">
                        <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-3">
                            <Search size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search jobs..."
                                placeholderTextColor="#9ca3af"
                                className="flex-1 ml-2.5 text-sm text-gray-800 dark:text-gray-100"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowFilters(!showFilters)}
                            className={`p-3 rounded-xl ${
                                showFilters 
                                    ? 'bg-[#2A347E]' 
                                    : 'bg-gray-100 dark:bg-gray-800'
                            }`}
                        >
                            <Filter 
                                size={18} 
                                color={showFilters ? '#fff' : (isDark ? '#9ca3af' : '#6b7280')} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Category chips - HORIZONTAL SCROLL */}
                    {showFilters && (
                        <View className="mb-3">
                            <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 mb-2">
                                CATEGORIES
                            </Text>
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                                className="mb-2"
                            >
                                {CATEGORIES.map((cat) => (
                                    <CategoryChip
                                        key={cat}
                                        label={cat}
                                        active={selectedCategory === cat}
                                        onPress={() => setSelectedCategory(cat)}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Result count */}
                    {!showFilters && (
                        <Text className="text-xs text-gray-500 dark:text-gray-400 px-4 mb-2">
                            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
                        </Text>
                    )}
                </>
            )}
        </View>
    );

    // ── Empty states ──────────────────────────────────────────────────────────

    const EmptyAvailable = () => (
        <View className="items-center py-20 px-8">
            <View className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-4">
                <Briefcase size={40} color={isDark ? '#6b7280' : '#9ca3af'} />
            </View>
            <Text className="text-gray-700 dark:text-gray-300 text-center text-lg font-semibold">
                No jobs found
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-center text-sm mt-2">
                {selectedCategory !== 'All'
                    ? `No ${selectedCategory} jobs available right now.`
                    : 'Check back soon for new requests in your area.'}
            </Text>
        </View>
    );

    const EmptyMine = () => (
        <View className="items-center py-20 px-8">
            <View className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-4">
                <Briefcase size={40} color={isDark ? '#6b7280' : '#9ca3af'} />
            </View>
            <Text className="text-gray-700 dark:text-gray-300 text-center text-lg font-semibold">
                No applications yet
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-center text-sm mt-2">
                Browse available jobs and apply to get started.
            </Text>
            <TouchableOpacity
                onPress={() => setActiveTab('available')}
                className="mt-6 bg-[#2A347E] px-6 py-3 rounded-xl shadow-sm"
            >
                <Text className="text-white font-semibold text-sm">
                    Browse Jobs
                </Text>
            </TouchableOpacity>
        </View>
    );

    // ── Main render ───────────────────────────────────────────────────────────

    return (
        <StoreWrapper headerTitle="Jobs & Requests" hasFooter={false}>
            <View className="flex-1 bg-gray-50 dark:bg-gray-900">
                <TabBar />

                {activeTab === 'available' ? (
                    isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color="#2563eb" />
                        </View>
                    ) : (
                        <FlatList
                            data={filteredJobs}
                            keyExtractor={(item) => item.id}
                            renderItem={renderAvailableJob}
                            ListHeaderComponent={<ListHeader />}
                            ListEmptyComponent={<EmptyAvailable />}
                            contentContainerStyle={{ paddingBottom: 120 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isLoading}
                                    onRefresh={refetch}
                                    colors={['#2563eb']}
                                    tintColor="#2563eb"
                                />
                            }
                            showsVerticalScrollIndicator={false}
                        />
                    )
                ) : (
                    <FlatList
                        data={appliedJobs}
                        keyExtractor={(item) => item.job.id}
                        renderItem={renderAppliedJob}
                        ListHeaderComponent={
                            appliedJobs.length > 0 ? (
                                <View className="pt-4 pb-2 px-4">
                                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                                        {appliedJobs.length} active application
                                        {appliedJobs.length !== 1 ? 's' : ''}
                                    </Text>
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={<EmptyMine />}
                        contentContainerStyle={{ paddingBottom: 120 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </StoreWrapper>
    );
}