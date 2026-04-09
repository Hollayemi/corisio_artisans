import { useStoreData } from "@/hooks/useData";
import { View } from "react-native";
import ArtisansSpecializations from "./artisans";

export default function BusinessAsset() {
    const { storeInfo } = useStoreData();


    return (
        <View className="flex flex-1">
            <ArtisansSpecializations />
        </View>
    )
}