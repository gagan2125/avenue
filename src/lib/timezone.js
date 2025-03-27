// utils/timezones.js or inline
export const getFormattedTimezones = () => {
    const timezones = Intl.supportedValuesOf
        ? Intl.supportedValuesOf("timeZone") // only supported in modern browsers
        : [
            "UTC",
            "Asia/Kolkata",
            "America/New_York",
            "Europe/London",
            "Asia/Tokyo",
            "Australia/Sydney",
            // add more fallback options as needed
        ];

    return timezones.map((tz) => {
        const date = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            timeZoneName: "shortOffset",
        });

        // Extract the GMT offset from the formatted string
        const offset = formatter
            .formatToParts(date)
            .find((part) => part.type === "timeZoneName")?.value;

        return {
            label: `${offset} - ${tz.replace(/_/g, " ")}`,
            value: tz,
        };
    });
};
