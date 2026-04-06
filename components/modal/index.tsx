import React, { ReactNode, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    View
} from 'react-native';

interface ModalProp {
    onClose: () => void;
    children: ReactNode;
    visible: boolean;
}

export default function ModalComponent({ visible, onClose, children }: ModalProp) {
    const slideAnim = useRef(new Animated.Value(1000)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    // Capture height dynamically, not at module load
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        if (visible) {
            slideAnim.setValue(screenHeight);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: screenHeight,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent // Fixes Android overlay not covering status bar
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                {/* Backdrop as a sibling, not a wrapper */}
                <Animated.View
                    style={{ opacity: backdropAnim,  }}
                    className="bg-black/50"
                    pointerEvents="none" // Let touches pass through to the Pressable below
                />

                {/* Full-screen pressable just for backdrop dismiss */}
                <Pressable style={{ flex: 1 }} onPress={onClose}>
                    {/* Stop propagation — sheet press won't close modal */}
                    <Pressable
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
                        onPress={() => {}}  
                    >
                        <Animated.View
                            style={{ transform: [{ translateY: slideAnim }] }}
                            className="bg-white dark:bg-gray-800 rounded-t-3xl px-6 py-6"
                        >
                            <View className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full self-center mb-6" />
                            {children}
                            <View style={{ height: 10 }} />
                        </Animated.View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}