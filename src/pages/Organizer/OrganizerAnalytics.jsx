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
import { PieChart, Pie, Cell, Label } from "recharts";
import axios from "axios";
import { Spin } from "antd";
import url from "../../constants/url";

const OrganizerAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    revenue: 0,
    ticketsSold: 0,
    currentlyLive: 0,
    ticketsViews: 0,
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
  const [trafficData, setTrafficData] = useState([]);
  const [isTrafficLoading, setIsTrafficLoading] = useState(true);
  const [errorTraffic, setErrorTraffic] = useState(null);
  const [totalVisits, setTotalVisits] = useState(0);

  const colorMap = {
    google: "#42bdf5",
    direct: "#9442f5",
    facebook: "#f54242",
    instagram: "#42f5a4",
    twitter: "#f59942",
    referral: "#f542b7",
    "(other)": "#8042f5",
  };

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

  const fetchTrafficData = async (organizerId) => {
    setIsTrafficLoading(true);
    try {
      const [gaResponse, manualResponse] = await Promise.all([
        axios.get(`${url}/analytics/traffic-sources?organizer_id=${organizerId}`),
        axios.get(`${url}/visit/get-visit-count/${organizerId}`)
      ]);

      let sourcesData = [];
      let totalGASessions = 0;

      if (gaResponse.data && gaResponse.data.success) {
        sourcesData = gaResponse.data.data || [];
        totalGASessions = gaResponse.data.total || 0;
      }

      let manualCount = 0;
      if (manualResponse.data) {
        manualCount = parseInt(manualResponse.data.totalCount || 0);
      }

      const combinedTotal = totalGASessions + manualCount;

      let combinedSources = [...sourcesData];

      const directIndex = combinedSources.findIndex(
        (source) => source.source.toLowerCase() === "direct"
      );

      if (directIndex >= 0) {
        combinedSources[directIndex] = {
          ...combinedSources[directIndex],
          sessions: combinedSources[directIndex].sessions + manualCount
        };
      } else if (manualCount > 0) {
        combinedSources.push({
          source: "Direct",
          sessions: manualCount,
          newUsers: 0,
          activeUsers: manualCount
        });
      }

      combinedSources = combinedSources.map((source) => ({
        ...source,
        percentage: combinedTotal > 0
          ? ((source.sessions / combinedTotal) * 100).toFixed(2) + "%"
          : "0%"
      }));

      const formattedData = combinedSources.map((source, index) => {
        const fill = colorMap[source.source.toLowerCase()] ||
          `hsl(${(index * 50) % 360}, 70%, 60%)`;

        return {
          name: source.source,
          value: source.sessions,
          fill,
          percentage: parseFloat(source.percentage),
          isManual: source.source.toLowerCase() === "direct" && manualCount > 0
        };
      });

      formattedData.sort((a, b) => b.value - a.value);

      setTrafficData(formattedData);
      setTotalVisits(combinedTotal);
    } catch (error) {
      console.error("Error fetching traffic sources:", error);
      setErrorTraffic(error.message);

      try {
        const manualResponse = await axios.get(`${url}/visit/get-visit/${eventId}`);
        if (manualResponse.data && manualResponse.data.data) {
          const manualCount = parseInt(manualResponse.data.data.count || 0);
          setTotalVisits(manualCount);

          if (manualCount > 0) {
            setTrafficData([{
              name: "Direct",
              value: manualCount,
              fill: colorMap.direct,
              percentage: 100,
              isManual: true
            }]);
          }
        }
      } catch (manualError) {
        console.error("Error fetching manual visit data:", manualError);
      }
    } finally {
      setIsTrafficLoading(false);
    }
  }

  useEffect(() => {
      const fetchTransactions = async () => {
          const response = await axios.get(
            `${url}/organizer-transactions/${oragnizerId}`
          );
          const totalAmount = response.data?.data
            .filter((payment) => payment.refund !== true)
            .reduce((sum, sale) => {
              if (!sale.amount) return sum;
              const amountAfterFee = (Number(sale.amount / 100) - 0.89) / 1.09;
              return sum + amountAfterFee;
            }, 0);
          setAnalyticsData((prev) => ({...prev, revenue: totalAmount }))
      }
      fetchTransactions()
  }, [oragnizerId])

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

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const pastEvents = events.filter((event) => {
        const eventDate = new Date(event.start_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= currentDate && event.explore === "YES";
      });
      setAnalyticsData((prev) => ({ ...prev, currentlyLive: pastEvents.length }))

      fetchTrafficData(oragnizerId)

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

  useEffect(() => {
      setAnalyticsData((prev) => ({
          ...prev,
          ticketsViews: Object.values(viewsCount).reduce((sum, count) => sum + parseInt(count), 0)
      }))
  }, [viewsCount])

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

  useEffect(() => {
      setAnalyticsData((prev) => ({
          ...prev,
          ticketsSold: Object.values(ticketSalesData)
              .reduce((sum, count) => sum + count, 0)
      }))
  }, [ticketSalesData])

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
              <h3 className="text-white/70 text-sm mb-1">Revenue</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  ${analyticsData.revenue.toLocaleString()}
                </p>
                {/* <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.revenueChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.revenueChange}
                </span> */}
              </div>
            </div>
            <div className="p-2 rounded-full">
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
            </div>
          </div>

          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white/70 text-sm mb-1">Tickets sold</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {analyticsData.ticketsSold}
                </p>
                {/* <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.ticketsSoldChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.ticketsSoldChange}
                </span> */}
              </div>
            </div>
            <div className="p-2 rounded-full">
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
            </div>
          </div>

          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white/70 text-sm mb-1">Currently live</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {analyticsData.currentlyLive}
                </p>
                {/* <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.currentlyLiveChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.currentlyLiveChange}
                </span> */}
              </div>
            </div>
            <div className="p-2 rounded-full">
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
            </div>
          </div>

          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white/70 text-sm mb-1">Tickets views</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {analyticsData.ticketsViews}
                </p>
                {/* <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.ticketsViewsChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.ticketsViewsChange}
                </span> */}
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
          </div>
        </div>

        <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden mb-6">
          <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.75 10.818V13.432C11.1539 13.3639 11.5406 13.2171 11.888 13C12.37 12.685 12.5 12.352 12.5 12.125C12.5 11.898 12.37 11.565 11.888 11.25C11.5406 11.0329 11.1539 10.8862 10.75 10.818ZM8.33 8.62003C8.383 8.67503 8.445 8.73003 8.514 8.78403C8.722 8.94403 8.974 9.06803 9.25 9.14703V6.60303C9.1302 6.6374 9.01319 6.68085 8.9 6.73303C8.76 6.79803 8.63 6.87603 8.514 6.96603C8.137 7.25803 8 7.59303 8 7.87503C8 8.05903 8.058 8.26503 8.202 8.46703C8.239 8.51803 8.282 8.57003 8.33 8.62003Z"
                fill="white"
                fill-opacity="0.5"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10ZM10 4C10.1989 4 10.3897 4.07902 10.5303 4.21967C10.671 4.36032 10.75 4.55109 10.75 4.75V5.066C11.3504 5.16708 11.9175 5.41168 12.403 5.779C12.829 6.109 13.147 6.519 13.328 6.979C13.3951 7.16273 13.3877 7.36539 13.3075 7.54377C13.2272 7.72215 13.0805 7.86213 12.8985 7.93386C12.7166 8.0056 12.5138 8.00342 12.3334 7.92779C12.1531 7.85216 12.0094 7.70906 11.933 7.529C11.8376 7.30438 11.6831 7.10982 11.486 6.966C11.2658 6.79964 11.016 6.67647 10.75 6.603V9.3C11.448 9.393 12.133 9.62 12.709 9.996C13.496 10.51 13.999 11.266 13.999 12.126C13.999 12.986 13.495 13.742 12.709 14.256C12.133 14.633 11.448 14.859 10.749 14.952V15.251C10.749 15.4499 10.67 15.6407 10.5293 15.7813C10.3887 15.922 10.1979 16.001 9.999 16.001C9.80009 16.001 9.60932 15.922 9.46867 15.7813C9.32802 15.6407 9.249 15.4499 9.249 15.251V14.951C8.552 14.859 7.867 14.633 7.291 14.256C6.809 13.941 6.434 13.539 6.213 13.068C6.12866 12.8878 6.11937 12.6814 6.18716 12.4944C6.25496 12.3073 6.39429 12.1548 6.5745 12.0705C6.75471 11.9862 6.96105 11.9769 7.14812 12.0447C7.33519 12.1125 7.48766 12.2518 7.572 12.432C7.652 12.605 7.817 12.808 8.112 13.001C8.425 13.206 8.818 13.354 9.25 13.433V10.685C8.64964 10.5838 8.08258 10.3393 7.597 9.972C6.9 9.433 6.5 8.681 6.5 7.875C6.5 7.07 6.9 6.317 7.597 5.779C8.08254 5.41168 8.64962 5.16708 9.25 5.066V4.75C9.25 4.55109 9.32902 4.36032 9.46967 4.21967C9.61032 4.07902 9.80109 4 10 4Z"
                fill="white"
                fill-opacity="0.5"
              />
            </svg>
            Revenue overview
          </h3>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "rgba(255,255,255,0.5)" }}
                  tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.5)" }}
                  tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickFormatter={(value) => `$${value / 1000}K`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    color: "white",
                  }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                  labelFormatter={(label) => `${label}`}
                />
                <Line
                  type="linear"
                  dataKey="Revenue"
                  stroke="#34B2DA"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#34B2DA", strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    fill: "#34B2DA",
                    stroke: "rgba(52, 178, 218, 0.3)",
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.25 0C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V4.75C0 5.34674 0.237053 5.91903 0.65901 6.34099C1.08097 6.76295 1.65326 7 2.25 7H4.75C5.34674 7 5.91903 6.76295 6.34099 6.34099C6.76295 5.91903 7 5.34674 7 4.75V2.25C7 1.65326 6.76295 1.08097 6.34099 0.65901C5.91903 0.237053 5.34674 0 4.75 0H2.25ZM2.25 9C1.65326 9 1.08097 9.23705 0.65901 9.65901C0.237053 10.081 0 10.6533 0 11.25V13.75C0 14.3467 0.237053 14.919 0.65901 15.341C1.08097 15.7629 1.65326 16 2.25 16H4.75C5.34674 16 5.91903 15.7629 6.34099 15.341C6.76295 14.919 7 14.3467 7 13.75V11.25C7 10.6533 6.76295 10.081 6.34099 9.65901C5.91903 9.23705 5.34674 9 4.75 9H2.25ZM11.25 0C10.6533 0 10.081 0.237053 9.65901 0.65901C9.23705 1.08097 9 1.65326 9 2.25V4.75C9 5.34674 9.23705 5.91903 9.65901 6.34099C10.081 6.76295 10.6533 7 11.25 7H13.75C14.3467 7 14.919 6.76295 15.341 6.34099C15.7629 5.91903 16 5.34674 16 4.75V2.25C16 1.65326 15.7629 1.08097 15.341 0.65901C14.919 0.237053 14.3467 0 13.75 0H11.25ZM11.25 9C10.6533 9 10.081 9.23705 9.65901 9.65901C9.23705 10.081 9 10.6533 9 11.25V13.75C9 14.3467 9.23705 14.919 9.65901 15.341C10.081 15.7629 10.6533 16 11.25 16H13.75C14.3467 16 14.919 15.7629 15.341 15.341C15.7629 14.919 16 14.3467 16 13.75V11.25C16 10.6533 15.7629 10.081 15.341 9.65901C14.919 9.23705 14.3467 9 13.75 9H11.25Z"
                  fill="white"
                  fill-opacity="0.5"
                />
              </svg>
              Categories
            </h3>
            <div className="p-4">
              <div className="flex flex-wrap gap-4 mb-6">
                {categoriesData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.fill }}
                      aria-hidden="true"
                    />
                    <span className="text-white text-sm">{item.name}</span>
                    <span className="text-white/70 text-sm">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={categoriesData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={105}
                      outerRadius={115}
                      strokeWidth={0}
                      paddingAngle={3}
                      activeShape={CustomizedShape}
                      shape={<CustomizedShape />}
                      activeIndex={[]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {categoriesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          stroke={entry.fill}
                          strokeLinecap="round"
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox;
                          return (
                            <g>
                              <text
                                x={cx}
                                y={cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={cx}
                                  y={cy}
                                  className="fill-white text-3xl font-bold"
                                >
                                  {totalSells}
                                </tspan>
                                <tspan
                                  x={cx}
                                  y={cy + 25}
                                  className="fill-gray-400 text-sm"
                                >
                                  Total sells
                                </tspan>
                              </text>
                            </g>
                          );
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.25 0C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V4.75C0 5.34674 0.237053 5.91903 0.65901 6.34099C1.08097 6.76295 1.65326 7 2.25 7H4.75C5.34674 7 5.91903 6.76295 6.34099 6.34099C6.76295 5.91903 7 5.34674 7 4.75V2.25C7 1.65326 6.76295 1.08097 6.34099 0.65901C5.91903 0.237053 5.34674 0 4.75 0H2.25ZM2.25 9C1.65326 9 1.08097 9.23705 0.65901 9.65901C0.237053 10.081 0 10.6533 0 11.25V13.75C0 14.3467 0.237053 14.919 0.65901 15.341C1.08097 15.7629 1.65326 16 2.25 16H4.75C5.34674 16 5.91903 15.7629 6.34099 15.341C6.76295 14.919 7 14.3467 7 13.75V11.25C7 10.6533 6.76295 10.081 6.34099 9.65901C5.91903 9.23705 5.34674 9 4.75 9H2.25ZM11.25 0C10.6533 0 10.081 0.237053 9.65901 0.65901C9.23705 1.08097 9 1.65326 9 2.25V4.75C9 5.34674 9.23705 5.91903 9.65901 6.34099C10.081 6.76295 10.6533 7 11.25 7H13.75C14.3467 7 14.919 6.76295 15.341 6.34099C15.7629 5.91903 16 5.34674 16 4.75V2.25C16 1.65326 15.7629 1.08097 15.341 0.65901C14.919 0.237053 14.3467 0 13.75 0H11.25ZM11.25 9C10.6533 9 10.081 9.23705 9.65901 9.65901C9.23705 10.081 9 10.6533 9 11.25V13.75C9 14.3467 9.23705 14.919 9.65901 15.341C10.081 15.7629 10.6533 16 11.25 16H13.75C14.3467 16 14.919 15.7629 15.341 15.341C15.7629 14.919 16 14.3467 16 13.75V11.25C16 10.6533 15.7629 10.081 15.341 9.65901C14.919 9.23705 14.3467 9 13.75 9H11.25Z"
                  fill="white"
                  fill-opacity="0.5"
                />
              </svg>
              Traffic Sources
            </h3>
            <div className="p-4">
              <div className="flex flex-wrap gap-4 mb-6">
                {trafficData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.fill }}
                      aria-hidden="true"
                    />
                    <span className="text-white text-sm">{item.name}</span>
                  </div>
                ))}
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={trafficData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={105}
                      outerRadius={115}
                      strokeWidth={0}
                      paddingAngle={3}
                      activeShape={CustomizedShape}
                      shape={<CustomizedShape />}
                      activeIndex={[]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {trafficData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          stroke={entry.fill}
                          strokeLinecap="round"
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox;
                          return (
                            <g>
                              <text
                                x={cx}
                                y={cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={cx}
                                  y={cy}
                                  className="fill-white text-3xl font-bold"
                                >
                                  {numberFormatter(totalVisits)}
                                </tspan>
                                <tspan
                                  x={cx}
                                  y={cy + 25}
                                  className="fill-gray-400 text-sm"
                                >
                                  Total visits
                                </tspan>
                              </text>
                            </g>
                          );
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.25 0C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V4.75C0 5.34674 0.237053 5.91903 0.65901 6.34099C1.08097 6.76295 1.65326 7 2.25 7H4.75C5.34674 7 5.91903 6.76295 6.34099 6.34099C6.76295 5.91903 7 5.34674 7 4.75V2.25C7 1.65326 6.76295 1.08097 6.34099 0.65901C5.91903 0.237053 5.34674 0 4.75 0H2.25ZM2.25 9C1.65326 9 1.08097 9.23705 0.65901 9.65901C0.237053 10.081 0 10.6533 0 11.25V13.75C0 14.3467 0.237053 14.919 0.65901 15.341C1.08097 15.7629 1.65326 16 2.25 16H4.75C5.34674 16 5.91903 15.7629 6.34099 15.341C6.76295 14.919 7 14.3467 7 13.75V11.25C7 10.6533 6.76295 10.081 6.34099 9.65901C5.91903 9.23705 5.34674 9 4.75 9H2.25ZM11.25 0C10.6533 0 10.081 0.237053 9.65901 0.65901C9.23705 1.08097 9 1.65326 9 2.25V4.75C9 5.34674 9.23705 5.91903 9.65901 6.34099C10.081 6.76295 10.6533 7 11.25 7H13.75C14.3467 7 14.919 6.76295 15.341 6.34099C15.7629 5.91903 16 5.34674 16 4.75V2.25C16 1.65326 15.7629 1.08097 15.341 0.65901C14.919 0.237053 14.3467 0 13.75 0H11.25ZM11.25 9C10.6533 9 10.081 9.23705 9.65901 9.65901C9.23705 10.081 9 10.6533 9 11.25V13.75C9 14.3467 9.23705 14.919 9.65901 15.341C10.081 15.7629 10.6533 16 11.25 16H13.75C14.3467 16 14.919 15.7629 15.341 15.341C15.7629 14.919 16 14.3467 16 13.75V11.25C16 10.6533 15.7629 10.081 15.341 9.65901C14.919 9.23705 14.3467 9 13.75 9H11.25Z"
                  fill="white"
                  fill-opacity="0.5"
                />
              </svg>
              Conversion Funnel
            </h3>
            <div className="p-4 flex flex-col justify-between h-[calc(100%-56px)]">
              {funnelData.map((item, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex items-center mb-1">
                    {index === 0 && (
                      <div className="w-6 h-6 mr-2 flex items-center justify-center text-white/70">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 9.5C8.39782 9.5 8.77936 9.34196 9.06066 9.06066C9.34196 8.77936 9.5 8.39782 9.5 8C9.5 7.60218 9.34196 7.22064 9.06066 6.93934C8.77936 6.65804 8.39782 6.5 8 6.5C7.60218 6.5 7.22064 6.65804 6.93934 6.93934C6.65804 7.22064 6.5 7.60218 6.5 8C6.5 8.39782 6.65804 8.77936 6.93934 9.06066C7.22064 9.34196 7.60218 9.5 8 9.5Z"
                            fill="white"
                            fill-opacity="0.5"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.38008 8.28C1.31699 8.0966 1.31699 7.89739 1.38008 7.714C1.85645 6.33737 2.75026 5.14356 3.93704 4.29881C5.12382 3.45407 6.54449 3.00044 8.00122 3.0011C9.45794 3.00176 10.8782 3.45667 12.0642 4.3025C13.2502 5.14832 14.143 6.34294 14.6181 7.72C14.6812 7.90339 14.6812 8.1026 14.6181 8.286C14.1419 9.66298 13.2481 10.8572 12.0612 11.7022C10.8743 12.5472 9.45342 13.001 7.99644 13.0003C6.53946 12.9997 5.11896 12.5446 3.93282 11.6985C2.74669 10.8524 1.85399 9.65741 1.37908 8.28H1.38008ZM11.0001 8C11.0001 8.79565 10.684 9.55871 10.1214 10.1213C9.55879 10.6839 8.79573 11 8.00008 11C7.20443 11 6.44137 10.6839 5.87876 10.1213C5.31615 9.55871 5.00008 8.79565 5.00008 8C5.00008 7.20435 5.31615 6.44129 5.87876 5.87868C6.44137 5.31607 7.20443 5 8.00008 5C8.79573 5 9.55879 5.31607 10.1214 5.87868C10.684 6.44129 11.0001 7.20435 11.0001 8Z"
                            fill="white"
                            fill-opacity="0.5"
                          />
                        </svg>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="w-6 h-6 mr-2 flex items-center justify-center text-white/70">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.99999 4C4.99999 3.20435 5.31606 2.44129 5.87867 1.87868C6.44128 1.31607 7.20434 1 7.99999 1C8.79564 1 9.5587 1.31607 10.1213 1.87868C10.6839 2.44129 11 3.20435 11 4V5H11.643C12.0148 5.00012 12.3732 5.13829 12.6489 5.38773C12.9246 5.63717 13.0978 5.98009 13.135 6.35L13.835 13.35C13.856 13.5586 13.833 13.7693 13.7675 13.9685C13.702 14.1677 13.5954 14.3509 13.4548 14.5064C13.3141 14.6619 13.1424 14.7862 12.9507 14.8712C12.759 14.9562 12.5517 15.0001 12.342 15H3.65699C3.4474 14.9999 3.24014 14.9559 3.0486 14.8709C2.85705 14.7858 2.68545 14.6615 2.54488 14.5061C2.40431 14.3506 2.29787 14.1674 2.23244 13.9683C2.16701 13.7692 2.14403 13.5585 2.16499 13.35L2.86499 6.35C2.90217 5.98009 3.07539 5.63717 3.35106 5.38773C3.62674 5.13829 3.98522 5.00012 4.35699 5H4.99999V4ZM9.49999 4V5H6.49999V4C6.49999 3.60218 6.65802 3.22064 6.93933 2.93934C7.22063 2.65804 7.60216 2.5 7.99999 2.5C8.39781 2.5 8.77935 2.65804 9.06065 2.93934C9.34195 3.22064 9.49999 3.60218 9.49999 4ZM6.49999 7.75C6.49999 7.55109 6.42097 7.36032 6.28032 7.21967C6.13967 7.07902 5.9489 7 5.74999 7C5.55108 7 5.36031 7.07902 5.21966 7.21967C5.07901 7.36032 4.99999 7.55109 4.99999 7.75V8.75C4.99999 9.54565 5.31606 10.3087 5.87867 10.8713C6.44128 11.4339 7.20434 11.75 7.99999 11.75C8.79564 11.75 9.5587 11.4339 10.1213 10.8713C10.6839 10.3087 11 9.54565 11 8.75V7.75C11 7.55109 10.921 7.36032 10.7803 7.21967C10.6397 7.07902 10.4489 7 10.25 7C10.0511 7 9.86031 7.07902 9.71966 7.21967C9.57901 7.36032 9.49999 7.55109 9.49999 7.75V8.75C9.49999 9.14782 9.34195 9.52936 9.06065 9.81066C8.77935 10.092 8.39781 10.25 7.99999 10.25C7.60216 10.25 7.22063 10.092 6.93933 9.81066C6.65802 9.52936 6.49999 9.14782 6.49999 8.75V7.75Z"
                            fill="white"
                            fill-opacity="0.5"
                          />
                        </svg>
                      </div>
                    )}
                    {index === 2 && (
                      <div className="w-6 h-6 mr-2 flex items-center justify-center text-white/70">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.375 5.5H7.25V7.25H6.375C6.26009 7.25 6.14631 7.22737 6.04015 7.18339C5.93399 7.13942 5.83753 7.07497 5.75628 6.99372C5.67503 6.91247 5.61058 6.81601 5.56661 6.70985C5.52263 6.60369 5.5 6.48991 5.5 6.375C5.5 6.26009 5.52263 6.14631 5.56661 6.04015C5.61058 5.93399 5.67503 5.83753 5.75628 5.75628C5.83753 5.67503 5.93399 5.61058 6.04015 5.56661C6.14631 5.52263 6.26009 5.5 6.375 5.5ZM8.75 10.5V8.75H9.625C9.85706 8.75 10.0796 8.84219 10.2437 9.00628C10.4078 9.17038 10.5 9.39294 10.5 9.625C10.5 9.85706 10.4078 10.0796 10.2437 10.2437C10.0796 10.4078 9.85706 10.5 9.625 10.5H8.75Z"
                            fill="white"
                            fill-opacity="0.5"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8ZM7.25 3.75C7.25 3.55109 7.32902 3.36032 7.46967 3.21967C7.61032 3.07902 7.80109 3 8 3C8.19891 3 8.38968 3.07902 8.53033 3.21967C8.67098 3.36032 8.75 3.55109 8.75 3.75V4H11.25C11.4489 4 11.6397 4.07902 11.7803 4.21967C11.921 4.36032 12 4.55109 12 4.75C12 4.94891 11.921 5.13968 11.7803 5.28033C11.6397 5.42098 11.4489 5.5 11.25 5.5H8.75V7.25H9.625C10.2549 7.25 10.859 7.50022 11.3044 7.94562C11.7498 8.39102 12 8.99511 12 9.625C12 10.2549 11.7498 10.859 11.3044 11.3044C10.859 11.7498 10.2549 12 9.625 12H8.75V12.25C8.75 12.4489 8.67098 12.6397 8.53033 12.7803C8.38968 12.921 8.19891 13 8 13C7.80109 13 7.61032 12.921 7.46967 12.7803C7.32902 12.6397 7.25 12.4489 7.25 12.25V12H4.75C4.55109 12 4.36032 11.921 4.21967 11.7803C4.07902 11.6397 4 11.4489 4 11.25C4 11.0511 4.07902 10.8603 4.21967 10.7197C4.36032 10.579 4.55109 10.5 4.75 10.5H7.25V8.75H6.375C5.74511 8.75 5.14102 8.49978 4.69562 8.05438C4.25022 7.60898 4 7.00489 4 6.375C4 5.74511 4.25022 5.14102 4.69562 4.69562C5.14102 4.25022 5.74511 4 6.375 4H7.25V3.75Z"
                            fill="white"
                            fill-opacity="0.5"
                          />
                        </svg>
                      </div>
                    )}
                    <span className="text-sm text-white/70">{item.stage}</span>
                  </div>
                  <div className="relative h-10 w-full bg-[#151515] rounded-md overflow-hidden border border-[#252525]">
                    {index === 2 ? (
                      <div
                        className="absolute h-full rounded-md flex items-center px-3"
                        style={{
                          width: "auto",
                          minWidth: "120px",
                          background: "rgba(155, 89, 182, 0.2)",
                          borderRight: "1px solid rgba(155, 89, 182, 0.3)",
                        }}
                      >
                        <span className="text-white text-sm whitespace-nowrap">
                          {item.percentage}% - {item.value}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="absolute h-full rounded-md flex items-center px-3"
                        style={{
                          width: `${item.percentage}%`,
                          background:
                            index === 0
                              ? "rgba(52, 178, 218, 0.2)"
                              : "rgba(231, 76, 60, 0.2)",
                          borderRight:
                            index === 0
                              ? "1px solid rgba(52, 178, 218, 0.3)"
                              : "1px solid rgba(231, 76, 60, 0.3)",
                        }}
                      >
                        <span className="text-white text-sm whitespace-nowrap">
                          {item.percentage}% - {item.value}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.25 2C6.44891 2 6.63968 2.07902 6.78033 2.21967C6.92098 2.36032 7 2.55109 7 2.75V4H14V2.75C14 2.55109 14.079 2.36032 14.2197 2.21967C14.3603 2.07902 14.5511 2 14.75 2C14.9489 2 15.1397 2.07902 15.2803 2.21967C15.421 2.36032 15.5 2.55109 15.5 2.75V4H15.75C16.4793 4 17.1788 4.28973 17.6945 4.80546C18.2103 5.32118 18.5 6.02065 18.5 6.75V15.25C18.5 15.9793 18.2103 16.6788 17.6945 17.1945C17.1788 17.7103 16.4793 18 15.75 18H5.25C4.52065 18 3.82118 17.7103 3.30546 17.1945C2.78973 16.6788 2.5 15.9793 2.5 15.25V6.75C2.5 6.02065 2.78973 5.32118 3.30546 4.80546C3.82118 4.28973 4.52065 4 5.25 4H5.5V2.75C5.5 2.55109 5.57902 2.36032 5.71967 2.21967C5.86032 2.07902 6.05109 2 6.25 2ZM5.25 7.5C4.56 7.5 4 8.06 4 8.75V15.25C4 15.94 4.56 16.5 5.25 16.5H15.75C16.44 16.5 17 15.94 17 15.25V8.75C17 8.06 16.44 7.5 15.75 7.5H5.25Z"
                  fill="white"
                  fill-opacity="0.5"
                />
              </svg>
              Popular days
            </h3>
            <div className="p-4">
              <div className="relative w-full h-[300px] flex flex-col">
                <div className="absolute top-0 left-0 h-[calc(100%-28px)] w-12 flex flex-col justify-between text-white/70 text-sm">
                  <div>500</div>
                  <div>400</div>
                  <div>300</div>
                  <div>200</div>
                  <div>100</div>
                  <div>0</div>
                </div>

                <div className="absolute left-12 right-0 top-0 h-[calc(100%-28px)] flex flex-col justify-between">
                  {[0, 1, 2, 3, 4, 5].map((_, i) => (
                    <div
                      key={i}
                      className="border-t border-white/10 w-full h-0"
                    ></div>
                  ))}
                </div>

                <div
                  className="absolute left-12 right-0 bottom-0 top-0 flex"
                  style={{
                    zIndex: 10,
                    height: "calc(100% - 28px)",
                    paddingTop: "25px",
                  }}
                >
                  {popularDaysData.map((item, index) => {
                    const maxValue = 500;
                    const height = (item.visitors / maxValue) * 100;

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col justify-end relative"
                      >
                        <div
                          className="w-full rounded-t-sm relative"
                          style={{
                            height: `${height}%`,
                            background: "rgba(140, 217, 255, 0.08)",
                            borderTop: "3px solid #42bdf5",
                          }}
                          onMouseEnter={() => setHoveredDay(index)}
                          onMouseLeave={() => setHoveredDay(null)}
                        >
                          {hoveredDay === index && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#111] p-2 rounded border border-white/10 text-white text-xs whitespace-nowrap z-20">
                              {numberFormatter(item.visitors)}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-center text-white/70 text-sm">
                          {item.day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden mb-6">
          <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8ZM8.75 3.75C8.75 3.55109 8.67098 3.36032 8.53033 3.21967C8.38968 3.07902 8.19891 3 8 3C7.80109 3 7.61032 3.07902 7.46967 3.21967C7.32902 3.36032 7.25 3.55109 7.25 3.75V8C7.25 8.414 7.586 8.75 8 8.75H11.25C11.4489 8.75 11.6397 8.67098 11.7803 8.53033C11.921 8.38968 12 8.19891 12 8C12 7.80109 11.921 7.61032 11.7803 7.46967C11.6397 7.32902 11.4489 7.25 11.25 7.25H8.75V3.75Z"
                fill="white"
                fill-opacity="0.5"
              />
            </svg>
            Events performance
          </h3>
          <div className="p-0">
            {eventsLoading ? (
              <div className="py-8 text-center">
                <Spin />
              </div>
            ) : eventsData.length === 0 ? (
              <div className="py-8 text-center text-white/50">
                No data available
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5">
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
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M1 4.5C1 4.10218 1.15804 3.72064 1.43934 3.43934C1.72064 3.15804 2.10218 3 2.5 3H13.5C13.8978 3 14.2794 3.15804 14.5607 3.43934C14.842 3.72064 15 4.10218 15 4.5V5.5C15 5.776 14.773 5.994 14.505 6.062C14.0743 6.1718 13.6925 6.42192 13.4198 6.77286C13.1472 7.1238 12.9991 7.55557 12.9991 8C12.9991 8.44443 13.1472 8.8762 13.4198 9.22714C13.6925 9.57808 14.0743 9.8282 14.505 9.938C14.773 10.006 15 10.224 15 10.5V11.5C15 11.8978 14.842 12.2794 14.5607 12.5607C14.2794 12.842 13.8978 13 13.5 13H2.5C2.10218 13 1.72064 12.842 1.43934 12.5607C1.15804 12.2794 1 11.8978 1 11.5V10.5C1 10.224 1.227 10.006 1.495 9.938C1.92565 9.8282 2.30747 9.57808 2.58016 9.22714C2.85285 8.8762 3.00088 8.44443 3.00088 8C3.00088 7.55557 2.85285 7.1238 2.58016 6.77286C2.30747 6.42192 1.92565 6.1718 1.495 6.062C1.227 5.994 1 5.776 1 5.5V4.5ZM10 5.75C10 5.55109 10.079 5.36032 10.2197 5.21967C10.3603 5.07902 10.5511 5 10.75 5C10.9489 5 11.1397 5.07902 11.2803 5.21967C11.421 5.36032 11.5 5.55109 11.5 5.75V6.75C11.5 6.94891 11.421 7.13968 11.2803 7.28033C11.1397 7.42098 10.9489 7.5 10.75 7.5C10.5511 7.5 10.3603 7.42098 10.2197 7.28033C10.079 7.13968 10 6.94891 10 6.75V5.75ZM10.75 8.5C10.5511 8.5 10.3603 8.57902 10.2197 8.71967C10.079 8.86032 10 9.05109 10 9.25V10.25C10 10.4489 10.079 10.6397 10.2197 10.7803C10.3603 10.921 10.5511 11 10.75 11C10.9489 11 11.1397 10.921 11.2803 10.7803C11.421 10.6397 11.5 10.4489 11.5 10.25V9.25C11.5 9.05109 11.421 8.86032 11.2803 8.71967C11.1397 8.57902 10.9489 8.5 10.75 8.5Z"
                              fill="white"
                              fill-opacity="0.5"
                            />
                          </svg>
                          Event
                        </div>
                      </th>
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
                              d="M7 6.5C7.39782 6.5 7.77936 6.34196 8.06066 6.06066C8.34196 5.77936 8.5 5.39782 8.5 5C8.5 4.60218 8.34196 4.22064 8.06066 3.93934C7.77936 3.65804 7.39782 3.5 7 3.5C6.60218 3.5 6.22064 3.65804 5.93934 3.93934C5.65804 4.22064 5.5 4.60218 5.5 5C5.5 5.39782 5.65804 5.77936 5.93934 6.06066C6.22064 6.34196 6.60218 6.5 7 6.5Z"
                              fill="white"
                              fill-opacity="0.5"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M0.380078 5.28C0.316992 5.0966 0.316992 4.89739 0.380078 4.714C0.856452 3.33737 1.75026 2.14356 2.93704 1.29881C4.12382 0.454067 5.54449 0.000439107 7.00122 0.00109935C8.45794 0.0017596 9.8782 0.456675 11.0642 1.3025C12.2502 2.14832 13.143 3.34294 13.6181 4.72C13.6812 4.90339 13.6812 5.1026 13.6181 5.286C13.1419 6.66298 12.2481 7.85716 11.0612 8.70218C9.87434 9.54721 8.45342 10.001 6.99644 10.0003C5.53946 9.99968 4.11896 9.5446 2.93282 8.6985C1.74669 7.8524 0.853988 6.65741 0.379078 5.28H0.380078ZM10.0001 5C10.0001 5.79565 9.68401 6.55871 9.1214 7.12132C8.55879 7.68393 7.79573 8 7.00008 8C6.20443 8 5.44137 7.68393 4.87876 7.12132C4.31615 6.55871 4.00008 5.79565 4.00008 5C4.00008 4.20435 4.31615 3.44129 4.87876 2.87868C5.44137 2.31607 6.20443 2 7.00008 2C7.79573 2 8.55879 2.31607 9.1214 2.87868C9.68401 3.44129 10.0001 4.20435 10.0001 5Z"
                              fill="white"
                              fill-opacity="0.5"
                            />
                          </svg>
                          Views
                        </div>
                      </th>
                      <th className="text-left p-4">
                        <div className="flex items-center gap-x-2">
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
                            className="shrink-0"
                          >
                            <circle cx="8" cy="21" r="1" />
                            <circle cx="19" cy="21" r="1" />
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                          </svg>
                          Tickets Sold
                        </div>
                      </th>
                      <th className="text-left p-4">
                        <div className="flex items-center gap-x-2">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.75 10.818V13.432C11.1539 13.3639 11.5406 13.2171 11.888 13C12.37 12.685 12.5 12.352 12.5 12.125C12.5 11.898 12.37 11.565 11.888 11.25C11.5406 11.0329 11.1539 10.8862 10.75 10.818ZM8.33 8.62003C8.383 8.67503 8.445 8.73003 8.514 8.78403C8.722 8.94403 8.974 9.06803 9.25 9.14703V6.60303C9.1302 6.6374 9.01319 6.68085 8.9 6.73303C8.76 6.79803 8.63 6.87603 8.514 6.96603C8.137 7.25803 8 7.59303 8 7.87503C8 8.05903 8.058 8.26503 8.202 8.46703C8.239 8.51803 8.282 8.57003 8.33 8.62003Z"
                              fill="white"
                              fill-opacity="0.5"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10ZM10 4C10.1989 4 10.3897 4.07902 10.5303 4.21967C10.671 4.36032 10.75 4.55109 10.75 4.75V5.066C11.3504 5.16708 11.9175 5.41168 12.403 5.779C12.829 6.109 13.147 6.519 13.328 6.979C13.3951 7.16273 13.3877 7.36539 13.3075 7.54377C13.2272 7.72215 13.0805 7.86213 12.8985 7.93386C12.7166 8.0056 12.5138 8.00342 12.3334 7.92779C12.1531 7.85216 12.0094 7.70906 11.933 7.529C11.8376 7.30438 11.6831 7.10982 11.486 6.966C11.2658 6.79964 11.016 6.67647 10.75 6.603V9.3C11.448 9.393 12.133 9.62 12.709 9.996C13.496 10.51 13.999 11.266 13.999 12.126C13.999 12.986 13.495 13.742 12.709 14.256C12.133 14.633 11.448 14.859 10.749 14.952V15.251C10.749 15.4499 10.67 15.6407 10.5293 15.7813C10.3887 15.922 10.1979 16.001 9.999 16.001C9.80009 16.001 9.60932 15.922 9.46867 15.7813C9.32802 15.6407 9.249 15.4499 9.249 15.251V14.951C8.552 14.859 7.867 14.633 7.291 14.256C6.809 13.941 6.434 13.539 6.213 13.068C6.12866 12.8878 6.11937 12.6814 6.18716 12.4944C6.25496 12.3073 6.39429 12.1548 6.5745 12.0705C6.75471 11.9862 6.96105 11.9769 7.14812 12.0447C7.33519 12.1125 7.48766 12.2518 7.572 12.432C7.652 12.605 7.817 12.808 8.112 13.001C8.425 13.206 8.818 13.354 9.25 13.433V10.685C8.64964 10.5838 8.08258 10.3393 7.597 9.972C6.9 9.433 6.5 8.681 6.5 7.875C6.5 7.07 6.9 6.317 7.597 5.779C8.08254 5.41168 8.64962 5.16708 9.25 5.066V4.75C9.25 4.55109 9.32902 4.36032 9.46967 4.21967C9.61032 4.07902 9.80109 4 10 4Z"
                              fill="white"
                              fill-opacity="0.5"
                            />
                          </svg>
                          Revenue
                        </div>
                      </th>
                      <th className="text-left p-4">
                        <div className="flex items-center gap-x-2">
                          <svg
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M3.64599 6.09301C3.24067 6.22113 2.8867 6.47506 2.63546 6.81797C2.38423 7.16087 2.24878 7.57491 2.24878 8.00001C2.24878 8.4251 2.38423 8.83914 2.63546 9.18204C2.8867 9.52495 3.24067 9.77888 3.64599 9.907C3.44992 10.2842 3.37915 10.7141 3.44395 11.1343C3.50875 11.5544 3.70575 11.943 4.00636 12.2436C4.30698 12.5442 4.69556 12.7413 5.11573 12.8061C5.53589 12.8709 5.96578 12.8001 6.34299 12.604C6.47111 13.0093 6.72505 13.3633 7.06796 13.6145C7.41086 13.8658 7.8249 14.0012 8.24999 14.0012C8.67509 14.0012 9.08913 13.8658 9.43203 13.6145C9.77494 13.3633 10.0289 13.0093 10.157 12.604C10.5343 12.7997 10.964 12.8702 11.3841 12.8053C11.8041 12.7404 12.1925 12.5434 12.4931 12.243C12.7937 11.9425 12.9908 11.5541 13.0558 11.1341C13.1209 10.7141 13.0506 10.2843 12.855 9.907C13.2603 9.77878 13.6142 9.52475 13.8653 9.18178C14.1165 8.83881 14.2518 8.42473 14.2517 7.99964C14.2516 7.57454 14.116 7.16054 13.8647 6.8177C13.6134 6.47486 13.2594 6.22102 12.854 6.09301C13.0497 5.71574 13.1202 5.28597 13.0553 4.86595C12.9904 4.44593 12.7934 4.05748 12.493 3.75691C12.1925 3.45633 11.8041 3.25922 11.3841 3.19415C10.9641 3.12909 10.5343 3.19943 10.157 3.39501C10.0288 2.98971 9.77474 2.63582 9.43177 2.38467C9.08879 2.13352 8.67472 1.99818 8.24963 1.99829C7.82453 1.9984 7.41053 2.13396 7.06769 2.38529C6.72485 2.63661 6.47101 2.99064 6.34299 3.39601C5.96578 3.19993 5.53589 3.12916 5.11573 3.19396C4.69556 3.25876 4.30698 3.45576 4.00636 3.75638C3.70575 4.05699 3.50875 4.44558 3.44395 4.86574C3.37915 5.28591 3.44992 5.71579 3.64599 6.09301ZM6.24999 7.00001C6.51521 7.00001 6.76956 6.89465 6.9571 6.70711C7.14464 6.51958 7.24999 6.26522 7.24999 6.00001C7.24999 5.73479 7.14464 5.48044 6.9571 5.2929C6.76956 5.10536 6.51521 5.00001 6.24999 5.00001C5.98478 5.00001 5.73042 5.10536 5.54289 5.2929C5.35535 5.48044 5.24999 5.73479 5.24999 6.00001C5.24999 6.26522 5.35535 6.51958 5.54289 6.70711C5.73042 6.89465 5.98478 7.00001 6.24999 7.00001ZM9.71999 5.47001C9.78866 5.39632 9.87146 5.33722 9.96346 5.29622C10.0555 5.25523 10.1548 5.23319 10.2555 5.23141C10.3562 5.22964 10.4562 5.24816 10.5496 5.28588C10.643 5.3236 10.7278 5.37975 10.799 5.45097C10.8702 5.52219 10.9264 5.60702 10.9641 5.70041C11.0018 5.7938 11.0204 5.89383 11.0186 5.99453C11.0168 6.09523 10.9948 6.19454 10.9538 6.28654C10.9128 6.37854 10.8537 6.46134 10.78 6.53001L6.77999 10.53C6.71133 10.6037 6.62853 10.6628 6.53653 10.7038C6.44453 10.7448 6.34522 10.7668 6.24452 10.7686C6.14381 10.7704 6.04378 10.7518 5.9504 10.7141C5.85701 10.6764 5.77217 10.6203 5.70095 10.549C5.62974 10.4778 5.57359 10.393 5.53587 10.2996C5.49815 10.2062 5.47963 10.1062 5.4814 10.0055C5.48318 9.90478 5.50522 9.80547 5.54621 9.71347C5.5872 9.62147 5.64631 9.53867 5.71999 9.47001L9.71999 5.47001ZM11.25 10C11.25 10.2652 11.1446 10.5196 10.9571 10.7071C10.7696 10.8946 10.5152 11 10.25 11C9.98478 11 9.73042 10.8946 9.54289 10.7071C9.35535 10.5196 9.24999 10.2652 9.24999 10C9.24999 9.73479 9.35535 9.48043 9.54289 9.2929C9.73042 9.10536 9.98478 9.00001 10.25 9.00001C10.5152 9.00001 10.7696 9.10536 10.9571 9.2929C11.1446 9.48043 11.25 9.73479 11.25 10Z"
                              fill="white"
                              fill-opacity="0.5"
                            />
                          </svg>
                          Conversion{" "}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsData.map((event) => {
                      const totalTickets =
                        (soldTickets[event._id] || 0) +
                        (remainCount[event._id] || 0);
                      const conversionRate =
                        totalTickets > 0
                          ? ((soldTickets[event._id] || 0) / totalTickets) * 100
                          : 0;

                      return (
                        <tr
                          key={event._id}
                          className="border-b border-white/5 text-white/70 hover:bg-white/[0.02]"
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-white/5 mr-3 flex items-center justify-center">
                                {event.flyer ? (
                                  <img
                                    src={event.flyer}
                                    alt={event.event_name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
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
                                  >
                                    <rect
                                      width="18"
                                      height="18"
                                      x="3"
                                      y="3"
                                      rx="2"
                                      ry="2"
                                    />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                  </svg>
                                )}
                              </div>
                              <span className="font-medium text-white">
                                {event.event_name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            {numberFormatter(viewsCount[event._id] || 0)}
                          </td>
                          <td className="p-4">
                            {numberFormatter(ticketSalesData[event._id] || 0)}
                          </td>
                          <td className="p-4">
                            {revenueDataByEvent[event._id]
                              ? `$${Number(
                                  revenueDataByEvent[event._id]
                                ).toLocaleString()}`
                              : "$0.00"}
                          </td>
                          <td className="p-4">
                            {(() => {
                              const views = viewsCount[event._id] || 0;
                              const sales = ticketSalesData[event._id] || 0;
                              const conversionRate =
                                views > 0 ? (sales / views) * 100 : 0;
                              return <span>{conversionRate.toFixed(2)}%</span>;
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default OrganizerAnalytics;
