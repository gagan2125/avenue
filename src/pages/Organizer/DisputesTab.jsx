import React, { useState, useMemo, useEffect } from "react";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import SidebarToggle from "../../components/layouts/SidebarToggle";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Ellipsis, X } from "lucide-react";

import { PieChart, Pie, Cell, Label } from "recharts";
import axios from "axios";
import { Spin } from "antd";
import url from "../../constants/url";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "../../components/ui/Dropdown";
const DisputesTab = () => {
  const [analyticsData] = useState({
    revenue: 5450,
    ticketsSold: 36,
    currentlyLive: 24,
    ticketsViews: 24,
    revenueChange: "+8%",
    ticketsSoldChange: "-8%",
    currentlyLiveChange: "+8%",
    ticketsViewsChange: "-8%",
  });

  const [hoveredDay, setHoveredDay] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [oragnizerId, setOragnizerId] = useState(null);
  const [earnings, setEarnings] = useState({});
  const [soldTickets, setSoldTickets] = useState({});
  const [remainCount, setRemainCount] = useState({});
  const [viewsCount, setViewsCount] = useState({});
  const [ticketSalesData, setTicketSalesData] = useState({});
  const [revenueDataByEvent, setRevenueDataByEvent] = useState({});
  const [typeFilter, setTypeFilter] = useState("Needs Response");
  const [timeFilter, setTimeFilter] = useState("All");
  const [ticketFilter, setTicketFilter] = useState("In Review");
  const [WonFilter, setWonFilter] = useState("Won");
  const [LostFilter, setLostFilter] = useState("Lost");
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [orgEventLoader, setOrgEventLoader] = useState(false);
  const [orgEventList, setOrgEventList] = useState([]);
  
  const filteredSalesHistory = orgEventList.filter((sale) => {
    const isRefund = sale?.payout?.refund === "true" || sale?.refund === "true";

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const formattedDate = new Date(sale.date)
        .toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", "")
        .toLowerCase();

      const ticketName = sale?.tickets?.ticket_name || "Complimentary Ticket";
      const typeText = isRefund ? "refund" : "sale";

      const matchesSearch =
        sale?.party?.event_name.toLowerCase().includes(searchLower) ||
        ticketName.toLowerCase().includes(searchLower) ||
        sale?.firstName?.toLowerCase().includes(searchLower) ||
        (sale?.amount / 100).toString().includes(searchLower) ||
        typeText.includes(searchLower) ||
        formattedDate.includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Time filter
    if (timeFilter !== "All time") {
      const saleDate = new Date(
        sale.date
          .replace("Today", new Date().toISOString().split("T")[0])
          .replace(
            "Yesterday",
            new Date(Date.now() - 86400000).toISOString().split("T")[0]
          )
      );
      const now = new Date();

      switch (timeFilter) {
        case "Last 7 days":
          if (now - saleDate > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case "Last 30 days":
          if (now - saleDate > 30 * 24 * 60 * 60 * 1000) return false;
          break;
        case "Last 90 days":
          if (now - saleDate > 90 * 24 * 60 * 60 * 1000) return false;
          break;
      }
    }

    // Type filter
    if (typeFilter !== "Needs Response") {
      const isRefund = sale.refund === "true" || sale.refund === true;
      const saleType = isRefund ? "Refund" : "Sale";

      if (saleType.toLowerCase() !== typeFilter.toLowerCase()) return false;
    }

    // Ticket filter
    if (ticketFilter !== "All events") {
      if (sale?.party?.event_name !== ticketFilter) return false;
    }

    return true;
  });
  const sortedSalesHistory = [...filteredSalesHistory].sort((a, b) => {
    if (!sortColumn) return 0; // No sorting applied

    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    // Handle undefined values (fallback to empty string)
    if (!aValue) aValue = "";
    if (!bValue) bValue = "";

    // Handle date sorting
    if (sortColumn === "date" || sortColumn === "updatedAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    // Handle numeric sorting
    if (sortColumn === "amount") {
      const getNumericValue = (sale) => {
        if (!sale.transaction_id) return -Infinity; // Treat "Comp" as lowest value
        return Math.abs(sale.amount / 100 - 0.89) / 1.09;
      };

      aValue = getNumericValue(a);
      bValue = getNumericValue(b);
    }

    // Handle string sorting (firstName, event_name, etc.)
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  const revenueData = [
    { date: "Mon", Revenue: 2000 },
    { date: "Tue", Revenue: 3000 },
    { date: "Wed", Revenue: 2000 },
    { date: "Thu", Revenue: 4000 },
    { date: "Fri", Revenue: 1800 },
    { date: "Sat", Revenue: 4200 },
    { date: "Sun", Revenue: 5000 },
  ];

  const categoriesData = [
    { name: "Arts & Culture", value: 24, fill: "#b7f542" },
    { name: "Music", value: 8, fill: "#f54242" },
    { name: "Sports", value: 4, fill: "#f59942" },
  ];

  const trafficData = [
    { name: "Direct", value: 3500, fill: "#42bdf5" },
    { name: "Social Media", value: 1200, fill: "#9442f5" },
    { name: "Search", value: 600, fill: "#f54242" },
    { name: "Referrals", value: 258, fill: "#42f5a4" },
  ];

  const funnelData = [
    { stage: "Page views", value: 2489, percentage: 100, color: "#34B2DA" },
    { stage: "Added to cart", value: 1344, percentage: 54, color: "#E74C3C" },
    { stage: "Purchased", value: 36, percentage: 4.2, color: "#9B59B6" },
  ];

  const popularDaysData = [
    { day: "Mon", visitors: 100 },
    { day: "Tue", visitors: 410 },
    { day: "Wed", visitors: 470 },
    { day: "Thu", visitors: 420 },
    { day: "Fri", visitors: 350 },
    { day: "Sat", visitors: 420 },
    { day: "Sun", visitors: 370 },
  ];

  const valueFormatter = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: "compact",
      compactDisplay: "short",
    }).format(number);
  };

  const numberFormatter = (number) => {
    return new Intl.NumberFormat("en-US").format(number).toString();
  };

  const totalSells = useMemo(() => {
    return categoriesData.reduce((sum, item) => sum + item.value, 0);
  }, [categoriesData]);

  const totalVisits = useMemo(() => {
    return trafficData.reduce((sum, item) => sum + item.value, 0);
  }, [trafficData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111] p-2 border border-white/10 rounded">
          <p className="text-white text-sm">{`${
            payload[0].name
          }: ${numberFormatter(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomizedShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    const gap = 0.05;
    const adjustedEndAngle = endAngle - gap;

    const angleRad = Math.PI / 180;
    const path = `
      M ${cx + outerRadius * Math.cos(startAngle * angleRad)} ${
      cy + outerRadius * Math.sin(startAngle * angleRad)
    }
      A ${outerRadius} ${outerRadius} 0 ${
      adjustedEndAngle - startAngle > 180 * angleRad ? 1 : 0
    } 1 
        ${cx + outerRadius * Math.cos(adjustedEndAngle * angleRad)} ${
      cy + outerRadius * Math.sin(adjustedEndAngle * angleRad)
    }
    `;

    return (
      <path
        d={path}
        fill="none"
        stroke={fill}
        strokeWidth={(outerRadius - innerRadius) * 0.65} // Reduced stroke width for thinner appearance
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedUserOrganizerId = localStorage.getItem("organizerId");
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

  useEffect(() => {
    if (oragnizerId) {
      fetchEventsPerformance();
    }
  }, [oragnizerId]);

  const fetchEventsPerformance = async () => {
    if (!oragnizerId) return;

    setEventsLoading(true);
    try {
      const response = await axios.get(
        `${url}/event/get-event-by-organizer-id/${oragnizerId}`
      );

      const events = response.data;
      const filteredEvents = events.filter(
        (event) => event.explore === "YES" && event.status === "active"
      );
      setEventsData(filteredEvents);

      filteredEvents.forEach((event) => {
        fetchEarnings(event._id);
        fetchRemainEvent(event._id);
        fetchViews(event._id);
        fetchTicketSales(event._id);
        fetchRevenue(event._id);
        fetchConversionRate(event._id);
      });
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchEarnings = async (id) => {
    try {
      const response = await axios.get(`${url}/get-event-payment-list/${id}`);
      const paymentsData = response.data?.data || [];
      const filteredPayments = paymentsData.filter(
        (payment) => payment.refund !== true
      );
      const totalEarnings = filteredPayments.reduce((sum, payment) => {
        if (!payment.amount) return sum;
        return sum + Number(payment.amount / 100);
      }, 0);

      const ticketCount = filteredPayments.reduce((sum, payment) => {
        return sum + (payment.qty || 0);
      }, 0);

      setEarnings((prev) => ({ ...prev, [id]: totalEarnings.toFixed(2) }));
      setSoldTickets((prev) => ({ ...prev, [id]: ticketCount }));
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };

  const fetchRemainEvent = async (id) => {
    try {
      const response = await axios.get(`${url}/remain-tickets/${id}`);
      const remainingTickets = response.data?.totalRemainTickets || 0;
      setRemainCount((prev) => ({ ...prev, [id]: remainingTickets }));
    } catch (error) {
      console.error("Error fetching remaining tickets:", error);
    }
  };

  const fetchViews = async (id) => {
    try {
      const response = await axios.get(`${url}/visit/get-visit/${id}`);
      const count = response.data?.data?.count || 0;
      setViewsCount((prev) => ({ ...prev, [id]: count }));
    } catch (error) {
      console.error("Error fetching views:", error);
    }
  };

  const fetchTicketSales = async (id) => {
    try {
      const { data } = await axios.get(`${url}/remain-tickets/${id}`);
      const totalSold = data.reduce(
        (sum, item) => sum + (item.tickets_sold || 0),
        0
      );
      setTicketSalesData((prev) => ({ ...prev, [id]: totalSold }));
    } catch (error) {
      console.error("Error fetching ticket sales:", error);
    }
  };

  const fetchRevenue = async (eventId) => {
    try {
      const { data } = await axios.get(
        `${url}/get-event-payment-list/${eventId}`
      );
      const payments = data?.data || [];
      const validPayments = payments.filter(
        (p) => p.transaction_id && p.refund !== true
      );

      const totalRevenue = validPayments.reduce((sum, payout) => {
        const price = payout.tickets?.price || 0;
        const count = payout.count || payout.qty || 0;
        const tax = payout.tax ? parseFloat(payout.tax) / 100 : 0;

        return sum + price * count + price * count * tax;
      }, 0);

      setRevenueDataByEvent((prev) => ({
        ...prev,
        [eventId]: totalRevenue.toFixed(2),
      }));
    } catch (err) {
      console.error("Error fetching revenue:", err);
    }
  };

  const fetchConversionRate = async (evendId) => {
    try {
      const views = viewsCount[evendId] || 0;
      const sales = ticketSalesData[evendId] || 0;
      const conversionRate = views > 0 ? (sales / views) * 100 : 0;

      console.log(
        `Event ${evendId} conversion rate: ${conversionRate.toFixed(2)}%`
      );

      return conversionRate;
    } catch (err) {
      console.error("Error fetching conversion rate:", err);
    }
  };

  return (
    <SidebarLayout>
      <div className="m-4 mb-2 z-20">
        <SidebarToggle />
      </div>
      <div className="min-h-screen text-white p-6 max-w-7xl mx-auto @container">
        <h1 className="text-2xl md:text-3xl font-bold mb-9">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white text-md mb-1">Open Cases</h3>
              <h5 className="text-white/70 text-xs mb-1">Unresolved disputes</h5>

              {/* <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  ${analyticsData.revenue.toLocaleString()}
                </p>
                <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.revenueChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.revenueChange}
                </span>
              </div> */}
            </div>
            {/* <div className="p-2 rounded-full">
              <svg
                width="37"
                height="36"
                viewBox="0 0 37 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.75"
                  width="36"
                  height="36"
                  rx="18"
                  fill="white"
                  fill-opacity="0.05"
                />
                <path
                  d="M17.125 15.5H18V17.25H17.125C17.0101 17.25 16.8963 17.2274 16.7902 17.1834C16.684 17.1394 16.5875 17.075 16.5063 16.9937C16.425 16.9125 16.3606 16.816 16.3166 16.7098C16.2726 16.6037 16.25 16.4899 16.25 16.375C16.25 16.2601 16.2726 16.1463 16.3166 16.0402C16.3606 15.934 16.425 15.8375 16.5063 15.7563C16.5875 15.675 16.684 15.6106 16.7902 15.5666C16.8963 15.5226 17.0101 15.5 17.125 15.5ZM19.5 20.5V18.75H20.375C20.6071 18.75 20.8296 18.8422 20.9937 19.0063C21.1578 19.1704 21.25 19.3929 21.25 19.625C21.25 19.8571 21.1578 20.0796 20.9937 20.2437C20.8296 20.4078 20.6071 20.5 20.375 20.5H19.5Z"
                  fill="white"
                  fill-opacity="0.5"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M25.75 18C25.75 19.8565 25.0125 21.637 23.6997 22.9497C22.387 24.2625 20.6065 25 18.75 25C16.8935 25 15.113 24.2625 13.8003 22.9497C12.4875 21.637 11.75 19.8565 11.75 18C11.75 16.1435 12.4875 14.363 13.8003 13.0503C15.113 11.7375 16.8935 11 18.75 11C20.6065 11 22.387 11.7375 23.6997 13.0503C25.0125 14.363 25.75 16.1435 25.75 18ZM18 13.75C18 13.5511 18.079 13.3603 18.2197 13.2197C18.3603 13.079 18.5511 13 18.75 13C18.9489 13 19.1397 13.079 19.2803 13.2197C19.421 13.3603 19.5 13.5511 19.5 13.75V14H22C22.1989 14 22.3897 14.079 22.5303 14.2197C22.671 14.3603 22.75 14.5511 22.75 14.75C22.75 14.9489 22.671 15.1397 22.5303 15.2803C22.3897 15.421 22.1989 15.5 22 15.5H19.5V17.25H20.375C21.0049 17.25 21.609 17.5002 22.0544 17.9456C22.4998 18.391 22.75 18.9951 22.75 19.625C22.75 20.2549 22.4998 20.859 22.0544 21.3044C21.609 21.7498 21.0049 22 20.375 22H19.5V22.25C19.5 22.4489 19.421 22.6397 19.2803 22.7803C19.1397 22.921 18.9489 23 18.75 23C18.5511 23 18.3603 22.921 18.2197 22.7803C18.079 22.6397 18 22.4489 18 22.25V22H15.5C15.3011 22 15.1103 21.921 14.9697 21.7803C14.829 21.6397 14.75 21.4489 14.75 21.25C14.75 21.0511 14.829 20.8603 14.9697 20.7197C15.1103 20.579 15.3011 20.5 15.5 20.5H18V18.75H17.125C16.4951 18.75 15.891 18.4998 15.4456 18.0544C15.0002 17.609 14.75 17.0049 14.75 16.375C14.75 15.7451 15.0002 15.141 15.4456 14.6956C15.891 14.2502 16.4951 14 17.125 14H18V13.75Z"
                  fill="white"
                  fill-opacity="0.5"
                />
              </svg>
            </div> */}
          </div>

          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white text-md mb-1">Dispute Percentage</h3>
              <h5 className="text-white/70 text-xs mb-1">Percentage of transactions disputed</h5>

              {/* <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {analyticsData.ticketsSold}
                </p>
                <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.ticketsSoldChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.ticketsSoldChange}
                </span>
              </div> */}
            </div>
            {/* <div className="p-2 rounded-full">
              <svg
                width="37"
                height="36"
                viewBox="0 0 37 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  width="36"
                  height="36"
                  rx="18"
                  fill="white"
                  fill-opacity="0.05"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.5 14.5C11.5 14.1022 11.658 13.7206 11.9393 13.4393C12.2206 13.158 12.6022 13 13 13H24C24.3978 13 24.7794 13.158 25.0607 13.4393C25.342 13.7206 25.5 14.1022 25.5 14.5V15.5C25.5 15.776 25.273 15.994 25.005 16.062C24.5743 16.1718 24.1925 16.4219 23.9198 16.7729C23.6472 17.1238 23.4991 17.5556 23.4991 18C23.4991 18.4444 23.6472 18.8762 23.9198 19.2271C24.1925 19.5781 24.5743 19.8282 25.005 19.938C25.273 20.006 25.5 20.224 25.5 20.5V21.5C25.5 21.8978 25.342 22.2794 25.0607 22.5607C24.7794 22.842 24.3978 23 24 23H13C12.6022 23 12.2206 22.842 11.9393 22.5607C11.658 22.2794 11.5 21.8978 11.5 21.5V20.5C11.5 20.224 11.727 20.006 11.995 19.938C12.4257 19.8282 12.8075 19.5781 13.0802 19.2271C13.3528 18.8762 13.5009 18.4444 13.5009 18C13.5009 17.5556 13.3528 17.1238 13.0802 16.7729C12.8075 16.4219 12.4257 16.1718 11.995 16.062C11.727 15.994 11.5 15.776 11.5 15.5V14.5ZM20.5 15.75C20.5 15.5511 20.579 15.3603 20.7197 15.2197C20.8603 15.079 21.0511 15 21.25 15C21.4489 15 21.6397 15.079 21.7803 15.2197C21.921 15.3603 22 15.5511 22 15.75V16.75C22 16.9489 21.921 17.1397 21.7803 17.2803C21.6397 17.421 21.4489 17.5 21.25 17.5C21.0511 17.5 20.8603 17.421 20.7197 17.2803C20.579 17.1397 20.5 16.9489 20.5 16.75V15.75ZM21.25 18.5C21.0511 18.5 20.8603 18.579 20.7197 18.7197C20.579 18.8603 20.5 19.0511 20.5 19.25V20.25C20.5 20.4489 20.579 20.6397 20.7197 20.7803C20.8603 20.921 21.0511 21 21.25 21C21.4489 21 21.6397 20.921 21.7803 20.7803C21.921 20.6397 22 20.4489 22 20.25V19.25C22 19.0511 21.921 18.8603 21.7803 18.7197C21.6397 18.579 21.4489 18.5 21.25 18.5Z"
                  fill="white"
                  fill-opacity="0.5"
                />
              </svg>
            </div> */}
          </div>

          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white text-md mb-1">Money on hold</h3>
              <h5 className="text-white/70 text-xs mb-1">money hold for dispute resolutions</h5>
              
              {/* <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {analyticsData.currentlyLive}
                </p>
                <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.currentlyLiveChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.currentlyLiveChange}
                </span>
              </div> */}
            </div>
            {/* <div className="p-2 rounded-full">
              <svg
                width="37"
                height="36"
                viewBox="0 0 37 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.25"
                  width="36"
                  height="36"
                  rx="18"
                  fill="white"
                  fill-opacity="0.05"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.25 25C20.1065 25 21.887 24.2625 23.1997 22.9497C24.5125 21.637 25.25 19.8565 25.25 18C25.25 16.1435 24.5125 14.363 23.1997 13.0503C21.887 11.7375 20.1065 11 18.25 11C16.3935 11 14.613 11.7375 13.3003 13.0503C11.9875 14.363 11.25 16.1435 11.25 18C11.25 19.8565 11.9875 21.637 13.3003 22.9497C14.613 24.2625 16.3935 25 18.25 25ZM22.094 16.209C22.2157 16.0515 22.2699 15.852 22.2446 15.6545C22.2193 15.4571 22.1165 15.2777 21.959 15.156C21.8015 15.0343 21.602 14.9801 21.4045 15.0054C21.2071 15.0307 21.0277 15.1335 20.906 15.291L17.206 20.081L15.557 18.248C15.4917 18.1725 15.4121 18.1107 15.3226 18.0664C15.2332 18.022 15.1358 17.996 15.0362 17.9898C14.9366 17.9836 14.8367 17.9973 14.7425 18.0302C14.6483 18.063 14.5615 18.1144 14.4874 18.1812C14.4132 18.248 14.3532 18.329 14.3107 18.4193C14.2683 18.5096 14.2443 18.6075 14.2401 18.7073C14.236 18.807 14.2518 18.9066 14.2866 19.0001C14.3215 19.0936 14.3746 19.1793 14.443 19.252L16.693 21.752C16.7665 21.8335 16.857 21.8979 16.9581 21.9406C17.0591 21.9833 17.1684 22.0034 17.278 21.9993C17.3877 21.9952 17.4952 21.967 17.5928 21.9169C17.6904 21.8667 17.7758 21.7958 17.843 21.709L22.094 16.209Z"
                  fill="white"
                  fill-opacity="0.5"
                />
              </svg>
            </div> */}
          </div>

          {/* <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white/70 text-sm mb-1">Tickets views</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {analyticsData.ticketsViews}
                </p>
                <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.ticketsViewsChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.ticketsViewsChange}
                </span>
              </div>
            </div>
            <div className="p-2 rounded-full">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="36"
                  height="36"
                  rx="18"
                  fill="white"
                  fill-opacity="0.05"
                />
                <path
                  d="M18 19.5C18.3978 19.5 18.7794 19.342 19.0607 19.0607C19.342 18.7794 19.5 18.3978 19.5 18C19.5 17.6022 19.342 17.2206 19.0607 16.9393C18.7794 16.658 18.3978 16.5 18 16.5C17.6022 16.5 17.2206 16.658 16.9393 16.9393C16.658 17.2206 16.5 17.6022 16.5 18C16.5 18.3978 16.658 18.7794 16.9393 19.0607C17.2206 19.342 17.6022 19.5 18 19.5Z"
                  fill="white"
                  fill-opacity="0.5"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.38 18.28C11.3169 18.0966 11.3169 17.8974 11.38 17.714C11.8563 16.3374 12.7501 15.1436 13.9369 14.2988C15.1237 13.4541 16.5444 13.0004 18.0011 13.0011C19.4578 13.0018 20.8781 13.4567 22.0641 14.3025C23.2501 15.1483 24.1428 16.3429 24.618 17.72C24.681 17.9034 24.681 18.1026 24.618 18.286C24.1418 19.663 23.248 20.8572 22.0611 21.7022C20.8742 22.5472 19.4533 23.001 17.9963 23.0003C16.5393 22.9997 15.1188 22.5446 13.9327 21.6985C12.7466 20.8524 11.8539 19.6574 11.379 18.28H11.38ZM21 18C21 18.7956 20.6839 19.5587 20.1213 20.1213C19.5587 20.6839 18.7956 21 18 21C17.2043 21 16.4412 20.6839 15.8786 20.1213C15.316 19.5587 15 18.7956 15 18C15 17.2043 15.316 16.4413 15.8786 15.8787C16.4412 15.3161 17.2043 15 18 15C18.7956 15 19.5587 15.3161 20.1213 15.8787C20.6839 16.4413 21 17.2043 21 18Z"
                  fill="white"
                  fill-opacity="0.5"
                />
              </svg>
            </div>
          </div> */}
        </div>

        <div className="flex flex-col gap-4">
            {/* Filter Buttons */}
            <div className="flex flex-col @4xl:flex-row gap-3 w-full justify-between items-start @4xl:items-center">
              <div className="flex gap-3 items-center">
                {/* All time filter */}
                <Dropdown>
                  <DropdownTrigger>
                    <button className="flex items-center gap-2 text-sm border border-white/10 px-3 py-2 rounded-full">
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
                      {timeFilter}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                    <DropdownItem
                      onClick={() => setTimeFilter("All")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      All
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setTimeFilter("Last 7 days")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      Last 7 days
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setTimeFilter("Last 30 days")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      Last 30 days
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setTimeFilter("Last 90 days")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      Last 90 days
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>

                {/* All types filter */}
                <Dropdown>
                  <DropdownTrigger>
                    <button className="flex items-center gap-2 text-sm border border-white/10 px-3 py-2 rounded-full">
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
                          d="M7.628 1.34876C7.7413 1.28404 7.86952 1.25 8 1.25C8.13048 1.25 8.2587 1.28404 8.372 1.34876L9.619 2.06076C9.70456 2.10961 9.77965 2.17483 9.84 2.25271C9.90035 2.33058 9.94477 2.41958 9.97072 2.51462C9.99668 2.60966 10.0037 2.70888 9.99127 2.80662C9.97887 2.90436 9.94735 2.9987 9.8985 3.08426C9.84965 3.16981 9.78442 3.24491 9.70655 3.30526C9.62868 3.36561 9.53968 3.41003 9.44464 3.43598C9.3496 3.46194 9.25037 3.46892 9.15263 3.45652C9.0549 3.44413 8.96056 3.41261 8.875 3.36376L8 2.86376L7.125 3.36376C7.03944 3.41261 6.9451 3.44413 6.84736 3.45652C6.74963 3.46892 6.6504 3.46194 6.55536 3.43598C6.46032 3.41003 6.37133 3.36561 6.29345 3.30526C6.21558 3.24491 6.15035 3.16981 6.1015 3.08426C6.05265 2.9987 6.02113 2.90436 6.00873 2.80662C5.99634 2.70888 6.00332 2.60966 6.02928 2.51462C6.05523 2.41958 6.09965 2.33058 6.16 2.25271C6.22035 2.17483 6.29544 2.10961 6.381 2.06076L7.628 1.34876ZM4.65 3.91376C4.7486 4.08643 4.7746 4.29118 4.72229 4.48302C4.66997 4.67485 4.54361 4.83806 4.371 4.93676L4.262 4.99976L4.372 5.06276C4.53969 5.16392 4.66116 5.32666 4.71045 5.51619C4.75974 5.70573 4.73294 5.90702 4.63577 6.07706C4.53861 6.24709 4.37879 6.37238 4.19048 6.42614C4.00216 6.4799 3.80029 6.45787 3.628 6.36476L3.498 6.29176C3.48421 6.48455 3.39652 6.66457 3.25323 6.79428C3.10993 6.92399 2.9221 6.99337 2.72889 6.98795C2.53569 6.98253 2.35203 6.90274 2.21623 6.7652C2.08043 6.62767 2.00297 6.44302 2 6.24976V4.99976C2.00004 4.86756 2.03503 4.73772 2.10141 4.6234C2.16779 4.50907 2.26321 4.41433 2.378 4.34876L3.628 3.63476C3.80067 3.53615 4.00543 3.51015 4.19726 3.56247C4.38909 3.61479 4.5513 3.74114 4.65 3.91376ZM11.348 3.91376C11.4465 3.74097 11.6097 3.61441 11.8015 3.5619C11.9934 3.50939 12.1982 3.53524 12.371 3.63376L13.621 4.34876C13.736 4.4142 13.8316 4.50889 13.8982 4.62322C13.9647 4.73756 13.9999 4.86746 14 4.99976V6.24976C14.0009 6.44563 13.9251 6.63407 13.7889 6.77481C13.6527 6.91555 13.4668 6.99741 13.271 7.0029C13.0752 7.00839 12.8851 6.93706 12.7412 6.80417C12.5973 6.67128 12.5111 6.48737 12.501 6.29176L12.372 6.36476C12.1997 6.45787 11.9978 6.4799 11.8095 6.42614C11.6212 6.37238 11.4614 6.24709 11.3642 6.07706C11.2671 5.90702 11.2403 5.70573 11.2896 5.51619C11.3388 5.32666 11.4603 5.16392 11.628 5.06276L11.738 4.99976L11.628 4.93676C11.4552 4.83823 11.3286 4.67509 11.2761 4.48325C11.2236 4.2914 11.2495 4.08655 11.348 3.91376ZM6.102 6.91476C6.2007 6.74214 6.36391 6.61579 6.55574 6.56347C6.74757 6.51115 6.95233 6.53715 7.125 6.63576L8 7.13576L8.875 6.63576C9.04779 6.5371 9.25269 6.51112 9.44464 6.56353C9.63658 6.61595 9.79984 6.74247 9.8985 6.91526C9.99716 7.08805 10.0231 7.29295 9.97072 7.48489C9.91831 7.67684 9.79179 7.8401 9.619 7.93876L8.75 8.43476V9.24976C8.75 9.44867 8.67098 9.63943 8.53033 9.78009C8.38968 9.92074 8.19891 9.99976 8 9.99976C7.80109 9.99976 7.61032 9.92074 7.46967 9.78009C7.32902 9.63943 7.25 9.44867 7.25 9.24976V8.43476L6.381 7.93876C6.29531 7.88997 6.22009 7.82476 6.15963 7.74687C6.09917 7.66898 6.05467 7.57993 6.02866 7.48482C6.00265 7.38971 5.99566 7.2904 6.00807 7.19259C6.02048 7.09477 6.05206 7.00036 6.101 6.91476H6.102ZM2.75 8.99976C2.94891 8.99976 3.13968 9.07878 3.28033 9.21943C3.42098 9.36008 3.5 9.55085 3.5 9.74976V10.5648L4.372 11.0628C4.54479 11.1614 4.67131 11.3247 4.72372 11.5166C4.77614 11.7086 4.75016 11.9135 4.6515 12.0863C4.55284 12.259 4.38958 12.3856 4.19764 12.438C4.00569 12.4904 3.80079 12.4644 3.628 12.3658L2.378 11.6508C2.26321 11.5852 2.16779 11.4904 2.10141 11.3761C2.03503 11.2618 2.00004 11.132 2 10.9998V9.74976C2 9.55085 2.07902 9.36008 2.21967 9.21943C2.36032 9.07878 2.55109 8.99976 2.75 8.99976ZM13.25 8.99976C13.4489 8.99976 13.6397 9.07878 13.7803 9.21943C13.921 9.36008 14 9.55085 14 9.74976V10.9998C14 11.132 13.965 11.2618 13.8986 11.3761C13.8322 11.4904 13.7368 11.5852 13.622 11.6508L12.372 12.3658C12.1992 12.4644 11.9943 12.4904 11.8024 12.438C11.6104 12.3856 11.4472 12.259 11.3485 12.0863C11.2498 11.9135 11.2239 11.7086 11.2763 11.5166C11.3287 11.3247 11.4552 11.1614 11.628 11.0628L12.5 10.5648V9.74976C12.5 9.55085 12.579 9.36008 12.7197 9.21943C12.8603 9.07878 13.0511 8.99976 13.25 8.99976ZM8.749 12.7078L8.875 12.6358C9.04779 12.5371 9.25269 12.5111 9.44464 12.5635C9.63658 12.616 9.79984 12.7425 9.8985 12.9153C9.99716 13.088 10.0231 13.293 9.97072 13.4849C9.91831 13.6768 9.79179 13.8401 9.619 13.9388L8.372 14.6508C8.2587 14.7155 8.13048 14.7495 8 14.7495C7.86952 14.7495 7.7413 14.7155 7.628 14.6508L6.38 13.9398C6.20721 13.8411 6.08069 13.6778 6.02828 13.4859C5.97586 13.294 6.00184 13.089 6.1005 12.9163C6.19916 12.7435 6.36242 12.617 6.55436 12.5645C6.74631 12.5121 6.95121 12.5381 7.124 12.6368L7.25 12.7088C7.25992 12.5168 7.34316 12.336 7.48254 12.2036C7.62192 12.0713 7.80679 11.9975 7.999 11.9975C8.19121 11.9975 8.37608 12.0713 8.51546 12.2036C8.65484 12.336 8.73808 12.5168 8.748 12.7088L8.749 12.7078Z"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </svg>
                      {typeFilter}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                    <DropdownItem
                      onClick={() => setTypeFilter("Needs Response")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      Needs Response
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setTypeFilter("Sale")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      Sale
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setTypeFilter("Refund")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      Refund
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>

                {/* Ticket filter */}
                <Dropdown>
                  <DropdownTrigger>
                    <button className="flex items-center gap-2 text-sm border border-white/10 px-3 py-2 rounded-full">
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
                          d="M1 4.5C1 4.10218 1.15804 3.72064 1.43934 3.43934C1.72064 3.15804 2.10218 3 2.5 3H13.5C13.8978 3 14.2794 3.15804 14.5607 3.43934C14.842 3.72064 15 4.10218 15 4.5V5.5C15 5.776 14.773 5.994 14.505 6.062C14.0743 6.1718 13.6925 6.42192 13.4198 6.77286C13.1472 7.1238 12.9991 7.55557 12.9991 8C12.9991 8.44443 13.1472 8.8762 13.4198 9.22714C13.6925 9.57808 14.0743 9.8282 14.505 9.938C14.773 10.006 15 10.224 15 10.5V11.5C15 11.8978 14.842 12.2794 14.5607 12.5607C14.2794 12.842 13.8978 13 13.5 13H2.5C2.10218 13 1.72064 12.842 1.43934 12.5607C1.15804 12.2794 1 11.8978 1 11.5V10.5C1 10.224 1.227 10.006 1.495 9.938C1.92565 9.8282 2.30747 9.57808 2.58016 9.22714C2.85285 8.8762 3.00088 8.44443 3.00088 8C3.00088 7.55557 2.85285 7.1238 2.58016 6.77286C2.30747 6.42192 1.92565 6.1718 1.495 6.062C1.227 5.994 1 5.776 1 5.5V4.5Z"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </svg>
                      {ticketFilter}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                    <DropdownItem
                      onClick={() => setTicketFilter("All events")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      All events
                    </DropdownItem>
                    {events
                      .filter((event) => event.explore === "YES")
                      .map((ticket, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => setTicketFilter(ticket.event_name)}
                          className="px-4 py-2 hover:bg-white/5 text-white"
                        >
                          {ticket.event_name}
                        </DropdownItem>
                      ))}
                  </DropdownContent>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <button className="flex items-center gap-2 text-sm border border-white/10 px-3 py-2 rounded-full">
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
                          d="M1 4.5C1 4.10218 1.15804 3.72064 1.43934 3.43934C1.72064 3.15804 2.10218 3 2.5 3H13.5C13.8978 3 14.2794 3.15804 14.5607 3.43934C14.842 3.72064 15 4.10218 15 4.5V5.5C15 5.776 14.773 5.994 14.505 6.062C14.0743 6.1718 13.6925 6.42192 13.4198 6.77286C13.1472 7.1238 12.9991 7.55557 12.9991 8C12.9991 8.44443 13.1472 8.8762 13.4198 9.22714C13.6925 9.57808 14.0743 9.8282 14.505 9.938C14.773 10.006 15 10.224 15 10.5V11.5C15 11.8978 14.842 12.2794 14.5607 12.5607C14.2794 12.842 13.8978 13 13.5 13H2.5C2.10218 13 1.72064 12.842 1.43934 12.5607C1.15804 12.2794 1 11.8978 1 11.5V10.5C1 10.224 1.227 10.006 1.495 9.938C1.92565 9.8282 2.30747 9.57808 2.58016 9.22714C2.85285 8.8762 3.00088 8.44443 3.00088 8C3.00088 7.55557 2.85285 7.1238 2.58016 6.77286C2.30747 6.42192 1.92565 6.1718 1.495 6.062C1.227 5.994 1 5.776 1 5.5V4.5Z"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </svg>
                      {WonFilter}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                    <DropdownItem
                      onClick={() => setWonFilter("Won")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      Won
                    </DropdownItem>
                    {events
                      .filter((event) => event.explore === "YES")
                      .map((ticket, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => setWonFilter(ticket.event_name)}
                          className="px-4 py-2 hover:bg-white/5 text-white"
                        >
                          {ticket.event_name}
                        </DropdownItem>
                      ))}
                  </DropdownContent>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <button className="flex items-center gap-2 text-sm border border-white/10 px-3 py-2 rounded-full">
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
                          d="M1 4.5C1 4.10218 1.15804 3.72064 1.43934 3.43934C1.72064 3.15804 2.10218 3 2.5 3H13.5C13.8978 3 14.2794 3.15804 14.5607 3.43934C14.842 3.72064 15 4.10218 15 4.5V5.5C15 5.776 14.773 5.994 14.505 6.062C14.0743 6.1718 13.6925 6.42192 13.4198 6.77286C13.1472 7.1238 12.9991 7.55557 12.9991 8C12.9991 8.44443 13.1472 8.8762 13.4198 9.22714C13.6925 9.57808 14.0743 9.8282 14.505 9.938C14.773 10.006 15 10.224 15 10.5V11.5C15 11.8978 14.842 12.2794 14.5607 12.5607C14.2794 12.842 13.8978 13 13.5 13H2.5C2.10218 13 1.72064 12.842 1.43934 12.5607C1.15804 12.2794 1 11.8978 1 11.5V10.5C1 10.224 1.227 10.006 1.495 9.938C1.92565 9.8282 2.30747 9.57808 2.58016 9.22714C2.85285 8.8762 3.00088 8.44443 3.00088 8C3.00088 7.55557 2.85285 7.1238 2.58016 6.77286C2.30747 6.42192 1.92565 6.1718 1.495 6.062C1.227 5.994 1 5.776 1 5.5V4.5Z"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </svg>
                      {LostFilter}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                    <DropdownItem
                      onClick={() => setLostFilter("Lost")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      Lost
                    </DropdownItem>
                    {events
                      .filter((event) => event.explore === "YES")
                      .map((ticket, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => setLostFilter(ticket.event_name)}
                          className="px-4 py-2 hover:bg-white/5 text-white"
                        >
                          {ticket.event_name}
                        </DropdownItem>
                      ))}
                  </DropdownContent>
                </Dropdown>
              </div>

              <div className="relative w-full @4xl:w-fit flex justify-end h-fit">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/10 @4xl:w-[250px]"
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

            <div className="border rounded-xl h-fit border-white/10 overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/[0.03] [&>th]:min-w-[250px] @4xl:[&>th]:min-w-fit last:[&>th]:min-w-fit">
                      <th className="p-4 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            data-selected={
                              location.pathname === "/organizer/profile"
                                ? "true"
                                : "false"
                            }
                            className={`sidebar-icon fill-white data-[selected=false]:opacity-50 group-hover:opacity-100 data-[selected=true]:opacity-100`}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8ZM10 6C10 6.53043 9.78929 7.03914 9.41421 7.41421C9.03914 7.78929 8.53043 8 8 8C7.46957 8 6.96086 7.78929 6.58579 7.41421C6.21071 7.03914 6 6.53043 6 6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4C8.53043 4 9.03914 4.21071 9.41421 4.58579C9.78929 4.96086 10 5.46957 10 6ZM8 9C6.175 9 4.578 9.977 3.705 11.437C4.21992 12.0814 4.87345 12.6016 5.61703 12.9587C6.3606 13.3159 7.1751 13.5009 8 13.5C8.82473 13.5007 9.63904 13.3157 10.3824 12.9585C11.1258 12.6014 11.7792 12.0813 12.294 11.437C11.8506 10.6937 11.2217 10.0783 10.469 9.65112C9.71628 9.22392 8.8655 8.99956 8 9Z"
                            />
                          </svg>
                          Customer
                        </div>
                      </th>

                      <th className="p-4">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M11.4476 14.0671C11.2063 14.6032 10.9064 15.1283 10.5469 15.5826C13.5301 14.5771 15.7261 11.8605 15.9679 8.59998H14.9059C13.61 8.59998 12.569 9.6344 12.3584 10.9131C12.1642 12.0918 11.8535 13.1651 11.4476 14.0671Z"
                              fill="#ffffff"
                              fillOpacity="50%"
                            />
                            <path
                              d="M9.09847 8.59998C10.4553 8.59998 11.5652 9.73192 11.316 11.0657C10.7747 13.9626 9.48934 15.9999 7.98984 15.9999C6.09247 15.9999 4.53794 12.7379 4.3999 8.59998H9.09847Z"
                              fill="#ffffff"
                              fillOpacity="50%"
                            />
                            <path
                              d="M12.3859 5.25936C12.5844 6.55002 13.6301 7.59924 14.936 7.59924H15.9802C15.8153 4.25014 13.5909 1.44261 10.5469 0.416626C10.9064 0.870919 11.2063 1.39598 11.4476 1.93211C11.8733 2.87812 12.1942 4.01254 12.3859 5.25936Z"
                              fill="#ffffff"
                              fillOpacity="50%"
                            />
                            <path
                              d="M11.3563 5.1582C11.5832 6.48521 10.4781 7.59987 9.13181 7.59987H4.39453C4.48829 3.3675 6.06222 0 7.99003 0C9.52789 0 10.8405 2.14285 11.3563 5.1582Z"
                              fill="#ffffff"
                              fillOpacity="50%"
                            />
                            <path
                              d="M3.39431 7.59924C3.43975 5.43596 3.85245 3.44355 4.53261 1.93211C4.77385 1.39598 5.07376 0.870919 5.43336 0.416626C2.38936 1.44261 0.164915 4.25014 0 7.59924H3.39431Z"
                              fill="#ffffff"
                              fillOpacity="50%"
                            />
                            <path
                              d="M0.012207 8.59998C0.253963 11.8605 2.45003 14.5771 5.43323 15.5826C5.07363 15.1283 4.77372 14.6032 4.53248 14.0671C3.87333 12.6024 3.46538 10.6859 3.39944 8.59998H0.012207Z"
                              fill="#ffffff"
                              fillOpacity="50%"
                            />
                          </svg>
                          Event Name
                        </div>
                      </th>
                      <th className="p-4 ">
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
                              d="M1 4.5C1 4.10218 1.15804 3.72064 1.43934 3.43934C1.72064 3.15804 2.10218 3 2.5 3H13.5C13.8978 3 14.2794 3.15804 14.5607 3.43934C14.842 3.72064 15 4.10218 15 4.5V5.5C15 5.776 14.773 5.994 14.505 6.062C14.0743 6.1718 13.6925 6.42192 13.4198 6.77286C13.1472 7.1238 12.9991 7.55557 12.9991 8C12.9991 8.44443 13.1472 8.8762 13.4198 9.22714C13.6925 9.57808 14.0743 9.8282 14.505 9.938C14.773 10.006 15 10.224 15 10.5V11.5C15 11.8978 14.842 12.2794 14.5607 12.5607C14.2794 12.842 13.8978 13 13.5 13H2.5C2.10218 13 1.72064 12.842 1.43934 12.5607C1.15804 12.2794 1 11.8978 1 11.5V10.5C1 10.224 1.227 10.006 1.495 9.938C1.92565 9.8282 2.30747 9.57808 2.58016 9.22714C2.85285 8.8762 3.00088 8.44443 3.00088 8C3.00088 7.55557 2.85285 7.1238 2.58016 6.77286C2.30747 6.42192 1.92565 6.1718 1.495 6.062C1.227 5.994 1 5.776 1 5.5V4.5ZM10 5.75C10 5.55109 10.079 5.36032 10.2197 5.21967C10.3603 5.07902 10.5511 5 10.75 5C10.9489 5 11.1397 5.07902 11.2803 5.21967C11.421 5.36032 11.5 5.55109 11.5 5.75V6.75C11.5 6.94891 11.421 7.13968 11.2803 7.28033C11.1397 7.42098 10.9489 7.5 10.75 7.5C10.5511 7.5 10.3603 7.42098 10.2197 7.28033C10.079 7.13968 10 6.94891 10 6.75V5.75ZM10.75 8.5C10.5511 8.5 10.3603 8.57902 10.2197 8.71967C10.079 8.86032 10 9.05109 10 9.25V10.25C10 10.4489 10.079 10.6397 10.2197 10.7803C10.3603 10.921 10.5511 11 10.75 11C10.9489 11 11.1397 10.921 11.2803 10.7803C11.421 10.6397 11.5 10.4489 11.5 10.25V9.25C11.5 9.05109 11.421 8.86032 11.2803 8.71967C11.1397 8.57902 10.9489 8.5 10.75 8.5Z"
                              fill="white"
                              fillOpacity="0.5"
                            />
                          </svg>
                          Amount
                        </div>
                      </th>
                      <th className="p-4" onClick={() => handleSort("date")}>
                        <div className="flex items-center gap-2 cursor-pointer">
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
                          Dispute Date
                          <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() =>
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill={
                                sortColumn === "date" && sortOrder === "asc"
                                  ? "white"
                                  : "gray"
                              }
                              className="transition-all duration-200"
                            >
                              <path d="M7 14l5-5 5 5H7z" />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill={
                                sortColumn === "date" && sortOrder === "desc"
                                  ? "white"
                                  : "gray"
                              }
                              className="-mt-1 transition-all duration-200"
                            >
                              <path d="M7 10l5 5 5-5H7z" />
                            </svg>
                          </div>
                        </div>
                      </th>
                      <th className="p-4" onClick={() => handleSort("date")}>
                        <div className="flex items-center gap-2 cursor-pointer">
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
                          Evidence Due Date
                          <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() =>
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill={
                                sortColumn === "date" && sortOrder === "asc"
                                  ? "white"
                                  : "gray"
                              }
                              className="transition-all duration-200"
                            >
                              <path d="M7 14l5-5 5 5H7z" />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill={
                                sortColumn === "date" && sortOrder === "desc"
                                  ? "white"
                                  : "gray"
                              }
                              className="-mt-1 transition-all duration-200"
                            >
                              <path d="M7 10l5 5 5-5H7z" />
                            </svg>
                          </div>
                        </div>
                      </th>
                      <th className="p-4">
                        <div className="flex items-center gap-2">
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
                              d="M8.378 1.34876C8.4913 1.28404 8.61952 1.25 8.75 1.25C8.88048 1.25 9.0087 1.28404 9.122 1.34876L10.369 2.06076C10.4546 2.10961 10.5297 2.17483 10.59 2.25271C10.6504 2.33058 10.6948 2.41958 10.7207 2.51462C10.7467 2.60966 10.7537 2.70888 10.7413 2.80662C10.7289 2.90436 10.6974 2.9987 10.6485 3.08426C10.5996 3.16981 10.5344 3.24491 10.4565 3.30526C10.3787 3.36561 10.2897 3.41003 10.1946 3.43598C10.0996 3.46194 10.0004 3.46892 9.90263 3.45652C9.8049 3.44413 9.71056 3.41261 9.625 3.36376L8.75 2.86376L7.875 3.36376C7.78944 3.41261 7.6951 3.44413 7.59736 3.45652C7.49963 3.46892 7.4004 3.46194 7.30536 3.43598C7.21032 3.41003 7.12133 3.36561 7.04345 3.30526C6.96558 3.24491 6.90035 3.16981 6.8515 3.08426C6.80265 2.9987 6.77113 2.90436 6.75873 2.80662C6.74634 2.70888 6.75332 2.60966 6.77928 2.51462C6.80523 2.41958 6.84965 2.33058 6.91 2.25271C6.97035 2.17483 7.04544 2.10961 7.131 2.06076L8.378 1.34876ZM5.4 3.91376C5.4986 4.08643 5.5246 4.29118 5.47229 4.48302C5.41997 4.67485 5.29361 4.83806 5.121 4.93676L5.012 4.99976L5.122 5.06276C5.28969 5.16392 5.41116 5.32666 5.46045 5.51619C5.50974 5.70573 5.48294 5.90702 5.38577 6.07706C5.28861 6.24709 5.12879 6.37238 4.94048 6.42614C4.75216 6.4799 4.55029 6.45787 4.378 6.36476L4.248 6.29176C4.23421 6.48455 4.14652 6.66457 4.00323 6.79428C3.85993 6.92399 3.6721 6.99337 3.47889 6.98795C3.28569 6.98253 3.10203 6.90274 2.96623 6.7652C2.83043 6.62767 2.75297 6.44302 2.75 6.24976V4.99976C2.75004 4.86756 2.78503 4.73772 2.85141 4.6234C2.91779 4.50907 3.01321 4.41433 3.128 4.34876L4.378 3.63476C4.55067 3.53615 4.75543 3.51015 4.94726 3.56247C5.13909 3.61479 5.3013 3.74114 5.4 3.91376ZM12.098 3.91376C12.1965 3.74097 12.3597 3.61441 12.5515 3.5619C12.7434 3.50939 12.9482 3.53524 13.121 3.63376L14.371 4.34876C14.486 4.4142 14.5816 4.50889 14.6482 4.62322C14.7147 4.73756 14.7499 4.86746 14.75 4.99976V6.24976C14.7509 6.44563 14.6751 6.63407 14.5389 6.77481C14.4027 6.91555 14.2168 6.99741 14.021 7.0029C13.8252 7.00839 13.6351 6.93706 13.4912 6.80417C13.3473 6.67128 13.2611 6.48737 13.251 6.29176L13.122 6.36476C12.9497 6.45787 12.7478 6.4799 12.5595 6.42614C12.3712 6.37238 12.2114 6.24709 12.1142 6.07706C12.0171 5.90702 11.9903 5.70573 12.0396 5.51619C12.0888 5.32666 12.2103 5.16392 12.378 5.06276L12.488 4.99976L12.378 4.93676C12.2052 4.83823 12.0786 4.67509 12.0261 4.48325C11.9736 4.2914 11.9995 4.08655 12.098 3.91376ZM6.852 6.91476C6.9507 6.74214 7.11391 6.61579 7.30574 6.56347C7.49757 6.51115 7.70233 6.53715 7.875 6.63576L8 7.13576L8.875 6.63576C9.04779 6.5371 9.25269 6.51112 9.44464 6.56353C9.63658 6.61595 9.79984 6.74247 9.8985 6.91526C9.99716 7.08805 10.0231 7.29295 9.97072 7.48489C9.91831 7.67684 9.79179 7.8401 9.619 7.93876L8.75 8.43476V9.24976C8.75 9.44867 8.67098 9.63943 8.53033 9.78009C8.38968 9.92074 8.19891 9.99976 8 9.99976C7.80109 9.99976 7.61032 9.92074 7.46967 9.78009C7.32902 9.63943 7.25 9.44867 7.25 9.24976V8.43476L6.381 7.93876C6.29531 7.88997 6.22009 7.82476 6.15963 7.74687C6.09917 7.66898 6.05467 7.57993 6.02866 7.48482C6.00265 7.38971 5.99566 7.2904 6.00807 7.19259C6.02048 7.09477 6.05206 7.00036 6.101 6.91476H6.102ZM3.5 8.99976C3.69891 8.99976 3.88968 9.07878 4.03033 9.21943C4.17098 9.36008 4.25 9.55085 4.25 9.74976V10.5648L5.122 11.0628C5.29479 11.1614 5.42131 11.3247 5.47372 11.5166C5.52614 11.7086 5.50016 11.9135 5.4015 12.0863C5.30284 12.259 5.13958 12.3856 4.94764 12.438C4.75569 12.4904 4.55079 12.4644 4.378 12.3658L3.128 11.6508C3.01321 11.5852 2.91779 11.4904 2.85141 11.3761C2.78503 11.2618 2.75004 11.132 2.75 10.9998V9.74976C2.75 9.55085 2.82902 9.36008 2.96967 9.21943C3.11032 9.07878 3.30109 8.99976 3.5 8.99976ZM14 8.99976C14.1989 8.99976 14.3897 9.07878 14.5303 9.21943C14.671 9.36008 14.75 9.55085 14.75 9.74976V10.9998C14.75 11.132 14.715 11.2618 14.6486 11.3761C14.5822 11.4904 14.4868 11.5852 14.372 11.6508L13.122 12.3658C12.9492 12.4644 12.7443 12.4904 12.5524 12.438C12.3604 12.3856 12.1972 12.259 12.0985 12.0863C11.9998 11.9135 11.9739 11.7086 12.0263 11.5166C12.0787 11.3247 12.2052 11.1614 12.378 11.0628L13.25 10.5648V9.74976C13.25 9.55085 13.329 9.36008 13.4697 9.21943C13.6103 9.07878 13.8011 8.99976 14 8.99976ZM9.499 12.7078L9.625 12.6358C9.79779 12.5371 10.0027 12.5111 10.1946 12.5635C10.3866 12.616 10.5498 12.7425 10.6485 12.9153C10.7472 13.088 10.7731 13.293 10.7207 13.4849C10.6683 13.6768 10.5418 13.8401 10.369 13.9388L9.122 14.6508C9.0087 14.7155 8.88048 14.7495 8.75 14.7495C8.61952 14.7495 8.4913 14.7155 8.378 14.6508L7.13 13.9398C6.95721 13.8411 6.83069 13.6778 6.77828 13.4859C6.72586 13.294 6.75184 13.089 6.8505 12.9163C6.94916 12.7435 7.11242 12.617 7.30436 12.5645C7.49631 12.5121 7.70121 12.5381 7.874 12.6368L8 12.7088C8.00992 12.5168 8.09316 12.336 8.23254 12.2036C8.37192 12.0713 8.55679 11.9975 8.749 11.9975C8.94121 11.9975 9.12608 12.0713 9.26546 12.2036C9.40484 12.336 9.48808 12.5168 9.498 12.7088L9.499 12.7078Z"
                              fill="white"
                              fillOpacity="0.5"
                            />
                          </svg>
                          Phone Number
                        </div>
                      </th>
                      <th className="p-4">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                          >
                            <path
                              d="M8.622 1.34876C8.5087 1.28404 8.38048 1.25 8.25 1.25C8.11952 1.25 7.9913 1.28404 7.878 1.34876L3.068 4.09676L8.25 7.13076L13.432 4.09676L8.622 1.34876ZM14.25 5.35676L9 8.42976V14.4348L13.872 11.6508C13.9868 11.5852 14.0822 11.4904 14.1486 11.3761C14.215 11.2618 14.25 11.132 14.25 10.9998V5.35676ZM7.5 14.4348V8.42976L2.25 5.35676V10.9998C2.25 11.2698 2.394 11.5178 2.628 11.6508L7.5 14.4348Z"
                              fill="white"
                              fillOpacity="0.4"
                            />
                          </svg>
                          Status
                        </div>
                      </th>
                      <th className="p-4 w-10">
                        <Ellipsis />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orgEventLoader ? (
                      <>
                        <tr>
                          <td
                            colSpan={8}
                            className="text-center p-4 text-white/50"
                          >
                            <Spin size="small" />
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        {sortedSalesHistory.length > 0 ? (
                          sortedSalesHistory.flatMap((sale, index) => {
                            // Determine if there is a refund
                            const hasRefund =
                              sale.refund && sale.refund !== "false";
                            const rows = [];

                            if (typeFilter !== "Refund") {
                              rows.push(
                                <tr
                                  key={`${index}-sale`}
                                  className="hover:bg-white/[0.02]"
                                >
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      {sale?.firstName
                                        ? sale?.firstName
                                        : sale?.email}
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg">
                                        <img
                                          src={`${sale?.party?.flyer}`}
                                          alt=""
                                          className="w-full h-full object-cover rounded-lg"
                                        />
                                      </div>
                                      {sale?.party?.event_name}
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      {sale?.tickets?.ticket_name
                                        ? `${sale?.tickets?.ticket_name} x ${sale?.count}`
                                        : `Complimentary Ticket x ${sale?.count}`}
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    {(() => {
                                      const dateObj = new Date(sale.date);
                                      const formattedDate =
                                        dateObj.toLocaleString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        });
                                      const formattedTime =
                                        dateObj.toLocaleString("en-US", {
                                          hour: "numeric",
                                          minute: "2-digit",
                                          hour12: true,
                                        });
                                      return `${formattedDate} at ${formattedTime}`;
                                    })()}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-2">
                                      {saleTypeIcons["Sale"]}
                                      <span className="capitalize">Sale</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span
                                      className={
                                        sale.amount < 0
                                          ? "text-white/50"
                                          : "text-white"
                                      }
                                    >
                                      {sale.transaction_id ? (
                                        <>
                                          {sale.amount < 0 ? "-" : ""}$
                                          {(
                                            Math.abs(sale.amount / 100 - 0.89) /
                                            1.09
                                          ).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </>
                                      ) : (
                                        "Comp"
                                      )}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-2">
                                      {statusIcons["paid"]}
                                      <span>Completed</span>
                                    </div>
                                  </td>
                                  <td className="py-4 pl-4">
                                    <DirectionAwareMenu>
                                      <MenuTrigger>
                                        <Ellipsis />
                                      </MenuTrigger>
                                      <MenuItem
                                        onClick={() => handleViewTicket(sale)}
                                      >
                                        <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                          {isLoadingTicket ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                          ) : (
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
                                          )}
                                          <span>View ticket</span>
                                        </div>
                                      </MenuItem>
                                      {sale.refund !== "true" && (
                                        <>
                                          <MenuItem
                                            onClick={() => handleViewQR(sale)}
                                          >
                                            <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                              <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M4.75 4.25C4.61739 4.25 4.49021 4.30268 4.39645 4.39645C4.30268 4.49021 4.25 4.61739 4.25 4.75C4.25 4.88261 4.30268 5.00979 4.39645 5.10355C4.49021 5.19732 4.61739 5.25 4.75 5.25C4.88261 5.25 5.00979 5.19732 5.10355 5.10355C5.19732 5.00979 5.25 4.88261 5.25 4.75C5.25 4.61739 5.19732 4.49021 5.10355 4.39645C5.00979 4.30268 4.88261 4.25 4.75 4.25Z"
                                                  fill="white"
                                                  fill-opacity="0.5"
                                                />
                                                <path
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  d="M2 3.5C2 3.10218 2.15804 2.72064 2.43934 2.43934C2.72064 2.15804 3.10218 2 3.5 2H6C6.39782 2 6.77936 2.15804 7.06066 2.43934C7.34196 2.72064 7.5 3.10218 7.5 3.5V6C7.5 6.39782 7.34196 6.77936 7.06066 7.06066C6.77936 7.34196 6.39782 7.5 6 7.5H3.5C3.10218 7.5 2.72064 7.34196 2.43934 7.06066C2.15804 6.77936 2 6.39782 2 6V3.5ZM3.5 3.5H6V6H3.5V3.5Z"
                                                  fill="white"
                                                  fill-opacity="0.5"
                                                />
                                                <path
                                                  d="M4.25 11.25C4.25 11.1174 4.30268 10.9902 4.39645 10.8964C4.49021 10.8027 4.61739 10.75 4.75 10.75C4.88261 10.75 5.00979 10.8027 5.10355 10.8964C5.19732 10.9902 5.25 11.1174 5.25 11.25C5.25 11.3826 5.19732 11.5098 5.10355 11.6036C5.00979 11.6973 4.88261 11.75 4.75 11.75C4.61739 11.75 4.49021 11.6973 4.39645 11.6036C4.30268 11.5098 4.25 11.3826 4.25 11.25Z"
                                                  fill="white"
                                                  fill-opacity="0.5"
                                                />
                                                <path
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  d="M2 10C2 9.60218 2.15804 9.22064 2.43934 8.93934C2.72064 8.65804 3.10218 8.5 3.5 8.5H6C6.39782 8.5 6.77936 8.65804 7.06066 8.93934C7.34196 9.22064 7.5 9.60218 7.5 10V12.5C7.5 12.8978 7.34196 13.2794 7.06066 13.5607C6.77936 13.842 6.39782 14 6 14H3.5C3.10218 14 2.72064 13.842 2.43934 13.5607C2.15804 13.2794 2 12.8978 2 12.5V10ZM3.5 12.5V10H6V12.5H3.5Z"
                                                  fill="white"
                                                  fill-opacity="0.5"
                                                />
                                                <path
                                                  d="M11.25 4.25C11.1174 4.25 10.9902 4.30268 10.8964 4.39645C10.8027 4.49021 10.75 4.61739 10.75 4.75C10.75 4.88261 10.8027 5.00979 10.8964 5.10355C10.9902 5.19732 11.1174 5.25 11.25 5.25C11.3826 5.25 11.5098 5.19732 11.6036 5.10355C11.6973 5.00979 11.75 4.88261 11.75 4.75C11.75 4.61739 11.6973 4.49021 11.6036 4.39645C11.5098 4.30268 11.3826 4.25 11.25 4.25Z"
                                                  fill="white"
                                                  fill-opacity="0.5"
                                                />
                                                <path
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  d="M10 2C9.60218 2 9.22064 2.15804 8.93934 2.43934C8.65804 2.72064 8.5 3.10218 8.5 3.5V6C8.5 6.39782 8.65804 6.77936 8.93934 7.06066C9.22064 7.34196 9.60218 7.5 10 7.5H12.5C12.8978 7.5 13.2794 7.34196 13.5607 7.06066C13.842 6.77936 14 6.39782 14 6V3.5C14 3.10218 13.842 2.72064 13.5607 2.43934C13.2794 2.15804 12.8978 2 12.5 2H10ZM12.5 3.5H10V6H12.5V3.5Z"
                                                  fill="white"
                                                  fill-opacity="0.5"
                                                />
                                                <path
                                                  d="M8.50001 9.417C8.49595 9.2941 8.51665 9.17164 8.56088 9.0569C8.60511 8.94215 8.67197 8.83748 8.75748 8.7491C8.84298 8.66073 8.94539 8.59045 9.05861 8.54246C9.17183 8.49446 9.29354 8.46973 9.41651 8.46973C9.53948 8.46973 9.6612 8.49446 9.77442 8.54246C9.88763 8.59045 9.99004 8.66073 10.0755 8.7491C10.1611 8.83748 10.2279 8.94215 10.2721 9.0569C10.3164 9.17164 10.3371 9.2941 10.333 9.417C10.3252 9.65484 10.2252 9.8803 10.0541 10.0458C9.88311 10.2112 9.65447 10.3037 9.41651 10.3037C9.17855 10.3037 8.94991 10.2112 8.77889 10.0458C8.60787 9.8803 8.50787 9.65484 8.50001 9.417ZM8.50001 13.083C8.49595 12.9601 8.51665 12.8376 8.56088 12.7229C8.60511 12.6082 8.67197 12.5035 8.75748 12.4151C8.84298 12.3267 8.94539 12.2565 9.05861 12.2085C9.17183 12.1605 9.29354 12.1357 9.41651 12.1357C9.53948 12.1357 9.6612 12.1605 9.77442 12.2085C9.88763 12.2565 9.99004 12.3267 10.0755 12.4151C10.1611 12.5035 10.2279 12.6082 10.2721 12.7229C10.3164 12.8376 10.3371 12.9601 10.333 13.083C10.3252 13.3208 10.2252 13.5463 10.0541 13.7118C9.88311 13.8772 9.65447 13.9697 9.41651 13.9697C9.17855 13.9697 8.94991 13.8772 8.77889 13.7118C8.60787 13.5463 8.50787 13.3208 8.50001 13.083ZM13.083 8.5C12.9601 8.49594 12.8376 8.51665 12.7229 8.56088C12.6082 8.60511 12.5035 8.67196 12.4151 8.75747C12.3267 8.84298 12.2565 8.94538 12.2085 9.0586C12.1605 9.17182 12.1357 9.29353 12.1357 9.4165C12.1357 9.53948 12.1605 9.66119 12.2085 9.77441C12.2565 9.88763 12.3267 9.99003 12.4151 10.0755C12.5035 10.161 12.6082 10.2279 12.7229 10.2721C12.8376 10.3164 12.9601 10.3371 13.083 10.333C13.3208 10.3251 13.5463 10.2251 13.7118 10.0541C13.8772 9.88311 13.9697 9.65447 13.9697 9.4165C13.9697 9.17854 13.8772 8.9499 13.7118 8.77888C13.5463 8.60786 13.3208 8.50786 13.083 8.5ZM12.166 13.084C12.162 12.9611 12.1827 12.8386 12.2269 12.7239C12.2711 12.6092 12.338 12.5045 12.4235 12.4161C12.509 12.3277 12.6114 12.2575 12.7246 12.2095C12.8378 12.1615 12.9595 12.1367 13.0825 12.1367C13.2055 12.1367 13.3272 12.1615 13.4404 12.2095C13.5536 12.2575 13.656 12.3277 13.7415 12.4161C13.8271 12.5045 13.8939 12.6092 13.9381 12.7239C13.9824 12.8386 14.0031 12.9611 13.999 13.084C13.9912 13.3218 13.8912 13.5473 13.7201 13.7128C13.5491 13.8782 13.3205 13.9707 13.0825 13.9707C12.8446 13.9707 12.6159 13.8782 12.4449 13.7128C12.2739 13.5473 12.1739 13.3218 12.166 13.084ZM11.25 10.333C11.1271 10.3289 11.0046 10.3496 10.8899 10.3939C10.7752 10.4381 10.6705 10.505 10.5821 10.5905C10.4937 10.676 10.4235 10.7784 10.3755 10.8916C10.3275 11.0048 10.3027 11.1265 10.3027 11.2495C10.3027 11.3725 10.3275 11.4942 10.3755 11.6074C10.4235 11.7206 10.4937 11.823 10.5821 11.9085C10.6705 11.994 10.7752 12.0609 10.8899 12.1051C11.0046 12.1494 11.1271 12.1701 11.25 12.166C11.4878 12.1581 11.7133 12.0581 11.8788 11.8871C12.0442 11.7161 12.1367 11.4875 12.1367 11.2495C12.1367 11.0115 12.0442 10.7829 11.8788 10.6119C11.7133 10.4409 11.4878 10.3409 11.25 10.333Z"
                                                  fill="white"
                                                  fill-opacity="0.5"
                                                />
                                              </svg>

                                              <span>View QR</span>
                                            </div>
                                          </MenuItem>
                                          <MenuSeparator />
                                          {sale.transaction_id && (
                                            <MenuItem
                                              onClick={() => {
                                                setSelectedEvent(sale);
                                                setIsRefundOpen(true);
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
                                                    d="M13.2501 9.74985C13.2501 9.38871 13.1789 9.03111 13.0407 8.69747C12.9025 8.36382 12.7 8.06066 12.4446 7.8053C12.1893 7.54994 11.8861 7.34738 11.5525 7.20918C11.2188 7.07098 10.8612 6.99985 10.5001 6.99985H5.31007L7.53007 9.21985C7.60376 9.28851 7.66286 9.37131 7.70385 9.46331C7.74485 9.55531 7.76689 9.65462 7.76866 9.75532C7.77044 9.85603 7.75192 9.95606 7.7142 10.0494C7.67647 10.1428 7.62033 10.2277 7.54911 10.2989C7.47789 10.3701 7.39306 10.4262 7.29967 10.464C7.20628 10.5017 7.10625 10.5202 7.00555 10.5184C6.90485 10.5167 6.80553 10.4946 6.71353 10.4536C6.62154 10.4126 6.53873 10.3535 6.47007 10.2798L2.97007 6.77985C2.82962 6.63922 2.75073 6.4486 2.75073 6.24985C2.75073 6.0511 2.82962 5.86047 2.97007 5.71985L6.47007 2.21985C6.61225 2.08737 6.80029 2.01524 6.9946 2.01867C7.1889 2.0221 7.37428 2.10081 7.51169 2.23822C7.64911 2.37564 7.72782 2.56102 7.73125 2.75532C7.73468 2.94963 7.66255 3.13767 7.53007 3.27985L5.31007 5.49985H10.5001C11.6272 5.49985 12.7082 5.94761 13.5053 6.74464C14.3023 7.54167 14.7501 8.62268 14.7501 9.74985C14.7501 10.877 14.3023 11.958 13.5053 12.7551C12.7082 13.5521 11.6272 13.9998 10.5001 13.9998H9.50007C9.30116 13.9998 9.11039 13.9208 8.96974 13.7802C8.82909 13.6395 8.75007 13.4488 8.75007 13.2498C8.75007 13.0509 8.82909 12.8602 8.96974 12.7195C9.11039 12.5789 9.30116 12.4998 9.50007 12.4998H10.5001C10.8612 12.4998 11.2188 12.4287 11.5525 12.2905C11.8861 12.1523 12.1893 11.9498 12.4446 11.6944C12.7 11.439 12.9025 11.1359 13.0407 10.8022C13.1789 10.4686 13.2501 10.111 13.2501 9.74985Z"
                                                    fill="#F43F5E"
                                                  />
                                                </svg>
                                                <span className="text-[#F43F5E]">
                                                  Refund
                                                </span>
                                              </div>
                                            </MenuItem>
                                          )}
                                        </>
                                      )}
                                    </DirectionAwareMenu>
                                  </td>
                                </tr>
                              );
                            }
                            // Sale row
                            if (hasRefund) {
                              rows.push(
                                <tr
                                  key={`${index}-refund`}
                                  className="hover:bg-white/[0.02]"
                                >
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      {sale?.firstName}
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg">
                                        <img
                                          src={`${sale?.party?.flyer}`}
                                          alt=""
                                          className="w-full h-full object-cover rounded-lg"
                                        />
                                      </div>
                                      {sale?.party?.event_name}
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      {sale?.tickets?.ticket_name
                                        ? `${sale?.tickets?.ticket_name} x ${sale?.count}`
                                        : "Complimentary Ticket"}
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    {(() => {
                                      const dateObj = new Date(sale.updatedAt);
                                      const formattedDate =
                                        dateObj.toLocaleString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        });
                                      const formattedTime =
                                        dateObj.toLocaleString("en-US", {
                                          hour: "numeric",
                                          minute: "2-digit",
                                          hour12: true,
                                        });
                                      return `${formattedDate} at ${formattedTime}`;
                                    })()}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-2">
                                      {saleTypeIcons["refund"]}
                                      <span className="capitalize">Refund</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className="text-white/50">
                                      -$
                                      {(
                                        Math.abs(sale.amount / 100 - 0.89) /
                                        1.09
                                      ).toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-2">
                                      {statusIcons["refund"]}
                                      <span>
                                        <FetchRefundStatus
                                          transactionId={sale.transaction_id}
                                        />
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-4 pl-4"></td>
                                </tr>
                              );
                            }

                            return rows;
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={8}
                              className="text-center p-4 text-white/50"
                            >
                              No results found
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>
    </SidebarLayout>
  );
};

export default DisputesTab;