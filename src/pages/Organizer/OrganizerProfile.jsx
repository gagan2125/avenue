// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

// import {
//     IoLinkSharp,
//     IoGlobeOutline,
//     IoDocumentTextSharp,
// } from "react-icons/io5";
// import SidebarLayout from "../../components/layouts/SidebarLayout";
// import SidebarToggle from "../../components/layouts/SidebarToggle";
// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import url from "../../constants/url"
// import { Spin } from 'antd';
// import { Link } from "react-router-dom";

// const Icons = {
//     Link: ({ className }) => (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="16"
//             height="16"
//             viewBox="0 0 16 16"
//             fill="none"
//             className={className}
//         >
//             <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M8.91401 6.025C9.05463 5.88455 9.24526 5.80566 9.44401 5.80566C9.64276 5.80566 9.83338 5.88455 9.97401 6.025C10.2991 6.35001 10.5569 6.73587 10.7328 7.16053C10.9087 7.58519 10.9993 8.04035 10.9993 8.5C10.9993 8.95966 10.9087 9.41482 10.7328 9.83948C10.5569 10.2641 10.2991 10.65 9.97401 10.975L7.97401 12.975C7.36076 13.5875 6.54208 13.9506 5.67646 13.9941C4.81085 14.0376 3.95988 13.7584 3.2883 13.2106C2.61672 12.6627 2.1723 11.8851 2.04109 11.0284C1.90987 10.1717 2.10119 9.29676 2.57801 8.573C2.68968 8.41183 2.86003 8.3008 3.05257 8.2637C3.24511 8.22659 3.44452 8.26637 3.60809 8.3745C3.77166 8.48263 3.88638 8.65052 3.92767 8.8422C3.96896 9.03388 3.93355 9.23412 3.82901 9.4C3.55629 9.81374 3.44687 10.314 3.52196 10.8038C3.59705 11.2936 3.8513 11.7381 4.23543 12.0511C4.61956 12.3642 5.10623 12.5234 5.60111 12.4981C6.09599 12.4728 6.56385 12.2646 6.91401 11.914L8.91401 9.914C9.28895 9.53895 9.49958 9.03033 9.49958 8.5C9.49958 7.96968 9.28895 7.46106 8.91401 7.086C8.77356 6.94538 8.69467 6.75476 8.69467 6.556C8.69467 6.35725 8.77356 6.16563 8.91401 6.025Z"
//                 fill="white"
//                 fillOpacity="0.5"
//             />
//             <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M7.08598 9.97548C6.94536 10.1159 6.75474 10.1948 6.55598 10.1948C6.35723 10.1948 6.16661 10.1159 6.02598 9.97548C5.70094 9.65047 5.4431 9.26461 5.26719 8.83995C5.09127 8.41529 5.00073 7.96013 5.00073 7.50048C5.00073 7.04082 5.09127 6.58566 5.26719 6.161C5.4431 5.73634 5.70094 5.35049 6.02598 5.02548L8.02598 3.02548C8.63924 2.41302 9.45792 2.04988 10.3235 2.00637C11.1891 1.96286 12.0401 2.24206 12.7117 2.78993C13.3833 3.3378 13.8277 4.11536 13.9589 4.97207C14.0901 5.82879 13.8988 6.70372 13.422 7.42748C13.3103 7.58865 13.14 7.69968 12.9474 7.73678C12.7549 7.77389 12.5555 7.73411 12.3919 7.62598C12.2283 7.51785 12.1136 7.34996 12.0723 7.15828C12.031 6.9666 12.0664 6.76636 12.171 6.60048C12.4437 6.18674 12.5531 5.6865 12.478 5.1967C12.4029 4.70689 12.1487 4.2624 11.7646 3.94936C11.3804 3.63633 10.8938 3.47704 10.3989 3.50238C9.904 3.52771 9.43615 3.73585 9.08599 4.08648L7.08598 6.08648C6.71104 6.46153 6.50041 6.97015 6.50041 7.50048C6.50041 8.0308 6.71104 8.53942 7.08598 8.91448C7.22644 9.0551 7.30532 9.24573 7.30532 9.44448C7.30532 9.64323 7.22644 9.83385 7.08598 9.97448V9.97548Z"
//                 fill="white"
//                 fillOpacity="0.5"
//             />
//         </svg>
//     ),
//     Logout: ({ className }) => (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             className={className}
//         >
//             <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M21.0001 7.125C21.0001 6.03098 20.5655 4.98177 19.7919 4.20818C19.0183 3.4346 17.9691 3 16.8751 3H12.3751C11.2811 3 10.2319 3.4346 9.45829 4.20818C8.68471 4.98177 8.25011 6.03098 8.25011 7.125V7.875C8.25011 8.17337 8.36864 8.45952 8.57961 8.6705C8.79059 8.88147 9.07674 9 9.37511 9C9.67348 9 9.95963 8.88147 10.1706 8.6705C10.3816 8.45952 10.5001 8.17337 10.5001 7.875V7.125C10.5001 6.09 11.3401 5.25 12.3751 5.25H16.8751C17.9101 5.25 18.7501 6.09 18.7501 7.125V16.875C18.7501 17.91 17.9101 18.75 16.8751 18.75H12.3751C11.3401 18.75 10.5001 17.91 10.5001 16.875V16.125C10.5001 15.8266 10.3816 15.5405 10.1706 15.3295C9.95963 15.1185 9.67348 15 9.37511 15C9.07674 15 8.79059 15.1185 8.57961 15.3295C8.36864 15.5405 8.25011 15.8266 8.25011 16.125V16.875C8.25011 17.969 8.68471 19.0182 9.45829 19.7918C10.2319 20.5654 11.2811 21 12.3751 21H16.8751C17.9691 21 19.0183 20.5654 19.7919 19.7918C20.5655 19.0182 21.0001 17.969 21.0001 16.875V7.125ZM6.79511 7.83C6.58417 7.61932 6.29823 7.50099 6.00011 7.50099C5.70198 7.50099 5.41605 7.61932 5.20511 7.83L1.83011 11.205C1.61943 11.4159 1.5011 11.7019 1.5011 12C1.5011 12.2981 1.61943 12.5841 1.83011 12.795L5.20511 16.17C5.3081 16.2805 5.4323 16.3692 5.5703 16.4307C5.7083 16.4922 5.85727 16.5252 6.00832 16.5279C6.15938 16.5306 6.30942 16.5028 6.44951 16.4462C6.58959 16.3896 6.71684 16.3054 6.82367 16.1986C6.93049 16.0917 7.01471 15.9645 7.07129 15.8244C7.12787 15.6843 7.15566 15.5343 7.153 15.3832C7.15033 15.2322 7.11727 15.0832 7.05578 14.9452C6.99429 14.8072 6.90564 14.683 6.79511 14.58L5.34011 13.125H16.1251C16.4235 13.125 16.7096 13.0065 16.9206 12.7955C17.1316 12.5845 17.2501 12.2984 17.2501 12C17.2501 11.7016 17.1316 11.4155 16.9206 11.2045C16.7096 10.9935 16.4235 10.875 16.1251 10.875H5.34011L6.79511 9.42C7.00578 9.20906 7.12412 8.92313 7.12412 8.625C7.12412 8.32687 7.00578 8.04094 6.79511 7.83Z"
//                 fill="#F43F5E"
//             />
//         </svg>
//     ),
//     Calendar: ({ className }) => (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="12"
//             height="14"
//             viewBox="0 0 12 14"
//             fill="none"
//         >
//             <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M2 1.25C2 1.05109 2.07902 0.860322 2.21967 0.71967C2.36032 0.579018 2.55109 0.5 2.75 0.5C2.94891 0.5 3.13968 0.579018 3.28033 0.71967C3.42098 0.860322 3.5 1.05109 3.5 1.25V2.5H8.5V1.25C8.5 1.05109 8.57902 0.860322 8.71967 0.71967C8.86032 0.579018 9.05109 0.5 9.25 0.5C9.44891 0.5 9.63968 0.579018 9.78033 0.71967C9.92098 0.860322 10 1.05109 10 1.25V2.5C10.5304 2.5 11.0391 2.71071 11.4142 3.08579C11.7893 3.46086 12 3.96957 12 4.5V11.5C12 12.0304 11.7893 12.5391 11.4142 12.9142C11.0391 13.2893 10.5304 13.5 10 13.5H2C1.46957 13.5 0.960859 13.2893 0.585786 12.9142C0.210714 12.5391 0 12.0304 0 11.5V4.5C0 3.96957 0.210714 3.46086 0.585786 3.08579C0.960859 2.71071 1.46957 2.5 2 2.5V1.25ZM2.5 5.5C2.23478 5.5 1.98043 5.60536 1.79289 5.79289C1.60536 5.98043 1.5 6.23478 1.5 6.5V11C1.5 11.2652 1.60536 11.5196 1.79289 11.7071C1.98043 11.8946 2.23478 12 2.5 12H9.5C9.76522 12 10.0196 11.8946 10.2071 11.7071C10.3946 11.5196 10.5 11.2652 10.5 11V6.5C10.5 6.23478 10.3946 5.98043 10.2071 5.79289C10.0196 5.60536 9.76522 5.5 9.5 5.5H2.5Z"
//                 fill="white"
//                 fillOpacity="0.5"
//             />
//         </svg>
//     ),
// };

