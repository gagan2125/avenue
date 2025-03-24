import ReactGA from "react-ga4";

const TRACKING_ID = "G-3Z81X62KP4";

export const initGA = () => {
    if (import.meta.env.PROD) {
        ReactGA.initialize(TRACKING_ID);
    } else {
        console.log("GA initialized in development mode with ID:", TRACKING_ID);
    }
};

export const trackPageView = path => {
    if (import.meta.env.PROD) {
        ReactGA.send({
            hitType: "paveview",
            page: path
        })
    } else {
        console.log("Page view tracked:", path)
    }
}

export const trackEvent = (category, action, label, value) => {
    if (import.meta.env.PROD) {
        ReactGA.event({
            category,
            action,
            label,
            value,
        });
    } else {
        console.log("Event tracked:", {
            category,
            action,
            label,
            value,
        })
    }
}
