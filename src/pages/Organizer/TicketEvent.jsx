import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, ArrowLeft, Delete } from "lucide-react";
import DateModal from "../../components/modals/DateModal";
import TimeModal from "../../components/TimeModal";
import {
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
} from "../../components/ui/Dropdown";
import ImageCropper from "../../components/ImageCropper";
import axios from "axios";
import url from "../../constants/url"
import GeneralDateModal from "../../components/modals/GeneralDateModal";
import success from "../../assets/success.png"
import { Checkbox } from "../../components/ui/Checkbox";
import LoginModal from "../../components/modals/LoginModal";
import OnboardLogin from "../../components/modals/OnboardLogin";
import OnboardDetails from "../../components/modals/OnboardDetails";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "../../components/ui/Dailog";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const ticketTypes = [
    {
        value: "default",
        label: "Default",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
            >
                <path
                    d="M8.372 1.34876C8.2587 1.28404 8.13048 1.25 8 1.25C7.86952 1.25 7.7413 1.28404 7.628 1.34876L2.818 4.09676L8 7.13076L13.182 4.09676L8.372 1.34876ZM14 5.35676L8.75 8.42976V14.4348L13.622 11.6508C13.7368 11.5852 13.8322 11.4904 13.8986 11.3761C13.965 11.2618 14 11.132 14 10.9998V5.35676ZM7.25 14.4348V8.42976L2 5.35676V10.9998C2 11.2698 2.144 11.5178 2.378 11.6508L7.25 14.4348Z"
                    fill="white"
                    fillOpacity="0.4"
                />
            </svg>
        ),
    },
    {
        value: "star",
        label: "Star",
        icon: (
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
                    d="M8.00002 1.75C8.14809 1.7501 8.29282 1.79403 8.41596 1.87624C8.53911 1.95846 8.63516 2.07529 8.69202 2.212L10.102 5.605L13.766 5.898C13.9137 5.90988 14.0545 5.9652 14.1707 6.05699C14.2869 6.14878 14.3734 6.27293 14.4192 6.41379C14.4649 6.55464 14.468 6.7059 14.4279 6.84849C14.3879 6.99108 14.3065 7.11861 14.194 7.215L11.403 9.605L12.256 13.18C12.2903 13.324 12.2812 13.475 12.2298 13.6138C12.1784 13.7527 12.0871 13.8733 11.9673 13.9603C11.8476 14.0473 11.7047 14.097 11.5568 14.103C11.4088 14.109 11.2624 14.0711 11.136 13.994L7.99802 12.08L4.86302 13.995C4.7366 14.0721 4.5902 14.11 4.44227 14.104C4.29433 14.098 4.15148 14.0483 4.03172 13.9613C3.91195 13.8743 3.82063 13.7537 3.76925 13.6149C3.71788 13.476 3.70875 13.325 3.74302 13.181L4.59502 9.607L1.80502 7.217C1.69227 7.12074 1.61058 6.99323 1.57026 6.85056C1.52994 6.7079 1.53281 6.55648 1.5785 6.41545C1.62419 6.27441 1.71066 6.15008 1.82698 6.05816C1.94329 5.96624 2.08424 5.91086 2.23202 5.899L5.89502 5.606L7.30502 2.213C7.36192 2.07563 7.45837 1.95826 7.58212 1.87582C7.70587 1.79338 7.85133 1.74959 8.00002 1.75C8.14809 1.7501 8.29282 1.79403 8.41596 1.87624C8.53911 1.95846 8.63516 2.07529 8.69202 2.212L10.102 5.605L13.766 5.898C13.9137 5.90988 14.0545 5.9652 14.1707 6.05699C14.2869 6.14878 14.3734 6.27293 14.4192 6.41379C14.4649 6.55464 14.468 6.7059 14.4279 6.84849C14.3879 6.99108 14.3065 7.11861 14.194 7.215L11.403 9.605L12.256 13.18C12.2903 13.324 12.2812 13.475 12.2298 13.6138C12.1784 13.7527 12.0871 13.8733 11.9673 13.9603C11.8476 14.0473 11.7047 14.097 11.5568 14.103C11.4088 14.109 11.2624 14.0711 11.136 13.994L7.99802 12.08L4.86302 13.995C4.7366 14.0721 4.5902 14.11 4.44227 14.104C4.29433 14.098 4.15148 14.0483 4.03172 13.9613C3.91195 13.8743 3.82063 13.7537 3.76925 13.6149C3.71788 13.476 3.70875 13.325 3.74302 13.181L4.59502 9.607L1.80502 7.217C1.69227 7.12074 1.61058 6.99323 1.57026 6.85056C1.52994 6.7079 1.53281 6.55648 1.5785 6.41545C1.62419 6.27441 1.71066 6.15008 1.82698 6.05816C1.94329 5.96624 2.08424 5.91086 2.23202 5.899L5.89502 5.606L7.30502 2.213C7.36192 2.07563 7.45837 1.95826 7.58212 1.87582C7.70587 1.79338 7.85133 1.74959 8.00002 1.75C7.86952 1.75 7.7413 1.78404 7.628 1.84876L2.818 4.59676L8 7.63076L13.182 4.59676L8.372 1.84876ZM14 5.35676L8.75 8.42976V14.4348L13.622 11.6508C13.7368 11.5852 13.8322 11.4904 13.8986 11.3761C13.965 11.2618 14 11.132 14 10.9998V5.35676ZM7.25 14.4348V8.42976L2 5.35676V10.9998C2 11.2698 2.144 11.5178 2.378 11.6508L7.25 14.4348Z"
                    fill="white"
                    fillOpacity="0.4"
                />
            </svg>
        ),
    },
    {
        value: "smile",
        label: "Smile",
        icon: (
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
                    d="M15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8ZM6 8C6.552 8 7 7.328 7 6.5C7 5.672 6.552 5 6 5C5.448 5 5 5.672 5 6.5C5 7.328 5.448 8 6 8ZM11 6.5C11 7.328 10.552 8 10 8C9.448 8 9 7.328 9 6.5C9 5.672 9.448 5 10 5C10.552 5 11 5.672 11 6.5ZM11.005 10.745C10.8644 10.6045 10.6738 10.5257 10.475 10.5257C10.2762 10.5257 10.0856 10.6045 9.945 10.745C9.68962 11.0005 9.38641 11.2032 9.05268 11.3415C8.71895 11.4797 8.36124 11.5509 8 11.5509C7.63876 11.5509 7.28105 11.4797 6.94732 11.3415C6.61359 11.2032 6.31038 11.0005 6.055 10.745C5.91282 10.6125 5.72478 10.5404 5.53048 10.5438C5.33618 10.5473 5.15079 10.626 5.01338 10.7634C4.87597 10.9008 4.79725 11.0862 4.79383 11.2805C4.7904 11.4748 4.86252 11.6628 4.995 11.805C5.79201 12.6019 6.87293 13.0496 8 13.0496C9.12707 13.0496 10.208 12.6019 11.005 11.805C11.1455 11.6644 11.2243 11.4738 11.2243 11.275C11.2243 11.0762 11.1455 10.8856 11.005 10.745Z"
                    fill="#F97316"
                />
            </svg>
        ),
    },
    {
        value: "sparkles",
        label: "Sparkles",
        icon: (
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
                    d="M5.00037 4C5.17606 3.99998 5.34617 4.06164 5.48104 4.17422C5.61591 4.28679 5.70699 4.44315 5.73837 4.616L5.99037 6.004C6.03588 6.25408 6.15655 6.48434 6.33629 6.66408C6.51603 6.84382 6.74629 6.96449 6.99637 7.01L8.38437 7.262C8.5573 7.29331 8.71374 7.38435 8.82639 7.51923C8.93904 7.65411 9.00075 7.82427 9.00075 8C9.00075 8.17573 8.93904 8.34589 8.82639 8.48077C8.71374 8.61565 8.5573 8.70669 8.38437 8.738L6.99637 8.99C6.74629 9.03551 6.51603 9.15618 6.33629 9.33592C6.15655 9.51566 6.03588 9.74592 5.99037 9.996L5.73837 11.384C5.70706 11.5569 5.61602 11.7134 5.48114 11.826C5.34626 11.9387 5.17611 12.0004 5.00037 12.0004C4.82464 12.0004 4.65448 11.9387 4.5196 11.826C4.38472 11.7134 4.29368 11.5569 4.26237 11.384L4.01037 9.996C3.96486 9.74592 3.84419 9.51566 3.66446 9.33592C3.48472 9.15618 3.25445 9.03551 3.00437 8.99L1.61637 8.738C1.44345 8.70669 1.28701 8.61565 1.17436 8.48077C1.06171 8.34589 1 8.17573 1 8C1 7.82427 1.06171 7.65411 1.17436 7.51923C1.28701 7.38435 1.44345 7.29331 1.61637 7.262L3.00437 7.01C3.25445 6.96449 3.48472 6.84382 3.66446 6.66408C3.84419 6.48434 3.96486 6.25408 4.01037 6.004L4.26237 4.616C4.29376 4.44315 4.38484 4.28679 4.51971 4.17422C4.65458 4.06164 4.82469 3.99998 5.00037 4ZM12.0004 1C12.1633 1.00003 12.3219 1.05314 12.4519 1.1513C12.582 1.24945 12.6766 1.3873 12.7214 1.544L12.9164 2.226C13.0344 2.641 13.3594 2.966 13.7744 3.084L14.4564 3.279C14.613 3.32386 14.7507 3.41848 14.8488 3.54856C14.9468 3.67864 14.9998 3.83711 14.9998 4C14.9998 4.16289 14.9468 4.32136 14.8488 4.45144C14.7507 4.58152 14.613 4.67614 14.4564 4.721L13.7744 4.916C13.5703 4.97439 13.3844 5.0838 13.2343 5.23391C13.0842 5.38402 12.9748 5.56989 12.9164 5.774L12.7214 6.456C12.6765 6.6126 12.5819 6.75033 12.4518 6.84838C12.3217 6.94643 12.1633 6.99946 12.0004 6.99946C11.8375 6.99946 11.679 6.94643 11.5489 6.84838C11.4189 6.75033 11.3242 6.6126 11.2794 6.456L11.0844 5.774C11.026 5.56989 10.9166 5.38402 10.7665 5.23391C10.6164 5.0838 10.4305 4.97439 10.2264 4.916L9.54437 4.721C9.38778 4.67614 9.25005 4.58152 9.152 4.45144C9.05395 4.32136 9.00091 4.16289 9.00091 4C9.00091 3.83711 9.05395 3.67864 9.152 3.54856C9.25005 3.41848 9.38778 3.32386 9.54437 3.279L10.2264 3.084C10.4305 3.02561 10.6164 2.9162 10.7665 2.76609C10.9166 2.61598 11.026 2.43011 11.0844 2.226L11.2794 1.544C11.3241 1.3873 11.4187 1.24945 11.5488 1.1513C11.6789 1.05314 11.8374 1.00003 12.0004 1ZM10.0004 11C10.1677 10.9999 10.3302 11.0558 10.4621 11.1587C10.5941 11.2616 10.6878 11.4057 10.7284 11.568C10.771 11.7381 10.8589 11.8935 10.9829 12.0174C11.1069 12.1414 11.2623 12.2294 11.4324 12.272C11.595 12.3123 11.7395 12.4059 11.8427 12.5378C11.946 12.6697 12.0021 12.8325 12.0021 13C12.0021 13.1675 11.946 13.3303 11.8427 13.4622C11.7395 13.5941 11.595 13.6877 11.4324 13.728C11.2623 13.7706 11.1069 13.8586 10.9829 13.9826C10.8589 14.1065 10.771 14.2619 10.7284 14.432C10.6881 14.5946 10.5945 14.7391 10.4626 14.8423C10.3306 14.9456 10.1679 15.0017 10.0004 15.0017C9.83283 15.0017 9.67012 14.9456 9.53817 14.8423C9.40623 14.7391 9.31266 14.5946 9.27237 14.432C9.2298 14.2619 9.14181 14.1065 9.01782 13.9826C8.89383 13.8586 8.73848 13.7706 8.56837 13.728C8.40575 13.6877 8.26129 13.5941 8.15804 13.4622C8.05479 13.3303 7.9987 13.1675 7.9987 13C7.9987 12.8325 8.05479 12.6697 8.15804 12.5378C8.26129 12.4059 8.40575 12.3123 8.56837 12.272C8.73848 12.2294 8.89383 12.1414 9.01782 12.0174C9.14181 11.8935 9.2298 11.7381 9.27237 11.568C9.31298 11.4057 9.40669 11.2616 9.5386 11.1587C9.67052 11.0558 9.83306 10.9999 10.0004 11Z"
                    fill="#A855F7"
                />
            </svg>
        ),
    },
    {
        value: "trophy",
        label: "Trophy",
        icon: (
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
                    d="M11.9997 1.6902C12.0005 1.56833 11.9562 1.45047 11.8754 1.35929C11.7945 1.2681 11.6828 1.21001 11.5617 1.1962C9.1943 0.933949 6.80515 0.933949 4.43772 1.1962C4.31681 1.20999 4.20524 1.26794 4.12442 1.35891C4.04359 1.44989 3.99919 1.5675 3.99972 1.6892V2.2562C3.18872 2.3602 2.38772 2.4962 1.59672 2.6622C1.43172 2.69699 1.28325 2.78638 1.17529 2.91593C1.06734 3.04547 1.00619 3.20763 1.00172 3.3762C0.968833 4.56509 1.40794 5.71865 2.22306 6.58474C3.03818 7.45083 4.16303 7.95901 5.35172 7.9982C5.82408 8.41638 6.38886 8.71659 6.99972 8.8742V10.0002H5.99972C5.73451 10.0002 5.48015 10.1056 5.29262 10.2931C5.10508 10.4806 4.99972 10.735 4.99972 11.0002V13.0002H4.33272C3.59672 13.0002 2.99972 13.5972 2.99972 14.3332C2.99972 14.7012 3.29772 15.0002 3.66672 15.0002H12.3327C12.5096 15.0002 12.6793 14.9299 12.8044 14.8048C12.9295 14.6798 12.9997 14.5101 12.9997 14.3332C12.9997 13.5972 12.4027 13.0002 11.6667 13.0002H10.9997V11.0002C10.9997 10.735 10.8944 10.4806 10.7068 10.2931C10.5193 10.1056 10.2649 10.0002 9.99972 10.0002H8.99972V8.8742C9.61094 8.71674 10.1761 8.41652 10.6487 7.9982C11.8374 7.95901 12.9623 7.45083 13.7774 6.58474C14.5925 5.71865 15.0316 4.56509 14.9987 3.3762C14.9942 3.20749 14.9329 3.04523 14.8248 2.91566C14.7166 2.78609 14.5679 2.69679 14.4027 2.6622C13.6074 2.49532 12.8058 2.35988 11.9997 2.2562V1.6892V1.6902ZM3.99972 3.7682C3.50972 3.8342 3.02372 3.9132 2.54172 4.0032C2.62188 4.47237 2.81238 4.91577 3.09751 5.29688C3.38264 5.67798 3.75426 5.98588 4.18172 6.1952C4.06086 5.80839 3.99949 5.40545 3.99972 5.0002V3.7692V3.7682ZM11.9997 3.7682C12.4897 3.8342 12.9757 3.9132 13.4577 4.0032C13.3776 4.47237 13.1871 4.91577 12.9019 5.29688C12.6168 5.67798 12.2452 5.98588 11.8177 6.1952C11.9357 5.8182 11.9997 5.4162 11.9997 5.0002V3.7692V3.7682Z"
                    fill="#F9C816"
                />
            </svg>
        ),
    },
    {
        value: "rocket",
        label: "Rocket",
        icon: (
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
                    d="M6.333 4.478C5.72963 4.26474 5.08391 4.19936 4.45004 4.28734C3.81617 4.37533 3.21266 4.61412 2.69019 4.98366C2.16772 5.3532 1.74154 5.8427 1.44744 6.41106C1.15334 6.97942 0.999897 7.61005 1 8.25C1 8.664 1.336 9 1.75 9H5.072C5.644 9.71 6.291 10.356 7 10.928V14.25C7 14.664 7.336 15 7.75 15C8.38995 15.0001 9.02058 14.8467 9.58894 14.5526C10.1573 14.2585 10.6468 13.8323 11.0163 13.3098C11.3859 12.7873 11.6247 12.1838 11.7127 11.55C11.8006 10.9161 11.7353 10.2704 11.522 9.667C12.6197 8.66118 13.4958 7.43778 14.0946 6.07471C14.6934 4.71164 15.0018 3.2388 15 1.75C15 1.55109 14.921 1.36032 14.7803 1.21967C14.6397 1.07902 14.4489 1 14.25 1C11.117 1 8.297 2.34 6.333 4.478ZM12 5.5C12 5.89782 11.842 6.27936 11.5607 6.56066C11.2794 6.84196 10.8978 7 10.5 7C10.1022 7 9.72064 6.84196 9.43934 6.56066C9.15804 6.27936 9 5.89782 9 5.5C9 5.10218 9.15804 4.72064 9.43934 4.43934C9.72064 4.15804 10.1022 4 10.5 4C10.8978 4 11.2794 4.15804 11.5607 4.43934C11.842 4.72064 12 5.10218 12 5.5Z"
                    fill="#34B2DA"
                />
                <path
                    d="M3.90248 10.6819C3.95166 10.5956 3.98321 10.5003 3.99528 10.4017C4.00736 10.3031 3.99973 10.2031 3.97284 10.1075C3.94594 10.0119 3.90031 9.92252 3.83861 9.84467C3.7769 9.76682 3.70034 9.70201 3.61338 9.65399C3.52642 9.60597 3.43078 9.57571 3.33203 9.56495C3.23327 9.5542 3.13336 9.56317 3.0381 9.59135C2.94285 9.61953 2.85413 9.66635 2.77712 9.7291C2.70011 9.79185 2.63632 9.86927 2.58948 9.95687C2.02614 10.9814 1.85921 12.1773 2.12048 13.3169C2.15209 13.4542 2.22176 13.5799 2.32152 13.6795C2.42127 13.7791 2.54706 13.8485 2.68448 13.8799C3.82387 14.141 5.0195 13.9737 6.04348 13.4099C6.13344 13.3644 6.21331 13.3012 6.27832 13.2242C6.34332 13.1471 6.39213 13.0578 6.42181 12.9614C6.4515 12.8651 6.46146 12.7637 6.4511 12.6635C6.44074 12.5632 6.41027 12.466 6.36151 12.3778C6.31276 12.2896 6.24671 12.2121 6.16733 12.1499C6.08794 12.0878 5.99685 12.0423 5.89948 12.0162C5.80212 11.9901 5.70049 11.9838 5.60066 11.9979C5.50084 12.0119 5.40486 12.0459 5.31848 12.0979C4.76643 12.4027 4.13724 12.5393 3.50848 12.4909C3.4604 11.862 3.59736 11.2328 3.90248 10.6809V10.6819Z"
                    fill="#34B2DA"
                />
            </svg>
        ),
    },
];

