import SidebarLayout from "../../components/layouts/SidebarLayout";
import SidebarToggle from "../../components/layouts/SidebarToggle";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/Dailog";
import { useEffect, useState, useRef } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "../../components/ui/Dropdown";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Ellipsis, X } from "lucide-react";
import { BsFillTicketFill } from "react-icons/bs";
import url from "../../constants/url";
import axios from "axios";
import { Spin } from "antd";
import "../../css/global.css";
import {
  DirectionAwareMenu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../../components/ui/DirectionAwareMenu";
import { Checkbox } from "../../components/ui/Checkbox";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Only if you want to use autoTable
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react";
import html2pdf from "html2pdf.js";
import paymentIcons from "../../lib/paymentIcons";
import { BeatLoader } from "react-spinners";

const salesHistory = [
  {
    amount: 198,
    cardLast4: "4468",
    cardType: "visa",
    date: "Today 14:23",
    reference: "#R291012",
    status: "completed",
    type: "sale",
    ticket: "After Hours Neon",
  },
  {
    amount: -99,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Today 13:55",
    reference: "#R291013",
    status: "completed",
    type: "refund",
    ticket: "Electric Dreams",
  },
  {
    amount: 299,
    cardLast4: "8765",
    cardType: "visa",
    date: "Today 12:30",
    reference: "#R291014",
    status: "Under review",
    type: "sale",
    ticket: "Synthwave Party",
  },
  {
    amount: -148,
    cardLast4: "9012",
    cardType: "mastercard",
    date: "Yesterday 23:15",
    reference: "#R291015",
    status: "processing",
    type: "refund",
    ticket: "Retro Wave Night",
  },
  {
    amount: 248,
    cardLast4: "3456",
    cardType: "visa",
    date: "Yesterday 22:45",
    reference: "#R291016",
    status: "completed",
    type: "sale",
    ticket: "Cyber Punk Festival",
  },
  {
    amount: 179,
    cardLast4: "7890",
    cardType: "mastercard",
    date: "Yesterday 20:10",
    reference: "#R291017",
    status: "failed",
    type: "sale",
    ticket: "Neon Lights Show",
  },
  {
    amount: -89,
    cardLast4: "2345",
    cardType: "visa",
    date: "Jan 24, 2024",
    reference: "#R291018",
    status: "completed",
    type: "refund",
    ticket: "Digital Dreams",
  },
  {
    amount: 399,
    cardLast4: "6789",
    cardType: "mastercard",
    date: "Jan 24, 2024",
    reference: "#R291019",
    status: "completed",
    type: "sale",
    ticket: "Future Bass Night",
  },
];

const saleTypeIcons = {
  Sale: (
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
        d="M1.75 3C1.75 2.73478 1.85536 2.48043 2.04289 2.29289C2.23043 2.10536 2.48478 2 2.75 2H14.75C15.0152 2 15.2696 2.10536 15.4571 2.29289C15.6446 2.48043 15.75 2.73478 15.75 3V9C15.75 9.26522 15.6446 9.51957 15.4571 9.70711C15.2696 9.89464 15.0152 10 14.75 10H2.75C2.48478 10 2.23043 9.89464 2.04289 9.70711C1.85536 9.51957 1.75 9.26522 1.75 9V3ZM10.75 6C10.75 6.53043 10.5393 7.03914 10.1642 7.41421C9.78914 7.78929 9.28043 8 8.75 8C8.21957 8 7.71086 7.78929 7.33579 7.41421C6.96071 7.03914 6.75 6.53043 6.75 6C6.75 5.46957 6.96071 4.96086 7.33579 4.58579C7.71086 4.21071 8.21957 4 8.75 4C9.28043 4 9.78914 4.21071 10.1642 4.58579C10.5393 4.96086 10.75 5.46957 10.75 6ZM4.5 5.25C4.30109 5.25 4.11032 5.32902 3.96967 5.46967C3.82902 5.61032 3.75 5.80109 3.75 6C3.75 6.19891 3.82902 6.38968 3.96967 6.53033C4.11032 6.67098 4.30109 6.75 4.5 6.75C4.69891 6.75 4.88968 6.67098 5.03033 6.53033C5.17098 6.38968 5.25 6.19891 5.25 6C5.25 5.80109 5.17098 5.61032 5.03033 5.46967C4.88968 5.32902 4.69891 5.25 4.5 5.25ZM12.25 6C12.25 5.80109 12.329 5.61032 12.4697 5.46967C12.6103 5.32902 12.8011 5.25 13 5.25C13.1989 5.25 13.3897 5.32902 13.5303 5.46967C13.671 5.61032 13.75 5.80109 13.75 6C13.75 6.19891 13.671 6.38968 13.5303 6.53033C13.3897 6.67098 13.1989 6.75 13 6.75C12.8011 6.75 12.6103 6.67098 12.4697 6.53033C12.329 6.38968 12.25 6.19891 12.25 6Z"
        fill="#A3E635"
      />
      <path
        d="M13.75 11.75C13.75 11.5511 13.671 11.3603 13.5303 11.2197C13.3897 11.079 13.1989 11 13 11C12.8011 11 12.6103 11.079 12.4697 11.2197C12.329 11.3603 12.25 11.5511 12.25 11.75V11.929C12.25 12.079 12.112 12.209 11.944 12.184C8.81671 11.7277 5.66041 11.4991 2.5 11.5C2.30109 11.5 2.11032 11.579 1.96967 11.7197C1.82902 11.8603 1.75 12.0511 1.75 12.25C1.75 12.4489 1.82902 12.6397 1.96967 12.7803C2.11032 12.921 2.30109 13 2.5 13C5.635 13 8.715 13.228 11.727 13.668C11.9774 13.7052 12.2328 13.688 12.476 13.6177C12.7192 13.5474 12.9444 13.4256 13.1363 13.2605C13.3282 13.0954 13.4823 12.891 13.5882 12.6611C13.6941 12.4311 13.7493 12.1811 13.75 11.928V11.75Z"
        fill="#A3E635"
      />
    </svg>
  ),
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
};

const statusIcons = {
  paid: (
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
        d="M8.7998 15C10.6563 15 12.4368 14.2625 13.7496 12.9497C15.0623 11.637 15.7998 9.85652 15.7998 8C15.7998 6.14348 15.0623 4.36301 13.7496 3.05025C12.4368 1.7375 10.6563 1 8.7998 1C6.94329 1 5.16281 1.7375 3.85006 3.05025C2.5373 4.36301 1.7998 6.14348 1.7998 8C1.7998 9.85652 2.5373 11.637 3.85006 12.9497C5.16281 14.2625 6.94329 15 8.7998 15ZM12.6438 6.209C12.7655 6.05146 12.8197 5.85202 12.7944 5.65454C12.7691 5.45706 12.6663 5.27773 12.5088 5.156C12.3513 5.03427 12.1518 4.9801 11.9543 5.00542C11.7569 5.03073 11.5775 5.13346 11.4558 5.291L7.7558 10.081L6.1068 8.248C6.04155 8.17247 5.96187 8.11073 5.87245 8.06639C5.78302 8.02205 5.68565 7.99601 5.58603 7.98978C5.48641 7.98356 5.38655 7.99729 5.2923 8.03016C5.19806 8.06303 5.11132 8.11438 5.03717 8.1812C4.96303 8.24803 4.90297 8.32898 4.86051 8.41931C4.81806 8.50965 4.79406 8.60755 4.78993 8.70728C4.78579 8.807 4.80161 8.90656 4.83645 9.00009C4.87128 9.09363 4.92444 9.17927 4.9928 9.252L7.2428 11.752C7.31629 11.8335 7.40677 11.8979 7.50786 11.9406C7.60895 11.9833 7.71818 12.0034 7.82785 11.9993C7.93752 11.9952 8.04496 11.967 8.14257 11.9169C8.24019 11.8667 8.32561 11.7958 8.3928 11.709L12.6438 6.209Z"
        fill="#10B981"
      />
    </svg>
  ),
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
  in_transit: (
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
        d="M1.7998 8C1.7998 6.14348 2.5373 4.36301 3.85006 3.05025C5.16281 1.7375 6.94329 1 8.7998 1C10.6563 1 12.4368 1.7375 13.7496 3.05025C15.0623 4.36301 15.7998 6.14348 15.7998 8C15.7998 9.85652 15.0623 11.637 13.7496 12.9497C12.4368 14.2625 10.6563 15 8.7998 15C6.94329 15 5.16281 14.2625 3.85006 12.9497C2.5373 11.637 1.7998 9.85652 1.7998 8ZM9.5498 3.75C9.5498 3.55109 9.47079 3.36032 9.33013 3.21967C9.18948 3.07902 8.99872 3 8.7998 3C8.60089 3 8.41013 3.07902 8.26947 3.21967C8.12882 3.36032 8.0498 3.55109 8.0498 3.75V8C8.0498 8.414 8.3858 8.75 8.7998 8.75H12.0498C12.2487 8.75 12.4395 8.67098 12.5801 8.53033C12.7208 8.38968 12.7998 8.19891 12.7998 8C12.7998 7.80109 12.7208 7.61032 12.5801 7.46967C12.4395 7.32902 12.2487 7.25 12.0498 7.25H9.5498V3.75Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  ),
  failed: (
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
        d="M8.7998 15C10.6563 15 12.4368 14.2625 13.7496 12.9497C15.0623 11.637 15.7998 9.85652 15.7998 8C15.7998 6.14348 15.0623 4.36301 13.7496 3.05025C12.4368 1.7375 10.6563 1 8.7998 1C6.94329 1 5.16281 1.7375 3.85006 3.05025C2.5373 4.36301 1.7998 6.14348 1.7998 8C1.7998 9.85652 2.5373 11.637 3.85006 12.9497C5.16281 14.2625 6.94329 15 8.7998 15ZM11.5798 10.78C11.4392 10.9205 11.2486 10.9993 11.0498 10.9993C10.8511 10.9993 10.6604 10.9205 10.5198 10.78L8.7998 9.06L7.0798 10.78C7.01114 10.8537 6.92834 10.9128 6.83634 10.9538C6.74434 10.9948 6.64503 11.0168 6.54433 11.0186C6.44362 11.0204 6.3436 11.0018 6.25021 10.9641C6.15682 10.9264 6.07199 10.8703 6.00077 10.799C5.92955 10.7278 5.8734 10.643 5.83568 10.5496C5.79796 10.4562 5.77944 10.3562 5.78121 10.2555C5.78299 10.1548 5.80503 10.0555 5.84602 9.96346C5.88702 9.87146 5.94612 9.78866 6.0198 9.72L7.7398 8L6.0198 6.28C5.88732 6.13783 5.8152 5.94978 5.81863 5.75548C5.82206 5.56118 5.90077 5.37579 6.03818 5.23838C6.1756 5.10097 6.36098 5.02225 6.55528 5.01883C6.74958 5.0154 6.93763 5.08752 7.0798 5.22L8.7998 6.94L10.5198 5.22C10.5885 5.14631 10.6713 5.08721 10.7633 5.04622C10.8553 5.00523 10.9546 4.98319 11.0553 4.98141C11.156 4.97963 11.256 4.99816 11.3494 5.03588C11.4428 5.0736 11.5276 5.12974 11.5988 5.20096C11.6701 5.27218 11.7262 5.35701 11.7639 5.4504C11.8016 5.54379 11.8202 5.64382 11.8184 5.74452C11.8166 5.84523 11.7946 5.94454 11.7536 6.03654C11.7126 6.12854 11.6535 6.21134 11.5798 6.28L9.85981 8L11.5798 9.72C11.7203 9.86063 11.7991 10.0512 11.7991 10.25C11.7991 10.4488 11.7203 10.6394 11.5798 10.78Z"
        fill="#F43F5E"
      />
    </svg>
  ),
  pending: (
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
        d="M1.25 8C1.25 6.14348 1.9875 4.36301 3.30025 3.05025C4.61301 1.7375 6.39348 1 8.25 1C10.1065 1 11.887 1.7375 13.1997 3.05025C14.5125 4.36301 15.25 6.14348 15.25 8C15.25 9.85652 14.5125 11.637 13.1997 12.9497C11.887 14.2625 10.1065 15 8.25 15C6.39348 15 4.61301 14.2625 3.30025 12.9497C1.9875 11.637 1.25 9.85652 1.25 8ZM9 3.75C9 3.55109 8.92098 3.36032 8.78033 3.21967C8.63968 3.07902 8.44891 3 8.25 3C8.05109 3 7.86032 3.07902 7.71967 3.21967C7.57902 3.36032 7.5 3.55109 7.5 3.75V8C7.5 8.414 7.836 8.75 8.25 8.75H11.5C11.6989 8.75 11.8897 8.67098 12.0303 8.53033C12.171 8.38968 12.25 8.19891 12.25 8C12.25 7.80109 12.171 7.61032 12.0303 7.46967C11.8897 7.32902 11.6989 7.25 11.5 7.25H9V3.75Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  ),
  "Under review": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
    >
      <path
        d="M6.25 7.5C6.25 7.10218 6.40804 6.72064 6.68934 6.43934C6.97064 6.15804 7.35218 6 7.75 6C8.14782 6 8.52936 6.15804 8.81066 6.43934C9.09196 6.72064 9.25 7.10218 9.25 7.5C9.25 7.89782 9.09196 8.27936 8.81066 8.56066C8.52936 8.84196 8.14782 9 7.75 9C7.35218 9 6.97064 8.84196 6.68934 8.56066C6.40804 8.27936 6.25 7.89782 6.25 7.5Z"
        fill="#F97316"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 2C3.85218 2 3.47064 2.15804 3.18934 2.43934C2.90804 2.72065 2.75 3.10218 2.75 3.5V12.5C2.75 12.8978 2.90804 13.2794 3.18934 13.5607C3.47064 13.842 3.85218 14 4.25 14H12.25C12.6478 14 13.0294 13.842 13.3107 13.5607C13.592 13.2794 13.75 12.8978 13.75 12.5V6.621C13.7497 6.22331 13.5914 5.84204 13.31 5.561L10.19 2.439C10.0505 2.29961 9.88494 2.1891 9.70271 2.11377C9.52048 2.03844 9.32518 1.99978 9.128 2H4.25ZM7.75 4.5C7.28881 4.50024 6.83388 4.60681 6.42056 4.81143C6.00725 5.01605 5.64667 5.3132 5.36685 5.67981C5.08703 6.04641 4.89551 6.4726 4.80715 6.92525C4.71879 7.3779 4.73598 7.84482 4.85739 8.28975C4.9788 8.73467 5.20116 9.14562 5.50718 9.49065C5.8132 9.83568 6.19466 10.1055 6.6219 10.2792C7.04915 10.4528 7.51068 10.5257 7.97064 10.492C8.4306 10.4583 8.87661 10.319 9.274 10.085L10.47 11.28C10.5387 11.3537 10.6215 11.4128 10.7135 11.4538C10.8055 11.4948 10.9048 11.5168 11.0055 11.5186C11.1062 11.5204 11.2062 11.5018 11.2996 11.4641C11.393 11.4264 11.4778 11.3703 11.549 11.299C11.6203 11.2278 11.6764 11.143 11.7141 11.0496C11.7518 10.9562 11.7704 10.8562 11.7686 10.7555C11.7668 10.6548 11.7448 10.5555 11.7038 10.4635C11.6628 10.3715 11.6037 10.2887 11.53 10.22L10.335 9.024C10.6038 8.5683 10.7472 8.04964 10.7509 7.52061C10.7545 6.99158 10.6182 6.47099 10.3557 6.01165C10.0932 5.5523 9.71395 5.17053 9.25634 4.90506C8.79872 4.63958 8.27904 4.49984 7.75 4.5Z"
        fill="#F97316"
      />
    </svg>
  ),
};

const cardIcons = {
  visa: (
    <svg
      width="29"
      height="20"
      viewBox="0 0 29 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.699951 10C0.699951 8.12157 0.70043 6.74617 0.798391 5.66532C0.895729 4.59135 1.08615 3.85737 1.43681 3.25C1.91954 2.41389 2.61385 1.71959 3.44995 1.23686C4.05732 0.886195 4.7913 0.695778 5.86527 0.59844C6.94612 0.500479 8.32152 0.5 10.2 0.5H18.2C20.0784 0.5 21.4538 0.500479 22.5346 0.59844C23.6086 0.695778 24.3426 0.886195 24.95 1.23686C25.7861 1.71959 26.4804 2.41389 26.9631 3.25C27.3138 3.85737 27.5042 4.59135 27.6015 5.66532C27.6995 6.74617 27.7 8.12157 27.7 10C27.7 11.8784 27.6995 13.2538 27.6015 14.3347C27.5042 15.4087 27.3138 16.1426 26.9631 16.75C26.4804 17.5861 25.7861 18.2804 24.95 18.7631C24.3426 19.1138 23.6086 19.3042 22.5346 19.4016C21.4538 19.4995 20.0784 19.5 18.2 19.5H10.2C8.32152 19.5 6.94612 19.4995 5.86527 19.4016C4.7913 19.3042 4.05732 19.1138 3.44995 18.7631C2.61385 18.2804 1.91954 17.5861 1.43681 16.75C1.08615 16.1426 0.895729 15.4087 0.798391 14.3347C0.70043 13.2538 0.699951 11.8784 0.699951 10Z"
        stroke="white"
        stroke-opacity="0.1"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.30011 13.1694H7.60385L6.33187 8.17399C6.27149 7.9442 6.1433 7.74106 5.95474 7.64531C5.48415 7.4047 4.9656 7.21321 4.3999 7.11663V6.92431H7.13244C7.50957 6.92431 7.79242 7.21321 7.83956 7.54873L8.49954 11.1521L10.195 6.92431H11.8441L9.30011 13.1694ZM12.7869 13.1694H11.1849L12.5041 6.92431H14.106L12.7869 13.1694ZM16.1786 8.65439C16.2257 8.31803 16.5086 8.12571 16.8386 8.12571C17.3571 8.07742 17.922 8.174 18.3934 8.41378L18.6763 7.06918C18.2048 6.87685 17.6863 6.78027 17.2157 6.78027C15.6609 6.78027 14.5295 7.64531 14.5295 8.84588C14.5295 9.75921 15.3309 10.2388 15.8966 10.5277C16.5086 10.8157 16.7443 11.0081 16.6972 11.2961C16.6972 11.7282 16.2257 11.9206 15.7552 11.9206C15.1895 11.9206 14.6238 11.7765 14.106 11.5359L13.8232 12.8814C14.3889 13.1211 15.0009 13.2177 15.5666 13.2177C17.31 13.2652 18.3934 12.401 18.3934 11.1038C18.3934 9.47031 16.1786 9.37456 16.1786 8.65439ZM23.9999 13.1694L22.7279 6.92431H21.3616C21.0788 6.92431 20.796 7.11663 20.7017 7.4047L18.3463 13.1694H19.9954L20.3245 12.2569H22.3508L22.5394 13.1694H23.9999ZM21.5974 8.6061L22.0679 10.9598H20.7488L21.5974 8.6061Z"
        fill="white"
      />
    </svg>
  ),
  mastercard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="12"
      viewBox="0 0 19 12"
      fill="none"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.19987 10.1996C8.22477 11.0215 6.9599 11.5177 5.57775 11.5177C2.49374 11.5177 -0.00634766 9.04738 -0.00634766 6.00007C-0.00634766 2.95276 2.49374 0.482422 5.57775 0.482422C6.9599 0.482422 8.22477 0.978597 9.19987 1.80052C10.175 0.978597 11.4398 0.482422 12.822 0.482422C15.906 0.482422 18.4061 2.95276 18.4061 6.00007C18.4061 9.04738 15.906 11.5177 12.822 11.5177C11.4398 11.5177 10.175 11.0215 9.19987 10.1996Z"
        fill="#ED0006"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.19995 10.1996C10.4006 9.18759 11.1619 7.68168 11.1619 6.00007C11.1619 4.31846 10.4006 2.81255 9.19995 1.80051C10.1751 0.978596 11.4399 0.482422 12.8221 0.482422C15.9061 0.482422 18.4062 2.95276 18.4062 6.00007C18.4062 9.04738 15.9061 11.5177 12.8221 11.5177C11.4399 11.5177 10.1751 11.0215 9.19995 10.1996Z"
        fill="#F9A000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.2 10.1999C10.4006 9.18782 11.162 7.68192 11.162 6.00032C11.162 4.31872 10.4006 2.81282 9.2 1.80078C7.99936 2.81282 7.23804 4.31872 7.23804 6.00032C7.23804 7.68192 7.99936 9.18782 9.2 10.1999Z"
        fill="#FF5E00"
      />
    </svg>
  ),
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
import { Canvg } from "canvg";
import logoImage from "../../avenue2.svg";

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

  const handleViewTicket = async (sale) => {
    setIsLoadingTicket(true);
    setSelectedTicket(sale);
    setCardDetails(null); // Clear previous card details

    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 500));

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

  const handleDownloadReceipt = async () => {
    if (!selectedTicket) return;

    const element = receiptRef.current;

    // Show the element
    element.style.display = "block";

    // Convert flyer image to base64
    const flyerImgEl = flyerImgRef.current;
    if (flyerImgEl && selectedTicket?.party?.flyer) {
      try {
        const base64 = await toDataURL(selectedTicket.party.flyer);
        flyerImgEl.src = base64;
      } catch (error) {
        console.warn("Failed to convert flyer to base64", error);
      }
    }

    // Proceed to generate the PDF
    const opt = {
      margin: 10,
      filename: `receipt-${selectedTicket?.transaction_id?.slice(-6)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      element.style.display = "none";

      // Revert to original image if needed (optional)
      if (flyerImgEl && selectedTicket?.party?.flyer) {
        flyerImgEl.src = selectedTicket.party.flyer;
      }
    }
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
                        d="M1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8ZM8.75 3.75C8.75 3.55109 8.67098 3.36032 8.53033 3.21967C8.38968 3.07902 8.19891 3 8 3C7.80109 3 7.61032 3.07902 7.46967 3.21967C7.32902 3.36032 7.25 3.55109 7.25 3.75V8C7.25 8.414 7.586 8.75 8 8.75H11.25C11.4489 8.75 11.6397 8.67098 11.7803 8.53033C11.921 8.38968 12 8.19891 12 8C12 7.80109 11.921 7.61032 11.7803 7.46967C11.6397 7.32902 11.4489 7.25 11.25 7.25H8.75V3.75Z"
                        fill="white"
                        fillOpacity="0.5"
                      />
                    </svg>
                    <span>History</span>
                  </button>
                  <div>
                    <button
                      disabled={!statusInstant}
                      onClick={() => setIsWithdrawOpen(true)}
                      className={`text-sm ${statusInstant === false
                        ? "bg-[#ffffff] bg-opacity-30"
                        : "bg-white"
                        } text-black px-3 py-2 cursor-pointer rounded-full flex items-center gap-2 font-semibold`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M7.24985 10.2503C7.24985 10.4492 7.32886 10.64 7.46952 10.7806C7.61017 10.9213 7.80093 11.0003 7.99985 11.0003C8.19876 11.0003 8.38952 10.9213 8.53018 10.7806C8.67083 10.64 8.74985 10.4492 8.74985 10.2503V4.56032L10.9698 6.78032C11.0385 6.854 11.1213 6.91311 11.2133 6.9541C11.3053 6.99509 11.4046 7.01713 11.5053 7.01891C11.606 7.02068 11.7061 7.00216 11.7994 6.96444C11.8928 6.92672 11.9777 6.87057 12.0489 6.79936C12.1201 6.72814 12.1762 6.6433 12.214 6.54991C12.2517 6.45653 12.2702 6.3565 12.2684 6.25579C12.2667 6.15509 12.2446 6.05578 12.2036 5.96378C12.1626 5.87178 12.1035 5.78898 12.0298 5.72032L8.52985 2.22032C8.38922 2.07987 8.1986 2.00098 7.99985 2.00098C7.8011 2.00098 7.61047 2.07987 7.46985 2.22032L3.96985 5.72032C3.83737 5.86249 3.76524 6.05054 3.76867 6.24484C3.7721 6.43914 3.85081 6.62453 3.98822 6.76194C4.12564 6.89935 4.31102 6.97806 4.50532 6.98149C4.69963 6.98492 4.88767 6.9128 5.02985 6.78032L7.24985 4.56032V10.2503Z"
                          fill="#0A0A0A"
                        />
                        <path
                          d="M3.5 9.75C3.5 9.55109 3.42098 9.36032 3.28033 9.21967C3.13968 9.07902 2.94891 9 2.75 9C2.55109 9 2.36032 9.07902 2.21967 9.21967C2.07902 9.36032 2 9.55109 2 9.75V11.25C2 11.9793 2.28973 12.6788 2.80546 13.1945C3.32118 13.7103 4.02065 14 4.75 14H11.25C11.9793 14 12.6788 13.7103 13.1945 13.1945C13.7103 12.6788 14 11.9793 14 11.25V9.75C14 9.55109 13.921 9.36032 13.7803 9.21967C13.6397 9.07902 13.4489 9 13.25 9C13.0511 9 12.8603 9.07902 12.7197 9.21967C12.579 9.36032 12.5 9.55109 12.5 9.75V11.25C12.5 11.94 11.94 12.5 11.25 12.5H4.75C4.06 12.5 3.5 11.94 3.5 11.25V9.75Z"
                          fill="#0A0A0A"
                        />
                      </svg>
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
                      d="M1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8ZM8.75 3.75C8.75 3.55109 8.67098 3.36032 8.53033 3.21967C8.38968 3.07902 8.19891 3 8 3C7.80109 3 7.61032 3.07902 7.46967 3.21967C7.32902 3.36032 7.25 3.55109 7.25 3.75V8C7.25 8.414 7.586 8.75 8 8.75H11.25C11.4489 8.75 11.6397 8.67098 11.7803 8.53033C11.921 8.38968 12 8.19891 12 8C12 7.80109 11.921 7.61032 11.7803 7.46967C11.6397 7.32902 11.4489 7.25 11.25 7.25H8.75V3.75Z"
                      fill="#F97316"
                    />
                  </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M2.5 3C2.10218 3 1.72064 3.15804 1.43934 3.43934C1.15804 3.72064 1 4.10218 1 4.5V5H15V4.5C15 4.10218 14.842 3.72064 14.5607 3.43934C14.2794 3.15804 13.8978 3 13.5 3H2.5Z"
                      fill="white"
                      fillOpacity="0.5"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15 7H1V11.5C1 11.8978 1.15804 12.2794 1.43934 12.5607C1.72064 12.842 2.10218 13 2.5 13H13.5C13.8978 13 14.2794 12.842 14.5607 12.5607C14.842 12.2794 15 11.8978 15 11.5V7ZM3 10.25C3 10.0511 3.07902 9.86032 3.21967 9.71967C3.36032 9.57902 3.55109 9.5 3.75 9.5H4.25C4.44891 9.5 4.63968 9.57902 4.78033 9.71967C4.92098 9.86032 5 10.0511 5 10.25C5 10.4489 4.92098 10.6397 4.78033 10.7803C4.63968 10.921 4.44891 11 4.25 11H3.75C3.55109 11 3.36032 10.921 3.21967 10.7803C3.07902 10.6397 3 10.4489 3 10.25ZM6.75 9.5C6.55109 9.5 6.36032 9.57902 6.21967 9.71967C6.07902 9.86032 6 10.0511 6 10.25C6 10.4489 6.07902 10.6397 6.21967 10.7803C6.36032 10.921 6.55109 11 6.75 11H9.25C9.44891 11 9.63968 10.921 9.78033 10.7803C9.92098 10.6397 10 10.4489 10 10.25C10 10.0511 9.92098 9.86032 9.78033 9.71967C9.63968 9.57902 9.44891 9.5 9.25 9.5H6.75Z"
                      fill="white"
                      fillOpacity="0.5"
                    />
                  </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="opacity-50 group-hover:opacity-100"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.22007 4.22032C6.3607 4.07987 6.55132 4.00098 6.75007 4.00098C6.94882 4.00098 7.13945 4.07987 7.28007 4.22032L10.5301 7.47032C10.6705 7.61094 10.7494 7.80157 10.7494 8.00032C10.7494 8.19907 10.6705 8.38969 10.5301 8.53032L7.28007 11.7803C7.1379 11.9128 6.94985 11.9849 6.75555 11.9815C6.56125 11.9781 6.37586 11.8994 6.23845 11.7619C6.10104 11.6245 6.02233 11.4391 6.0189 11.2448C6.01547 11.0505 6.08759 10.8625 6.22007 10.7203L8.94007 8.00032L6.22007 5.28032C6.07962 5.13969 6.00073 4.94907 6.00073 4.75032C6.00073 4.55157 6.07962 4.36094 6.22007 4.22032Z"
                      fill="white"
                      fillOpacity="0.5"
                    />
                  </svg>
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
              </div>

              <div className="relative w-full @4xl:w-fit flex justify-end h-fit">
                <input
                  type="text"
                  placeholder="Search sales..."
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
                          Name
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
                          Event
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
                          Ticket
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
                          Type
                        </div>
                      </th>
                      <th className="p-4" onClick={() => handleSort("amount")}>
                        <div className="flex items-center gap-2 cursor-pointer">
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
                          ? `${selectedTicket.tickets.ticket_name} x ${selectedTicket?.count || 1
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
                {selectedTicket?.transaction_id && selectedTicket?.amount > 0 && (
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
                  {selectedTicket?.transaction_id && selectedTicket?.amount > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-white/50">
                        Payment Method
                      </span>

                      {cardDetails?.paymentMethod?.card ? (
                        <div className="flex items-center gap-2">
                          {(() => {
                            const brand = cardDetails.paymentMethod.card.brand;
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
                        <span className="text-sm text-white/40">Loading...</span>
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
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Download Receipt
              </button>
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
                    <svg
                      width="10"
                      height="14"
                      viewBox="0 0 10 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.539 13.3415L4.542 13.3445L4.544 13.3465C4.67522 13.446 4.83535 13.4998 5 13.4998C5.16465 13.4998 5.32478 13.446 5.456 13.3465L5.458 13.3445L5.461 13.3415L5.473 13.3325C5.53744 13.2829 5.60079 13.2319 5.663 13.1795C6.40862 12.5511 7.09362 11.854 7.709 11.0975C8.81 9.73555 10 7.75555 10 5.50055C10 4.17447 9.47322 2.9027 8.53553 1.96502C7.59785 1.02733 6.32608 0.500549 5 0.500549C3.67392 0.500549 2.40215 1.02733 1.46447 1.96502C0.526784 2.9027 0 4.17447 0 5.50055C0 7.75555 1.19 9.73555 2.292 11.0975C2.90739 11.854 3.59239 12.5511 4.338 13.1795C4.4003 13.2314 4.46331 13.2824 4.527 13.3325L4.539 13.3425V13.3415ZM5 7.00055C5.19698 7.00055 5.39204 6.96175 5.57403 6.88637C5.75601 6.81099 5.92137 6.7005 6.06066 6.56121C6.19995 6.42192 6.31044 6.25656 6.38582 6.07457C6.4612 5.89259 6.5 5.69753 6.5 5.50055C6.5 5.30357 6.4612 5.10851 6.38582 4.92652C6.31044 4.74454 6.19995 4.57918 6.06066 4.43989C5.92137 4.3006 5.75601 4.19011 5.57403 4.11473C5.39204 4.03935 5.19698 4.00055 5 4.00055C4.60218 4.00055 4.22064 4.15858 3.93934 4.43989C3.65804 4.72119 3.5 5.10272 3.5 5.50055C3.5 5.89837 3.65804 6.27991 3.93934 6.56121C4.22064 6.84251 4.60218 7.00055 5 7.00055Z"
                        fill="white"
                        fill-opacity="0.5"
                      />
                    </svg>
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
