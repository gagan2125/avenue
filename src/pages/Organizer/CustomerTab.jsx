import { Ellipsis } from "lucide-react";
import {
    DirectionAwareMenu,
    MenuTrigger,
    MenuItem,
    MenuSeparator,
} from "../../components/ui/DirectionAwareMenu";
import { Dialog, DialogContent } from "../../components/ui/Dailog";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabTrigger } from "../../components/ui/Tabs";
import axios from "axios";
import url from "../../constants/url"
import { Spin } from 'antd';

const customers = [
    {
        id: 1,
        name: "Sarah Wilson",
        initial: "SW",
        tickets: 3,
        spent: 277,
        date: "Today 14:23",
        status: "pending",
        ticketDetails: [
            {
                type: "REGULAR PASS",
                quantity: 2,
                price: 39,
                description: "Standard admission after 11 PM",
                purchaseTime: "TODAY 14:23",
                status: "Pending check in",
            },
            {
                type: "VIP ACCESS",
                quantity: 1,
                price: 199,
                description: "Table service, priority entry, 4 person minimum",
                purchaseTime: "TODAY 13:30",
                status: null,
            },
        ],
    },
    {
        id: 2,
        name: "John Doe",
        initial: "JD",
        tickets: 1,
        spent: 99,
        date: "Today 12:30",
        status: "active",
        ticketDetails: [
            {
                type: "REGULAR PASS",
                quantity: 1,
                price: 99,
                description: "Standard admission",
                purchaseTime: "TODAY 12:30",
                status: null,
            },
        ],
    },
    {
        id: 3,
        name: "Mike Brown",
        initial: "MB",
        tickets: 0,
        spent: 0,
        date: "Yesterday",
        status: "active",
        ticketDetails: [],
    },
];

