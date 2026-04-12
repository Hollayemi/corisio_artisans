import { SafeAreaView, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ModalTitle } from "./components";
import BookingCalendar from "../calendar";
import { ThemedPressable } from "../ThemedPressable";

export default function BookService({
    setShowing,
}: {
    setShowing: (name: string) => void;
}) {
    const workingHours = [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
    ];
    const bookedSlots = {
        "2023-10-15": ["10:00", "14:00"], // Example booked slots for a specific date
    };
    const serviceDuration = 25; // 1 hour 45 minutes in minutes

    return (
        <ThemedView className="rounded-t-[40px] h-[700px] pb-10">
            <ModalTitle title="Book Service" close={() => setShowing("")} />
            <SafeAreaView className="flex-1">
            <BookingCalendar
                workingHours={workingHours}
                bookedSlots={bookedSlots}
                serviceDuration={serviceDuration}
            />
            <ThemedPressable
                onPress={() => {}}
                label="Select"
                className="h-16 rounded-full text-center !text-4xl mx-5"
            />
            </SafeAreaView>
        </ThemedView>
    );
}
