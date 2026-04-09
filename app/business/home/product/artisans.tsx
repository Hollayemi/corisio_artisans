import StoreWrapper from "@/components/wrapper/business";
import { useGetFeaturedCategoriesQuery } from "@/redux/business/slices/growthSlice";
import {
    View
} from "react-native";

export default function ArtisansSpecializations() {
    const { data: cates, isLoading: cateLoading, refetch: refetchCate } =
        useGetFeaturedCategoriesQuery("true");
    const categories = cates ? cates?.data : [];

    console.log({ categories })

    return (
        <StoreWrapper
            headerTitle="Specializations"
            hasFooter={false}
        >
            <View></View>
        </StoreWrapper>
    )
}