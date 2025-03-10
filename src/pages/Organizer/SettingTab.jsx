import { useEffect, useState } from "react";
import url from "../../constants/url";

export default function SettingTab({ eventId, event }) {
    const [eventVisibility, setEventVisibility] = useState(true);
    const [attendeeVisibility, setAttendeeVisibility] = useState(true);
    const [emailActiveNotification, setEmailActiveNotification] = useState(true);
    const [smsActiveNotification, setSmsActiveNotification] = useState(true);

    const toggleAttendeeVisibility = async () => {
        const newStatus = !attendeeVisibility;
        setAttendeeVisibility(newStatus);

        try {
            const response = await fetch(`${url}/event/visibility-change/${event._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus ? "YES" : "NO" }),
            });

            if (!response.ok) {
                throw new Error("Failed to update visibility");
            }

            console.log("Visibility updated successfully");
        } catch (error) {
            console.error("Error updating attendee visibility:", error);
            setAttendeeVisibility(!newStatus);
        }
    };

    const toggleEventVisibility = async () => {
        const newStatus = !eventVisibility;
        setEventVisibility(newStatus);

        try {
            const response = await fetch(`${url}/event/event-visibility-change/${event._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus ? "YES" : "NO" }),
            });

            if (!response.ok) {
                throw new Error("Failed to update visibility");
            }

            console.log("Event Visibility updated successfully");
        } catch (error) {
            console.error("Error updating attendee visibility:", error);
            setEventVisibility(!newStatus);
        }
    };

    useEffect(() => {
        setAttendeeVisibility(event.show === "YES");
    }, [event.show]);

    useEffect(() => {
        setEventVisibility(event.event_visibility === "YES");
    }, [event.event_visibility]);

    return (
        <div className="flex flex-col gap-8 @container">
            {/* Privacy Section */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
                <h2 className="text-sm font-semibold p-3 border-b border-white/10 bg-white/5 flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8 1C7.07174 1 6.1815 1.36875 5.52513 2.02513C4.86875 2.6815 4.5 3.57174 4.5 4.5V7C4.10218 7 3.72064 7.15804 3.43934 7.43934C3.15804 7.72064 3 8.10218 3 8.5V13.5C3 13.8978 3.15804 14.2794 3.43934 14.5607C3.72064 14.842 4.10218 15 4.5 15H11.5C11.8978 15 12.2794 14.842 12.5607 14.5607C12.842 14.2794 13 13.8978 13 13.5V8.5C13 8.10218 12.842 7.72064 12.5607 7.43934C12.2794 7.15804 11.8978 7 11.5 7V4.5C11.5 3.57174 11.1313 2.6815 10.4749 2.02513C9.8185 1.36875 8.92826 1 8 1ZM10 7V4.5C10 3.96957 9.78929 3.46086 9.41421 3.08579C9.03914 2.71071 8.53043 2.5 8 2.5C7.46957 2.5 6.96086 2.71071 6.58579 3.08579C6.21071 3.46086 6 3.96957 6 4.5V7H10Z"
                            fill="white"
                            fillOpacity="0.5"
                        />
                    </svg>
                    Privacy
                </h2>

                <div className="p-4 flex flex-col gap-8">
                    <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                            <div className="font-medium">Event visibility</div>
                            <div className="text-sm text-white/70">
                                Choose how people can find your event
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 w-fit justify-end">
                            <div className="bg-[#151515] p-1 rounded-full flex items-center gap-2">
                                <button
                                    onClick={toggleEventVisibility}
                                    className={`flex items-center text-sm gap-2 p-2 px-4 rounded-full hover:bg-white/5 transition-colors ${eventVisibility
                                        ? "bg-white/[0.05] opacity-100"
                                        : "opacity-50"
                                        }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="16"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M4.257 4.5C4.437 4.717 4.633 4.92 4.843 5.108C4.996 4.498 5.197 3.933 5.439 3.43C4.99539 3.7277 4.59725 4.08811 4.257 4.5ZM8.5 1C7.58053 0.999213 6.66992 1.17974 5.82028 1.53124C4.97065 1.88274 4.19866 2.39833 3.5485 3.0485C2.89833 3.69866 2.38274 4.47065 2.03124 5.32028C1.67974 6.16992 1.49921 7.08053 1.5 8C1.5 9.38447 1.91055 10.7379 2.67972 11.889C3.44889 13.0401 4.54214 13.9373 5.82122 14.4672C7.1003 14.997 8.50777 15.1356 9.86563 14.8655C11.2235 14.5954 12.4708 13.9287 13.4497 12.9497C14.4287 11.9708 15.0954 10.7235 15.3655 9.36563C15.6356 8.00777 15.497 6.6003 14.9672 5.32122C14.4373 4.04214 13.5401 2.94889 12.389 2.17972C11.2379 1.41055 9.88447 1 8.5 1ZM8.5 2.5C8.024 2.5 7.409 2.886 6.867 3.927C6.574 4.491 6.336 5.194 6.184 5.99C6.90952 6.32701 7.70003 6.50109 8.5 6.5C9.29997 6.50109 10.0905 6.32701 10.816 5.99C10.664 5.194 10.426 4.491 10.133 3.927C9.59 2.886 8.976 2.5 8.5 2.5ZM12.157 5.108C12.0154 4.53 11.8157 3.96781 11.561 3.43C12.005 3.728 12.403 4.089 12.743 4.5C12.563 4.717 12.367 4.92 12.157 5.108ZM10.991 7.544C10.1954 7.84655 9.35119 8.00109 8.5 8C7.64915 8.00097 6.80529 7.84643 6.01 7.544C5.97111 8.41566 6.03894 9.28881 6.212 10.144C6.932 10.375 7.702 10.5 8.5 10.5C9.298 10.5 10.068 10.375 10.79 10.144C10.9624 9.28872 11.0295 8.41558 10.99 7.544H10.991ZM12.424 9.394C12.5199 8.52728 12.5259 7.65297 12.442 6.785C12.847 6.509 13.222 6.191 13.559 5.838C13.8643 6.55229 14.0143 7.32334 13.999 8.1C13.535 8.60032 13.0051 9.0353 12.424 9.393V9.394ZM10.252 11.829C9.09517 12.0574 7.90484 12.0574 6.748 11.829C6.787 11.913 6.826 11.995 6.868 12.073C7.407 13.114 8.023 13.5 8.5 13.5C8.977 13.5 9.591 13.114 10.133 12.073C10.173 11.995 10.213 11.913 10.253 11.829H10.252ZM11.562 12.569C11.7611 12.1505 11.9257 11.7164 12.054 11.271C12.511 11.074 12.947 10.841 13.361 10.575C12.9343 11.378 12.316 12.0632 11.561 12.57L11.562 12.569ZM5.439 12.569C5.23958 12.1505 5.07469 11.7164 4.946 11.271C4.49193 11.0754 4.05478 10.8426 3.639 10.575C4.06572 11.378 4.684 12.0622 5.439 12.569ZM3 8.1C3.463 8.6 3.993 9.035 4.575 9.393C4.47918 8.52661 4.47315 7.65263 4.557 6.785C4.15275 6.50904 3.77839 6.19166 3.44 5.838C3.13467 6.55229 2.98469 7.32334 3 8.1Z"
                                            fill="white"
                                        />
                                    </svg>
                                    Public
                                </button>
                                <button
                                    onClick={toggleEventVisibility}
                                    className={`flex items-center text-sm gap-2 p-2 px-4 rounded-full hover:bg-white/5 transition-colors ${!eventVisibility
                                        ? "bg-white/[0.05] opacity-100"
                                        : "opacity-50"
                                        }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="16"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.41328 6.025C9.5539 5.88455 9.74453 5.80566 9.94328 5.80566C10.142 5.80566 10.3327 5.88455 10.4733 6.025C10.7983 6.35001 11.0562 6.73587 11.2321 7.16053C11.408 7.58519 11.4985 8.04035 11.4985 8.5C11.4985 8.95966 11.408 9.41482 11.2321 9.83948C11.0562 10.2641 10.7983 10.65 10.4733 10.975L8.47328 12.975C7.86002 13.5875 7.04134 13.9506 6.17573 13.9941C5.31012 14.0376 4.45915 13.7584 3.78757 13.2106C3.11599 12.6627 2.67157 11.8851 2.54035 11.0284C2.40914 10.1717 2.60046 9.29676 3.07728 8.573C3.18895 8.41183 3.3593 8.3008 3.55184 8.2637C3.74437 8.22659 3.94379 8.26637 4.10735 8.3745C4.27092 8.48263 4.38564 8.65052 4.42694 8.8422C4.46823 9.03388 4.43281 9.23412 4.32828 9.4C4.05556 9.81374 3.94614 10.314 4.02123 10.8038C4.09632 11.2936 4.35056 11.7381 4.7347 12.0511C5.11883 12.3642 5.6055 12.5234 6.10038 12.4981C6.59526 12.4728 7.06311 12.2646 7.41328 11.914L9.41328 9.914C9.78822 9.53895 9.99885 9.03033 9.99885 8.5C9.99885 7.96968 9.78822 7.46106 9.41328 7.086C9.27282 6.94538 9.19394 6.75476 9.19394 6.556C9.19394 6.35725 9.27282 6.16563 9.41328 6.025Z"
                                            fill="white"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M7.58525 9.97548C7.44463 10.1159 7.254 10.1948 7.05525 10.1948C6.8565 10.1948 6.66588 10.1159 6.52525 9.97548C6.20021 9.65047 5.94237 9.26461 5.76646 8.83995C5.59054 8.41529 5.5 7.96013 5.5 7.50048C5.5 7.04082 5.59054 6.58566 5.76646 6.161C5.94237 5.73634 6.20021 5.35049 6.52525 5.02548L8.52525 3.02548C9.1385 2.41302 9.95718 2.04988 10.8228 2.00637C11.6884 1.96286 12.5394 2.24206 13.211 2.78993C13.8825 3.3378 14.327 4.11536 14.4582 4.97207C14.5894 5.82879 14.3981 6.70372 13.9213 7.42748C13.8096 7.58865 13.6392 7.69968 13.4467 7.73678C13.2542 7.77389 13.0547 7.73411 12.8912 7.62598C12.7276 7.51785 12.6129 7.34996 12.5716 7.15828C12.5303 6.9666 12.5657 6.76636 12.6703 6.60048C12.943 6.18674 13.0524 5.6865 12.9773 5.1967C12.9022 4.70689 12.648 4.2624 12.2638 3.94936C11.8797 3.63633 11.393 3.47704 10.8982 3.50238C10.4033 3.52771 9.93541 3.73585 9.58525 4.08648L7.58525 6.08648C7.21031 6.46153 6.99968 6.97015 6.99968 7.50048C6.99968 8.0308 7.21031 8.53942 7.58525 8.91448C7.7257 9.0551 7.80459 9.24573 7.80459 9.44448C7.80459 9.64323 7.7257 9.83385 7.58525 9.97448V9.97548Z"
                                            fill="white"
                                        />
                                    </svg>
                                    Link Access
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                            <div className="font-medium">Attendee visibility</div>
                            <div className="text-sm text-white/70">
                                Show who&apos;s attending on event page
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 w-fit justify-end">
                            <div className="bg-[#151515] p-1 rounded-full flex items-center gap-2">
                                <button
                                    className={`flex items-center text-sm gap-2 p-2 px-4 rounded-full hover:bg-white/5 transition-colors ${attendeeVisibility
                                        ? "bg-white/[0.05] opacity-100"
                                        : "opacity-50"
                                        }`}
                                    onClick={toggleAttendeeVisibility}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="16"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M8.5 9.5C8.89782 9.5 9.27936 9.34196 9.56066 9.06066C9.84196 8.77936 10 8.39782 10 8C10 7.60218 9.84196 7.22064 9.56066 6.93934C9.27936 6.65804 8.89782 6.5 8.5 6.5C8.10218 6.5 7.72064 6.65804 7.43934 6.93934C7.15804 7.22064 7 7.60218 7 8C7 8.39782 7.15804 8.77936 7.43934 9.06066C7.72064 9.34196 8.10218 9.5 8.5 9.5Z"
                                            fill="white"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M1.87935 8.27987C1.81626 8.09648 1.81626 7.89727 1.87935 7.71387C2.35572 6.33724 3.24953 5.14343 4.43631 4.29869C5.62309 3.45394 7.04376 3.00032 8.50048 3.00098C9.95721 3.00164 11.3775 3.45655 12.5635 4.30237C13.7495 5.14819 14.6422 6.34281 15.1173 7.71987C15.1804 7.90327 15.1804 8.10248 15.1173 8.28587C14.6412 9.66286 13.7474 10.857 12.5605 11.7021C11.3736 12.5471 9.95269 13.0009 8.49571 13.0002C7.03872 12.9996 5.61822 12.5445 4.43209 11.6984C3.24596 10.8523 2.35326 9.65729 1.87835 8.27987H1.87935ZM11.4993 7.99987C11.4993 8.79552 11.1833 9.55859 10.6207 10.1212C10.0581 10.6838 9.295 10.9999 8.49935 10.9999C7.7037 10.9999 6.94064 10.6838 6.37803 10.1212C5.81542 9.55859 5.49935 8.79552 5.49935 7.99987C5.49935 7.20422 5.81542 6.44116 6.37803 5.87855C6.94064 5.31594 7.7037 4.99987 8.49935 4.99987C9.295 4.99987 10.0581 5.31594 10.6207 5.87855C11.1833 6.44116 11.4993 7.20422 11.4993 7.99987Z"
                                            fill="white"
                                        />
                                    </svg>
                                    Visible
                                </button>
                                <button
                                    className={`flex items-center text-sm gap-2 p-2 px-4 rounded-full hover:bg-white/5 transition-colors ${!attendeeVisibility
                                        ? "bg-white/[0.05] opacity-100"
                                        : "opacity-50"
                                        }`}
                                    onClick={toggleAttendeeVisibility}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M3.28082 2.21985C3.13865 2.08737 2.9506 2.01524 2.7563 2.01867C2.562 2.0221 2.37661 2.10081 2.2392 2.23822C2.10179 2.37564 2.02308 2.56102 2.01965 2.75532C2.01622 2.94963 2.08834 3.13767 2.22082 3.27985L12.7208 13.7798C12.7895 13.8535 12.8723 13.9126 12.9643 13.9536C13.0563 13.9946 13.1556 14.0167 13.2563 14.0184C13.357 14.0202 13.457 14.0017 13.5504 13.964C13.6438 13.9262 13.7286 13.8701 13.7999 13.7989C13.8711 13.7277 13.9272 13.6428 13.9649 13.5494C14.0027 13.4561 14.0212 13.356 14.0194 13.2553C14.0176 13.1546 13.9956 13.0553 13.9546 12.9633C13.9136 12.8713 13.8545 12.7885 13.7808 12.7198L12.4588 11.3968C13.4504 10.5779 14.1976 9.50198 14.6188 8.28685C14.6821 8.10315 14.6821 7.90354 14.6188 7.71985C14.2926 6.77279 13.7669 5.90675 13.0774 5.18017C12.3879 4.45359 11.5505 3.88338 10.6218 3.50804C9.69315 3.13269 8.69474 2.96095 7.694 3.00439C6.69327 3.04782 5.7135 3.30544 4.82082 3.75985L3.28082 2.21985ZM6.47682 5.41485L7.61182 6.55085C7.8663 6.48286 8.13418 6.48299 8.38859 6.55122C8.643 6.61945 8.87499 6.75339 9.06129 6.93959C9.2476 7.12579 9.38166 7.35771 9.45003 7.61208C9.5184 7.86646 9.51867 8.13433 9.45082 8.38885L10.5868 9.52385C10.9255 8.95081 11.0639 8.28144 10.9804 7.62109C10.8968 6.96074 10.5961 6.34692 10.1254 5.87626C9.65475 5.4056 9.04093 5.10483 8.38058 5.0213C7.72023 4.93776 7.05086 5.07621 6.47782 5.41485H6.47682Z"
                                            fill="white"
                                        />
                                        <path
                                            d="M7.81135 10.9938L9.62735 12.8098C7.93548 13.2139 6.15375 12.974 4.6291 12.1366C3.10445 11.2992 1.94601 9.92438 1.37935 8.2798C1.31626 8.09641 1.31626 7.8972 1.37935 7.7138C1.63394 6.97678 2.01014 6.28758 2.49235 5.6748L5.00535 8.1878C5.05116 8.91699 5.36149 9.6044 5.87812 10.121C6.39475 10.6377 7.08216 10.948 7.81135 10.9938Z"
                                            fill="white"
                                        />
                                    </svg>
                                    Hidden
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications Section */}
            {/* <div className="border border-white/10 rounded-xl overflow-hidden">
                <h2 className="text-sm font-semibold p-3 border-b border-white/10 bg-white/5 flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.001 5C12.001 3.93913 11.5795 2.92172 10.8294 2.17157C10.0792 1.42143 9.06182 1 8.00095 1C6.94009 1 5.92267 1.42143 5.17253 2.17157C4.42238 2.92172 4.00095 3.93913 4.00095 5V7.379C4.0006 7.77669 3.84234 8.15797 3.56095 8.439L2.29495 9.707C2.1074 9.89449 2.00201 10.1488 2.00195 10.414V11C2.00195 11.2652 2.10731 11.5196 2.29485 11.7071C2.48238 11.8946 2.73674 12 3.00195 12H5.00195C5.00195 12.7956 5.31802 13.5587 5.88063 14.1213C6.44324 14.6839 7.2063 15 8.00195 15C8.7976 15 9.56066 14.6839 10.1233 14.1213C10.6859 13.5587 11.002 12.7956 11.002 12H13.002C13.2672 12 13.5215 11.8946 13.7091 11.7071C13.8966 11.5196 14.002 11.2652 14.002 11V10.414C14.0019 10.1488 13.8965 9.89449 13.709 9.707L12.441 8.44C12.1596 8.15897 12.0013 7.77769 12.001 7.38V5ZM6.50095 12C6.50095 12.3978 6.65899 12.7794 6.94029 13.0607C7.2216 13.342 7.60313 13.5 8.00095 13.5C8.39878 13.5 8.78031 13.342 9.06161 13.0607C9.34292 12.7794 9.50095 12.3978 9.50095 12H6.50095Z"
                            fill="white"
                            fillOpacity="0.5"
                        />
                    </svg>
                    Notifications
                </h2>

                <div className="p-4 flex flex-col gap-8">
                    <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                            <div className="font-medium">Email notifications</div>
                            <div className="text-sm text-white/70">
                                Get updates about your event via email
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 w-fit justify-end">
                            <div className="bg-[#151515] p-1 rounded-full flex items-center gap-2">
                                <button
                                    className={`flex items-center text-sm gap-2 p-2 px-4 rounded-full hover:bg-white/5 transition-colors ${emailActiveNotification
                                            ? "bg-white/[0.05] opacity-100"
                                            : "opacity-50"
                                        }`}
                                    onClick={() =>
                                        setEmailActiveNotification(!emailActiveNotification)
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="16"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8.5 15C10.3565 15 12.137 14.2625 13.4497 12.9497C14.7625 11.637 15.5 9.85652 15.5 8C15.5 6.14348 14.7625 4.36301 13.4497 3.05025C12.137 1.7375 10.3565 1 8.5 1C6.64348 1 4.86301 1.7375 3.55025 3.05025C2.2375 4.36301 1.5 6.14348 1.5 8C1.5 9.85652 2.2375 11.637 3.55025 12.9497C4.86301 14.2625 6.64348 15 8.5 15ZM12.344 6.209C12.4657 6.05146 12.5199 5.85202 12.4946 5.65454C12.4693 5.45706 12.3665 5.27773 12.209 5.156C12.0515 5.03427 11.852 4.9801 11.6545 5.00542C11.4571 5.03073 11.2777 5.13346 11.156 5.291L7.456 10.081L5.807 8.248C5.74174 8.17247 5.66207 8.11073 5.57264 8.06639C5.48322 8.02205 5.38584 7.99601 5.28622 7.98978C5.1866 7.98356 5.08674 7.99729 4.9925 8.03016C4.89825 8.06303 4.81151 8.11438 4.73737 8.1812C4.66322 8.24803 4.60316 8.32898 4.56071 8.41931C4.51825 8.50965 4.49425 8.60755 4.49012 8.70728C4.48599 8.807 4.50181 8.90656 4.53664 9.00009C4.57148 9.09363 4.62464 9.17927 4.693 9.252L6.943 11.752C7.01649 11.8335 7.10697 11.8979 7.20806 11.9406C7.30915 11.9833 7.41838 12.0034 7.52805 11.9993C7.63772 11.9952 7.74515 11.967 7.84277 11.9169C7.94038 11.8667 8.0258 11.7958 8.093 11.709L12.344 6.209Z"
                                            fill="white"
                                        />
                                    </svg>
                                    Active
                                </button>
                                <button
                                    className={`flex items-center text-sm gap-2 p-2 px-4 rounded-full hover:bg-white/5 transition-colors ${!emailActiveNotification
                                            ? "bg-white/[0.05] opacity-100"
                                            : "opacity-50"
                                        }`}
                                    onClick={() =>
                                        setEmailActiveNotification(!emailActiveNotification)
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM10.78 10.78C10.6394 10.9205 10.4488 10.9993 10.25 10.9993C10.0512 10.9993 9.86063 10.9205 9.72 10.78L8 9.06L6.28 10.78C6.21134 10.8537 6.12854 10.9128 6.03654 10.9538C5.94454 10.9948 5.84523 11.0168 5.74452 11.0186C5.64382 11.0204 5.54379 11.0018 5.4504 10.9641C5.35701 10.9264 5.27218 10.8703 5.20096 10.799C5.12974 10.7278 5.0736 10.643 5.03588 10.5496C4.99816 10.4562 4.97963 10.3562 4.98141 10.2555C4.98319 10.1548 5.00523 10.0555 5.04622 9.96346C5.08721 9.87146 5.14631 9.78866 5.22 9.72L6.94 8L5.22 6.28C5.08752 6.13783 5.0154 5.94978 5.01883 5.75548C5.02225 5.56118 5.10097 5.37579 5.23838 5.23838C5.37579 5.10097 5.56118 5.02225 5.75548 5.01883C5.94978 5.0154 6.13783 5.08752 6.28 5.22L8 6.94L9.72 5.22C9.78866 5.14631 9.87146 5.08721 9.96346 5.04622C10.0555 5.00523 10.1548 4.98319 10.2555 4.98141C10.3562 4.97963 10.4562 4.99816 10.5496 5.03588C10.643 5.0736 10.7278 5.12974 10.799 5.20096C10.8703 5.27218 10.9264 5.35701 10.9641 5.4504C11.0018 5.54379 11.0204 5.64382 11.0186 5.74452C11.0168 5.84523 10.9948 5.94454 10.9538 6.03654C10.9128 6.12854 10.8537 6.21134 10.78 6.28L9.06 8L10.78 9.72C10.9205 9.86063 10.9993 10.0512 10.9993 10.25C10.9993 10.4488 10.9205 10.6394 10.78 10.78Z"
                                            fill="white"
                                        />
                                    </svg>
                                    Disable
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                            <div className="font-medium">SMS notifications</div>
                            <div className="text-sm text-white/70">
                                Get updates about your event via SMS
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 w-fit justify-end">
                            <div className="bg-[#151515] p-1 rounded-full flex items-center gap-2">
                                <button
                                    className={`flex items-center text-sm gap-2 p-2 px-4 rounded-full hover:bg-white/5 transition-colors ${smsActiveNotification
                                            ? "bg-white/[0.05] opacity-100"
                                            : "opacity-50"
                                        }`}
                                    onClick={() =>
                                        setSmsActiveNotification(!smsActiveNotification)
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="16"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8.5 15C10.3565 15 12.137 14.2625 13.4497 12.9497C14.7625 11.637 15.5 9.85652 15.5 8C15.5 6.14348 14.7625 4.36301 13.4497 3.05025C12.137 1.7375 10.3565 1 8.5 1C6.64348 1 4.86301 1.7375 3.55025 3.05025C2.2375 4.36301 1.5 6.14348 1.5 8C1.5 9.85652 2.2375 11.637 3.55025 12.9497C4.86301 14.2625 6.64348 15 8.5 15ZM12.344 6.209C12.4657 6.05146 12.5199 5.85202 12.4946 5.65454C12.4693 5.45706 12.3665 5.27773 12.209 5.156C12.0515 5.03427 11.852 4.9801 11.6545 5.00542C11.4571 5.03073 11.2777 5.13346 11.156 5.291L7.456 10.081L5.807 8.248C5.74174 8.17247 5.66207 8.11073 5.57264 8.06639C5.48322 8.02205 5.38584 7.99601 5.28622 7.98978C5.1866 7.98356 5.08674 7.99729 4.9925 8.03016C4.89825 8.06303 4.81151 8.11438 4.73737 8.1812C4.66322 8.24803 4.60316 8.32898 4.56071 8.41931C4.51825 8.50965 4.49425 8.60755 4.49012 8.70728C4.48599 8.807 4.50181 8.90656 4.53664 9.00009C4.57148 9.09363 4.62464 9.17927 4.693 9.252L6.943 11.752C7.01649 11.8335 7.10697 11.8979 7.20806 11.9406C7.30915 11.9833 7.41838 12.0034 7.52805 11.9993C7.63772 11.9952 7.74515 11.967 7.84277 11.9169C7.94038 11.8667 8.0258 11.7958 8.093 11.709L12.344 6.209Z"
                                            fill="white"
                                        />
                                    </svg>
                                    Active
                                </button>
                                <button
                                    className={`flex items-center text-sm gap-2 p-2 px-4 rounded-full hover:bg-white/5 transition-colors ${!smsActiveNotification
                                            ? "bg-white/[0.05] opacity-100"
                                            : "opacity-50"
                                        }`}
                                    onClick={() =>
                                        setSmsActiveNotification(!smsActiveNotification)
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM10.78 10.78C10.6394 10.9205 10.4488 10.9993 10.25 10.9993C10.0512 10.9993 9.86063 10.9205 9.72 10.78L8 9.06L6.28 10.78C6.21134 10.8537 6.12854 10.9128 6.03654 10.9538C5.94454 10.9948 5.84523 11.0168 5.74452 11.0186C5.64382 11.0204 5.54379 11.0018 5.4504 10.9641C5.35701 10.9264 5.27218 10.8703 5.20096 10.799C5.12974 10.7278 5.0736 10.643 5.03588 10.5496C4.99816 10.4562 4.97963 10.3562 4.98141 10.2555C4.98319 10.1548 5.00523 10.0555 5.04622 9.96346C5.08721 9.87146 5.14631 9.78866 5.22 9.72L6.94 8L5.22 6.28C5.08752 6.13783 5.0154 5.94978 5.01883 5.75548C5.02225 5.56118 5.10097 5.37579 5.23838 5.23838C5.37579 5.10097 5.56118 5.02225 5.75548 5.01883C5.94978 5.0154 6.13783 5.08752 6.28 5.22L8 6.94L9.72 5.22C9.78866 5.14631 9.87146 5.08721 9.96346 5.04622C10.0555 5.00523 10.1548 4.98319 10.2555 4.98141C10.3562 4.97963 10.4562 4.99816 10.5496 5.03588C10.643 5.0736 10.7278 5.12974 10.799 5.20096C10.8703 5.27218 10.9264 5.35701 10.9641 5.4504C11.0018 5.54379 11.0204 5.64382 11.0186 5.74452C11.0168 5.84523 10.9948 5.94454 10.9538 6.03654C10.9128 6.12854 10.8537 6.21134 10.78 6.28L9.06 8L10.78 9.72C10.9205 9.86063 10.9993 10.0512 10.9993 10.25C10.9993 10.4488 10.9205 10.6394 10.78 10.78Z"
                                            fill="white"
                                        />
                                    </svg>
                                    Disable
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Legal Section */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
                <h2 className="text-sm font-semibold p-3 border-b border-white/10 bg-white/5 flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4 2C3.60218 2 3.22064 2.15804 2.93934 2.43934C2.65804 2.72065 2.5 3.10218 2.5 3.5V12.5C2.5 12.8978 2.65804 13.2794 2.93934 13.5607C3.22064 13.842 3.60218 14 4 14H12C12.3978 14 12.7794 13.842 13.0607 13.5607C13.342 13.2794 13.5 12.8978 13.5 12.5V6.621C13.4997 6.22331 13.3414 5.84204 13.06 5.561L9.94 2.439C9.80052 2.29961 9.63494 2.1891 9.45271 2.11377C9.27048 2.03844 9.07518 1.99978 8.878 2H4ZM5 7.75C5 7.55109 5.07902 7.36032 5.21967 7.21967C5.36032 7.07902 5.55109 7 5.75 7H10.25C10.4489 7 10.6397 7.07902 10.7803 7.21967C10.921 7.36032 11 7.55109 11 7.75C11 7.94891 10.921 8.13968 10.7803 8.28033C10.6397 8.42098 10.4489 8.5 10.25 8.5H5.75C5.55109 8.5 5.36032 8.42098 5.21967 8.28033C5.07902 8.13968 5 7.94891 5 7.75ZM5 10.75C5 10.5511 5.07902 10.3603 5.21967 10.2197C5.36032 10.079 5.55109 10 5.75 10H10.25C10.4489 10 10.6397 10.079 10.7803 10.2197C10.921 10.3603 11 10.5511 11 10.75C11 10.9489 10.921 11.1397 10.7803 11.2803C10.6397 11.421 10.4489 11.5 10.25 11.5H5.75C5.55109 11.5 5.36032 11.421 5.21967 11.2803C5.07902 11.1397 5 10.9489 5 10.75Z"
                            fill="white"
                            fillOpacity="0.5"
                        />
                    </svg>
                    Legal
                </h2>

                <div className="p-4 flex flex-col gap-8">
                    <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                            <div className="font-medium">Contact link</div>
                            <div className="text-sm text-white/70">
                                Need help with your event?
                            </div>
                        </div>
                        <button className="flex items-center text-sm gap-2 p-2 px-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1 8C1 4.57 4.262 2 8 2C11.738 2 15 4.57 15 8C15 11.43 11.738 14 8 14C7.577 14 7.162 13.968 6.759 13.906C5.859 14.48 4.818 14.854 3.699 14.966C3.55984 14.9799 3.41957 14.9547 3.29401 14.8931C3.16846 14.8315 3.06263 14.736 2.98847 14.6174C2.91431 14.4989 2.87478 14.3619 2.87435 14.2221C2.87391 14.0822 2.91258 13.945 2.986 13.826C3.218 13.448 3.381 13.022 3.455 12.566C1.979 11.486 1 9.86 1 8Z"
                                    fill="white"
                                    fillOpacity="0.5"
                                />
                            </svg>
                            Chat with support
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                            <div className="font-medium">Terms and privacy</div>
                            <div className="text-sm text-white/70">View legal documents</div>
                        </div>
                        <button className="flex items-center text-sm gap-2 p-2 px-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
                            Terms and privacy
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.21934 11.78C4.07889 11.6394 4 11.4488 4 11.25C4 11.0512 4.07889 10.8606 4.21934 10.72L9.43934 5.5H5.74934C5.55043 5.5 5.35966 5.42098 5.21901 5.28033C5.07836 5.13968 4.99934 4.94891 4.99934 4.75C4.99934 4.55109 5.07836 4.36032 5.21901 4.21967C5.35966 4.07902 5.55043 4 5.74934 4H11.2493C11.4483 4 11.639 4.07902 11.7797 4.21967C11.9203 4.36032 11.9993 4.55109 11.9993 4.75V10.25C11.9993 10.4489 11.9203 10.6397 11.7797 10.7803C11.639 10.921 11.4483 11 11.2493 11C11.0504 11 10.8597 10.921 10.719 10.7803C10.5784 10.6397 10.4993 10.4489 10.4993 10.25V6.56L5.27934 11.78C5.13871 11.9205 4.94809 11.9993 4.74934 11.9993C4.55059 11.9993 4.35997 11.9205 4.21934 11.78Z"
                                    fill="white"
                                    fillOpacity="0.5"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}