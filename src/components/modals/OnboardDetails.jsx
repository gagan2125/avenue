import React, { useEffect, useState } from 'react';
import { X, Globe } from 'lucide-react';
import VerificationModal from './VerificationModal';
import { Spin } from 'antd';
import url from '../../constants/url';
import axios from 'axios';
import OnboardVerify from './OnboardVerify';
import OnboardStripe from './OnboardStripe';

const OnboardDetails = ({ isOpen, onClose, onTrigger, userId, isAdding }) => {
    console.log(userId)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [oragnizerId, setOragnizerId] = useState(null);
    //const [userId, setUserId] = useState(null);
    const [userOragnizerId, setUserOragnizerId] = useState("")
    const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
    const [accountLink, setAccountLink] = useState(null);

    useEffect(() => {
        const loadFromLocalStorage = () => {
            const storedUserOrganizerId = localStorage.getItem("organizerId");
            const storedUserId = localStorage.getItem("userID");
            setOragnizerId(storedUserOrganizerId || null);
            //setUserId(storedUserId || null);
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

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            let phoneValue = value.replace(/\D/g, '');
            if (phoneValue.length <= 10) {
                setPhoneNumber(phoneValue);
                setIsButtonDisabled(phoneValue.length !== 10);
            }
        } else {
            if (name === "name") {
                setName(value);
            } else if (name === "email") {
                setEmail(value);
            }
        }
    };

    const numberWithCode = '+1' + phoneNumber;

    const handleBasicDetails = async () => {
        try {
            const basicInfoResponse = await axios.post(`${url}/auth/basic-info/${userId}`, {
                firstName: name,
                lastName: "",
                email: email,
            });

            if (basicInfoResponse.data.success) {
                const connectedAccountResponse = await axios.post(`${url}/create-connected-account`, {
                    name: name,
                    userId: userId
                });

                if (connectedAccountResponse.data.success) {
                    const { accountLink, organizerId } = connectedAccountResponse.data;
                    setUserOragnizerId(organizerId);
                    setAccountLink(accountLink);
                    localStorage.setItem('organizerId', organizerId);
                    localStorage.setItem('accountLink', accountLink);

                    setTimeout(() => {
                        onTrigger("NO", organizerId, "noRedirect");
                    }, 500);

                    setIsStripeModalOpen(true);
                } else {
                    alert("Error", connectedAccountResponse.data.message || "Failed to create connected account!");
                }
            } else {
                alert("Error", basicInfoResponse.data.message || "Failed to update profile!");
            }
        } catch (error) {
            console.error("API Error:", error);
            alert("Error", "An error occurred. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <div className="bg-[#151515] rounded-xl p-8 shadow-xl relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex flex-col items-center mb-8">
                        <Globe className="w-8 h-8 text-cyan-400 mb-4" />
                        <h2 className="text-2xl font-semibold text-white font-inter">Basic Information</h2>
                        <p className="text-gray-400 text-sm mt-1 font-inter">Let's onboard you as organizer</p>
                    </div>
                    <div className="flex mb-4 bg-[#151515] rounded-xl border border-[#202020]">
                        <input
                            type="text"
                            placeholder="Organization name"
                            className="flex-1 bg-transparent text-white px-4 py-2 focus:outline-none focus:ring-0"
                            value={name}
                            name="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex mb-4 bg-[#151515] rounded-xl border border-[#202020]">
                        <input
                            type="text"
                            placeholder="Organization email id"
                            className="flex-1 bg-transparent text-white px-4 py-2 focus:outline-none focus:ring-0"
                            value={email}
                            name="email"
                            onChange={handleInputChange}
                        />
                    </div>
                    <button
                        onClick={handleBasicDetails}
                        disabled={isAdding} // Use isAdding to disable button
                        className={`w-full rounded-full px-4 py-3 font-inter transition duration-200 ${isAdding ? 'bg-gray-400 text-gray-800 cursor-not-allowed' : 'bg-white text-black hover:bg-[#f2f2f2]'}`}
                    >
                        {isAdding ? <Spin size="small" /> : "Next"}
                    </button>
                    <OnboardStripe
                        isOpen={isStripeModalOpen}
                        onClose={() => setIsStripeModalOpen(false)}
                        phoneNumber={phoneNumber}
                        onTrigger={onTrigger}
                        accountLink={accountLink}
                    />
                </div>
            </div>
        </div>
    );
};

export default OnboardDetails;
