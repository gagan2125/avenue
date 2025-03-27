import React, { useState } from 'react';
import { X, Globe, TicketCheckIcon, TicketIcon } from 'lucide-react';
import VerificationModal from './VerificationModal';
import { Spin } from 'antd';
import url from '../../constants/url';
import axios from 'axios';
import { BsFillTicketFill } from 'react-icons/bs';

const QrTicket = ({ isOpen, onClose, card }) => {
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = "20" + date.getFullYear().toString().slice(-2);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${dayOfWeek}, ${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
    };

    return (
        <div className="fixed inset-0 z-50 backdrop-blur-sm">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <div className="bg-[#151515] rounded-xl overflow-hidden shadow-lg relative">
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 text-gray-400 hover:text-white z-10"
                    >
                        <X size={16} />
                    </button>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <BsFillTicketFill color='#cccccc' />
                            <span className="text-xs text-gray-400 uppercase tracking-wide font-inter font-semibold">Ticket Pass</span>
                        </div>
                        <div className="flex justify-start mb-4 mt-5">
                            <img
                                src={card.party_id.flyer}
                                alt="Event Profile"
                                className="w-14 h-14 rounded-xl object-cover"
                            />
                        </div>

                        <div className="text-lg text-white mb-2 font-inter">{formatDate(card.party_id.start_date)}</div>
                        <div className='flex flex-row space-x-3'>
                            <div className="text-xs text-gray-400 font-inter">{card.party_id.event_name}</div>
                            <div className="text-xs text-gray-400">•</div>
                            <div className="text-xs text-gray-400 font-inter">{card.party_id.venue_name}</div>
                        </div>
                    </div>
                    <div className='px-2 rounded-lg'>
                        <div className="bg-[#ffffff] p-7 flex justify-center items-center relative rounded-t-2xl">
                            <div>
                                <img
                                    src={card.qrcode}
                                    alt="QR Code"
                                    style={{ imageRendering: 'pixelated' }}
                                    className="w-full max-w-xs rounded-lg"
                                />
                                {/* <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-[#ff4b4b] rounded-full flex items-center justify-center">
                                    <span className="text-white text-lg font-semibold">♪</span>
                                </div>
                            </div> */}
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-[#0b6694] bg-opacity-50 p-1 rounded-b-2xl px-4">
                            <div className="flex items-center">
                                <div className="rounded-full py-1.5">
                                    <span className="text-xs text-white font-medium font-inter">{card.tickets.ticket_name} x {card.count}</span>
                                </div>
                            </div>
                            <div className="text-white text-md font-bold font-inter">${card.amount / 100}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QrTicket;
