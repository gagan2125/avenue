import { Ellipsis } from "lucide-react";
import {
    DirectionAwareMenu,
    MenuTrigger,
    MenuItem,
    MenuSeparator,
} from "../../components/ui/DirectionAwareMenu";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "../../components/ui/Dailog";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import url from "../../constants/url"
import { Spin } from 'antd';

const statusIcons = {
    active: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.16602 14C9.02253 14 10.803 13.2625 12.1158 11.9497C13.4285 10.637 14.166 8.85652 14.166 7C14.166 5.14348 13.4285 3.36301 12.1158 2.05025C10.803 0.737498 9.02253 0 7.16602 0C5.3095 0 3.52902 0.737498 2.21627 2.05025C0.903513 3.36301 0.166016 5.14348 0.166016 7C0.166016 8.85652 0.903513 10.637 2.21627 11.9497C3.52902 13.2625 5.3095 14 7.16602 14ZM11.01 5.209C11.1318 5.05146 11.1859 4.85202 11.1606 4.65454C11.1353 4.45706 11.0326 4.27773 10.875 4.156C10.7175 4.03427 10.518 3.9801 10.3206 4.00542C10.1231 4.03073 9.94375 4.13346 9.82202 4.291L6.12202 9.081L4.47302 7.248C4.40776 7.17247 4.32809 7.11073 4.23866 7.06639C4.14924 7.02205 4.05186 6.99601 3.95224 6.98978C3.85262 6.98356 3.75276 6.99729 3.65851 7.03016C3.56427 7.06303 3.47753 7.11438 3.40338 7.1812C3.32924 7.24803 3.26918 7.32898 3.22672 7.41931C3.18427 7.50965 3.16027 7.60755 3.15614 7.70728C3.152 7.807 3.16782 7.90656 3.20266 8.00009C3.2375 8.09363 3.29065 8.17927 3.35902 8.252L5.60902 10.752C5.6825 10.8335 5.77299 10.8979 5.87407 10.9406C5.97516 10.9833 6.0844 11.0034 6.19406 10.9993C6.30373 10.9952 6.41117 10.967 6.50878 10.9169C6.6064 10.8667 6.69182 10.7958 6.75902 10.709L11.01 5.209Z"
                fill="#10B981"
            />
        </svg>
    ),
    paused: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
        >
            <path
                d="M4.66602 2C4.53341 2 4.40623 2.05268 4.31246 2.14645C4.21869 2.24021 4.16602 2.36739 4.16602 2.5V13.5C4.16602 13.6326 4.21869 13.7598 4.31246 13.8536C4.40623 13.9473 4.53341 14 4.66602 14H5.66602C5.79862 14 5.9258 13.9473 6.01957 13.8536C6.11334 13.7598 6.16602 13.6326 6.16602 13.5V2.5C6.16602 2.36739 6.11334 2.24021 6.01957 2.14645C5.9258 2.05268 5.79862 2 5.66602 2H4.66602ZM10.666 2C10.5334 2 10.4062 2.05268 10.3125 2.14645C10.2187 2.24021 10.166 2.36739 10.166 2.5V13.5C10.166 13.6326 10.2187 13.7598 10.3125 13.8536C10.4062 13.9473 10.5334 14 10.666 14H11.666C11.7986 14 11.9258 13.9473 12.0196 13.8536C12.1133 13.7598 12.166 13.6326 12.166 13.5V2.5C12.166 2.36739 12.1133 2.24021 12.0196 2.14645C11.9258 2.05268 11.7986 2 11.666 2H10.666Z"
                fill="white"
                fillOpacity="0.4"
            />
        </svg>
    ),
};

const discountCodes = [
    {
        code: "EARLYBIRD",
        discount: "-10%",
        uses: 89,
        revenue: "$4,890",
        revenuePercentage: 12,
        status: "active",
    },
    {
        code: "SUMMER20",
        discount: "-20$",
        uses: 45,
        revenue: "$2,340",
        revenuePercentage: 8,
        status: "active",
    },
    {
        code: "LAUNCH",
        discount: "-30%",
        uses: 156,
        revenue: "$8,450",
        revenuePercentage: 24,
        status: "paused",
    },
    {
        code: "VIP50",
        discount: "-$50",
        uses: 23,
        revenue: "$3,890",
        revenuePercentage: 6,
        status: "active",
    },
];

