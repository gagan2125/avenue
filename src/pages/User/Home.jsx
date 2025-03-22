import React, { useEffect, useState } from 'react';
import { MdWindow } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { AiFillDollarCircle } from "react-icons/ai";
import { MdOutlineDateRange } from "react-icons/md";
import { FaBookmark, FaArtstation } from "react-icons/fa6";
import { FaTicketAlt, FaMusic } from 'react-icons/fa';
import { IoMdMoon } from "react-icons/io";
import PriceModal from '../../components/modals/PriceModal';
import PlaceModal from '../../components/modals/PlaceModal';
import url from '../../constants/url';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import image1 from "../../assets/home-explore.png"
import DateModal from '../../components/modals/DateModal';
import { FiCheck } from 'react-icons/fi';
import { GoBookmarkSlash, GoBookmark } from "react-icons/go"

const Home = () => {
  const [isModalPriceOpen, setIsModalPriceOpen] = useState(false);
  const [isModalPlaceOpen, setIsModalPlaceOpen] = useState(false);
  const [isModalDate, setIsModalDate] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState([0, 100]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [userId, setUserId] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState(new Set());

  const cards = [
    // { id: 1, icon: <MdWindow size={20} color='#898989' />, text: 'Type' },
    // {
    //   id: 2,
    //   icon: <FaLocationDot size={20} color='#898989' />,
    //   text: 'Place',
    //   onClick: () => { setIsModalPlaceOpen(true); },
    //   isActive: ""
    // },
    {
      id: 3,
      icon: <AiFillDollarCircle size={20} color='#898989' />,
      text: 'Price',
      onClick: () => { setIsModalPriceOpen(true); },
      isActive: sliderValue[0] !== 0 || sliderValue[1] !== 100 || showFreeOnly,
    },
    {
      id: 4,
      icon: <MdOutlineDateRange size={20} color='#898989' />,
      text: 'Date',
      onClick: () => { setIsModalDate(true); },
      isActive: !!startDate || !!endDate,
    },
  ];

  const clients = [
    {
      id: 1,
      logo: <IoMdMoon className="text-white" size={15} />,
      title: "NIGHTLIFE",
      date: "20 Jan 2025 22:00",
      image: "https://banner2.cleanpng.com/20180821/bo/cce051a88d8bd9b01c4f77d10c29693b.webp",
      location: "New York",
      price: "50"
    },
    {
      id: 2,
      logo: <FaMusic className="text-white" size={15} />,
      title: "MUSIC",
      date: "21 Jan 2025 18:00",
      image: "https://img.freepik.com/premium-photo/colorful-confetti-falling-crowd-party-photo_1233553-2491.jpg?semt=ais_hybrid",
      location: "Los Angeles",
      price: "20"
    },
    {
      id: 3,
      logo: <FaArtstation className="text-white" size={15} />,
      title: "ARTS & CULTURE",
      date: "22 Jan 2025 20:00",
      image: "https://hips.hearstapps.com/hmg-prod/images/family-toasting-on-christmas-dinner-at-home-royalty-free-image-1699896250.jpg?crop=1xw:0.84236xh;center,top&resize=1200:*",
      location: "Chicago",
      price: "37"
    },
    {
      id: 4,
      logo: <FaMusic className="text-white" size={15} />,
      title: "MUSIC",
      date: "21 Jan 2025 18:00",
      image: "https://plus.unsplash.com/premium_photo-1683129651802-1c7ba429a137?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGFydHl8ZW58MHx8MHx8fDA%3D",
      location: "Los Angeles",
      price: "20"
    },
    {
      id: 5,
      logo: <FaArtstation className="text-white" size={15} />,
      title: "ARTS & CULTURE",
      date: "22 Jan 2025 20:00",
      image: "https://media.istockphoto.com/id/1324561072/photo/party-people-enjoy-concert-at-festival-summer-music-festival.jpg?s=612x612&w=0&k=20&c=rT--yThoBJSdYFUb9nm-7oDvBZuhNE9LmB5uYmlxvSs=",
      location: "Chicago",
      price: "37"
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${month} ${day}`;
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${url}/event/get-event`);
      setEvents(response.data);
    } catch (error) {
      //console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDetail = (id, name) => {
    const cleanName = name
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    localStorage.setItem('user_event_id', id);
    localStorage.setItem('user_event_name', name);
    navigate(`/${name}`);
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const formatDateFilter = (date) => {
    return date.toISOString().split("T")[0];
  };

  function getDateOnly(date) {
    if (!date) return null;

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(date)) {
      date += ":00";
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.error("Invalid date:", date);
      return null;
    }

    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  }

  const filteredEvents = events.filter((event) => {
    const eventDate = getDateOnly(event.start_date);  // Ensure this returns a comparable date format
    const startDateOnly = startDate ? getDateOnly(startDate) : null;
    const endDateOnly = endDate ? getDateOnly(endDate) : null;

    const minPrice = sliderValue ? sliderValue[0] : null;
    const maxPrice = sliderValue ? sliderValue[1] : null;

    const currentDate = getDateOnly(new Date());  // Compare dates properly (string or timestamp)

    const isFutureEvent = eventDate >= currentDate;

    // const isWithinPriceRange =
    //   (minPrice === null || (event.ticket_start_price || 0) >= minPrice) &&
    //   (maxPrice === null || (event.ticket_start_price || 0) <= maxPrice);

    const getLowestTicketPrice = (tickets) => {
      if (!tickets || tickets.length === 0) return 0;
      return Math.min(...tickets.map((ticket) => Number(ticket.price) || 0));
    };

    const ticketPrice = getLowestTicketPrice(event.tickets);

    const isWithinPriceRange =
      (minPrice === null || ticketPrice >= minPrice) &&
      (maxPrice === null || ticketPrice <= maxPrice);


    const isWithinDateRange = (() => {
      if (startDateOnly && endDateOnly) {
        // If both start and end dates are selected, check if eventDate is within this range
        return eventDate >= startDateOnly && eventDate <= endDateOnly;
      } else if (startDateOnly && !endDateOnly) {
        // If only the start date is selected, check if eventDate matches it exactly
        return eventDate === startDateOnly;
      }
      // If no start or end date, allow all dates
      return true;
    })();

    const isFreeEvent = showFreeOnly ? event.event_type === "rsvp" : true;

    // console.log({
    //   eventDate,
    //   currentDate,
    //   isFutureEvent,
    //   isWithinPriceRange,
    //   isWithinDateRange,
    //   isFreeEvent,
    // });

    return (
      event.explore === "YES" &&
      isWithinPriceRange &&
      isWithinDateRange &&
      isFreeEvent &&
      isFutureEvent
    );
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  const handleReset = () => {
    setSliderValue([0, 100]);
    setStartDate(null);
    setEndDate(null);
    setShowFreeOnly(false)
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userID");
    setUserId(storedUserId);
  }, []);

  const handleBookmark = async (eventId) => {
    try {
      if (savedEventIds.has(eventId)) {
        const response = await axios.delete(`${url}/saved/delete-saved/${eventId}`, {
          data: { user_id: userId },
        });

        if (response.status === 200) {
          //console.log("Event unsaved successfully:", response.data);
          setSavedEventIds((prevState) => {
            const newSavedEventIds = new Set(prevState);
            newSavedEventIds.delete(eventId);
            return newSavedEventIds;
          });
        }
      } else {
        const response = await axios.post(`${url}/saved/add-saved`, {
          event_id: eventId,
          user_id: userId,
        });

        if (response.status === 201) {
          //console.log("Event saved successfully:", response.data);
          setSavedEventIds((prevState) => {
            const newSavedEventIds = new Set(prevState);
            newSavedEventIds.add(eventId);
            return newSavedEventIds;
          });
        }
      }
    } catch (error) {
      //console.error("Error updating bookmark status:", error);
    }
  };

  const fetchSavedEvents = async () => {
    try {
      const response = await axios.get(`${url}/saved/get-saved-id/${userId}`);

      if (response.status === 200 && response.data.data) {
        //console.log("Fetched saved events:", response.data.data);
        const savedIds = new Set(
          response.data.data.map((event) => event.event_id._id)
        );
        setSavedEventIds(savedIds);
      } else {
        //console.error("No saved events found in the database.");
        setSavedEventIds(new Set());
      }
    } catch (error) {
      //console.error("Error fetching saved events:", error);
    }
  };

  useEffect(() => {
    fetchSavedEvents()
  }, [userId])

  return (
    <div className="font-manrope flex flex-col items-center justify-center text-center mt-14 bg-primary px-4">
      <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-[76px] font-semibold text-white tracking-tighter">
        Find
        <img
          src={image1}
          alt="event icon"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-40 lg:h-40 inline-block align-middle mx-1 -mt-2 sm:-mt-6"
        />
        events
      </h1>

      <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-[76px] font-medium text-white mb-4 tracking-tighter -mt-4 sm:-mt-6 lg:-mt-8">
        in <span className="text-[#8a8686] underline decoration-[#2e2e2e] decoration-4">your</span> area
      </h1>
      <p className="text-xs sm:text-sm md:text-base font-geist text-[#fff] text-opacity-50 max-w-lg mx-auto mt-4">
        Avenue streamlines event discovery,
      </p>
      <p className="text-xs sm:text-sm md:text-base font-geist text-[#fff] text-opacity-50 max-w-lg mx-auto">
        creation, ticketing, and management.
      </p>

      <div className="flex flex-wrap justify-center mt-8 gap-1 bg-black px-1 py-1 rounded-[1.25rem] border border-[#fff] border-opacity-10">
        {cards.map((card) => (
          <button
            onClick={card.onClick}
            key={card.id}
            className="bg-[#141414] bg-opacity-70 px-5 md:px-6 w-[96px] h-[70px] md:py-3 sm:px-8 py-4 rounded-2xl shadow-lg text-center flex flex-col items-center transition-transform duration-300 transform hover:scale-90 relative"
          >
            <div className=''>
              <div className="mb-1.5 text-white flex justify-center">{card.icon}</div>
              <div className="flex items-center justify-between">
                <p className="text-md text-white font-medium font-inter text-base leading-[20px]">{card.text}</p>
                {card.isActive && (
                  <div className='p-0.5 bg-[#34b2da] bg-opacity-15 rounded-md mt-1 ml-1 text-[#34b2da]'>
                    <FiCheck className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          </button>

        ))}
        {sliderValue[0] !== 0 || sliderValue[1] !== 100 || startDate || endDate || showFreeOnly ? (
          <button
            onClick={handleReset}
            className="bg-primary px-6 py-4 rounded-3xl shadow-lg text-center flex items-center justify-center border-2 border-dashed border-[#2a2a2a] transition-transform duration-300 hover:scale-90"
          >
            <span className="text-lg text-white font-medium font-inter">Clear all</span>
          </button>
        ) : null}
      </div>


      <PriceModal
        filteredEvents={filteredEvents.length}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        setShowFreeOnly={setShowFreeOnly}
        showFreeOnly={showFreeOnly}
        isOpen={isModalPriceOpen}
        onClose={() => setIsModalPriceOpen(false)}
      />

      <PlaceModal isOpen={isModalPlaceOpen} onClose={() => setIsModalPlaceOpen(false)} />

      <DateModal
        filteredEvents={filteredEvents.length}
        onDateChange={handleDateChange}
        isOpen={isModalDate}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onClose={() => setIsModalDate(false)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 sm:mt-8 px-4 sm:px-8 md:px-16 lg:px-10 bg-primary mb-10">
        {sortedEvents.map((card) => {
          const isEventSaved = savedEventIds.has(card._id);

          return (
            <button
              onClick={() => handleDetail(card._id, card.event_slug)}
              key={card.id}
              className="bg-neutral-800 bg-opacity-15 px-4 py-3 rounded-2xl shadow-lg text-left flex flex-col transition-transform duration-300 transform hover:scale-105"
            >
              {/* <div className="flex items-center justify-between w-full mb-2 gap-2">
                <div className="flex items-center min-w-0">
                  <div className="w-8 h-8 rounded-full flex justify-center items-center flex-shrink-0">
                    <FaArtstation className="text-purple-800" size={15} />
                  </div>
                  <h2 className="text-white/50 text-xs uppercase font-inter ml-2 truncate">
                    {card.category}
                  </h2>
                </div>
                <p className="text-white/50 text-xs font-inter flex-shrink-0">
                  {formatDate(card.start_date)}
                </p>
              </div> */}
              <div className="relative mb-4">
                <div className="aspect-w-2 aspect-h-3 w-full">
                  <img
                    src={card.flyer}
                    alt="event"
                    className="w-72 h-72 object-cover rounded-xl"
                  />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark(card._id);
                  }}
                  className="absolute top-2 right-2 bg-gray-500/50 p-2 rounded-full text-white border border-opacity-10 border-gray-50"
                >
                  {savedEventIds.has(card._id) ? (
                    <GoBookmarkSlash className="text-[#9b9b9b]" />
                  ) : (
                    <GoBookmark className="text-[#9b9b9b]" />
                  )}
                </div>

              </div>

              {/* <div className="flex items-center justify-between w-full mb-2 gap-2">
                <div className="flex items-center min-w-0">
                  <h2 className="text-white/50 text-xs uppercase font-inter truncate">
                    {card.category}
                  </h2>
                </div>
                <p className="text-white/50 text-xs font-inter flex-shrink-0">
                  {formatDate(card.start_date)}
                </p>
              </div> */}

              <div className="flex items-center justify-between w-full mb-2 gap-2">
                <div className="min-w-0 flex-1">
                  <h2 className="text-white text-sm font-semibold font-inter mb-2 truncate">
                    {card.event_name}
                  </h2>
                  <div className="flex items-center mt-1">
                    <FaLocationDot className="text-neutral-400 mr-1 flex-shrink-0" size={12} />
                    <span className="text-white/50 text-sm font-inter truncate">
                      {card.venue_name}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {
                    card.event_type === 'ticket' ? (
                      <p className="text-white font-medium whitespace-nowrap text-center">
                        <span className="text-gray-500 text-sm font-inter block">
                          {formatDate(card.start_date).split(" ")[0]} {/* Month */}
                        </span>
                        <span className="text-xl font-semibold font-inter block">
                          {formatDate(card.start_date).split(" ")[1]} {/* Date */}
                        </span>
                      </p>
                    ) : (
                      <p className="text-white font-medium whitespace-nowrap">
                        <span className="text-2xl font-semibold font-inter">
                          Free
                        </span>
                      </p>
                    )
                  }
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* <div className="mt-5">
        <div className="bg-primary py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-20">
            <div className="overflow-x-auto overflow-y-hidden">
              <div className="flex gap-6 items-center">
                {["transistor", "reform", "tuple", "savvycal", "statamic"].map((logo, index) => (
                  <img
                    key={index}
                    alt={logo}
                    src={`https://tailwindui.com/plus/img/logos/158x48/${logo}-logo-white.svg`}
                    className="max-h-12 w-auto object-contain flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}

    </div>

  );
};

export default Home;