// const ProfileSection = ({ icon: Icon, title, children }) => (
//     <div className="rounded-xl border border-white/10 overflow-hidden">
//         <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
//             {Icon && <Icon className="w-5 h-5 text-zinc-400" />}
//             <span className="text-sm font-medium">{title}</span>
//         </div>
//         <div className="p-4">{children}</div>
//     </div>
// );

// const InputField = ({
//     label,
//     description,
//     type = "text",
//     placeholder,
//     value,
//     onChange,
//     fieldName,
//     editedField
// }) => (
//     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//         <div className="flex flex-col gap-3">
//             <span className="text-sm font-medium">{label}</span>
//             <span className="text-sm block text-white/60">{description}</span>
//         </div>
//         <div className="relative w-full lg:w-1/2">
//             <input
//                 type={type}
//                 placeholder={placeholder}
//                 value={value}
//                 onChange={onChange}
//                 className="border bg-primary text-sm border-white/10 h-10 rounded-lg px-5 py-2.5 focus:outline-none w-full pr-14"
//                 aria-label={label}
//             />
//             {editedField === fieldName && (
//                 <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xs">
//                     Saved
//                 </span>
//             )}
//         </div>
//     </div>
// );

// const UrlInputField = ({
//     label,
//     description,
//     type = "text",
//     placeholder,
//     value,
//     onChange,
//     fieldName,
//     editedField
// }) => {
//     const handleInputChange = (e) => {
//         const rawValue = e.target.value;
//         const sanitizedValue = rawValue.replace(/[^a-zA-Z0-9-]/g, "");
//         onChange({ target: { value: sanitizedValue } });
//     };

//     return (
//         <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//             <div className="flex flex-col gap-3">
//                 <span className="text-sm font-medium">{label}</span>
//                 <span className="text-sm block text-white/60">{description}</span>
//             </div>
//             <div className="relative w-full lg:w-1/2">
//                 <input
//                     type={type}
//                     placeholder={placeholder}
//                     value={value}
//                     onChange={handleInputChange}
//                     className="border bg-primary text-sm border-white/10 h-10 rounded-lg px-5 py-2.5 focus:outline-none w-full pr-14"
//                     aria-label={label}
//                 />
//                 {editedField === fieldName && (
//                     <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xs">
//                         Saved
//                     </span>
//                 )}
//             </div>
//         </div>
//     );
// };



// const PhoneInput = ({ value, onChange, fieldName, editedField }) => (
//     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//         <div className="flex flex-col gap-3">
//             <span className="text-sm font-medium">Phone Number</span>
//             <span className="text-sm block text-white/60">
//                 Will be displayed for enquiries from users
//             </span>
//         </div>
//         <div className="relative w-full lg:w-1/2">
//             <div className="flex items-center bg-primary border border-white/10 h-10 rounded-lg px-2 py-2.5 w-full relative">
//                 <div className="flex items-center h-10 gap-1 px-1 pr-3 border-r border-white/10">
//                     <img
//                         src="https://flagcdn.com/w40/us.png"
//                         alt="US Flag"
//                         className="w-4 h-4 rounded-full"
//                     />
//                     <span className="text-white text-sm">+1</span>
//                 </div>
//                 <input
//                     type="tel"
//                     placeholder="Enter phone number"
//                     value={value}
//                     onChange={onChange}
//                     className="bg-transparent text-sm flex-1 focus:outline-none px-2 text-white mx-3 pr-14"
//                     aria-label="Phone number"
//                 />
//                 {editedField === fieldName && (
//                     <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xs">
//                         Saved
//                     </span>
//                 )}
//             </div>
//         </div>
//     </div>
// );


// const SocialLinkInput = ({
//     label,
//     placeholder,
//     value,
//     onChange,
//     description = "Will be shown to attendees",
//     icon: Icon = IoLinkSharp,
//     fieldName,
//     editedField
// }) => (
//     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//         <div className="flex flex-col gap-3">
//             <span className="text-sm font-medium">{label}</span>
//             <span className="text-sm block text-white/60">{description}</span>
//         </div>
//         <div className="relative w-full lg:w-1/2">
//             <div className="flex items-center bg-primary border border-white/10 h-10 rounded-lg px-2 py-2.5 w-full relative">
//                 <div className="flex items-center h-10 gap-1 px-1 pr-3 border-r border-white/10">
//                     <Icon className="w-4 h-4 text-zinc-400" />
//                 </div>
//                 <input
//                     type="text"
//                     placeholder={placeholder}
//                     value={value}
//                     onChange={onChange}
//                     className="bg-transparent text-sm flex-1 focus:outline-none px-2 text-white mx-3 pr-14"
//                     aria-label={label}
//                 />
//                 {editedField === fieldName && (
//                     <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xs">
//                         Saved
//                     </span>
//                 )}
//             </div>
//         </div>
//     </div>
// );


// const LogoutDialog = ({ isOpen, onClose, organizer }) => {
//     if (!isOpen) return null;

//     return (
//         <>
//             {/* Backdrop */}
//             <div
//                 className="fixed inset-0 bg-black/50 backdrop-blur-xl z-50"
//                 onClick={onClose}
//             />
//             {/* Dialog */}
//             <div className="fixed left-1/2 bottom-5 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-[95%] max-w-[400px] bg-[#111111] rounded-3xl p-6 z-50 h-fit">
//                 <div className="flex flex-col gap-y-6 w-full h-full relative">
//                     <button
//                         onClick={onClose}
//                         className="text-white/60 hover:text-white border border-white/10 rounded-lg p-1 absolute top-0 right-0"
//                         aria-label="Close dialog"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="20"
//                             height="20"
//                             viewBox="0 0 20 20"
//                             fill="none"
//                         >
//                             <path
//                                 d="M15 5L5 15M5 5L15 15"
//                                 stroke="currentColor"
//                                 strokeWidth="1.67"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             />
//                         </svg>
//                     </button>
//                     <div className="flex items-center">
//                         <div className="bg-[#321C20] p-2 rounded-xl z-[2] border-2 border-[#1A1A1A] h-12 w-12 flex items-center justify-center">
//                             <Icons.Logout />
//                         </div>
//                         <div className="bg-[#10B981]/10 p-2 rounded-xl z-[1] border-2 border-[#1A1A1A] -translate-x-2">
//                             <span className="text-lg font-medium text-[#10B981]">
//                                 {organizer?.name?.slice(0, 2).toUpperCase() || ''}
//                             </span>
//                         </div>
//                     </div>
//                     <div className=" flex flex-col gap-3">
//                         <span className="text-white text-xl font-medium tracking-tight">
//                             Ready to log out?
//                         </span>
//                         <p className="text-sm text-white/60">
//                             You&apos;ll need to verify your phone number to log in again
//                         </p>
//                     </div>
//                     <button
//                         onClick={() => {
//                             localStorage.clear();
//                             window.location.href = "/";
//                         }}
//                         className="w-full border text-center text-white bg-[#f43f5e] border-white/10 rounded-full h-10 focus:outline-none flex items-center justify-center gap-2 font-medium"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="17"
//                             height="16"
//                             viewBox="0 0 17 16"
//                             fill="white"
//                         >
//                             <path
//                                 fillRule="evenodd"
//                                 clipRule="evenodd"
//                                 d="M14.5 4.75C14.5 4.02065 14.2103 3.32118 13.6946 2.80546C13.1788 2.28973 12.4794 2 11.75 2H8.75001C8.02067 2 7.32119 2.28973 6.80547 2.80546C6.28974 3.32118 6.00001 4.02065 6.00001 4.75V5.25C6.00001 5.44891 6.07903 5.63968 6.21968 5.78033C6.36033 5.92098 6.5511 6 6.75001 6C6.94892 6 7.13969 5.92098 7.28034 5.78033C7.42099 5.63968 7.50001 5.44891 7.50001 5.25V4.75C7.50001 4.06 8.06001 3.5 8.75001 3.5H11.75C12.44 3.5 13 4.06 13 4.75V11.25C13 11.94 12.44 12.5 11.75 12.5H8.75001C8.06001 12.5 7.50001 11.94 7.50001 11.25V10.75C7.50001 10.5511 7.42099 10.3603 7.28034 10.2197C7.13969 10.079 6.94892 10 6.75001 10C6.5511 10 6.36033 10.079 6.21968 10.2197C6.07903 10.3603 6.00001 10.5511 6.00001 10.75V11.25C6.00001 11.9793 6.28974 12.6788 6.80547 13.1945C7.32119 13.7103 8.02067 14 8.75001 14H11.75C12.4794 14 13.1788 13.7103 13.6946 13.1945C14.2103 12.6788 14.5 11.9793 14.5 11.25V4.75ZM5.03001 5.22C4.88939 5.07955 4.69876 5.00066 4.50001 5.00066C4.30126 5.00066 4.11064 5.07955 3.97001 5.22L1.72001 7.47C1.57956 7.61063 1.50067 7.80125 1.50067 8C1.50067 8.19875 1.57956 8.38937 1.72001 8.53L3.97001 10.78C4.03867 10.8537 4.12147 10.9128 4.21347 10.9538C4.30547 10.9948 4.40479 11.0168 4.50549 11.0186C4.60619 11.0204 4.70622 11.0018 4.79961 10.9641C4.893 10.9264 4.97783 10.8703 5.04905 10.799C5.12027 10.7278 5.17641 10.643 5.21413 10.5496C5.25186 10.4562 5.27038 10.3562 5.2686 10.2555C5.26683 10.1548 5.24478 10.0555 5.20379 9.96346C5.1628 9.87146 5.1037 9.78866 5.03001 9.72L4.06001 8.75H11.25C11.4489 8.75 11.6397 8.67098 11.7803 8.53033C11.921 8.38968 12 8.19891 12 8C12 7.80109 11.921 7.61032 11.7803 7.46967C11.6397 7.32902 11.4489 7.25 11.25 7.25H4.06001L5.03001 6.28C5.17046 6.13937 5.24935 5.94875 5.24935 5.75C5.24935 5.55125 5.17046 5.36063 5.03001 5.22Z"
//                             />
//                         </svg>
//                         Log out
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// };

