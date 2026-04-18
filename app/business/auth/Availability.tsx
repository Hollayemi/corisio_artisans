import Button from "@/components/form/Button";
import { DaySelector, TimePicker } from "@/components/form/storeTextInputs";
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { PageHeader } from "./component";
import Availability from "../home/profile/business/availability/main";

// Screen 2: Service Availability
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export default function AvailabilityAuthPage() {
    const [selectedDays, setSelectedDays] = useState<Day[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    const [openingTimes, setOpeningTimes] = useState<Record<Day, string>>({
        Monday: '08:00',
        Tuesday: '08:00',
        Wednesday: '08:00',
        Thursday: '08:00',
        Friday: '10:00',
        Saturday: '08:00',
        Sunday: '08:00'
    });
    const [closingTimes, setClosingTimes] = useState<Record<Day, string>>({
        Monday: '20:00',
        Tuesday: '20:00',
        Wednesday: '20:00',
        Thursday: '20:00',
        Friday: '20:00',
        Saturday: '20:00',
        Sunday: '20:00'
    });

    const days: Day[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdays: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const handleToggleDay = (day: any) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const handleNext = () => {
        router.push('/business/home')
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <ProgressHeader
                currentStep={2}
            />

            <Availability />

            <View className="px-6 pb-6 pt-4">
                <Button title="Dashboard" onPress={handleNext} />
            </View>
        </SafeAreaView>
    );
};