// import React, { ReactElement, useState } from "react";
// import { View, Text, Button, StyleSheet } from "react-native";
// import Modal from "react-native-modal";

// export type Prop = {
//     isVisible?: boolean;
//     setShowing?: any;
//     component: ReactElement;
//     swipe?: "up" | "down";
// };

// export default function BottomModal({
//     isVisible,
//     setShowing,
//     component,
//     swipe,
// }: Prop) {
//     return (
//         <View style={styles.container} className="!h-screen">
//             {/* Button to Open Modal */}
//             <Button title="Open Modal" onPress={() => setShowing(true)} />

//             {/* Bottom Modal */}
//             <Modal
//                 isVisible={isVisible}
//                 onBackdropPress={() => setShowing(false)} // Close when tapping outside
//                 swipeDirection={swipe}
//                 onSwipeComplete={() => setShowing(false)}
//                 style={styles.modal}
//             >
//                 {component}
//             </Modal>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { justifyContent: "center", alignItems: "center" },
//     modal: { justifyContent: "flex-end", margin: 0 }, // Bottom positioning
//     modalContent: {
//         backgroundColor: "white",
//         padding: 20,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         alignItems: "center",
//     },
//     title: { fontSize: 18, fontWeight: "bold" },
// });
