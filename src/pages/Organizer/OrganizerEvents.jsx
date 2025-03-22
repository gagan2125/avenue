/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import SidebarToggle from "../../components/layouts/SidebarToggle";
import {
  Tabs,
  TabsList,
  TabTrigger,
  TabsContent,
} from "../../components/ui/Tabs";
import {
  DirectionAwareMenu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../../components/ui/DirectionAwareMenu";
import { ArrowRight, Ellipsis } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../../components/ui/Dailog";
import axios from "axios";
import url from "../../constants/url";
import { Spin } from "antd";
import { motion } from "framer-motion";

// Mock data structure
const eventData = {
  liveEvents: [
    {
      id: 1,
      name: "After Hours Neon",
      date: "Dec 28, 22:00",
      location: "Cloud Nine",
      revenue: "$10,240",
      totalTickets: 500,
      ticketsSold: 256,
    },
    {
      id: 2,
      name: "Electric Dreams",
      date: "Dec 29, 21:00",
      location: "Neon Hall",
      revenue: "$7,580",
      totalTickets: 310,
      ticketsSold: 189,
    },
    {
      id: 3,
      name: "Synthwave Party",
      date: "Dec 30, 23:00",
      location: "The Grand",
      revenue: "$3,680",
      totalTickets: 200,
      ticketsSold: 92,
    },
  ],
  drafts: [
    {
      id: 1,
      name: "Winter Festival",
      date: "Jan 5, 20:00",
      location: "Arena Hall",
      revenue: "-",
      ticketsSold: "-",
    },
    {
      id: 2,
      name: "Jazz Night",
      date: "Jan 8, 21:00",
      location: "Blue Room",
      revenue: "-",
      ticketsSold: "-",
    },
  ],
  deactivated: [
    {
      id: 1,
      name: "Neon Nights Vol.1",
      date: "Nov 15, 22:00",
      location: "Cloud Nine",
      revenue: "$8,420",
      totalTickets: 500,
      ticketsSold: 168,
    },
    {
      id: 2,
      name: "Retro Beats",
      date: "Nov 20, 21:00",
      location: "The Vault",
      revenue: "$5,340",
      totalTickets: 500,
      ticketsSold: 178,
    },
    {
      id: 8,
      name: "Summer Vibes Festival",
      date: "2024-07-15",
      location: "Cloud Nine",
      revenue: "$8,420",
      totalTickets: 500,
      ticketsSold: 256,
    },
    {
      id: 9,
      name: "Jazz Night",
      date: "2024-08-01",
      location: "The Vault",
      revenue: "$5,340",
      totalTickets: 500,
      ticketsSold: 256,
    },
  ],
};

export default function OrganizerEvents() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live");
  const [liveCount, setLiveCount] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [oragnizerId, setOragnizerId] = useState(null);
  const [events, setEvents] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [remain, setRemain] = useState([]);
  const [soldTickets, setSoldTickets] = useState(0);
  const [remainCount, setRemainCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDraftNotification, setshowDraftNotification] = useState(false);
  const [showPublishNotification, setshowPublishNotification] = useState(false);
  const [showActivateNotification, setshowActivateNotification] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [organizer, setOrganizer] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveTab(hash || "live");
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // const filterEvents = (events) => {
  //     if (!searchQuery) return events;

  //     const searchLower = searchQuery.toLowerCase();

  //     return events.filter(event => {
  //         const formattedDate = new Date(event.start_date)
  //             .toLocaleString("en-US", {
  //                 month: "short",
  //                 day: "numeric",
  //                 hour: "numeric",
  //                 minute: "2-digit",
  //                 hour12: true,
  //             })
  //             .replace(",", "")
  //             .toLowerCase();
  //         console.log("event", event)
  //         return (
  //             event &&
  //             event.event_name &&
  //             event.venue_name &&
  //             event.event_name.toLowerCase().includes(searchLower) ||
  //             event.venue_name.toLowerCase().includes(searchLower) ||
  //             formattedDate.includes(searchLower) &&
  //             event.explore === "YES"
  //         )
  //     }
  //     );
  // };
  const filterEvents = (events) => {
    if (!events) return [];

    const searchLower = searchQuery ? searchQuery.toLowerCase() : "";
    const currentDate = new Date();

    return events
      .filter((event) => {
        const formattedDate = new Date(event.start_date)
          .toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .replace(",", "")
          .toLowerCase();

        const matchesSearch =
          !searchQuery ||
          event.event_name.toLowerCase().includes(searchLower) ||
          event.venue_name.toLowerCase().includes(searchLower) ||
          formattedDate.includes(searchLower);

        return matchesSearch;
      })
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date)); // Newest first
  };

  const handleViewEvent = (eventId) => {
    navigate(`/organizer/events/${eventId}`);
  };

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedUserOrganizerId = localStorage.getItem("organizerId");
      const storedAccountID = localStorage.getItem("accountId");
      setAccountId(storedAccountID || "");
      setOragnizerId(storedUserOrganizerId);
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

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/event/get-event-by-organizer-id/${oragnizerId}`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [oragnizerId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${capitalizedMonth} ${day} at ${hours}:${minutes} ${ampm}`;
  };

  const earningFunc = async (id) => {
    try {
      const response = await axios.get(`${url}/get-event-payment-list/${id}`);

      const total = response.data.reduce((acc, payout) => {
        if (!payout.transaction_id) return acc;

        const payoutAmount = (
          payout?.tickets?.price * payout.count +
          (payout.tax ? parseFloat(payout.tax || 0) / 100 : 0)
        ).toFixed(2);

        return acc + parseFloat(payoutAmount);
      }, 0);

      return (
        "$" +
        total.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) || "$" + 0
      );
    } catch (error) {
      console.error(`Error fetching events for id: ${id}`, error);
      return "No revenue";
    }
  };

  useEffect(() => {
    const fetchEarnings = async () => {
      const earningsData = {};
      for (const event of events) {
        earningsData[event._id] = await earningFunc(event._id);
        await fetchRemainEvent(event._id);
      }
      setEarnings(earningsData);
    };

    fetchEarnings();
  }, [events]);

  const fetchRemainEvent = async (id) => {
    try {
      const response = await axios.get(`${url}/remain-tickets/${id}`);

      if (response.data) {
        const sold = response.data.reduce(
          (acc, event) => acc + Number(event.tickets_sold),
          0
        );
        const remaining = response.data.reduce(
          (acc, event) => acc + Number(event.remaining_tickets),
          0
        );

        setSoldTickets((prev) => ({ ...prev, [id]: sold }));
        setRemainCount((prev) => ({ ...prev, [id]: remaining }));
      }
    } catch (error) {
      console.error(`Error fetching remain events for id: ${id}`, error);
    }
  };

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const pastEvents = filterEvents(events).filter((event) => {
    const eventDate = new Date(event.start_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < currentDate && event.explore === "YES";
  });

  const liveEvents = filterEvents(events).filter((event) => {
    const eventDate = new Date(event.start_date);
    eventDate.setHours(0, 0, 0, 0);
    return (
      eventDate >= currentDate &&
      event.explore === "YES" &&
      event.status === "active"
    );
  });

  useEffect(() => {
    if (liveEvents.length > 0) {
      setLiveCount(
        filterEvents(liveEvents).filter(
          (event) => event.explore === "YES" && event.status === "active"
        ).length
      );
    }
  }, [liveEvents]);

  const fetchOrganizer = async () => {
    if (oragnizerId) {
      try {
        const response = await axios.get(`${url}/get-organizer/${oragnizerId}`);
        setOrganizer(response.data);
      } catch (error) {
        console.error("Error fetching organizer:", error);
      }
    }
  };

  useEffect(() => {
    if (oragnizerId) {
      fetchOrganizer();
    }
  }, [oragnizerId]);

  const handleOnboard = () => {
    if (organizer && organizer.stripeAccountId) {
      axios.post(`${url}/generate-onboarding-url`, { accountId: organizer.stripeAccountId })
        .then(response => {
          window.location.href = response.data.url;
        })
        .catch(error => {
          console.error('Error generating onboarding URL:', error);
        });
    }
  }

  return (
    <SidebarLayout>
      <div className="m-4 mb-2 z-20">
        <SidebarToggle />
      </div>
      <div className="min-h-screen text-white p-6 max-w-7xl mx-auto @container">
        <h1 className="text-2xl md:text-3xl font-bold mb-9">Your Events</h1>

        {loading ? (
          <>
            <div className="text-center">
              <Spin size="small" />
            </div>
          </>
        ) : (
          <Tabs className="flex flex-col gap-6 w-full">
            <div className="flex flex-col items-start justify-between w-full gap-4 md:flex-row">
              <TabsList
                selectedValue={activeTab}
                className="md:bg-white/5 md:px-1 @4xl:rounded-full"
              >
                {liveCount !== 0 ? (
                  <TabTrigger
                    value="live"
                    active={activeTab === "live"}
                    onClick={() => setActiveTab("live")}
                    className={`flex items-center gap-2 p-2 pl-2 pr-1 @4xl:rounded-full hover:bg-white/5 ${activeTab === "live" ? "bg-white/10" : ""
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.757 4.5C3.937 4.717 4.133 4.92 4.343 5.108C4.496 4.498 4.697 3.933 4.939 3.43C4.49539 3.7277 4.09725 4.08811 3.757 4.5ZM8 1C7.08053 0.999213 6.16992 1.17974 5.32028 1.53124C4.47065 1.88274 3.69866 2.39833 3.0485 3.0485C2.39833 3.69866 1.88274 4.47065 1.53124 5.32028C1.17974 6.16992 0.999213 7.08053 1 8C1 9.38447 1.41055 10.7379 2.17972 11.889C2.94889 13.0401 4.04214 13.9373 5.32122 14.4672C6.6003 14.997 8.00777 15.1356 9.36563 14.8655C10.7235 14.5954 11.9708 13.9287 12.9497 12.9497C13.9287 11.9708 14.5954 10.7235 14.8655 9.36563C15.1356 8.00777 14.997 6.6003 14.4672 5.32122C13.9373 4.04214 13.0401 2.94889 11.889 2.17972C10.7379 1.41055 9.38447 1 8 1ZM8 2.5C7.524 2.5 6.909 2.886 6.367 3.927C6.074 4.491 5.836 5.194 5.684 5.99C6.40952 6.32701 7.20003 6.50109 8 6.5C8.79997 6.50109 9.59048 6.32701 10.316 5.99C10.164 5.194 9.926 4.491 9.633 3.927C9.09 2.886 8.476 2.5 8 2.5ZM11.657 5.108C11.5154 4.53 11.3157 3.96781 11.061 3.43C11.505 3.728 11.903 4.089 12.243 4.5C12.063 4.717 11.867 4.92 11.657 5.108ZM10.491 7.544C9.6954 7.84655 8.85119 8.00109 8 8C7.14915 8.00097 6.30529 7.84643 5.51 7.544C5.47111 8.41566 5.53894 9.28881 5.712 10.144C6.432 10.375 7.202 10.5 8 10.5C8.798 10.5 9.568 10.375 10.29 10.144C10.4624 9.28872 10.5295 8.41558 10.49 7.544H10.491ZM11.924 9.394C12.0199 8.52728 12.0259 7.65297 11.942 6.785C12.347 6.509 12.722 6.191 13.059 5.838C13.3643 6.55229 13.5143 7.32334 13.499 8.1C13.035 8.60032 12.5051 9.0353 11.924 9.393V9.394Z"
                        fill="white"
                        fillOpacity="0.5"
                      />
                    </svg>
                    Live Events
                    <span className="bg-[#151515] h-6 w-fit px-2 rounded-full flex items-center justify-center">
                      {liveCount !== 0 ? liveCount : ""}
                    </span>
                  </TabTrigger>
                ) : (
                  <TabTrigger
                    value="live"
                    active={activeTab === "live"}
                    onClick={() => setActiveTab("live")}
                    className={`flex items-center gap-2 p-2 pl-2 pr-1 @4xl:rounded-full hover:bg-white/5 ${activeTab === "live" ? "bg-white/10" : ""
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.757 4.5C3.937 4.717 4.133 4.92 4.343 5.108C4.496 4.498 4.697 3.933 4.939 3.43C4.49539 3.7277 4.09725 4.08811 3.757 4.5ZM8 1C7.08053 0.999213 6.16992 1.17974 5.32028 1.53124C4.47065 1.88274 3.69866 2.39833 3.0485 3.0485C2.39833 3.69866 1.88274 4.47065 1.53124 5.32028C1.17974 6.16992 0.999213 7.08053 1 8C1 9.38447 1.41055 10.7379 2.17972 11.889C2.94889 13.0401 4.04214 13.9373 5.32122 14.4672C6.6003 14.997 8.00777 15.1356 9.36563 14.8655C10.7235 14.5954 11.9708 13.9287 12.9497 12.9497C13.9287 11.9708 14.5954 10.7235 14.8655 9.36563C15.1356 8.00777 14.997 6.6003 14.4672 5.32122C13.9373 4.04214 13.0401 2.94889 11.889 2.17972C10.7379 1.41055 9.38447 1 8 1ZM8 2.5C7.524 2.5 6.909 2.886 6.367 3.927C6.074 4.491 5.836 5.194 5.684 5.99C6.40952 6.32701 7.20003 6.50109 8 6.5C8.79997 6.50109 9.59048 6.32701 10.316 5.99C10.164 5.194 9.926 4.491 9.633 3.927C9.09 2.886 8.476 2.5 8 2.5ZM11.657 5.108C11.5154 4.53 11.3157 3.96781 11.061 3.43C11.505 3.728 11.903 4.089 12.243 4.5C12.063 4.717 11.867 4.92 11.657 5.108ZM10.491 7.544C9.6954 7.84655 8.85119 8.00109 8 8C7.14915 8.00097 6.30529 7.84643 5.51 7.544C5.47111 8.41566 5.53894 9.28881 5.712 10.144C6.432 10.375 7.202 10.5 8 10.5C8.798 10.5 9.568 10.375 10.29 10.144C10.4624 9.28872 10.5295 8.41558 10.49 7.544H10.491ZM11.924 9.394C12.0199 8.52728 12.0259 7.65297 11.942 6.785C12.347 6.509 12.722 6.191 13.059 5.838C13.3643 6.55229 13.5143 7.32334 13.499 8.1C13.035 8.60032 12.5051 9.0353 11.924 9.393V9.394Z"
                        fill="white"
                        fillOpacity="0.5"
                      />
                    </svg>
                    Live Events
                    {/* <span className="bg-[#151515] h-6 w-fit px-2 rounded-full flex items-center justify-center">
                                            {pastEvents.length}
                                        </span> */}
                  </TabTrigger>
                )}
                <TabTrigger
                  value="past"
                  active={activeTab === "past"}
                  onClick={() => setActiveTab("past")}
                  className={`flex items-center gap-2 p-2 pl-2 pr-1 @4xl:rounded-full hover:bg-white/5 ${activeTab === "past" ? "bg-white/10" : ""
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <path d="M3 3v6h6" />
                    <path d="M21 21v-6h-6" />
                    <path d="M3 21l18-18" />
                  </svg>
                  Past
                  <span className="bg-[#151515] h-6 w-fit px-2 rounded-full flex items-center justify-center">
                    {
                      pastEvents.filter(
                        (event) =>
                          event.explore === "YES" && event.status === "active"
                      ).length
                    }
                  </span>
                </TabTrigger>
                <TabTrigger
                  value="drafts"
                  active={activeTab === "drafts"}
                  onClick={() => setActiveTab("drafts")}
                  className={`flex items-center gap-2 p-2 pl-2 pr-1 @4xl:rounded-full hover:bg-white/5 ${activeTab === "drafts" ? "bg-white/10" : ""
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V4C2 4.26522 2.10536 4.51957 2.29289 4.70711C2.48043 4.89464 2.73478 5 3 5H13C13.2652 5 13.5196 4.89464 13.7071 4.70711C13.8946 4.51957 14 4.26522 14 4V3C14 2.73478 13.8946 2.48043 13.7071 2.29289C13.5196 2.10536 13.2652 2 13 2H3Z"
                      fill="white"
                      fillOpacity="0.5"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 6H13V12C13 12.5304 12.7893 13.0391 12.4142 13.4142C12.0391 13.7893 11.5304 14 11 14H5C4.46957 14 3.96086 13.7893 3.58579 13.4142C3.21071 13.0391 3 12.5304 3 12V6ZM6 8.75C6 8.55109 6.07902 8.36032 6.21967 8.21967C6.36032 8.07902 6.55109 8 6.75 8H9.25C9.44891 8 9.63968 8.07902 9.78033 8.21967C9.92098 8.36032 10 8.55109 10 8.75C10 8.94891 9.92098 9.13968 9.78033 9.28033C9.63968 9.42098 9.44891 9.5 9.25 9.5H6.75C6.55109 9.5 6.36032 9.42098 6.21967 9.28033C6.07902 9.13968 6 8.94891 6 8.75Z"
                      fill="white"
                      fillOpacity="0.5"
                    />
                  </svg>
                  Drafts{" "}
                  <span className="bg-[#151515] h-6 w-fit px-2 rounded-full flex items-center justify-center">
                    {events
                      ? filterEvents(events).filter(
                        (event) =>
                          event.explore === "NO" && event.status === "active"
                      ).length
                      : 0}
                  </span>
                </TabTrigger>
                <TabTrigger
                  value="deactivated"
                  active={activeTab === "deactivated"}
                  onClick={() => setActiveTab("deactivated")}
                  className={`flex items-center gap-2 p-2 pl-2 pr-1 @4xl:rounded-full hover:bg-white/5 ${activeTab === "deactivated" ? "bg-white/10" : ""
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM10.78 10.78C10.6394 10.9205 10.4488 10.9993 10.25 10.9993C10.0512 10.9993 9.86063 10.9205 9.72 10.78L8 9.06L6.28 10.78C6.21134 10.8537 6.12854 10.9128 6.03654 10.9538C5.94454 10.9948 5.84523 11.0168 5.74452 11.0186C5.64382 11.0204 5.54379 11.0018 5.4504 10.9641C5.35701 10.9264 5.27218 10.8703 5.20096 10.799C5.12974 10.7278 5.0736 10.643 5.03588 10.5496C4.99816 10.4562 4.97963 10.3562 4.98141 10.2555C4.98319 10.1548 5.00523 10.0555 5.04622 9.96346C5.08721 9.87146 5.14631 9.78866 5.22 9.72L6.94 8L5.22 6.28C5.08752 6.13783 5.0154 5.94978 5.01883 5.75548C5.02225 5.56118 5.10097 5.37579 5.23838 5.23838C5.37579 5.10097 5.56118 5.02225 5.75548 5.01883C5.94978 5.0154 6.13783 5.08752 6.28 5.22L8 6.94L9.72 5.22C9.78866 5.14631 9.87146 5.08721 9.96346 5.04622C10.0555 5.00523 10.1548 4.98319 10.2555 4.98141C10.3562 4.97963 10.4562 4.99816 10.5496 5.03588C10.643 5.0736 10.7278 5.12974 10.799 5.20096C10.8703 5.27218 10.9264 5.35701 10.9641 5.4504C11.0018 5.54379 11.0204 5.64382 11.0186 5.74452C11.0168 5.84523 10.9948 5.94454 10.9538 6.03654C10.9128 6.12854 10.8537 6.21134 10.78 6.28L9.06 8L10.78 9.72C10.9205 9.86063 10.9993 10.0512 10.9993 10.25C10.9993 10.4488 10.9205 10.6394 10.78 10.78Z"
                      fill="white"
                      fillOpacity="0.5"
                    />
                  </svg>
                  Deactivated{" "}
                  <span className="bg-[#151515] h-6 w-fit px-2 rounded-full flex items-center justify-center">
                    {events
                      ? filterEvents(events).filter(
                        (event) => event.status === "inactive"
                      ).length
                      : 0}
                  </span>
                </TabTrigger>
              </TabsList>

              <div className="relative w-full @4xl:w-fit flex justify-end">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/10 md:w-[250px]"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            <TabsContent value="live" activeTab={activeTab}>
              <div className="border rounded-xl border-white/10 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:min-w-[180px] last:[&>th]:min-w-fit">
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10218 14 1.5V2.5C14 2.776 13.773 2.994 13.505 3.062C13.0743 3.1718 12.6925 3.42192 12.4198 3.77286C12.1472 4.1238 11.9991 4.55557 11.9991 5C11.9991 5.44443 12.1472 5.8762 12.4198 6.22714C12.6925 6.57808 13.0743 6.8282 13.505 6.938C13.773 7.006 14 7.224 14 7.5V8.5C14 8.89782 13.842 9.27936 13.5607 9.56066C13.2794 9.84196 12.8978 10 12.5 10H1.5C1.10218 10 0.720644 9.84196 0.43934 9.56066C0.158035 9.27936 0 8.89782 0 8.5V7.5C0 7.224 0.227 7.006 0.495 6.938C0.925654 6.8282 1.30747 6.57808 1.58016 6.22714C1.85285 5.8762 2.00088 5.44443 2.00088 5C2.00088 4.55557 1.85285 4.1238 1.58016 3.77286C1.30747 3.42192 0.925654 3.1718 0.495 3.062C0.227 2.994 0 2.776 0 2.5V1.5ZM9 2.75C9 2.55109 9.07902 2.36032 9.21967 2.21967C9.36032 2.07902 9.55109 2 9.75 2C9.94891 2 10.1397 2.07902 10.2803 2.21967C10.421 2.36032 10.5 2.55109 10.5 2.75V3.75C10.5 3.94891 10.421 4.13968 10.2803 4.28033C10.1397 4.42098 9.94891 4.5 9.75 4.5C9.55109 4.5 9.36032 4.42098 9.21967 4.28033C9.07902 4.13968 9 3.94891 9 3.75V2.75ZM9.75 5.5C9.55109 5.5 9.36032 5.57902 9.21967 5.71967C9.07902 5.86032 9 6.05109 9 6.25V7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25V6.25C10.5 6.05109 10.421 5.86032 10.2803 5.71967C10.1397 5.57902 9.94891 5.5 9.75 5.5Z"
                                fill="white"
                                fill-opacity="0.5"
                              />
                            </svg>{" "}
                            Event
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4 1.75C4 1.55109 4.07902 1.36032 4.21967 1.21967C4.36032 1.07902 4.55109 1 4.75 1C4.94891 1 5.13968 1.07902 5.28033 1.21967C5.42098 1.36032 5.5 1.55109 5.5 1.75V3H10.5V1.75C10.5 1.55109 10.579 1.36032 10.7197 1.21967C10.8603 1.07902 11.0511 1 11.25 1C11.4489 1 11.6397 1.07902 11.7803 1.21967C11.921 1.36032 12 1.55109 12 1.75V3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14H4C3.46957 14 2.96086 13.7893 2.58579 13.4142C2.21071 13.0391 2 12.5304 2 12V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3V1.75ZM4.5 6C4.23478 6 3.98043 6.10536 3.79289 6.29289C3.60536 6.48043 3.5 6.73478 3.5 7V11.5C3.5 11.7652 3.60536 12.0196 3.79289 12.2071C3.98043 12.3946 4.23478 12.5 4.5 12.5H11.5C11.7652 12.5 12.0196 12.3946 12.2071 12.2071C12.3946 12.0196 12.5 11.7652 12.5 11.5V7C12.5 6.73478 12.3946 6.48043 12.2071 6.29289C12.0196 6.10536 11.7652 6 11.5 6H4.5Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            Event Date
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="11"
                              height="13"
                              viewBox="0 0 11 13"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.289 12.841L5.292 12.844L5.294 12.846C5.42522 12.9454 5.58535 12.9993 5.75 12.9993C5.91465 12.9993 6.07478 12.9454 6.206 12.846L6.208 12.844L6.211 12.841L6.223 12.832C6.28744 12.7824 6.35079 12.7314 6.413 12.679C7.15862 12.0505 7.84362 11.3535 8.459 10.597C9.56 9.235 10.75 7.255 10.75 5C10.75 3.67392 10.2232 2.40215 9.28553 1.46447C8.34785 0.526784 7.07608 0 5.75 0C4.42392 0 3.15215 0.526784 2.21447 1.46447C1.27678 2.40215 0.75 3.67392 0.75 5C0.75 7.255 1.94 9.235 3.042 10.597C3.65739 11.3535 4.34239 12.0505 5.088 12.679C5.1503 12.7309 5.21331 12.7819 5.277 12.832L5.289 12.842V12.841ZM5.75 6.5C5.94698 6.5 6.14204 6.4612 6.32403 6.38582C6.50601 6.31044 6.67137 6.19995 6.81066 6.06066C6.94995 5.92137 7.06044 5.75601 7.13582 5.57403C7.2112 5.39204 7.25 5.19698 7.25 5C7.25 4.80302 7.2112 4.60796 7.13582 4.42597C7.06044 4.24399 6.94995 4.07863 6.81066 3.93934C6.67137 3.80005 6.50601 3.68956 6.32403 3.61418C6.14204 3.5388 5.94698 3.5 5.75 3.5C5.35218 3.5 4.97064 3.65804 4.68934 3.93934C4.40804 4.22064 4.25 4.60218 4.25 5C4.25 5.39782 4.40804 5.77936 4.68934 6.06066C4.97064 6.34196 5.35218 6.5 5.75 6.5Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            Location
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="16"
                              viewBox="0 0 17 16"
                              fill="none"
                            >
                              <path
                                d="M6.875 5.5H7.75V7.25H6.875C6.76009 7.25 6.64631 7.22737 6.54015 7.18339C6.43399 7.13942 6.33753 7.07497 6.25628 6.99372C6.17503 6.91247 6.11058 6.81601 6.06661 6.70985C6.02263 6.60369 6 6.48991 6 6.375C6 6.26009 6.02263 6.14631 6.06661 6.04015C6.11058 5.93399 6.17503 5.83753 6.25628 5.75628C6.33753 5.67503 6.43399 5.61058 6.54015 5.56661C6.64631 5.52263 6.76009 5.5 6.875 5.5ZM9.25 10.5V8.75H10.125C10.3571 8.75 10.5796 8.84219 10.7437 9.00628C10.9078 9.17038 11 9.39294 11 9.625C11 9.85706 10.9078 10.0796 10.7437 10.2437C10.5796 10.4078 10.3571 10.5 10.125 10.5H9.25Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.5 8C15.5 9.85652 14.7625 11.637 13.4497 12.9497C12.137 14.2625 10.3565 15 8.5 15C6.64348 15 4.86301 14.2625 3.55025 12.9497C2.2375 11.637 1.5 9.85652 1.5 8C1.5 6.14348 2.2375 4.36301 3.55025 3.05025C4.86301 1.7375 6.64348 1 8.5 1C10.3565 1 12.137 1.7375 13.4497 3.05025C14.7625 4.36301 15.5 6.14348 15.5 8ZM7.75 3.75C7.75 3.55109 7.82902 3.36032 7.96967 3.21967C8.11032 3.07902 8.30109 3 8.5 3C8.69891 3 8.88968 3.07902 9.03033 3.21967C9.17098 3.36032 9.25 3.55109 9.25 3.75V4H11.75C11.9489 4 12.1397 4.07902 12.2803 4.21967C12.421 4.36032 12.5 4.55109 12.5 4.75C12.5 4.94891 12.421 5.13968 12.2803 5.28033C12.1397 5.42098 11.9489 5.5 11.75 5.5H9.25V7.25H10.125C10.7549 7.25 11.359 7.50022 11.8044 7.94562C12.2498 8.39102 12.5 8.99511 12.5 9.625C12.5 10.2549 12.2498 10.859 11.8044 11.3044C11.359 11.7498 10.7549 12 10.125 12H9.25V12.25C9.25 12.4489 9.17098 12.6397 9.03033 12.7803C8.88968 12.921 8.69891 13 8.5 13C8.30109 13 8.11032 12.921 7.96967 12.7803C7.82902 12.6397 7.75 12.4489 7.75 12.25V12H5.25C5.05109 12 4.86032 11.921 4.71967 11.7803C4.57902 11.6397 4.5 11.4489 4.5 11.25C4.5 11.0511 4.57902 10.8603 4.71967 10.7197C4.86032 10.579 5.05109 10.5 5.25 10.5H7.75V8.75H6.875C6.24511 8.75 5.64102 8.49978 5.19562 8.05438C4.75022 7.60898 4.5 7.00489 4.5 6.375C4.5 5.74511 4.75022 5.14102 5.19562 4.69562C5.64102 4.25022 6.24511 4 6.875 4H7.75V3.75Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            Earnings
                          </div>
                        </th>

                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="16"
                              viewBox="0 0 17 16"
                              fill="none"
                            >
                              <path
                                d="M8.622 1.349C8.5087 1.28428 8.38048 1.25024 8.25 1.25024C8.11952 1.25024 7.9913 1.28428 7.878 1.349L3.068 4.097L8.25 7.131L13.432 4.097L8.622 1.349ZM14.25 5.357L9 8.43V14.435L13.872 11.651C13.9868 11.5854 14.0822 11.4907 14.1486 11.3764C14.215 11.262 14.25 11.1322 14.25 11V5.357ZM7.5 14.435V8.43L2.25 5.357V11C2.25 11.27 2.394 11.518 2.628 11.651L7.5 14.435Z"
                                fill="white"
                                fillOpacity="0.4"
                              />
                            </svg>
                            Tickets sold
                          </div>
                        </th>
                        <th className="text-left p-4">
                          {" "}
                          <Ellipsis />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterEvents(liveEvents).length > 0 ? (
                        filterEvents(liveEvents)
                          .filter(
                            (event) =>
                              event.explore === "YES" &&
                              event.status === "active"
                          )
                          .map((event) => {
                            const totalTickets =
                              (soldTickets[event._id] || 0) +
                              (remainCount[event._id] || 0);
                            const soldPercentage =
                              totalTickets > 0
                                ? ((soldTickets[event._id] || 0) /
                                  totalTickets) *
                                100
                                : 0;
                            return (
                              <tr
                                key={event.id}
                                className="border-b border-white/5 [&_td]:font-medium hover:bg-white/[2.5%] cursor-pointer transition-colors"
                              >
                                <td className="py-4 px-4 flex items-center gap-x-2">
                                  {event.event_name}

                                  <Link
                                    to={`/organizer/events/${event._id}`}
                                    className="ml-auto h-8 w-8 flex items-center justify-center rounded-md border border-white/5"
                                  >
                                    <ArrowRight className="w-4 h-4 text-white/50" />
                                  </Link>
                                </td>
                                <td className="py-4 pl-4">
                                  {formatDate(event.start_date)}
                                </td>
                                <td className="py-4 pl-4">
                                  {event.venue_name}
                                </td>
                                <td className="py-4 pl-4">
                                  {earnings[event._id] !== undefined
                                    ? earnings[event._id]
                                    : "Loading..."}
                                </td>
                                <td className="py-4 pl-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex gap-0.5">
                                      {[...Array(4)].map((_, i) => {
                                        const barFillPercentage = Math.min(
                                          Math.max(soldPercentage - i * 25, 0),
                                          25
                                        );

                                        let barColor;
                                        if (soldPercentage <= 25) {
                                          barColor = "#10B981";
                                        } else if (soldPercentage <= 50) {
                                          barColor = "#A3E635";
                                        } else {
                                          barColor = "#F97316";
                                        }

                                        return (
                                          <div
                                            key={i}
                                            className="h-4 w-1.5 rounded-full bg-white/10 overflow-hidden"
                                          >
                                            <div
                                              className="h-full transition-all duration-300 ease-out"
                                              style={{
                                                transform: `scaleY(${barFillPercentage / 25
                                                  })`,
                                                transformOrigin: "bottom",
                                                backgroundColor: barColor,
                                              }}
                                            />
                                          </div>
                                        );
                                      })}
                                    </div>
                                    {soldTickets[event._id] || 0}/
                                    {totalTickets || 100}
                                  </div>
                                </td>
                                <td className="py-4 pl-4">
                                  <DirectionAwareMenu>
                                    <MenuTrigger>
                                      <Ellipsis />
                                    </MenuTrigger>
                                    <MenuItem
                                      onClick={() => handleViewEvent(event._id)}
                                    >
                                      <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                        >
                                          <path
                                            d="M8 9.5C8.39782 9.5 8.77936 9.34196 9.06066 9.06066C9.34196 8.77936 9.5 8.39782 9.5 8C9.5 7.60218 9.34196 7.22064 9.06066 6.93934C8.77936 6.65804 8.39782 6.5 8 6.5C7.60218 6.5 7.22064 6.65804 6.93934 6.93934C6.65804 7.22064 6.5 7.60218 6.5 8C6.5 8.39782 6.65804 8.77936 6.93934 9.06066C7.22064 9.34196 7.60218 9.5 8 9.5Z"
                                            fill="white"
                                            fillOpacity="0.5"
                                          />
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M1.37996 8.28012C1.31687 8.09672 1.31687 7.89751 1.37996 7.71412C1.85633 6.33749 2.75014 5.14368 3.93692 4.29893C5.1237 3.45419 6.54437 3.00056 8.00109 3.00122C9.45782 3.00188 10.8781 3.4568 12.0641 4.30262C13.2501 5.14844 14.1428 6.34306 14.618 7.72012C14.681 7.90351 14.681 8.10273 14.618 8.28612C14.1418 9.6631 13.248 10.8573 12.0611 11.7023C10.8742 12.5473 9.4533 13.0011 7.99632 13.0005C6.53934 12.9998 5.11883 12.5447 3.9327 11.6986C2.74657 10.8525 1.85387 9.65753 1.37896 8.28012H1.37996ZM11 8.00012C11 8.79577 10.6839 9.55883 10.1213 10.1214C9.55867 10.684 8.79561 11.0001 7.99996 11.0001C7.20431 11.0001 6.44125 10.684 5.87864 10.1214C5.31603 9.55883 4.99996 8.79577 4.99996 8.00012C4.99996 7.20447 5.31603 6.44141 5.87864 5.8788C6.44125 5.31619 7.20431 5.00012 7.99996 5.00012C8.79561 5.00012 9.55867 5.31619 10.1213 5.8788C10.6839 6.44141 11 7.20447 11 8.00012Z"
                                            fill="white"
                                            fillOpacity="0.5"
                                          />
                                        </svg>
                                        <span>View event</span>
                                      </div>
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setSelectedEvent(event);
                                        setDraftDialogOpen(true);
                                      }}
                                    >
                                      <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                        >
                                          <path
                                            d="M3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V4C2 4.26522 2.10536 4.51957 2.29289 4.70711C2.48043 4.89464 2.73478 5 3 5H13C13.2652 5 13.5196 4.89464 13.7071 4.70711C13.8946 4.51957 14 4.26522 14 4V3C14 2.73478 13.8946 2.48043 13.7071 2.29289C13.5196 2.10536 13.2652 2 13 2H3Z"
                                            fill="white"
                                            fillOpacity="0.5"
                                          />
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M3 6H13V12C13 12.5304 12.7893 13.0391 12.4142 13.4142C12.0391 13.7893 11.5304 14 11 14H5C4.46957 14 3.96086 13.7893 3.58579 13.4142C3.21071 13.0391 3 12.5304 3 12V6ZM6 8.75C6 8.55109 6.07902 8.36032 6.21967 8.21967C6.36032 8.07902 6.55109 8 6.75 8H9.25C9.44891 8 9.63968 8.07902 9.78033 8.21967C9.92098 8.36032 10 8.55109 10 8.75C10 8.94891 9.92098 9.13968 9.78033 9.28033C9.63968 9.42098 9.44891 9.5 9.25 9.5H6.75C6.55109 9.5 6.36032 9.42098 6.21967 9.28033C6.07902 9.13968 6 8.94891 6 8.75Z"
                                            fill="white"
                                            fillOpacity="0.5"
                                          />
                                        </svg>
                                        <span>Make it draft</span>
                                      </div>
                                    </MenuItem>
                                    <MenuSeparator />
                                    <MenuItem
                                      onClick={() => {
                                        setSelectedEvent(event);
                                        setDeactivateDialogOpen(true);
                                      }}
                                    >
                                      <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="text-yellow-500"
                                        >
                                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                          <line
                                            x1="12"
                                            y1="9"
                                            x2="12"
                                            y2="13"
                                          />
                                          <line
                                            x1="12"
                                            y1="17"
                                            x2="12.01"
                                            y2="17"
                                          />
                                        </svg>
                                        <span className="text-yellow-500">
                                          Deactivate event
                                        </span>
                                      </div>
                                    </MenuItem>
                                  </DirectionAwareMenu>
                                </td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-4 text-white/50 tracking-wider"
                          >
                            No events found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="past"
              activeTab={activeTab}
              className="grid gap-6"
            >
              <div className="border rounded-xl border-white/10 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:min-w-[180px] last:[&>th]:min-w-fit">
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10218 14 1.5V2.5C14 2.776 13.773 2.994 13.505 3.062C13.0743 3.1718 12.6925 3.42192 12.4198 3.77286C12.1472 4.1238 11.9991 4.55557 11.9991 5C11.9991 5.44443 12.1472 5.8762 12.4198 6.22714C12.6925 6.57808 13.0743 6.8282 13.505 6.938C13.773 7.006 14 7.224 14 7.5V8.5C14 8.89782 13.842 9.27936 13.5607 9.56066C13.2794 9.84196 12.8978 10 12.5 10H1.5C1.10218 10 0.720644 9.84196 0.43934 9.56066C0.158035 9.27936 0 8.89782 0 8.5V7.5C0 7.224 0.227 7.006 0.495 6.938C0.925654 6.8282 1.30747 6.57808 1.58016 6.22714C1.85285 5.8762 2.00088 5.44443 2.00088 5C2.00088 4.55557 1.85285 4.1238 1.58016 3.77286C1.30747 3.42192 0.925654 3.1718 0.495 3.062C0.227 2.994 0 2.776 0 2.5V1.5ZM9 2.75C9 2.55109 9.07902 2.36032 9.21967 2.21967C9.36032 2.07902 9.55109 2 9.75 2C9.94891 2 10.1397 2.07902 10.2803 2.21967C10.421 2.36032 10.5 2.55109 10.5 2.75V3.75C10.5 3.94891 10.421 4.13968 10.2803 4.28033C10.1397 4.42098 9.94891 4.5 9.75 4.5C9.55109 4.5 9.36032 4.42098 9.21967 4.28033C9.07902 4.13968 9 3.94891 9 3.75V2.75ZM9.75 5.5C9.55109 5.5 9.36032 5.57902 9.21967 5.71967C9.07902 5.86032 9 6.05109 9 6.25V7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25V6.25C10.5 6.05109 10.421 5.86032 10.2803 5.71967C10.1397 5.57902 9.94891 5.5 9.75 5.5Z"
                                fill="white"
                                fill-opacity="0.5"
                              />
                            </svg>{" "}
                            Event
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4 1.75C4 1.55109 4.07902 1.36032 4.21967 1.21967C4.36032 1.07902 4.55109 1 4.75 1C4.94891 1 5.13968 1.07902 5.28033 1.21967C5.42098 1.36032 5.5 1.55109 5.5 1.75V3H10.5V1.75C10.5 1.55109 10.579 1.36032 10.7197 1.21967C10.8603 1.07902 11.0511 1 11.25 1C11.4489 1 11.6397 1.07902 11.7803 1.21967C11.921 1.36032 12 1.55109 12 1.75V3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14H4C3.46957 14 2.96086 13.7893 2.58579 13.4142C2.21071 13.0391 2 12.5304 2 12V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3V1.75ZM4.5 6C4.23478 6 3.98043 6.10536 3.79289 6.29289C3.60536 6.48043 3.5 6.73478 3.5 7V11.5C3.5 11.7652 3.60536 12.0196 3.79289 12.2071C3.98043 12.3946 4.23478 12.5 4.5 12.5H11.5C11.7652 12.5 12.0196 12.3946 12.2071 12.2071C12.3946 12.0196 12.5 11.7652 12.5 11.5V7C12.5 6.73478 12.3946 6.48043 12.2071 6.29289C12.0196 6.10536 11.7652 6 11.5 6H4.5Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            Event Date
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="11"
                              height="13"
                              viewBox="0 0 11 13"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.289 12.841L5.292 12.844L5.294 12.846C5.42522 12.9454 5.58535 12.9993 5.75 12.9993C5.91465 12.9993 6.07478 12.9454 6.206 12.846L6.208 12.844L6.211 12.841L6.223 12.832C6.28744 12.7824 6.35079 12.7314 6.413 12.679C7.15862 12.0505 7.84362 11.3535 8.459 10.597C9.56 9.235 10.75 7.255 10.75 5C10.75 3.67392 10.2232 2.40215 9.28553 1.46447C8.34785 0.526784 7.07608 0 5.75 0C4.42392 0 3.15215 0.526784 2.21447 1.46447C1.27678 2.40215 0.75 3.67392 0.75 5C0.75 7.255 1.94 9.235 3.042 10.597C3.65739 11.3535 4.34239 12.0505 5.088 12.679C5.1503 12.7309 5.21331 12.7819 5.277 12.832L5.289 12.842V12.841ZM5.75 6.5C5.94698 6.5 6.14204 6.4612 6.32403 6.38582C6.50601 6.31044 6.67137 6.19995 6.81066 6.06066C6.94995 5.92137 7.06044 5.75601 7.13582 5.57403C7.2112 5.39204 7.25 5.19698 7.25 5C7.25 4.80302 7.2112 4.60796 7.13582 4.42597C7.06044 4.24399 6.94995 4.07863 6.81066 3.93934C6.67137 3.80005 6.50601 3.68956 6.32403 3.61418C6.14204 3.5388 5.94698 3.5 5.75 3.5C5.35218 3.5 4.97064 3.65804 4.68934 3.93934C4.40804 4.22064 4.25 4.60218 4.25 5C4.25 5.39782 4.40804 5.77936 4.68934 6.06066C4.97064 6.34196 5.35218 6.5 5.75 6.5Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            Location
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="16"
                              viewBox="0 0 17 16"
                              fill="none"
                            >
                              <path
                                d="M6.875 5.5H7.75V7.25H6.875C6.76009 7.25 6.64631 7.22737 6.54015 7.18339C6.43399 7.13942 6.33753 7.07497 6.25628 6.99372C6.17503 6.91247 6.11058 6.81601 6.06661 6.70985C6.02263 6.60369 6 6.48991 6 6.375C6 6.26009 6.02263 6.14631 6.06661 6.04015C6.11058 5.93399 6.17503 5.83753 6.25628 5.75628C6.33753 5.67503 6.43399 5.61058 6.54015 5.56661C6.64631 5.52263 6.76009 5.5 6.875 5.5ZM9.25 10.5V8.75H10.125C10.3571 8.75 10.5796 8.84219 10.7437 9.00628C10.9078 9.17038 11 9.39294 11 9.625C11 9.85706 10.9078 10.0796 10.7437 10.2437C10.5796 10.4078 10.3571 10.5 10.125 10.5H9.25Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.5 8C15.5 9.85652 14.7625 11.637 13.4497 12.9497C12.137 14.2625 10.3565 15 8.5 15C6.64348 15 4.86301 14.2625 3.55025 12.9497C2.2375 11.637 1.5 9.85652 1.5 8C1.5 6.14348 2.2375 4.36301 3.55025 3.05025C4.86301 1.7375 6.64348 1 8.5 1C10.3565 1 12.137 1.7375 13.4497 3.05025C14.7625 4.36301 15.5 6.14348 15.5 8ZM7.75 3.75C7.75 3.55109 7.82902 3.36032 7.96967 3.21967C8.11032 3.07902 8.30109 3 8.5 3C8.69891 3 8.88968 3.07902 9.03033 3.21967C9.17098 3.36032 9.25 3.55109 9.25 3.75V4H11.75C11.9489 4 12.1397 4.07902 12.2803 4.21967C12.421 4.36032 12.5 4.55109 12.5 4.75C12.5 4.94891 12.421 5.13968 12.2803 5.28033C12.1397 5.42098 11.9489 5.5 11.75 5.5H9.25V7.25H10.125C10.7549 7.25 11.359 7.50022 11.8044 7.94562C12.2498 8.39102 12.5 8.99511 12.5 9.625C12.5 10.2549 12.2498 10.859 11.8044 11.3044C11.359 11.7498 10.7549 12 10.125 12H9.25V12.25C9.25 12.4489 9.17098 12.6397 9.03033 12.7803C8.88968 12.921 8.69891 13 8.5 13C8.30109 13 8.11032 12.921 7.96967 12.7803C7.82902 12.6397 7.75 12.4489 7.75 12.25V12H5.25C5.05109 12 4.86032 11.921 4.71967 11.7803C4.57902 11.6397 4.5 11.4489 4.5 11.25C4.5 11.0511 4.57902 10.8603 4.71967 10.7197C4.86032 10.579 5.05109 10.5 5.25 10.5H7.75V8.75H6.875C6.24511 8.75 5.64102 8.49978 5.19562 8.05438C4.75022 7.60898 4.5 7.00489 4.5 6.375C4.5 5.74511 4.75022 5.14102 5.19562 4.69562C5.64102 4.25022 6.24511 4 6.875 4H7.75V3.75Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            Revenue
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="16"
                              viewBox="0 0 17 16"
                              fill="none"
                            >
                              <path
                                d="M8.622 1.349C8.5087 1.28428 8.38048 1.25024 8.25 1.25024C8.11952 1.25024 7.9913 1.28428 7.878 1.349L3.068 4.097L8.25 7.131L13.432 4.097L8.622 1.349ZM14.25 5.357L9 8.43V14.435L13.872 11.651C13.9868 11.5854 14.0822 11.4907 14.1486 11.3764C14.215 11.262 14.25 11.1322 14.25 11V5.357ZM7.5 14.435V8.43L2.25 5.357V11C2.25 11.27 2.394 11.518 2.628 11.651L7.5 14.435Z"
                                fill="white"
                                fillOpacity="0.4"
                              />
                            </svg>
                            Tickets sold
                          </div>
                        </th>
                        <th className="text-left p-4">
                          {" "}
                          <Ellipsis />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterEvents(pastEvents).length > 0 ? (
                        filterEvents(pastEvents)
                          .filter(
                            (event) =>
                              event.explore === "YES" &&
                              event.status === "active"
                          )
                          .map((event) => {
                            const totalTickets =
                              (soldTickets[event._id] || 0) +
                              (remainCount[event._id] || 0);
                            const soldPercentage =
                              totalTickets > 0
                                ? ((soldTickets[event._id] || 0) /
                                  totalTickets) *
                                100
                                : 0;
                            return (
                              <tr
                                key={event.id}
                                className="border-b border-white/5 [&_td]:font-medium hover:bg-white/[2.5%] cursor-pointer transition-colors"
                              >
                                <td className="py-4 px-4 flex items-center gap-x-2">
                                  {event.event_name}

                                  <Link
                                    to={`/organizer/events/${event._id}`}
                                    className="ml-auto h-8 w-8 flex items-center justify-center rounded-md border border-white/5"
                                  >
                                    <ArrowRight className="w-4 h-4 text-white/50" />
                                  </Link>
                                </td>
                                <td className="py-4 pl-4">
                                  {formatDate(event.start_date)}
                                </td>
                                <td className="py-4 pl-4">
                                  {event.venue_name}
                                </td>
                                <td className="py-4 pl-4">
                                  {earnings[event._id] !== undefined
                                    ? earnings[event._id]
                                    : "Loading..."}
                                </td>
                                <td className="py-4 pl-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex gap-0.5">
                                      {[...Array(4)].map((_, i) => {
                                        const barFillPercentage = Math.min(
                                          Math.max(soldPercentage - i * 25, 0),
                                          25
                                        );

                                        let barColor;
                                        if (soldPercentage <= 25) {
                                          barColor = "#10B981";
                                        } else if (soldPercentage <= 50) {
                                          barColor = "#A3E635";
                                        } else {
                                          barColor = "#F97316";
                                        }

                                        return (
                                          <div
                                            key={i}
                                            className="h-4 w-1.5 rounded-full bg-white/10 overflow-hidden"
                                          >
                                            <div
                                              className="h-full transition-all duration-300 ease-out"
                                              style={{
                                                transform: `scaleY(${barFillPercentage / 25
                                                  })`,
                                                transformOrigin: "bottom",
                                                backgroundColor: barColor,
                                              }}
                                            />
                                          </div>
                                        );
                                      })}
                                    </div>
                                    {soldTickets[event._id] || 0}/
                                    {totalTickets || 100}
                                  </div>
                                </td>
                                <td className="py-4 pl-4">
                                  <DirectionAwareMenu>
                                    <MenuTrigger>
                                      <Ellipsis />
                                    </MenuTrigger>
                                    <MenuItem
                                      onClick={() => handleViewEvent(event._id)}
                                    >
                                      <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                        >
                                          <path
                                            d="M8 9.5C8.39782 9.5 8.77936 9.34196 9.06066 9.06066C9.34196 8.77936 9.5 8.39782 9.5 8C9.5 7.60218 9.34196 7.22064 9.06066 6.93934C8.77936 6.65804 8.39782 6.5 8 6.5C7.60218 6.5 7.22064 6.65804 6.93934 6.93934C6.65804 7.22064 6.5 7.60218 6.5 8C6.5 8.39782 6.65804 8.77936 6.93934 9.06066C7.22064 9.34196 7.60218 9.5 8 9.5Z"
                                            fill="white"
                                            fillOpacity="0.5"
                                          />
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M1.37996 8.28012C1.31687 8.09672 1.31687 7.89751 1.37996 7.71412C1.85633 6.33749 2.75014 5.14368 3.93692 4.29893C5.1237 3.45419 6.54437 3.00056 8.00109 3.00122C9.45782 3.00188 10.8781 3.4568 12.0641 4.30262C13.2501 5.14844 14.1428 6.34306 14.618 7.72012C14.681 7.90351 14.681 8.10273 14.618 8.28612C14.1418 9.6631 13.248 10.8573 12.0611 11.7023C10.8742 12.5473 9.4533 13.0011 7.99632 13.0005C6.53934 12.9998 5.11883 12.5447 3.9327 11.6986C2.74657 10.8525 1.85387 9.65753 1.37896 8.28012H1.37996ZM11 8.00012C11 8.79577 10.6839 9.55883 10.1213 10.1214C9.55867 10.684 8.79561 11.0001 7.99996 11.0001C7.20431 11.0001 6.44125 10.684 5.87864 10.1214C5.31603 9.55883 4.99996 8.79577 4.99996 8.00012C4.99996 7.20447 5.31603 6.44141 5.87864 5.8788C6.44125 5.31619 7.20431 5.00012 7.99996 5.00012C8.79561 5.00012 9.55867 5.31619 10.1213 5.8788C10.6839 6.44141 11 7.20447 11 8.00012Z"
                                            fill="white"
                                            fillOpacity="0.5"
                                          />
                                        </svg>
                                        <span>View event</span>
                                      </div>
                                    </MenuItem>
                                  </DirectionAwareMenu>
                                </td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-4 text-white/50 tracking-wider"
                          >
                            No past found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="drafts"
              activeTab={activeTab}
              className="grid gap-6"
            >
              {/* relative overflow-hidden before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-0.2rem)] before:h-[calc(100%-0.2rem)] before:border before:border-[#34B2DA]/20 before:rounded-lg */}
              <div className="flex items-center bg-[#34B2DA1A] rounded-lg p-4 ">
                <div className="flex items-start justify-center gap-x-2">
                  <div className="flex items-start lg:items-center gap-x-2 text-[#34B2DA] font-semibold text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0 mt-1 lg:mt-0"
                    >
                      <path
                        d="M3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V4C2 4.26522 2.10536 4.51957 2.29289 4.70711C2.48043 4.89464 2.73478 5 3 5H13C13.2652 5 13.5196 4.89464 13.7071 4.70711C13.8946 4.51957 14 4.26522 14 4V3C14 2.73478 13.8946 2.48043 13.7071 2.29289C13.5196 2.10536 13.2652 2 13 2H3Z"
                        fill="#34B2DA"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 6H13V12C13 12.5304 12.7893 13.0391 12.4142 13.4142C12.0391 13.7893 11.5304 14 11 14H5C4.46957 14 3.96086 13.7893 3.58579 13.4142C3.21071 13.0391 3 12.5304 3 12V6ZM6 8.75C6 8.55109 6.07902 8.36032 6.21967 8.21967C6.36032 8.07902 6.55109 8 6.75 8H9.25C9.44891 8 9.63968 8.07902 9.78033 8.21967C9.92098 8.36032 10 8.55109 10 8.75C10 8.94891 9.92098 9.13968 9.78033 9.28033C9.63968 9.42098 9.44891 9.5 9.25 9.5H6.75C6.55109 9.5 6.36032 9.42098 6.21967 9.28033C6.07902 9.13968 6 8.94891 6 8.75Z"
                        fill="#34B2DA"
                      />
                    </svg>
                    Drafts are your safe space. Events here won&apos;t be shown
                    to the public until you publish them
                  </div>
                </div>
              </div>
              <div className="border rounded-xl border-white/10 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:min-w-[180px] last:[&>th]:min-w-fit">
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10218 14 1.5V2.5C14 2.776 13.773 2.994 13.505 3.062C13.0743 3.1718 12.6925 3.42192 12.4198 3.77286C12.1472 4.1238 11.9991 4.55557 11.9991 5C11.9991 5.44443 12.1472 5.8762 12.4198 6.22714C12.6925 6.57808 13.0743 6.8282 13.505 6.938C13.773 7.006 14 7.224 14 7.5V8.5C14 8.89782 13.842 9.27936 13.5607 9.56066C13.2794 9.84196 12.8978 10 12.5 10H1.5C1.10218 10 0.720644 9.84196 0.43934 9.56066C0.158035 9.27936 0 8.89782 0 8.5V7.5C0 7.224 0.227 7.006 0.495 6.938C0.925654 6.8282 1.30747 6.57808 1.58016 6.22714C1.85285 5.8762 2.00088 5.44443 2.00088 5C2.00088 4.55557 1.85285 4.1238 1.58016 3.77286C1.30747 3.42192 0.925654 3.1718 0.495 3.062C0.227 2.994 0 2.776 0 2.5V1.5ZM9 2.75C9 2.55109 9.07902 2.36032 9.21967 2.21967C9.36032 2.07902 9.55109 2 9.75 2C9.94891 2 10.1397 2.07902 10.2803 2.21967C10.421 2.36032 10.5 2.55109 10.5 2.75V3.75C10.5 3.94891 10.421 4.13968 10.2803 4.28033C10.1397 4.42098 9.94891 4.5 9.75 4.5C9.55109 4.5 9.36032 4.42098 9.21967 4.28033C9.07902 4.13968 9 3.94891 9 3.75V2.75ZM9.75 5.5C9.55109 5.5 9.36032 5.57902 9.21967 5.71967C9.07902 5.86032 9 6.05109 9 6.25V7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25V6.25C10.5 6.05109 10.421 5.86032 10.2803 5.71967C10.1397 5.57902 9.94891 5.5 9.75 5.5Z"
                                fill="white"
                                fill-opacity="0.5"
                              />
                            </svg>{" "}
                            Event
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4 1.75C4 1.55109 4.07902 1.36032 4.21967 1.21967C4.36032 1.07902 4.55109 1 4.75 1C4.94891 1 5.13968 1.07902 5.28033 1.21967C5.42098 1.36032 5.5 1.55109 5.5 1.75V3H10.5V1.75C10.5 1.55109 10.579 1.36032 10.7197 1.21967C10.8603 1.07902 11.0511 1 11.25 1C11.4489 1 11.6397 1.07902 11.7803 1.21967C11.921 1.36032 12 1.55109 12 1.75V3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14H4C3.46957 14 2.96086 13.7893 2.58579 13.4142C2.21071 13.0391 2 12.5304 2 12V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3V1.75ZM4.5 6C4.23478 6 3.98043 6.10536 3.79289 6.29289C3.60536 6.48043 3.5 6.73478 3.5 7V11.5C3.5 11.7652 3.60536 12.0196 3.79289 12.2071C3.98043 12.3946 4.23478 12.5 4.5 12.5H11.5C11.7652 12.5 12.0196 12.3946 12.2071 12.2071C12.3946 12.0196 12.5 11.7652 12.5 11.5V7C12.5 6.73478 12.3946 6.48043 12.2071 6.29289C12.0196 6.10536 11.7652 6 11.5 6H4.5Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            Event Date
                          </div>
                        </th>{" "}
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.4882 2.51263C13.3257 2.3501 13.1327 2.22118 12.9204 2.13323C12.7081 2.04527 12.4805 2 12.2507 2C12.0208 2 11.7933 2.04527 11.5809 2.13323C11.3686 2.22118 11.1757 2.3501 11.0132 2.51263L6.75017 6.77363C6.49487 7.02895 6.29235 7.33205 6.15417 7.66563L5.30617 9.71263C5.24937 9.84968 5.23449 10.0005 5.26342 10.146C5.29235 10.2915 5.36379 10.4252 5.46869 10.5301C5.5736 10.635 5.70726 10.7064 5.85278 10.7354C5.99829 10.7643 6.14911 10.7494 6.28617 10.6926L8.33317 9.84463C8.66675 9.70644 8.96985 9.50392 9.22517 9.24863L13.4862 4.98663C13.8141 4.65847 13.9983 4.21354 13.9983 3.74963C13.9983 3.28571 13.8141 2.84078 13.4862 2.51263H13.4882Z"
                                fill="white"
                                fill-opacity="0.5"
                              />
                              <path
                                d="M4.75 3.5C4.06 3.5 3.5 4.06 3.5 4.75V11.25C3.5 11.94 4.06 12.5 4.75 12.5H11.25C11.94 12.5 12.5 11.94 12.5 11.25V9C12.5 8.80109 12.579 8.61032 12.7197 8.46967C12.8603 8.32902 13.0511 8.25 13.25 8.25C13.4489 8.25 13.6397 8.32902 13.7803 8.46967C13.921 8.61032 14 8.80109 14 9V11.25C14 11.9793 13.7103 12.6788 13.1945 13.1945C12.6788 13.7103 11.9793 14 11.25 14H4.75C4.02065 14 3.32118 13.7103 2.80546 13.1945C2.28973 12.6788 2 11.9793 2 11.25V4.75C2 4.02065 2.28973 3.32118 2.80546 2.80546C3.32118 2.28973 4.02065 2 4.75 2H7C7.19891 2 7.38968 2.07902 7.53033 2.21967C7.67098 2.36032 7.75 2.55109 7.75 2.75C7.75 2.94891 7.67098 3.13968 7.53033 3.28033C7.38968 3.42098 7.19891 3.5 7 3.5H4.75Z"
                                fill="white"
                                fill-opacity="0.5"
                              />
                            </svg>
                            Edited
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="11"
                              height="13"
                              viewBox="0 0 11 13"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.289 12.841L5.292 12.844L5.294 12.846C5.42522 12.9454 5.58535 12.9993 5.75 12.9993C5.91465 12.9993 6.07478 12.9454 6.206 12.846L6.208 12.844L6.211 12.841L6.223 12.832C6.28744 12.7824 6.35079 12.7314 6.413 12.679C7.15862 12.0505 7.84362 11.3535 8.459 10.597C9.56 9.235 10.75 7.255 10.75 5C10.75 3.67392 10.2232 2.40215 9.28553 1.46447C8.34785 0.526784 7.07608 0 5.75 0C4.42392 0 3.15215 0.526784 2.21447 1.46447C1.27678 2.40215 0.75 3.67392 0.75 5C0.75 7.255 1.94 9.235 3.042 10.597C3.65739 11.3535 4.34239 12.0505 5.088 12.679C5.1503 12.7309 5.21331 12.7819 5.277 12.832L5.289 12.842V12.841ZM5.75 6.5C5.94698 6.5 6.14204 6.4612 6.32403 6.38582C6.50601 6.31044 6.67137 6.19995 6.81066 6.06066C6.94995 5.92137 7.06044 5.75601 7.13582 5.57403C7.2112 5.39204 7.25 5.19698 7.25 5C7.25 4.80302 7.2112 4.60796 7.13582 4.42597C7.06044 4.24399 6.94995 4.07863 6.81066 3.93934C6.67137 3.80005 6.50601 3.68956 6.32403 3.61418C6.14204 3.5388 5.94698 3.5 5.75 3.5C5.35218 3.5 4.97064 3.65804 4.68934 3.93934C4.40804 4.22064 4.25 4.60218 4.25 5C4.25 5.39782 4.40804 5.77936 4.68934 6.06066C4.97064 6.34196 5.35218 6.5 5.75 6.5Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            Location
                          </div>
                        </th>
                        {/* <th className="text-left p-4">
                                                        Publish
                                                    </th> */}
                        <th className="text-left p-4">
                          {" "}
                          <Ellipsis />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterEvents(events).length > 0 ? (
                        filterEvents(events)
                          .filter(
                            (event) =>
                              event.explore === "NO" &&
                              event.status === "active"
                          )
                          .map((event) => (
                            <tr
                              key={event.id}
                              className="border-b last:border-b-0 border-white/10 [&_td]:font-medium hover:bg-white/[2.5%] cursor-pointer transition-colors"
                            >
                              <td className="py-4 px-4 flex items-center gap-x-2">
                                {event.event_name}

                                <Link
                                  to={`/organizer/events/${event._id}`}
                                  className="ml-auto h-8 w-8 flex items-center justify-center rounded-md border border-white/5"
                                >
                                  <ArrowRight className="w-4 h-4 text-white/50" />
                                </Link>
                              </td>
                              <td className="py-4 pl-4">
                                {formatDate(event.start_date)}
                              </td>
                              <td className="py-4 pl-4">
                                {formatDate(event.updatedAt)}
                              </td>
                              <td className="py-4 pl-4">{event.venue_name}</td>
                              {/* <td className="py-4 pl-4">
                                                                Publish live
                                                            </td> */}
                              <td className="py-4 pl-4">
                                <DirectionAwareMenu>
                                  <MenuTrigger>
                                    <Ellipsis />
                                  </MenuTrigger>
                                  <MenuItem
                                    onClick={() => handleViewEvent(event._id)}
                                  >
                                    <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                      >
                                        <path
                                          d="M8 9.5C8.39782 9.5 8.77936 9.34196 9.06066 9.06066C9.34196 8.77936 9.5 8.39782 9.5 8C9.5 7.60218 9.34196 7.22064 9.06066 6.93934C8.77936 6.65804 8.39782 6.5 8 6.5C7.60218 6.5 7.22064 6.65804 6.93934 6.93934C6.65804 7.22064 6.5 7.60218 6.5 8C6.5 8.39782 6.65804 8.77936 6.93934 9.06066C7.22064 9.34196 7.60218 9.5 8 9.5Z"
                                          fill="white"
                                          fillOpacity="0.5"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M1.37996 8.28012C1.31687 8.09672 1.31687 7.89751 1.37996 7.71412C1.85633 6.33749 2.75014 5.14368 3.93692 4.29893C5.1237 3.45419 6.54437 3.00056 8.00109 3.00122C9.45782 3.00188 10.8781 3.4568 12.0641 4.30262C13.2501 5.14844 14.1428 6.34306 14.618 7.72012C14.681 7.90351 14.681 8.10273 14.618 8.28612C14.1418 9.6631 13.248 10.8573 12.0611 11.7023C10.8742 12.5473 9.4533 13.0011 7.99632 13.0005C6.53934 12.9998 5.11883 12.5447 3.9327 11.6986C2.74657 10.8525 1.85387 9.65753 1.37896 8.28012H1.37996ZM11 8.00012C11 8.79577 10.6839 9.55883 10.1213 10.1214C9.55867 10.684 8.79561 11.0001 7.99996 11.0001C7.20431 11.0001 6.44125 10.684 5.87864 10.1214C5.31603 9.55883 4.99996 8.79577 4.99996 8.00012C4.99996 7.20447 5.31603 6.44141 5.87864 5.8788C6.44125 5.31619 7.20431 5.00012 7.99996 5.00012C8.79561 5.00012 9.55867 5.31619 10.1213 5.8788C10.6839 6.44141 11 7.20447 11 8.00012Z"
                                          fill="white"
                                          fillOpacity="0.5"
                                        />
                                      </svg>
                                      <span>View event</span>
                                    </div>
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      localStorage.setItem('organizer_eventId', event._id);
                                      setPublishDialogOpen(true);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        className="shrink-0"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M3.757 4.5C3.937 4.717 4.133 4.92 4.343 5.108C4.496 4.498 4.697 3.933 4.939 3.43C4.49539 3.7277 4.09725 4.08811 3.757 4.5ZM8 1C7.08053 0.999213 6.16992 1.17974 5.32028 1.53124C4.47065 1.88274 3.69866 2.39833 3.0485 3.0485C2.39833 3.69866 1.88274 4.47065 1.53124 5.32028C1.17974 6.16992 0.999213 7.08053 1 8C1 9.38447 1.41055 10.7379 2.17972 11.889C2.94889 13.0401 4.04214 13.9373 5.32122 14.4672C6.6003 14.997 8.00777 15.1356 9.36563 14.8655C10.7235 14.5954 11.9708 13.9287 12.9497 12.9497C13.9287 11.9708 14.5954 10.7235 14.8655 9.36563C15.1356 8.00777 14.997 6.6003 14.4672 5.32122C13.9373 4.04214 13.0401 2.94889 11.889 2.17972C10.7379 1.41055 9.38447 1 8 1ZM8 2.5C7.524 2.5 6.909 2.886 6.367 3.927C6.074 4.491 5.836 5.194 5.684 5.99C6.40952 6.32701 7.20003 6.50109 8 6.5C8.79997 6.50109 9.59048 6.32701 10.316 5.99C10.164 5.194 9.926 4.491 9.633 3.927C9.09 2.886 8.476 2.5 8 2.5ZM11.657 5.108C11.5154 4.53 11.3157 3.96781 11.061 3.43C11.505 3.728 11.903 4.089 12.243 4.5C12.063 4.717 11.867 4.92 11.657 5.108ZM10.491 7.544C9.6954 7.84655 8.85119 8.00109 8 8C7.14915 8.00097 6.30529 7.84643 5.51 7.544C5.47111 8.41566 5.53894 9.28881 5.712 10.144C6.432 10.375 7.202 10.5 8 10.5C8.798 10.5 9.568 10.375 10.29 10.144C10.4624 9.28872 10.5295 8.41558 10.49 7.544H10.491ZM11.924 9.394C12.0199 8.52728 12.0259 7.65297 11.942 6.785C12.347 6.509 12.722 6.191 13.059 5.838C13.3643 6.55229 13.5143 7.32334 13.499 8.1C13.035 8.60032 12.5051 9.0353 11.924 9.393V9.394Z"
                                          fill="white"
                                          fillOpacity="0.5"
                                        />
                                      </svg>
                                      <span>Publish event</span>
                                    </div>
                                  </MenuItem>
                                  <MenuSeparator />
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setDeactivateDialogOpen(true);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-yellow-500"
                                      >
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line
                                          x1="12"
                                          y1="17"
                                          x2="12.01"
                                          y2="17"
                                        />
                                      </svg>
                                      <span className="text-yellow-500">
                                        Deactivate event
                                      </span>
                                    </div>
                                  </MenuItem>
                                </DirectionAwareMenu>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-4 text-white/50 tracking-wider"
                          >
                            No drafts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="deactivated"
              activeTab={activeTab}
              className="grid gap-6"
            >
              {/* relative overflow-hidden before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-0.2rem)] before:h-[calc(100%-0.2rem)] before:border before:border-[#F97316]/20 before:rounded-lg */}
              <div className="flex items-center bg-[#28180D] rounded-lg p-4">
                <div className="flex items-start justify-center gap-x-2">
                  <div className="flex items-start lg:items-center gap-x-2 text-[#F97316] font-semibold text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0 mt-1 lg:mt-0"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM10.78 10.78C10.6394 10.9205 10.4488 10.9993 10.25 10.9993C10.0512 10.9993 9.86063 10.9205 9.72 10.78L8 9.06L6.28 10.78C6.21134 10.8537 6.12854 10.9128 6.03654 10.9538C5.94454 10.9948 5.84523 11.0168 5.74452 11.0186C5.64382 11.0204 5.54379 11.0018 5.4504 10.9641C5.35701 10.9264 5.27218 10.8703 5.20096 10.799C5.12974 10.7278 5.0736 10.643 5.03588 10.5496C4.99816 10.4562 4.97963 10.3562 4.98141 10.2555C4.98319 10.1548 5.00523 10.0555 5.04622 9.96346C5.08721 9.87146 5.14631 9.78866 5.22 9.72L6.94 8L5.22 6.28C5.08752 6.13783 5.0154 5.94978 5.01883 5.75548C5.02225 5.56118 5.10097 5.37579 5.23838 5.23838C5.37579 5.10097 5.56118 5.02225 5.75548 5.01883C5.94978 5.0154 6.13783 5.08752 6.28 5.22L8 6.94L9.72 5.22C9.78866 5.14631 9.87146 5.08721 9.96346 5.04622C10.0555 5.00523 10.1548 4.98319 10.2555 4.98141C10.3562 4.97963 10.4562 4.99816 10.5496 5.03588C10.643 5.0736 10.7278 5.12974 10.799 5.20096C10.8703 5.27218 10.9264 5.35701 10.9641 5.4504C11.0018 5.54379 11.0204 5.64382 11.0186 5.74452C11.0168 5.84523 10.9948 5.94454 10.9538 6.03654C10.9128 6.12854 10.8537 6.21134 10.78 6.28L9.06 8L10.78 9.72C10.9205 9.86063 10.9993 10.0512 10.9993 10.25C10.9993 10.4488 10.9205 10.6394 10.78 10.78Z"
                        fill="#F97316"
                      />
                    </svg>
                    These events are currently hidden from the public. You can
                    reactivate them at any time
                  </div>
                </div>
              </div>
              <div className="border rounded-xl border-white/10 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:min-w-[180px] last:[&>th]:min-w-fit">
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10218 14 1.5V2.5C14 2.776 13.773 2.994 13.505 3.062C13.0743 3.1718 12.6925 3.42192 12.4198 3.77286C12.1472 4.1238 11.9991 4.55557 11.9991 5C11.9991 5.44443 12.1472 5.8762 12.4198 6.22714C12.6925 6.57808 13.0743 6.8282 13.505 6.938C13.773 7.006 14 7.224 14 7.5V8.5C14 8.89782 13.842 9.27936 13.5607 9.56066C13.2794 9.84196 12.8978 10 12.5 10H1.5C1.10218 10 0.720644 9.84196 0.43934 9.56066C0.158035 9.27936 0 8.89782 0 8.5V7.5C0 7.224 0.227 7.006 0.495 6.938C0.925654 6.8282 1.30747 6.57808 1.58016 6.22714C1.85285 5.8762 2.00088 5.44443 2.00088 5C2.00088 4.55557 1.85285 4.1238 1.58016 3.77286C1.30747 3.42192 0.925654 3.1718 0.495 3.062C0.227 2.994 0 2.776 0 2.5V1.5ZM9 2.75C9 2.55109 9.07902 2.36032 9.21967 2.21967C9.36032 2.07902 9.55109 2 9.75 2C9.94891 2 10.1397 2.07902 10.2803 2.21967C10.421 2.36032 10.5 2.55109 10.5 2.75V3.75C10.5 3.94891 10.421 4.13968 10.2803 4.28033C10.1397 4.42098 9.94891 4.5 9.75 4.5C9.55109 4.5 9.36032 4.42098 9.21967 4.28033C9.07902 4.13968 9 3.94891 9 3.75V2.75ZM9.75 5.5C9.55109 5.5 9.36032 5.57902 9.21967 5.71967C9.07902 5.86032 9 6.05109 9 6.25V7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25V6.25C10.5 6.05109 10.421 5.86032 10.2803 5.71967C10.1397 5.57902 9.94891 5.5 9.75 5.5Z"
                                fill="white"
                                fill-opacity="0.5"
                              />
                            </svg>{" "}
                            Event
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4 1.75C4 1.55109 4.07902 1.36032 4.21967 1.21967C4.36032 1.07902 4.55109 1 4.75 1C4.94891 1 5.13968 1.07902 5.28033 1.21967C5.42098 1.36032 5.5 1.55109 5.5 1.75V3H10.5V1.75C10.5 1.55109 10.579 1.36032 10.7197 1.21967C10.8603 1.07902 11.0511 1 11.25 1C11.4489 1 11.6397 1.07902 11.7803 1.21967C11.921 1.36032 12 1.55109 12 1.75V3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14H4C3.46957 14 2.96086 13.7893 2.58579 13.4142C2.21071 13.0391 2 12.5304 2 12V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3V1.75ZM4.5 6C4.23478 6 3.98043 6.10536 3.79289 6.29289C3.60536 6.48043 3.5 6.73478 3.5 7V11.5C3.5 11.7652 3.60536 12.0196 3.79289 12.2071C3.98043 12.3946 4.23478 12.5 4.5 12.5H11.5C11.7652 12.5 12.0196 12.3946 12.2071 12.2071C12.3946 12.0196 12.5 11.7652 12.5 11.5V7C12.5 6.73478 12.3946 6.48043 12.2071 6.29289C12.0196 6.10536 11.7652 6 11.5 6H4.5Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            Event Date
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="Frame">
                                <path
                                  id="Vector"
                                  d="M13.4882 2.51263C13.3257 2.3501 13.1327 2.22118 12.9204 2.13323C12.7081 2.04527 12.4805 2 12.2507 2C12.0208 2 11.7933 2.04527 11.5809 2.13323C11.3686 2.22118 11.1757 2.3501 11.0132 2.51263L6.75017 6.77363C6.49487 7.02895 6.29235 7.33205 6.15417 7.66563L5.30617 9.71263C5.24937 9.84968 5.23449 10.0005 5.26342 10.146C5.29235 10.2915 5.36379 10.4252 5.46869 10.5301C5.5736 10.635 5.70726 10.7064 5.85278 10.7354C5.99829 10.7643 6.14911 10.7494 6.28617 10.6926L8.33317 9.84463C8.66675 9.70644 8.96985 9.50392 9.22517 9.24863L13.4862 4.98663C13.8141 4.65847 13.9983 4.21354 13.9983 3.74963C13.9983 3.28571 13.8141 2.84078 13.4862 2.51263H13.4882Z"
                                  fill="white"
                                  fill-opacity="0.5"
                                />
                                <path
                                  id="Vector_2"
                                  d="M4.75 3.5C4.06 3.5 3.5 4.06 3.5 4.75V11.25C3.5 11.94 4.06 12.5 4.75 12.5H11.25C11.94 12.5 12.5 11.94 12.5 11.25V9C12.5 8.80109 12.579 8.61032 12.7197 8.46967C12.8603 8.32902 13.0511 8.25 13.25 8.25C13.4489 8.25 13.6397 8.32902 13.7803 8.46967C13.921 8.61032 14 8.80109 14 9V11.25C14 11.9793 13.7103 12.6788 13.1945 13.1945C12.6788 13.7103 11.9793 14 11.25 14H4.75C4.02065 14 3.32118 13.7103 2.80546 13.1945C2.28973 12.6788 2 11.9793 2 11.25V4.75C2 4.02065 2.28973 3.32118 2.80546 2.80546C3.32118 2.28973 4.02065 2 4.75 2H7C7.19891 2 7.38968 2.07902 7.53033 2.21967C7.67098 2.36032 7.75 2.55109 7.75 2.75C7.75 2.94891 7.67098 3.13968 7.53033 3.28033C7.38968 3.42098 7.19891 3.5 7 3.5H4.75Z"
                                  fill="white"
                                  fill-opacity="0.5"
                                />
                              </g>
                            </svg>
                            Edited
                          </div>
                        </th>
                        <th className="text-left p-4">
                          <div className="flex items-center gap-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="11"
                              height="13"
                              viewBox="0 0 11 13"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.289 12.841L5.292 12.844L5.294 12.846C5.42522 12.9454 5.58535 12.9993 5.75 12.9993C5.91465 12.9993 6.07478 12.9454 6.206 12.846L6.208 12.844L6.211 12.841L6.223 12.832C6.28744 12.7824 6.35079 12.7314 6.413 12.679C7.15862 12.0505 7.84362 11.3535 8.459 10.597C9.56 9.235 10.75 7.255 10.75 5C10.75 3.67392 10.2232 2.40215 9.28553 1.46447C8.34785 0.526784 7.07608 0 5.75 0C4.42392 0 3.15215 0.526784 2.21447 1.46447C1.27678 2.40215 0.75 3.67392 0.75 5C0.75 7.255 1.94 9.235 3.042 10.597C3.65739 11.3535 4.34239 12.0505 5.088 12.679C5.1503 12.7309 5.21331 12.7819 5.277 12.832L5.289 12.842V12.841ZM5.75 6.5C5.94698 6.5 6.14204 6.4612 6.32403 6.38582C6.50601 6.31044 6.67137 6.19995 6.81066 6.06066C6.94995 5.92137 7.06044 5.75601 7.13582 5.57403C7.2112 5.39204 7.25 5.19698 7.25 5C7.25 4.80302 7.2112 4.60796 7.13582 4.42597C7.06044 4.24399 6.94995 4.07863 6.81066 3.93934C6.67137 3.80005 6.50601 3.68956 6.32403 3.61418C6.14204 3.5388 5.94698 3.5 5.75 3.5C5.35218 3.5 4.97064 3.65804 4.68934 3.93934C4.40804 4.22064 4.25 4.60218 4.25 5C4.25 5.39782 4.40804 5.77936 4.68934 6.06066C4.97064 6.34196 5.35218 6.5 5.75 6.5Z"
                                fill="white"
                                fillOpacity="0.5"
                              />
                            </svg>
                            Location
                          </div>
                        </th>

                        {/* <th className="text-left p-4">
                                                        <div className="flex items-center gap-x-2">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="17"
                                                                height="16"
                                                                viewBox="0 0 17 16"
                                                                fill="none"
                                                            >
                                                                <path
                                                                    d="M8.622 1.349C8.5087 1.28428 8.38048 1.25024 8.25 1.25024C8.11952 1.25024 7.9913 1.28428 7.878 1.349L3.068 4.097L8.25 7.131L13.432 4.097L8.622 1.349ZM14.25 5.357L9 8.43V14.435L13.872 11.651C13.9868 11.5854 14.0822 11.4907 14.1486 11.3764C14.215 11.262 14.25 11.1322 14.25 11V5.357ZM7.5 14.435V8.43L2.25 5.357V11C2.25 11.27 2.394 11.518 2.628 11.651L7.5 14.435Z"
                                                                    fill="white"
                                                                    fillOpacity="0.4"
                                                                />
                                                            </svg>
                                                            Publish
                                                        </div>
                                                    </th> */}
                        <th className="text-left p-4">
                          {" "}
                          <Ellipsis />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterEvents(events).filter(
                        (event) => event.status === "inactive"
                      ).length > 0 ? (
                        filterEvents(events)
                          .filter((event) => event.status === "inactive")
                          .map((event) => (
                            <tr
                              key={event.id}
                              className="border-b last:border-b-0 border-white/10 [&_td]:font-medium hover:bg-white/[2.5%] cursor-pointer transition-colors"
                            >
                              <td className="py-4 px-4 flex items-center gap-x-2">
                                {event.event_name}

                                <Link
                                  to={`/organizer/events/${event._id}`}
                                  className="ml-auto h-8 w-8 flex items-center justify-center rounded-md border border-white/5"
                                >
                                  <ArrowRight className="w-4 h-4 text-white/50" />
                                </Link>
                              </td>
                              <td className="py-4 pl-4">
                                {formatDate(event.start_date)}
                              </td>
                              <td className="py-4 pl-4">
                                {formatDate(event.updatedAt)}
                              </td>
                              <td className="py-4 pl-4">{event.venue_name}</td>
                              {/* <td className="py-4 pl-4">Republish</td> */}
                              <td className="py-4 pl-4">
                                <DirectionAwareMenu>
                                  <MenuTrigger>
                                    <Ellipsis />
                                  </MenuTrigger>
                                  <MenuItem
                                    onClick={() => handleViewEvent(event._id)}
                                  >
                                    <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                      >
                                        <path
                                          d="M8 9.5C8.39782 9.5 8.77936 9.34196 9.06066 9.06066C9.34196 8.77936 9.5 8.39782 9.5 8C9.5 7.60218 9.34196 7.22064 9.06066 6.93934C8.77936 6.65804 8.39782 6.5 8 6.5C7.60218 6.5 7.22064 6.65804 6.93934 6.93934C6.65804 7.22064 6.5 7.60218 6.5 8C6.5 8.39782 6.65804 8.77936 6.93934 9.06066C7.22064 9.34196 7.60218 9.5 8 9.5Z"
                                          fill="white"
                                          fillOpacity="0.5"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M1.37996 8.28012C1.31687 8.09672 1.31687 7.89751 1.37996 7.71412C1.85633 6.33749 2.75014 5.14368 3.93692 4.29893C5.1237 3.45419 6.54437 3.00056 8.00109 3.00122C9.45782 3.00188 10.8781 3.4568 12.0641 4.30262C13.2501 5.14844 14.1428 6.34306 14.618 7.72012C14.681 7.90351 14.681 8.10273 14.618 8.28612C14.1418 9.6631 13.248 10.8573 12.0611 11.7023C10.8742 12.5473 9.4533 13.0011 7.99632 13.0005C6.53934 12.9998 5.11883 12.5447 3.9327 11.6986C2.74657 10.8525 1.85387 9.65753 1.37896 8.28012H1.37996ZM11 8.00012C11 8.79577 10.6839 9.55883 10.1213 10.1214C9.55867 10.684 8.79561 11.0001 7.99996 11.0001C7.20431 11.0001 6.44125 10.684 5.87864 10.1214C5.31603 9.55883 4.99996 8.79577 4.99996 8.00012C4.99996 7.20447 5.31603 6.44141 5.87864 5.8788C6.44125 5.31619 7.20431 5.00012 7.99996 5.00012C8.79561 5.00012 9.55867 5.31619 10.1213 5.8788C10.6839 6.44141 11 7.20447 11 8.00012Z"
                                          fill="white"
                                          fillOpacity="0.5"
                                        />
                                      </svg>
                                      <span>View event</span>
                                    </div>
                                  </MenuItem>
                                  <MenuSeparator />
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="16"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M8.25 15C10.1065 15 11.887 14.2625 13.1997 12.9497C14.5125 11.637 15.25 9.85652 15.25 8C15.25 6.14348 14.5125 4.36301 13.1997 3.05025C11.887 1.7375 10.1065 1 8.25 1C6.39348 1 4.61301 1.7375 3.30025 3.05025C1.9875 4.36301 1.25 6.14348 1.25 8C1.25 9.85652 1.9875 11.637 3.30025 12.9497C4.61301 14.2625 6.39348 15 8.25 15ZM12.094 6.209C12.2157 6.05146 12.2699 5.85202 12.2446 5.65454C12.2193 5.45706 12.1165 5.27773 11.959 5.156C11.8015 5.03427 11.602 4.9801 11.4045 5.00542C11.2071 5.03073 11.0277 5.13346 10.906 5.291L7.206 10.081L5.557 8.248C5.49174 8.17247 5.41207 8.11073 5.32264 8.06639C5.23322 8.02205 5.13584 7.99601 5.03622 7.98978C4.9366 7.98356 4.83674 7.99729 4.7425 8.03016C4.64825 8.06303 4.56151 8.11438 4.48737 8.1812C4.41322 8.24803 4.35316 8.32898 4.31071 8.41931C4.26825 8.50965 4.24425 8.60755 4.24012 8.70728C4.23599 8.807 4.25181 8.90656 4.28664 9.00009C4.32148 9.09363 4.37464 9.17927 4.443 9.252L6.693 11.752C6.76649 11.8335 6.85697 11.8979 6.95806 11.9406C7.05915 11.9833 7.16838 12.0034 7.27805 11.9993C7.38772 11.9952 7.49515 11.967 7.59277 11.9169C7.69038 11.8667 7.7758 11.7958 7.843 11.709L12.094 6.209Z"
                                          fill="#10B981"
                                        />
                                      </svg>
                                      Activate event
                                    </div>
                                  </MenuItem>
                                </DirectionAwareMenu>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-4 text-white/50 tracking-wider"
                          >
                            No deactivated events found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Activate Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Activate this event?</DialogTitle>
          <DialogDescription>
            Are you sure you want to Activate &quot;{selectedEvent?.event_name}
            &quot;?. If you do it will change the status for original status
            from where you did deactivated
          </DialogDescription>
          <div className="flex flex-col gap-3 mt-3">
            <button
              onClick={async () => {
                if (!selectedEvent?._id) return;

                try {
                  const newStatus =
                    selectedEvent.status === "active" ? "inactive" : "active";

                  const response = await axios.patch(
                    `${url}/event/change-event-status/${selectedEvent._id}`,
                    { status: newStatus }
                  );

                  setDeleteDialogOpen(false);
                  setshowActivateNotification(true);
                  setTimeout(() => {
                    window.location.reload();
                  }, [2500]);
                } catch (error) {
                  console.error("Error updating event status:", error);
                  alert("Failed to change event status. Please try again.");
                }
              }}
              className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white border-white/10 border text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.25 15C10.1065 15 11.887 14.2625 13.1997 12.9497C14.5125 11.637 15.25 9.85652 15.25 8C15.25 6.14348 14.5125 4.36301 13.1997 3.05025C11.887 1.7375 10.1065 1 8.25 1C6.39348 1 4.61301 1.7375 3.30025 3.05025C1.9875 4.36301 1.25 6.14348 1.25 8C1.25 9.85652 1.9875 11.637 3.30025 12.9497C4.61301 14.2625 6.39348 15 8.25 15ZM12.094 6.209C12.2157 6.05146 12.2699 5.85202 12.2446 5.65454C12.2193 5.45706 12.1165 5.27773 11.959 5.156C11.8015 5.03427 11.602 4.9801 11.4045 5.00542C11.2071 5.03073 11.0277 5.13346 10.906 5.291L7.206 10.081L5.557 8.248C5.49174 8.17247 5.41207 8.11073 5.32264 8.06639C5.23322 8.02205 5.13584 7.99601 5.03622 7.98978C4.9366 7.98356 4.83674 7.99729 4.7425 8.03016C4.64825 8.06303 4.56151 8.11438 4.48737 8.1812C4.41322 8.24803 4.35316 8.32898 4.31071 8.41931C4.26825 8.50965 4.24425 8.60755 4.24012 8.70728C4.23599 8.807 4.25181 8.90656 4.28664 9.00009C4.32148 9.09363 4.37464 9.17927 4.443 9.252L6.693 11.752C6.76649 11.8335 6.85697 11.8979 6.95806 11.9406C7.05915 11.9833 7.16838 12.0034 7.27805 11.9993C7.38772 11.9952 7.49515 11.967 7.59277 11.9169C7.69038 11.8667 7.7758 11.7958 7.843 11.709L12.094 6.209Z"
                  fill="#ffffff"
                />
              </svg>
              Activate event
            </button>
            {/* <button
                            onClick={() => setDeleteDialogOpen(false)}
                            className="w-full border border-white/10 hover:bg-white/5 text-white text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
                        >
                            Cancel
                        </button> */}
          </div>
        </DialogContent>
      </Dialog>

      {/* Draft Dialog */}
      <Dialog open={draftDialogOpen} onOpenChange={setDraftDialogOpen}>
        <DialogContent>
          <DialogTitle className="w-80">
            Draft &quot;{selectedEvent?.event_name}&quot;?
          </DialogTitle>
          <DialogDescription>
            This event will be pushed for draft section. You can always publish
            it again using events page.
          </DialogDescription>
          <div className="flex flex-col gap-3 mt-3">
            <button
              onClick={async () => {
                if (!selectedEvent?._id) return;

                try {
                  const newStatus = "NO";

                  const response = await axios.patch(
                    `${url}/event/change-status/${selectedEvent._id}`,
                    { status: newStatus }
                  );

                  setDraftDialogOpen(false);
                  setshowDraftNotification(true);
                  setTimeout(() => {
                    window.location.reload();
                  }, [2500]);
                } catch (error) {
                  console.error("Error updating event status:", error);
                  alert("Failed to change event status. Please try again.");
                }
              }}
              className="w-full bg-gray-500 hover:bg-gray-600/90 text-white border-white/10 border text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
            >
              Make it draft
            </button>
            {/* <button
                            onClick={() => setDeactivateDialogOpen(false)}
                            className="w-full border border-white/10 hover:bg-white/5 text-white text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
                        >
                            Cancel
                        </button> */}
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent>
          <DialogTitle className="w-80">
            {
              !accountId ? (
                <>
                  Complete stripe onboarding
                </>
              ) : (
                <>
                  Publish & quot;{selectedEvent?.event_name}&quot;?
                </>
              )
            }
          </DialogTitle>
          <DialogDescription>
            {
              !accountId ? (
                <>
                  complete your stripe onboarding to make events live and get full access
                </>
              ) : (
                <>
                  This event will be published. Users can see this event and purchase
                  the tickets.
                </>
              )
            }
          </DialogDescription>
          <div className="flex flex-col gap-3 mt-3">
            {
              !accountId ? (
                <>
                  <button
                    onClick={handleOnboard}
                    className="w-full bg-green-500/60 hover:bg-green-600/90 text-white border-white/10 border text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    Complete onboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={async () => {
                      if (!selectedEvent?._id) return;

                      try {
                        const newStatus = "YES";

                        const response = await axios.patch(
                          `${url}/event/change-status/${selectedEvent._id}`,
                          { status: newStatus }
                        );

                        setPublishDialogOpen(false);
                        setshowPublishNotification(true);
                        setTimeout(() => {
                          window.location.reload();
                        }, [2500]);
                      } catch (error) {
                        console.error("Error updating event status:", error);
                        alert("Failed to change event status. Please try again.");
                      }
                    }}
                    className="w-full bg-green-500/60 hover:bg-green-600/90 text-white border-white/10 border text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    Publish
                  </button>
                </>
              )
            }
            {/* <button
                  onClick={() => setDeactivateDialogOpen(false)}
                  className="w-full border border-white/10 hover:bg-white/5 text-white text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
              >
                  Cancel
              </button> */}
          </div>
        </DialogContent>
      </Dialog>

      {/* Deactivate Dialog */}
      <Dialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
      >
        <DialogContent>
          <DialogTitle className="w-80">
            Deactivate &quot;{selectedEvent?.event_name}&quot;?
          </DialogTitle>
          <DialogDescription>
            This event will no longer be visible to other users. You can always
            activate it again using events page.
          </DialogDescription>
          <div className="flex flex-col gap-3 mt-3">
            <button
              onClick={async () => {
                if (!selectedEvent?._id) return;

                try {
                  const newStatus =
                    selectedEvent.status === "active" ? "inactive" : "active";

                  const response = await axios.patch(
                    `${url}/event/change-event-status/${selectedEvent._id}`,
                    { status: newStatus }
                  );

                  setDeactivateDialogOpen(false);
                  setshowActivateNotification(true);
                  setTimeout(() => {
                    window.location.reload();
                  }, [2500]);
                } catch (error) {
                  console.error("Error updating event status:", error);
                  alert("Failed to change event status. Please try again.");
                }
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-600/90 text-white border-white/10 border text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
            >
              Deactivate
            </button>
            {/* <button
                            onClick={() => setDeactivateDialogOpen(false)}
                            className="w-full border border-white/10 hover:bg-white/5 text-white text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
                        >
                            Cancel
                        </button> */}
          </div>
        </DialogContent>
      </Dialog>

      {showDraftNotification && (
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
          className="fixed top-20 sm:top-10 inset-x-0 mx-auto w-fit backdrop-blur-md text-white p-3 pl-4 rounded-lg flex items-center gap-2 border border-white/10 shadow-lg max-w-[400px] justify-between"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM11.844 6.209C11.9657 6.05146 12.0199 5.85202 11.9946 5.65454C11.9693 5.45706 11.8665 5.27773 11.709 5.156C11.5515 5.03427 11.352 4.9801 11.1545 5.00542C10.9571 5.03073 10.7777 5.13346 10.656 5.291L6.956 10.081L5.307 8.248C5.24174 8.17247 5.16207 8.11073 5.07264 8.06639C4.98322 8.02205 4.88584 7.99601 4.78622 7.98978C4.6866 7.98356 4.58674 7.99729 4.4925 8.03016C4.39825 8.06303 4.31151 8.11438 4.23737 8.1812C4.16322 8.24803 4.10316 8.32898 4.06071 8.41931C4.01825 8.50965 3.99425 8.60755 3.99012 8.70728C3.98599 8.807 4.00181 8.90656 4.03664 9.00009C4.07148 9.09363 4.12464 9.17927 4.193 9.252L6.443 11.752C6.51649 11.8335 6.60697 11.8979 6.70806 11.9406C6.80915 11.9833 6.91838 12.0034 7.02805 11.9993C7.13772 11.9952 7.24515 11.967 7.34277 11.9169C7.44038 11.8667 7.5258 11.7958 7.593 11.709L11.844 6.209Z"
                fill="#10B981"
              />
            </svg>
            <p className="text-sm">Event added to draft</p>
          </div>
          <button
            onClick={() => setshowDraftNotification(false)}
            className="ml-2 text-white/60 hover:text-white flex items-center justify-center border border-white/10 rounded-full p-1 flex-shrink-0 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M5.28033 4.21967C4.98744 3.92678 4.51256 3.92678 4.21967 4.21967C3.92678 4.51256 3.92678 4.98744 4.21967 5.28033L6.93934 8L4.21967 10.7197C3.92678 11.0126 3.92678 11.4874 4.21967 11.7803C4.51256 12.0732 4.98744 12.0732 5.28033 11.7803L8 9.06066L10.7197 11.7803C11.0126 12.0732 11.4874 12.0732 11.7803 11.7803C12.0732 11.4874 12.0732 11.0126 11.7803 10.7197L9.06066 8L11.7803 5.28033C12.0732 4.98744 12.0732 4.51256 11.7803 4.21967C11.4874 3.92678 11.0126 3.92678 10.7197 4.21967L8 6.93934L5.28033 4.21967Z"
                fill="white"
              />
            </svg>
          </button>
        </motion.div>
      )}

      {showPublishNotification && (
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
          className="fixed top-20 sm:top-10 inset-x-0 mx-auto w-fit backdrop-blur-md text-white p-3 pl-4 rounded-lg flex items-center gap-2 border border-white/10 shadow-lg max-w-[400px] justify-between"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM11.844 6.209C11.9657 6.05146 12.0199 5.85202 11.9946 5.65454C11.9693 5.45706 11.8665 5.27773 11.709 5.156C11.5515 5.03427 11.352 4.9801 11.1545 5.00542C10.9571 5.03073 10.7777 5.13346 10.656 5.291L6.956 10.081L5.307 8.248C5.24174 8.17247 5.16207 8.11073 5.07264 8.06639C4.98322 8.02205 4.88584 7.99601 4.78622 7.98978C4.6866 7.98356 4.58674 7.99729 4.4925 8.03016C4.39825 8.06303 4.31151 8.11438 4.23737 8.1812C4.16322 8.24803 4.10316 8.32898 4.06071 8.41931C4.01825 8.50965 3.99425 8.60755 3.99012 8.70728C3.98599 8.807 4.00181 8.90656 4.03664 9.00009C4.07148 9.09363 4.12464 9.17927 4.193 9.252L6.443 11.752C6.51649 11.8335 6.60697 11.8979 6.70806 11.9406C6.80915 11.9833 6.91838 12.0034 7.02805 11.9993C7.13772 11.9952 7.24515 11.967 7.34277 11.9169C7.44038 11.8667 7.5258 11.7958 7.593 11.709L11.844 6.209Z"
                fill="#10B981"
              />
            </svg>
            <p className="text-sm">Event published successfully</p>
          </div>
          <button
            onClick={() => setshowPublishNotification(false)}
            className="ml-2 text-white/60 hover:text-white flex items-center justify-center border border-white/10 rounded-full p-1 flex-shrink-0 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M5.28033 4.21967C4.98744 3.92678 4.51256 3.92678 4.21967 4.21967C3.92678 4.51256 3.92678 4.98744 4.21967 5.28033L6.93934 8L4.21967 10.7197C3.92678 11.0126 3.92678 11.4874 4.21967 11.7803C4.51256 12.0732 4.98744 12.0732 5.28033 11.7803L8 9.06066L10.7197 11.7803C11.0126 12.0732 11.4874 12.0732 11.7803 11.7803C12.0732 11.4874 12.0732 11.0126 11.7803 10.7197L9.06066 8L11.7803 5.28033C12.0732 4.98744 12.0732 4.51256 11.7803 4.21967C11.4874 3.92678 11.0126 3.92678 10.7197 4.21967L8 6.93934L5.28033 4.21967Z"
                fill="white"
              />
            </svg>
          </button>
        </motion.div>
      )}

      {showActivateNotification && (
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
          className="fixed top-20 sm:top-10 inset-x-0 mx-auto w-fit backdrop-blur-md text-white p-3 pl-4 rounded-lg flex items-center gap-2 border border-white/10 shadow-lg max-w-[400px] justify-between"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM11.844 6.209C11.9657 6.05146 12.0199 5.85202 11.9946 5.65454C11.9693 5.45706 11.8665 5.27773 11.709 5.156C11.5515 5.03427 11.352 4.9801 11.1545 5.00542C10.9571 5.03073 10.7777 5.13346 10.656 5.291L6.956 10.081L5.307 8.248C5.24174 8.17247 5.16207 8.11073 5.07264 8.06639C4.98322 8.02205 4.88584 7.99601 4.78622 7.98978C4.6866 7.98356 4.58674 7.99729 4.4925 8.03016C4.39825 8.06303 4.31151 8.11438 4.23737 8.1812C4.16322 8.24803 4.10316 8.32898 4.06071 8.41931C4.01825 8.50965 3.99425 8.60755 3.99012 8.70728C3.98599 8.807 4.00181 8.90656 4.03664 9.00009C4.07148 9.09363 4.12464 9.17927 4.193 9.252L6.443 11.752C6.51649 11.8335 6.60697 11.8979 6.70806 11.9406C6.80915 11.9833 6.91838 12.0034 7.02805 11.9993C7.13772 11.9952 7.24515 11.967 7.34277 11.9169C7.44038 11.8667 7.5258 11.7958 7.593 11.709L11.844 6.209Z"
                fill="#10B981"
              />
            </svg>
            <p className="text-sm">Event status changed successfully</p>
          </div>
          <button
            onClick={() => setshowActivateNotification(false)}
            className="ml-2 text-white/60 hover:text-white flex items-center justify-center border border-white/10 rounded-full p-1 flex-shrink-0 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M5.28033 4.21967C4.98744 3.92678 4.51256 3.92678 4.21967 4.21967C3.92678 4.51256 3.92678 4.98744 4.21967 5.28033L6.93934 8L4.21967 10.7197C3.92678 11.0126 3.92678 11.4874 4.21967 11.7803C4.51256 12.0732 4.98744 12.0732 5.28033 11.7803L8 9.06066L10.7197 11.7803C11.0126 12.0732 11.4874 12.0732 11.7803 11.7803C12.0732 11.4874 12.0732 11.0126 11.7803 10.7197L9.06066 8L11.7803 5.28033C12.0732 4.98744 12.0732 4.51256 11.7803 4.21967C11.4874 3.92678 11.0126 3.92678 10.7197 4.21967L8 6.93934L5.28033 4.21967Z"
                fill="white"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </SidebarLayout>
  );
}
