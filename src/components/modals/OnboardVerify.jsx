import React, { useState, useRef, useEffect } from 'react';
import { X, Globe } from 'lucide-react';
import { Modal } from 'antd';
import url from '../../constants/url';
import axios from 'axios';
import { Spin } from "antd";
import OnboardDetails from './OnboardDetails';

const OnboardVerify = ({ isOpen, onClose, phoneNumber, onTrigger, isAdding, loginClose, loginClosed }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([...Array(6)].map(() => React.createRef()));
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [resentOTP, setResentOTP] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [oragnizerId, setOragnizerId] = useState(null);

    useEffect(() => {
        const loadFromLocalStorage = () => {
            const storedUserOrganizerId = localStorage.getItem("organizerId");
            const storedUserId = localStorage.getItem("userID");
            setOragnizerId(storedUserOrganizerId || null);
            setUserId(storedUserId || null);
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

    const handleChange = (index, value) => {
        if (value.length > 1) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (newCode.every(digit => digit !== '')) {
            handleVerify(newCode);
        }

        if (value && index < 5) {
            inputRefs.current[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].current.focus();
        }
    };

    const handleVerify = async (updatedCode) => {
        const otp = updatedCode.join('');
        if (otp.length < 6) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${url}/auth/verify-otp`, {
                phone: "+1" + phoneNumber,
                otp
            });

            if (response.data.success) {
                const { userID, authToken, user, organizer } = response.data;

                if (userID && authToken) {
                    setUserId(userID)
                    localStorage.setItem('userID', userID);
                    localStorage.setItem('authToken', authToken);
                    if (user?.firstName) {
                        localStorage.setItem('userName', user.firstName);
                    }
                    if (organizer) {
                        localStorage.setItem('organizerId', organizer._id);
                        localStorage.setItem('accountId', organizer.stripeAccountId);
                    }

                    setSuccess(true);
                    setError(null);
                    setLoading(false);

                    let timeLeft = 3;
                    setCountdown(timeLeft);

                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }

                    timerRef.current = setInterval(() => {
                        timeLeft -= 1;
                        setCountdown(timeLeft);

                        if (timeLeft <= 0) {
                            clearInterval(timerRef.current);
                            if (!organizer) {
                                setIsDetailsModalOpen(true);
                            } else {
                                onClose();           // Close verification modal
                                loginClosed();       // Tell parent to refresh userId & organizerId
                            }
                        }

                    }, 1000);
                } else {
                    setError('Invalid OTP');
                    setLoading(false);
                }
            } else {
                setError('Invalid OTP');
                setLoading(false);
            }
        } catch (error) {
            console.error('Verification failed:', error);
            setError('Invalid OTP');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            inputRefs.current[0].current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${url}/auth/send-otp`, { phone: "+1" + phoneNumber });
            setLoading(false);
            setResentOTP(true)
        } catch (error) {
            setLoading(false);
            console.error(error);
            alert('Failed to send OTP');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <div className="bg-[#151515] rounded-xl p-8 shadow-xl relative flex flex-col items-center">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                    <Globe className="w-8 h-8 text-cyan-400 mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2 font-inter">
                        Enter confirmation code
                    </h2>
                    <p className="text-gray-400 text-sm text-center mb-6 font-inter">
                        Please enter verification code we've<br />
                        sent on {phoneNumber}
                    </p>
                    <div className="flex gap-2 mb-6">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs.current[index]}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-10 h-9 bg-[#151515] font-inter rounded-full text-center text-white text-2xl focus:outline-none border border-[#252525]"
                            />
                        ))}
                    </div>
                    {loading && (
                        <div className='text-center mt-3'>
                            <Spin size="default" />
                        </div>
                    )}
                    {success && (
                        <div className="text-green-300 font-inter text-xs bg-green-800 px-16 py-2 bg-opacity-30 border border-green-950 rounded-xl whitespace-nowrap">
                            <p>Logged in successfully! ({countdown})</p>
                        </div>
                    )}
                    {
                        !success && resentOTP && (
                            <div className="text-green-300 mt-3 font-inter text-xs bg-green-800 px-16 py-2 bg-opacity-30 border border-green-950 rounded-xl whitespace-nowrap">
                                <p>OTP Sent Successfully</p>
                            </div>
                        )
                    }
                    {error && (
                        <div className="text-red-300 font-inter text-xs bg-red-800 px-16 py-2 bg-opacity-30 border border-red-950 rounded-xl">
                            {error}
                        </div>
                    )}
                    <button onClick={handleSendOtp} className="text-gray-200 text-sm underline mt-5 font-inter">
                        Resend code
                    </button>
                    <OnboardDetails
                        isOpen={isDetailsModalOpen}
                        onClose={() => setIsDetailsModalOpen(false)}
                        phoneNumber={phoneNumber}
                        onTrigger={onTrigger}
                        userId={userId}
                        isAdding={isAdding}
                    />
                </div>
            </div>
        </div>
    );
};

export default OnboardVerify;