export default function CustomerTab({ eventId, event }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
    const [showCopyNotification, setShowCopyNotification] = useState(false);

    const [book, setBook] = useState([]);
    const [loading, setLoading] = useState(false)

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setShowCopyNotification(true);
        setTimeout(() => setShowCopyNotification(false), 3000);
    };

    const filteredCustomers = book.filter((customer) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            (customer.firstName?.toLowerCase() || "").includes(searchLower) ||
            ((((customer?.amount || 0) / 100) - 0.89) / 1.09).toString().includes(searchLower);

        return matchesSearch;
    });


    const pendingCustomers = customers.filter(
        (customer) => customer.status === "pending"
    );

    const customerPurchases = {};

    filteredCustomers.forEach((sale) => {
        const customerKey = sale.email || sale.firstName;
        if (!customerPurchases[customerKey]) {
            customerPurchases[customerKey] = { totalSpent: 0, count: 0 };
        }
        customerPurchases[customerKey].totalSpent += ((sale?.amount / 100) - 0.89) / 1.09;
        customerPurchases[customerKey].count += 1;
    });
    const totalCustomers = Object.keys(customerPurchases).length;
    const totalSpent = Object.values(customerPurchases).reduce((sum, customer) => sum + customer.totalSpent, 0);
    const averagePurchaseAmount = totalCustomers > 0 ? (totalSpent / filteredCustomers.length).toFixed(2) : 0;


    const statsData = [
        {
            title: "Total customers",
            amount: `${filteredCustomers.length}`,
            change: "+6%",
            isPositive: true,
            redirection: "/organizer/wallet",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                >
                    <path
                        d="M7.125 5.5H8V7.25H7.125C7.01009 7.25 6.89631 7.22737 6.79015 7.18339C6.68399 7.13942 6.58753 7.07497 6.50628 6.99372C6.42503 6.91247 6.36058 6.81601 6.31661 6.70985C6.27263 6.60369 6.25 6.48991 6.25 6.375C6.25 6.26009 6.27263 6.14631 6.31661 6.04015C6.36058 5.93399 6.42503 5.83753 6.50628 5.75628C6.58753 5.67503 6.68399 5.61058 6.79015 5.56661C6.89631 5.52263 7.01009 5.5 7.125 5.5ZM9.5 10.5V8.75H10.375C10.6071 8.75 10.8296 8.84219 10.9937 9.00628C11.1578 9.17038 11.25 9.39294 11.25 9.625C11.25 9.85706 11.1578 10.0796 10.9937 10.2437C10.8296 10.4078 10.6071 10.5 10.375 10.5H9.5Z"
                        fill="white"
                        fillOpacity="0.5"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.75 8C15.75 9.85652 15.0125 11.637 13.6997 12.9497C12.387 14.2625 10.6065 15 8.75 15C6.89348 15 5.11301 14.2625 3.80025 12.9497C2.4875 11.637 1.75 9.85652 1.75 8C1.75 6.14348 2.4875 4.36301 3.80025 3.05025C5.11301 1.7375 6.89348 1 8.75 1C10.6065 1 12.387 1.7375 13.6997 3.05025C15.0125 4.36301 15.75 6.14348 15.75 8ZM8 3.75C8 3.55109 8.07902 3.36032 8.21967 3.21967C8.36032 3.07902 8.55109 3 8.75 3C8.94891 3 9.13968 3.07902 9.28033 3.21967C9.42098 3.36032 9.5 3.55109 9.5 3.75V4H12C12.1989 4 12.3897 4.07902 12.5303 4.21967C12.671 4.36032 12.75 4.55109 12.75 4.75C12.75 4.94891 12.671 5.13968 12.5303 5.28033C12.3897 5.42098 12.1989 5.5 12 5.5H9.5V7.25H10.375C11.0049 7.25 11.609 7.50022 12.0544 7.94562C12.4998 8.39102 12.75 8.99511 12.75 9.625C12.75 10.2549 12.4998 10.859 12.0544 11.3044C11.609 11.7498 11.0049 12 10.375 12H9.5V12.25C9.5 12.4489 9.42098 12.6397 9.28033 12.7803C9.13968 12.921 8.94891 13 8.75 13C8.55109 13 8.36032 12.921 8.21967 12.7803C8.07902 12.6397 8 12.4489 8 12.25V12H5.5C5.30109 12 5.11032 11.921 4.96967 11.7803C4.82902 11.6397 4.75 11.4489 4.75 11.25C4.75 11.0511 4.82902 10.8603 4.96967 10.7197C5.11032 10.579 5.30109 10.5 5.5 10.5H8V8.75H7.125C6.49511 8.75 5.89102 8.49978 5.44562 8.05438C5.00022 7.60898 4.75 7.00489 4.75 6.375C4.75 5.74511 5.00022 5.14102 5.44562 4.69562C5.89102 4.25022 6.49511 4 7.125 4H8V3.75Z"
                        fill="white"
                        fillOpacity="0.5"
                    />
                </svg>
            ),
        },
        {
            title: "Checked in",
            amount: `${filteredCustomers.filter(event => event.qr_status === 'true').length}`,
            change: "-4%",
            isPositive: false,
            redirection: "",
            icon: (
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
                        fill="white"
                        fillOpacity="0.5"
                    />
                </svg>
            ),
        },
        {
            title: "Average per customer",
            amount: `$${averagePurchaseAmount}`,
            change: "+8%",
            isPositive: true,
            redirection: "/organizer/events",
            icon: (
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
                        fill="white"
                        fillOpacity="0.5"
                    />
                </svg>
            ),
        },
    ];

    const fetchBook = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/get-event-payment-list/${eventId}`);
            setBook(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBook()
    }, [eventId])

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

        return `${dayOfWeek}, ${day} ${month} ${hours}:${minutes} ${ampm}`;
    };


    return (
        <>
            {
                loading ? (
                    <>
                        <div className='text-center'>
                            <Spin size="default" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="@container grid gap-6 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {statsData.map((stat, index) => (
                                    <Link
                                        key={index}
                                        className={`p-4 rounded-xl border border-white/5 bg-opacity-5 backdrop-blur-sm cursor-default`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-start justify-between w-full">
                                                <div className="flex flex-col items-start gap-3">
                                                    <p className="text-gray-400 flex items-center">
                                                        <span>{stat.title}</span>
                                                        {
                                                            stat.title === "Revenue" || stat.title === "Currently Live" ? (
                                                                <span className="ml-1">
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
                                                                            d="M4.22007 11.78C4.07962 11.6394 4.00073 11.4488 4.00073 11.25C4.00073 11.0512 4.07962 10.8606 4.22007 10.72L9.44007 5.5H5.75007C5.55116 5.5 5.36039 5.42098 5.21974 5.28033C5.07909 5.13968 5.00007 4.94891 5.00007 4.75C5.00007 4.55109 5.07909 4.36032 5.21974 4.21967C5.36039 4.07902 5.55116 4 5.75007 4H11.2501C11.449 4 11.6398 4.07902 11.7804 4.21967C11.9211 4.36032 12.0001 4.55109 12.0001 4.75V10.25C12.0001 10.4489 11.9211 10.6397 11.7804 10.7803C11.6398 10.921 11.449 11 11.2501 11C11.0512 11 10.8604 10.921 10.7197 10.7803C10.5791 10.6397 10.5001 10.4489 10.5001 10.25V6.56L5.28007 11.78C5.13945 11.9205 4.94882 11.9993 4.75007 11.9993C4.55132 11.9993 4.3607 11.9205 4.22007 11.78Z"
                                                                            fill="white"
                                                                            fillOpacity="0.5"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                            ) : (
                                                                ""
                                                            )
                                                        }
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-2xl font-bold">{stat.amount}</p>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
                                                    {stat.icon}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="overflow-hidden">
                                <Tabs>
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col @4xl:flex-row gap-4 items-start @4xl:items-center justify-between">
                                            <TabsList className="md:bg-white/5 md:px-1 @4xl:rounded-full">
                                                <TabTrigger
                                                    value="all"
                                                    onClick={() => setActiveTab("all")}
                                                    className={`flex items-center gap-2 p-2 pl-3 pr-1 @4xl:rounded-full hover:bg-[#0F0F0F] ${activeTab === "all" ? "bg-[#0F0F0F]" : ""
                                                        }`}
                                                >
                                                    All customers{" "}
                                                    <span className="bg-[#1B1B1B] border border-white/[0.03] h-6 w-fit px-2 rounded-full flex items-center justify-center">
                                                        {book.length}
                                                    </span>
                                                </TabTrigger>
                                                <TabTrigger
                                                    value="pending"
                                                    onClick={() => setActiveTab("pending")}
                                                    className={`flex items-center gap-2 p-2 pl-3 pr-1 @4xl:rounded-full hover:bg-[#0F0F0F] ${activeTab === "pending" ? "bg-[#0F0F0F]" : ""
                                                        }`}
                                                >
                                                    Pending{" "}
                                                    <span className="bg-[#1B1B1B] border border-white/[0.03] h-6 w-fit px-2 rounded-full flex items-center justify-center">
                                                        {book.filter(bok => bok.qr_status === 'false').length}
                                                    </span>
                                                </TabTrigger>
                                            </TabsList>
                                            <div className="relative w-full @4xl:w-fit">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                                                        className="text-white/40"
                                                    >
                                                        <circle cx="11" cy="11" r="8" />
                                                        <path d="m21 21-4.3-4.3" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Search customers..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="bg-white/5 border border-white/10 text-white rounded-full pl-10 pr-4 py-2 @4xl:w-[300px] focus:outline-none focus:ring-2 focus:ring-white/10 text-sm w-full"
                                                />
                                            </div>
                                        </div>

                                        {
                                            activeTab === 'pending' ? (
                                                <div className="border rounded-xl border-white/10 overflow-hidden">
                                                    <div className="overflow-x-auto w-full">
                                                        <table className="w-full text-sm border-collapse">
                                                            <thead>
                                                                <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:min-w-[220px] last:[&>th]:min-w-fit [&>th]:border-r [&>th]:border-white/10 last:[&>th]:border-r-0">
                                                                    <th className="text-left p-4">Customer</th>
                                                                    <th className="text-left p-4">Total tickets</th>
                                                                    <th className="text-left p-4">Total spent</th>
                                                                    <th className="text-left p-4">Purchased at</th>
                                                                    <th className="text-left p-4">Status</th>
                                                                    <th className="py-4 px-4 sticky right-0 flex items-center justify-center">
                                                                        {" "}
                                                                        <div className="bg-white/5 sticky right-0 z-0 backdrop-blur-sm border-l border-white/5 h-10 w-10 flex items-center justify-center rounded-md">
                                                                            <Ellipsis />
                                                                        </div>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filteredCustomers.slice().reverse().filter(cus => cus.qr_status === 'false').map((customer) => (
                                                                    <tr
                                                                        key={customer._id}
                                                                        className="border-b last:border-b-0 border-white/10 hover:bg-white/[2.5%] cursor-pointer transition-colors [&>td]:border-r [&>td]:border-white/10 last:[&>td]:border-r-0"
                                                                    >
                                                                        <td className="py-4 pl-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                                                                                    {customer.firstName.slice(0, 2).toUpperCase()}
                                                                                </div>
                                                                                <span>{customer.firstName}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-4 px-4">
                                                                            <div className="flex items-center gap-2 w-full justify-between">
                                                                                {customer.count} x tickets
                                                                                {/* {customer.status === "pending" && (
                                                            <span className="border border-white/[0.03] bg-white/10 text-white/70 font-medium text-xs px-2 py-1 rounded-full flex items-center gap-2">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="12"
                                                                    height="12"
                                                                    viewBox="0 0 12 12"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 7.5913 11.3679 9.11742 10.2426 10.2426C9.11742 11.3679 7.5913 12 6 12C4.4087 12 2.88258 11.3679 1.75736 10.2426C0.632141 9.11742 0 7.5913 0 6ZM6.64286 2.35714C6.64286 2.18665 6.57513 2.02313 6.45457 1.90257C6.33401 1.78202 6.1705 1.71429 6 1.71429C5.8295 1.71429 5.66599 1.78202 5.54543 1.90257C5.42487 2.02313 5.35714 2.18665 5.35714 2.35714V6C5.35714 6.35486 5.64514 6.64286 6 6.64286H8.78571C8.95621 6.64286 9.11972 6.57513 9.24028 6.45457C9.36084 6.33401 9.42857 6.1705 9.42857 6C9.42857 5.8295 9.36084 5.66599 9.24028 5.54543C9.11972 5.42487 8.95621 5.35714 8.78571 5.35714H6.64286V2.35714Z"
                                                                        fill="white"
                                                                        fillOpacity="0.5"
                                                                    />
                                                                </svg>
                                                                PENDING
                                                            </span>
                                                        )} */}
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-4 pl-4">${(((customer.amount / 100) - 0.89) / 1.09).toLocaleString("en-US", {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        })}</td>
                                                                        <td className="py-4 pl-4">{formatDate(customer.date)}</td>
                                                                        <td className="py-4 pl-4">
                                                                            {
                                                                                customer.qr_status === 'false' ?
                                                                                    <p>Check in</p> :
                                                                                    <p className="text-green-500">Checked in</p>
                                                                            }
                                                                        </td>
                                                                        <td className="py-4 sticky right-0 flex items-center justify-center">
                                                                            <div className="bg-white/5 sticky right-0 z-0 backdrop-blur-sm border-l border-white/5 h-10 w-10 flex items-center justify-center rounded-md">
                                                                                <DirectionAwareMenu>
                                                                                    <MenuTrigger>
                                                                                        <Ellipsis />
                                                                                    </MenuTrigger>
                                                                                    <MenuItem
                                                                                        onClick={() => {
                                                                                            setSelectedCustomer(customer);
                                                                                            setTicketDialogOpen(true);
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
                                                                                            <span>View Details</span>
                                                                                        </div>
                                                                                    </MenuItem>
                                                                                </DirectionAwareMenu>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                {filteredCustomers.length === 0 && (
                                                                    <tr>
                                                                        <td
                                                                            colSpan="5"
                                                                            className="text-center py-8 text-white/60"
                                                                        >
                                                                            {searchQuery
                                                                                ? "No customers found matching your search"
                                                                                : "No customers found"}
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="border rounded-xl border-white/10 overflow-hidden">
                                                    <div className="overflow-x-auto w-full">
                                                        <table className="w-full text-sm border-collapse">
                                                            <thead>
                                                                <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:min-w-[220px] last:[&>th]:min-w-fit [&>th]:border-r [&>th]:border-white/10 last:[&>th]:border-r-0">
                                                                    <th className="text-left p-4">Customer</th>
                                                                    <th className="text-left p-4">Total tickets</th>
                                                                    <th className="text-left p-4">Total spent</th>
                                                                    <th className="text-left p-4">Purchased at</th>
                                                                    <th className="text-left p-4">Status</th>
                                                                    <th className="py-4 px-4 sticky right-0 flex items-center justify-center">
                                                                        {" "}
                                                                        <div className="bg-white/5 sticky right-0 z-0 backdrop-blur-sm border-l border-white/5 h-10 w-10 flex items-center justify-center rounded-md">
                                                                            <Ellipsis />
                                                                        </div>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filteredCustomers.slice().reverse().map((customer) => (
                                                                    <tr
                                                                        key={customer._id}
                                                                        className="border-b last:border-b-0 border-white/10 hover:bg-white/[2.5%] cursor-pointer transition-colors [&>td]:border-r [&>td]:border-white/10 last:[&>td]:border-r-0"
                                                                    >
                                                                        <td className="py-4 pl-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                                                                                    {(customer.firstName || "Complimentary").slice(0, 2).toUpperCase()}
                                                                                </div>

                                                                                <span>{customer.firstName ? customer.firstName : "Complimentary"}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-4 px-4">
                                                                            <div className="flex items-center gap-2 w-full justify-between">
                                                                                {customer.count} x tickets
                                                                                {/* {customer.status === "pending" && (
                                                                                    <span className="border border-white/[0.03] bg-white/10 text-white/70 font-medium text-xs px-2 py-1 rounded-full flex items-center gap-2">
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            width="12"
                                                                                            height="12"
                                                                                            viewBox="0 0 12 12"
                                                                                            fill="none"
                                                                                        >
                                                                                            <path
                                                                                                fillRule="evenodd"
                                                                                                clipRule="evenodd"
                                                                                                d="M0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 7.5913 11.3679 9.11742 10.2426 10.2426C9.11742 11.3679 7.5913 12 6 12C4.4087 12 2.88258 11.3679 1.75736 10.2426C0.632141 9.11742 0 7.5913 0 6ZM6.64286 2.35714C6.64286 2.18665 6.57513 2.02313 6.45457 1.90257C6.33401 1.78202 6.1705 1.71429 6 1.71429C5.8295 1.71429 5.66599 1.78202 5.54543 1.90257C5.42487 2.02313 5.35714 2.18665 5.35714 2.35714V6C5.35714 6.35486 5.64514 6.64286 6 6.64286H8.78571C8.95621 6.64286 9.11972 6.57513 9.24028 6.45457C9.36084 6.33401 9.42857 6.1705 9.42857 6C9.42857 5.8295 9.36084 5.66599 9.24028 5.54543C9.11972 5.42487 8.95621 5.35714 8.78571 5.35714H6.64286V2.35714Z"
                                                                                                fill="white"
                                                                                                fillOpacity="0.5"
                                                                                            />
                                                                                        </svg>
                                                                                        PENDING
                                                                                    </span>
                                                                                )} */}
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-4 pl-4">${customer.transaction_id ? (((customer.amount / 100) - 0.89) / 1.09).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                                        <td className="py-4 pl-4">{formatDate(customer.date)}</td>
                                                                        <td className="py-4 pl-4">
                                                                            {
                                                                                customer.qr_status === 'false' ?
                                                                                    <p>Check in</p> :
                                                                                    <p className="text-green-500">Checked in</p>
                                                                            }
                                                                        </td>
                                                                        <td className="py-4 sticky right-0 flex items-center justify-center">
                                                                            <div className="bg-white/5 sticky right-0 z-0 backdrop-blur-sm border-l border-white/5 h-10 w-10 flex items-center justify-center rounded-md">
                                                                                <DirectionAwareMenu>
                                                                                    <MenuTrigger>
                                                                                        <Ellipsis />
                                                                                    </MenuTrigger>
                                                                                    <MenuItem
                                                                                        onClick={() => {
                                                                                            setSelectedCustomer(customer);
                                                                                            setTicketDialogOpen(true);
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
                                                                                            <span>View Details</span>
                                                                                        </div>
                                                                                    </MenuItem>
                                                                                </DirectionAwareMenu>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                {filteredCustomers.length === 0 && (
                                                                    <tr>
                                                                        <td
                                                                            colSpan="5"
                                                                            className="text-center py-8 text-white/60"
                                                                        >
                                                                            {searchQuery
                                                                                ? "No customers found matching your search"
                                                                                : "No customers found"}
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </Tabs>
                            </div>

                            <Dialog
                                open={ticketDialogOpen}
                                onOpenChange={setTicketDialogOpen}
                                className="!max-w-[400px] border border-white/10 rounded-xl !p-0 overflow-hidden"
                            >
                                <DialogContent className="max-h-[90vh] overflow-y-auto hide-scrollbar !gap-0 ">
                                    <div className="flex flex-col p-6">
                                        <div className="flex flex-col gap-6">
                                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-sm">
                                                {selectedCustomer?.initial}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <h3 className="font-medium text-lg">
                                                    {selectedCustomer?.name}&apos;s tickets
                                                </h3>
                                                <p className="text-white/60">
                                                    {selectedCustomer?.tickets} tickets total
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 p-4 pt-0">
                                        {selectedCustomer?.ticketDetails.length > 0 ? (
                                            <div className="flex flex-col gap-4">
                                                {selectedCustomer.ticketDetails.map((ticket, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex flex-col bg-white/[0.03] border border-white/[0.03] rounded-lg overflow-hidden"
                                                    >
                                                        <div className="flex items-center justify-between w-full gap-2 border-b-2 border-[#0F0F0F] border-dashed p-4">
                                                            <span className="text-xs text-white/60">
                                                                {ticket.type}
                                                            </span>
                                                            <span className="text-xs text-white/60">
                                                                {ticket.purchaseTime}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col gap-2 p-6">
                                                            <div className="text-lg">
                                                                <span className="text-white/60">$</span> {ticket.price}{" "}
                                                                <span className="text-white/60">×</span>{" "}
                                                                {ticket.quantity}
                                                            </div>
                                                            <p className="text-sm text-white/60">
                                                                {ticket.description}
                                                            </p>
                                                        </div>
                                                        {ticket.status && (
                                                            <div className="bg-[#0F0F0F] border-t border-white/[0.03] p-2 px-3 flex items-center justify-start gap-2">
                                                                <span className="text-xs text-white/60 flex items-center gap-2">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="14"
                                                                        height="14"
                                                                        viewBox="0 0 14 14"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            clipRule="evenodd"
                                                                            d="M0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7ZM7.75 2.75C7.75 2.55109 7.67098 2.36032 7.53033 2.21967C7.38968 2.07902 7.19891 2 7 2C6.80109 2 6.61032 2.07902 6.46967 2.21967C6.32902 2.36032 6.25 2.55109 6.25 2.75V7C6.25 7.414 6.586 7.75 7 7.75H10.25C10.4489 7.75 10.6397 7.67098 10.7803 7.53033C10.921 7.38968 11 7.19891 11 7C11 6.80109 10.921 6.61032 10.7803 6.46967C10.6397 6.32902 10.4489 6.25 10.25 6.25H7.75V2.75Z"
                                                                            fill="white"
                                                                            fillOpacity="0.5"
                                                                        />
                                                                    </svg>
                                                                    {ticket.status}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-white/60 border-2 border-dashed border-white/5 text-sm rounded-lg p-4">
                                                No tickets found for this customer
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {showCopyNotification && (
                                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 backdrop-blur-md text-white p-2 pl-3 rounded-lg flex items-center gap-2 border border-white/10 shadow-lg max-w-[400px] w-full justify-between">
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
                                        <p className="text-sm">Event link copied</p>
                                    </div>
                                    <button
                                        onClick={() => setShowCopyNotification(false)}
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
                                </div>
                            )}
                        </div>
                    </>
                )
            }
        </>
    );
}