// redux/business/slices/jobsSlice.ts
// Jobs / Requests feature — RTK Query + local applied-jobs state

import { createApi } from '@reduxjs/toolkit/query/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { axiosBaseQuery } from './api/axiosBaseQuery';

// ─── Types ────────────────────────────────────────────────────────────────────

export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type JobUrgency = 'normal' | 'urgent';

export interface Job {
    id: string;
    title: string;
    description: string;
    category: string;
    categoryIcon?: string;
    location: string;
    distance: number;           // km — mock for now
    budget?: number;            // optional
    currency: string;
    urgency: JobUrgency;
    status: JobStatus;
    phone: string;
    clientName: string;
    createdAt: string;          // ISO timestamp
}

export interface AppliedJob {
    job: Job;
    appliedAt: string;          // ISO timestamp
    applicationStatus: 'pending' | 'viewed' | 'accepted' | 'rejected';
}

interface ApiResponse<T> {
    success: boolean;
    type: 'success' | 'error';
    message: string;
    data: T;
}

// ─── Mock data (swap for real endpoint later) ─────────────────────────────────

export const MOCK_JOBS: Job[] = [
    {
        id: '1',
        title: 'Fix leaking pipe in kitchen',
        description:
            'My kitchen sink pipe has been leaking for two days. Water drips under the cabinet whenever the tap is on. Need an experienced plumber to check and fix — possibly replace the P-trap.',
        category: 'Plumbing',
        categoryIcon: '🔧',
        location: 'Surulere, Lagos',
        distance: 2.3,
        budget: 15000,
        currency: 'NGN',
        urgency: 'urgent',
        status: 'open',
        phone: '+2348012345678',
        clientName: 'Amaka J.',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        title: 'Paint 3-bedroom flat interior',
        description:
            'Looking for a skilled painter to repaint the interior of a 3-bedroom flat. Walls are currently magnolia. I want a fresh clean white throughout, with a feature wall in the sitting room.',
        category: 'Painting',
        categoryIcon: '🖌️',
        location: 'Ikeja, Lagos',
        distance: 5.1,
        budget: 80000,
        currency: 'NGN',
        urgency: 'normal',
        status: 'open',
        phone: '+2348087654321',
        clientName: 'Tunde A.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '3',
        title: 'Install ceiling fan in bedroom',
        description:
            'New ceiling fan needs to be installed in the master bedroom. There is already a wiring point on the ceiling. I have the fan already. Just need installation.',
        category: 'Electricals',
        categoryIcon: '⚡',
        location: 'Yaba, Lagos',
        distance: 1.8,
        budget: 5000,
        currency: 'NGN',
        urgency: 'normal',
        status: 'open',
        phone: '+2349031234567',
        clientName: 'Chidi O.',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
        id: '4',
        title: 'Repair cracked wall tiles in bathroom',
        description:
            'Three wall tiles in my bathroom are cracked and two have come off the wall completely. I need a tiler to replace them. I have spare tiles from the original batch.',
        category: 'Tiling',
        categoryIcon: '🏗️',
        location: 'Lekki Phase 1, Lagos',
        distance: 8.6,
        budget: 25000,
        currency: 'NGN',
        urgency: 'normal',
        status: 'open',
        phone: '+2348123456789',
        clientName: 'Ngozi B.',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '5',
        title: 'AC unit not cooling — urgent service needed',
        description:
            'My Hisense 1.5HP split AC stopped cooling yesterday. The unit powers on and the compressor starts but no cold air comes out. Possibly needs gas refill or coil cleaning.',
        category: 'AC Repair',
        categoryIcon: '❄️',
        location: 'Victoria Island, Lagos',
        distance: 12.4,
        budget: 20000,
        currency: 'NGN',
        urgency: 'urgent',
        status: 'open',
        phone: '+2347011223344',
        clientName: 'Emeka K.',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
        id: '6',
        title: 'Build wooden wardrobe — custom size',
        description:
            'I need a carpenter to build a floor-to-ceiling wardrobe with sliding doors in my bedroom. The space is 3m wide and 2.7m high. Melamine finish preferred.',
        category: 'Carpentry',
        categoryIcon: '🪵',
        location: 'Gbagada, Lagos',
        distance: 4.2,
        budget: 150000,
        currency: 'NGN',
        urgency: 'normal',
        status: 'open',
        phone: '+2348099887766',
        clientName: 'Fatima S.',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '7',
        title: 'Deep clean 4-bedroom house before move-in',
        description:
            'Just signed a lease on a new house and it needs a thorough deep clean before we move in. Includes kitchen degreasing, bathroom scrubbing, all windows, and floor mopping.',
        category: 'Cleaning',
        categoryIcon: '🧹',
        location: 'Magodo, Lagos',
        distance: 9.0,
        budget: 35000,
        currency: 'NGN',
        urgency: 'normal',
        status: 'open',
        phone: '+2348177665544',
        clientName: 'Blessing T.',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
];

// ─── RTK Query API ─────────────────────────────────────────────────────────────
// All endpoints return mock data for MVP.
// Replace query bodies with real API calls when backend is ready.

export const jobsApi = createApi({
    reducerPath: 'jobsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Jobs', 'MyApplications'],
    endpoints: (builder) => ({

        // GET /jobs — fetch nearby/available jobs
        // MVP: returns mock data; real implementation would send user coords as params
        getAvailableJobs: builder.query<ApiResponse<Job[]>, {
            category?: string;
            radius?: number;     // km
            lat?: number;
            lng?: number;
        } | void>({
            // TODO: replace with real endpoint
            // query: (params) => ({ url: '/artisan/jobs', method: 'GET', params }),
            queryFn: async (params) => {
                await new Promise((r) => setTimeout(r, 600)); // simulate network
                let jobs = [...MOCK_JOBS];
                if (params && (params as any).category) {
                    jobs = jobs.filter(
                        (j) => j.category === (params as any).category
                    );
                }
                return {
                    data: {
                        success: true,
                        type: 'success' as const,
                        message: 'Jobs fetched',
                        data: jobs,
                    },
                };
            },
            providesTags: ['Jobs'],
        }),

        // GET /jobs/:id — single job detail
        getJobById: builder.query<ApiResponse<Job>, string>({
            queryFn: async (id) => {
                await new Promise((r) => setTimeout(r, 300));
                const job = MOCK_JOBS.find((j) => j.id === id);
                if (!job) {
                    return {
                        error: {
                            status: 404,
                            data: { message: 'Job not found' },
                            errorType: 'UNKNOWN_ERROR' as any,
                        },
                    };
                }
                return {
                    data: {
                        success: true,
                        type: 'success' as const,
                        message: 'Job fetched',
                        data: job,
                    },
                };
            },
            providesTags: (_res, _err, id) => [{ type: 'Jobs', id }],
        }),

        // POST /jobs/:id/apply — apply to a job
        applyToJob: builder.mutation<ApiResponse<{ applicationId: string }>, string>({
            queryFn: async (jobId) => {
                await new Promise((r) => setTimeout(r, 400));
                return {
                    data: {
                        success: true,
                        type: 'success' as const,
                        message: 'Application sent successfully',
                        data: { applicationId: `app_${jobId}_${Date.now()}` },
                    },
                };
            },
            invalidatesTags: ['MyApplications'],
        }),

        // GET /jobs/my-applications — jobs the artisan has applied to
        getMyApplications: builder.query<ApiResponse<AppliedJob[]>, void>({
            queryFn: async () => {
                await new Promise((r) => setTimeout(r, 400));
                return {
                    data: {
                        success: true,
                        type: 'success' as const,
                        message: 'Applications fetched',
                        data: [],
                    },
                };
            },
            providesTags: ['MyApplications'],
        }),
    }),
});

