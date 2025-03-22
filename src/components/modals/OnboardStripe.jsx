import React, { useState } from 'react';
import { X, Globe } from 'lucide-react';
import VerificationModal from './VerificationModal';
import { Spin } from 'antd';
import url from '../../constants/url';
import axios from 'axios';
import OnboardVerify from './OnboardVerify';
import logo from "../../assets/logo.png"
import stripeAvenue from "../../assets/stripe-avenue.png"

const OnboardStripe = ({ isOpen, onClose, accountLink }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${url}/auth/send-otp`, { phone: numberWithCode });
            setLoading(false);
            if (response.data.success) {
                setIsVerificationModalOpen(true);
            } else {
                setIsVerificationModalOpen(true);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            alert('Failed to send OTP');
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
                        <img src={stripeAvenue} alt='stripe-avenue' className="w-32 mb-3" />
                        <h2 className="text-sm text-center font-normal text-white tracking-tight">
                            Avenue uses stripe to connect your account and process payments.
                        </h2>
                    </div>
                    <div className="flex flex-col items-center mb-2">
                        <a
                            href={`${accountLink}`}
                            className={`px-4 py-2 w-full bg-white rounded-full h-10 font-semibold flex items-center justify-center gap-2`}
                        >
                            Onboard with stripe
                        </a>
                    </div>
                    <div className="flex flex-col items-center mb-2 text-gray-500">
                        <a>or</a>
                    </div>
                    <div className="flex flex-col items-center mb-8 text-white">
                        <a href='/organizer/dashboard' className='px-4 py-2 w-full rounded-full h-10 border border-white/10 text-white font-semibold flex items-center justify-center gap-2'>Skip for now</a>
                        <p className="text-gray-400 text-xs mt-3 font-inter text-center">Skipping for now will save your event as a draft; you won't be able to publish until onboarding is complete.</p>
                    </div>
                    <OnboardVerify
                        isOpen={isVerificationModalOpen}
                        onClose={() => setIsVerificationModalOpen(false)}
                        phoneNumber={phoneNumber}
                    />
                </div>
            </div>
        </div>
    );
};

export default OnboardStripe;
