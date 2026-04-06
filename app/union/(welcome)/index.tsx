import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface OnboardingSlide {
    id: number;
    title: string;
    subtitle: string;
    bullets: string[];
    buttonLabel: string;
    route: string;
}

const slides: OnboardingSlide[] = [
    {
        id: 1,
        title: "Pay Your Daily Ticket Easily",
        subtitle: "Make payment, get instant proof and avoid payment disputes.",
        bullets: [
            "Pay without cash",
            "Get instant receipt",
            "Avoid payment disputes",
        ],
        buttonLabel: "Verify",
        route: "/union/auth/PhoneEntry",
    },
    {
        id: 2,
        title: "Stay Protected, Stay Registered",
        subtitle: "Register your union membership and enjoy full benefits and protection.",
        bullets: [
            "Access union benefits",
            "Stay protected on the road",
            "Instant membership proof",
        ],
        buttonLabel: "Get Started",
        route: "/union/auth/PhoneEntry",
    },
    {
        id: 3,
        title: "Connect With Your Union",
        subtitle: "Stay connected with your transport union — anytime, anywhere.",
        bullets: [
            "Real-time notifications",
            "Direct union communication",
            "Access all union services",
        ],
        buttonLabel: "Join Now",
        route: "/union/auth/PhoneEntry",
    },
];

export default function UnionOnboarding() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => {
                const next = (prev + 1) % slides.length;
                scrollRef.current?.scrollTo({ x: next * screenWidth, animated: true });
                return next;
            });
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleScroll = (e: any) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
        setCurrentSlide(index);
    };

    const slide = slides[currentSlide];

    return (
        <View className="flex-1 bg-[#f4f6f8]">
            <StatusBar barStyle="dark-content" backgroundColor="#f4f6f8" />

            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                scrollEventThrottle={16}
            >
                {slides.map((s, index) => (
                    <View
                        key={s.id}
                        style={{ width: screenWidth }}
                        className="flex-1 bg-[#f4f6f8]"
                    >
                        {/* Header */}
                        <View className="items-center pt-14 pb-4 px-6">
                            <Text className="text-xl font-bold text-gray-900">
                                Union Connect
                            </Text>
                        </View>

                        {/* Illustration */}
                        <View className="items-center justify-center px-8 mt-4">
                            <View
                                className="rounded-3xl overflow-hidden bg-white items-center justify-center"
                                style={{ width: screenWidth - 48, height: 280 }}
                            >
                                {/* Placeholder illustration using emoji/shapes */}
                                <View className="items-center justify-center">
                                    <View className="flex-row items-end justify-center">
                                        {/* Officer figure */}
                                        <View className="items-center mr-4">
                                            <Text style={{ fontSize: 80 }}>👮</Text>
                                        </View>
                                        {/* Rider figure */}
                                        <View className="items-center">
                                            <Text style={{ fontSize: 72 }}>🏍️</Text>
                                        </View>
                                    </View>
                                    {/* Bus behind */}
                                    <Text style={{ fontSize: 48, marginTop: -10 }}>🚌</Text>
                                </View>
                            </View>
                        </View>

                        {/* Content */}
                        <View className="px-8 mt-8">
                            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                                {s.title}
                            </Text>
                            <Text className="text-gray-500 text-center text-[15px] leading-6 mb-8">
                                {s.subtitle}
                            </Text>

                            {/* Bullets */}
                            <View className="mb-8">
                                {s.bullets.map((bullet, i) => (
                                    <View key={i} className="flex-row items-center mb-3">
                                        <View className="w-5 h-5 rounded-full border-2 border-gray-400 items-center justify-center mr-3">
                                            <View className="w-2 h-2 rounded-full bg-gray-400" />
                                        </View>
                                        <Text className="text-gray-800 font-semibold text-[16px]">
                                            {bullet}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Dots + Button — fixed at bottom */}
            <View className="px-8 pb-12">
                {/* Dots */}
                <View className="flex-row justify-center mb-6">
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            className={`h-2 mx-1 rounded-full ${i === currentSlide ? "w-6 bg-[#2d6a2d]" : "w-2 bg-gray-300"}`}
                        />
                    ))}
                </View>

                {/* Button */}
                <TouchableOpacity
                    onPress={() => router.push(slide.route as any)}
                    activeOpacity={0.85}
                    className="rounded-full py-4 items-center"
                    style={{ backgroundColor: "#2d6a2d" }}
                >
                    <Text className="text-white text-[17px] font-semibold">
                        {slide.buttonLabel}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
