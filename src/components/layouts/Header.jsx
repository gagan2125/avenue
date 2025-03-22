import React, { useEffect, useState } from 'react';
import LoginModal from '../modals/LoginModal';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaBookmark, FaRegCalendarAlt } from 'react-icons/fa';
import { FaTicketAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import LogoutModal from '../modals/LogoutModal';
import logo from "../../assets/logo.png"
import { BookMarked } from 'lucide-react';
import { LuBookMarked } from 'react-icons/lu';
import { IoTicketOutline, IoTicketSharp } from 'react-icons/io5';
import { RiAccountPinCircleLine } from 'react-icons/ri';
import { FiRefreshCcw } from "react-icons/fi";

const Header = () => {
  const { name, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState('Explore');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isModalLogout, setIsModalLogout] = useState(false);

  const userId = localStorage.getItem('userID') || "";
  const [oragnizerId, setOragnizerId] = useState(null);

  useEffect(() => {
    const EventName = localStorage.getItem('user_event_name') || "";
    const OrganizerName = localStorage.getItem('user_organizer_name') || "";
    setEventName(EventName)
    setOrganizerName(OrganizerName)
  })

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedUserOrganizerId = localStorage.getItem('organizerId');
      setOragnizerId(storedUserOrganizerId);
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
    if (location.pathname === '/') {
      setActiveButton('Explore');
    } else if (location.pathname === '/organizer/create-event') {
      setActiveButton('Create');
    }
  }, [location.pathname]);

  const handleExplore = () => {
    setActiveButton('Explore');
    navigate("/");
  };

  const handleCreate = () => {
    setActiveButton('Create');
    navigate("/organizer/create-event");
  };

  return (
    <nav className={`${location.pathname === '/' ? "bg-primary" : "bg-[#000000]"} text-white flex items-center justify-between px-[20px] sm:px-[32px] py-[18px]`}>
      <a href="/" className="flex items-center space-x-2 text-lg font-bold">
        <img src={logo} alt="logo" className="w-28 sm:w-32 sm:h-auto" />
      </a>

      {location.pathname.startsWith('/info') ? (
        // <div className="flex space-x-3 bg-opacity-50 rounded-full py-1 px-1">
        //   <span className="flex items-center space-x-4">
        //     <span className="text-[#898989] text-xs font-inter">Home</span>
        //     <span className="text-[#898989] text-xs font-inter">/</span>
        //     <span className="text-white font-bold text-xs font-inter"> {eventName.replace(/-/g, ' ')}</span>
        //   </span>
        // </div>
        ""
      ) : location.pathname.startsWith('/creater') ? (
        <>
          {/* <div className="flex space-x-3 bg-opacity-50 rounded-full py-1 px-1">
            <span className="flex items-center space-x-4">
              <span className="text-[#898989] text-xs">Home</span>
              <span className="text-[#898989] text-xs">/</span>
              <span className="text-[#898989] text-xs">{eventName.replace(/-/g, ' ')}</span>
              <span className="text-[#898989] text-xs">/</span>
              <span className="text-white font-bold text-xs">{organizerName.replace(/-/g, ' ')}</span>
            </span>
          </div> */}
        </>
      ) : location.pathname.startsWith('/tickets') ? (
        <>
          <div></div>
        </>
      ) : location.pathname.startsWith('/profile') ? (
        <>
          <div></div>
        </>
      ) : location.pathname.startsWith('/checkout') ? (
        <>
          <div></div>
        </>
      ) : location.pathname.startsWith('/ticket') ? (
        <>
          <div></div>
        </>
      ) : location.pathname.startsWith('/saved') ? (
        <>
          <div></div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full">
          <div className="flex bg-[#fff] bg-opacity-10 rounded-full py-1 px-1">
            <button
              onClick={handleExplore}
              className={`tracking-tighter px-2 py-1 sm:py-2.5 sm:px-4 text-xs sm:text-[16px] font-inter rounded-full sm:font-medium font-semibold transition ${activeButton === 'Explore'
                ? 'bg-[#F0F0F0] bg-opacity-10 text-white'
                : 'text-[#ffffff] hover:bg-[#F0F0F0] hover:bg-opacity-10 text-opacity-60'
                }`}
            >
              Explore
            </button>
            <button
              onClick={handleCreate}
              className={`tracking-tighter px-2 py-1 sm:py-2.5 sm:px-4 text-xs sm:text-[16px] font-inter rounded-full sm:font-medium transition ${activeButton === 'Create'
                ? 'bg-[#F0F0F0] bg-opacity-10 text-white'
                : 'text-[#ffffff] hover:bg-[#F0F0F0] hover:bg-opacity-10 text-opacity-60'
                }`}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {
        location.pathname === '/info/:name' || location.pathname === '/creater/:id' ? (
          <div className="flex space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#4e4e4e] bg-opacity-50 text-xs text-white px-5 py-1 rounded-full font-bold hover:bg-[#4e4e4e] transition"
            >
              Explore
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black px-5 py-1 rounded-full font-medium hover:bg-gray-200 transition flex items-center space-x-2"
            >
              <FaRegCalendarAlt className="text-black h-4 w-4" />
              <span className='text-xs'>Create Event</span>
            </button>
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </div>
        ) : location.pathname === '/tickets' ? (
          <>
            <div className="flex space-x-3 bg-opacity-50 rounded-full py-1 px-1">
              <span className="flex items-center space-x-4">
                <span className="text-[#898989] text-xs">Home</span>
                <span className="text-[#898989] text-xs">/</span>
                <span className="text-white font-bold text-xs"> Tickets</span>
              </span>
            </div>
          </>
        ) : location.pathname === '/profile' ? (
          <>
            <div className="flex space-x-3 bg-opacity-50 rounded-full py-1 px-1">
              <span className="flex items-center space-x-4">
                <span className="text-[#898989] text-xs">Home</span>
                <span className="text-[#898989] text-xs">/</span>
                <span className="text-white font-bold text-xs"> Profile</span>
              </span>
            </div>
          </>
        ) : (
          <>
            {
              userId ? (
                <div className="flex space-x-4 items-center">
                  <div className="relative inline-block text-left">
                    <button
                      className="h-[32px] sm:h-[44px] tracking-tighter border border-[#fff] border-opacity-10 font-inter text-xs sm:text-[16px] text-white px-4 py-1 sm:py-2 sm:px-5 rounded-full font-medium hover:bg-gray-200 hover:bg-opacity-15 transition-all shadow-sm focus:outline-none"
                      onClick={() => setIsOpen((prev) => !prev)}
                    >
                      Profile
                    </button>

                    {isOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] rounded-lg shadow-xl z-50"
                      >
                        <ul className="py-2">
                          <li>
                            <a
                              href="/tickets"
                              className="flex items-center px-4 py-3 hover:bg-[#2a2a2a] rounded-md transition-all"
                            >
                              <IoTicketSharp className="text-gray-400 mr-3" />
                              <span className="text-white text-xs font-inter">My Tickets</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="/saved"
                              className="flex items-center px-4 py-3 hover:bg-[#2a2a2a] rounded-md transition-all"
                            >
                              <FaBookmark className="text-gray-400 mr-3" size={14} />
                              <span className="text-white text-xs font-inter">My Saved</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="/profile"
                              className="flex items-center px-4 py-3 hover:bg-[#2a2a2a] rounded-md transition-all"
                            >
                              <RiAccountPinCircleLine className="text-gray-400 mr-3" />
                              <span className="text-white text-xs font-inter">My Account</span>
                            </a>
                          </li>
                          {
                            oragnizerId && (
                              <li>
                                <a
                                  href="/organizer/dashboard/"
                                  className="flex items-center px-4 py-3 hover:bg-[#2a2a2a] rounded-md transition-all"
                                >
                                  <FiRefreshCcw className="text-gray-400 mr-3" />
                                  <span className="text-white text-xs font-inter">Switch to Organizer</span>
                                </a>
                              </li>
                            )
                          }
                          <li>
                            <a
                              onClick={() => {
                                localStorage.clear();
                                window.location.href = "/";
                              }}
                              className="flex items-center px-4 py-3 hover:bg-[#2a2a2a] rounded-md transition-all cursor-pointer"
                            >
                              <FaSignOutAlt className="text-gray-400 mr-3" />
                              <span className="text-white text-xs font-inter">Logout</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <LogoutModal isOpen={isModalLogout} onClose={() => setIsModalLogout(false)} />
                </div>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="h-[32px] sm:h-[44px] tracking-tighter border border-[#fff] border-opacity-10 font-inter text-xs sm:text-[16px] text-white px-4 py-1 sm:py-2 sm:px-5 rounded-full font-medium hover:bg-gray-200 hover:bg-opacity-15 transition-all shadow-sm focus:outline-none"
                  >
                    Login
                  </button>
                  <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>
              )
            }
          </>

        )
      }
    </nav>
  );
};

export default Header;
