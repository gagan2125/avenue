import React, { useEffect, useState } from 'react';
import success from "../assets/success.png";
import axios from 'axios';
import url from '../constants/url';
import { Link } from 'react-router-dom';

const StripeSuccess = () => {
    const [eventId, setEventId] = useState(null);

    useEffect(() => {
        const storedEventId = localStorage.getItem('organizer_eventId');
        if (storedEventId) {
            setEventId(storedEventId);
        }
    }, []);
    
    return (
        <div className="flex justify-center items-center min-h-screen w-full px-4">
            <div className="w-full max-w-md p-6 rounded-lg shadow-lg text-center">
                <div className="flex justify-center items-center mb-4">
                    <img
                        src={success}
                        alt="Success"
                        className="w-20 h-20 rounded-lg object-cover"
                    />
                </div>
                <label className="block text-xl font-medium text-white mb-3">
                    Stripe onboarding completed
                </label>
                <div className="flex flex-col sm:flex-row justify-evenly gap-4 mt-4">
                    <Link to="/organizer/dashboard" className='px-4 py-2 w-full sm:w-auto rounded-full h-10 border border-white/10 text-white font-semibold flex items-center justify-center gap-2'>
                        Go to dashboard
                    </Link>
                    <button 
                    onClick={async () => {
                        if (!eventId) return;
        
                        try {
                          const newStatus = "YES";
        
                          const response = await axios.patch(
                            `${url}/event/change-status/${eventId}`,
                            { status: newStatus }
                          );
                          setTimeout(() => {
                            window.location.href=`/organizer/events/${eventId}`;
                          }, [2500]);
                        } catch (error) {
                          console.error("Error updating event status:", error);
                          alert("Failed to change event status. Please try again.");
                        }
                      }}
                    className='px-4 py-2 w-full sm:w-auto bg-white rounded-full h-10 font-semibold flex items-center justify-center gap-2'>
                        Publish live
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StripeSuccess;