/* eslint-disable no-unused-vars */
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  Outlet,
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

// layout components
const MainLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const HeaderOnlyLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const MinimalLayout = () => <Outlet />;

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // used sets for faster lookups
  const headerHiddenPaths = new Set([
    "/login",
    "/qr-ticket",
    "/organizer/profile",
    "/organizer/dashboard",
    "/organizer/events",
    "/organizer/wallet",
    "/organizer/members",
    "/organizer/create-event",
    "/organizer/create-ticket/ticketedevent",
    "/organizer/edit-event",
    "/privacy-policy",
    "/terms-and-conditions",
    "/stripe-success"
  ]);

  const footerHiddenPaths = new Set([
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
    "/organizer/wallet",
    "/organizer/members",
    "/organizer/create-event",
    "/organizer/create-ticket/ticketedevent",
    "/organizer/edit-event",
    "/privacy-policy",
    "/terms-and-conditions",
    "/stripe-success"
  ]);

  // added more efficient path checking function
  const isPathInSet = (path, pathSet) => {
    // check if current path starts with any path in the set
    for (const hiddenPath of pathSet) {
      if (path.startsWith(hiddenPath)) {
        return true;
      }
    }
    return false;
  };

  const shouldHideHeader = isPathInSet(location.pathname, headerHiddenPaths);
  const shouldHideFooter = isPathInSet(location.pathname, footerHiddenPaths);

  const handleDetail = (type, id, name) => {
    localStorage.setItem("user_organizer_id", id);

    if (type === "info") {
      navigate(`/info/${name}`);
    } else if (type === "creater") {
      navigate(`/creater/${id}`);
    }
  };

  // determine which layout to use
  let LayoutComponent;
  if (shouldHideHeader && shouldHideFooter) {
    LayoutComponent = MinimalLayout;
  } else if (shouldHideFooter) {
    LayoutComponent = HeaderOnlyLayout;
  } else {
    LayoutComponent = MainLayout;
  }

  return (
    <div className="bg-primary h-screen font-manrope">
      <Routes>
        {/* main layout routes */}
        <Route element={<LayoutComponent />}>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/:name" element={<Info />} />
          <Route path="/preview/:name" element={<Preview />} />
          <Route path="/creator/:id" element={<Creater />} />
          <Route path="/type" element={<Type />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsCondition />} />
          <Route path="/stripe-success" element={<StripeSuccess />} />

          {/* user routes */}
          <Route path="/checkout" element={
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          } />
          <Route path="/qr-ticket/:id" element={<QrTicket />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/ticket" element={
            <Elements stripe={stripePromise}>
              <Ticket />
            </Elements>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<Saved />} />

          {/* organizer routes */}
          <Route path="/organizer">
            <Route path="profile" element={<OrganizerProfile />} />
            <Route path="dashboard" element={<OrganizerDashboard />} />
            <Route path="events" element={<OrganizerEvents />} />
            <Route path="wallet" element={<OrganizerWallet />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="members" element={<OrganizeMembers />} />
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="edit-event/:id" element={<EditEvent />} />
            <Route path="create-ticket/ticketedevent/:id" element={<TicketEvent />} />
            <Route path="create-ticket/:id" element={<TicketEvent />} />
          </Route>
        </Route>
      </Routes>
    </div>
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