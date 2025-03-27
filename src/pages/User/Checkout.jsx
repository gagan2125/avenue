import React, { useEffect, useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../../constants/stripePromise";
import url from "../../constants/url";


const appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "#0F0F0F",
    colorText: "#e0e0e0",
    colorIcon: "#e0e0e0",
    borderRadius: "25px",
    spacingUnit: "5px",
    fontFamily: "Arial, sans-serif",
  },
  labels: 'floating',
};

const CheckoutForm = ({
  clientSecret,
  setStep,
  amount,
  organizerId,
  userId,
  eventId,
  date,
  status,
  count,
  ticketId,
  email,
  firstName,
  lastName,
  tickets,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(true);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!stripe || !elements) {
      setErrorMsg("Stripe.js has not yet loaded. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams:{
          return_url: 'https://avenue.tickets/ticket#step3',
        },
        redirect: "if_required",
      });

      console.log("Error:", error);
      console.log("Payment Intent:", paymentIntent);

      if (error) {
        setErrorMsg(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setSuccess(true);

        const paymentMethodType =
          paymentIntent.payment_method_types &&
            paymentIntent.payment_method_types.length > 0
            ? paymentIntent.payment_method_types[0]
            : null;
        console.log("Payment Method Type:", paymentMethodType);

        const response = await fetch(`${url}/send-ticket-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amount,
            organizerId: organizerId,
            userId: userId,
            eventId: eventId,
            date: date,
            status: "pending",
            count: count,
            ticketId: ticketId,
            tickets: tickets,
            firstName: firstName,
            lastName: lastName,
            email: email,
            clientSecret: clientSecret,
            paymentMethod: paymentMethodType
          }),
        });
        const data = await response.json();
        localStorage.setItem("payId", data.paymentId);
        setStep(3);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {/* <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Enter promo code"
            className="bg-transparent border border-[#787878] text-white p-2 rounded-l-md w-full focus:outline-none"
          />
          <button
            type="button"
            className="bg-white border text-black font-semibold py-2 px-4 rounded-r-md hover:bg-gray-200"
          >
            Apply
          </button>
        </div> */}
      </div>
      <div className="flex items-center justify-center bg-primary mt-10">
        <form
          onSubmit={handleSubmit}
          name="paymentForm"
          className="w-full max-w-md bg-primary rounded-lg shadow-lg text-white"
        >
          <div className="space-y-1">
            <PaymentElement
              onChange={(e) => {
                setDisabled(!e.complete);
              }}
            />
          </div>
          {errorMsg && (
            <div className="mt-3 p-2 bg-red-600 text-white rounded-lg text-center font-inter">
              {errorMsg}
            </div>
          )}
          {success && (
            <div className="mt-3 p-2 bg-green-600 text-white rounded-lg text-center font-inter">
              ✅ Payment Successful! Redirecting...
            </div>
          )}
          <button
            disabled={!stripe || loading || disabled}
            type="submit"
            className={`mt-6 font-inter w-full ${loading || disabled ? "bg-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-200"
              } text-black font-semibold py-3 rounded-full shadow-md transition duration-200`}
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </form>
      </div>
    </>
  );
};

const Checkout = ({ clientSecret, setStep, amount, organizerId, userId, eventId, date, count, ticketId, email, firstName, lastName, tickets }) => {
  if (!clientSecret)
    return (
      <div className="text-white text-center min-h-screen flex items-center justify-center">
        <p>Loading payment details...</p>
      </div>
    );
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm
        clientSecret={clientSecret}
        setStep={setStep}
        amount={amount}
        organizerId={organizerId}
        userId={userId}
        eventId={eventId}
        date={date}
        status={"pending"}
        count={count}
        ticketId={ticketId}
        tickets={tickets}
        firstName={firstName}
        lastName={lastName}
        email={email}
      />
    </Elements>
  );
};

export default Checkout;
