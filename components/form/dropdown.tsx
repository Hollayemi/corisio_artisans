import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";

export const statesInNigeria = [
    "Lagos",
    "Abuja",
    "Kano",
    "Ogun",
    "Rivers",
    "Kaduna",
    "Enugu",
    "Anambra",
    "Oyo",
    "Edo",
];

export type dropDrownProp = {
    options: any;
    label?: string;
    placeholder?: string;
    selectedValue: string;
    onSelect: (e: any) => void;
    error?: string;
    touched?: boolean;
};

export default function DropdownSelection({
    options,
    selectedValue,
    placeholder,
    label,
    onSelect,
    error,
    touched,
}: dropDrownProp) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsDropdownOpen(false);
    };

    return (
        <View className="w-full mt-5">
            {label && (
                <ThemedText className="text-gray-700 dark:text-gray-400 mb-2 text-base font-medium">
                    {label}
                </ThemedText>
            )}
            
            <TouchableOpacity
                className={`flex-row justify-between items-center w-full h-14 border bg-gray-50 dark:bg-gray-800 px-4 rounded-xl
                    ${error && touched 
                        ? "border-red-400 dark:border-red-500" 
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                onPress={() => setIsDropdownOpen(true)}
            >
                <Text className={`text-base ${selectedValue 
                    ? "text-gray-900 dark:text-white" 
                    : "text-gray-400 dark:text-gray-500"
                }`}>
                    {selectedValue || placeholder || "Select an option"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            {error && touched && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
            )}

            <Modal
                visible={isDropdownOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDropdownOpen(false)}
            >
                <TouchableOpacity 
                    className="flex-1 bg-black/50 justify-end"
                    activeOpacity={1}
                    onPress={() => setIsDropdownOpen(false)}
                >
                    <View className="bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden">
                        {/* Header */}
                        <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                                {label || "Select Option"}
                            </Text>
                            <TouchableOpacity onPress={() => setIsDropdownOpen(false)}>
                                <Ionicons name="close" size={24} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                        
                        {/* Options */}
                        <FlatList
                            data={options}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            className="max-h-96"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className={`px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center
                                        ${selectedValue === item ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                                    `}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text className={`text-base ${
                                        selectedValue === item 
                                            ? "text-[#2A347E] dark:text-[#FDB415] font-semibold" 
                                            : "text-gray-700 dark:text-gray-300"
                                    }`}>
                                        {item}
                                    </Text>
                                    {selectedValue === item && (
                                        <Ionicons name="checkmark" size={20} color="#2A347E" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                        
                        {/* Cancel Button */}
                        <TouchableOpacity 
                            className="p-4 border-t border-gray-200 dark:border-gray-800"
                            onPress={() => setIsDropdownOpen(false)}
                        >
                            <Text className="text-center text-[#2A347E] dark:text-[#FDB415] font-semibold text-base">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

// Example usage component
const AddressSelection = () => {
    const [selectedState, setSelectedState] = useState("");
    const [stateError, setStateError] = useState("");
    const [stateTouched, setStateTouched] = useState(false);

    const validateState = (value: string) => {
        if (!value) return "State is required";
        return "";
    };

    const handleStateSelect = (value: string) => {
        setSelectedState(value);
        setStateError(validateState(value));
        setStateTouched(true);
    };

    const handleStateBlur = () => {
        setStateTouched(true);
        setStateError(validateState(selectedState));
    };

    return (
        <View className="p-4 space-y-3">
            <DropdownSelection
                options={statesInNigeria}
                selectedValue={selectedState}
                onSelect={handleStateSelect}
                label="Select State"
                placeholder="Choose your state"
                error={stateError}
                touched={stateTouched}
            />
            
            {/* You can add onBlur by wrapping the component */}
            <TouchableOpacity 
                onPress={handleStateBlur}
                className="absolute w-0 h-0"
            />
        </View>
    );
};