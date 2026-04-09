import StoreWrapper from "@/components/wrapper/business";
import React from 'react';
import Availability from "./main";

export default function AvailabilityPage() {

    
    return (
        <StoreWrapper headerTitle="Availability" active="profile">
           <Availability />
        </StoreWrapper>
    );
}