// const OrganizerProfile = () => {
//     const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
//     const [oragnizerId, setOragnizerId] = useState(null);
//     const [events, setEvents] = useState([]);
//     const [organizer, setOrganizer] = useState({
//         bio: "",
//         name: "",
//         email: "",
//         phone: "",
//         instagram: "",
//         twitter: "",
//         website: "",
//         url: ""
//     });
//     const [filteredEvents, setFilteredEvents] = useState([]);
//     const [filteredPastEvents, setFilteredPastEvents] = useState([]);
//     const [loading, setLoading] = useState(false)
//     const [editedField, setEditedField] = useState(null);
//     const [copied, setCopied] = useState(false);
//     const prevValuesRef = useRef(null); // Store previous values
//     const [dataFetched, setDataFetched] = useState(false);

//     useEffect(() => {
//         const loadFromLocalStorage = () => {
//             const storedUserOrganizerId = localStorage.getItem('organizerId');
//             if (storedUserOrganizerId) {
//                 setOragnizerId(storedUserOrganizerId);
//             } else {
//                 console.warn("No organizerId found in localStorage");
//             }
//         };

//         loadFromLocalStorage();
//         const handleStorageChange = () => {
//             loadFromLocalStorage();
//         };

//         window.addEventListener('storage', handleStorageChange);
//         return () => {
//             window.removeEventListener('storage', handleStorageChange);
//         };
//     }, []);

//     useEffect(() => {
//         if (!oragnizerId) return;

//         const fetchOrganizer = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(`${url}/get-organizer/${oragnizerId}`);
//                 setOrganizer(response.data);
//                 prevValuesRef.current = response.data; // Store initial fetched values
//                 setDataFetched(true); // Mark that initial data has been fetched
//             } catch (error) {
//                 console.error("Error fetching organizer:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrganizer();
//     }, [oragnizerId]);

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const day = date.getDate();
//         const month = date.toLocaleString('en-US', { month: 'short' });
//         const year = date.getFullYear().toString().slice(-2);

//         let hours = date.getHours();
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12;
//         hours = hours ? hours : 12;

//         return `${month} ${day}, ${hours}:${minutes} ${ampm}`;
//     };

//     const formattedDate = new Date(organizer.createdAt).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long'
//     });

//     const fetchEvents = async () => {
//         if (oragnizerId) {
//             try {
//                 const response = await axios.get(`${url}/event/get-event-by-organizer-id/${oragnizerId}`);
//                 setEvents(response.data);
//                 console.log(response.data)
//             } catch (error) {
//                 console.error("Error fetching events:", error);
//             }
//         } else {
//             console.log("not found")
//         }
//     }

//     useEffect(() => {
//         if (oragnizerId) {
//             fetchEvents()
//         }
//     }, [oragnizerId]);

//     useEffect(() => {
//         const currentDate = new Date();
//         currentDate.setHours(0, 0, 0, 0);

//         const upcomingEvents = events.filter(event => {
//             const eventDate = new Date(event.start_date);
//             eventDate.setHours(0, 0, 0, 0);
//             return eventDate >= currentDate && event.explore === "YES";
//         });
//         setFilteredEvents(upcomingEvents);


//         const pastEvents = events.filter(event => {
//             const eventDate = new Date(event.start_date);
//             eventDate.setHours(0, 0, 0, 0);
//             return eventDate < currentDate && event.explore === "YES";
//         });
//         setFilteredPastEvents(pastEvents);


//     }, [events]);

//     useEffect(() => {
//         if (!oragnizerId || !dataFetched || !prevValuesRef.current) return; // Ensure data is loaded before tracking changes

//         const fieldsToWatch = ["name", "email", "phone", "instagram", "twitter", "website", "url"];
//         const hasChangedField = fieldsToWatch.find(field => prevValuesRef.current[field] !== organizer[field]);

//         if (hasChangedField) {
//             prevValuesRef.current = { ...organizer }; // Update reference
//             setEditedField(hasChangedField);

//             const updateOrganizer = async () => {
//                 try {
//                     const formData = new FormData();
//                     formData.append("bio", organizer.bio);
//                     formData.append("name", organizer.name);
//                     formData.append("email", organizer.email);
//                     formData.append("phone", organizer.phone);
//                     formData.append("instagram", organizer.instagram);
//                     formData.append("twitter", organizer.twitter);
//                     formData.append("website", organizer.website);
//                     formData.append("url", organizer.url);

//                     await axios.put(`${url}/update-organizer/${oragnizerId}`, formData, {
//                         headers: { "Content-Type": "multipart/form-data" },
//                     });

//                     console.log("Organizer updated successfully!");
//                 } catch (error) {
//                     console.error("Error updating organizer:", error);
//                     alert("Failed to update organizer. Please try again.");
//                 }
//             };

//             const debounceTimeout = setTimeout(updateOrganizer, 500);
//             setTimeout(() => setEditedField(null), 3000);
//             return () => clearTimeout(debounceTimeout);
//         }
//     }, [organizer, oragnizerId, dataFetched]);

//     const handleCopy = async () => {
//         const profileUrl = `https://avenue.tickets/creator/${organizer.url}`;
//         try {
//             await navigator.clipboard.writeText(profileUrl);
//             setCopied(true);

//             setTimeout(() => setCopied(false), 3000);
//         } catch (error) {
//             console.error("Failed to copy URL:", error);
//         }
//     };

//     return (
//         <SidebarLayout>
//             <div className="m-4 mb-2 z-20">
//                 <SidebarToggle />
//             </div>

//             {
//                 loading ? (
//                     <div className='text-center mt-10'>
//                         <Spin size="large" />
//                     </div>
//                 ) : (
//                     <>
//                         <div className="min-h-screen text-white p-4 @container">
//                             <div className="max-w-7xl mx-auto flex flex-col @4xl:flex-row gap-6">
//                                 {/* Profile Card */}
//                                 <div className="w-full @3xl:w-80 lg:flex-shrink-0">
//                                     <div className="border border-white/5 p-6 rounded-[20px] flex flex-col gap-4">
//                                         <div className="flex flex-col gap-y-6">
//                                             <div className="flex justify-center lg:justify-start">
//                                                 <div className="w-20 h-20 rounded-full overflow-hidden bg-[#10b981] flex items-center justify-center">
//                                                     <span className="text-xl font-semibold text-black">
//                                                         {organizer?.name?.slice(0, 2).toUpperCase() || ''}
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             <div className="text-center lg:text-left">
//                                                 <h1 className="text-2xl font-medium">{organizer.name}</h1>
//                                                 <div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
//                                                     <Icons.Calendar />
//                                                     <p className="text-white/50 text-sm">
//                                                         Joined on {formattedDate}
//                                                     </p>
//                                                 </div>
//                                             </div>

