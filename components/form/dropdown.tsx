import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
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
};

export default function DropdownSelection({
    options,
    selectedValue,
    placeholder,
    label,
    onSelect,
}: dropDrownProp) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [selectedValue]);

    return (
        <View className="!px-4 w-full mt-5">
            <ThemedText className="!text-gray-700 dark:!text-gray-400 !mb-2 !text-xl">
                {label}
            </ThemedText>
            <TouchableOpacity
                className="flex-row justify-between items-center w-full h-14 border !border-gray-300 dark:!border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 pr-10 !rounded-xl"
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <ThemedText className="text-gray-500 text-2xl">
                    {selectedValue || placeholder}
                </ThemedText>
                <Ionicons name="chevron-down" size={20} color="#a1a1aa" />
            </TouchableOpacity>
            {isDropdownOpen && (
                <Picker selectedValue={selectedValue} className="!z-50" onValueChange={onSelect}>
                    {options.map((option: any, index: any) => (
                        <Picker.Item
                            key={index}
                            label={option}
                            value={option}
                        />
                    ))}
                </Picker>
            )}
        </View>
    );
}

const AddressSelection = () => {
    const [selected, setSelected] = useState("office");
    const [selectedState, setSelectedState] = useState("");

    return (
        <View className="p-4 space-y-3">
            <DropdownSelection
                options={statesInNigeria}
                selectedValue={selectedState}
                onSelect={setSelectedState}
            />
        </View>
    );
};