export default function PromosTab({ eventId }) {
    const [addPromoDialogOpen, setAddPromoDialogOpen] = useState(false);
    const [editPromoDialogOpen, setEditPromoDialogOpen] = useState(false);
    const [pausePromoDialogOpen, setPausePromoDialogOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [promoCode, setPromoCode] = useState("");
    const [discountType, setDiscountType] = useState("percentage");
    const [discountAmount, setDiscountAmount] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    // Add new state for delete dialog
    const [deletePromoDialogOpen, setDeletePromoDialogOpen] = useState(false);

    const [promos, setPromos] = useState([])
    const [loading, setLoading] = useState(false)

    // Filter discount codes based on search query
    const filteredDiscountCodes = discountCodes.filter((code) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            code.code.toLowerCase().includes(searchLower) ||
            code.discount.toLowerCase().includes(searchLower) ||
            code.uses.toString().includes(searchLower) ||
            code.revenue.toLowerCase().includes(searchLower) ||
            code.revenuePercentage.toString().includes(searchLower) ||
            code.status.toLowerCase().includes(searchLower)
        );
    });

    const handleAddPromo = () => {
        // Add your logic to handle the new promo code
        console.log({
            code: promoCode,
            discount:
                discountType === "percentage"
                    ? `-${discountAmount}%`
                    : `-$${discountAmount}`,
            uses: 0,
            revenue: "$0",
            revenuePercentage: 0,
            status: "active",
        });

        // Reset form and close dialog
        setPromoCode("");
        setDiscountType("percentage");
        setDiscountAmount("");
        setAddPromoDialogOpen(false);
    };

    const handleEditClick = (promo) => {
        setSelectedPromo(promo);
        setPromoCode(promo.code);
        setDiscountType(promo.discount.includes("%") ? "percentage" : "fixed");
        setDiscountAmount(promo.discount.replace(/[^0-9]/g, ""));
        setEditPromoDialogOpen(true);
    };

    const handleEditPromo = () => {
        // Add your logic to handle editing the promo code
        console.log({
            code: promoCode,
            discount:
                discountType === "percentage"
                    ? `-${discountAmount}%`
                    : `-$${discountAmount}`,
            uses: selectedPromo.uses,
            revenue: selectedPromo.revenue,
            revenuePercentage: selectedPromo.revenuePercentage,
            status: selectedPromo.status,
        });

        // Reset form and close dialog
        setPromoCode("");
        setDiscountType("percentage");
        setDiscountAmount("");
        setSelectedPromo(null);
        setEditPromoDialogOpen(false);
    };

    const handlePauseClick = (promo) => {
        setSelectedPromo(promo);
        setPausePromoDialogOpen(true);
    };

    const confirmPause = () => {
        // Add your logic to handle pausing the promo code
        console.log("Pausing promo code:", selectedPromo);
        setPausePromoDialogOpen(false);
        setSelectedPromo(null);
    };

    const handleDeleteClick = (promo) => {
        setSelectedPromo(promo);
        setDeletePromoDialogOpen(true);
    };

    const confirmDelete = () => {
        // Add your logic to handle deleting the promo code
        console.log("Deleting promo code:", selectedPromo);
        setDeletePromoDialogOpen(false);
        setSelectedPromo(null);
    };

    const statsData = [
        {
            title: "Total promo codes",
            amount: `${promos.length || 0}`,
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
            title: "Total revenue",
            amount: `$0.00`,
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
            title: "% of event revenue",
            amount: `0%`,
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

    const fetchPromos = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/promo/get-promo/${eventId}`);
            setPromos(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchPromos();
    }, [eventId]);


    return (
        <>
            {
                loading ? (
                    <div className='text-center'>
                        <Spin size="default" />
                    </div>
                ) : (
                    <div className="@container grid gap-6">
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
                        </div >
                        <div className="flex flex-col @4xl:flex-row w-full justify-between gap-4">
                            <button
                                onClick={() => setAddPromoDialogOpen(true)}
                                className="border w-fit border-white/10 hover:bg-white/10 h-10 text-white rounded-full px-4 py-2 font-medium text-sm flex items-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M8 3.5V12.5M12.5 8H3.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Add promo code
                            </button>
                            <div className="relative w-full @4xl:w-fit flex justify-end h-fit">
                                <input
                                    type="text"
                                    placeholder="Search promo codes..."
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
                        <div className="border rounded-xl border-white/10 overflow-hidden">
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:min-w-[180px] last:[&>th]:min-w-fit">
                                            <th className="text-left p-4 border-r border-white/10">Code</th>
                                            <th className="text-left p-4 border-r border-white/10">
                                                Discount
                                            </th>
                                            <th className="text-left p-4 border-r border-white/10">Uses</th>
                                            <th className="text-left p-4 border-r border-white/10">
                                                Revenue
                                            </th>
                                            <th className="text-left p-4 border-r border-white/10">
                                                Revenue %
                                            </th>
                                            <th className="text-left p-4 border-r border-white/10">
                                                Status
                                            </th>
                                            <th className="py-4 px-4 sticky right-0 border-b border-white/10">
                                                {" "}
                                                <div className="bg-white/5 sticky right-0 z-0 backdrop-blur-sm border-l border-white/5 h-10 w-10 flex items-center justify-center rounded-md">
                                                    <Ellipsis />
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            promos.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="py-4 text-center text-gray-400">
                                                        No data found
                                                    </td>
                                                </tr>
                                            ) : (
                                                promos.map((code, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b last:border-b-0 border-white/10 [&_td]:font-medium hover:bg-white/[2.5%] cursor-pointer transition-colors"
                                                    >
                                                        <td className="py-4 pl-4 border-r border-white/10">
                                                            {code.code}
                                                        </td>
                                                        <td className="py-4 pl-4 border-r border-white/10">
                                                            {code.type === 'amount' ? "$" : ""} {code.amount} {code.type === 'percentage' ? "%" : ""}
                                                        </td>
                                                        <td className="py-4 pl-4 border-r border-white/10">
                                                            {0}
                                                        </td>
                                                        <td className="py-4 pl-4 border-r border-white/10">
                                                            ${0}
                                                        </td>
                                                        <td className="py-4 pl-4 border-r border-white/10">
                                                            {0}%
                                                        </td>
                                                        <td className="py-4 pl-4 border-r border-white/10">
                                                            <div className="flex items-center gap-2">
                                                                {/* {statusIcons[code.status]} */}
                                                                <span className="capitalize">Active</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 pl-4 sticky right-0">
                                                            <div className="bg-white/5 sticky right-0 z-0 backdrop-blur-sm border-l border-white/5 h-10 w-10 flex items-center justify-center rounded-md">
                                                                <DirectionAwareMenu>
                                                                    <MenuTrigger>
                                                                        <Ellipsis />
                                                                    </MenuTrigger>
                                                                    <MenuItem onClick={() => handleEditClick(code)}>
                                                                        <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="16"
                                                                                height="16"
                                                                                viewBox="0 0 16 16"
                                                                                fill="none"
                                                                            >
                                                                                <path
                                                                                    d="M13.4872 2.51263C13.3247 2.3501 13.1318 2.22118 12.9194 2.13323C12.7071 2.04527 12.4795 2 12.2497 2C12.0199 2 11.7923 2.04527 11.58 2.13323C11.3676 2.22118 11.1747 2.3501 11.0122 2.51263L6.74919 6.77363C6.49389 7.02895 6.29137 7.33205 6.15319 7.66563L5.30519 9.71263C5.24839 9.84968 5.23351 10.0005 5.26244 10.146C5.29137 10.2915 5.36281 10.4252 5.46772 10.5301C5.57262 10.635 5.70629 10.7064 5.8518 10.7354C5.99731 10.7643 6.14814 10.7494 6.28519 10.6926L8.33219 9.84463C8.66577 9.70644 8.96887 9.50392 9.22419 9.24863L13.4852 4.98663C13.8131 4.65847 13.9973 4.21354 13.9973 3.74963C13.9973 3.28571 13.8131 2.84078 13.4852 2.51263H13.4872Z"
                                                                                    fill="white"
                                                                                />
                                                                                <path
                                                                                    d="M4.75 3.5C4.06 3.5 3.5 4.06 3.5 4.75V11.25C3.5 11.94 4.06 12.5 4.75 12.5H11.25C11.94 12.5 12.5 11.94 12.5 11.25V9C12.5 8.80109 12.579 8.61032 12.7197 8.46967C12.8603 8.32902 13.0511 8.25 13.25 8.25C13.4489 8.25 13.6397 8.32902 13.7803 8.46967C13.921 8.61032 14 8.80109 14 9V11.25C14 11.9793 13.7103 12.6788 13.1945 13.1945C12.6788 13.7103 11.9793 14 11.25 14H4.75C4.02065 14 3.32118 13.7103 2.80546 13.1945C2.28973 12.6788 2 11.9793 2 11.25V4.75C2 4.02065 2.28973 3.32118 2.80546 2.80546C3.32118 2.28973 4.02065 2 4.75 2H7C7.19891 2 7.38968 2.07902 7.53033 2.21967C7.67098 2.36032 7.75 2.55109 7.75 2.75C7.75 2.94891 7.67098 3.13968 7.53033 3.28033C7.38968 3.42098 7.19891 3.5 7 3.5H4.75Z"
                                                                                    fill="white"
                                                                                />
                                                                            </svg>
                                                                            <span>Edit</span>
                                                                        </div>
                                                                    </MenuItem>
                                                                    <MenuSeparator />
                                                                    <MenuItem onClick={() => handlePauseClick(code)}>
                                                                        <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="16"
                                                                                height="16"
                                                                                viewBox="0 0 16 16"
                                                                                fill="none"
                                                                            >
                                                                                <path
                                                                                    d="M4.5 2C4.36739 2 4.24021 2.05268 4.14645 2.14645C4.05268 2.24021 4 2.36739 4 2.5V13.5C4 13.6326 4.05268 13.7598 4.14645 13.8536C4.24021 13.9473 4.36739 14 4.5 14H5.5C5.63261 14 5.75979 13.9473 5.85355 13.8536C5.94732 13.7598 6 13.6326 6 13.5V2.5C6 2.36739 5.94732 2.24021 5.85355 2.14645C5.75979 2.05268 5.63261 2 5.5 2H4.5ZM10.5 2C10.3674 2 10.2402 2.05268 10.1464 2.14645C10.0527 2.24021 10 2.36739 10 2.5V13.5C10 13.6326 10.0527 13.7598 10.1464 13.8536C10.2402 13.9473 10.3674 14 10.5 14H11.5C11.6326 14 11.7598 13.9473 11.8536 13.8536C11.9473 13.7598 12 13.6326 12 13.5V2.5C12 2.36739 11.9473 2.24021 11.8536 2.14645C11.7598 2.05268 11.6326 2 11.5 2H10.5Z"
                                                                                    fill="white"
                                                                                    fillOpacity="0.5"
                                                                                />
                                                                            </svg>
                                                                            Pause
                                                                        </div>
                                                                    </MenuItem>
                                                                    <MenuSeparator />
                                                                    <MenuItem onClick={() => handleDeleteClick(code)}>
                                                                        <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
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
                                                                                    d="M5 3.25V4H2.75C2.55109 4 2.36032 4.07902 2.21967 4.21967C2.07902 4.36032 2 4.55109 2 4.75C2 4.94891 2.07902 5.13968 2.21967 5.28033C2.36032 5.42098 2.55109 5.5 2.75 5.5H3.05L3.865 13.65C3.90218 14.0199 4.0754 14.3628 4.35107 14.6123C4.62675 14.8617 4.98523 14.9999 5.357 15H10.642C11.0139 15.0001 11.3727 14.8621 11.6486 14.6126C11.9244 14.3631 12.0978 14.0201 12.135 13.65L12.95 5.5H13.25C13.4489 5.5 13.6397 5.42098 13.7803 5.28033C13.921 5.13968 14 4.94891 14 4.75C14 4.55109 13.921 4.36032 13.7803 4.21967C13.6397 4.07902 13.4489 4 13.25 4H11V3.25C11 2.65326 10.7629 2.08097 10.341 1.65901C9.91903 1.23705 9.34674 1 8.75 1H7.25C6.65326 1 6.08097 1.23705 5.65901 1.65901C5.23705 2.08097 5 2.65326 5 3.25ZM7.25 2.5C7.05109 2.5 6.86032 2.57902 6.71967 2.71967C6.57902 2.86032 6.5 3.05109 6.5 3.25V4H9.5V3.25C9.5 3.05109 9.42098 2.86032 9.28033 2.71967C9.13968 2.57902 8.94891 2.5 8.75 2.5H7.25ZM6.05 6C6.14852 5.99502 6.24705 6.00952 6.33996 6.04268C6.43286 6.07584 6.51832 6.127 6.59142 6.19323C6.66453 6.25946 6.72385 6.33946 6.76599 6.42865C6.80813 6.51784 6.83226 6.61447 6.837 6.713L7.112 12.213C7.11933 12.4101 7.04872 12.6022 6.91546 12.7476C6.7822 12.893 6.59702 12.9801 6.40002 12.9899C6.20302 12.9998 6.01007 12.9317 5.86295 12.8003C5.71583 12.6689 5.62639 12.4849 5.614 12.288L5.339 6.788C5.33388 6.68956 5.34821 6.59107 5.38118 6.49818C5.41416 6.40528 5.46511 6.3198 5.53115 6.24661C5.59718 6.17343 5.677 6.11397 5.76603 6.07166C5.85506 6.02934 5.95155 6.00499 6.05 6ZM9.95 6C10.0484 6.00487 10.145 6.02909 10.234 6.07129C10.3231 6.11349 10.403 6.17283 10.4691 6.24592C10.5353 6.31901 10.5863 6.40442 10.6194 6.49726C10.6525 6.59011 10.667 6.68856 10.662 6.787L10.387 12.287C10.3746 12.4839 10.2852 12.6679 10.138 12.7993C9.99093 12.9307 9.79798 12.9988 9.60098 12.9889C9.40398 12.9791 9.2188 12.892 9.08554 12.7466C8.95228 12.6012 8.88167 12.4091 8.889 12.212L9.164 6.712C9.17409 6.51354 9.26253 6.32719 9.4099 6.19389C9.55727 6.06058 9.75152 5.99021 9.95 6Z"
                                                                                    fill="#F43F5E"
                                                                                />
                                                                            </svg>
                                                                            Delete
                                                                        </div>
                                                                    </MenuItem>
                                                                </DirectionAwareMenu>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <Dialog
                            open={addPromoDialogOpen}
                            onOpenChange={setAddPromoDialogOpen}
                            className="!max-w-[400px] border border-white/10 rounded-xl !p-0"
                        >
                            <DialogContent className="max-h-[90vh] !gap-0">
                                <div className="flex flex-col gap-y-2.5 bg-white/[0.03] border-b rounded-t-xl border-white/10 p-6">
                                    <div className="h-12 w-12 bg-[#34B2DA1A] flex items-center justify-center border border-[#0F0F0F] rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.875 3C6.97989 3 6.12145 3.35558 5.48851 3.98851C4.85558 4.62145 4.5 5.47989 4.5 6.375V19.875C4.49983 20.0813 4.5564 20.2837 4.66353 20.4601C4.77066 20.6364 4.92422 20.7799 5.10741 20.8748C5.29061 20.9697 5.49638 21.0124 5.70221 20.9983C5.90805 20.9841 6.10603 20.9136 6.2745 20.7945L8.8125 19.002L11.3505 20.7945C11.5404 20.9288 11.7674 21.0009 12 21.0009C12.2326 21.0009 12.4596 20.9288 12.6495 20.7945L15.1875 19.002L17.727 20.7945C17.8955 20.9132 18.0933 20.9834 18.2989 20.9973C18.5045 21.0112 18.71 20.9684 18.8929 20.8736C19.0759 20.7787 19.2292 20.6354 19.3363 20.4593C19.4433 20.2832 19.5 20.0811 19.5 19.875V6.375C19.5 5.47989 19.1444 4.62145 18.5115 3.98851C17.8785 3.35558 17.0201 3 16.125 3H7.875ZM16.17 9.42C16.2805 9.31701 16.3692 9.19281 16.4307 9.05481C16.4922 8.91681 16.5252 8.76784 16.5279 8.61678C16.5306 8.46573 16.5028 8.31569 16.4462 8.1756C16.3896 8.03552 16.3054 7.90827 16.1986 7.80144C16.0917 7.69461 15.9645 7.6104 15.8244 7.55382C15.6843 7.49723 15.5343 7.46945 15.3832 7.47211C15.2322 7.47478 15.0832 7.50784 14.9452 7.56933C14.8072 7.63082 14.683 7.71947 14.58 7.83L7.83 14.58C7.71947 14.683 7.63082 14.8072 7.56933 14.9452C7.50784 15.0832 7.47478 15.2322 7.47211 15.3832C7.46945 15.5343 7.49723 15.6843 7.55382 15.8244C7.6104 15.9645 7.69461 16.0917 7.80144 16.1986C7.90827 16.3054 8.03552 16.3896 8.1756 16.4462C8.31569 16.5028 8.46573 16.5306 8.61678 16.5279C8.76784 16.5252 8.91681 16.4922 9.05481 16.4307C9.19281 16.3692 9.31701 16.2805 9.42 16.17L16.17 9.42ZM10.5 9.375C10.5 9.52274 10.4709 9.66903 10.4144 9.80552C10.3578 9.94201 10.275 10.066 10.1705 10.1705C10.066 10.275 9.94201 10.3578 9.80552 10.4144C9.66903 10.4709 9.52274 10.5 9.375 10.5C9.22726 10.5 9.08097 10.4709 8.94448 10.4144C8.80799 10.3578 8.68397 10.275 8.5795 10.1705C8.47504 10.066 8.39217 9.94201 8.33564 9.80552C8.2791 9.66903 8.25 9.52274 8.25 9.375C8.25 9.07663 8.36853 8.79048 8.5795 8.5795C8.79048 8.36853 9.07663 8.25 9.375 8.25C9.67337 8.25 9.95952 8.36853 10.1705 8.5795C10.3815 8.79048 10.5 9.07663 10.5 9.375ZM14.625 15.75C14.9234 15.75 15.2095 15.6315 15.4205 15.4205C15.6315 15.2095 15.75 14.9234 15.75 14.625C15.75 14.3266 15.6315 14.0405 15.4205 13.8295C15.2095 13.6185 14.9234 13.5 14.625 13.5C14.3266 13.5 14.0405 13.6185 13.8295 13.8295C13.6185 14.0405 13.5 14.3266 13.5 14.625C13.5 14.9234 13.6185 15.2095 13.8295 15.4205C14.0405 15.6315 14.3266 15.75 14.625 15.75Z"
                                                fill="#89DBF0"
                                            />
                                        </svg>
                                    </div>
                                    <DialogTitle className="mt-4">Add promo code</DialogTitle>
                                    <DialogDescription>
                                        Create discount for your event
                                    </DialogDescription>
                                </div>
                                <div className="flex flex-col gap-4 p-6">
                                    <div className="flex flex-col gap-2.5">
                                        <label className="text-sm font-medium text-white">
                                            Enter promo code name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. EARLYBIRD"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                        />
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="16" x2="12" y2="12" />
                                                <line x1="12" y1="8" x2="12.01" y2="8" />
                                            </svg>
                                            Customers will use this code at checkout
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2.5">
                                        <label className="text-sm font-medium text-white">
                                            Discount type
                                        </label>
                                        <div className="flex gap-2 bg-[#0F0F0F] p-1 border border-white/[0.03] h-12 rounded-full">
                                            <button
                                                onClick={() => setDiscountType("percentage")}
                                                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-sm ${discountType === "percentage"
                                                    ? "bg-white/5 border border-white/[0.03] opacity-100"
                                                    : "opacity-50"
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
                                                        d="M3.39526 6.09276C2.98993 6.22088 2.63597 6.47482 2.38473 6.81772C2.13349 7.16063 1.99805 7.57467 1.99805 7.99976C1.99805 8.42486 2.13349 8.83889 2.38473 9.1818C2.63597 9.5247 2.98993 9.77864 3.39526 9.90676C3.19919 10.284 3.12841 10.7139 3.19321 11.134C3.25802 11.5542 3.45502 11.9428 3.75563 12.2434C4.05625 12.544 4.44483 12.741 4.865 12.8058C5.28516 12.8706 5.71504 12.7998 6.09226 12.6038C6.22038 13.0091 6.47432 13.3631 6.81722 13.6143C7.16013 13.8655 7.57417 14.001 7.99926 14.001C8.42436 14.001 8.83839 13.8655 9.1813 13.6143C9.52421 13.3631 9.77814 13.0091 9.90626 12.6038C10.2835 12.7995 10.7133 12.87 11.1333 12.8051C11.5533 12.7402 11.9418 12.5432 12.2424 12.2427C12.5429 11.9423 12.74 11.5539 12.8051 11.1339C12.8702 10.7139 12.7998 10.2841 12.6043 9.90676C13.0096 9.77853 13.3635 9.52451 13.6146 9.18153C13.8657 8.83856 14.0011 8.42449 14.001 7.99939C14.0009 7.5743 13.8653 7.1603 13.614 6.81746C13.3627 6.47462 13.0086 6.22078 12.6033 6.09276C12.799 5.7155 12.8695 5.28572 12.8046 4.8657C12.7397 4.44568 12.5427 4.05724 12.2422 3.75666C11.9418 3.45608 11.5534 3.25898 11.1334 3.19391C10.7134 3.12884 10.2836 3.19919 9.90626 3.39476C9.77803 2.98947 9.52401 2.63557 9.18103 2.38442C8.83806 2.13327 8.42399 1.99794 7.99889 1.99805C7.5738 1.99816 7.1598 2.13371 6.81696 2.38504C6.47412 2.63637 6.22027 2.9904 6.09226 3.39576C5.71504 3.19969 5.28516 3.12891 4.865 3.19372C4.44483 3.25852 4.05625 3.45552 3.75563 3.75613C3.45502 4.05675 3.25802 4.44533 3.19321 4.8655C3.12841 5.28566 3.19919 5.71554 3.39526 6.09276ZM5.99926 6.99976C6.26448 6.99976 6.51883 6.8944 6.70637 6.70687C6.8939 6.51933 6.99926 6.26498 6.99926 5.99976C6.99926 5.73454 6.8939 5.48019 6.70637 5.29265C6.51883 5.10512 6.26448 4.99976 5.99926 4.99976C5.73404 4.99976 5.47969 5.10512 5.29215 5.29265C5.10462 5.48019 4.99926 5.73454 4.99926 5.99976C4.99926 6.26498 5.10462 6.51933 5.29215 6.70687C5.47969 6.8944 5.73404 6.99976 5.99926 6.99976ZM9.46926 5.46976C9.53792 5.39607 9.62072 5.33697 9.71272 5.29598C9.80472 5.25499 9.90404 5.23295 10.0047 5.23117C10.1054 5.22939 10.2055 5.24792 10.2989 5.28564C10.3922 5.32336 10.4771 5.3795 10.5483 5.45072C10.6195 5.52194 10.6757 5.60678 10.7134 5.70016C10.7511 5.79355 10.7696 5.89358 10.7679 5.99428C10.7661 6.09499 10.744 6.1943 10.703 6.2863C10.6621 6.3783 10.6029 6.4611 10.5293 6.52976L6.52926 10.5298C6.4606 10.6034 6.3778 10.6625 6.2858 10.7035C6.1938 10.7445 6.09449 10.7666 5.99378 10.7684C5.89308 10.7701 5.79305 10.7516 5.69966 10.7139C5.60628 10.6762 5.52144 10.62 5.45022 10.5488C5.379 10.4776 5.32286 10.3927 5.28514 10.2994C5.24742 10.206 5.22889 10.1059 5.23067 10.0052C5.23245 9.90454 5.25449 9.80522 5.29548 9.71322C5.33647 9.62122 5.39557 9.53842 5.46926 9.46976L9.46926 5.46976ZM10.9993 9.99976C10.9993 10.265 10.8939 10.5193 10.7064 10.7069C10.5188 10.8944 10.2645 10.9998 9.99926 10.9998C9.73404 10.9998 9.47969 10.8944 9.29215 10.7069C9.10462 10.5193 8.99926 10.265 8.99926 9.99976C8.99926 9.73454 9.10462 9.48019 9.29215 9.29265C9.47969 9.10512 9.73404 8.99976 9.99926 8.99976C10.2645 8.99976 10.5188 9.10512 10.7064 9.29265C10.8939 9.48019 10.9993 9.73454 10.9993 9.99976Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                                Percentage
                                            </button>
                                            <button
                                                onClick={() => setDiscountType("fixed")}
                                                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-sm ${discountType === "fixed"
                                                    ? "bg-white/5 border border-white/[0.03] opacity-100"
                                                    : "opacity-50"
                                                    }`}
                                            >
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
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M15.5 8C15.5 9.85652 14.7625 11.637 13.4497 12.9497C12.137 14.2625 10.3565 15 8.5 15C6.64348 15 4.86301 14.2625 3.55025 12.9497C2.2375 11.637 1.5 9.85652 1.5 8C1.5 6.14348 2.2375 4.36301 3.55025 3.05025C4.86301 1.7375 6.64348 1 8.5 1C10.3565 1 12.137 1.7375 13.4497 3.05025C14.7625 4.36301 15.5 6.14348 15.5 8ZM7.75 3.75C7.75 3.55109 7.82902 3.36032 7.96967 3.21967C8.11032 3.07902 8.30109 3 8.5 3C8.69891 3 8.88968 3.07902 9.03033 3.21967C9.17098 3.36032 9.25 3.55109 9.25 3.75V4H11.75C11.9489 4 12.1397 4.07902 12.2803 4.21967C12.421 4.36032 12.5 4.55109 12.5 4.75C12.5 4.94891 12.421 5.13968 12.2803 5.28033C12.1397 5.42098 11.9489 5.5 11.75 5.5H9.25V7.25H10.125C10.7549 7.25 11.359 7.50022 11.8044 7.94562C12.2498 8.39102 12.5 8.99511 12.5 9.625C12.5 10.2549 12.2498 10.859 11.8044 11.3044C11.359 11.7498 10.7549 12 10.125 12H9.25V12.25C9.25 12.4489 9.17098 12.6397 9.03033 12.7803C8.88968 12.921 8.69891 13 8.5 13C8.30109 13 8.11032 12.921 7.96967 12.7803C7.82902 12.6397 7.75 12.4489 7.75 12.25V12H5.25C5.05109 12 4.86032 11.921 4.71967 11.7803C4.57902 11.6397 4.5 11.4489 4.5 11.25C4.5 11.0511 4.57902 10.8603 4.71967 10.7197C4.86032 10.579 5.05109 10.5 5.25 10.5H7.75V8.75H6.875C6.24511 8.75 5.64102 8.49978 5.19562 8.05438C4.75022 7.60898 4.5 7.00489 4.5 6.375C4.5 5.74511 4.75022 5.14102 5.19562 4.69562C5.64102 4.25022 6.24511 4 6.875 4H7.75V3.75Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                                Fixed amount
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-white">
                                            Discount {discountType === "percentage" ? "percentage" : "amount"}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                                                {
                                                    discountType === "percentage" ? (
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
                                                                d="M3.39526 6.09276C2.98993 6.22088 2.63597 6.47482 2.38473 6.81772C2.13349 7.16063 1.99805 7.57467 1.99805 7.99976C1.99805 8.42486 2.13349 8.83889 2.38473 9.1818C2.63597 9.5247 2.98993 9.77864 3.39526 9.90676C3.19919 10.284 3.12841 10.7139 3.19321 11.134C3.25802 11.5542 3.45502 11.9428 3.75563 12.2434C4.05625 12.544 4.44483 12.741 4.865 12.8058C5.28516 12.8706 5.71504 12.7998 6.09226 12.6038C6.22038 13.0091 6.47432 13.3631 6.81722 13.6143C7.16013 13.8655 7.57417 14.001 7.99926 14.001C8.42436 14.001 8.83839 13.8655 9.1813 13.6143C9.52421 13.3631 9.77814 13.0091 9.90626 12.6038C10.2835 12.7995 10.7133 12.87 11.1333 12.8051C11.5533 12.7402 11.9418 12.5432 12.2424 12.2427C12.5429 11.9423 12.74 11.5539 12.8051 11.1339C12.8702 10.7139 12.7998 10.2841 12.6043 9.90676C13.0096 9.77853 13.3635 9.52451 13.6146 9.18153C13.8657 8.83856 14.0011 8.42449 14.001 7.99939C14.0009 7.5743 13.8653 7.1603 13.614 6.81746C13.3627 6.47462 13.0086 6.22078 12.6033 6.09276C12.799 5.7155 12.8695 5.28572 12.8046 4.8657C12.7397 4.44568 12.5427 4.05724 12.2422 3.75666C11.9418 3.45608 11.5534 3.25898 11.1334 3.19391C10.7134 3.12884 10.2836 3.19919 9.90626 3.39476C9.77803 2.98947 9.52401 2.63557 9.18103 2.38442C8.83806 2.13327 8.42399 1.99794 7.99889 1.99805C7.5738 1.99816 7.1598 2.13371 6.81696 2.38504C6.47412 2.63637 6.22027 2.9904 6.09226 3.39576C5.71504 3.19969 5.28516 3.12891 4.865 3.19372C4.44483 3.25852 4.05625 3.45552 3.75563 3.75613C3.45502 4.05675 3.25802 4.44533 3.19321 4.8655C3.12841 5.28566 3.19919 5.71554 3.39526 6.09276ZM5.99926 6.99976C6.26448 6.99976 6.51883 6.8944 6.70637 6.70687C6.8939 6.51933 6.99926 6.26498 6.99926 5.99976C6.99926 5.73454 6.8939 5.48019 6.70637 5.29265C6.51883 5.10512 6.26448 4.99976 5.99926 4.99976C5.73404 4.99976 5.47969 5.10512 5.29215 5.29265C5.10462 5.48019 4.99926 5.73454 4.99926 5.99976C4.99926 6.26498 5.10462 6.51933 5.29215 6.70687C5.47969 6.8944 5.73404 6.99976 5.99926 6.99976ZM9.46926 5.46976C9.53792 5.39607 9.62072 5.33697 9.71272 5.29598C9.80472 5.25499 9.90404 5.23295 10.0047 5.23117C10.1054 5.22939 10.2055 5.24792 10.2989 5.28564C10.3922 5.32336 10.4771 5.3795 10.5483 5.45072C10.6195 5.52194 10.6757 5.60678 10.7134 5.70016C10.7511 5.79355 10.7696 5.89358 10.7679 5.99428C10.7661 6.09499 10.744 6.1943 10.703 6.2863C10.6621 6.3783 10.6029 6.4611 10.5293 6.52976L6.52926 10.5298C6.4606 10.6034 6.3778 10.6625 6.2858 10.7035C6.1938 10.7445 6.09449 10.7666 5.99378 10.7684C5.89308 10.7701 5.79305 10.7516 5.69966 10.7139C5.60628 10.6762 5.52144 10.62 5.45022 10.5488C5.379 10.4776 5.32286 10.3927 5.28514 10.2994C5.24742 10.206 5.22889 10.1059 5.23067 10.0052C5.23245 9.90454 5.25449 9.80522 5.29548 9.71322C5.33647 9.62122 5.39557 9.53842 5.46926 9.46976L9.46926 5.46976ZM10.9993 9.99976C10.9993 10.265 10.8939 10.5193 10.7064 10.7069C10.5188 10.8944 10.2645 10.9998 9.99926 10.9998C9.73404 10.9998 9.47969 10.8944 9.29215 10.7069C9.10462 10.5193 8.99926 10.265 8.99926 9.99976C8.99926 9.73454 9.10462 9.48019 9.29215 9.29265C9.47969 9.10512 9.73404 8.99976 9.99926 8.99976C10.2645 8.99976 10.5188 9.10512 10.7064 9.29265C10.8939 9.48019 10.9993 9.73454 10.9993 9.99976Z"
                                                                fill="white"
                                                            />
                                                        </svg>
                                                    ) : (
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
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M15.5 8C15.5 9.85652 14.7625 11.637 13.4497 12.9497C12.137 14.2625 10.3565 15 8.5 15C6.64348 15 4.86301 14.2625 3.55025 12.9497C2.2375 11.637 1.5 9.85652 1.5 8C1.5 6.14348 2.2375 4.36301 3.55025 3.05025C4.86301 1.7375 6.64348 1 8.5 1C10.3565 1 12.137 1.7375 13.4497 3.05025C14.7625 4.36301 15.5 6.14348 15.5 8ZM7.75 3.75C7.75 3.55109 7.82902 3.36032 7.96967 3.21967C8.11032 3.07902 8.30109 3 8.5 3C8.69891 3 8.88968 3.07902 9.03033 3.21967C9.17098 3.36032 9.25 3.55109 9.25 3.75V4H11.75C11.9489 4 12.1397 4.07902 12.2803 4.21967C12.421 4.36032 12.5 4.55109 12.5 4.75C12.5 4.94891 12.421 5.13968 12.2803 5.28033C12.1397 5.42098 11.9489 5.5 11.75 5.5H9.25V7.25H10.125C10.7549 7.25 11.359 7.50022 11.8044 7.94562C12.2498 8.39102 12.5 8.99511 12.5 9.625C12.5 10.2549 12.2498 10.859 11.8044 11.3044C11.359 11.7498 10.7549 12 10.125 12H9.25V12.25C9.25 12.4489 9.17098 12.6397 9.03033 12.7803C8.88968 12.921 8.69891 13 8.5 13C8.30109 13 8.11032 12.921 7.96967 12.7803C7.82902 12.6397 7.75 12.4489 7.75 12.25V12H5.25C5.05109 12 4.86032 11.921 4.71967 11.7803C4.57902 11.6397 4.5 11.4489 4.5 11.25C4.5 11.0511 4.57902 10.8603 4.71967 10.7197C4.86032 10.579 5.05109 10.5 5.25 10.5H7.75V8.75H6.875C6.24511 8.75 5.64102 8.49978 5.19562 8.05438C4.75022 7.60898 4.5 7.00489 4.5 6.375C4.5 5.74511 4.75022 5.14102 5.19562 4.69562C5.64102 4.25022 6.24511 4 6.875 4H7.75V3.75Z"
                                                                fill="white"
                                                            />
                                                        </svg>
                                                    )
                                                }
                                            </div>
                                            <input
                                                type="number"
                                                placeholder={discountType === "percentage" ? "0%" : "0"}
                                                value={discountAmount}
                                                onChange={(e) => setDiscountAmount(e.target.value)}
                                                className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg pl-8 pr-3 focus:outline-none w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row border-t border-white/10 bottom-0 bg-primary justify-between w-full gap-3 p-4">
                                    <button
                                        onClick={() => setAddPromoDialogOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-full border border-white/10 w-full"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddPromo}
                                        className="bg-white hover:bg-white/90 text-black px-4 py-2 w-full rounded-full text-sm font-medium"
                                    >
                                        Add promo code
                                    </button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog
                            open={editPromoDialogOpen}
                            onOpenChange={setEditPromoDialogOpen}
                            className="!max-w-[400px] border border-white/10 rounded-xl !p-0 overflow-hidden"
                        >
                            <DialogContent className="max-h-[90vh] overflow-y-auto hide-scrollbar !gap-0">
                                <div className="flex flex-col gap-y-2.5 bg-white/[0.03] border-b rounded-t-xl border-white/10 p-6">
                                    <div className="h-12 w-12 bg-[#F973161A] flex items-center justify-center border border-[#0F0F0F] rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M20.2318 3.76894C19.988 3.52516 19.6986 3.33178 19.3801 3.19984C19.0616 3.06791 18.7203 3 18.3755 3C18.0308 3 17.6894 3.06791 17.3709 3.19984C17.0524 3.33178 16.763 3.52516 16.5193 3.76894L10.1248 10.1604C9.74182 10.5434 9.43804 10.9981 9.23076 11.4984L7.95877 14.5689C7.87356 14.7745 7.85125 15.0008 7.89464 15.219C7.93804 15.4373 8.04519 15.6378 8.20255 15.7952C8.35991 15.9525 8.56041 16.0597 8.77868 16.1031C8.99694 16.1465 9.22318 16.1241 9.42876 16.0389L12.4993 14.7669C12.9996 14.5597 13.4543 14.2559 13.8373 13.8729L20.2288 7.47994C20.7206 6.98771 20.997 6.32031 20.997 5.62444C20.997 4.92857 20.7206 4.26117 20.2288 3.76894H20.2318Z"
                                                fill="#FDAC74"
                                            />
                                            <path
                                                d="M7.125 5.25C6.09 5.25 5.25 6.09 5.25 7.125V16.875C5.25 17.91 6.09 18.75 7.125 18.75H16.875C17.91 18.75 18.75 17.91 18.75 16.875V13.5C18.75 13.2016 18.8685 12.9155 19.0795 12.7045C19.2905 12.4935 19.5766 12.375 19.875 12.375C20.1734 12.375 20.4595 12.4935 20.6705 12.7045C20.8815 12.9155 21 13.2016 21 13.5V16.875C21 17.969 20.5654 19.0182 19.7918 19.7918C19.0182 20.5654 17.969 21 16.875 21H7.125C6.03098 21 4.98177 20.5654 4.20818 19.7918C3.4346 19.0182 3 17.969 3 16.875V7.125C3 6.03098 3.4346 4.98177 4.20818 4.20818C4.98177 3.4346 6.03098 3 7.125 3H10.5C10.7984 3 11.0845 3.11853 11.2955 3.3295C11.5065 3.54048 11.625 3.82663 11.625 4.125C11.625 4.42337 11.5065 4.70952 11.2955 4.9205C11.0845 5.13147 10.7984 5.25 10.5 5.25H7.125Z"
                                                fill="#FDAC74"
                                            />
                                        </svg>
                                    </div>
                                    <DialogTitle className="mt-4">Edit promo code</DialogTitle>
                                    <DialogDescription>
                                        Update discount for your event
                                    </DialogDescription>
                                </div>
                                <div className="flex flex-col gap-4 p-6">
                                    <div className="flex flex-col gap-2.5">
                                        <label className="text-sm font-medium text-white">
                                            Enter promo code name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. EARLYBIRD"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                        />
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="16" x2="12" y2="12" />
                                                <line x1="12" y1="8" x2="12.01" y2="8" />
                                            </svg>
                                            Customers will use this code at checkout
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2.5">
                                        <label className="text-sm font-medium text-white">
                                            Discount type
                                        </label>
                                        <div className="flex gap-2 bg-[#0F0F0F] p-1 border border-white/[0.03] h-12 rounded-full">
                                            <button
                                                onClick={() => setDiscountType("percentage")}
                                                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-sm ${discountType === "percentage"
                                                    ? "bg-white/5 border border-white/[0.03] opacity-100"
                                                    : "opacity-50"
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
                                                        d="M3.39526 6.09276C2.98993 6.22088 2.63597 6.47482 2.38473 6.81772C2.13349 7.16063 1.99805 7.57467 1.99805 7.99976C1.99805 8.42486 2.13349 8.83889 2.38473 9.1818C2.63597 9.5247 2.98993 9.77864 3.39526 9.90676C3.19919 10.284 3.12841 10.7139 3.19321 11.134C3.25802 11.5542 3.45502 11.9428 3.75563 12.2434C4.05625 12.544 4.44483 12.741 4.865 12.8058C5.28516 12.8706 5.71504 12.7998 6.09226 12.6038C6.22038 13.0091 6.47432 13.3631 6.81722 13.6143C7.16013 13.8655 7.57417 14.001 7.99926 14.001C8.42436 14.001 8.83839 13.8655 9.1813 13.6143C9.52421 13.3631 9.77814 13.0091 9.90626 12.6038C10.2835 12.7995 10.7133 12.87 11.1333 12.8051C11.5533 12.7402 11.9418 12.5432 12.2424 12.2427C12.5429 11.9423 12.74 11.5539 12.8051 11.1339C12.8702 10.7139 12.7998 10.2841 12.6043 9.90676C13.0096 9.77853 13.3635 9.52451 13.6146 9.18153C13.8657 8.83856 14.0011 8.42449 14.001 7.99939C14.0009 7.5743 13.8653 7.1603 13.614 6.81746C13.3627 6.47462 13.0086 6.22078 12.6033 6.09276C12.799 5.7155 12.8695 5.28572 12.8046 4.8657C12.7397 4.44568 12.5427 4.05724 12.2422 3.75666C11.9418 3.45608 11.5534 3.25898 11.1334 3.19391C10.7134 3.12884 10.2836 3.19919 9.90626 3.39476C9.77803 2.98947 9.52401 2.63557 9.18103 2.38442C8.83806 2.13327 8.42399 1.99794 7.99889 1.99805C7.5738 1.99816 7.1598 2.13371 6.81696 2.38504C6.47412 2.63637 6.22027 2.9904 6.09226 3.39576C5.71504 3.19969 5.28516 3.12891 4.865 3.19372C4.44483 3.25852 4.05625 3.45552 3.75563 3.75613C3.45502 4.05675 3.25802 4.44533 3.19321 4.8655C3.12841 5.28566 3.19919 5.71554 3.39526 6.09276ZM5.99926 6.99976C6.26448 6.99976 6.51883 6.8944 6.70637 6.70687C6.8939 6.51933 6.99926 6.26498 6.99926 5.99976C6.99926 5.73454 6.8939 5.48019 6.70637 5.29265C6.51883 5.10512 6.26448 4.99976 5.99926 4.99976C5.73404 4.99976 5.47969 5.10512 5.29215 5.29265C5.10462 5.48019 4.99926 5.73454 4.99926 5.99976C4.99926 6.26498 5.10462 6.51933 5.29215 6.70687C5.47969 6.8944 5.73404 6.99976 5.99926 6.99976ZM9.46926 5.46976C9.53792 5.39607 9.62072 5.33697 9.71272 5.29598C9.80472 5.25499 9.90404 5.23295 10.0047 5.23117C10.1054 5.22939 10.2055 5.24792 10.2989 5.28564C10.3922 5.32336 10.4771 5.3795 10.5483 5.45072C10.6195 5.52194 10.6757 5.60678 10.7134 5.70016C10.7511 5.79355 10.7696 5.89358 10.7679 5.99428C10.7661 6.09499 10.744 6.1943 10.703 6.2863C10.6621 6.3783 10.6029 6.4611 10.5293 6.52976L6.52926 10.5298C6.4606 10.6034 6.3778 10.6625 6.2858 10.7035C6.1938 10.7445 6.09449 10.7666 5.99378 10.7684C5.89308 10.7701 5.79305 10.7516 5.69966 10.7139C5.60628 10.6762 5.52144 10.62 5.45022 10.5488C5.379 10.4776 5.32286 10.3927 5.28514 10.2994C5.24742 10.206 5.22889 10.1059 5.23067 10.0052C5.23245 9.90454 5.25449 9.80522 5.29548 9.71322C5.33647 9.62122 5.39557 9.53842 5.46926 9.46976L9.46926 5.46976ZM10.9993 9.99976C10.9993 10.265 10.8939 10.5193 10.7064 10.7069C10.5188 10.8944 10.2645 10.9998 9.99926 10.9998C9.73404 10.9998 9.47969 10.8944 9.29215 10.7069C9.10462 10.5193 8.99926 10.265 8.99926 9.99976C8.99926 9.73454 9.10462 9.48019 9.29215 9.29265C9.47969 9.10512 9.73404 8.99976 9.99926 8.99976C10.2645 8.99976 10.5188 9.10512 10.7064 9.29265C10.8939 9.48019 10.9993 9.73454 10.9993 9.99976Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                                Percentage
                                            </button>
                                            <button
                                                onClick={() => setDiscountType("fixed")}
                                                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-sm ${discountType === "fixed"
                                                    ? "bg-white/5 border border-white/[0.03] opacity-100"
                                                    : "opacity-50"
                                                    }`}
                                            >
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
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M15.5 8C15.5 9.85652 14.7625 11.637 13.4497 12.9497C12.137 14.2625 10.3565 15 8.5 15C6.64348 15 4.86301 14.2625 3.55025 12.9497C2.2375 11.637 1.5 9.85652 1.5 8C1.5 6.14348 2.2375 4.36301 3.55025 3.05025C4.86301 1.7375 6.64348 1 8.5 1C10.3565 1 12.137 1.7375 13.4497 3.05025C14.7625 4.36301 15.5 6.14348 15.5 8ZM7.75 3.75C7.75 3.55109 7.82902 3.36032 7.96967 3.21967C8.11032 3.07902 8.30109 3 8.5 3C8.69891 3 8.88968 3.07902 9.03033 3.21967C9.17098 3.36032 9.25 3.55109 9.25 3.75V4H11.75C11.9489 4 12.1397 4.07902 12.2803 4.21967C12.421 4.36032 12.5 4.55109 12.5 4.75C12.5 4.94891 12.421 5.13968 12.2803 5.28033C12.1397 5.42098 11.9489 5.5 11.75 5.5H9.25V7.25H10.125C10.7549 7.25 11.359 7.50022 11.8044 7.94562C12.2498 8.39102 12.5 8.99511 12.5 9.625C12.5 10.2549 12.2498 10.859 11.8044 11.3044C11.359 11.7498 10.7549 12 10.125 12H9.25V12.25C9.25 12.4489 9.17098 12.6397 9.03033 12.7803C8.88968 12.921 8.69891 13 8.5 13C8.30109 13 8.11032 12.921 7.96967 12.7803C7.82902 12.6397 7.75 12.4489 7.75 12.25V12H5.25C5.05109 12 4.86032 11.921 4.71967 11.7803C4.57902 11.6397 4.5 11.4489 4.5 11.25C4.5 11.0511 4.57902 10.8603 4.71967 10.7197C4.86032 10.579 5.05109 10.5 5.25 10.5H7.75V8.75H6.875C6.24511 8.75 5.64102 8.49978 5.19562 8.05438C4.75022 7.60898 4.5 7.00489 4.5 6.375C4.5 5.74511 4.75022 5.14102 5.19562 4.69562C5.64102 4.25022 6.24511 4 6.875 4H7.75V3.75Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                                Fixed amount
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-white">
                                            Discount amount
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
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
                                                        d="M3.39526 6.09276C2.98993 6.22088 2.63597 6.47482 2.38473 6.81772C2.13349 7.16063 1.99805 7.57467 1.99805 7.99976C1.99805 8.42486 2.13349 8.83889 2.38473 9.1818C2.63597 9.5247 2.98993 9.77864 3.39526 9.90676C3.19919 10.284 3.12841 10.7139 3.19321 11.134C3.25802 11.5542 3.45502 11.9428 3.75563 12.2434C4.05625 12.544 4.44483 12.741 4.865 12.8058C5.28516 12.8706 5.71504 12.7998 6.09226 12.6038C6.22038 13.0091 6.47432 13.3631 6.81722 13.6143C7.16013 13.8655 7.57417 14.001 7.99926 14.001C8.42436 14.001 8.83839 13.8655 9.1813 13.6143C9.52421 13.3631 9.77814 13.0091 9.90626 12.6038C10.2835 12.7995 10.7133 12.87 11.1333 12.8051C11.5533 12.7402 11.9418 12.5432 12.2424 12.2427C12.5429 11.9423 12.74 11.5539 12.8051 11.1339C12.8702 10.7139 12.7998 10.2841 12.6043 9.90676C13.0096 9.77853 13.3635 9.52451 13.6146 9.18153C13.8657 8.83856 14.0011 8.42449 14.001 7.99939C14.0009 7.5743 13.8653 7.1603 13.614 6.81746C13.3627 6.47462 13.0086 6.22078 12.6033 6.09276C12.799 5.7155 12.8695 5.28572 12.8046 4.8657C12.7397 4.44568 12.5427 4.05724 12.2422 3.75666C11.9418 3.45608 11.5534 3.25898 11.1334 3.19391C10.7134 3.12884 10.2836 3.19919 9.90626 3.39476C9.77803 2.98947 9.52401 2.63557 9.18103 2.38442C8.83806 2.13327 8.42399 1.99794 7.99889 1.99805C7.5738 1.99816 7.1598 2.13371 6.81696 2.38504C6.47412 2.63637 6.22027 2.9904 6.09226 3.39576C5.71504 3.19969 5.28516 3.12891 4.865 3.19372C4.44483 3.25852 4.05625 3.45552 3.75563 3.75613C3.45502 4.05675 3.25802 4.44533 3.19321 4.8655C3.12841 5.28566 3.19919 5.71554 3.39526 6.09276ZM5.99926 6.99976C6.26448 6.99976 6.51883 6.8944 6.70637 6.70687C6.8939 6.51933 6.99926 6.26498 6.99926 5.99976C6.99926 5.73454 6.8939 5.48019 6.70637 5.29265C6.51883 5.10512 6.26448 4.99976 5.99926 4.99976C5.73404 4.99976 5.47969 5.10512 5.29215 5.29265C5.10462 5.48019 4.99926 5.73454 4.99926 5.99976C4.99926 6.26498 5.10462 6.51933 5.29215 6.70687C5.47969 6.8944 5.73404 6.99976 5.99926 6.99976ZM9.46926 5.46976C9.53792 5.39607 9.62072 5.33697 9.71272 5.29598C9.80472 5.25499 9.90404 5.23295 10.0047 5.23117C10.1054 5.22939 10.2055 5.24792 10.2989 5.28564C10.3922 5.32336 10.4771 5.3795 10.5483 5.45072C10.6195 5.52194 10.6757 5.60678 10.7134 5.70016C10.7511 5.79355 10.7696 5.89358 10.7679 5.99428C10.7661 6.09499 10.744 6.1943 10.703 6.2863C10.6621 6.3783 10.6029 6.4611 10.5293 6.52976L6.52926 10.5298C6.4606 10.6034 6.3778 10.6625 6.2858 10.7035C6.1938 10.7445 6.09449 10.7666 5.99378 10.7684C5.89308 10.7701 5.79305 10.7516 5.69966 10.7139C5.60628 10.6762 5.52144 10.62 5.45022 10.5488C5.379 10.4776 5.32286 10.3927 5.28514 10.2994C5.24742 10.206 5.22889 10.1059 5.23067 10.0052C5.23245 9.90454 5.25449 9.80522 5.29548 9.71322C5.33647 9.62122 5.39557 9.53842 5.46926 9.46976L9.46926 5.46976ZM10.9993 9.99976C10.9993 10.265 10.8939 10.5193 10.7064 10.7069C10.5188 10.8944 10.2645 10.9998 9.99926 10.9998C9.73404 10.9998 9.47969 10.8944 9.29215 10.7069C9.10462 10.5193 8.99926 10.265 8.99926 9.99976C8.99926 9.73454 9.10462 9.48019 9.29215 9.29265C9.47969 9.10512 9.73404 8.99976 9.99926 8.99976C10.2645 8.99976 10.5188 9.10512 10.7064 9.29265C10.8939 9.48019 10.9993 9.73454 10.9993 9.99976Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                            </div>
                                            <input
                                                type="number"
                                                placeholder={discountType === "percentage" ? "0%" : "0"}
                                                value={discountAmount}
                                                onChange={(e) => setDiscountAmount(e.target.value)}
                                                className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg pl-8 pr-3 focus:outline-none w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row border-t border-white/10 sticky bottom-0 bg-primary justify-between w-full gap-3 p-4">
                                    <button
                                        onClick={() => setEditPromoDialogOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-full border border-white/10 w-full"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditPromo}
                                        className="bg-white hover:bg-white/90 text-black px-4 py-2 w-full rounded-full text-sm font-medium"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog
                            open={pausePromoDialogOpen}
                            onOpenChange={(open) => {
                                setPausePromoDialogOpen(open);
                                if (!open) setSelectedPromo(null);
                            }}
                            className="!max-w-[350px] border border-white/10 rounded-3xl !p-0 overflow-hidden"
                        >
                            <DialogContent className="!p-0 gap-0" closeClassName="!rounded-2xl">
                                <div className="flex flex-col gap-8 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="bg-white/10 w-10 h-10 rounded-lg flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="17"
                                                height="16"
                                                viewBox="0 0 17 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M4.66602 2C4.53341 2 4.40623 2.05268 4.31246 2.14645C4.21869 2.24021 4.16602 2.36739 4.16602 2.5V13.5C4.16602 13.6326 4.21869 13.7598 4.31246 13.8536C4.40623 13.9473 4.53341 14 4.66602 14H5.66602C5.79862 14 5.9258 13.9473 6.01957 13.8536C6.11334 13.7598 6.16602 13.6326 6.16602 13.5V2.5C6.16602 2.36739 6.11334 2.24021 6.01957 2.14645C5.9258 2.05268 5.79862 2 5.66602 2H4.66602ZM10.666 2C10.5334 2 10.4062 2.05268 10.3125 2.14645C10.2187 2.24021 10.166 2.36739 10.166 2.5V13.5C10.166 13.6326 10.2187 13.7598 10.3125 13.8536C10.4062 13.9473 10.5334 14 10.666 14H11.666C11.7986 14 11.9258 13.9473 12.0196 13.8536C12.1133 13.7598 12.166 13.6326 12.166 13.5V2.5C12.166 2.36739 12.1133 2.24021 12.0196 2.14645C11.9258 2.05268 11.7986 2 11.666 2H10.666Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start gap-2">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-xl font-semibold">
                                                Pause {selectedPromo?.code} promo code?
                                            </h3>
                                            <p className="text-white/70">
                                                This code won&apos;t be available at checkout
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={confirmPause}
                                        className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-full font-medium h-10 text-sm"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="16"
                                            viewBox="0 0 17 16"
                                            fill="none"
                                        >
                                            <path
                                                d="M4.66602 2C4.53341 2 4.40623 2.05268 4.31246 2.14645C4.21869 2.24021 4.16602 2.36739 4.16602 2.5V13.5C4.16602 13.6326 4.21869 13.7598 4.31246 13.8536C4.40623 13.9473 4.53341 14 4.66602 14H5.66602C5.79862 14 5.9258 13.9473 6.01957 13.8536C6.11334 13.7598 6.16602 13.6326 6.16602 13.5V2.5C6.16602 2.36739 6.11334 2.24021 6.01957 2.14645C5.9258 2.05268 5.79862 2 5.66602 2H4.66602ZM10.666 2C10.5334 2 10.4062 2.05268 10.3125 2.14645C10.2187 2.24021 10.166 2.36739 10.166 2.5V13.5C10.166 13.6326 10.2187 13.7598 10.3125 13.8536C10.4062 13.9473 10.5334 14 10.666 14H11.666C11.7986 14 11.9258 13.9473 12.0196 13.8536C12.1133 13.7598 12.166 13.6326 12.166 13.5V2.5C12.166 2.36739 12.1133 2.24021 12.0196 2.14645C11.9258 2.05268 11.7986 2 11.666 2H10.666Z"
                                                fill="#0F0F0F"
                                            />
                                        </svg>
                                        Pause code
                                    </button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog
                            open={deletePromoDialogOpen}
                            onOpenChange={(open) => {
                                setDeletePromoDialogOpen(open);
                                if (!open) setSelectedPromo(null);
                            }}
                            className="!max-w-[350px] border border-white/10 rounded-3xl !p-0 overflow-hidden"
                        >
                            <DialogContent className="!p-0 gap-0" closeClassName="!rounded-2xl">
                                <div className="flex flex-col gap-8 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="bg-red-500/10 w-10 h-10 rounded-lg flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M6.5 2.5L6 3H3C2.86739 3 2.74021 3.05268 2.64645 3.14645C2.55268 3.24021 2.5 3.36739 2.5 3.5C2.5 3.63261 2.55268 3.75979 2.64645 3.85355C2.74021 3.94732 2.86739 4 3 4H13C13.1326 4 13.2598 3.94732 13.3536 3.85355C13.4473 3.75979 13.5 3.63261 13.5 3.5C13.5 3.36739 13.4473 3.24021 13.3536 3.14645C13.2598 3.05268 13.1326 3 13 3H10L9.5 2.5H6.5ZM3.5 5V13C3.5 13.2652 3.60536 13.5196 3.79289 13.7071C3.98043 13.8946 4.23478 14 4.5 14H11.5C11.7652 14 12.0196 13.8946 12.2071 13.7071C12.3946 13.5196 12.5 13.2652 12.5 13V5H3.5Z"
                                                    fill="#EF4444"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start gap-2">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-xl font-semibold">
                                                Delete{" "}
                                                <span className="text-red-500 border text-base border-red-500 rounded-md px-2 py-1 h-5 border-dashed bg-red-500/10">
                                                    {selectedPromo?.code}
                                                </span>{" "}
                                                promo code?
                                            </h3>
                                            <p className="text-white/70">
                                                This action cannot be undone. This code will no longer be
                                                available at checkout
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={confirmDelete}
                                        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium h-10 text-sm"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                        >
                                            <path
                                                d="M6.5 2.5L6 3H3C2.86739 3 2.74021 3.05268 2.64645 3.14645C2.55268 3.24021 2.5 3.36739 2.5 3.5C2.5 3.63261 2.55268 3.75979 2.64645 3.85355C2.74021 3.94732 2.86739 4 3 4H13C13.1326 4 13.2598 3.94732 13.3536 3.85355C13.4473 3.75979 13.5 3.63261 13.5 3.5C13.5 3.36739 13.4473 3.24021 13.3536 3.14645C13.2598 3.05268 13.1326 3 13 3H10L9.5 2.5H6.5ZM3.5 5V13C3.5 13.2652 3.60536 13.5196 3.79289 13.7071C3.98043 13.8946 4.23478 14 4.5 14H11.5C11.7652 14 12.0196 13.8946 12.2071 13.7071C12.3946 13.5196 12.5 13.2652 12.5 13V5H3.5Z"
                                                fill="white"
                                            />
                                        </svg>
                                        Delete promo code
                                    </button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div >
                )
            }
        </>
    );
}