//                                             <div className="flex bg-[#787878] p-1 rounded-full bg-opacity-25">
//                                                 <Link
//                                                     to="/profile"
//                                                     className="flex-1 py-2 text-center transition-all text-sm duration-300 ease-in-out text-gray-300 "
//                                                     aria-pressed="true"
//                                                 >
//                                                     Attendee
//                                                 </Link>
//                                                 <button
//                                                     className="flex-1 py-2 text-center transition-all text-sm duration-300 ease-in-out bg-[#787878] text-white font-medium rounded-full p-2 bg-opacity-25"
//                                                     aria-pressed="false"
//                                                 >
//                                                     Creator
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <button
//                                             className="text-sm font-medium text-white border border-white/5 rounded-full h-10 px-4 w-full flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all duration-300 ease-in-out"
//                                             onClick={handleCopy}
//                                         >
//                                             <Icons.Link />
//                                             <span className="text-sm font-medium">
//                                                 {copied ? "Link Copied!" : "Copy Profile Link"}
//                                             </span>
//                                         </button>

//                                         <div className="border border-[#222222] rounded-xl p-3">
//                                             <div className="flex justify-center items-center space-x-6">
//                                                 <Link to="/organizer/events" className="flex flex-col items-center gap-1.5">
//                                                     <span className="text-xs text-white/50">Live Events</span>
//                                                     <span className="text-lg font-semibold text-white">{filteredEvents.length}</span>
//                                                 </Link>
//                                                 <div className="w-px bg-white/10 h-10"></div>
//                                                 <Link to="/organizer/events#past" className="flex flex-col items-center gap-1.5">
//                                                     <span className="text-xs text-white/50">Past Events</span>
//                                                     <span className="text-lg font-semibold text-white">
//                                                         {filteredPastEvents.length}
//                                                     </span>
//                                                 </Link>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Main Content */}
//                                 <div className="flex-1">
//                                     <div className="space-y-6">
//                                         {/* Business Info Section */}
//                                         <ProfileSection
//                                             icon={() => (
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     width="16"
//                                                     height="16"
//                                                     viewBox="0 0 16 16"
//                                                     fill="none"
//                                                 >
//                                                     <path
//                                                         fillRule="evenodd"
//                                                         clipRule="evenodd"
//                                                         d="M11 4V3C11 2.46957 10.7893 1.96086 10.4142 1.58579C10.0391 1.21071 9.53043 1 9 1H7C6.46957 1 5.96086 1.21071 5.58579 1.58579C5.21071 1.96086 5 2.46957 5 3V4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V9C2 9.53043 2.21071 10.0391 2.58579 10.4142C2.96086 10.7893 3.46957 11 4 11H12C12.5304 11 13.0391 10.7893 13.4142 10.4142C13.7893 10.0391 14 9.53043 14 9V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H11Z"
//                                                         fill="white"
//                                                         fillOpacity="0.5"
//                                                     />
//                                                 </svg>
//                                             )}
//                                             title="Business Info"
//                                         >
//                                             <div className="flex flex-col gap-8">
//                                                 <InputField
//                                                     label="Business Name"
//                                                     description="Will be displayed on your event pages"
//                                                     placeholder="Enter business name"
//                                                     value={organizer.name === 'undefined' ? "" : organizer.name}
//                                                     onChange={(e) =>
//                                                         setOrganizer((prev) => ({ ...prev, name: e.target.value }))
//                                                     }
//                                                     fieldName="name"
//                                                     editedField={editedField}
//                                                 />

//                                                 <InputField
//                                                     label="Email Id"
//                                                     description="Will be displayed for enquiries from users"
//                                                     placeholder="Enter email id"
//                                                     value={organizer.email === 'undefined' ? "" : organizer.email}
//                                                     onChange={(e) =>
//                                                         setOrganizer((prev) => ({ ...prev, email: e.target.value }))
//                                                     }
//                                                     fieldName="email"
//                                                     editedField={editedField}
//                                                 />

//                                                 <PhoneInput
//                                                     value={organizer.phone === 'undefined' ? "" : organizer.phone}
//                                                     onChange={(e) =>
//                                                         setOrganizer((prev) => ({ ...prev, phone: e.target.value }))
//                                                     }
//                                                     fieldName="phone"
//                                                     editedField={editedField}
//                                                 />

//                                                 <UrlInputField
//                                                     label="Custom Profile Link"
//                                                     description="https://avenue.tickets/creator/"
//                                                     placeholder="Enter business name"
//                                                     value={organizer.url === 'undefined' ? "" : organizer.url}
//                                                     onChange={(e) =>
//                                                         setOrganizer((prev) => ({ ...prev, url: e.target.value }))
//                                                     }
//                                                     fieldName="url"
//                                                     editedField={editedField}
//                                                 />
//                                             </div>
//                                         </ProfileSection>

//                                         {/* Social Links Section */}
//                                         <ProfileSection icon={Icons.Link} title="Social links">
//                                             <div className="flex flex-col gap-8">
//                                                 <SocialLinkInput
//                                                     label="Instagram"
//                                                     placeholder="instagram.com/alimamedgasanov"
//                                                     icon={Icons.Link}
//                                                     description="Your Instagram profile link"
//                                                     value={organizer.instagram === 'undefined' ? "" : organizer.instagram}
//                                                     onChange={(e) =>
//                                                         setOrganizer((prev) => ({ ...prev, instagram: e.target.value }))
//                                                     }
//                                                     fieldName="instagram"
//                                                     editedField={editedField}
//                                                 />
//                                                 <SocialLinkInput
//                                                     label="X (Twitter)"
//                                                     placeholder="x.com/alimamedgasanov"
//                                                     icon={Icons.Link}
//                                                     description="Your X (Twitter) profile link"
//                                                     value={organizer.twitter === 'undefined' ? "" : organizer.twitter}
//                                                     onChange={(e) =>
//                                                         setOrganizer((prev) => ({ ...prev, twitter: e.target.value }))
//                                                     }
//                                                     fieldName="twitter"
//                                                     editedField={editedField}
//                                                 />
//                                                 <SocialLinkInput
//                                                     label="Website"
//                                                     placeholder="alimamedgasanov.com"
//                                                     icon={IoGlobeOutline}
//                                                     description="Your personal or business website"
//                                                     value={organizer.website === 'undefined' ? "" : organizer.website}
//                                                     onChange={(e) =>
//                                                         setOrganizer((prev) => ({ ...prev, website: e.target.value }))
//                                                     }
//                                                     fieldName="website"
//                                                     editedField={editedField}
//                                                 />
//                                             </div>
//                                         </ProfileSection>

//                                         {/* Legal Section */}
//                                         <ProfileSection icon={IoDocumentTextSharp} title="Legal">
//                                             <div className="flex flex-col gap-8">
//                                                 {/* Contact Support */}
//                                                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                                                     <div className="flex flex-col gap-3">
//                                                         <span className="text-sm font-medium text-white">
//                                                             Contact link
//                                                         </span>
//                                                         <span className="text-sm text-white/60">
//                                                             Need help? We&apos;re here for you
//                                                         </span>
//                                                     </div>
//                                                     <button className="bg-primary border text-sm text-center text-white border-white/10 rounded-full px-5 py-2.5 focus:outline-none w-full lg:w-auto flex items-center justify-center gap-2">
//                                                         <svg
//                                                             xmlns="http://www.w3.org/2000/svg"
//                                                             width="16"
//                                                             height="16"
//                                                             viewBox="0 0 16 16"
//                                                             fill="none"
//                                                         >
//                                                             <path
//                                                                 fillRule="evenodd"
//                                                                 clipRule="evenodd"
//                                                                 d="M1 8C1 4.57 4.262 2 8 2C11.738 2 15 4.57 15 8C15 11.43 11.738 14 8 14C7.577 14 7.162 13.968 6.759 13.906C5.859 14.48 4.818 14.854 3.699 14.966C3.55984 14.9799 3.41957 14.9547 3.29401 14.8931C3.16846 14.8315 3.06263 14.736 2.98847 14.6174C2.91431 14.4989 2.87478 14.3619 2.87435 14.2221C2.87391 14.0822 2.91258 13.945 2.986 13.826C3.218 13.448 3.381 13.022 3.455 12.566C1.979 11.486 1 9.86 1 8Z"
//                                                                 fill="white"
//                                                                 fillOpacity="0.5"
//                                                             />
//                                                         </svg>
//                                                         Chat with support
//                                                     </button>
//                                                 </div>

