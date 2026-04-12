import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import { ThemedPressable } from "../ThemedPressable";
import DropdownSelection from "../form/dropdown";
import { convertTo12HourFormat } from "@/utils/date";

// Configure locale for the calendar
LocaleConfig.locales["en"] = {
    monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
    dayNames: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
LocaleConfig.defaultLocale = "en";

// Define types
type BookedSlots = {
    [date: string]: string[]; // Key: date string, Value: array of booked times
};

type BookingCalendarProps = {
    workingHours: string[];
    bookedSlots: BookedSlots;
    serviceDuration: number; // Duration in minutes
};

const BookingCalendar: React.FC<BookingCalendarProps> = ({
    workingHours,
    bookedSlots,
    serviceDuration,
}) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState<string>("");

    // Handle date selection
    const handleDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
        setSelectedTimeRange(""); // Reset selected time range when a new date is selected
    };

    // Generate time ranges based on working hours and service duration
    const generateTimeRanges = (): string[] => {
        if (!selectedDate) return [];

        const timeRanges: string[] = [];
        const [startWorkingHour, endWorkingHour] = ["08:00", "16:00"]; // Working hours
        const serviceDurationMinutes = serviceDuration; // Service duration in minutes

        let currentTime = startWorkingHour;

        while (currentTime <= endWorkingHour) {
            const endTime = addMinutes(currentTime, serviceDurationMinutes);

            // Check if the end time exceeds the working hours
            if (endTime <= endWorkingHour) {
                const startTime12Hr = convertTo12HourFormat(currentTime);
                const endTime12Hr = convertTo12HourFormat(endTime);
                timeRanges.push(`${startTime12Hr} - ${endTime12Hr}`);
            }

            // Move to the next time slot
            currentTime = endTime;
        }

        return timeRanges;
    };

    // Helper function to add minutes to a time string
    const addMinutes = (time: string, minutes: number): string => {
        const [hour, minute] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hour, minute + minutes, 0, 0);
        return `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
    };

    // Check if a time range is booked
    const isTimeRangeBooked = (timeRange: string): boolean => {
        const [startTime] = timeRange.split(" - ");
        return bookedSlots[selectedDate!]?.includes(startTime) || false;
    };

    return (
        <View className="flex-1 p-4 bg-transparent">
            {/* Calendar Component */}
            <Calendar
                onDayPress={handleDayPress}
                markedDates={{
                    [selectedDate!]: {
                        selected: true,
                        selectedColor: "#3B82F6",
                    },
                }}
                theme={{
                    selectedDayBackgroundColor: "#3B82F6",
                    todayTextColor: "#3B82F6",
                    arrowColor: "#3B82F6",
                    calendarBackground: "transparent", // Make calendar background transparent
                }}
            />

            {/* Display Time Range Picker for Selected Date */}
            {selectedDate && (
                <View className="mt-0">
                    {/* <Text className="text-lg font-bold mb-4">
                        Select Time Range for {selectedDate}
                    </Text> */}
                    <DropdownSelection
                        options={generateTimeRanges()}
                        label="Select Time"
                        selectedValue={selectedTimeRange}
                        placeholder="Select the time you want to book"
                        onSelect={(itemValue) =>
                            setSelectedTimeRange(itemValue)
                        }
                    />
                    {/* <Picker
                        selectedValue={selectedTimeRange}
                        onValueChange={(itemValue) =>
                            setSelectedTimeRange(itemValue)
                        }
                        style={{ borderRadius: 8 }}
                    >
                        <Picker.Item label="Select a time range" value={""} />
                        {generateTimeRanges().map((timeRange, index) => (
                            <Picker.Item
                                key={index}
                                label={timeRange}
                                value={timeRange}
                                enabled={!isTimeRangeBooked(timeRange)}
                            />
                        ))}
                    </Picker> */}
                    {/* <ThemedPressable
                        onPress={() => {}}
                        label="Select"
                        className="h-16 rounded-full text-center !text-4xl mt-16 mx-5"
                    /> */}
                </View>
            )}
        </View>
    );
};

export default BookingCalendar;
