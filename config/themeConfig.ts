const themeConfig = (theme: "light" | "dark") => ({
    appName: "CORISIO",
    deductFromHeight:150,
    notification: theme === "light" ? require("@/assets/images/misc/dark-notification.png") : require("@/assets/images/misc/light-notification.png"),
    cart: require("@/assets/images/misc/dark-cart.png"),
});

export default themeConfig;

export const services = {
    service1: require("@/assets/images/more/service1.png"),
    service2: require("@/assets/images/more/service2.png"),
    service3: require("@/assets/images/more/service3.png"),
    service4: require("@/assets/images/more/service4.png"),
    // service5: require("@/assets/images/more/service5.png"),
    // service6: require("@/assets/images/more/service6.png"),
    // service7: require("@/assets/images/more/service7.png"),
    // laundry: require("@/assets/images/more/laundry.png"),
};

export const addon = {
    addon1: require("@/assets/images/more/addon1.png"),
    addon2: require("@/assets/images/more/addon2.png"),
    addon3: require("@/assets/images/more/addon3.png"),
};

export const bev = {
    bev1: require("@/assets/images/more/bev1.png"),
    bev2: require("@/assets/images/more/bev2.png"),
    bev3: require("@/assets/images/more/bev3.png"),
};