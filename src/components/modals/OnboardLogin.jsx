import React, { useState } from 'react';
import { X, Globe } from 'lucide-react';
import VerificationModal from './VerificationModal';
import { Spin } from 'antd';
import url from '../../constants/url';
import axios from 'axios';
import OnboardVerify from './OnboardVerify';

const OnboardLogin = ({ isOpen, onClose, onTrigger, isAdding, loginClosed }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      if (value.length === 10) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
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
            <Globe className="w-8 h-8 text-cyan-400 mb-4" />
            <h2 className="text-2xl font-semibold text-white font-inter">Enter phone number</h2>
            <p className="text-gray-400 text-sm mt-1 font-inter">Let's check if you have an account</p>
          </div>
          <div className="flex mb-4 bg-[#151515] rounded-xl border border-[#202020]">
            <div className="flex items-center px-7 py-2 border-r border-[#202020]">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwwxhCMpFSg4qToHq_HKLhhU6bo5f1JJPh8w&s"
                className="w-5 h-5 mr-2 rounded-full"
              />
              <span className="text-white text-sm">+1</span>
            </div>
            <input
              type="text"
              placeholder="555 987 654"
              className="flex-1 bg-transparent text-white px-4 py-2 focus:outline-none focus:ring-0"
              value={phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <button
            onClick={handleSendOtp}
            disabled={isButtonDisabled || loading}
            className={`w-full rounded-full px-4 py-3 font-inter transition duration-200 ${isButtonDisabled || loading
              ? 'bg-[#222222] text-[#101010] cursor-not-allowed'
              : 'bg-white text-black hover:bg-[#f2f2f2]'
              }`}
          >
            {loading ? <Spin size="small" /> : 'Verify number'}
          </button>
          <OnboardVerify
            isOpen={isVerificationModalOpen}
            onClose={() => {
              setIsVerificationModalOpen(false);
              onClose(); // close login modal also
            }}
            loginClose={onClose}
            loginClosed={loginClosed}
            phoneNumber={phoneNumber}
            onTrigger={onTrigger}
            isAdding={isAdding}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardLogin;