const GOOGLE_MAPS_API_KEY = "AIzaSyAud4bABsBaBvVj-2H-WIof5QFHubYKNZM";

export default function TicketEvent() {
    const { id } = useParams()
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [eventName, setEventName] = useState("");
    const [eventSlug, setEventSlug] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [imageDimensions, setImageDimensions] = useState(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState(null);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isEventStartTimeModalOpen, setIsEventStartTimeModalOpen] = useState(false);
    const [isEventEndTimeModalOpen, setIsEventEndTimeModalOpen] = useState(false);
    const [isDoorsTimeModalOpen, setIsDoorsTimeModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [doorsOpenTime, setDoorsOpenTime] = useState("");

    // Location states
    const [venueName, setVenueName] = useState("");
    const [venueAddress, setVenueAddress] = useState("");
    const autocompleteRef = useRef(null);

    // Event details states
    const [eventDescription, setEventDescription] = useState("");
    const [eventAddress, setEventAddress] = useState("");
    const [showAttendees, setShowAttendees] = useState(false);

    // Ticket form states
    const [ticketName, setTicketName] = useState("");
    const [ticketType, setTicketType] = useState(ticketTypes[0].value);
    const [ticketPrice, setTicketPrice] = useState("");
    const [ticketDescription, setTicketDescription] = useState("");
    const [ticketQuantity, setTicketQuantity] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [ticketSaleStartDate, setTicketSaleStartDate] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [ticketSaleEndDate, setTicketSaleEndDate] = useState("");
    const [minPurchase, setMinPurchase] = useState("1");
    const [maxPurchase, setMaxPurchase] = useState("10");
    const [ticketStartTime, setTicketStartTime] = useState("");
    const [ticketEndTime, setTicketEndTime] = useState("");

    const [isTicketStartDateModalOpen, setIsTicketStartDateModalOpen] =
        useState(false);
    const [isTicketEndDateModalOpen, setIsTicketEndDateModalOpen] =
        useState(false);
    const [ticketStartDate, setTicketStartDate] = useState(null);
    const [ticketEndDate, setTicketEndDate] = useState(null);
    const [isTicketStartTimeModalOpen, setIsTicketStartTimeModalOpen] = useState(false);
    const [isTicketEndTimeModalOpen, setIsTicketEndTimeModalOpen] = useState(false);

    const [userId, setUserId] = useState(localStorage.getItem('userID'));
    const [oragnizerId, setOragnizerId] = useState(localStorage.getItem('organizerId'));
    const [tickets, setTickets] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false)
    const [refundPolicy, setRefundPolicy] = useState("");
    const [customName, setCustomName] = useState("");
    const [customFee, setCustomFee] = useState("");
    const [eventId, setEventId] = useState("")
    const [isAdding, setIsAdding] = useState(false)
    const [addStatus, setAddStatus] = useState(null)
    const [showExtraFields, setShowExtraFields] = useState(false);
    const [extraFields, setExtraFields] = useState([{ name: "", instagramUrl: "", image: "" }]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false);
    const [isCustomFeeModal, setCustomFeeModal] = useState(false);
    const [discountType, setDiscountType] = useState("percentage");
    const [discountAmount, setDiscountAmount] = useState("");
    const [statusNotify, setStatusNotify] = useState("");
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);

    const categories = [
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="none"
                >
                    <path
                        d="M11.9995 0.916686C11.9996 0.806316 11.9752 0.6973 11.9283 0.597417C11.8813 0.497534 11.8129 0.409245 11.7279 0.338851C11.6429 0.268457 11.5434 0.217693 11.4365 0.19018C11.3296 0.162667 11.218 0.159084 11.1095 0.179686L3.60754 1.60969C3.43613 1.64226 3.28143 1.73357 3.17009 1.86791C3.05875 2.00225 2.99773 2.17121 2.99754 2.34569V4.84569C2.99754 4.86369 2.99754 4.88169 2.99954 4.89969V8.89669C2.99969 9.12957 2.91856 9.3552 2.77013 9.53465C2.62171 9.71411 2.41531 9.83614 2.18654 9.87969L1.60654 9.98969C1.09122 10.0879 0.63605 10.3869 0.341149 10.8208C0.046248 11.2546 -0.0642222 11.7879 0.0340405 12.3032C0.132303 12.8185 0.43125 13.2737 0.865115 13.5686C1.29898 13.8635 1.83222 13.9739 2.34754 13.8757L2.95054 13.7607C3.85054 13.5897 4.50054 12.8037 4.50054 11.8877V10.3447L4.49954 10.3017V5.46669L10.4995 4.32369V7.46969C10.4995 7.7024 10.4182 7.92779 10.2698 8.10704C10.1214 8.28629 9.91514 8.40817 9.68654 8.45169L9.10254 8.56269C8.59124 8.66496 8.14101 8.96499 7.84978 9.39752C7.55856 9.83004 7.4499 10.3601 7.54744 10.8723C7.64498 11.3845 7.94083 11.8375 8.37064 12.1327C8.80045 12.4279 9.32944 12.5415 9.84254 12.4487L10.1685 12.3867C10.6836 12.2887 11.1484 12.014 11.4826 11.61C11.8169 11.206 11.9997 10.698 11.9995 10.1737V0.916686Z"
                        fill="#F43F5E"
                    />
                </svg>
            ),
            name: "Music",
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                >
                    <path
                        d="M12.6124 1.42376C12.9076 1.22597 13.2624 1.13677 13.6161 1.17135C13.9697 1.20594 14.3005 1.36217 14.5518 1.6134C14.8032 1.86463 14.9596 2.19529 14.9943 2.54896C15.0291 2.90263 14.94 3.25741 14.7424 3.55276L12.8374 6.40876C11.9653 7.71696 10.7271 8.7392 9.27738 9.34776C9.07833 8.77933 8.75383 8.26303 8.32797 7.83716C7.9021 7.4113 7.3858 7.0868 6.81738 6.88776C7.42621 5.43794 8.4488 4.19969 9.75738 3.32776L12.6124 1.42376ZM5.49938 8.16576C4.83634 8.16576 4.20045 8.42915 3.73161 8.89799C3.26277 9.36683 2.99938 10.0027 2.99938 10.6658C2.9995 10.7488 2.97892 10.8306 2.93949 10.9038C2.90006 10.9769 2.84303 11.0391 2.77355 11.0846C2.70407 11.1302 2.62433 11.1577 2.54154 11.1647C2.45875 11.1717 2.37553 11.158 2.29938 11.1248C2.16009 11.0636 2.00549 11.0462 1.8561 11.075C1.70671 11.1037 1.56959 11.1772 1.46295 11.2857C1.3563 11.3942 1.28517 11.5325 1.25899 11.6824C1.23281 11.8323 1.25283 11.9865 1.31638 12.1248C1.64872 12.8515 2.21978 13.4427 2.93465 13.8C3.64951 14.1573 4.46511 14.2592 5.2459 14.0887C6.02668 13.9183 6.72562 13.4857 7.22654 12.863C7.72745 12.2403 8.00017 11.4649 7.99938 10.6658C7.99938 10.0027 7.73599 9.36683 7.26714 8.89799C6.7983 8.42915 6.16242 8.16576 5.49938 8.16576Z"
                        fill="#A3E635"
                    />
                </svg>
            ),
            name: "Arts & Culture",
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.07405 1.11162C7.43153 1.57461 6.90837 2.18379 6.54775 2.88886C6.18712 3.59394 5.99939 4.37468 6.00005 5.16662V5.19862C6.00405 5.79862 6.11405 6.37462 6.31105 6.90762C6.47105 7.33562 6.10705 7.81762 5.70105 7.60762C4.94648 7.21573 4.30374 6.63872 3.83305 5.93062C3.63105 5.62662 3.18505 5.56762 2.98505 5.87262C2.32554 6.8767 1.98262 8.05563 2.00068 9.25679C2.01874 10.458 2.39694 11.626 3.08634 12.6098C3.77573 13.5936 4.74457 14.3478 5.86742 14.7748C6.99028 15.2018 8.21545 15.2819 9.38434 15.0047C10.5532 14.7275 11.612 14.1059 12.4236 13.2202C13.2352 12.3345 13.7623 11.2256 13.9365 10.037C14.1108 8.84844 13.9243 7.6349 13.4011 6.55351C12.8779 5.47212 12.0422 4.57268 11.002 3.97162L10.998 3.96462C9.99408 3.38634 9.22317 2.47609 8.81805 1.39062C8.70205 1.08062 8.34105 0.919623 8.07405 1.11162ZM8.85405 7.28962C9.32568 7.42949 9.7557 7.68316 10.1062 8.02829C10.4568 8.37342 10.7171 8.79944 10.8643 9.26884C11.0115 9.73824 11.0411 10.2366 10.9503 10.7201C10.8596 11.2036 10.6515 11.6574 10.3441 12.0415C10.0368 12.4257 9.63978 12.7284 9.18797 12.923C8.73616 13.1176 8.24344 13.1981 7.75318 13.1575C7.26292 13.1169 6.79016 12.9565 6.37651 12.6902C5.96286 12.4239 5.62101 12.0601 5.38105 11.6306C5.17605 11.2656 5.59605 10.9366 6.00105 11.0406C6.61425 11.1984 7.25611 11.2087 7.87405 11.0706C8.16205 11.0056 8.28705 10.6846 8.19505 10.4046C8.06525 10.0045 7.99944 9.58631 8.00005 9.16562C8.00005 8.58062 8.12605 8.02562 8.35105 7.52462C8.39194 7.43096 8.46559 7.35542 8.55818 7.31216C8.65078 7.2689 8.75597 7.26089 8.85405 7.28962Z"
                        fill="#F97316"
                    />
                </svg>
            ),
            name: "Sport",
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                >
                    <path
                        d="M14.4379 10.3143C14.6279 9.88934 14.1169 9.52734 13.6899 9.71334C12.6773 10.1536 11.5557 10.279 10.4709 10.073C9.38608 9.86709 8.38839 9.3394 7.60762 8.55864C6.82686 7.77787 6.29917 6.78018 6.09323 5.69538C5.88728 4.61059 6.01262 3.48892 6.45292 2.47634C6.63892 2.04934 6.27692 1.53834 5.85292 1.72834C4.89004 2.1578 4.04606 2.81499 3.39374 3.64327C2.74142 4.47155 2.30033 5.44605 2.10851 6.48276C1.91668 7.51947 1.97988 8.58728 2.29265 9.59413C2.60541 10.601 3.15837 11.5167 3.90383 12.2622C4.6493 13.0078 5.5649 13.5608 6.57172 13.8737C7.57853 14.1866 8.64633 14.2499 9.68306 14.0582C10.7198 13.8665 11.6944 13.4255 12.5227 12.7733C13.3511 12.1211 14.0084 11.2772 14.4379 10.3143Z"
                        fill="#A855F7"
                    />
                </svg>
            ),
            name: "Nightlife",
        },
    ];

    const convertToWebP = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const webpFile = new File([blob], `${Date.now()}.webp`, {
                                    type: 'image/webp',
                                });
                                resolve(webpFile);
                            } else {
                                reject('Failed to convert image to webp');
                            }
                        },
                        'image/webp',
                        0.8 // Quality: 0.8 is usually good enough
                    );
                };
                img.onerror = reject;
                img.src = event.target.result;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const convertBlobToWebP = (blob) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(blob);

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((webpBlob) => {
                    if (webpBlob) {
                        const file = new File([webpBlob], `${Date.now()}.webp`, {
                            type: "image/webp",
                        });
                        resolve(file);
                    } else {
                        reject("Failed to convert blob to webp.");
                    }
                    URL.revokeObjectURL(url);
                }, "image/webp", 0.8);
            };

            img.onerror = reject;
            img.src = url;
        });
    };


    const handleImageUpload = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            // Reset image states
            setImageFile(null);
            setImagePreview(null);

            // Keep the raw file for cropping
            setTempImageFile(file);
            setIsCropperOpen(true); // Open cropper with original file
        }
    };


    const handleLineImageUpload = (event, index) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            // Validate file type
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                alert("Invalid file type. Please upload a JPEG, PNG, or WEBP image.");
                return;
            }

            // Validate file size (limit to 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("File size exceeds 2MB. Please upload a smaller image.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setExtraFields(prevFields =>
                    prevFields.map((field, i) =>
                        i === index ? { ...field, image: e.target.result } : field
                    )
                );
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = async ({
        croppedImage,
        fullImage,
        previewUrl,
        dimensions,
    }) => {
        try {
            // Convert the cropped image (Blob) to .webp File
            const webpFile = await convertBlobToWebP(croppedImage);

            setImageFile(webpFile); // Final .webp
            setOriginalImage(fullImage); // Optional
            setImagePreview(URL.createObjectURL(webpFile)); // For preview
            setImageDimensions(dimensions);
            setIsCropperOpen(false);
        } catch (error) {
            console.error("Failed to convert to webp:", error);
            alert("Failed to process image.");
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setOriginalImage(null);
    };

    useEffect(() => {
        const loadFromLocalStorage = () => {
            const storedUserOrganizerId = localStorage.getItem("organizerId");
            const storedUserId = localStorage.getItem("userID");
            setOragnizerId(storedUserOrganizerId || null);
            setUserId(storedUserId || null);
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

    // Function to get both images for backend upload
    const getImagesForUpload = () => {
        // return {
        //     croppedImage: imageFile,
        //     originalImage: originalImage,
        // };
        return imageFile
    };

    const handleAddTicket = () => {
        const newTicket = {
            ticketName,
            ticketType: ticketType,
            quantity: ticketQuantity,
            price: ticketPrice,
            ticketDescription,
            startSale: ticketSaleStartDate ? ticketSaleStartDate : "",
            endSale: ticketSaleEndDate ? ticketSaleEndDate : "",
            showDates: "YES",
            limit: "YES",
            minLimit: minPurchase,
            maxLimit: maxPurchase,
            startSaleTime: ticketStartTime,
            endSaleTime: ticketEndTime
        };

        if (editingIndex !== null) {
            const updatedTickets = [...tickets];
            updatedTickets[editingIndex] = newTicket;
            setTickets(updatedTickets);
            setEditingIndex(null);
        } else {
            setTickets([...tickets, newTicket]);
        }

        resetForm();
    };

    const handleEditTicket = (index) => {
        setShowAddForm(true)
        const ticket = tickets[index];
        setTicketName(ticket.ticketName);
        setTicketType(ticket.ticketType || "");
        setTicketPrice(ticket.price);
        setTicketDescription(ticket.ticketDescription);
        setTicketQuantity(ticket.quantity);
        setTicketSaleStartDate(ticket.startSale ? new Date(Date.parse(ticket.startSale)) : null);
        setTicketSaleEndDate(ticket.endSale ? new Date(Date.parse(ticket.endSale)) : null);
        setMinPurchase(ticket.minLimit);
        setMaxPurchase(ticket.maxLimit);
        setEditingIndex(index);
        setTicketStartTime(ticket.startSaleTime)
        setTicketEndTime(ticket.endSaleTime)
    };

    const handleDeleteTicket = (index) => {
        const updatedTickets = tickets.filter((_, i) => i !== index);
        setTickets(updatedTickets);

        if (editingIndex === index) {
            resetForm();
        }
    };

    const resetForm = () => {
        setTicketName("");
        setTicketType("");
        setTicketPrice("");
        setTicketDescription("");
        setTicketQuantity("");
        setTicketSaleStartDate(null);
        setTicketSaleEndDate(null);
        setMinPurchase(1);
        setMaxPurchase(10);
        setEditingIndex(null);
        setShowAddForm(false)
    };

    const generateUniqueCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const formattedTickets = tickets.map((ticket) => ({
        ticket_id: generateUniqueCode(),
        ticket_name: ticket.ticketName,
        ticket_type: ticket.ticketType,
        qty: ticket.quantity,
        price: ticket.price,
        sale_start: ticket.startSale,
        sale_end: ticket.endSale,
        min_count: ticket.minLimit,
        max_count: ticket.maxLimit,
        ticket_description: ticket.ticketDescription,
        sale_start_time: ticket.startSaleTime,
        sale_end_time: ticket.endSaleTime
    }));

    const formattedSocialProfiles = extraFields.map((extra) => ({
        name: extra.name,
        profile_photo: extra.image,
        instagram_link: extra.instagramUrl
    }));

    const handleAddEvent = async (status, orgId, redirect) => {
        //e.preventDefault();
        if (isAdding) return;

        setIsAdding(true)
        setAddStatus(status === "NO" ? "draft" : "live");

        const formData = new FormData();
        formData.append('organizer_id', orgId);
        formData.append('event_name', eventName);
        formData.append('event_slug', eventSlug);
        formData.append('event_type', id === "ticketed" ? "ticket" : "rsvp");
        formData.append('category', "");
        formData.append('flyer', getImagesForUpload());
        formData.append('start_date', ticketStartDate);
        formData.append('end_date', ticketEndDate);
        formData.append('start_time', eventStartTime);
        formData.append('end_time', eventEndTime);
        formData.append('open_time', doorsOpenTime);
        formData.append('venue_name', venueName);
        formData.append('address', venueAddress);
        formData.append('ticket_start_price', eventAddress);
        formData.append('event_description', eventDescription);
        formData.append('explore', status);
        formData.append('show', showAttendees ? "YES" : "NO");
        formData.append('refund_policy', refundPolicy);
        formData.append('status', "active");
        formData.append('tax_name', customName);
        formData.append('tax_type', discountType);
        formData.append('tax', customFee);

        // formData.append('language', language);
        // formData.append('duration', duration);
        // formData.append('min_age', minAge);
        // formData.append('min_age_ticket', agePrice);
        // formData.append('font', "");
        // formData.append('color', "");
        // formData.append('map_link', mapLink);

        formattedTickets.forEach((ticket, index) => {
            for (const key in ticket) {
                formData.append(`tickets[${index}][${key}]`, ticket[key]);
            }
        });

        // tags.forEach((tag, index) => {
        //     formData.append(`members[${index}]`, tag.id);
        // });

        formattedSocialProfiles.forEach((line, index) => {
            for (const key in line) {
                formData.append(`social_profiles[${index}][${key}]`, line[key]);
            }
        });

        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }


        try {
            //setIsAddLoading(true)
            const response = await axios.post(`${url}/event/add-event`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const eventId = response.data?.event?._id;
            if (eventId) {
                localStorage.setItem('organizer_eventId', eventId);
                setEventId(eventId);
            }

            if (redirect === 'redirect') {
                setStep((prevStep) => prevStep + 1);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add event. Please try again.');
        } finally {
            setIsAdding(false);
            setAddStatus(null);
        }
    };

    const minPrice = tickets.length > 0 ? Math.min(...tickets.map(ticket => ticket.price)) : 0;

    const handleAddExtraField = () => {
        setExtraFields([...extraFields, { name: "", instagramUrl: "" }]);
    };

    const handleExtraFieldChange = (index, field, value) => {
        const updatedFields = [...extraFields];
        updatedFields[index][field] = value;
        setExtraFields(updatedFields);
    };

    const handleRemoveExtraField = (index) => {
        setExtraFields(extraFields.filter((_, i) => i !== index));
    };

    const validateUrl = (e, index) => {
        let value = e.target.value;
        const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;

        const updatedFields = [...extraFields];
        updatedFields[index].instagramUrl = value; // Ensure consistency with input field

        if (value && !urlRegex.test(value)) {
            updatedFields[index].error = "Invalid URL";
        } else {
            updatedFields[index].error = "";
        }

        setExtraFields(updatedFields);
    };

    const handlePlaceSelect = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.formatted_address) {
                setVenueAddress(place.formatted_address);
            }
        }
    };

    const handleLoginComplete = () => {
        const freshUserId = localStorage.getItem('userID');
        const freshOrganizerId = localStorage.getItem('organizerId');

        setUserId(freshUserId);
        setOragnizerId(freshOrganizerId);

    };

    const generateSlug = (text) => {
        return text
            .normalize("NFD")                     // Decompose accented letters
            .replace(/[\u0300-\u036f]/g, "")      // Remove diacritics
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")         // Remove all non-alphanumeric except space and dash
            .replace(/[\s_-]+/g, "-")             // Replace spaces/underscores/double dashes with a single dash
            .replace(/^-+|-+$/g, "");             // Trim leading/trailing dashes
    };

    const handleEventNameChange = (e) => {
        const name = e.target.value;
        setEventName(name);
        setEventSlug(generateSlug(name));
    };

    const handleSlugChange = (e) => {
        const value = e.target.value
            .replace(/\s+/g, "-")           // replace spaces with dash
            .replace(/[^a-z0-9\-]/gi, "");  // remove non-alphanumeric or dashes

        setEventSlug(value.toLowerCase());
    };

    // Form steps content
    const formSteps = [
        {
            id: 1,
            title: "Basic info",
            description: "Let's start with the basic information about your event",
            fields: (
                <div className="w-full">
                    <div className="w-full mt-2">
                        <label className="block text-sm font-medium text-white mb-3">
                            Event name
                        </label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={handleEventNameChange}
                            placeholder="After Hours, Electric Dreams, etc."
                            className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white placeholder:text-white/30 placeholder:text-sm"
                        />
                    </div>
                    <div className="w-full mt-2">
                        <label className="block text-sm font-medium text-white mb-3">
                            Event slug
                        </label>
                        <input
                            type="text"
                            value={eventSlug}
                            onChange={handleSlugChange}
                            placeholder="after-hours, electric-dreams, etc."
                            className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white placeholder:text-white/30 placeholder:text-sm"
                        />
                    </div>
                    {/* <div className="w-full mt-4">
                        <label className="block text-sm font-medium text-white mb-3">
                            Category
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.name}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`flex items-center justify-between gap-3 text-white p-2.5 rounded-lg border ${selectedCategory?.name === category.name
                                        ? "border-[#34B2DA]"
                                        : "border-white/5"
                                        }`}
                                >
                                    <p className="text-sm font-medium flex items-center gap-2">
                                        {" "}
                                        <span>{category.icon}</span> {category.name}
                                    </p>

                                    <div className="size-4 rounded-full bg-[#34B2DA] flex items-center justify-center">
                                        <Check className="size-3 text-black" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div> */}
                    <div className="w-full mt-4">
                        <label className="block text-sm font-medium text-white mb-3">
                            Upload cover flyer
                        </label>
                        <div className="relative p-6 rounded-lg text-center cursor-pointer border-2 border-dashed border-white/5 min-h-[200px] flex items-center justify-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                key={imageFile ? "has-image" : "no-image"}
                                className="hidden"
                                id="image-upload"
                            />
                            {!imageFile ? (
                                <label
                                    htmlFor="image-upload"
                                    className=" flex flex-col items-center justify-center "
                                >
                                    <p className="text-white/60 text-sm">
                                        Click or drag to upload
                                    </p>
                                    <p className="text-white/40 text-xs mt-1">
                                        Recommended size: 1200x630px • PNG or JPG
                                    </p>
                                    <p className="text-white/40 text-xs mt-1">
                                        Max 10 MB upload size
                                    </p>
                                </label>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                    {/* Image Preview */}
                                    <div className="w-48 aspect-square flex items-center justify-center rounded-xl overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="Event Cover"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* File Details */}
                                    <div className="p-4 grid gap-3 items-center justify-center text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-white text-sm font-medium truncate max-w-[200px]">
                                                {imageFile.name}
                                            </p>
                                            <p className="text-white/40 text-xs font-semibold">
                                                {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={removeImage}
                                            className="px-3 py-1.5 border border-white/5 rounded-full text-white/60 text-sm hover:bg-white/5 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 2,
            title: "When is your event?",
            description: "Set the date and time details for your event",
            fields: (
                <div className="w-full space-y-4">
                    {/* <div className="w-full">
                        <label className="block text-sm font-medium text-white mb-3">
                            Choose event start & end date
                        </label>
                        <button
                            onClick={() => setIsDateModalOpen(true)}
                            className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white/60 text-sm text-left flex items-center justify-between"
                        >
                            <span>
                                {startDate ? startDate.toLocaleDateString() : "Click to select"} - {endDate ? endDate.toLocaleDateString() : "Click to select"}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M6 12L10 8L6 4"
                                    stroke="white"
                                    strokeOpacity="0.6"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div> */}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-3">
                                Event start date
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsTicketStartDateModalOpen(true)}
                                    className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-left text-white/60"
                                >
                                    {ticketStartDate
                                        ? ticketStartDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                                        : "Select date"}
                                </button>
                                <svg
                                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M4 6L8 10L12 6"
                                        stroke="white"
                                        strokeOpacity="0.3"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <GeneralDateModal
                                isOpen={isTicketStartDateModalOpen}
                                onClose={() => setIsTicketStartDateModalOpen(false)}
                                onDateChange={(startDate) => {
                                    setTicketStartDate(startDate);
                                    // setTicketStartDate(
                                    //     startDate ? startDate.toLocaleDateString() : ""
                                    // );
                                }}
                                startDate={ticketStartDate}
                                setStartDate={setTicketStartDate}
                                endDate={ticketStartDate}
                                setEndDate={setTicketStartDate}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-3">
                                Event start time
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsEventStartTimeModalOpen(true)}
                                    className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white/60 text-sm text-left flex items-center justify-between"
                                >
                                    <span>{eventStartTime || "Click to select"}</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M6 12L10 8L6 4"
                                            stroke="white"
                                            strokeOpacity="0.6"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <TimeModal
                            isOpen={isEventStartTimeModalOpen}
                            onClose={() => setIsEventStartTimeModalOpen(false)}
                            onTimeChange={(time) => setEventStartTime(time)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-3">
                                Event end date
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsTicketEndDateModalOpen(true)}
                                    className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-left text-white/60"
                                >
                                    {ticketEndDate
                                        ? ticketEndDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                                        : "Select date"}
                                </button>
                                <svg
                                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M4 6L8 10L12 6"
                                        stroke="white"
                                        strokeOpacity="0.3"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        <GeneralDateModal
                            isOpen={isTicketEndDateModalOpen}
                            onClose={() => setIsTicketEndDateModalOpen(false)}
                            onDateChange={(startDate) => {
                                setTicketEndDate(startDate);
                                // setTicketSaleEndDate(
                                //     startDate ? startDate.toLocaleDateString() : ""
                                // );
                            }}
                            startDate={ticketEndDate}
                            setStartDate={setTicketEndDate}
                            endDate={ticketEndDate}
                            setEndDate={setTicketEndDate}
                        />
                        <div>
                            <label className="block text-sm font-medium text-white mb-3">
                                Event end time
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsEventEndTimeModalOpen(true)}
                                    className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white/60 text-sm text-left flex items-center justify-between"
                                >
                                    <span>{eventEndTime || "Click to select"}</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M6 12L10 8L6 4"
                                            stroke="white"
                                            strokeOpacity="0.6"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <TimeModal
                            isOpen={isEventEndTimeModalOpen}
                            onClose={() => setIsEventEndTimeModalOpen(false)}
                            onTimeChange={(time) => setEventEndTime(time)}
                        />
                    </div>

                    {/* <div className="w-full">
                        <label className="block text-sm font-medium text-white mb-3">
                            Enter event time
                        </label>
                        <button
                            onClick={() => setIsEventTimeModalOpen(true)}
                            className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white/60 text-sm text-left flex items-center justify-between"
                        >
                            <span>{eventTime || "Click to select"}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M6 12L10 8L6 4"
                                    stroke="white"
                                    strokeOpacity="0.6"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div> */}

                    <div className="w-full">
                        <label className="block text-sm font-medium text-white mb-3">
                            Doors open <span className="text-white/30 text-xs mt-1">(optional)</span>
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setIsDoorsTimeModalOpen(true)}
                                className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white/60 text-sm text-left flex items-center justify-between"
                            >
                                <span>{doorsOpenTime || "Click to select"}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M6 12L10 8L6 4"
                                        stroke="white"
                                        strokeOpacity="0.6"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <p className="text-white/30 text-xs mt-1">
                                When can attendees start arriving
                            </p>
                        </div>
                        <TimeModal
                            isOpen={isDoorsTimeModalOpen}
                            onClose={() => setIsDoorsTimeModalOpen(false)}
                            onTimeChange={(time) => setDoorsOpenTime(time)}
                        />
                    </div>
                </div>
            ),
        },
        {
            id: 3,
            title: "Location",
            description: "Where is your event taking place?",
            fields: (
                <div className="w-full">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-white mb-3">
                            Venue name
                        </label>
                        <input
                            type="text"
                            value={venueName}
                            onChange={(e) => setVenueName(e.target.value)}
                            placeholder="Enter venue name"
                            className="w-full bg-transparent h-10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
                        />
                    </div>
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                        <div className="w-full mt-4">
                            <label className="block text-sm font-medium text-white mb-3">
                                Address
                            </label>
                            <Autocomplete
                                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                                onPlaceChanged={handlePlaceSelect}
                            >
                                <input
                                    type="text"
                                    value={venueAddress}
                                    onChange={(e) => setVenueAddress(e.target.value)}
                                    placeholder="Enter address"
                                    className="w-full bg-transparent h-10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
                                />
                            </Autocomplete>
                        </div>

                        {/* Dark Mode Styling for Autocomplete Dropdown */}
                        <style>{`
                            .pac-container {
                                background-color: #0F0F0F !important; /* Dark background */
                                color: #AFAFAF !important; /* Light gray text */
                                border-radius: 0px 0px 4px 4px;
                                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
                                padding: 4px; /* Reduced padding */
                                max-height: 180px !important; /* Limit dropdown height */
                                overflow-y: auto !important; /* Scroll if needed */
                                border: 1px solid #fff !important; /* Light gray border */
                            }
                            .pac-item {
                                color: #AFAFAF !important; /* Light gray text */
                                font-size: 13px; /* Slightly smaller font */
                                padding: 8px 10px !important; /* Reduced padding for smaller height */
                                border-radius: 0px;
                                border: 0px solid #474747 !important;
                                overflow: hidden !important;
                                transition: background-color 0.2s ease-in-out;
                            }
                            .pac-item:hover {
                                background-color: #333 !important; /* Slightly darker hover effect */
                            }
                            .pac-icon {
                                filter: invert(1); /* Makes the icon visible on dark background */
                            }
                            .pac-item-query {
                                color: #FFFFFF !important; /* Make first main word white */
                                font-weight: 600 !important; /* Slightly bold */
                            }
                        `}
                        </style>
                    </LoadScript>

                </div>
            ),
        },
        {
            id: 4,
            title: "Tell us more about your event",
            description: "Add description and manage event settings",
            fields: (
                <div className="w-full space-y-4">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-white mb-3">
                            Event description
                        </label>
                        <textarea
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            placeholder="Tell attendees what to expect"
                            className="w-full h-[120px] bg-transparent border border-white/5 rounded-lg px-4 py-3 text-white placeholder:text-white/30 resize-none placeholder:text-sm"
                        />
                    </div>

                    {/* <div className="w-full">
                        <label className="block text-sm font-medium text-white mb-3">
                            Ticket Starting Price
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={eventAddress}
                                onChange={(e) => setEventAddress(e.target.value)}
                                placeholder="Enter ticket starting price"
                                className="w-full h-10 bg-transparent border border-white/5 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-white/30 placeholder:text-sm"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M8 8.5C9.10457 8.5 10 7.60457 10 6.5C10 5.39543 9.10457 4.5 8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 7.60457 6.89543 8.5 8 8.5Z"
                                    stroke="white"
                                    strokeOpacity="0.3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 14C10 11.5 12 9.14621 12 6.5C12 3.85379 10.2091 2 8 2C5.79086 2 4 3.85379 4 6.5C4 9.14621 6 11.5 8 14Z"
                                    stroke="white"
                                    strokeOpacity="0.3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div> */}

                    {/* <div className="w-full">
                        <label className="block text-sm font-medium text-white mb-3">
                            Custom fee <span className="text-white/30 text-xs mt-1">(in percentage)</span>
                        </label>
                        <textarea
                            value={customFee}
                            onChange={(e) => {
                                let value = e.target.value;

                                // Remove non-numeric characters (except for ".")
                                value = value.replace(/[^0-9.]/g, '');

                                // Ensure the value does not exceed 100
                                if (value !== "" && parseFloat(value) > 100) {
                                    value = "100";
                                }

                                setCustomFee(value);
                            }}
                            placeholder="Enter Custom fee (in percentage)"
                            className="w-full h-[60px] bg-transparent border border-white/5 rounded-lg px-4 py-3 text-white placeholder:text-white/30 resize-none placeholder:text-sm"
                        />
                    </div> */}

                    <div className="w-full">
                        <label className="block text-sm font-medium text-white mb-3">
                            Refund & other policies
                        </label>
                        <textarea
                            value={refundPolicy}
                            onChange={(e) => setRefundPolicy(e.target.value)}
                            placeholder="Enter refund & other policies"
                            className="w-full h-[60px] bg-transparent border border-white/5 rounded-lg px-4 py-3 text-white placeholder:text-white/30 resize-none placeholder:text-sm"
                        />
                    </div>



                    <div className="flex items-center gap-2 mt-4">
                        {/* <input
                            type="checkbox"
                            id="showAttendees"
                            checked={showAttendees}
                            onChange={(e) => setShowAttendees(e.target.checked)}
                            className="size-4 rounded bg-transparent border-white/10"
                        /> */}
                        <Checkbox
                            checked={showAttendees}
                            onCheckedChange={(checked) => setShowAttendees(checked)}
                            className="border-white/10 rounded bg-white/5 data-[state=checked]:bg-[#34B2DA] data-[state=checked]:text-black"
                        />
                        <label htmlFor="showAttendees" className="text-sm text-white">
                            Show attendees on event page
                        </label>
                    </div>
                    <p className="text-white/30 text-xs">
                        Let people see who&apos;s attending your event
                    </p>

                    <div className="flex items-center gap-2 mt-4">
                        <Checkbox
                            checked={showExtraFields}
                            onCheckedChange={(checked) => setShowExtraFields(checked)}
                            className="border-white/10 rounded bg-white/5 data-[state=checked]:bg-[#34B2DA] data-[state=checked]:text-black"
                        />
                        <label htmlFor="showExtraFields" className="text-sm text-white">
                            Add artist lineup
                        </label>
                    </div>
                    {showExtraFields && (
                        <div className="space-y-4">
                            {extraFields.map((field, index) => (
                                <div key={index} className="w-full flex flex-col gap-2">
                                    <div className="flex items-center gap-4">
                                        <div className="flex justify-center">
                                            <label className="relative w-16 h-16 rounded-full border border-white/10 flex items-center justify-center cursor-pointer overflow-hidden">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(event) => handleLineImageUpload(event, index)}
                                                    className="hidden"
                                                />
                                                {field.image ? (
                                                    <img src={field.image} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M12 16V8M16 12L12 8L8 12M4 16V20H20V16" />
                                                    </svg>
                                                )}
                                            </label>
                                        </div>
                                        <input
                                            type="text"
                                            value={field.name}
                                            onChange={(e) => handleExtraFieldChange(index, "name", e.target.value)}
                                            placeholder="Enter artist Name"
                                            className="w-1/2 h-10 bg-transparent border border-white/5 rounded-lg px-4 py-2 text-white placeholder:text-white/30 placeholder:text-sm"
                                        />
                                        <input
                                            type="url"
                                            value={field.instagramUrl} // Ensure consistency
                                            onChange={(e) => validateUrl(e, index)}
                                            placeholder="Enter URL"
                                            className="w-1/2 h-10 bg-transparent border border-white/5 rounded-lg px-4 py-2 text-white placeholder:text-white/30 placeholder:text-sm"
                                        />
                                        <button onClick={() => handleRemoveExtraField(index)}>
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
                                                    fill="red"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    {field.error && <p className="text-red-500 text-sm">{field.error}</p>}
                                </div>
                            ))}

                            {/* Button aligned to the right */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddExtraField}
                                    className="flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M8 3.33337V12.6667M3.33333 8.00004H12.6667"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                </button>
                            </div>
                        </div>
                    )}

                </div>
            ),
        },
        {
            id: 5,
            title: "Tickets",
            description: "Set up your ticket types and pricing",
            fields: (
                <div className="w-full space-y-10">
                    {
                        showAddForm ? (
                            <>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-white mb-3">
                                        Ticket name
                                    </label>
                                    <input
                                        type="text"
                                        value={ticketName}
                                        onChange={(e) => setTicketName(e.target.value)}
                                        placeholder="After Hours, Electric Queens, etc."
                                        className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
                                    />
                                </div>

                                {/* <div className="w-full">
                                    <label className="block text-sm font-medium text-white mb-3">
                                        Ticket type
                                    </label>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <button className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span>
                                                        {
                                                            ticketTypes.find((type) => type.value === ticketType)
                                                                ?.icon
                                                        }
                                                    </span>
                                                    <span>
                                                        {ticketTypes.find((type) => type.value === ticketType)
                                                            ?.label || "Select ticket type"}
                                                    </span>
                                                </div>
                                                <svg
                                                    className="w-4 h-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M4 6L8 10L12 6"
                                                        stroke="white"
                                                        strokeOpacity="0.3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </DropdownTrigger>
                                        <DropdownContent className="bg-[#1A1A1A] border border-white/10 rounded-lg shadow-lg w-full">
                                            {ticketTypes.map((type) => (
                                                <DropdownItem
                                                    key={type.value}
                                                    onClick={() => setTicketType(type.value)}
                                                    className={`px-4 py-2 hover:bg-white/5 flex items-center gap-3 ${ticketType === type.value ? "bg-white/5" : ""
                                                        }`}
                                                >
                                                    <span className="text-xl">{type.icon}</span>
                                                    <div>
                                                        <p className="text-white font-medium">{type.label}</p>
                                                    </div>
                                                </DropdownItem>
                                            ))}
                                        </DropdownContent>
                                    </Dropdown>
                                </div> */}

                                <div className="w-full">
                                    <label className="block text-sm font-medium text-white mb-3">
                                        Ticket price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                                            $
                                        </span>
                                        <input
                                            type="text"
                                            value={ticketPrice}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    setTicketPrice(value);
                                                }
                                            }}
                                            placeholder="50.00"
                                            className="w-full h-10 bg-transparent border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder:text-white/30"
                                        />
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label className="block text-sm font-medium text-white mb-3">
                                        Ticket description
                                    </label>
                                    <textarea
                                        value={ticketDescription}
                                        onChange={(e) => setTicketDescription(e.target.value)}
                                        placeholder="e.g. Standard admission after 11 PM"
                                        className="w-full h-[80px] bg-transparent border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 resize-none"
                                    />
                                    <div className="flex items-center gap-2 mt-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                        >
                                            <path
                                                d="M8 5.5V8.5M8 11.5H8.01M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
                                                stroke="#FF8A00"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="text-[#FF8A00] text-xs">Max 70 words</span>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label className="block text-sm font-medium text-white mb-3">
                                        Total available ticket quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={ticketQuantity}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d+$/.test(value) || value === "") {
                                                setTicketQuantity(value);
                                            }
                                        }}
                                        placeholder="0"
                                        className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Ticket Sale Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-3">
                                            Ticket sale start date
                                        </label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsTicketStartDateModalOpen(true)}
                                                className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-left text-white/60"
                                            >
                                                {
                                                    ticketSaleStartDate && ticketSaleStartDate instanceof Date && !isNaN(ticketSaleStartDate)
                                                        ? ticketSaleStartDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                                                        : "Select date"
                                                }

                                            </button>
                                            <svg
                                                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M4 6L8 10L12 6"
                                                    stroke="white"
                                                    strokeOpacity="0.3"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <GeneralDateModal
                                            isOpen={isTicketStartDateModalOpen}
                                            onClose={() => setIsTicketStartDateModalOpen(false)}
                                            onDateChange={(startDate) => {
                                                setTicketSaleStartDate(startDate);
                                            }}
                                            startDate={ticketSaleStartDate}
                                            setStartDate={setTicketSaleStartDate}
                                            endDate={ticketSaleStartDate}
                                            setEndDate={setTicketSaleStartDate}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white mb-3">
                                            Ticket sale start time
                                        </label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsTicketStartTimeModalOpen(true)}
                                                className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white/60 text-sm text-left flex items-center justify-between"
                                            >
                                                <span>{ticketStartTime || "Click to select"}</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M6 12L10 8L6 4"
                                                        stroke="white"
                                                        strokeOpacity="0.6"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <TimeModal
                                        isOpen={isTicketStartTimeModalOpen}
                                        onClose={() => setIsTicketStartTimeModalOpen(false)}
                                        onTimeChange={(time) => setTicketStartTime(time)}
                                    />

                                    {/* Ticket Sale End Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-3">
                                            Ticket sale end date
                                        </label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsTicketEndDateModalOpen(true)}
                                                className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2 text-left text-white/60"
                                            >
                                                {ticketSaleEndDate
                                                    ? ticketSaleEndDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                                                    : "Select date"}
                                            </button>
                                            <svg
                                                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <path
                                                    d="M4 6L8 10L12 6"
                                                    stroke="white"
                                                    strokeOpacity="0.3"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <GeneralDateModal
                                            isOpen={isTicketEndDateModalOpen}
                                            onClose={() => setIsTicketEndDateModalOpen(false)}
                                            onDateChange={(startDate) => {
                                                setTicketSaleEndDate(startDate);
                                            }}
                                            startDate={ticketSaleEndDate}
                                            setStartDate={setTicketSaleEndDate}
                                            endDate={ticketSaleEndDate}
                                            setEndDate={setTicketSaleEndDate}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-3">
                                            Ticket sale end time
                                        </label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsTicketEndTimeModalOpen(true)}
                                                className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white/60 text-sm text-left flex items-center justify-between"
                                            >
                                                <span>{ticketEndTime || "Click to select"}</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M6 12L10 8L6 4"
                                                        stroke="white"
                                                        strokeOpacity="0.6"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <TimeModal
                                        isOpen={isTicketEndTimeModalOpen}
                                        onClose={() => setIsTicketEndTimeModalOpen(false)}
                                        onTimeChange={(time) => setTicketEndTime(time)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-3">
                                            Min purchase power
                                        </label>
                                        <input
                                            type="number"
                                            value={minPurchase}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d+$/.test(value) || value === "") {
                                                    setMinPurchase(value);
                                                }
                                            }}
                                            placeholder="1"
                                            min="1"
                                            step="1"
                                            className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-3">
                                            Max purchase power
                                        </label>
                                        <input
                                            type="number"
                                            value={maxPurchase}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d+$/.test(value) || value === "") {
                                                    setMaxPurchase(value);
                                                }
                                            }}
                                            placeholder="10"
                                            min="1"
                                            step="1"
                                            className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-4">
                                    <button
                                        onClick={
                                            (() => {
                                                setShowAddForm(false)
                                                resetForm()
                                            })
                                        }
                                        className="px-4 py-2 w-full rounded-full h-10 border border-white/10 text-white font-semibold flex items-center justify-center gap-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddTicket}
                                        className="px-4 py-2 w-full rounded-full h-10 bg-white font-semibold text-primary flex items-center justify-center gap-2"
                                    >
                                        {editingIndex !== null ? "Update Ticket" : "+ Add Ticket"}
                                    </button>
                                </div>
                            </>
                        ) : ("")
                    }
                    <div className="space-y-4">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-white mb-3">
                                Tickets
                            </label>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full h-10 text-sm bg-white/[0.03] border-2 border-dashed border-white/10 rounded-lg px-4 py-2.5 text-white flex items-center gap-3"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="10"
                                viewBox="0 0 14 10"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10218 14 1.5V2.5C14 2.776 13.773 2.994 13.505 3.062C13.0743 3.1718 12.6925 3.42192 12.4198 3.77286C12.1472 4.1238 11.9991 4.55557 11.9991 5C11.9991 5.44443 12.1472 5.8762 12.4198 6.22714C12.6925 6.57808 13.0743 6.8282 13.505 6.938C13.773 7.006 14 7.224 14 7.5V8.5C14 8.89782 13.842 9.27936 13.5607 9.56066C13.2794 9.84196 12.8978 10 12.5 10H1.5C1.10218 10 0.720644 9.84196 0.43934 9.56066C0.158035 9.27936 0 8.89782 0 8.5V7.5C0 7.224 0.227 7.006 0.495 6.938C0.925654 6.8282 1.30747 6.57808 1.58016 6.22714C1.85285 5.8762 2.00088 5.44443 2.00088 5C2.00088 4.55557 1.85285 4.1238 1.58016 3.77286C1.30747 3.42192 0.925654 3.1718 0.495 3.062C0.227 2.994 0 2.776 0 2.5V1.5ZM9 2.75C9 2.55109 9.07902 2.36032 9.21967 2.21967C9.36032 2.07902 9.55109 2 9.75 2C9.94891 2 10.1397 2.07902 10.2803 2.21967C10.421 2.36032 10.5 2.55109 10.5 2.75V3.75C10.5 3.94891 10.421 4.13968 10.2803 4.28033C10.1397 4.42098 9.94891 4.5 9.75 4.5C9.55109 4.5 9.36032 4.42098 9.21967 4.28033C9.07902 4.13968 9 3.94891 9 3.75V2.75ZM9.75 5.5C9.55109 5.5 9.36032 5.57902 9.21967 5.71967C9.07902 5.86032 9 6.05109 9 6.25V7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25V6.25C10.5 6.05109 10.421 5.86032 10.2803 5.71967C10.1397 5.57902 9.94891 5.5 9.75 5.5Z"
                                    fill="#34B2DA"
                                />
                            </svg>
                            Add ticket
                        </button>
                        {
                            tickets.map((ticket, index) => (
                                <div className="flex items-center gap-2" key={index + 1}>
                                    <button
                                        onClick={() => handleEditTicket(index)}
                                        className="w-full h-10 text-sm bg-white/[0.01] border-2 border-white/5 rounded-lg px-4 py-2.5 text-white flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10218 14 1.5V2.5C14 2.776 13.773 2.994 13.505 3.062C13.0743 3.1718 12.6925 3.42192 12.4198 3.77286C12.1472 4.1238 11.9991 4.55557 11.9991 5C11.9991 5.44443 12.1472 5.8762 12.4198 6.22714C12.6925 6.57808 13.0743 6.8282 13.505 6.938C13.773 7.006 14 7.224 14 7.5V8.5C14 8.89782 13.842 9.27936 13.5607 9.56066C13.2794 9.84196 12.8978 10 12.5 10H1.5C1.10218 10 0.720644 9.84196 0.43934 9.56066C0.158035 9.27936 0 8.89782 0 8.5V7.5C0 7.224 0.227 7.006 0.495 6.938C0.925654 6.8282 1.30747 6.57808 1.58016 6.22714C1.85285 5.8762 2.00088 5.44443 2.00088 5C2.00088 4.55557 1.85285 4.1238 1.58016 3.77286C1.30747 3.42192 0.925654 3.1718 0.495 3.062C0.227 2.994 0 2.776 0 2.5V1.5ZM9 2.75C9 2.55109 9.07902 2.36032 9.21967 2.21967C9.36032 2.07902 9.55109 2 9.75 2C9.94891 2 10.1397 2.07902 10.2803 2.21967C10.421 2.36032 10.5 2.55109 10.5 2.75V3.75C10.5 3.94891 10.421 4.13968 10.2803 4.28033C10.1397 4.42098 9.94891 4.5 9.75 4.5C9.55109 4.5 9.36032 4.42098 9.21967 4.28033C9.07902 4.13968 9 3.94891 9 3.75V2.75ZM9.75 5.5C9.55109 5.5 9.36032 5.57902 9.21967 5.71967C9.07902 5.86032 9 6.05109 9 6.25V7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25V6.25C10.5 6.05109 10.421 5.86032 10.2803 5.71967C10.1397 5.57902 9.94891 5.5 9.75 5.5Z"
                                                    fill="#34B2DA"
                                                />
                                            </svg>
                                            <span>{ticket.ticketName}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white">${ticket.price}</span>
                                            <button onClick={() => handleDeleteTicket(index)}>
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
                                                        fill="red"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </button>
                                </div>
                            ))
                        }
                        <div className="w-full">
                            <label className="block text-sm font-medium text-white mb-3">
                                Custom Fee <span className="text-white/30 text-xs mt-1">(optional)</span>
                            </label>
                        </div>
                        <button
                            onClick={() => setCustomFeeModal(true)}
                            className="w-full h-10 text-sm bg-white/[0.03] border-2 border-dashed border-white/10 rounded-lg px-4 py-2.5 text-white flex items-center gap-3"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="10"
                                viewBox="0 0 14 10"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10218 14 1.5V2.5C14 2.776 13.773 2.994 13.505 3.062C13.0743 3.1718 12.6925 3.42192 12.4198 3.77286C12.1472 4.1238 11.9991 4.55557 11.9991 5C11.9991 5.44443 12.1472 5.8762 12.4198 6.22714C12.6925 6.57808 13.0743 6.8282 13.505 6.938C13.773 7.006 14 7.224 14 7.5V8.5C14 8.89782 13.842 9.27936 13.5607 9.56066C13.2794 9.84196 12.8978 10 12.5 10H1.5C1.10218 10 0.720644 9.84196 0.43934 9.56066C0.158035 9.27936 0 8.89782 0 8.5V7.5C0 7.224 0.227 7.006 0.495 6.938C0.925654 6.8282 1.30747 6.57808 1.58016 6.22714C1.85285 5.8762 2.00088 5.44443 2.00088 5C2.00088 4.55557 1.85285 4.1238 1.58016 3.77286C1.30747 3.42192 0.925654 3.1718 0.495 3.062C0.227 2.994 0 2.776 0 2.5V1.5ZM9 2.75C9 2.55109 9.07902 2.36032 9.21967 2.21967C9.36032 2.07902 9.55109 2 9.75 2C9.94891 2 10.1397 2.07902 10.2803 2.21967C10.421 2.36032 10.5 2.55109 10.5 2.75V3.75C10.5 3.94891 10.421 4.13968 10.2803 4.28033C10.1397 4.42098 9.94891 4.5 9.75 4.5C9.55109 4.5 9.36032 4.42098 9.21967 4.28033C9.07902 4.13968 9 3.94891 9 3.75V2.75ZM9.75 5.5C9.55109 5.5 9.36032 5.57902 9.21967 5.71967C9.07902 5.86032 9 6.05109 9 6.25V7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25V6.25C10.5 6.05109 10.421 5.86032 10.2803 5.71967C10.1397 5.57902 9.94891 5.5 9.75 5.5Z"
                                    fill="#A3E635"
                                />
                            </svg>
                            Add custom fee
                        </button>
                        {
                            customName && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCustomFeeModal(true)}
                                        className="w-full h-10 text-sm bg-white/[0.01] border-2 border-white/5 rounded-lg px-4 py-2.5 text-white flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="10"
                                                viewBox="0 0 14 10"
                                                fill="none"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10218 14 1.5V2.5C14 2.776 13.773 2.994 13.505 3.062C13.0743 3.1718 12.6925 3.42192 12.4198 3.77286C12.1472 4.1238 11.9991 4.55557 11.9991 5C11.9991 5.44443 12.1472 5.8762 12.4198 6.22714C12.6925 6.57808 13.0743 6.8282 13.505 6.938C13.773 7.006 14 7.224 14 7.5V8.5C14 8.89782 13.842 9.27936 13.5607 9.56066C13.2794 9.84196 12.8978 10 12.5 10H1.5C1.10218 10 0.720644 9.84196 0.43934 9.56066C0.158035 9.27936 0 8.89782 0 8.5V7.5C0 7.224 0.227 7.006 0.495 6.938C0.925654 6.8282 1.30747 6.57808 1.58016 6.22714C1.85285 5.8762 2.00088 5.44443 2.00088 5C2.00088 4.55557 1.85285 4.1238 1.58016 3.77286C1.30747 3.42192 0.925654 3.1718 0.495 3.062C0.227 2.994 0 2.776 0 2.5V1.5ZM9 2.75C9 2.55109 9.07902 2.36032 9.21967 2.21967C9.36032 2.07902 9.55109 2 9.75 2C9.94891 2 10.1397 2.07902 10.2803 2.21967C10.421 2.36032 10.5 2.55109 10.5 2.75V3.75C10.5 3.94891 10.421 4.13968 10.2803 4.28033C10.1397 4.42098 9.94891 4.5 9.75 4.5C9.55109 4.5 9.36032 4.42098 9.21967 4.28033C9.07902 4.13968 9 3.94891 9 3.75V2.75ZM9.75 5.5C9.55109 5.5 9.36032 5.57902 9.21967 5.71967C9.07902 5.86032 9 6.05109 9 6.25V7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25V6.25C10.5 6.05109 10.421 5.86032 10.2803 5.71967C10.1397 5.57902 9.94891 5.5 9.75 5.5Z"
                                                    fill="#A3E635"
                                                />
                                            </svg>
                                            <span>{customName}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white">{discountType === 'percentage' ? "%" : "$"}{customFee}</span>
                                            <button onClick={() => setCustomName("")}>
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
                                                        fill="red"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            ),
        },
        {
            id: 6,
            title: "",
            description: "",
            fields: (
                <div className="w-full">
                    <div className="w-full">
                        <div className="flex justify-center items-center mt-4">
                            <img
                                src={success}
                                alt="Image"
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                        </div>
                    </div>
                    <div className="w-full mt-4">
                        <label className="block text-xl text-center font-medium text-white mb-3">
                            Your event is {statusNotify === 'draft' ? "drafted" : "live"}
                        </label>
                        {statusNotify === 'draft' ? (
                            <p className="text-white/50 text-center">
                                Your event has been drafted, you can check it out in the drafts sections.
                            </p>
                        ) : (
                            <p className="text-white/50 text-center">
                                Your event is live now! You can check it out.
                            </p>
                        )}
                        <div className="flex justify-between gap-5 mt-1 w-full">
                            {
                                statusNotify === 'draft' ? (
                                    <>
                                        <a
                                            href={`/organizer/events/${eventId}`}
                                            className="px-4 py-2 w-full rounded-full h-10 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 mt-3"
                                            disabled={step !== 5}
                                        >
                                            View event
                                        </a>
                                        <a
                                            onClick={() => setPublishDialogOpen(true)}
                                            className="px-4 py-2 w-full rounded-full h-10 bg-white font-semibold text-black flex items-center justify-center gap-2 mt-3"
                                            disabled={step !== 5}
                                        >
                                            Publish event
                                        </a>
                                    </>
                                ) : (
                                    <a
                                        href={`/organizer/events/${eventId}`}
                                        className="px-4 py-2 w-full rounded-full h-10 bg-white font-semibold text-black flex items-center justify-center gap-2 mt-3"
                                        disabled={step !== 5}
                                    >
                                        View event
                                    </a>
                                )
                            }
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    const Header = () => (
        <div className="fixed top-0 left-0 right-0 bg-[#111111] border-b border-white/10 z-50">
            <div className="h-16 px-4 md:px-6 flex items-center justify-between">
                <Link to="/organizer/dashboard" className="flex items-center gap-2">
                    <svg width="120" height="38" viewBox="0 0 600 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_3005_203)">
                            <path d="M0.419336 67.5563C0.219336 67.5563 0.119336 67.4563 0.0193359 67.3563C-0.0806641 67.1563 -0.0806641 67.0563 0.0193359 66.9563L36.0193 -0.0436554C36.0193 -0.143655 36.1193 -0.243652 36.3193 -0.243652H45.9193C46.0193 -0.243652 46.2193 -0.143655 46.3193 -0.0436554L82.2193 66.8563C82.3193 66.9563 82.3193 67.0563 82.2193 67.2563C82.1193 67.3563 82.0193 67.4563 81.8193 67.4563H67.4193C67.2193 67.4563 67.1193 67.3563 67.0193 67.2563L41.4193 19.5563C41.3193 19.3563 41.2193 19.3563 41.0193 19.3563C40.9193 19.3563 40.7193 19.4563 40.6193 19.5563L15.2193 67.3563C15.1193 67.4563 15.0193 67.5563 14.8193 67.5563H0.419336Z" fill="white" />
                            <path d="M83.9374 0.556534C83.7374 0.156534 83.8374 -0.043457 84.3374 -0.043457H98.8374C98.9374 -0.043457 99.1374 0.0565399 99.2374 0.15654L124.837 47.7565C124.937 47.9565 125.037 47.9565 125.237 47.9565C125.437 47.9565 125.537 47.8565 125.637 47.7565L151.237 0.15654C151.237 -0.0434601 151.437 -0.043457 151.637 -0.043457H165.937C166.337 -0.043457 166.437 0.156534 166.337 0.556534L130.437 67.4565C130.337 67.5565 130.237 67.6565 130.037 67.6565H120.437C120.237 67.6565 120.237 67.5565 120.137 67.4565L83.9374 0.556534Z" fill="white" />
                            <path d="M172.855 27.2565C172.855 26.9565 172.955 26.8564 173.255 26.8564H227.655C227.955 26.8564 228.155 26.9565 228.155 27.2565V40.1564C228.155 40.4564 227.955 40.5564 227.655 40.5564H186.655C186.455 40.5564 186.255 40.6565 186.255 40.9565V53.4565C186.255 53.6565 186.355 53.8564 186.655 53.8564H227.855C228.055 53.9564 228.155 54.0564 228.255 54.0564C228.355 54.0564 228.355 54.1564 228.355 54.3564V67.1564C228.355 67.4564 228.155 67.6564 227.855 67.6564H173.355C173.055 67.6564 172.855 67.4564 172.855 67.1564V27.2565ZM173.255 13.3564C172.955 13.3564 172.855 13.2565 172.855 12.9565V0.356445C172.955 0.0564453 173.155 -0.143555 173.355 -0.143555H227.855C228.155 -0.0435547 228.355 0.156445 228.355 0.356445V12.9565C228.355 13.2565 228.155 13.4565 227.855 13.4565H173.255V13.3564Z" fill="white" />
                            <path d="M240.174 0.156342C240.174 -0.0436585 240.274 -0.243652 240.574 -0.243652H254.874C254.974 -0.243652 255.074 -0.143661 255.174 -0.143661L299.074 49.5563C299.274 49.7563 299.374 49.7563 299.574 49.7563C299.774 49.6563 299.774 49.5563 299.774 49.3563V0.356339C299.974 0.0563385 300.074 -0.143661 300.274 -0.143661H313.074C313.374 -0.0436615 313.574 0.156338 313.574 0.356339V67.0563C313.574 67.3563 313.374 67.5563 313.074 67.5563H297.074C296.974 67.5563 296.874 67.5563 296.774 67.4563C293.574 63.8563 289.874 59.6563 285.574 54.8563C281.874 50.7563 277.474 45.7563 272.274 39.8563C267.074 33.9563 261.074 27.1563 254.374 19.4563C254.274 19.2563 254.174 19.2563 253.974 19.3563C253.774 19.4563 253.774 19.5563 253.774 19.7563V67.2563C253.774 67.5563 253.574 67.7563 253.174 67.7563H240.674C240.374 67.7563 240.274 67.6563 240.274 67.3563V0.156342H240.174Z" fill="white" />
                            <path d="M325.421 0.156342C325.421 -0.0436585 325.521 -0.243652 325.821 -0.243652H338.721C339.021 -0.243652 339.121 -0.143658 339.121 0.156342V35.6563C339.121 39.8563 339.721 43.1563 340.921 45.5563C342.121 47.9563 343.721 49.7563 345.721 50.9563C347.721 52.1563 350.021 52.9563 352.621 53.2563C355.221 53.5563 357.921 53.7563 360.721 53.8563C364.021 53.9563 366.921 53.7563 369.621 53.1563C372.321 52.5563 374.621 51.5563 376.521 50.1563C378.421 48.7563 379.921 46.8563 381.021 44.3563C382.121 41.9563 382.621 38.9563 382.621 35.2563V0.156342C382.621 -0.0436585 382.721 -0.243652 383.021 -0.243652H395.921C396.121 -0.243652 396.321 -0.143658 396.321 0.156342V34.5563C396.321 39.2563 395.821 43.2563 394.821 46.7563C393.821 50.2563 392.421 53.1563 390.721 55.5563C389.021 57.9563 386.921 59.9563 384.621 61.5563C382.321 63.0563 379.821 64.3563 377.121 65.1563C374.521 66.0563 371.721 66.6563 369.021 66.9563C366.221 67.2563 363.521 67.4563 360.821 67.4563C356.521 67.4563 352.321 67.0563 348.021 66.1563C343.821 65.2563 340.021 63.6563 336.621 61.2563C333.221 58.8563 330.521 55.4563 328.421 51.1563C326.321 46.8563 325.321 41.2563 325.321 34.5563V0.156342H325.421Z" fill="white" />
                            <path d="M408.227 27.2565C408.227 26.9565 408.327 26.8564 408.627 26.8564H463.027C463.327 26.8564 463.527 26.9565 463.527 27.2565V40.1564C463.527 40.4564 463.327 40.5564 463.027 40.5564H422.027C421.827 40.5564 421.627 40.6565 421.627 40.9565V53.4565C421.627 53.6565 421.727 53.8564 422.027 53.8564H463.127C463.327 53.9564 463.427 54.0564 463.527 54.0564C463.627 54.0564 463.627 54.1564 463.627 54.3564V67.1564C463.627 67.4564 463.427 67.6564 463.127 67.6564H408.727C408.427 67.6564 408.227 67.4564 408.227 67.1564V27.2565ZM408.727 13.3564C408.427 13.3564 408.327 13.2565 408.327 12.9565V0.356445C408.427 0.0564453 408.627 -0.143555 408.827 -0.143555H463.327C463.627 -0.0435547 463.827 0.156445 463.827 0.356445V12.9565C463.827 13.2565 463.627 13.4565 463.327 13.4565H408.727V13.3564Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_3005_203">
                                <rect width="600" height="70" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </Link>

                {/* Progress steps in the middle */}
                <div className="hidden md:flex items-center gap-2 flex-1 max-w-[400px] mx-8">
                    {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
                        <div key={stepNumber} className="flex-1">
                            <div
                                className={`h-1 w-full rounded-full ${stepNumber <= step ? "bg-[#34B2DA]" : "bg-white/10"
                                    }`}
                            />
                            <span
                                className={`mt-1 text-xs ${stepNumber <= step ? "text-white" : "text-white/40"
                                    } text-center block`}
                            >
                                {stepNumber === 1 && "Basic info"}
                                {stepNumber === 2 && "Date"}
                                {stepNumber === 3 && "Location"}
                                {stepNumber === 4 && "Details"}
                                {stepNumber === 5 && "Tickets"}
                                {stepNumber === 6 && "Finish"}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => window.history.back()}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M15 5L5 15M5 5L15 15"
                            stroke="white"
                            strokeWidth="1.67"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );

    return (
        <>
            <div className="min-h-screen bg-[#111111] h-full w-full">
                <Header />
                <ImageCropper
                    open={isCropperOpen}
                    onOpenChange={setIsCropperOpen}
                    imageFile={tempImageFile}
                    onCropComplete={handleCropComplete}
                />
                {/* Update the main container structure */}
                <div className="pt-16 flex flex-col md:flex-row bg-[#111111]">
                    {/* Scrollable left side */}
                    <div className="w-full order-2 md:order-1 md:w-1/2 min-h-[calc(100vh-64px)] overflow-y-auto flex flex-col items-center justify-center">
                        <div className="p-8 max-w-xl mx-auto flex flex-col w-full">
                            {formSteps[step - 1] && (
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-white">
                                        {formSteps[step - 1].title}
                                    </h2>
                                    <p className="text-white/60 text-sm mt-1">
                                        {formSteps[step - 1].description}
                                    </p>
                                    {formSteps[step - 1].fields}
                                </div>
                            )}
                            <div className="flex justify-between gap-5 mt-8 w-full">
                                {
                                    step === 6 ? (
                                        ""
                                    ) : (
                                        <button
                                            onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
                                            className={`size-10 flex-shrink-0 flex items-center justify-center rounded-full border border-white/10 text-white`}
                                        >
                                            <ArrowLeft className="size-5" />
                                        </button>
                                    )
                                }
                                {step === 5 ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                if (!userId && !oragnizerId) {
                                                    setIsModalOpen(true);
                                                    return;
                                                }

                                                if (userId && !oragnizerId) {
                                                    setIsModalDetailsOpen(true);
                                                    return;
                                                }

                                                if (step === 5) {
                                                    setStatusNotify("draft"); // or "live"
                                                    handleAddEvent("NO", oragnizerId, "redirect"); // or "YES"
                                                    return;
                                                }

                                                if (step < 6) {
                                                    setStep((prevStep) => prevStep + 1);
                                                }
                                            }}
                                            className={`px-4 py-2 w-full rounded-full h-10 border border-white/10 text-white font-semibold flex items-center justify-center gap-2
                                                ${step !== 5 || isAdding || !tickets.length > 0
                                                    ? "disabled:opacity-50 cursor-not-allowed text-black"
                                                    : "text-black"
                                                }`}
                                            disabled={step !== 5 || isAdding || !tickets.length > 0}
                                        >
                                            {isAdding && addStatus === "draft" ? "Loading..." : "Draft it"}
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (!userId && !oragnizerId) {
                                                    setIsModalOpen(true);
                                                    return;
                                                }

                                                if (userId && !oragnizerId) {
                                                    setIsModalDetailsOpen(true);
                                                    return;
                                                }

                                                if (step === 5) {
                                                    setStatusNotify("live");
                                                    handleAddEvent("YES", oragnizerId, "redirect");
                                                    return;
                                                }

                                                if (step < 6) {
                                                    setStep((prevStep) => prevStep + 1);
                                                }
                                            }}

                                            className={`px-4 py-2 w-full bg-white rounded-full h-10 font-semibold flex items-center justify-center gap-2
                                                ${step !== 5 || isAdding || !tickets.length > 0
                                                    ? "disabled:opacity-50 cursor-not-allowed text-black"
                                                    : "text-black"
                                                }`}
                                            disabled={step !== 5 || isAdding || !tickets.length > 0}
                                        >
                                            {isAdding && addStatus === "live" ? "Loading..." : "Publish"}
                                        </button>
                                        <OnboardLogin
                                            isOpen={isModalOpen}
                                            isAdding={isAdding}
                                            onClose={() => setIsModalOpen(false)}
                                            loginClosed={handleLoginComplete}
                                            onTrigger={handleAddEvent}
                                        />
                                        <OnboardDetails isAdding={isAdding} isOpen={isModalDetailsOpen} onClose={() => setIsModalDetailsOpen(false)} onTrigger={handleAddEvent} userId={userId} />
                                    </>
                                ) : step === 6 ? (
                                    ""
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (step === 1) {
                                                if (!eventName.trim()) {
                                                    alert("Please enter an event name before proceeding.");
                                                    return;
                                                }
                                                if (!getImagesForUpload()) {
                                                    alert("Please upload a flyer before proceeding.");
                                                    return;
                                                }
                                                console.log("Images ready for upload", getImagesForUpload());
                                            }

                                            if (step === 2) {
                                                if (!ticketStartDate) {
                                                    alert("Please select a ticket start date before proceeding.");
                                                    return;
                                                }
                                                if (!ticketEndDate) {
                                                    alert("Please select a ticket end date before proceeding.");
                                                    return;
                                                }
                                            }

                                            if (step === 5) {
                                                handleAddEvent("YES", oragnizerId, "redirect");
                                                return
                                            }

                                            if (step < 6) {
                                                setStep((prevStep) => prevStep + 1);
                                            }
                                        }}
                                        className={`px-4 py-2 w-full bg-white rounded-full h-10 font-semibold flex items-center justify-center gap-2
                                                ${step === 5 ||
                                                step === 1 && (!eventName.trim() || !getImagesForUpload()) ||
                                                step === 2 && (!ticketStartDate || !ticketEndDate) ||
                                                step === 3 && (!venueAddress || !venueName)
                                                ? "disabled:opacity-50 cursor-not-allowed text-black"
                                                : "text-black"
                                            }`}
                                        disabled={
                                            step === 5 ||
                                            step === 1 && (!eventName.trim() || !getImagesForUpload()) ||
                                            step === 2 && (!ticketStartDate || !ticketEndDate) ||
                                            step === 3 && (!venueAddress || !venueName)
                                        }
                                    >
                                        {step === 6 ? "Complete creating Event" : "Continue"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Fixed right side preview */}
                    <div className="w-full order-1 md:order-2 md:w-1/2 md:h-[calc(100vh-64px)] bg-[#141414] flex items-center justify-center p-8 md:sticky top-16">
                        <div className="bg-white/[0.03] mx-auto rounded-3xl grid grid-rows-[1fr_70px] p-2">
                            <div className="bg-[#0F0F0F] rounded-2xl h-[350px] w-[350px] xl:h-[450px] xl:w-[450px] flex items-center justify-center">
                                {imagePreview ? (
                                    <div className="w-full aspect-square flex items-center justify-center rounded-xl overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="Event Cover"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="96"
                                        height="96"
                                        viewBox="0 0 96 96"
                                        fill="none"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M12 24C12 20.8174 13.2643 17.7652 15.5147 15.5147C17.7652 13.2643 20.8174 12 24 12H72C75.1826 12 78.2348 13.2643 80.4853 15.5147C82.7357 17.7652 84 20.8174 84 24V72C84 75.1826 82.7357 78.2348 80.4853 80.4853C78.2348 82.7357 75.1826 84 72 84H24C20.8174 84 17.7652 82.7357 15.5147 80.4853C13.2643 78.2348 12 75.1826 12 72V24Z"
                                            fill="white"
                                            fillOpacity="0.1"
                                        />
                                    </svg>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-2 p-3">
                                {/* <div className="flex items-center gap-2 text-white/60 text-sm">
                                {selectedCategory ? (
                                    <>
                                        <span className="flex items-center">
                                            {selectedCategory.icon}
                                        </span>
                                        <span>{selectedCategory.name}</span>
                                    </>
                                ) : (
                                    "Category"
                                )}
                            </div> */}
                                <p className="text-white/60 text-sm">
                                    {ticketStartDate
                                        ? `${ticketStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${eventStartTime}`
                                        : "-"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between gap-2 p-3">
                                <div className="flex flex-col gap-2">
                                    <p className="text-white/60 text-sm">{eventName || "Event Name"}</p>
                                    <p className="text-white/60 text-sm">
                                        {venueName || "Venue Name"}
                                    </p>
                                </div>
                                <p className="text-white/60 text-2xl font-semibold">
                                    ${minPrice || "0"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Dialog
                    open={isCustomFeeModal}
                    onOpenChange={setCustomFeeModal}
                    className="!max-w-[400px] border border-white/10 rounded-xl !p-0"
                >
                    <DialogContent className="max-h-[90vh] !gap-0 relative">
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
                            <DialogTitle className="mt-4">Add custom fee</DialogTitle>
                            <DialogDescription>
                                Add tax or any other fee for you event
                            </DialogDescription>
                        </div>
                        <div className="flex flex-col gap-4 p-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white">
                                    Custom fee name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sales tax"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg px-3 focus:outline-none w-full"
                                />
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <label className="text-sm font-medium text-white">
                                    Custom fee type
                                </label>
                                <div className="flex gap-2 bg-[#0F0F0F] p-1 border border-white/[0.03] h-12 rounded-full">
                                    <button
                                        onClick={() => setDiscountType("percentage")}
                                        className={`flex-1 flex items-center text-white justify-center gap-2 rounded-full py-2 text-sm ${discountType === "percentage"
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
                                        className={`flex-1 text-white flex items-center justify-center gap-2 rounded-full py-2 text-sm ${discountType === "fixed"
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
                                    Custom {discountType === "percentage" ? "percentage" : "amount"}
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
                                        value={customFee}
                                        onChange={(e) => setCustomFee(e.target.value)}
                                        className="border bg-primary text-white text-sm border-white/10 h-10 rounded-lg pl-8 pr-3 focus:outline-none w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row border-t border-white/10 bottom-0 bg-primary justify-between w-full gap-3 p-4">
                            <button
                                onClick={() => setCustomFeeModal(false)}
                                className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-full border border-white/10 w-full"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setCustomFeeModal(false)}
                                className="bg-white hover:bg-white/90 text-black px-4 py-2 w-full rounded-full text-sm font-medium"
                            >
                                Add custom fee
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={publishDialogOpen}
                    onOpenChange={setPublishDialogOpen}
                >
                    <DialogContent>
                        <DialogTitle className="w-80">
                            Publish ?
                        </DialogTitle>
                        <DialogDescription>
                            This event will be published. Users can see this event and purchase the tickets.
                        </DialogDescription>
                        <div className="flex flex-col gap-3 mt-3">
                            <button
                                onClick={async () => {
                                    if (!eventId) return;

                                    try {
                                        const newStatus = "YES";

                                        const response = await axios.patch(
                                            `${url}/event/change-status/${eventId}`,
                                            { status: newStatus }
                                        );

                                        setPublishDialogOpen(false);
                                        window.location.href = `/organizer/events/${eventId}`;
                                    } catch (error) {
                                        console.error("Error updating event status:", error);
                                        alert("Failed to change event status. Please try again.");
                                    }
                                }}
                                className="w-full bg-green-500/60 hover:bg-green-600/90 text-white border-white/10 border text-center rounded-full h-10 px-4 focus:outline-none flex items-center justify-center gap-2 font-medium transition-colors"
                            >
                                Publish
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

            </div>
        </>
    );
}