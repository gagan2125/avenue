import React, { useState, useEffect } from 'react';
import { Calendar, Calendar1Icon, ChevronDown, CircleUser, Globe, Locate, LockIcon, MinusIcon, Navigation, Paperclip, PlusIcon } from 'lucide-react';
import "../../css/global.css"
import axios from "axios"
import url from "../../constants/url"
import { Link, useParams } from 'react-router-dom';
import { IoLockClosed, IoDocumentTextSharp } from "react-icons/io5";
import { MdDone } from "react-icons/md";
import { FaCheck } from 'react-icons/fa';
import ImageCropper from "../../components/ImageCropper";
import { motion } from "framer-motion"


const Profile = () => {
    const { id } = useParams();
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState({});
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [firstNameState, setFirstNameState] = useState({ isFocused: false, isLoading: false, isSuccess: false });
    const [emailState, setEmailState] = useState({ isFocused: false, isLoading: false, isSuccess: false });
    const [phoneState, setPhoneState] = useState({ isFocused: false, isLoading: false, isSuccess: false });

    const [activeTab, setActiveTab] = useState("live");
    const [organizer, setOrganizer] = useState({});
    const [events, setEvents] = useState([]);
    const [book, setBook] = useState([]);
    const [image, setImage] = useState(null);
    const [showButtons, setShowButtons] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [tempImageFile, setTempImageFile] = useState(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [showUpdateNotification, setShowUpdateNotification] = useState(false)

    const org_id = localStorage.getItem('user_organizer_id') || {};

    useEffect(() => {
        const loadFromLocalStorage = () => {
            const storedUserId = localStorage.getItem('userID');
            setUserId(storedUserId);
        };
        loadFromLocalStorage();
        const handleStorageChange = () => {
            loadFromLocalStorage();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            axios
                .get(`${url}/auth/get-user-by-id/${userId}`)
                .then((response) => {
                    const userData = response.data;
                    setUser(userData)
                    setFirstName(userData.firstName + " " + userData.lastName);
                    setEmail(userData.email);
                    setPhoneNumber(userData.phoneNumber);
                    setProfileImage(userData.profile_image)
                    console.log("show in events", response.data)
                    if (userData.showInEvent === "YES") {
                        setIsChecked(true);
                    } else {
                        setIsChecked(false);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data", error);
                    setLoading(false);
                });
        }
    }, [userId]);

    const handlePrivacyChange = async (checked) => {
        setIsChecked(checked);

        try {
            const response = await fetch(`${url}/update-privacy-showin-event/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    showInEvent: checked ? "YES" : "NO",
                }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error('Failed to update privacy status', error);
        }
    };

    const fetchOrganizer = async () => {
        if (org_id) {
            try {
                const response = await axios.get(`${url}/get-organizer/${org_id}`);
                setOrganizer(response.data);
            } catch (error) {
                console.error("Error fetching organizer:", error);
            }
        } else {
            console.log("not found")
        }
    };

    const fetchEvents = async () => {
        if (org_id) {
            try {
                const response = await axios.get(`${url}/event/get-event-by-organizer-id/${org_id}`);
                setEvents(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        } else {
            console.log("not found")
        }
    }

    useEffect(() => {
        if (org_id) {
            fetchOrganizer();
            fetchEvents()
        }
    }, [org_id]);

    const fetchBook = async () => {
        try {
            const response = await axios.get(`${url}/get-booking-lists/${userId}`);
            setBook(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchBook();
    }, [userId]);

    const handleSubmit = (field) => {
        let formData = new FormData();

        if (field === "firstName") {
            const nameParts = firstName.split(' ').filter(part => part !== '');
            formData.append("firstName", nameParts[0] || '');
            formData.append("lastName", nameParts.slice(1).join(' '));
        } else if (field === "email") {
            formData.append("email", email);
        } else if (field === "phone") {
            formData.append("phoneNumber", "+1" + phoneNumber);
        }

        if (profilePhoto) {
            formData.append("profile_image", profilePhoto);
        }

        const setStateFunction = (stateUpdater) => {
            stateUpdater((prevState) => ({
                ...prevState,
                isLoading: true,
                isSuccess: false,
            }));
        };

        if (field === "firstName") setStateFunction(setFirstNameState);
        if (field === "email") setStateFunction(setEmailState);
        if (field === "phone") setStateFunction(setPhoneState);

        axios
            .put(`${url}/auth/update-user/${userId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (field === "firstName") setFirstNameState((prev) => ({ ...prev, isLoading: false, isSuccess: true }));
                if (field === "email") setEmailState((prev) => ({ ...prev, isLoading: false, isSuccess: true }));
                if (field === "phone") setPhoneState((prev) => ({ ...prev, isLoading: false, isSuccess: true }));

                if (field === "firstName") {
                    localStorage.setItem("userName", firstName);
                }

                setShowUpdateNotification(true)
                setTimeout(() => {
                    setShowUpdateNotification(false);
                    setShowButtons(false)
                }, 3000);

                setTimeout(() => {
                    if (field === "firstName") setFirstNameState((prev) => ({ ...prev, isSuccess: false }));
                    if (field === "email") setEmailState((prev) => ({ ...prev, isSuccess: false }));
                    if (field === "phone") setPhoneState((prev) => ({ ...prev, isSuccess: false }));
                }, 2000);
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                if (field === "firstName") setFirstNameState((prev) => ({ ...prev, isLoading: false }));
                if (field === "email") setEmailState((prev) => ({ ...prev, isLoading: false }));
                if (field === "phone") setPhoneState((prev) => ({ ...prev, isLoading: false }));
            });
    };

    const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Clear previous image states
            setProfilePhoto(null);
            setImage(null);
            setTempImageFile(file);
            setIsCropperOpen(true);
        }
    };

    // Helper: Convert blob to WebP file
    const convertBlobToWebP = (blob) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const blobUrl = URL.createObjectURL(blob);
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
                        URL.revokeObjectURL(blobUrl);
                    },
                    "image/webp",
                    0.8
                );
            };
            img.onerror = reject;
            img.src = blobUrl;
        });
    };

    // Called when cropping is complete in the ImageCropper.
    const handleCropComplete = async ({ croppedImage, previewUrl }) => {
        try {
            const webpFile = await convertBlobToWebP(croppedImage);
            setProfilePhoto(webpFile);
            setImage(URL.createObjectURL(webpFile));
            setIsCropperOpen(false);
            // Optionally show buttons for submit/cancel if needed.
            setShowButtons(true);
        } catch (error) {
            console.error("Failed to convert cropped image:", error);
            alert("Failed to process image.");
        }
    };

    const handleNameChange = (e) => {
        const fullName = e.target.value;
        setFirstName(fullName);
    };

    return (
        <div className="min-h-screen bg-primary text-white p-4 lg:p-6">
            <ImageCropper
                open={isCropperOpen}
                onOpenChange={setIsCropperOpen}
                imageFile={tempImageFile}
                onCropComplete={handleCropComplete}
            />
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

                <div className="w-full lg:w-80 lg:flex-shrink-0">
                    <div className="border border-[#222222] px-4 py-4 rounded-2xl">

                        <div className="flex justify-center sm:justify-start">
                            {/* New clickable circular div for image upload that triggers cropping */}
                            <div
                                className="w-20 h-20 rounded-full overflow-hidden bg-[#10b981] flex items-center justify-center cursor-pointer"
                                onClick={() => document.getElementById("imageInput").click()}
                            >
                                {image ? (
                                    <img src={image || profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl font-inter font-semibold text-black">
                                        {firstName?.slice(0, 2).toUpperCase() || ""}
                                    </span>
                                )}

                            </div>
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            {showButtons && (
                                <div className="flex space-x-2 mt-2 ml-2">
                                    <button onClick={() => handleSubmit("profile_image")} className="text-green-500 text-2xl">
                                        <MdDone />
                                    </button>
                                    <button onClick={() => window.location.reload()} className="text-red-500 text-2xl">
                                        X
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 text-center lg:text-left">
                            <h1 className="text-2xl font-md font-inter">{firstName || 'User'}</h1>
                            <div className="flex items-center justify-center lg:justify-start gap-1 mt-2">
                                <Calendar1Icon size={14} />
                                <p className="text-gray-400 text-xs font-inter">Joined on {formattedDate}</p>
                            </div>
                        </div>

                        <div className="flex bg-[#787878] p-1 rounded-full mt-5 bg-opacity-25">
                            <button
                                onClick={() => setActiveTab("live")}
                                className={`flex-1 py-2 text-center transition-all text-sm font-inter duration-300 ease-in-out ${activeTab === "live"
                                    ? "bg-[#787878] text-white font-medium rounded-full p-2 bg-opacity-25"
                                    : "text-gray-300"
                                    }`}
                            >
                                Attendee
                            </button>
                            <button
                                onClick={() => setActiveTab("past")}
                                className={`flex-1 py-2 text-center transition-all text-sm font-inter duration-300 ease-in-out ${activeTab === "past"
                                    ? "bg-[#787878] text-white font-medium rounded-full p-2 bg-opacity-25"
                                    : "text-gray-300"
                                    }`}
                            >
                                Creator
                            </button>
                        </div>

                        <div className="border border-[#222222] rounded-2xl mt-6 p-3">
                            <div className="flex justify-center items-center space-x-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-inter text-gray-500">Purchased Tickets</span>
                                    <span className="text-lg font-semibold text-white">{book.length}</span>
                                </div>
                                <div className="w-[2px] bg-[#222222] h-10"></div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-inter text-gray-500">Saved Tickets</span>
                                    <span className="text-lg font-semibold text-white">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    {activeTab === "live" && (
                        <div className="space-y-6">

                            <div className="rounded-xl bg-primary border border-[#787878] border-opacity-10">
                                <div className="p-4 border-b border-zinc-800 bg-[#111111] bg-opacity-65 flex items-center gap-2">
                                    <CircleUser className="w-5 h-5 text-zinc-400" />
                                    <span className="text-sm font-medium font-inter">Basic details</span>
                                </div>

                                <div className="p-4 lg:p-6 space-y-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <span className="text-sm font-medium font-inter">Name</span>
                                            <span className="text-xs text-zinc-500 block">This is how others will see you</span>
                                        </div>
                                        <div className="relative w-full lg:w-1/2">
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={handleNameChange}
                                                onFocus={() => setFirstNameState((prev) => ({ ...prev, isFocused: true }))}
                                                onBlur={() => setFirstNameState((prev) => ({ ...prev, isFocused: false }))}
                                                className="bg-primary border text-sm font-inter border-zinc-800 rounded-full px-5 py-2.5 pr-20 focus:outline-none w-full"
                                            />
                                            <button
                                                onClick={() => handleSubmit("firstName")}
                                                className={`absolute right-1 top-1/2 transform -translate-y-1/2 font-inter text-sm py-2 px-3 rounded-full transition-all 
                                                ${firstNameState.isFocused || firstNameState.isLoading || firstNameState.isSuccess ? "bg-white text-black" : "bg-[#727272] text-white bg-opacity-15"}`}
                                            >
                                                {firstNameState.isLoading ? (
                                                    <div className="loader border-t-2 border-black border-opacity-70 w-4 h-4 rounded-full animate-spin"></div>
                                                ) : firstNameState.isSuccess ? (
                                                    <FaCheck className="text-green-500" />
                                                ) : (
                                                    "Change"
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <span className="text-sm font-medium font-inter">Email</span>
                                            <span className="text-xs text-zinc-500 block">Your email for notifications and updates</span>
                                        </div>
                                        <div className="relative w-full lg:w-1/2">
                                            <input
                                                type="text"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setEmailState((prev) => ({ ...prev, isFocused: true }))}
                                                onBlur={() => setEmailState((prev) => ({ ...prev, isFocused: false }))}
                                                className="bg-primary border text-sm font-inter border-zinc-800 rounded-full px-5 py-2.5 pr-20 focus:outline-none w-full"
                                            />
                                            <button
                                                onClick={() => handleSubmit("email")}
                                                className={`absolute right-1 top-1/2 transform -translate-y-1/2 font-inter text-sm py-2 px-3 rounded-full transition-all 
                                                ${emailState.isFocused || emailState.isLoading || emailState.isSuccess ? "bg-white text-black" : "bg-[#727272] text-white bg-opacity-15"}`}
                                            >
                                                {emailState.isLoading ? (
                                                    <div className="loader border-t-2 border-black border-opacity-70 w-4 h-4 rounded-full animate-spin"></div>
                                                ) : emailState.isSuccess ? (
                                                    <FaCheck className="text-green-500" />
                                                ) : (
                                                    "Change"
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-sm font-medium">Phone number</span>
                                            <span className="text-xs text-zinc-500">Your verified phone number</span>
                                        </div>
                                        <div className="relative w-full lg:w-1/2">
                                            <div className="flex items-center bg-primary border font-inter border-zinc-800 rounded-full px-2 py-2.5 w-full">
                                                <div className="flex items-center gap-1 px-1">
                                                    <img
                                                        src="https://flagcdn.com/w40/us.png"
                                                        alt="US Flag"
                                                        className="w-4 h-4 rounded-full"
                                                    />
                                                    <span className="text-white text-sm font-inter">+1</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={phoneNumber.startsWith("+1") ? phoneNumber.slice(2) : phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    className="bg-transparent text-sm flex-1 focus:outline-none px-2 text-white mx-3"
                                                />
                                                <button
                                                    onClick={() => handleSubmit("phone")}
                                                    className={`absolute right-1 top-1/2 transform -translate-y-1/2 font-inter text-sm py-2 px-3 rounded-full transition-all 
                                                    ${phoneState.isFocused || phoneState.isLoading || phoneState.isSuccess ? "bg-white text-black" : "bg-[#727272] text-white bg-opacity-15"}`}
                                                >
                                                    {phoneState.isLoading ? (
                                                        <div className="loader border-t-2 border-black border-opacity-70 w-4 h-4 rounded-full animate-spin"></div>
                                                    ) : phoneState.isSuccess ? (
                                                        <FaCheck className="text-green-500" />
                                                    ) : (
                                                        "Change"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-primary border border-[#787878] border-opacity-10">
                                <div className="p-4 border-b border-zinc-800 bg-[#111111] bg-opacity-65 flex items-center gap-2">
                                    <IoLockClosed className="w-5 h-5 text-zinc-400" />
                                    <span className="text-sm font-medium font-inter">Privacy</span>
                                </div>

                                <div className="p-4 lg:p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <span className="text-sm font-medium font-inter">Show me in event page</span>
                                            <span className="text-xs text-zinc-500 block">Allow others to see you're attending events</span>
                                        </div>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={isChecked}
                                                    onChange={(e) => handlePrivacyChange(e.target.checked)}
                                                />
                                                <div className={`toggle__line w-10 h-6 rounded-full transition-colors duration-300 ease-in-out ${isChecked ? 'bg-green-500' : 'bg-[#727272]'}`} />
                                                <div className={`toggle__dot absolute left-1 top-1/2 w-4 h-4 bg-white rounded-full shadow-md transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${isChecked ? 'translate-x-4' : ''}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-bg-primary border border-[#787878] border-opacity-10">
                                <div className="p-4 border-b border-zinc-800 bg-[#111111] bg-opacity-65 flex items-center gap-2">
                                    <IoDocumentTextSharp className="w-5 h-5 text-zinc-400" />
                                    <span className="text-sm font-medium font-inter">Legal</span>
                                </div>

                                <div className="p-4 lg:p-6 space-y-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <span className="text-sm font-medium font-inter">Contact support</span>
                                            <span className="text-xs text-zinc-500 block">Need help? We're here for you</span>
                                        </div>
                                        <a
                                            href="mailto:avenuetx02@gmail.com"
                                            className="bg-primary border text-sm font-inter text-center text-white border-zinc-800 rounded-full px-5 py-2.5 focus:outline-none w-full lg:w-52"
                                        >
                                            Chat with support
                                        </a>
                                    </div>
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-sm font-medium font-inter">Terms and Conditions</span>
                                            <span className="text-xs text-zinc-500">View legal documents</span>
                                        </div>
                                        <Link
                                            to="/terms-and-conditions"
                                            className="bg-primary border text-sm font-inter text-center text-white border-zinc-800 rounded-full px-5 py-2.5 focus:outline-none w-full lg:w-52"
                                        >Terms and Conditions</Link>
                                    </div>
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div
                                            className="flex flex-col gap-2">
                                            <span className="text-sm font-medium font-inter">Privacy Policy</span>
                                            <span className="text-xs text-zinc-500">View legal documents</span>
                                        </div>
                                        <Link
                                            to="/privacy-policy"
                                            className="bg-primary border text-sm font-inter text-center text-white border-zinc-800 rounded-full px-5 py-2.5 focus:outline-none w-full lg:w-52"
                                        >Privacy Policy</Link>
                                    </div>

                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div
                                            className="flex flex-col gap-2">
                                            <span className="text-sm font-medium font-inter">Logout</span>
                                            <span className="text-xs text-zinc-500">You'ill be logged out from this device</span>
                                        </div>
                                        <button
                                            className="bg-primary border text-sm font-inter text-center text-[#f43f5e] border-zinc-800 rounded-full px-5 py-2.5 focus:outline-none w-full lg:w-52"
                                            onClick={() => {
                                                localStorage.clear();
                                                window.location.href = "/";
                                            }}
                                        >Logout</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "past" && (
                        <div className="text-center py-12">
                            <h2 className="text-xl font-bold mb-1 font-inter">Coming soon</h2>
                            <p className="font-inter">We are preparing something special</p>
                        </div>
                    )}
                </div>
            </div>
            {
                showUpdateNotification && (
                    <motion.div
                        initial={{ y: -50, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -50, opacity: 0, scale: 0.9 }}
                        transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 15,
                        }}
                        className="fixed top-20 sm:top-10 inset-x-0 mx-auto w-fit backdrop-blur-md text-white p-3 pl-4 rounded-lg flex items-center gap-2 border border-white/10 shadow-lg max-w-[400px] justify-between"
                    >
                        <div className="flex items-center gap-2">
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
                                    d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM11.844 6.209C11.9657 6.05146 12.0199 5.85202 11.9946 5.65454C11.9693 5.45706 11.8665 5.27773 11.709 5.156C11.5515 5.03427 11.352 4.9801 11.1545 5.00542C10.9571 5.03073 10.7777 5.13346 10.656 5.291L6.956 10.081L5.307 8.248C5.24174 8.17247 5.16207 8.11073 5.07264 8.06639C4.98322 8.02205 4.88584 7.99601 4.78622 7.98978C4.6866 7.98356 4.58674 7.99729 4.4925 8.03016C4.39825 8.06303 4.31151 8.11438 4.23737 8.1812C4.16322 8.24803 4.10316 8.32898 4.06071 8.41931C4.01825 8.50965 3.99425 8.60755 3.99012 8.70728C3.98599 8.807 4.00181 8.90656 4.03664 9.00009C4.07148 9.09363 4.12464 9.17927 4.193 9.252L6.443 11.752C6.51649 11.8335 6.60697 11.8979 6.70806 11.9406C6.80915 11.9833 6.91838 12.0034 7.02805 11.9993C7.13772 11.9952 7.24515 11.967 7.34277 11.9169C7.44038 11.8667 7.5258 11.7958 7.593 11.709L11.844 6.209Z"
                                    fill="#10B981"
                                />
                            </svg>
                            <p className="text-sm">Profile updated successfully</p>
                        </div>
                        <button
                            onClick={() => setShowUpdateNotification(false)}
                            className="ml-2 text-white/60 hover:text-white flex items-center justify-center border border-white/10 rounded-full p-1 flex-shrink-0 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M5.28033 4.21967C4.98744 3.92678 4.51256 3.92678 4.21967 4.21967C3.92678 4.51256 3.92678 4.98744 4.21967 5.28033L6.93934 8L4.21967 10.7197C3.92678 11.0126 3.92678 11.4874 4.21967 11.7803C4.51256 12.0732 4.98744 12.0732 5.28033 11.7803L8 9.06066L10.7197 11.7803C11.0126 12.0732 11.4874 12.0732 11.7803 11.7803C12.0732 11.4874 12.0732 11.0126 11.7803 10.7197L9.06066 8L11.7803 5.28033C12.0732 4.98744 12.0732 4.51256 11.7803 4.21967C11.4874 3.92678 11.0126 3.92678 10.7197 4.21967L8 6.93934L5.28033 4.21967Z"
                                    fill="white"
                                />
                            </svg>
                        </button>
                    </motion.div>
                )
            }
        </div>
    );
};

export default Profile;