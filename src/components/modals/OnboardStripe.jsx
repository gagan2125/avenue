import React, { useState } from 'react';
import { X, Globe } from 'lucide-react';
import VerificationModal from './VerificationModal';
import { Spin } from 'antd';
import url from '../../constants/url';
import axios from 'axios';
import OnboardVerify from './OnboardVerify';
import logo from "../../assets/logo.png"

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
                        {/* <Globe className="w-8 h-8 text-cyan-400 mb-4" /> */}
                        <svg width="120" height="38" viewBox="0 0 500 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_3005_203)">
                                <path d="M0.419336 67.5563C0.219336 67.5563 0.119336 67.4563 0.0193359 67.3563C-0.0806641 67.1563 -0.0806641 67.0563 0.0193359 66.9563L36.0193 -0.0436554C36.0193 -0.143655 36.1193 -0.243652 36.3193 -0.243652H45.9193C46.0193 -0.243652 46.2193 -0.143655 46.3193 -0.0436554L82.2193 66.8563C82.3193 66.9563 82.3193 67.0563 82.2193 67.2563C82.1193 67.3563 82.0193 67.4563 81.8193 67.4563H67.4193C67.2193 67.4563 67.1193 67.3563 67.0193 67.2563L41.4193 19.5563C41.3193 19.3563 41.2193 19.3563 41.0193 19.3563C40.9193 19.3563 40.7193 19.4563 40.6193 19.5563L15.2193 67.3563C15.1193 67.4563 15.0193 67.5563 14.8193 67.5563H0.419336Z" fill="white" />
                                <path d="M83.9374 0.556534C83.7374 0.156534 83.8374 -0.043457 84.3374 -0.043457H98.8374C98.9374 -0.043457 99.1374 0.0565399 99.2374 0.15654L124.837 47.7565C124.937 47.9565 125.037 47.9565 125.237 47.9565C125.437 47.9565 125.537 47.8565 125.637 47.7565L151.237 0.15654C151.237 -0.0434601 151.437 -0.043457 151.637 -0.043457H165.937C166.337 -0.043457 166.437 0.156534 166.337 0.556534L130.437 67.4565C130.337 67.5565 130.237 67.6565 130.037 67.6565H120.437C120.237 67.6565 120.237 67.5565 120.137 67.4565L83.9374 0.556534Z" fill="white" />
                                <path d="M172.855 27.2565C172.855 26.9565 172.955 26.8564 173.255 26.8564H227.655C227.955 26.8564 228.155 26.9565 228.155 27.2565V40.1564C228.155 40.4564 227.955 40.5564 227.655 40.5564H186.655C186.455 40.5564 186.255 40.6565 186.255 40.9565V53.4565C186.255 53.6565 186.355 53.8564 186.655 53.8564H227.855C228.055 53.9564 228.155 54.0564 228.255 54.0564C228.355 54.0564 228.355 54.1564 228.355 54.3564V67.1564C228.355 67.4564 228.155 67.6564 227.855 67.6564H173.355C173.055 67.6564 172.855 67.4564 172.855 67.1564V27.2565ZM173.255 13.3564C172.955 13.3564 172.855 13.2565 172.855 12.9565V0.356445C172.955 0.0564453 173.155 -0.143555 173.355 -0.143555H227.855C228.155 -0.0435547 228.355 0.156445 228.355 0.356445V12.9565C228.355 13.2565 228.155 13.4565 227.855 13.4565H173.255V13.3564Z" fill="white" />
                                <path d="M240.174 0.156342C240.174 -0.0436585 240.274 -0.243652 240.574 -0.243652H254.874C254.974 -0.243652 255.074 -0.143661 255.174 -0.143661L299.074 49.5563C299.274 49.7563 299.374 49.7563 299.574 49.7563C299.774 49.6563 299.774 49.5563 299.774 49.3563V0.356339C299.974 0.0563385 300.074 -0.143661 300.274 -0.143661H313.074C313.374 -0.0436615 313.574 0.156338 313.574 0.356339V67.0563C313.574 67.3563 313.374 67.5563 313.074 67.5563H297.074C296.974 67.5563 296.874 67.5563 296.774 67.4563C293.574 63.8563 289.874 59.6563 285.574 54.8563C281.874 50.7563 277.474 45.7563 272.274 39.8563C267.074 33.9563 261.074 27.1563 254.374 19.4563C254.274 19.2563 254.174 19.2563 253.974 19.3563C253.774 19.4563 253.774 19.5563 253.774 19.7563V67.2563C253.774 67.5563 253.574 67.7563 253.174 67.7563H240.674C240.374 67.7563 240.274 67.6563 240.274 67.3563V0.156342H240.174Z" fill="white" />
                                <path d="M325.421 0.156342C325.421 -0.0436585 325.521 -0.243652 325.821 -0.243652H338.721C339.021 -0.243652 339.121 -0.143658 339.121 0.156342V35.6563C339.121 39.8563 339.721 43.1563 340.921 45.5563C342.121 47.9563 343.721 49.7563 345.721 50.9563C347.721 52.1563 350.021 52.9563 352.621 53.2563C355.221 53.5563 357.921 53.7563 360.721 53.8563C364.021 53.9563 366.921 53.7563 369.621 53.1563C372.321 52.5563 374.621 51.5563 376.521 50.1563C378.421 48.7563 379.921 46.8563 381.021 44.3563C382.121 41.9563 382.621 38.9563 382.621 35.2563V0.156342C382.621 -0.0436585 382.721 -0.243652 383.021 -0.243652H395.921C396.121 -0.243652 396.321 -0.143658 396.321 0.156342V34.5563C396.321 39.2563 395.821 43.2563 394.821 46.7563C393.821 50.2563 392.421 53.1563 390.721 55.5563C389.021 57.9563 386.921 59.9563 384.621 61.5563C382.321 63.0563 379.821 64.3563 377.121 65.1563C374.521 66.0563 371.721 66.6563 369.021 66.9563C366.221 67.2563 363.521 67.4563 360.821 67.4563C356.521 67.4563 352.321 67.0563 348.021 66.1563C343.821 65.2563 340.021 63.6563 336.621 61.2563C333.221 58.8563 330.521 55.4563 328.421 51.1563C326.321 46.8563 325.321 41.2563 325.321 34.5563V0.156342H325.421Z" fill="white" />
                                <path d="M408.227 27.2565C408.227 26.9565 408.327 26.8564 408.627 26.8564H463.027C463.327 26.8564 463.527 26.9565 463.527 27.2565V40.1564C463.527 40.4564 463.327 40.5564 463.027 40.5564H422.027C421.827 40.5564 421.627 40.6565 421.627 40.9565V53.4565C421.627 53.6565 421.727 53.8564 422.027 53.8564H463.127C463.327 53.9564 463.427 54.0564 463.527 54.0564C463.627 54.0564 463.627 54.1564 463.627 54.3564V67.1564C463.627 67.4564 463.427 67.6564 463.127 67.6564H408.727C408.427 67.6564 408.227 67.4564 408.227 67.1564V27.2565ZM408.727 13.3564C408.427 13.3564 408.327 13.2565 408.327 12.9565V0.356445C408.427 0.0564453 408.627 -0.143555 408.827 -0.143555H463.327C463.627 -0.0435547 463.827 0.156445 463.827 0.356445V12.9565C463.827 13.2565 463.627 13.4565 463.327 13.4565H408.727V13.3564Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_3005_203">
                                    <rect width="600" height="70" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <h2 className="text-md text-center font-medium text-white font-inter">Avenue uses stripe to connect your account and process payments.</h2>
                        {/* <p className="text-gray-400 text-sm mt-1 font-inter">Let's complete your stripe journey</p> */}
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