//                                                 {/* Terms and Privacy */}
//                                                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                                                     <div className="flex flex-col gap-3">
//                                                         <span className="text-sm font-medium text-white">
//                                                             Terms and Conditions
//                                                         </span>
//                                                         <span className="text-sm text-white/60">
//                                                             View legal documents
//                                                         </span>
//                                                     </div>
//                                                     <Link to="/terms-and-conditions" className="bg-primary border text-sm text-center text-white border-white/10 rounded-full px-5 py-2.5 focus:outline-none w-full lg:w-auto flex items-center justify-center gap-2">
//                                                         Terms and Conditions
//                                                         <svg
//                                                             xmlns="http://www.w3.org/2000/svg"
//                                                             width="16"
//                                                             height="16"
//                                                             viewBox="0 0 16 16"
//                                                             fill="none"
//                                                         >
//                                                             <path
//                                                                 fillRule="evenodd"
//                                                                 clipRule="evenodd"
//                                                                 d="M4.22007 11.78C4.07962 11.6394 4.00073 11.4488 4.00073 11.25C4.00073 11.0512 4.07962 10.8606 4.22007 10.72L9.44007 5.5H5.75007C5.55116 5.5 5.36039 5.42098 5.21974 5.28033C5.07909 5.13968 5.00007 4.94891 5.00007 4.75C5.00007 4.55109 5.07909 4.36032 5.21974 4.21967C5.36039 4.07902 5.55116 4 5.75007 4H11.2501C11.449 4 11.6398 4.07902 11.7804 4.21967C11.9211 4.36032 12.0001 4.55109 12.0001 4.75V10.25C12.0001 10.4489 11.9211 10.6397 11.7804 10.7803C11.6398 10.921 11.449 11 11.2501 11C11.0512 11 10.8604 10.921 10.7197 10.7803C10.5791 10.6397 10.5001 10.4489 10.5001 10.25V6.56L5.28007 11.78C5.13945 11.9205 4.94882 11.9993 4.75007 11.9993C4.55132 11.9993 4.3607 11.9205 4.22007 11.78Z"
//                                                                 fill="white"
//                                                                 fillOpacity="0.5"
//                                                             />
//                                                         </svg>
//                                                     </Link>
//                                                 </div>

//                                                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                                                     <div className="flex flex-col gap-3">
//                                                         <span className="text-sm font-medium text-white">
//                                                             Privacy Policy
//                                                         </span>
//                                                         <span className="text-sm text-white/60">
//                                                             View legal documents
//                                                         </span>
//                                                     </div>
//                                                     <Link to="/privacy-policy" className="bg-primary border text-sm text-center text-white border-white/10 rounded-full px-5 py-2.5 focus:outline-none w-full lg:w-auto flex items-center justify-center gap-2">
//                                                     Privacy Policy
//                                                         <svg
//                                                             xmlns="http://www.w3.org/2000/svg"
//                                                             width="16"
//                                                             height="16"
//                                                             viewBox="0 0 16 16"
//                                                             fill="none"
//                                                         >
//                                                             <path
//                                                                 fillRule="evenodd"
//                                                                 clipRule="evenodd"
//                                                                 d="M4.22007 11.78C4.07962 11.6394 4.00073 11.4488 4.00073 11.25C4.00073 11.0512 4.07962 10.8606 4.22007 10.72L9.44007 5.5H5.75007C5.55116 5.5 5.36039 5.42098 5.21974 5.28033C5.07909 5.13968 5.00007 4.94891 5.00007 4.75C5.00007 4.55109 5.07909 4.36032 5.21974 4.21967C5.36039 4.07902 5.55116 4 5.75007 4H11.2501C11.449 4 11.6398 4.07902 11.7804 4.21967C11.9211 4.36032 12.0001 4.55109 12.0001 4.75V10.25C12.0001 10.4489 11.9211 10.6397 11.7804 10.7803C11.6398 10.921 11.449 11 11.2501 11C11.0512 11 10.8604 10.921 10.7197 10.7803C10.5791 10.6397 10.5001 10.4489 10.5001 10.25V6.56L5.28007 11.78C5.13945 11.9205 4.94882 11.9993 4.75007 11.9993C4.55132 11.9993 4.3607 11.9205 4.22007 11.78Z"
//                                                                 fill="white"
//                                                                 fillOpacity="0.5"
//                                                             />
//                                                         </svg>
//                                                     </Link>
//                                                 </div>

//                                                 {/* Logout */}
//                                                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                                                     <div className="flex flex-col gap-3">
//                                                         <span className="text-sm font-medium">Logout</span>
//                                                         <span className="text-sm text-white/60">
//                                                             You will be logged out of your account
//                                                         </span>
//                                                     </div>
//                                                     <button
//                                                         onClick={() => setIsLogoutDialogOpen(true)}
//                                                         className="bg-primary border text-sm text-center border-white/10 rounded-full px-5 py-2.5 focus:outline-none w-full lg:w-auto flex items-center justify-center gap-2"
//                                                     >
//                                                         <Icons.Logout className="w-4 h-4" />
//                                                         Logout of account
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </ProfileSection>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div >
//                     </>
//                 )
//             }
//             <LogoutDialog
//                 isOpen={isLogoutDialogOpen}
//                 onClose={() => setIsLogoutDialogOpen(false)}
//                 organizer={organizer}
//             />
//         </SidebarLayout >
//     );
// };

// export default OrganizerProfile;

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Spin } from "antd";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import SidebarToggle from "../../components/layouts/SidebarToggle";
import ImageCropper from "../../components/ImageCropper";
import url from "../../constants/url";
import {
  IoLinkSharp,
  IoGlobeOutline,
  IoDocumentTextSharp,
} from "react-icons/io5";

