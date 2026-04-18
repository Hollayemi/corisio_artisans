import { Route } from "expo-router";


export interface ProfileItem {
    id: number;
    name: string;
    type: "link" | "action";
    to: Route;
    icon?: string;
    parameters?: Record<string, any>;
}

export const accountSettingsItems: ProfileItem[] = [
    { id: 1, name: "Personal Information", type: "link", to: "/business/home/profile/account/details" },
    // { id: 2, name: "Security & Password", type: "link", to: "/business/home/profile/account/password" },
    // { id: 3, name: "Notifications", type: "link", to: "/business/home/profile/account/notifications" },
];


export const businessPerformanceItems: ProfileItem[] = [
    { id: 4, name: "Business Information", type: "link", to: "/business/home/profile/business/details" },
    { id: 5, name: "Business Availability", type: "link", to: "/business/home/profile/business/availability" },
    { id: 6, name: "Store Location", type: "link", to: "/business/auth/map", parameters: { from: "/business/home/profile", type: "redirect" } },
    // { id: 7, name: "Insight & Performance", type: "link", to: "/business/home/profile/business/insights" },
    // { id: 8, name: "Ratings & Reviews", type: "link", to: "/business/home/profile/business/reviews" },
];

export const supportItems: ProfileItem[] = [
    { id: 9, name: "Help & Support", type: "link", to: "/business/home/profile/support/help" },
    { id: 10, name: "Visit Our Website", type: "link", to: "/business/home/profile/support/website" },
];
