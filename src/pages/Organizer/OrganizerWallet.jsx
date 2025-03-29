import { zodResolver } from "@hookform/resolvers/zod";
import { Spin } from "antd";
import axios from "axios";
import { Ellipsis, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillTicketFill } from "react-icons/bs";
import * as z from "zod";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import SidebarToggle from "../../components/layouts/SidebarToggle";
import { Checkbox } from "../../components/ui/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../components/ui/Dailog";
import {
  DirectionAwareMenu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../../components/ui/DirectionAwareMenu";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "../../components/ui/Dropdown";
import url from "../../constants/url";
import "../../css/global.css";
// import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Only if you want to use autoTable
// import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react";
// import html2pdf from "html2pdf.js";
import { PDFDownloadLink } from "@react-pdf/renderer";
import paymentIcons from "../../lib/paymentIcons";
import ReceiptDownload from "../../lib/receipt";

import logoImage from "../../avenue2.svg";
import {
  AllTypesFilterIcon,
  ArrowRightIcon,
  CardIcon,
  ClockIcon,
  DateIcon,
  DollarIcon,
  DropdownArrowIcon,
  FailedIcon,
  GlobeIcon,
  InTransitIcon,
  LocationIcon,
  MastercardIcon,
  NameIcon,
  PaidIcon,
  PendingIcon,
  RefundIcon,
  RefundTypeIcon,
  SaleIcon,
  SearchIcon,
  StatusIcon,
  TicketIcon,
  TimeFilterIcon,
  TypeIcon,
  UnderReviewIcon,
  ViewQRIcon,
  ViewTicketIcon,
  VisaCardIcon,
  WithdrawIcon,
} from "../../components/icons";

// const salesHistory = [
//   {
//     amount: 198,
//     cardLast4: "4468",
//     cardType: "visa",
//     date: "Today 14:23",
//     reference: "#R291012",
//     status: "completed",
//     type: "sale",
//     ticket: "After Hours Neon",
//   },
//   {
//     amount: -99,
//     cardLast4: "1234",
//     cardType: "mastercard",
//     date: "Today 13:55",
//     reference: "#R291013",
//     status: "completed",
//     type: "refund",
//     ticket: "Electric Dreams",
//   },
//   {
//     amount: 299,
//     cardLast4: "8765",
//     cardType: "visa",
//     date: "Today 12:30",
//     reference: "#R291014",
//     status: "Under review",
//     type: "sale",
//     ticket: "Synthwave Party",
//   },
//   {
//     amount: -148,
//     cardLast4: "9012",
//     cardType: "mastercard",
//     date: "Yesterday 23:15",
//     reference: "#R291015",
//     status: "processing",
//     type: "refund",
//     ticket: "Retro Wave Night",
//   },
//   {
//     amount: 248,
//     cardLast4: "3456",
//     cardType: "visa",
//     date: "Yesterday 22:45",
//     reference: "#R291016",
//     status: "completed",
//     type: "sale",
//     ticket: "Cyber Punk Festival",
//   },
//   {
//     amount: 179,
//     cardLast4: "7890",
//     cardType: "mastercard",
//     date: "Yesterday 20:10",
//     reference: "#R291017",
//     status: "failed",
//     type: "sale",
//     ticket: "Neon Lights Show",
//   },
//   {
//     amount: -89,
//     cardLast4: "2345",
//     cardType: "visa",
//     date: "Jan 24, 2024",
//     reference: "#R291018",
//     status: "completed",
//     type: "refund",
//     ticket: "Digital Dreams",
//   },
//   {
//     amount: 399,
//     cardLast4: "6789",
//     cardType: "mastercard",
//     date: "Jan 24, 2024",
//     reference: "#R291019",
//     status: "completed",
//     type: "sale",
//     ticket: "Future Bass Night",
//   },
// ];

const saleTypeIcons = {
  Sale: <SaleIcon />,
  refund: <RefundTypeIcon />,
};

const statusIcons = {
  paid: <PaidIcon />,
  refund: (
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
  ),
  in_transit: <InTransitIcon />,
  failed: <FailedIcon />,
  pending: <PendingIcon />,
  "Under review": <UnderReviewIcon />,
};

const cardIcons = {
  visa: <VisaCardIcon />,
  mastercard: <MastercardIcon />,
};

const payoutHistory = [
  {
    amount: 150,
    cardLast4: "4468",
    cardType: "visa",
    date: "Jan 22, 2024",
    reference: "#R291012",
    status: "processing",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "failed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
];

// Add sample cards data
const cards = [
  { id: 1, type: "visa", last4: "4468" },
  { id: 2, type: "mastercard", last4: "1234" },
];

// import jsPDF from "jspdf";
// import Canvg from "canvg";
export default function OrganizerWallet() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(cards[0]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [timeFilter, setTimeFilter] = useState("All time");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [ticketFilter, setTicketFilter] = useState("All events");
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewTicketOpen, setIsViewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [event, setEvent] = useState({});
  const [isQROpen, setIsQROpen] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [oragnizerId, setOragnizerId] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const eventId = localStorage.getItem("user_event_id") || {};

  const [cardDetails, setCardDetails] = useState(null);

  const [organizer, setOrganizer] = useState({
    bio: "",
    name: "",
    email: "",
    phone: "",
    instagram: "",
    twitter: "",
    website: "",
    url: "",
  });
  const prevValuesRef = useRef(null); // Store previous values

  const [loading, setLoading] = useState(false);
  const [accountBalance, setSetAccountBalance] = useState({
    available: [],
    instant_available: [],
    pending: [],
  });

  const [transferedAmount, setTransferedAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({});
  const [payoutList, setPayoutList] = useState([]);
  const [orgEventList, setOrgEventList] = useState([]);
  const [balanceLoader, setBalanceLoader] = useState(true);
  const [historyLoader, setHistoryLoader] = useState(true);
  const [statusInstant, setStatusInstant] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [filteredRefundTotal, setFilteredRefundTotal] = useState(0);
  const [orgEventLoader, setOrgEventLoader] = useState(false);
  const [processLoader, setProcessLoader] = useState(false);
  const [includeFee, setIncludeFee] = useState(false);
  const [maxAmount, setMaxAmount] = useState(0);
  const [amountEntered, setAmountEntered] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);

  const handleViewTicket = async (sale) => {
    setIsLoadingTicket(true);
    setSelectedTicket(sale);
    setCardDetails(null); // Clear previous card details

    // Add a small delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsViewTicketOpen(true);
    setIsLoadingTicket(false);
  };

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedUserOrganizerId = localStorage.getItem("organizerId");
      if (storedUserOrganizerId) {
        setOragnizerId(storedUserOrganizerId);
      } else {
        console.warn("No organizerId found in localStorage");
      }
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
  function extractPaymentId(fullString) {
    return fullString?.split("_secret")[0];
  }
  useEffect(() => {
    const fetchCardDetails = async () => {
      if (!selectedTicket?.transaction_id || selectedTicket?.amount === 0) {
        return; // Don't fetch for comp tickets
      }

      const paymentId = extractPaymentId(selectedTicket.transaction_id);

      try {
        const res = await fetch(`${url}/payment-detail/${paymentId}`);
        const data = await res.json();

        console.log("✅ Payment details:", data);
        setCardDetails(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch payment info:", err);
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [selectedTicket?.transaction_id]);

  useEffect(() => {
    if (!oragnizerId) return;

    const fetchOrganizer = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/get-organizer/${oragnizerId}`);
        setOrganizer(response.data);
        prevValuesRef.current = response.data; // Store initial fetched values
        setDataFetched(true); // Mark that initial data has been fetched
      } catch (error) {
        console.error("Error fetching organizer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizer();
  }, [oragnizerId]);
  const receiptRef = useRef(null);
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${url}/event/get-event-by-id/${eventId}`
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);
  const flyerImgRef = useRef(null);
  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  const handleDownloadReceipt = () => {
    if (!selectedTicket) return;
    setIsDownloadingReceipt(true);

    // Reset the loading state after a short delay
    setTimeout(() => {
      setIsDownloadingReceipt(false);
    }, 1000); // Adjust the timeout duration as needed
  };

  const handleViewQR = (sale) => {
    setSelectedTicket(sale);
    setIsQROpen(true);
  };

  const handleCloseQR = () => {
    setIsQROpen(false);
  };
  // Format date for display
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const formattedDate = dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = dateObj.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate} at ${formattedTime}`;
  };
  const formatAmount = (amount) => {
    return (Math.abs(amount / 100 - 0.89) / 1.09).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const formatAmounts = (amount) => {
    if (!amount || isNaN(amount)) return "0.00";
    return parseFloat(amount).toFixed(2);
  };
  const getTicketTotal = () => {
    const count = selectedTicket?.count || 1;
    const price = (selectedTicket?.amount || 0) / 100;
    return count * price;
  };
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
    if (typeFilter !== "All types") {
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

  const handleSort = (column) => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortColumn(column);
  };

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

  const totalAmount = filteredSalesHistory
    .filter((payment) => payment.refund !== "true")
    .reduce((sum, sale) => {
      if (!sale.amount) return sum;
      const amountAfterFee = (Number(sale.amount / 100) - 0.89) / 1.09;
      return sum + amountAfterFee;
    }, 0);

  const totalRefundAmount = filteredSalesHistory.reduce((sum, sale) => {
    if (sale.refund === "true" && sale.amount) {
      const amountAfterFee = (Number(sale.amount) / 100 - 0.89) / 1.09;
      return sum + amountAfterFee;
    }
    return sum;
  }, 0);

  useEffect(() => {
    setFilteredTotal(totalAmount);
  }, [filteredSalesHistory]);

  useEffect(() => {
    setFilteredRefundTotal(totalRefundAmount);
  }, [filteredSalesHistory]);

  const withdrawalSchema = z.object({
    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .min(1, "Amount must be greater than 0")
      .max(
        accountBalance?.balance?.instant_available[0].amount / 100,
        "Amount cannot exceed available balance"
      ),
    cardId: z.number({
      required_error: "Please select a card",
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(withdrawalSchema),
    mode: "onChange",
    defaultValues: {
      amount: "",
      cardId: cards[0].id,
    },
  });

  const onSubmit = (data) => {
    console.log("Withdrawal data:", data);
    try {
      const payout = axios.post(`${url}/instant-payout`, {
        account_id: accountId,
        amount: data.amount,
        currency: "usd",
      });
      alert("Transfered successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error processing refund or updating status:", error);
      alert("Instant Payout Failed. Please try again.");
    }
  };

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedUserOrganizerId = localStorage.getItem("organizerId");
      const storedAccountID = localStorage.getItem("accountId");
      setAccountId(storedAccountID || "");
      setOragnizerId(storedUserOrganizerId || null);
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

  const fetchBalance = async () => {
    if (organizer && organizer.stripeAccountId) {
      setBalanceLoader(true);
      try {
        const response = await axios.get(
          `${url}/check-user-balance/${organizer.stripeAccountId}`
        );
        setSetAccountBalance(
          response.data || { available: [], instant_available: [], pending: [] }
        );
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setBalanceLoader(false);
      }
    }
  };

  useEffect(() => {
    if (organizer && organizer.stripeAccountId) {
      fetchBalance();
    }
  }, [organizer]);

  const fetchTransfer = async () => {
    if (organizer && organizer.stripeAccountId) {
      try {
        const response = await axios.get(
          `${url}/total-transferred-amount?accountId=${organizer.stripeAccountId}`
        );
        setTransferedAmount(response.data);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  useEffect(() => {
    if (organizer && organizer.stripeAccountId) {
      fetchTransfer();
    }
  }, [organizer]);

  const fetchBankDetails = async () => {
    if (!accountId) {
      console.log("accountId is undefined");
      return;
    }
    try {
      const response = await axios.get(`${url}/bank-accounts/${accountId}`);
      setBankDetails(response.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchBankDetails();
    }
  }, [accountId]);

  const fetchPayout = async () => {
    if (!accountId) {
      console.log("accountId is undefined");
      return;
    }
    try {
      const response = await axios.get(
        `${url}/payout-money-movement/${accountId}`
      );
      setPayoutList(response.data?.payouts);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setHistoryLoader(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchPayout();
    }
  }, [accountId]);

  const fetchOrgEvents = async () => {
    if (!oragnizerId) {
      console.log("oragnizerId is undefined");
      return;
    }
    setOrgEventLoader(true);
    try {
      const response = await axios.get(
        `${url}/organizer-transactions/${oragnizerId}`
      );
      setOrgEventList(response.data?.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setOrgEventLoader(false);
    }
  };

  useEffect(() => {
    if (oragnizerId) {
      fetchOrgEvents();
    }
  }, [oragnizerId]);

  const fetchStatusInstantPayout = async (req, res) => {
    if (!accountId) {
      console.log("accountId is undefined");
      return;
    }
    try {
      const response = await axios.get(
        `${url}/check-instant-eligiblity/${accountId}`
      );
      setStatusInstant(response.data?.instantPayouts);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchStatusInstantPayout();
  }, [accountId]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${url}/event/get-event-by-organizer-id/${oragnizerId}`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [oragnizerId]);

  const ticketPrice = selectedEvent?.amount
    ? ((selectedEvent.amount / 100 - 0.89) / 1.09).toFixed(2)
    : 0;

  const feeAmount = selectedEvent?.amount
    ? (selectedEvent.amount / 100 - parseFloat(ticketPrice)).toFixed(2)
    : 0;

  const maxTotal = selectedEvent?.amount
    ? (selectedEvent.amount / 100).toFixed(2)
    : 0;

  const amountValue = watch("amount", "");

  useEffect(() => {
    if (amountValue) {
      const parsedAmount = parseFloat(amountValue) || 0;
      const maxAllowed = includeFee
        ? parseFloat(maxTotal)
        : parseFloat(ticketPrice);

      if (parsedAmount > maxAllowed) {
        setValue("amount", maxAllowed, { shouldValidate: true });
      }
    }
  }, [amountValue, includeFee, ticketPrice, maxTotal, setValue]);

  const handleMaxClick = () => {
    if (selectedEvent?.amount) {
      setMaxAmount(parseFloat(ticketPrice));

      if (includeFee) {
        setValue("amount", maxTotal, { shouldValidate: true });
      } else {
        setValue("amount", ticketPrice, { shouldValidate: true });
      }
    }
  };

  // const handleFeeToggle = (checked) => {
  //   setIncludeFee(checked);
  //   const currentInputValue = document.querySelector(
  //     'input[type="number"]'
  //   ).value;
  //   const currentAmount = parseFloat(currentInputValue || 0);

  //   if (checked) {
  //     const amountWithoutFee = Math.min(currentAmount, parseFloat(ticketPrice));
  //     const totalWithFee = (amountWithoutFee * 1.09 + 0.89).toFixed(2);
  //     setValue("amount", totalWithFee, { shouldValidate: true });
  //   } else {
  //     const amountWithoutFee = (
  //       (Math.min(currentAmount, parseFloat(maxTotal)) - 0.89) /
  //       1.09
  //     ).toFixed(2);
  //     setValue("amount", amountWithoutFee, { shouldValidate: true });
  //   }
  // };

  // const handleFeeToggle = (checked) => {
  //   setIncludeFee(checked);

  //   // Get current amount value directly from the form state
  //   const currentInputValue = watch("amount") || 0;
  //   const currentAmount = parseFloat(currentInputValue);

  //   if (checked) {
  //     // If including fee, calculate the total with fee
  //     const amountWithoutFee = Math.min(currentAmount, parseFloat(ticketPrice));
  //     const totalWithFee = (amountWithoutFee * 1.09 + 0.89).toFixed(2);
  //     setValue("amount", totalWithFee, { shouldValidate: true });
  //   } else {
  //     // If excluding fee, calculate the amount without fee
  //     const amountWithoutFee = (
  //       (Math.min(currentAmount, parseFloat(maxTotal)) - 0.89) /
  //       1.09
  //     ).toFixed(2);
  //     setValue("amount", amountWithoutFee, { shouldValidate: true });
  //   }
  // };
  const handleFeeToggle = (checked) => {
    setIncludeFee(checked);

    // Get the current amount from the form (defaults to 0 if not set)
    const currentInputValue = watch("amount") || 0;
    const currentAmount = parseFloat(currentInputValue) || 0;

    // Convert feeAmount (which is a string from .toFixed) to a number
    const fee = parseFloat(feeAmount) || 0;

    // When checked, add fee; when unchecked, subtract fee
    const newAmount = checked
      ? (currentAmount + fee).toFixed(2)
      : (currentAmount - fee).toFixed(2);

    setValue("amount", newAmount, { shouldValidate: true });
  };

  const onSubmitRefund = async () => {
    //console.log("Refund", amountValue)
    try {
      const refundRequest = axios.post(`${url}/refund`, {
        paymentIntentId: selectedEvent.transaction_id.split("_secret_")[0],
        amount: amountValue,
        organizerId: oragnizerId,
      });

      const updateStatusRequest = axios.post(`${url}/updateRefundStatus`, {
        paymentId: selectedEvent.transaction_id,
        refund: true,
      });

      const [refundResponse, statusResponse] = await Promise.all([
        refundRequest,
        updateStatusRequest,
      ]);

      alert("Refund initiated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error processing refund or updating status:", error);
      alert("Refund or status update failed. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <div className="m-4 mb-2 z-20">
        <SidebarToggle />
      </div>
      <div className="min-h-screen text-white p-6 max-w-7xl mx-auto @container">
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">Wallet</h1>
            <p className="text-white/70">
              Manage your earnings and transactions
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {/* Balance Card */}
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-5 md:gap-2 justify-between items-center p-4">
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-white/70">Available balance</p>
                  <span className="text-3xl font-bold mt-1">
                    {balanceLoader ? (
                      <>
                        <div className="text-center">
                          <Spin size="small" />
                        </div>
                      </>
                    ) : (
                      <>
                        $
                        {accountBalance?.balance?.pending?.[0]?.amount
                          ? (
                              accountBalance?.balance?.pending[0].amount / 100
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : 0}
                      </>
                    )}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="text-sm border border-white/10 px-3 py-2 rounded-full flex items-center gap-2"
                  >
                    <ClockIcon fill="white" />
                    <span>History</span>
                  </button>
                  <div>
                    <button
                      disabled={!statusInstant}
                      onClick={() => setIsWithdrawOpen(true)}
                      className={`text-sm ${
                        statusInstant === false
                          ? "bg-[#ffffff] bg-opacity-30"
                          : "bg-white"
                      } text-black px-3 py-2 cursor-pointer rounded-full flex items-center gap-2 font-semibold`}
                    >
                      <WithdrawIcon />
                      <span>
                        Withdraw instantly -{" "}
                        {statusInstant === false ? "Not Eligible" : ""}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Processing Payment Alert */}

              <div className="flex items-center bg-[#28180D] p-4 relative overflow-hidden before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-0.2rem)] before:h-[calc(100%-0.2rem)] before:border before:border-[#F97316]/20 before:z-0 before:rounded-b-lg">
                <div className="flex items-center gap-x-2 z-0">
                  {[...Array(100)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 -translate-y-1/2 h-[calc(100%+1rem)] w-px bg-[#F97316]/10 rotate-[40deg]"
                      style={{ right: `${i * 15}px` }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-x-2 z-10">
                  <ClockIcon fill="#F97316" />
                  {balanceLoader ? (
                    <>
                      <div className="text-center">
                        <Spin size="small" />
                      </div>
                    </>
                  ) : (
                    <>
                      {accountBalance.transit ? (
                        <>
                          <p className="text-[#F97316]">
                            ${(accountBalance?.transit / 100).toFixed(2)} is
                            processing
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[#F97316]">No payouts scheduled</p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <CardIcon />
                  <div className="flex items-center gap-x-2">
                    <p className="font-medium">
                      {bankDetails?.bankAccounts?.[0]?.bank_name}{" "}
                      {bankDetails?.bankAccounts?.[0]?.last4}
                    </p>

                    <span className="text-xs font-semibold bg-white/5 rounded-full h-6 flex items-center px-2.5">
                      DEFAULT
                    </span>
                  </div>
                </div>
                <button className="text-white/70 group h-6 w-6 flex items-center justify-center">
                  <ArrowRightIcon />
                </button>
              </div>
            </div>

            {/*revenue history */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 p-4">
                <p className="text-sm text-white/70">Total revenue</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-2xl font-bold">
                    {orgEventLoader ? (
                      <>
                        <div className="text-center">
                          <Spin size="small" />
                        </div>
                      </>
                    ) : (
                      <>
                        $
                        {filteredTotal
                          ? filteredTotal.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "0.00"}
                      </>
                    )}
                  </span>
                  {/* <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded-full border border-[#10B981]/10">
                                        +8%
                                    </span> */}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 p-4">
                <p className="text-sm text-white/70">Refunds</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-2xl font-bold">
                    {orgEventLoader ? (
                      <>
                        <div className="text-center">
                          <Spin size="small" />
                        </div>
                      </>
                    ) : (
                      <>
                        $
                        {filteredRefundTotal.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </>
                    )}
                  </span>
                  {/* <span className="text-xs text-[#F43F5E] bg-[#F43F5E]/10 px-1.5 py-0.5 rounded-full border border-[#F43F5E]/10">
                                        -8%
                                    </span> */}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 ">
            {/* Filter Buttons */}
            <div className="flex flex-col @4xl:flex-row gap-3 w-full justify-between items-start @4xl:items-center">
              <div className="flex gap-3 items-center">
                {/* All time filter */}
                <Dropdown>
                  <DropdownTrigger>
                    <button className="flex items-center gap-2 text-sm border border-white/10 px-3 py-2 rounded-full">
                      <TimeFilterIcon />
                      {timeFilter}
                      <DropdownArrowIcon />
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                    <DropdownItem
                      onClick={() => setTimeFilter("All time")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      All time
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
                      <AllTypesFilterIcon />
                      {typeFilter}
                      <DropdownArrowIcon />
                    </button>
                  </DropdownTrigger>
                  <DropdownContent className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                    <DropdownItem
                      onClick={() => setTypeFilter("All types")}
                      className="px-4 py-2 hover:bg-white/5 text-white"
                    >
                      All types
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
                      <TicketIcon />
                      {ticketFilter}
                      <DropdownArrowIcon />
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
              </div>

              <div className="relative w-full @4xl:w-fit flex justify-end h-fit">
                <input
                  type="text"
                  placeholder="Search sales..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/10 @4xl:w-[250px]"
                />
                <SearchIcon />
              </div>
            </div>

            <div className="border rounded-xl h-fit border-white/10 overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/[0.03] [&>th]:min-w-[250px] @4xl:[&>th]:min-w-fit last:[&>th]:min-w-fit">
                      <th className="p-4 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <NameIcon />
                          Name
                        </div>
                      </th>

                      <th className="p-4">
                        <div className="flex items-center gap-2">
                          <GlobeIcon />
                          Event
                        </div>
                      </th>
                      <th className="p-4 ">
                        <div className="flex items-center gap-2">
                          <TicketIcon />
                          Ticket
                        </div>
                      </th>
                      <th className="p-4" onClick={() => handleSort("date")}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <DateIcon />
                          Date
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
                          <TypeIcon />
                          Type
                        </div>
                      </th>
                      <th className="p-4" onClick={() => handleSort("amount")}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <DollarIcon />
                          Amount
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
                                sortColumn === "amount" && sortOrder === "asc"
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
                                sortColumn === "amount" && sortOrder === "desc"
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
                          <StatusIcon />
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
                                            <ViewTicketIcon />
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
                                              <ViewQRIcon />

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
                                                <RefundIcon />
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
      </div>

      {/* Add Withdraw Dialog */}
      <Dialog
        open={isWithdrawOpen}
        onOpenChange={setIsWithdrawOpen}
        className="!max-w-[400px] border border-white/10 rounded-xl !p-0"
      >
        <DialogContent className="max-h-[90vh] !gap-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-3 bg-white/[0.03] rounded-t-xl border-b border-white/10 p-6">
              <DialogTitle>Withdraw funds instantly</DialogTitle>
              <DialogDescription>
                Withdraw your available balance to your account instantly.
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-4 p-6">
              {/* Amount Input */}
              <div className="flex flex-col items-start justify-between gap-4">
                <div className="flex flex-col gap-3 w-full">
                  <span className="text-sm font-medium text-white">Amount</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      {...register("amount", { valueAsNumber: true })}
                      className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg pl-8 pr-20 py-2.5 focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "amount",
                          accountBalance?.balance?.instant_available?.[0]
                            ?.amount
                            ? accountBalance?.balance?.instant_available[0]
                                .amount / 100
                            : 0,
                          { shouldValidate: true }
                        )
                      }
                      className="absolute right-0 top-0 h-full px-3 text-xs text-white/50 hover:text-white transition-colors border-l border-white/10"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm text-white/60">
                      Instant Available:
                    </span>
                    <span className="text-sm font-medium text-white">
                      $
                      {accountBalance?.balance?.instant_available?.[0]?.amount
                        ? (
                            accountBalance?.balance?.instant_available[0]
                              .amount / 100
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : 0}
                    </span>
                  </div>
                  {errors.amount && (
                    <span className="text-xs text-red-500">
                      {errors.amount.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Selection */}
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-white">
                  Accounts available
                </label>
                <Dropdown>
                  <DropdownTrigger className="w-full">
                    <button
                      type="button"
                      className="flex w-full justify-between items-center text-white gap-2 border border-white/10 hover:bg-white/10 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      <div className="flex items-center gap-2">
                        {/* <div className="border border-white/10 rounded h-6 w-fit px-1 py-1 flex items-center justify-center">
                                                    {cardIcons[selectedCard.type]}
                                                </div> */}
                        <span>
                          •••• {bankDetails?.bankAccounts?.[0]?.last4}
                        </span>
                      </div>
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
                  <DropdownContent className="w-full bg-[#151515] border border-white/10 tex-white rounded-lg shadow-lg overflow-hidden">
                    {/* {cards.map((card) => ( */}
                    <DropdownItem
                      key={1}
                      className="px-4 py-2 hover:bg-white/5 transition-colors text-white"
                      onClick={() => {
                        setSelectedCard("");
                        setValue("cardId", 1, { shouldValidate: true });
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="border border-white/10 rounded h-6 w-fit px-1 py-1 flex items-center justify-center">
                          {bankDetails?.bankAccounts?.[0]?.bank_name}
                        </div>
                        <span>
                          •••• {bankDetails?.bankAccounts?.[0]?.last4}
                        </span>
                      </div>
                    </DropdownItem>
                    {/* ))} */}
                  </DropdownContent>
                </Dropdown>
                {errors.cardId && (
                  <span className="text-xs text-red-500">
                    {errors.cardId.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 p-6 pt-0">
              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black border-white/10 border text-center rounded-full h-9 px-4 focus:outline-none flex items-center justify-center gap-2 font-semibold transition-colors text-sm"
              >
                Withdraw funds
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add History Dialog */}
      <Dialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        className="!max-w-[1000px] border border-white/10 rounded-xl !p-0"
      >
        <DialogContent className="max-h-[90vh] !gap-0">
          <div className="flex flex-col gap-y-3 bg-white/[0.03] rounded-t-xl border-b border-white/10 p-6">
            <DialogTitle>Payout History</DialogTitle>
            <DialogDescription>
              This is a list of all the payouts you have made.
            </DialogDescription>
          </div>

          <div className="border border-white/10 rounded-lg max-h-[80vh] overflow-y-auto m-6 hide-scrollbar">
            <table className="w-full text-white text-sm">
              <thead className="bg-white/[0.03] border-b border-white/10">
                <tr className="text-left [&>th]:font-medium [&>th]:min-w-[180px]">
                  <th className="p-4 text-sm font-medium text-white/70">
                    Amount
                  </th>
                  <th className="p-4 text-sm font-medium text-white/70">
                    Account
                  </th>
                  <th className="p-4 text-sm font-medium text-white/70">
                    Initiated Date
                  </th>
                  <th className="p-4 text-sm font-medium text-white/70">
                    Est. Arrival
                  </th>
                  {/* <th className="p-4 text-sm font-medium text-white/70">
                                        Reference
                                    </th> */}
                  <th className="p-4 text-sm font-medium text-white/70">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payoutList.map((payout, index) => (
                  <tr key={index} className="hover:bg-white/[0.01]">
                    <td className="p-4">
                      $
                      {(payout.amount / 100).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      {/* <div className="border border-white/10 rounded h-6 w-fit px-1 py-1 flex items-center justify-center">
                                                {bankDetails?.bankAccounts?.[0]?.bank_name}
                                            </div> */}
                      •••• {bankDetails?.bankAccounts?.[0]?.last4}
                    </td>
                    <td className="p-4">
                      {(() => {
                        const dateObj = new Date(payout.created * 1000);
                        const formattedDate = dateObj.toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        );
                        const formattedTime = dateObj.toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        );
                        return `${formattedDate}, ${formattedTime}`;
                      })()}
                    </td>
                    <td className="p-4">
                      {(() => {
                        const dateObj = new Date(payout.arrival_date * 1000);
                        const formattedDate = dateObj.toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        );
                        const formattedTime = dateObj.toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        );
                        return `${formattedDate}, ${formattedTime}`;
                      })()}
                    </td>
                    {/* <td className="p-4">#{payout.id.slice(-6)}</td> */}

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium`}
                      >
                        {statusIcons[payout.status]}
                        {(payout.status === "in_transit"
                          ? "processing"
                          : payout.status === "paid"
                          ? "completed"
                          : payout.status
                        ).replace(/^./, (char) => char.toUpperCase())}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Make Refund */}
      <Dialog
        open={isRefundOpen}
        onOpenChange={setIsRefundOpen}
        className="!max-w-[400px] border border-white/10 rounded-xl !p-0"
      >
        <DialogContent className="max-h-[90vh] !gap-0">
          <form onSubmit={handleSubmit(onSubmitRefund)}>
            <div className="flex flex-col gap-y-3 bg-white/[0.03] rounded-t-xl border-b border-white/10 p-6">
              <DialogTitle>Refund Payment</DialogTitle>
              <DialogDescription>
                Refund may take 5-10 days to appear on your statement. Payment
                transaction and platform fees won't be returned by avenue, but
                there are no additional fee for the refund. Learn more
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-4 p-6">
              {/* Amount Input */}
              <div className="flex flex-col items-start justify-between gap-4">
                <div className="flex flex-col gap-3 w-full">
                  <span className="text-sm font-medium text-white">Amount</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("amount", {
                        valueAsNumber: true,
                        // When the amount changes, uncheck the fee checkbox if needed
                        onChange: (e) => {
                          if (includeFee) {
                            setIncludeFee(false);
                          }
                        },
                        validate: (value) => {
                          setAmountEntered(!!value);
                          if (!selectedEvent?.amount) return true;
                          const maxRefundableAmount = includeFee
                            ? parseFloat(maxTotal)
                            : parseFloat(ticketPrice);
                          return (
                            value <= maxRefundableAmount ||
                            `Amount cannot exceed ${maxRefundableAmount}`
                          );
                        },
                      })}
                      className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg pl-8 pr-20 py-2.5 focus:outline-none w-full"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        handleMaxClick();
                        if (includeFee) {
                          setIncludeFee(false);
                        }
                      }}
                      className="absolute right-0 top-0 h-full px-3 text-xs text-white/50 hover:text-white transition-colors border-l border-white/10"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm text-white/60">Ticket price:</span>
                    <span className="text-sm font-medium text-white">
                      ${ticketPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Checkbox
                      id="includeFee"
                      checked={includeFee}
                      onCheckedChange={handleFeeToggle}
                      className="border-white/10 rounded bg-white/5 data-[state=checked]:bg-[#34B2DA] data-[state=checked]:text-black"
                    />

                    <span className="text-sm text-white/60">
                      Refund fee (9% + $0.89):
                    </span>
                    <span className="text-sm font-medium text-white">
                      ${feeAmount}
                    </span>
                  </div>
                  {errors.amount && (
                    <span className="text-xs text-red-500">
                      {errors.amount.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-6 pt-0">
              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black border-white/10 border text-center rounded-full h-9 px-4 focus:outline-none flex items-center justify-center gap-2 font-semibold transition-colors text-sm"
              >
                Refund
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div ref={receiptRef} style={{ display: "none" }}>
        <div className="bg-white min-h-screen flex justify-center">
          <div className="w-[816px] py-16 relative">
            {/* Logo and Order Number */}
            <div className="flex justify-between items-start px-16 mb-8">
              <div className="w-[177px] h-[26px]">
                <img src={logoImage} alt="Avenue" className="h-full" />
              </div>
              <div className="text-sm">
                <span className="text-black">Order </span>
                <span className="text-black/60">
                  #{selectedTicket?.transaction_id?.slice(-6)}
                </span>
              </div>
            </div>
            <div className="mx-16 bg-white rounded-[20px] border border-black/5 overflow-hidden">
              <div className="flex">
                {/* Left Content */}
                <div className="flex-1 p-6">
                  <h2 className="text-2xl font-medium mb-4">
                    {selectedTicket?.party?.event_name || "Event Name"}
                  </h2>

                  <div className="space-y-4">
                    {/* Date Row */}
                    <div className="flex items-center gap-2 text-black/60">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.33333 1.33333C5.70152 1.33333 6 1.63181 6 1.99999V2.66666H10V1.99999C10 1.63181 10.2985 1.33333 10.6667 1.33333C11.0349 1.33333 11.3333 1.63181 11.3333 1.99999V2.66666H12C13.1046 2.66666 14 3.56209 14 4.66666V5.99999H2V4.66666C2 3.56209 2.89543 2.66666 4 2.66666H4.66667V1.99999C4.66667 1.63181 4.96515 1.33333 5.33333 1.33333Z"
                          fill="black"
                          fillOpacity="0.5"
                        />
                        <path
                          d="M2 12V7.33333H14V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12Z"
                          fill="black"
                          fillOpacity="0.5"
                        />
                      </svg>
                      <span className="text-sm">
                        {selectedTicket?.date
                          ? formatDate(
                              new Date(selectedTicket.date),
                              "EEEE, dd MMM, HH:mm (z)"
                            )
                          : "Date not provided"}
                      </span>
                    </div>

                    {/* Venue Row */}
                    <div className="flex items-start gap-2 text-black/60">
                      <svg
                        width="12"
                        height="14"
                        viewBox="0 0 12 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0.666626 5.66666C0.666626 2.72114 3.05444 0.333328 5.99996 0.333328C8.94549 0.333328 11.3333 2.72114 11.3333 5.66666C11.3333 7.31613 10.6039 8.8392 9.75369 10.0627C8.89849 11.2935 7.87723 12.2841 7.19476 12.8825C6.50556 13.4868 5.49436 13.4868 4.80516 12.8825C4.12267 12.2841 3.10141 11.2935 2.24619 10.0627C1.39605 8.8392 0.666626 7.31613 0.666626 5.66666ZM5.99849 7.33333C6.91896 7.33333 7.66516 6.58713 7.66516 5.66666C7.66516 4.74619 6.91896 3.99999 5.99849 3.99999C5.07803 3.99999 4.33183 4.74619 4.33183 5.66666C4.33183 6.58713 5.07803 7.33333 5.99849 7.33333Z"
                          fill="black"
                          fillOpacity="0.5"
                        />
                      </svg>
                      <div className="text-sm flex-1">
                        <p>
                          {selectedTicket?.party?.venue_name ||
                            "Venue not provided"}
                        </p>
                        <p>
                          {selectedTicket?.party?.address ||
                            "Address not provided"}
                        </p>
                        {/* <p>{selectedTicket?.party?.venue_city || "City not provided"}</p> */}
                      </div>
                    </div>

                    {/* Tickets Row */}
                    <div className="flex items-center gap-2 text-black/60">
                      <svg
                        width="14"
                        height="12"
                        viewBox="0 0 14 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.6 0.399994C12.0774 0.399994 12.5352 0.589636 12.8728 0.927202C13.2103 1.26477 13.4 1.7226 13.4 2.19999V3.17119C13.4 3.50959 13.1784 3.80159 12.8936 3.98639C12.5577 4.20408 12.2817 4.50238 12.0907 4.85409C11.8996 5.20581 11.7997 5.59975 11.8 5.99999C11.8 6.84399 12.2352 7.58559 12.8936 8.01359C13.1784 8.19839 13.4 8.49039 13.4 8.82959V9.79999C13.4 10.2774 13.2103 10.7352 12.8728 11.0728C12.5352 11.4104 12.0774 11.6 11.6 11.6H2.39998C1.92259 11.6 1.46475 11.4104 1.12718 11.0728C0.789618 10.7352 0.599976 10.2774 0.599976 9.79999V8.82959C0.599976 8.49039 0.821576 8.19839 1.10638 8.01359C1.44219 7.79586 1.71818 7.49755 1.9092 7.14584C2.10021 6.79414 2.20017 6.40022 2.19998 5.99999C2.20025 5.59975 2.10031 5.20581 1.90929 4.85409C1.71827 4.50238 1.44224 4.20408 1.10638 3.98639C0.821576 3.80159 0.599976 3.50959 0.599976 3.17039V2.19999C0.599976 1.7226 0.789618 1.26477 1.12718 0.927202C1.46475 0.589636 1.92259 0.399994 2.39998 0.399994H11.6ZM9.79998 3.91679C9.79998 3.75766 9.73676 3.60505 9.62424 3.49253C9.51172 3.38001 9.35911 3.31679 9.19998 3.31679C9.04085 3.31679 8.88823 3.38001 8.77571 3.49253C8.66319 3.60505 8.59998 3.75766 8.59998 3.91679V4.75039C8.59998 4.90952 8.66319 5.06214 8.77571 5.17466C8.88823 5.28718 9.04085 5.35039 9.19998 5.35039C9.35911 5.35039 9.51172 5.28718 9.62424 5.17466C9.73676 5.06214 9.79998 4.90952 9.79998 4.75039V3.91679ZM9.79998 7.25039C9.79998 7.09126 9.73676 6.93865 9.62424 6.82613C9.51172 6.71361 9.35911 6.65039 9.19998 6.65039C9.04085 6.65039 8.88823 6.71361 8.77571 6.82613C8.66319 6.93865 8.59998 7.09126 8.59998 7.25039V8.08319C8.59998 8.24232 8.66319 8.39494 8.77571 8.50746C8.88823 8.61998 9.04085 8.68319 9.19998 8.68319C9.35911 8.68319 9.51172 8.61998 9.62424 8.50746C9.73676 8.39494 9.79998 8.24232 9.79998 8.08319V7.25039Z"
                          fill="black"
                          fillOpacity="0.5"
                        />
                      </svg>
                      <span className="text-sm">
                        {selectedTicket?.tickets?.ticket_name
                          ? `${selectedTicket.tickets.ticket_name} x ${
                              selectedTicket?.count || 1
                            }`
                          : `Ticket x ${selectedTicket?.count || 1}`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 text-sm text-black/60">
                    <p className="font-semibold">Refund Policy</p>
                    <p>
                      {selectedTicket?.refund_policy ||
                        "Please contact the organizer directly for refund queries."}
                    </p>
                  </div>
                </div>

                {/* Right Content */}
                <div className="w-[200px] p-4">
                  <div className="aspect-[3/4] rounded-lg mb-4">
                    <img
                      ref={flyerImgRef}
                      src={selectedTicket?.party?.flyer || ""}
                      alt="Event"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <img
                      src={selectedTicket?.qrcode || ""}
                      alt="QR Code"
                      className="w-full h-full"
                      style={{ imageRendering: "pixelated" }}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/150?text=QR+Code+Not+Available")
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Order Summary Card */}
            <div className="mx-16 mt-6 bg-white rounded-[20px] border border-black/5 overflow-hidden">
              <div className="border-b border-black/5 p-4">
                <h3 className="text-base font-medium">Order summary</h3>
              </div>
              <div className="p-5 flex gap-6">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Purchase</h4>
                  <div className="space-y-1 text-sm text-black/60">
                    <p>Organizer: {organizer.name}</p>
                    <p>Order #{selectedTicket?.transaction_id?.slice(-6)}</p>
                    <p>
                      Order Date:{" "}
                      {selectedTicket?.date
                        ? formatDate(
                            new Date(selectedTicket.date),
                            "dd MMM, HH:mm"
                          )
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Billing</h4>
                  <div className="space-y-1 text-sm text-black/60">
                    <p>
                      Name:{" "}
                      {cardDetails?.paymentIntent?.metadata?.customer_name ||
                        "Customer"}
                    </p>

                    <p>Payment method:</p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const brand = cardDetails?.paymentMethod?.card?.brand;
                        const last4 =
                          cardDetails?.paymentMethod?.card?.last4 ||
                          cardDetails?.paymentMethod?.card?.dynamic_last4 ||
                          "0000";
                        const wallet =
                          cardDetails?.paymentMethod?.card?.wallet?.type;

                        return (
                          <>
                            {wallet && paymentIcons[wallet] && (
                              <img
                                src={paymentIcons[wallet]}
                                alt={wallet}
                                className="w-7 h-5 object-contain"
                              />
                            )}

                            {brand && paymentIcons[brand] && (
                              <img
                                src={paymentIcons[brand]}
                                alt={brand}
                                className="w-8 h-6 object-contain"
                              />
                            )}

                            <span className="font-medium text-black">
                              {brand?.charAt(0).toUpperCase() + brand?.slice(1)}{" "}
                              * {last4}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Order Card */}
            <div className="mx-16 mt-6 bg-white rounded-[20px] border border-black/5 overflow-hidden">
              <div className="border-b border-black/5 p-4">
                <h3 className="text-base font-medium">Your Order</h3>
              </div>

              {/* Ticket Item */}
              <div className="border-b border-black/5">
                <div className="p-4 flex items-center">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-black/60 uppercase tracking-wider">
                      TICKET
                    </p>
                    <p className="text-base font-medium">
                      {selectedTicket?.tickets?.ticket_name}
                    </p>
                    <p className="text-[10px] text-black/60">
                      {selectedTicket?.count || 1} x $
                      {formatAmount(selectedTicket?.amount || 0)}
                    </p>
                  </div>
                  <div className="text-base font-medium">
                    $
                    {formatAmount(
                      (selectedTicket?.count || 1) *
                        (selectedTicket?.amount || 0)
                    )}
                  </div>
                </div>
              </div>

              {/* Fees */}
              <div className="border-b border-black/5">
                <div className="p-4 flex items-center">
                  <div className="flex-1">
                    <p className="text-base font-medium">Fees</p>
                    <div className="text-[10px] text-black/60">
                      <p>Platform fee - $5.39</p>
                      <p>Custom fee - $5.00</p>
                    </div>
                  </div>
                  <div className="text-base font-medium">
                    ${formatAmounts(5.39 + 5.0)}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="p-4 flex items-center">
                <div className="flex-1">
                  <p className="text-base font-bold">Total Charges</p>
                </div>
                <div className="text-base font-bold">
                  ${formatAmounts(getTicketTotal() + 5.39 + 5.0)}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mx-16 mt-8">
              <h3 className="text-base font-medium mb-2">
                Terms and Conditions
              </h3>
              <div className="text-[10px] text-black/60 space-y-2">
                <p>
                  <strong>Support & Assistance:</strong>
                  <br />
                  For any questions regarding your purchase, please contact
                  Avenue Ticketing Support at support@avenue.tickets or visit
                  our support page at www.avenue.tickets/support.
                </p>
                <p>
                  <strong>Event Organizer Contact:</strong>
                  <br />
                  For event-specific inquiries, including venue details,
                  accessibility, or event policies, please contact the event
                  organizer at{" "}
                  {selectedTicket?.party?.organizer_email ||
                    "[Organizer Email]"}
                  .
                </p>
                <p>
                  <strong>Refund & Cancellation Policy:</strong>
                  <br />
                  Refunds and cancellations are subject to the event organizer's
                  policy. Please refer to the event listing for more details or
                  contact the organizer directly. Avenue Ticketing does not
                  guarantee refunds unless specified by the event organizer.
                </p>
                <p>
                  <strong>Terms & Conditions:</strong>
                  <br />
                  By purchasing this ticket, you agree to Avenue Ticketing's
                  Terms of Service and Privacy Policy. Tickets are
                  non-transferable unless stated otherwise by the event
                  organizer. Unauthorized resale of tickets is strictly
                  prohibited.
                </p>
                <p>
                  <strong>Important Notice:</strong>
                  <br />
                  This receipt serves as proof of payment. Your tickets may be
                  attached separately or accessible via your Avenue Ticketing
                  account. Please check your email for further details.
                </p>
                <p>
                  © {new Date().getFullYear()} Avenue Ticketing, Inc. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* View Ticket Dialog */}
      <Dialog
        open={isViewTicketOpen}
        onOpenChange={(open) => {
          setIsViewTicketOpen(open);
          if (!open) {
            setCardDetails(null); // Clear card details when dialog closes
          }
        }}
        className="!max-w-[400px] border border-white/10 rounded-xl !p-0"
      >
        <DialogContent className="max-h-[90vh] !gap-0 text-white overflow-y-auto">
          <div className="flex flex-col gap-y-3 bg-white/[0.03] rounded-t-xl border-b border-white/10 p-6">
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogDescription>
              View the details of the ticket.
            </DialogDescription>
          </div>
          <div className="flex flex-col">
            {/* Ticket Image and Basic Info */}
            <div className="flex gap-4 p-6">
              <div className="w-16 h-16 rounded-lg bg-white/10">
                <img src={selectedTicket?.party?.flyer || ""} alt="" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">
                  {selectedTicket?.party?.event_name || "Event Name"}
                </h3>
                <p className="text-sm text-white/70">
                  Reference: #
                  {selectedTicket?.transaction_id?.slice(-6) || "000000"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {statusIcons["paid"]}
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Transaction Details */}
            <div className="flex flex-col gap-4 p-6">
              <h4 className="text-sm font-medium text-white/70">
                Transaction Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {selectedTicket?.transaction_id &&
                  selectedTicket?.amount > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-white/50">Amount</span>
                      <span className="font-medium">
                        $
                        {selectedTicket?.amount
                          ? formatAmount(selectedTicket.amount)
                          : "0.00"}
                      </span>
                    </div>
                  )}
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white/50">Date</span>
                  <span className="font-medium">
                    {selectedTicket?.date
                      ? formatDate(selectedTicket.date)
                      : "Today"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {selectedTicket?.transaction_id &&
                    selectedTicket?.amount > 0 && (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-white/50">
                          Payment Method
                        </span>

                        {cardDetails?.paymentMethod?.card ? (
                          <div className="flex items-center gap-2">
                            {(() => {
                              const brand =
                                cardDetails.paymentMethod.card.brand;
                              const last4 =
                                cardDetails.paymentMethod.card.last4 ||
                                cardDetails.paymentMethod.card.dynamic_last4 ||
                                "0000";
                              const wallet =
                                cardDetails.paymentMethod.card.wallet?.type;

                              return (
                                <>
                                  {wallet && paymentIcons[wallet] && (
                                    <img
                                      src={paymentIcons[wallet]}
                                      alt={wallet}
                                      className="w-7 h-5 object-contain"
                                    />
                                  )}

                                  {brand && paymentIcons[brand] && (
                                    <img
                                      src={paymentIcons[brand]}
                                      alt={brand}
                                      className="w-8 h-6 object-contain"
                                    />
                                  )}

                                  <span className="font-medium text-white">
                                    {brand?.charAt(0).toUpperCase() +
                                      brand?.slice(1)}{" "}
                                    * {last4}
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <span className="text-sm text-white/40">
                            Loading...
                          </span>
                        )}
                      </div>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white/50">Type</span>
                  <div className="flex items-center gap-2">
                    {saleTypeIcons["Sale"]}
                    <span className="font-medium">Sale</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2 p-6 border-t border-white/10">
              <PDFDownloadLink
                document={<ReceiptDownload data={selectedTicket} />}
                fileName={`receipt-${selectedTicket?.transaction_id}.pdf`}
                onClick={handleDownloadReceipt} // Trigger download on click
              >
                <button
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center"
                  disabled={isDownloadingReceipt}
                >
                  {isDownloadingReceipt ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Download Receipt"
                  )}
                </button>
              </PDFDownloadLink>
              <button
                onClick={() =>
                  (window.location.href = "mailto:support@avenue.tickets")
                }
                className="flex-1 bg-white hover:bg-white/90 text-black rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      {isQROpen && selectedTicket && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCloseQR}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
            <div className="bg-[#151515] rounded-xl overflow-hidden shadow-lg relative">
              <button
                onClick={handleCloseQR}
                className="absolute right-3 top-3 text-gray-400 hover:text-white z-10"
              >
                <X size={16} />
              </button>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BsFillTicketFill color="#cccccc" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide font-inter font-semibold">
                    Ticket Pass
                  </span>
                </div>
                <div className="flex justify-start mb-4 mt-5">
                  <img
                    src={selectedTicket?.party?.flyer}
                    alt="Event Profile"
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                </div>

                <div className="text-lg text-white mb-2 font-inter">
                  {selectedTicket?.party?.start_date
                    ? formatDate(selectedTicket.party.start_date)
                    : "Date information unavailable"}
                </div>
                <div className="flex flex-row space-x-3">
                  <div className="text-xs text-gray-400 font-inter">
                    {selectedTicket?.party?.event_name}
                  </div>
                  <div className="text-xs text-gray-400">
                    <LocationIcon />
                  </div>
                  <div className="text-xs text-gray-400 font-inter">
                    {selectedTicket?.party?.venue_name}
                  </div>
                </div>
              </div>
              <div className="px-2 rounded-lg">
                <div className="bg-[#ffffff] p-7 flex justify-center items-center relative rounded-t-2xl">
                  <div>
                    <img
                      src={selectedTicket?.qrcode}
                      alt="QR Code"
                      style={{ imageRendering: "pixelated" }}
                      className="w-full max-w-xs rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center bg-[#0b6694] bg-opacity-50 p-1 rounded-b-2xl px-4">
                  <div className="flex items-center">
                    <div className="rounded-full py-1.5">
                      <span className="text-xs text-white font-medium font-inter">
                        {selectedTicket?.tickets?.ticket_name
                          ? `${selectedTicket.tickets.ticket_name} x ${selectedTicket.count}`
                          : `Ticket x ${selectedTicket.count || 1}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-white text-md font-bold font-inter">
                    $
                    {selectedTicket?.amount
                      ? selectedTicket.amount / 100
                      : "0.00"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

const FetchRefundStatus = ({ transactionId }) => {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const fetchStatus = async () => {
      if (!transactionId) return;
      const cleanTransactionId = transactionId.split("_secret")[0]; // Remove _secret part

      try {
        const response = await axios.get(
          `${url}/refund-status/${cleanTransactionId}`
        );
        console.log(response.data);
        setStatus(
          response.data?.data ? response.data.data[0]?.status : "No Refund"
        );
      } catch (error) {
        console.error("Error fetching refund status:", error);
        setStatus("Error");
      }
    };

    fetchStatus();
  }, [transactionId]);

  return <>{status === "succeeded" ? "Refunded" : status}</>;
};
