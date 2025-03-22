import React, { useState, useEffect } from "react";
import axios from "axios";
import url from "../../constants/url";
import { Spin } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";

// TrafficSources Component
function TrafficSources({ eventId }) {
  const [visitData, setVisitData] = useState("");
  const [setError] = useState(null);

  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        const response = await fetch(`${url}/visit/get-visit/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch visit data");
        }
        const data = await response.json();
        setVisitData(data.data?.count);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchVisitData();
  }, [eventId]);

  const trafficData = [
    { name: "Direct", value: Number(visitData), fill: "#42bdf5" },
    { name: "Social Media", value: 1200, fill: "#9442f5" },
    { name: "Search", value: 600, fill: "#f54242" },
    { name: "Referrals", value: 258, fill: "#42f5a4" },
  ];

  const totalVisits = trafficData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111] p-2 border border-white/10 rounded">
          <p className="text-white text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
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
        strokeWidth={(outerRadius - innerRadius) * 0.65}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  return (
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
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
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
                shape={<CustomizedShape />}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false}
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
                            {totalVisits}
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
  );
}

// TicketSales Component
function TicketSales({ eventId }) {
  const [remain, setRemain] = useState([]);

  useEffect(() => {
    const fetchRemainEvent = async () => {
      try {
        const response = await axios.get(`${url}/remain-tickets/${eventId}`);
        if (response.data) {
          const formattedData = response.data.map((item) => ({
            ...item,
            fill: getRandomColor(),
          }));
          setRemain(formattedData);
        }
      } catch (error) {
        console.error("Error fetching remain events:", error);
      }
    };

    if (eventId) {
      fetchRemainEvent();
    }
  }, [eventId]);

  const getRandomColor = () => {
    const colors = ["#b7f542", "#f54242", "#f59942", "#42bdf5", "#9442f5"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const totalSales = remain.reduce((acc, item) => acc + item.tickets_sold, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111] p-2 border border-white/10 rounded">
          <p className="text-white text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
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
        strokeWidth={(outerRadius - innerRadius) * 0.65}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  return (
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
          {remain.map((item) => (
            <div
              key={item.ticket_name}
              className="flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.fill }}
                aria-hidden="true"
              />
              <span className="text-white text-sm">{item.ticket_name}</span>
              <span className="text-white/70 text-sm">{item.tickets_sold}</span>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
              <Pie
                data={remain}
                dataKey="tickets_sold"
                nameKey="ticket_name"
                cx="50%"
                cy="50%"
                innerRadius={105}
                outerRadius={115}
                strokeWidth={0}
                paddingAngle={3}
                shape={<CustomizedShape />}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false}
              >
                {remain.map((entry, index) => (
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
                            {totalSales}
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
  );
}

// ConversionFunnel Component
function ConversionFunnel() {
  const funnelData = [
    { stage: "Page views", value: 2489, percentage: 100, color: "#34B2DA" },
    { stage: "Added to cart", value: 1344, percentage: 54, color: "#E74C3C" },
    { stage: "Purchased", value: 36, percentage: 4.2, color: "#9B59B6" },
  ];

  return (
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
          <div key={index} className="mb-4">
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
  );
}

// BalanceChart Component
function BalanceChart({ eventId }) {
  const [activeTab, setActiveTab] = useState("Daily");
  const [book, setBook] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${url}/get-event-payment-list/${eventId}`
        );
        setBook(response.data);
        processData(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [eventId]);

  const processData = (bookings) => {
    let dailyMap = {};
    let weeklyMap = {};
    let total = 0;

    bookings.forEach((payout) => {
      if (!payout.transaction_id) return;

      const date = new Date(payout.date);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const week = `Week ${Math.ceil(date.getDate() / 7)}`;

      const payoutAmount =
        payout.tickets?.price * payout.count +
        (payout.tax ? parseFloat(payout.tax || 0) / 100 : 0);

      total += payoutAmount;
      dailyMap[day] = (dailyMap[day] || 0) + payoutAmount;
      weeklyMap[week] = (weeklyMap[week] || 0) + payoutAmount;
    });

    setDailyData(
      Object.entries(dailyMap).map(([date, Revenue]) => ({ date, Revenue }))
    );
    setWeeklyData(
      Object.entries(weeklyMap).map(([date, Revenue]) => ({ date, Revenue }))
    );
    setTotalAmount(total);
  };

  const data = activeTab === "Daily" ? dailyData : weeklyData;

  return (
    <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-white/60 text-sm">Balance</p>
            <p className="text-2xl font-semibold text-white">
              {loading ? (
                <Spin size="small" />
              ) : (
                `$${totalAmount.toLocaleString()}`
              )}
            </p>
          </div>
          <div className="flex space-x-2 bg-[#0F0F0F] rounded-full border border-white/10 p-2">
            <button
              onClick={() => setActiveTab("Daily")}
              className={`px-4 py-2 h-8 flex text-sm items-center border justify-center rounded-full ${
                activeTab === "Daily"
                  ? "bg-white/[0.03] text-white border-white/[0.03]"
                  : "border-transparent text-white/70"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab("Weekly")}
              className={`px-4 py-2 h-8 flex text-sm items-center border justify-center rounded-full ${
                activeTab === "Weekly"
                  ? "bg-white/[0.03] text-white border-white/[0.03]"
                  : "border-transparent text-white/70"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
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
              isAnimationActive={false}
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
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// PopularDays Component
function PopularDays() {
  const [hoveredDay, setHoveredDay] = useState(null);

  const popularDaysData = [
    { day: "Mon", visitors: 100 },
    { day: "Tue", visitors: 410 },
    { day: "Wed", visitors: 470 },
    { day: "Thu", visitors: 420 },
    { day: "Fri", visitors: 350 },
    { day: "Sat", visitors: 420 },
    { day: "Sun", visitors: 370 },
  ];

  const numberFormatter = (number) => {
    return new Intl.NumberFormat("en-US").format(number).toString();
  };

  return (
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
  );
}

// Main AnalyticsTab Component
export default function AnalyticsTab({ eventId }) {
  return (
    <div className="grid gap-6">
      <BalanceChart eventId={eventId} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrafficSources eventId={eventId} />
        <TicketSales eventId={eventId} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConversionFunnel />
        <PopularDays />
      </div>
    </div>
  );
}
