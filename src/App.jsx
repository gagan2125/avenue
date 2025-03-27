import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "../src/components/layouts/Header";
import Footer from "../src/components/layouts/Footer";
import Home from "./pages/User/Home";
import Info from "./pages/User/Info";
import Creater from "./pages/User/Creater";
import Checkout from "./pages/User/Checkout";
import { stripePromise } from "./constants/stripePromise";
import { Elements } from "@stripe/react-stripe-js";
import QrTicket from "./pages/User/QrTicket";
import Tickets from "./pages/User/Tickets";
import Profile from "./pages/User/Profile";
import Type from "./pages/Organizer/Type";
import Ticket from "./pages/User/Ticket";
import Saved from "./pages/User/Saved";
import OrganizerProfile from "./pages/Organizer/OrganizerProfile";
import OrganizerDashboard from "./pages/Organizer/OrganizerDashboard";
import OrganizerEvents from "./pages/Organizer/OrganizerEvents";
import OrganizerWallet from "./pages/Organizer/OrganizerWallet";
import EventDetails from "./pages/Organizer/EventDetails";
import OrganizeMembers from "./pages/Organizer/OrganizeMembers";
import CreateEvent from "./pages/Organizer/CreateEvent";
import TicketEvent from "./pages/Organizer/TicketEvent";
import EditEvent from "./pages/Organizer/EditEvent";
import Preview from "./pages/Organizer/Preview";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsCondition from "./pages/TermsCondition";
import StripeSuccess from "./pages/StripeSuccess";
import OrganizerAnalytics from "./pages/Organizer/OrganizerAnalytics";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import DisputesTab from "./pages/Organizer/DisputesTab";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
      initGA()
  }, [])

  const hideHeader = [
    "/login",
    "/qr-ticket",
    "/organizer/profile",
    "/organizer/dashboard",
    "/organizer/events",
    "/organizer/analytics",
    "/organizer/wallet",
    "/organizer/members",
    "/organizer/disputes",
    "/organizer/create-event",
    "/organizer/create-ticket/ticketedevent",
    "/organizer/edit-event",
    "/privacy-policy",
    "/terms-and-conditions",
    "/stripe-success",
    "/organizer/create-ticket/rsvp",
  ];
  const hideFooter = [
    "/login",
    "/info",
    "/creater",
    "/checkout",
    "/qr-ticket",
    "/tickets",
    "/profile",
    "/ticket",
    "/saved",
    "/organizer/profile",
    "/organizer/dashboard",
    "/organizer/events",
    "/organizer/analytics",
    "/organizer/wallet",
    "/organizer/members",
    "/organizer/disputes",
    "/organizer/create-event",
    "/organizer/create-ticket/ticketedevent",
    "/organizer/edit-event",
    "/privacy-policy",
    "/terms-and-conditions",
    "/stripe-success",
    "/organizer/create-ticket/rsvp",
  ];

  const shouldHideNavbarAndFooter = hideHeader.some((path) =>
    location.pathname.startsWith(path)
  );

  const shouldHideFooter = hideFooter.some((path) =>
    location.pathname.startsWith(path)
  );

  const handleDetail = (type, id, name) => {
    localStorage.setItem("user_organizer_id", id);

    if (type === "info") {
      navigate(`/info/${name}`);
    } else if (type === "creater") {
      navigate(`/creater/${id}`);
    }
  };

  return (
    <>
      <div className="bg-primary h-screen font-manrope">
        {!shouldHideNavbarAndFooter && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:name" element={<Info />} />
          <Route path="/preview/:name" element={<Preview />} />
          <Route path="/creator/:id" element={<Creater />} />
          <Route
            path="/checkout"
            element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            }
          />
          <Route path="/qr-ticket/:id" element={<QrTicket />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route
            path="/ticket"
            element={
              <Elements stripe={stripePromise}>
                <Ticket />
              </Elements>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/type" element={<Type />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/organizer/profile" element={<OrganizerProfile />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/events" element={<OrganizerEvents />} />
          <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />
          <Route path="/organizer/wallet" element={<OrganizerWallet />} />
          <Route path="/organizer/events/:id" element={<EventDetails />} />
          <Route path="/organizer/members" element={<OrganizeMembers />} />
          <Route path="/organizer/disputes" element={<DisputesTab />} />
          <Route path="/organizer/create-event" element={<CreateEvent />} />
          <Route path="/organizer/edit-event/:id" element={<EditEvent />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsCondition />} />
          <Route path="/stripe-success" element={<StripeSuccess />} />
          <Route
            path="/organizer/create-ticket/ticketedevent/:id"
            element={<TicketEvent />}
          />
          <Route
            path="/organizer/create-ticket/:id"
            element={<TicketEvent />}
          />
        </Routes>
        {!shouldHideFooter && <Footer />}
      </div>
    </>
  );
}

function Main() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default Main;