// ─── Applied-jobs local slice ─────────────────────────────────────────────────
// Persists applied jobs in Redux while the backend is not yet wired up.

interface AppliedJobsState {
    appliedJobs: AppliedJob[];
}

const appliedJobsSlice = createSlice({
    name: 'appliedJobs',
    initialState: { appliedJobs: [] } as AppliedJobsState,
    reducers: {
        addAppliedJob: (state, action: PayloadAction<Job>) => {
            const alreadyApplied = state.appliedJobs.some(
                (aj) => aj.job.id === action.payload.id
            );
            if (!alreadyApplied) {
                state.appliedJobs.unshift({
                    job: action.payload,
                    appliedAt: new Date().toISOString(),
                    applicationStatus: 'pending',
                });
            }
        },
        removeAppliedJob: (state, action: PayloadAction<string>) => {
            state.appliedJobs = state.appliedJobs.filter(
                (aj) => aj.job.id !== action.payload
            );
        },
        updateApplicationStatus: (
            state,
            action: PayloadAction<{
                jobId: string;
                status: AppliedJob['applicationStatus'];
            }>
        ) => {
            const entry = state.appliedJobs.find(
                (aj) => aj.job.id === action.payload.jobId
            );
            if (entry) entry.applicationStatus = action.payload.status;
        },
    },
});

export const { addAppliedJob, removeAppliedJob, updateApplicationStatus } =
    appliedJobsSlice.actions;

export const appliedJobsReducer = appliedJobsSlice.reducer;

// ─── Exported hooks ───────────────────────────────────────────────────────────

export const {
    useGetAvailableJobsQuery,
    useGetJobByIdQuery,
    useApplyToJobMutation,
    useGetMyApplicationsQuery,
} = jobsApi;

// ─── Selector helpers ─────────────────────────────────────────────────────────

export const selectAppliedJobs = (state: { appliedJobs: AppliedJobsState }) =>
    state.appliedJobs.appliedJobs;

export const selectIsApplied =
    (jobId: string) =>
    (state: { appliedJobs: AppliedJobsState }) =>
        state.appliedJobs.appliedJobs.some((aj) => aj.job.id === jobId);
