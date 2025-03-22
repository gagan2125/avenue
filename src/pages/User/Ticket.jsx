import { CircleUser } from 'lucide-react'
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaRegDotCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FiLock } from 'react-icons/fi';
import success from "../../assets/success.png"
import { useLocation } from "react-router-dom";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import url from "../../constants/url";
import { Button, Modal, Space } from 'antd';
import { Spin } from 'antd';
import LoginModal from '../../components/modals/LoginModal';
import Checkout from './Checkout';

const Ticket = () => {
    const [step, setStep] = useState(1);
    const [counts, setCount] = useState(() => {
        return parseInt(localStorage.getItem('count')) || 1;
    });
    const location = useLocation();
    //const [payId, setPayId] = useState('');
    const [book, setBook] = useState({});
    const [error, setError] = useState(false);

    const handleNext = () => {
        // Validate for step 1 (user info)
        if (!formData.firstName || !formData.email) {
            setError(true);
            return;
        }
        setError(false);
        if (step === 1) {
            handleFinish();
        } else if (step === 2) {
            handlePayment();
        }
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    useEffect(() => {
        window.location.hash = `step${step}`;
    }, [step]);

    // On component mount, read the hash (if present) to set the initial step.
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const stepFromHash = parseInt(hash.replace('#step', ''), 10);
            if (stepFromHash >= 1 && stepFromHash <= 3) {
                setStep(stepFromHash);
            }
        }
    }, []);

    const [event, setEvent] = useState({});
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [organizerId, setOrganizerId] = useState(null);

    const [paymentRequest, setPaymentRequest] = useState(null);

    const [details, setDetails] = useState(false)
    const [basicModal, setBasicModal] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [promos, setPromos] = useState([]);

    const selectedTicketPrice = localStorage.getItem('selectedTicketPrice') || {};
    const count = localStorage.getItem('count') || {};
    const selectedTicketId = localStorage.getItem('selectedTicketId') || {};
    const selectedTicketName = localStorage.getItem('selectedTicketName') || {};
    const eventId = localStorage.getItem('user_event_id') || {};
    const max_count = localStorage.getItem('max_count') || {};
    const remaining_tickets = localStorage.getItem('remaining_tickets') || {};
    const [remain, setRemain] = useState([])

    const stripe = useStripe();
    const elements = useElements();

    const [promoCode, setPromoCode] = useState('');
    const [amount, setAmount] = useState(null);
    const [type, setType] = useState('');

    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [zeroLoading, setZeroLoading] = useState(false);

    const userIds = localStorage.getItem('userID') || "";
    const payId = localStorage.getItem('payId') || "";


    const handleApply = () => {
        const matchedPromo = promos.find(
            promo => promo.code.toUpperCase() === promoCode.toUpperCase()
        );
        if (matchedPromo) {
            setAmount(matchedPromo.amount);
            setType(matchedPromo.type);
            console.log(
                `Promo code applied: ${promoCode.toUpperCase()}, Amount: ${matchedPromo.amount}, Type: ${matchedPromo.type}`
            );
        } else {
            alert("Promo code not valid");
            console.log('Promo code not valid');
            setAmount(null);
            setType('');
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${url}/promo/get-promo/${eventId}`);
            const eventData = response.data;
            setPromos(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents()
    }, [eventId])

    useEffect(() => {
        if (userId) {
            axios
                .get(`${url}/auth/get-user-by-id/${userId}`)
                .then((response) => {
                    const userData = response.data;
                    setFormData({
                        firstName: `${userData.firstName} ${userData.lastName}`.trim(),
                        lastName: userData.lastName,
                        email: userData.email
                    })
                })
                .catch((error) => {
                    console.error("Error fetching user data", error);
                });
        }
    }, [userId]);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${url}/event/get-event-by-id/${eventId}`);
                setEvent(response.data);
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false)
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    const ticket = event?.tickets?.find(ticket => ticket._id.toString() === selectedTicketId);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userID");
        const storedOrganizerId = localStorage.getItem("user_organizer_id");
        const userName = localStorage.getItem("userName")
        setUserId(storedUserId);
        setUserName(userName)
        setOrganizerId(storedOrganizerId);
        if (!userName) {
            setDetails(true);
        }
    }, []);

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

    const calculateTotal = () => {
        const subtotal = counts * selectedTicketPrice;
        const taxValue = parseFloat(event.tax) || 0;
        const taxType = event.tax_type || "percentage";

        // Calculate organizer tax based on tax type
        let organizerTax = 0;
        if (taxType === "percentage") {
            organizerTax = subtotal * (taxValue / 100);
        } else if (taxType === "fixed") {
            organizerTax = taxValue;
        }

        // Platform fee = 9% of (subtotal + tax) + $0.89
        const platformFee = ((subtotal + organizerTax) * 0.09) + 0.89;

        // Apply discount
        let total = subtotal;
        if (amount && type) {
            if (type === "amount") {
                total -= parseFloat(amount) || 0;
            } else if (type === "percentage") {
                const discount = (total * (parseFloat(amount) || 0)) / 100;
                total -= discount;
            }
        }

        // Add tax and platform fee
        total = total + organizerTax + platformFee;

        return total.toFixed(2);
    };

    const handleRSVPAdd = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${url}/create-payment-intent-rsvp`, {
                amount: 0,
                organizerId: organizerId,
                userId: userId,
                eventId: eventId,
                date: Date.now(),
                status: "pending",
                count: counts,
                ticketId: selectedTicketId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            });
            if (response.data.success === true) {
                //window.location.href = `/qr-ticket/${response.data.paymentId}`;
                setStep((prev) => Math.min(prev + 1, 3))
            }
        } catch (error) {
            setPaymentError(error.message);
        } finally {
            setPaymentProcessing(false);
        }
    }

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'firstName') {
            setFormData(prev => ({
                ...prev,
                firstName: value,
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFinish = async () => {
        try {
            // Ensure firstName and lastName are properly split
            const nameParts = formData.firstName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const basicInfoResponse = await axios.post(`${url}/auth/basic-info/${userId}`, {
                firstName,
                lastName,
                email: formData.email,
            });

            if (basicInfoResponse.data.success) {
                localStorage.setItem('userName', firstName);
            }
        } catch (error) {
            console.error("API Error:", error);
            alert("Error", "An error occurred. Please try again.");
        }
    };

    const fetchBook = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/get-qr-ticket-details/${payId}`);
            setBook(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBook();
    }, [payId]);

    // useEffect(() => {
    //     if (stripe) {
    //         const pr = stripe.paymentRequest({
    //             country: "US",
    //             currency: "usd",
    //             total: {
    //                 label: "Total Amount",
    //                 amount: Math.round(parseFloat(calculateTotal()) * 100),
    //             },
    //             requestPayerName: true,
    //             requestPayerEmail: true,
    //         });
    //         pr.canMakePayment().then((result) => {
    //             if (result) {
    //                 setPaymentRequest(pr);
    //             }
    //         });
    //     }
    // }, [stripe, calculateTotal]);

    const fetchRemainEvent = async () => {
        if (eventId) {
            try {
                const response = await axios.get(`${url}/remain-tickets/${eventId}`);
                setRemain(response.data);
            } catch (error) {
                console.error("Error fetching remain events:", error);
            }
        } else {
            console.log("not found")
        }
    }

    useEffect(() => {
        fetchRemainEvent()
    }, [eventId])

    useEffect(() => {
        // Only run this effect when in step 2.
        if (step !== 2) return;
        if (ticket.price === 0) return;
        if (clientSecret) return;

        const nameParts = formData.firstName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        fetch(`${url}/create-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: Math.round(parseFloat(calculateTotal()) * 100),
                organizerId: organizerId,
                userId: userId,
                eventId: eventId,
                date: Date.now(),
                status: "pending",
                count: counts,
                ticketId: selectedTicketId,
                tickets: ticket,
                firstName: firstName,
                lastName: lastName,
                email: formData.email,
                tax: Number(event.tax) !== 0,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else if (data.error) {
                    setErrorMsg(data.error);
                }
                setLoading(false);
            })
            .catch((error) => {
                setErrorMsg("Failed to load payment details.");
                setLoading(false);
            });
    }, [clientSecret, step, amount, organizerId, userId, eventId, counts, selectedTicketId, ticket, formData, event]);

    useEffect(() => {
        const now = new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
        setCurrentDateTime(now);
    }, []);

    const handleZeroPay = async () => {
        setZeroLoading(true)
        try {
            const response = await fetch(`${url}/send-ticket-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: 0,
                    organizerId: organizerId,
                    userId: userId,
                    eventId: eventId,
                    date: currentDateTime,
                    status: "pending",
                    count: count,
                    ticketId: selectedTicketId,
                    tickets: ticket,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    clientSecret: "",
                    paymentMethod: "None"
                }),
            });
            const data = await response.json();
            localStorage.setItem("payId", data.paymentId);
            setStep(3);
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setZeroLoading(false)
        }
    }

    return (
        <>
            {
                loading ? (
                    <div className='text-center mt-10'>
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className="bg-primary px-4 mt-10 mb-10">
                        <div className="flex flex-col lg:flex-row justify-center gap-6">
                            <div className="max-w-md flex-1">
                                <div className="border border-[#292929] rounded-xl">
                                    <div className="rounded-    xl bg-primary border border-[#787878] border-opacity-10">
                                        <div className="p-3.5 border-b border-zinc-800 bg-[#111111] bg-opacity-65 flex items-center gap-2">
                                            <span className="text-lg font-medium font-inter text-white">Checkout</span>
                                        </div>
                                    </div>
                                    <div className="w-full max-w-md mx-auto p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex flex-col items-center">
                                                {step > 1 ? (
                                                    <FaCheckCircle onClick={handlePrev} color="#34B2DA" />
                                                ) : (
                                                    <FaRegDotCircle onClick={handlePrev} color={step === 1 ? "#34B2DA" : "#787878"} />
                                                )}
                                                <p className={`mt-2 font-inter ${step >= 1 ? 'text-white' : 'text-gray-500'} text-xs`}>Basics</p>
                                            </div>
                                            <div className={`flex-1 -mt-7 h-px ${step >= 2 ? 'bg-[#34B2DA]' : 'bg-gray-300'}`}></div>
                                            <div className="flex flex-col items-center">
                                                {step > 2 ? (
                                                    <FaCheckCircle color="#34B2DA" />
                                                ) : (
                                                    <FaRegDotCircle color={step === 2 ? "#34B2DA" : "#787878"} />
                                                )}
                                                <p className={`mt-2 font-inter ${step >= 2 ? 'text-white' : 'text-gray-500'} text-xs`}>Payment info</p>
                                            </div>
                                            <div className={`flex-1 -mt-7 h-px ${step >= 3 ? 'bg-[#34B2DA]' : 'bg-gray-300'}`}></div>
                                            <div className="flex flex-col items-center">
                                                {step === 3 ? (
                                                    <FaCheckCircle color="#34B2DA" />
                                                ) : (
                                                    <FaRegDotCircle color={step === 3 ? "#34B2DA" : "#787878"} />
                                                )}
                                                <p className={`mt-2 font-inter ${step >= 3 ? 'text-white' : 'text-gray-500'} text-xs`}>Success</p>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm">
                                                {step === 1 && (
                                                    <div className="mt-8">
                                                        {
                                                            error && (
                                                                <>
                                                                    <p className='text-red-500 mb-3 font-inter'>Please enter full name & email to proceed!</p>
                                                                </>
                                                            )
                                                        }
                                                        {userIds ? (
                                                            <div className="mb-5 mx-3">
                                                                <label className="block text-white text-sm mb-2 text-start font-inter">Full name</label>
                                                                <input
                                                                    type="text"
                                                                    name="firstName"
                                                                    value={formData.firstName === 'undefined' || formData.firstName === 'undefined undefined' ? "" : formData.firstName}
                                                                    onChange={handleChange}
                                                                    className="w-full font-inter bg-primary border border-[#1c1c1c] rounded-full px-4 py-3 text-white placeholder-zinc-400 focus:outline-none"
                                                                    placeholder="John Doe"
                                                                    required
                                                                />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="mx-3">
                                                                    <button onClick={() => setIsModalOpen(true)} className="font-inter w-full bg-white text-black font-medium py-3 px-4 rounded-full hover:bg-gray-100 transition-colors">
                                                                        Login
                                                                    </button>
                                                                </div>
                                                                <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                                                                {/* <p className='font-inter text-white'>Please login to continue booking</p> */}
                                                            </>
                                                        )}

                                                        {userIds && (
                                                            <>
                                                                <div className="mb-5 mx-3">
                                                                    <label className="block text-white text-sm mb-2 text-start font-inter">Email address</label>
                                                                    <input
                                                                        type="email"
                                                                        name="email"
                                                                        value={formData.email}
                                                                        onChange={handleChange}
                                                                        className="w-full font-inter bg-primary border border-[#1c1c1c] rounded-full px-4 py-3 text-white placeholder-zinc-400 focus:outline-none"
                                                                        placeholder="johndoe@gmail.com"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="mx-3">
                                                                    <button onClick={handleNext} className="font-inter w-full bg-white text-black font-medium py-3 px-4 rounded-full hover:bg-gray-100 transition-colors">
                                                                        Continue to payment
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                                {step === 2 && (
                                                    <div className="mt-8">
                                                        <div className="mx-3">
                                                            <div className="text-start mb-4">
                                                                <p className="text-xs font-inter text-gray-400">TOTAL AMOUNT</p>
                                                                <p className="text-2xl font-medium font-inter text-gray-50 mt-2">
                                                                    {event.event_type === 'rsvp' ? (
                                                                        "Free"
                                                                    ) : ticket.price === 0 ? (
                                                                        "$0.00"
                                                                    ) : (
                                                                        <>
                                                                            <span className="text-[#606060]">$</span>
                                                                            {calculateTotal()}
                                                                        </>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            {event.event_type === 'rsvp' ? (
                                                                <button
                                                                    onClick={handleRSVPAdd}
                                                                    className={`w-full mt-4 font-inter py-3 rounded-full font-medium bg-white`}
                                                                >
                                                                    Book now
                                                                </button>
                                                            ) : (
                                                                <>
                                                                    {
                                                                        ticket.price === 0 ? (
                                                                            <button
                                                                                disabled={zeroLoading}
                                                                                onClick={handleZeroPay}
                                                                                className={`w-full mt-4 font-inter py-3 ${zeroLoading ? "bg-gray-400 cursor-not-allowed" : "bg-white"} rounded-full font-medium `}>
                                                                                {zeroLoading ? "Processing..." : "Pay"}
                                                                            </button>
                                                                        ) : (
                                                                            <Checkout
                                                                                clientSecret={clientSecret}
                                                                                setStep={setStep}
                                                                                amount={Math.round(parseFloat(calculateTotal()) * 100)}
                                                                                organizerId={organizerId}
                                                                                userId={userId}
                                                                                eventId={eventId}
                                                                                date={currentDateTime}
                                                                                status={"pending"}
                                                                                count={counts}
                                                                                ticketId={selectedTicketId}
                                                                                tickets={ticket}
                                                                                firstName={formData.firstName}
                                                                                lastName={formData.lastName}
                                                                                email={formData.email}
                                                                                tax={Number(event.tax) !== 0}
                                                                            />
                                                                        )
                                                                    }
                                                                </>
                                                            )}
                                                            <div className="flex justify-center items-center mt-2">
                                                                <FiLock className="text-[#606060] mr-2 h-4 w-4" />
                                                                <p className="font-inter text-[#606060] text-xs">Your data is encrypted</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {step === 3 && (
                                                    <>
                                                        <div className="flex justify-center items-center mt-4">
                                                            <img
                                                                src={success}
                                                                alt="Image"
                                                                className="w-20 h-20 rounded-lg object-cover"
                                                            />
                                                        </div>
                                                        <h1 className='font-inter text-xl text-white mt-5'>Payment successful!</h1>
                                                        <p className='text-xs text-gray-400 mt-2'>Scan the below QR Ticket</p>
                                                        <div className="flex justify-center items-center mt-4">
                                                            <img
                                                                src={book.qrcode}
                                                                alt="QR Code"
                                                                className="w-1/2 h-1/2 rounded-lg object-cover"
                                                            />
                                                        </div>

                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {step === 2 && (
                                <div className="w-full max-w-xs mx-auto md:mx-0 flex-1 space-y-2 justify-center items-center">
                                    <div className="bg-[#292929] bg-opacity-25 rounded-xl p-4">
                                        <div className='flex justify-between mb-4'>
                                            <h2 className="text-xs font-medium font-inter text-gray-400 uppercase">{event.category}</h2>
                                            <h2 className="text-xs font-medium font-inter text-gray-400">{formatDate(event.start_date)}</h2>
                                        </div>
                                        <div className="border-t border-[#292929] mt-4 pt-4 mx-[-16px] px-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-md font-inter text-white font-medium">{event.event_name}</span>
                                                    <div className="flex items-center mt-2">
                                                        <FaMapMarkerAlt className="text-gray-400 mr-1" size={12} />
                                                        <p className="text-xs text-gray-400 font-medium font-inter">
                                                            {event.venue_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <img
                                                    src={event.flyer}
                                                    alt="Image"
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border border-[#292929] rounded-xl p-4">
                                        <h2 className="text-xs font-medium font-inter text-gray-400 mb-4">ORDER SUMMARY</h2>
                                        <div className="border-t border-[#292929] mt-4 pt-4 mx-[-16px] px-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-xs font-medium font-inter text-[#7e7e7e]">{selectedTicketName}</span>
                                                    <p className="text-2xl text-white font-medium">
                                                        {
                                                            event.event_type === 'rsvp' ? (
                                                                <>
                                                                    <span className='text-[#7e7e7e]'></span>Free x {counts}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className='text-[#7e7e7e]'>$</span>{(selectedTicketPrice)} x {counts}
                                                                </>
                                                            )
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2 border border-[#272727] rounded-full p-1">
                                                    <button
                                                        onClick={() => {
                                                            const storedMin = localStorage.getItem('min_count');
                                                            const min_count =
                                                                !storedMin || storedMin === "undefined" || storedMin === ""
                                                                    ? 1
                                                                    : parseInt(storedMin, 10);

                                                            setCount((prev) => {
                                                                const newCount = Math.max(prev - 1, min_count);
                                                                localStorage.setItem('count', newCount);
                                                                return newCount;
                                                            });
                                                        }}
                                                        className="bg-[#141414] text-white w-8 h-8 rounded-full flex items-center justify-center"
                                                    >
                                                        -
                                                    </button>

                                                    <span className="text-white font-medium">{counts}</span>
                                                    <button
                                                        onClick={() => {
                                                            const maxCount = localStorage.getItem('max_count');
                                                            const remainingTickets = localStorage.getItem('remaining_tickets');

                                                            setCount((prev) => {
                                                                const maxLimit = maxCount && !isNaN(maxCount)
                                                                    ? parseInt(maxCount, 10)
                                                                    : (remainingTickets && !isNaN(remainingTickets)
                                                                        ? parseInt(remainingTickets, 10)
                                                                        : Infinity);
                                                                const newCount = Math.min(prev + 1, maxLimit);

                                                                localStorage.setItem('count', newCount);
                                                                return newCount;
                                                            });
                                                        }}
                                                        className="bg-[#141414] text-white w-8 h-8 rounded-full flex items-center justify-center"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center mb-4 mt-5">
                                                <input
                                                    type="text"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value)}
                                                    placeholder="Enter promo code"
                                                    style={{ textTransform: "uppercase" }}
                                                    className="bg-transparent border text-sm border-[#292929] text-white p-1 px-2 rounded-l-md w-full focus:outline-none"
                                                />
                                                <button
                                                    onClick={handleApply}
                                                    className="bg-white border text-sm text-black font-semibold py-1 px-3 rounded-r-md hover:bg-gray-200"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            <div className='flex flex-row justify-between mt-7'>
                                                <p className='font-inter text-gray-400 text-sm'>Ticket</p>
                                                <p className='font-inter text-white text-sm'>${(counts * selectedTicketPrice).toFixed(2)}</p>
                                            </div>
                                            {
                                                event.tax_name && (
                                                    <div className='flex flex-row justify-between mt-1'>
                                                        <p className='font-inter text-gray-400 text-sm'>{event.tax_name} ({event.tax_type === 'fixed' && "$"}{event.tax}{event.tax_type === 'percentage' && "%"})</p>
                                                        <p className="font-inter text-white text-sm">
                                                            {(() => {
                                                                const subtotal = count * selectedTicketPrice;
                                                                const taxValue = parseFloat(event.tax) || 0;
                                                                const taxType = event.tax_type || "percentage";

                                                                let organizerTax = 0;
                                                                if (taxType === "percentage") {
                                                                    organizerTax = subtotal * (taxValue / 100);
                                                                } else if (taxType === "fixed") {
                                                                    organizerTax = taxValue;
                                                                }

                                                                return `$${organizerTax.toFixed(2)}`;
                                                            })()}
                                                        </p>
                                                    </div>
                                                )
                                            }
                                            <div className='flex flex-row justify-between mt-1'>
                                                <p className='font-inter text-gray-400 text-sm'>Platform fee</p>
                                                <p className="font-inter text-white text-sm">
                                                    {
                                                        typeof event.tax !== "undefined" && !isNaN(event.tax) ? (
                                                            (() => {
                                                                const subtotal = count * selectedTicketPrice;
                                                                const taxValue = parseFloat(event.tax) || 0;
                                                                const taxType = event.tax_type || "percentage";

                                                                let organizerTax = 0;
                                                                if (taxType === "percentage") {
                                                                    organizerTax = subtotal * (taxValue / 100);
                                                                } else if (taxType === "fixed") {
                                                                    organizerTax = taxValue;
                                                                }

                                                                const platformFee = ((subtotal + organizerTax) * 0.09) + 0.89;
                                                                return (
                                                                    <span className="text-white">
                                                                        ${platformFee.toFixed(2)}
                                                                    </span>
                                                                );
                                                            })()
                                                        ) : ticket.price === 0 ? (
                                                            "$0.00"
                                                        ) : (
                                                            <span className="text-white">
                                                                ${((count * selectedTicketPrice * 0.09) + 0.89).toFixed(2)}
                                                            </span>
                                                        )
                                                    }
                                                </p>

                                            </div>
                                            {
                                                type && (
                                                    <>
                                                        <div className='flex flex-row justify-between mt-2'>
                                                            <p className='font-inter text-gray-400 text-sm'>Discount</p>
                                                            <p className='font-inter text-white text-sm'>- {" "}
                                                                {
                                                                    type === 'amount' ?
                                                                        `$${amount}` : `${amount}%`
                                                                }
                                                            </p>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            <div className="border-t border-gray-600 my-3" />
                                            <div className='flex flex-row justify-between mt-1'>
                                                <p className='font-inter text-gray-400 text-sm'>Total</p>
                                                {
                                                    ticket.price === 0 ? (
                                                        <p className='font-inter text-white text-sm'>$0.00</p>
                                                    ) : (
                                                        <p className='font-inter text-white text-sm'>${calculateTotal()}</p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div >
                    </div >
                )
            }
        </>
    );
}

export default Ticket;