// Define icon components for reuse
const Icons = {
  Link: ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.91401 6.025C9.05463 5.88455 9.24526 5.80566 9.44401 5.80566C9.64276 5.80566 9.83338 5.88455 9.97401 6.025C10.2991 6.35001 10.5569 6.73587 10.7328 7.16053C10.9087 7.58519 10.9993 8.04035 10.9993 8.5C10.9993 8.95966 10.9087 9.41482 10.7328 9.83948C10.5569 10.2641 10.2991 10.65 9.97401 10.975L7.97401 12.975C7.36076 13.5875 6.54208 13.9506 5.67646 13.9941C4.81085 14.0376 3.95988 13.7584 3.2883 13.2106C2.61672 12.6627 2.1723 11.8851 2.04109 11.0284C1.90987 10.1717 2.10119 9.29676 2.57801 8.573C2.68968 8.41183 2.86003 8.3008 3.05257 8.2637C3.24511 8.22659 3.44452 8.26637 3.60809 8.3745C3.77166 8.48263 3.88638 8.65052 3.92767 8.8422C3.96896 9.03388 3.93355 9.23412 3.82901 9.4C3.55629 9.81374 3.44687 10.314 3.52196 10.8038C3.59705 11.2936 3.8513 11.7381 4.23543 12.0511C4.61956 12.3642 5.10623 12.5234 5.60111 12.4981C6.09599 12.4728 6.56385 12.2646 6.91401 11.914L8.91401 9.914C9.28895 9.53895 9.49958 9.03033 9.49958 8.5C9.49958 7.96968 9.28895 7.46106 8.91401 7.086C8.77356 6.94538 8.69467 6.75476 8.69467 6.556C8.69467 6.35725 8.77356 6.16563 8.91401 6.025Z"
        fill="white"
        fillOpacity="0.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.08598 9.97548C6.94536 10.1159 6.75474 10.1948 6.55598 10.1948C6.35723 10.1948 6.16661 10.1159 6.02598 9.97548C5.70094 9.65047 5.4431 9.26461 5.26719 8.83995C5.09127 8.41529 5.00073 7.96013 5.00073 7.50048C5.00073 7.04082 5.09127 6.58566 5.26719 6.161C5.4431 5.73634 5.70094 5.35049 6.02598 5.02548L8.02598 3.02548C8.63924 2.41302 9.45792 2.04988 10.3235 2.00637C11.1891 1.96286 12.0401 2.24206 12.7117 2.78993C13.3833 3.3378 13.8277 4.11536 13.9589 4.97207C14.0901 5.82879 13.8988 6.70372 13.422 7.42748C13.3103 7.58865 13.14 7.69968 12.9474 7.73678C12.7549 7.77389 12.5555 7.73411 12.3919 7.62598C12.2283 7.51785 12.1136 7.34996 12.0723 7.15828C12.031 6.9666 12.0664 6.76636 12.171 6.60048C12.4437 6.18674 12.5531 5.6865 12.478 5.1967C12.4029 4.70689 12.1487 4.2624 11.7646 3.94936C11.3804 3.63633 10.8938 3.47704 10.3989 3.50238C9.904 3.52771 9.43615 3.73585 9.08599 4.08648L7.08598 6.08648C6.71104 6.46153 6.50041 6.97015 6.50041 7.50048C6.50041 8.0308 6.71104 8.53942 7.08598 8.91448C7.22644 9.0551 7.30532 9.24573 7.30532 9.44448C7.30532 9.64323 7.22644 9.83385 7.08598 9.97448V9.97548Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  ),
  Calendar: ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 1.25C2 1.05109 2.07902 0.860322 2.21967 0.71967C2.36032 0.579018 2.55109 0.5 2.75 0.5C2.94891 0.5 3.13968 0.579018 3.28033 0.71967C3.42098 0.860322 3.5 1.05109 3.5 1.25V2.5H8.5V1.25C8.5 1.05109 8.57902 0.860322 8.71967 0.71967C8.86032 0.579018 9.05109 0.5 9.25 0.5C9.44891 0.5 9.63968 0.579018 9.78033 0.71967C9.92098 0.860322 10 1.05109 10 1.25V2.5C10.5304 2.5 11.0391 2.71071 11.4142 3.08579C11.7893 3.46086 12 3.96957 12 4.5V11.5C12 12.0304 11.7893 12.5391 11.4142 12.9142C11.0391 13.2893 10.5304 13.5 10 13.5H2C1.46957 13.5 0.960859 13.2891 0.585786 12.9142C0.210714 12.5391 0 12.0304 0 11.5V4.5C0 3.96957 0.210714 3.46086 0.585786 3.08579C0.960859 2.71071 1.46957 2.5 2 2.5V1.25ZM2.5 5.5C2.23478 5.5 1.98043 5.60536 1.79289 5.79289C1.60536 5.98043 1.5 6.23478 1.5 6.5V11C1.5 11.2652 1.60536 11.5196 1.79289 11.7071C1.98043 11.8946 2.23478 12 2.5 12H9.5C9.76522 12 10.0196 11.8946 10.2071 11.7071C10.3946 11.5196 10.5 11.2652 10.5 11V6.5C10.5 6.23478 10.3946 5.98043 10.2071 5.79289C10.0196 5.60536 9.76522 5.5 9.5 5.5H2.5Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  ),
  Logout: ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.0001 7.125C21.0001 6.03098 20.5655 4.98177 19.7919 4.20818C19.0183 3.4346 17.9691 3 16.8751 3H12.3751C11.2811 3 10.2319 3.4346 9.45829 4.20818C8.68471 4.98177 8.25011 6.03098 8.25011 7.125V7.875C8.25011 8.17337 8.36864 8.45952 8.57961 8.6705C8.79059 8.88147 9.07674 9 9.37511 9C9.67348 9 9.95963 8.88147 10.1706 8.6705C10.3816 8.45952 10.5001 8.17337 10.5001 7.875V7.125C10.5001 6.09 11.3401 5.25 12.3751 5.25H16.8751C17.9101 5.25 18.7501 6.09 18.7501 7.125V16.875C18.7501 17.91 17.9101 18.75 16.8751 18.75H12.3751C11.3401 18.75 10.5001 17.91 10.5001 16.875V16.125C10.5001 15.8266 10.3816 15.5405 10.1706 15.3295C9.95963 15.1185 9.67348 15 9.37511 15C9.07674 15 8.79059 15.1185 8.57961 15.3295C8.36864 15.5405 8.25011 15.8266 8.25011 16.125V16.875C8.25011 17.969 8.68471 19.0182 9.45829 19.7918C10.2319 20.5654 11.2811 21 12.3751 21H16.8751C17.9691 21 19.0183 20.5654 19.7919 19.7918C20.5655 19.0182 21.0001 17.969 21.0001 16.875V7.125ZM6.79511 7.83C6.58417 7.61932 6.29823 7.50099 6.00011 7.50099C5.70198 7.50099 5.41605 7.61932 5.20511 7.83L1.83011 11.205C1.61943 11.4159 1.5011 11.7019 1.5011 12C1.5011 12.2981 1.61943 12.5841 1.83011 12.795L5.20511 16.17C5.3081 16.2805 5.4323 16.3692 5.5703 16.4307C5.7083 16.4922 5.85727 16.5252 6.00832 16.5279C6.15938 16.5306 6.30942 16.5028 6.44951 16.4462C6.58959 16.3896 6.71684 16.3054 6.82367 16.1986C6.93049 16.0917 7.01471 15.9645 7.07129 15.8244C7.12787 15.6843 7.15566 15.5343 7.153 15.3832C7.15033 15.2322 7.11727 15.0832 7.05578 14.9452C6.99429 14.8072 6.90564 14.683 6.79511 14.58L5.34011 13.125H16.1251C16.4235 13.125 16.7096 13.0065 16.9206 12.7955C17.1316 12.5845 17.2501 12.2984 17.2501 12C17.2501 11.7016 17.1316 11.4155 16.9206 11.2045C16.7096 10.9935 16.4235 10.875 16.1251 10.875H5.34011L6.79511 9.42C7.00578 9.20906 7.12412 8.92313 7.12412 8.625C7.12412 8.32687 7.00578 8.04094 6.79511 7.83Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  ),
};

// A reusable ProfileSection component for grouping profile fields
const ProfileSection = ({ icon: Icon, title, children }) => (
  <div className="rounded-xl border border-white/10 overflow-hidden mb-6">
    <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-zinc-400" />}
      <span className="text-sm font-medium">{title}</span>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

// Input field components
const InputField = ({
  label,
  description,
  type = "text",
  placeholder,
  value,
  onChange,
  fieldName,
  editedField,
}) => (
  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-white/60">{description}</span>
    </div>
    <div className="relative w-full lg:w-1/2">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border bg-primary text-sm border-white/10 h-10 rounded-lg px-5 py-2.5 focus:outline-none w-full pr-14"
        aria-label={label}
      />
      {editedField === fieldName && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xs">
          Saved
        </span>
      )}
    </div>
  </div>
);

const UrlInputField = ({
  label,
  description,
  type = "text",
  placeholder,
  value,
  onChange,
  fieldName,
  editedField,
}) => {
  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    const sanitizedValue = rawValue.replace(/[^a-zA-Z0-9-]/g, "");
    onChange({ target: { value: sanitizedValue } });
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-white/60">{description}</span>
      </div>
      <div className="relative w-full lg:w-1/2">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="border bg-primary text-sm border-white/10 h-10 rounded-lg px-5 py-2.5 focus:outline-none w-full pr-14"
          aria-label={label}
        />
        {editedField === fieldName && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xs">
            Saved
          </span>
        )}
      </div>
    </div>
  );
};

const PhoneInput = ({ value, onChange, fieldName, editedField }) => (
  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">Phone Number</span>
      <span className="text-sm text-white/60">
        Will be displayed for enquiries from users
      </span>
    </div>
    <div className="relative w-full lg:w-1/2">
      <div className="flex items-center bg-primary border border-white/10 h-10 rounded-lg px-2 py-2.5 w-full">
        <div className="flex items-center h-10 gap-1 px-1 pr-3 border-r border-white/10">
          <img
            src="https://flagcdn.com/w40/us.png"
            alt="US Flag"
            className="w-4 h-4 rounded-full"
          />
          <span className="text-white text-sm">+1</span>
        </div>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={value}
          onChange={onChange}
          className="bg-transparent text-sm flex-1 focus:outline-none px-2 text-white mx-3 pr-14"
          aria-label="Phone number"
        />
        {editedField === fieldName && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xs">
            Saved
          </span>
        )}
      </div>
    </div>
  </div>
);

const SocialLinkInput = ({
  label,
  placeholder,
  value,
  onChange,
  description = "Will be shown to attendees",
  icon: Icon = IoLinkSharp,
  fieldName,
  editedField,
}) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-white/60">{description}</span>
    </div>
    <div className="relative w-full lg:w-1/2">
      <div className="flex items-center bg-primary border border-white/10 h-10 rounded-lg px-2 py-2.5 w-full">
        <div className="flex items-center h-10 gap-1 px-1 pr-3 border-r border-white/10">
          <Icon className="w-4 h-4 text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="bg-transparent text-sm flex-1 focus:outline-none px-2 text-white mx-3 pr-14"
          aria-label={label}
        />
        {editedField === fieldName && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xs">
            Saved
          </span>
        )}
      </div>
    </div>
  </div>
);

