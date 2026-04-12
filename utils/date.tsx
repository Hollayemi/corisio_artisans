// Helper function to convert 24-hour time to 12-hour format
export const convertTo12HourFormat = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
};