const LogoutDialog = ({ isOpen, onClose, organizer }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xl z-50"
                onClick={onClose}
            />
            {/* Dialog */}
            <div className="fixed left-1/2 bottom-5 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-[95%] max-w-[400px] bg-[#111111] rounded-3xl p-6 z-50 h-fit">
                <div className="flex flex-col gap-y-6 w-full h-full relative">
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white border border-white/10 rounded-lg p-1 absolute top-0 right-0"
                        aria-label="Close dialog"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                        >
                            <path
                                d="M15 5L5 15M5 5L15 15"
                                stroke="currentColor"
                                strokeWidth="1.67"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <div className="flex items-center">
                        <div className="bg-[#321C20] p-2 rounded-xl z-[2] border-2 border-[#1A1A1A] h-12 w-12 flex items-center justify-center">
                            <Icons.Logout />
                        </div>
                        <div className="bg-[#10B981]/10 p-2 rounded-xl z-[1] border-2 border-[#1A1A1A] -translate-x-2">
                            <span className="text-lg font-medium text-[#10B981]">
                                {organizer?.name?.slice(0, 2).toUpperCase() || ''}
                            </span>
                        </div>
                    </div>
                    <div className=" flex flex-col gap-3">
                        <span className="text-white text-xl font-medium tracking-tight">
                            Ready to log out?
                        </span>
                        <p className="text-sm text-white/60">
                            You&apos;ll need to verify your phone number to log in again
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                        className="w-full border text-center text-white bg-[#f43f5e] border-white/10 rounded-full h-10 focus:outline-none flex items-center justify-center gap-2 font-medium"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="white"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M14.5 4.75C14.5 4.02065 14.2103 3.32118 13.6946 2.80546C13.1788 2.28973 12.4794 2 11.75 2H8.75001C8.02067 2 7.32119 2.28973 6.80547 2.80546C6.28974 3.32118 6.00001 4.02065 6.00001 4.75V5.25C6.00001 5.44891 6.07903 5.63968 6.21968 5.78033C6.36033 5.92098 6.5511 6 6.75001 6C6.94892 6 7.13969 5.92098 7.28034 5.78033C7.42099 5.63968 7.50001 5.44891 7.50001 5.25V4.75C7.50001 4.06 8.06001 3.5 8.75001 3.5H11.75C12.44 3.5 13 4.06 13 4.75V11.25C13 11.94 12.44 12.5 11.75 12.5H8.75001C8.06001 12.5 7.50001 11.94 7.50001 11.25V10.75C7.50001 10.5511 7.42099 10.3603 7.28034 10.2197C7.13969 10.079 6.94892 10 6.75001 10C6.5511 10 6.36033 10.079 6.21968 10.2197C6.07903 10.3603 6.00001 10.5511 6.00001 10.75V11.25C6.00001 11.9793 6.28974 12.6788 6.80547 13.1945C7.32119 13.7103 8.02067 14 8.75001 14H11.75C12.4794 14 13.1788 13.7103 13.6946 13.1945C14.2103 12.6788 14.5 11.9793 14.5 11.25V4.75ZM5.03001 5.22C4.88939 5.07955 4.69876 5.00066 4.50001 5.00066C4.30126 5.00066 4.11064 5.07955 3.97001 5.22L1.72001 7.47C1.57956 7.61063 1.50067 7.80125 1.50067 8C1.50067 8.19875 1.57956 8.38937 1.72001 8.53L3.97001 10.78C4.03867 10.8537 4.12147 10.9128 4.21347 10.9538C4.30547 10.9948 4.40479 11.0168 4.50549 11.0186C4.60619 11.0204 4.70622 11.0018 4.79961 10.9641C4.893 10.9264 4.97783 10.8703 5.04905 10.799C5.12027 10.7278 5.17641 10.643 5.21413 10.5496C5.25186 10.4562 5.27038 10.3562 5.2686 10.2555C5.26683 10.1548 5.24478 10.0555 5.20379 9.96346C5.1628 9.87146 5.1037 9.78866 5.03001 9.72L4.06001 8.75H11.25C11.4489 8.75 11.6397 8.67098 11.7803 8.53033C11.921 8.38968 12 8.19891 12 8C12 7.80109 11.921 7.61032 11.7803 7.46967C11.6397 7.32902 11.4489 7.25 11.25 7.25H4.06001L5.03001 6.28C5.17046 6.13937 5.24935 5.94875 5.24935 5.75C5.24935 5.55125 5.17046 5.36063 5.03001 5.22Z"
                            />
                        </svg>
                        Log out
                    </button>
                </div>
            </div>
        </>
    );
};
const OrganizerProfile = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [oragnizerId, setOragnizerId] = useState(null);
  const [events, setEvents] = useState([]);
  const [organizer, setOrganizer] = useState({
    bio: "",
    name: "",
    email: "",
    phone: "",
    instagram: "",
    twitter: "",
    website: "",
    url: "",
  });
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredPastEvents, setFilteredPastEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editedField, setEditedField] = useState(null);
  const [copied, setCopied] = useState(false);
  const prevValuesRef = useRef(null);
  const [dataFetched, setDataFetched] = useState(false);

  // States for the flyer image and cropper
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tempImageFile, setTempImageFile] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  // Helper: Convert Blob to WebP File
  const convertBlobToWebP = (blob) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (webpBlob) => {
            if (webpBlob) {
              const file = new File([webpBlob], `${Date.now()}.webp`, {
                type: "image/webp",
              });
              resolve(file);
            } else {
              reject("Failed to convert blob to webp.");
            }
            URL.revokeObjectURL(url);
          },
          "image/webp",
          0.8
        );
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Called when cropping is complete in the ImageCropper
  const handleCropComplete = async ({
    croppedImage,
    fullImage,
    previewUrl,
    dimensions,
  }) => {
    try {
      const webpFile = await convertBlobToWebP(croppedImage);
      setImageFile(webpFile);
      setImagePreview(URL.createObjectURL(webpFile));
      setIsCropperOpen(false);
    } catch (error) {
      console.error("Failed to convert cropped image to webp:", error);
      alert("Failed to process image.");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Handle image file selection and open the cropper
  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(null);
      setImagePreview(null);
      setTempImageFile(file);
      setIsCropperOpen(true);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${month} ${day}, ${hours}:${minutes} ${ampm}`;
  };

  const formattedDate = new Date(organizer.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  // Load organizerId from localStorage
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedUserOrganizerId = localStorage.getItem("organizerId");
      if (storedUserOrganizerId) {
        setOragnizerId(storedUserOrganizerId);
      } else {
        console.warn("No organizerId found in localStorage");
      }
    };
    loadFromLocalStorage();
    const handleStorageChange = () => {
      loadFromLocalStorage();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetch organizer info
  useEffect(() => {
    if (!oragnizerId) return;
    const fetchOrganizer = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/get-organizer/${oragnizerId}`);
        setOrganizer(response.data);
        prevValuesRef.current = response.data;
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching organizer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizer();
  }, [oragnizerId]);

  // Fetch events
  const fetchEvents = async () => {
    if (oragnizerId) {
      try {
        const response = await axios.get(
          `${url}/event/get-event-by-organizer-id/${oragnizerId}`
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
  };

  useEffect(() => {
    if (oragnizerId) {
      fetchEvents();
    }
  }, [oragnizerId]);

  // Filter events into upcoming and past
  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const upcomingEvents = events.filter((event) => {
      const eventDate = new Date(event.start_date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= currentDate && event.explore === "YES";
    });
    setFilteredEvents(upcomingEvents);
    const pastEvents = events.filter((event) => {
      const eventDate = new Date(event.start_date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < currentDate && event.explore === "YES";
    });
    setFilteredPastEvents(pastEvents);
  }, [events]);

  // Auto-save organizer info when changes are detected
  useEffect(() => {
    if (!oragnizerId || !dataFetched || !prevValuesRef.current) return;
    const fieldsToWatch = ["name", "email", "phone", "instagram", "twitter", "website", "url"];
    const hasChangedField = fieldsToWatch.find(
      (field) => prevValuesRef.current[field] !== organizer[field]
    );
    if (hasChangedField) {
      prevValuesRef.current = { ...organizer };
      setEditedField(hasChangedField);
      const updateOrganizer = async () => {
        try {
          const formData = new FormData();
          formData.append("bio", organizer.bio);
          formData.append("name", organizer.name);
          formData.append("email", organizer.email);
          formData.append("phone", organizer.phone);
          formData.append("instagram", organizer.instagram);
          formData.append("twitter", organizer.twitter);
          formData.append("website", organizer.website);
          formData.append("url", organizer.url);
          await axios.put(`${url}/update-organizer/${oragnizerId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Organizer updated successfully!");
        } catch (error) {
          console.error("Error updating organizer:", error);
          alert("Failed to update organizer. Please try again.");
        }
      };
      const debounceTimeout = setTimeout(updateOrganizer, 500);
      setTimeout(() => setEditedField(null), 3000);
      return () => clearTimeout(debounceTimeout);
    }
  }, [organizer, oragnizerId, dataFetched]);

  const handleCopy = async () => {
    const profileUrl = `https://avenue.tickets/creator/${organizer.url}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <SidebarLayout>
      <div className="m-4 mb-2 z-20">
        <SidebarToggle />
      </div>

      {loading ? (
        <div className="text-center mt-10">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Render the ImageCropper component */}
          <ImageCropper
            open={isCropperOpen}
            onOpenChange={setIsCropperOpen}
            imageFile={tempImageFile}
            onCropComplete={handleCropComplete}
          />

          <div className="min-h-screen text-white p-4">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
              {/* Profile Card */}
              <div className="w-full lg:w-80 lg:flex-shrink-0">
                <div className="border border-white/5 p-6 rounded-[20px] flex flex-col gap-4">
                  <div className="flex flex-col gap-y-6">
                    {/* Image Upload Area */}
                    <div className="flex justify-center lg:justify-start">
  <div
    className="w-20 h-20 rounded-full overflow-hidden bg-[#10b981] flex items-center justify-center cursor-pointer"
    onClick={() => document.getElementById('imageInput').click()}
  >
    {imagePreview ? (
      <img
        src={imagePreview}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-xl font-inter font-semibold text-black">
        {organizer.name?.slice(0, 2).toUpperCase() || ''}
      </span>
    )}
  </div>

  <input
    type="file"
    id="imageInput"
    accept="image/*"
    className="hidden"
    onChange={handleImageUpload}
  />
</div>

                    {/* <div className="flex justify-center lg:justify-start">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-[#10b981] flex items-center justify-center">
                        <span className="text-xl font-semibold text-black">
                          {organizer?.name?.slice(0, 2).toUpperCase() || ""}
                        </span>
                      </div>
                    </div> */}
                    <div className="text-center lg:text-left">
                      <h1 className="text-2xl font-medium">{organizer.name}</h1>
                      <div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
                        <Icons.Calendar />
                        <p className="text-white/50 text-sm">
                          Joined on {formattedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex bg-[#787878] p-1 rounded-full bg-opacity-25">
                      <Link
                        to="/profile"
                        className="flex-1 py-2 text-center transition-all text-sm duration-300 ease-in-out text-gray-300"
                      >
                        Attendee
                      </Link>
                      <button className="flex-1 py-2 text-center transition-all text-sm duration-300 ease-in-out bg-[#787878] text-white font-medium rounded-full p-2">
                        Creator
                      </button>
                    </div>
                    <button
                      className="text-sm font-medium text-white border border-white/5 rounded-full h-10 px-4 w-full flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all duration-300"
                      onClick={handleCopy}
                    >
                      <Icons.Link />
                      <span className="text-sm font-medium">
                        {copied ? "Link Copied!" : "Copy Profile Link"}
                      </span>
                    </button>
                    <div className="border border-[#222222] rounded-xl p-3">
                      <div className="flex justify-center items-center space-x-6">
                        <Link
                          to="/organizer/events"
                          className="flex flex-col items-center gap-1.5"
                        >
                          <span className="text-xs text-white/50">Live Events</span>
                          <span className="text-lg font-semibold text-white">
                            {filteredEvents.length}
                          </span>
                        </Link>
                        <div className="w-px bg-white/10 h-10"></div>
                        <Link
                          to="/organizer/events#past"
                          className="flex flex-col items-center gap-1.5"
                        >
                          <span className="text-xs text-white/50">Past Events</span>
                          <span className="text-lg font-semibold text-white">
                            {filteredPastEvents.length}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Main Content (other profile sections) */}
              <div className="flex-1">
                {/* Here you can add additional profile sections (Business Info, Social Links, etc.) */}
                <ProfileSection
                  icon={() => (
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
                        d="M11 4V3C11 2.46957 10.7893 1.96086 10.4142 1.58579C10.0391 1.21071 9.53043 1 9 1H7C6.46957 1 5.96086 1.21071 5.58579 1.58579C5.21071 1.96086 5 2.46957 5 3V4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V9C2 9.53043 2.21071 10.0391 2.58579 10.4142C2.96086 10.7893 3.46957 11 4 11H12C12.5304 11 13.0391 10.7893 13.4142 10.4142C13.7893 10.0391 14 9.53043 14 9V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H11Z"
                        fill="white"
                        fillOpacity="0.5"
                      />
                    </svg>
                  )}
                  title="Business Info"
                >
                  <div className="flex flex-col gap-8">
                    <InputField
                      label="Business Name"
                      description="Will be displayed on your event pages"
                      placeholder="Enter business name"
                      value={organizer.name || ""}
                      onChange={(e) =>
                        setOrganizer((prev) => ({ ...prev, name: e.target.value }))
                      }
                      fieldName="name"
                      editedField={editedField}
                    />
                    <InputField
                      label="Email Id"
                      description="Will be displayed for enquiries from users"
                      placeholder="Enter email id"
                      value={organizer.email || ""}
                      onChange={(e) =>
                        setOrganizer((prev) => ({ ...prev, email: e.target.value }))
                      }
                      fieldName="email"
                      editedField={editedField}
                    />
                    <PhoneInput
                      value={organizer.phone || ""}
                      onChange={(e) =>
                        setOrganizer((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      fieldName="phone"
                      editedField={editedField}
                    />
                    <UrlInputField
                      label="Custom Profile Link"
                      description="https://avenue.tickets/creator/"
                      placeholder="Enter business name"
                      value={organizer.url || ""}
                      onChange={(e) =>
                        setOrganizer((prev) => ({ ...prev, url: e.target.value }))
                      }
                      fieldName="url"
                      editedField={editedField}
                    />
                  </div>
                </ProfileSection>
                <ProfileSection icon={Icons.Link} title="Social links">
                  <div className="flex flex-col gap-8">
                    <SocialLinkInput
                      label="Instagram"
                      placeholder="instagram.com/yourprofile"
                      icon={Icons.Link}
                      description="Your Instagram profile link"
                      value={organizer.instagram || ""}
                      onChange={(e) =>
                        setOrganizer((prev) => ({ ...prev, instagram: e.target.value }))
                      }
                      fieldName="instagram"
                      editedField={editedField}
                    />
                    <SocialLinkInput
                      label="X (Twitter)"
                      placeholder="x.com/yourprofile"
                      icon={Icons.Link}
                      description="Your Twitter profile link"
                      value={organizer.twitter || ""}
                      onChange={(e) =>
                        setOrganizer((prev) => ({ ...prev, twitter: e.target.value }))
                      }
                      fieldName="twitter"
                      editedField={editedField}
                    />
                    <SocialLinkInput
                      label="Website"
                      placeholder="yourwebsite.com"
                      icon={IoGlobeOutline}
                      description="Your personal or business website"
                      value={organizer.website || ""}
                      onChange={(e) =>
                        setOrganizer((prev) => ({ ...prev, website: e.target.value }))
                      }
                      fieldName="website"
                      editedField={editedField}
                    />
                  </div>
                </ProfileSection>
                <ProfileSection icon={IoDocumentTextSharp} title="Legal">
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex flex-col gap-3">
                        <span className="text-sm font-medium text-white">
                          Contact link
                        </span>
                        <span className="text-sm text-white/60">
                          Need help? We&apos;re here for you
                        </span>
                      </div>
                      <button className="bg-primary border text-sm text-center text-white border-white/10 rounded-full px-5 py-2.5 w-full lg:w-auto flex items-center justify-center gap-2">
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
                            d="M1 8C1 4.57 4.262 2 8 2C11.738 2 15 4.57 15 8C15 11.43 11.738 14 8 14C4.262 14 1 11.43 1 8Z"
                            fill="white"
                            fillOpacity="0.5"
                          />
                        </svg>
                        Chat with support
                      </button>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex flex-col gap-3">
                        <span className="text-sm font-medium text-white">
                          Terms and Conditions
                        </span>
                        <span className="text-sm text-white/60">
                          View legal documents
                        </span>
                      </div>
                      <Link
                        to="/terms-and-conditions"
                        className="bg-primary border text-sm text-center text-white border-white/10 rounded-full px-5 py-2.5 w-full lg:w-auto flex items-center justify-center gap-2"
                      >
                        Terms and Conditions
                      </Link>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex flex-col gap-3">
                        <span className="text-sm font-medium text-white">
                          Privacy Policy
                        </span>
                        <span className="text-sm text-white/60">
                          View legal documents
                        </span>
                      </div>
                      <Link
                        to="/privacy-policy"
                        className="bg-primary border text-sm text-center text-white border-white/10 rounded-full px-5 py-2.5 w-full lg:w-auto flex items-center justify-center gap-2"
                      >
                        Privacy Policy
                      </Link>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex flex-col gap-3">
                        <span className="text-sm font-medium">Logout</span>
                        <span className="text-sm text-white/60">
                          You will be logged out of your account
                        </span>
                      </div>
                      <button
                        onClick={() => setIsLogoutDialogOpen(true)}
                        className="bg-primary border text-sm text-center border-white/10 rounded-full px-5 py-2.5 w-full lg:w-auto flex items-center justify-center gap-2"
                      >
                        <Icons.Logout className="w-4 h-4" />
                        Logout of account
                      </button>
                    </div>
                  </div>
                </ProfileSection>
              </div>
            </div>
          </div>
        </>
      )}
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        organizer={organizer}
      />
    </SidebarLayout>
  );
};

export default OrganizerProfile;
