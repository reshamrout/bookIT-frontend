import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Checkout() {
  const loc = useLocation();
  const navigate = useNavigate();
  const data = loc.state;

  const [terms, setTerms] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!data) {
    return (
      <div className="py-20 text-center">
        No booking in progress. Go back to{" "}
        <a className="text-blue-600" href="/">
          home
        </a>
        .
      </div>
    );
  }

  const { experience, slot, qty } = data;

  const subtotal = slot.price * qty;
  const taxes = Math.round(subtotal * (59 / 999));
  const total = subtotal + taxes;
  const discounted = promoResult ? total - promoResult.discount : total;

  const applyPromo = async () => {
    if (!promoCode) return;
    try {
      const res = await API.post("/promo/validate", {
        code: promoCode,
        subtotal: total,
      });
      if (res.data.valid)
        setPromoResult({ ...res.data, discount: res.data.discount });
      else setPromoResult({ invalid: true, message: res.data.message });
    } catch (err) {
      setPromoResult({ invalid: true, message: "Server error" });
    }
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError("");
    if (!name || !email) return setError("Please provide name and valid email");
    if (!terms)
      return setError("You must agree to the terms and safety policy");

    setLoading(true);
    try {
      const payload = {
        experienceId: experience._id,
        slotId: slot._id,
        name,
        email,
        qty,
        promo: promoResult?.code || "",
      };
      const res = await API.post("/bookings", payload);
      navigate("/result", { state: { success: true, booking: res.data } });
    } catch (err) {
      const message = err?.response?.data?.error || "Booking failed";
      navigate("/result", { state: { success: false, message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link
        to={-1}
        className="flex items-center gap-2 text-sm text-gray-700 mb-4 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Checkout
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
        <div className="p-8 bg-gray-100 rounded-lg h-fit">
          <form onSubmit={submit} id="checkout-form" className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-[#EDEDED] border border-gray-200 rounded-md"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-[#EDEDED] border border-gray-200 rounded-md"
                  placeholder="Your email"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">
                Promo code
              </label>
              <div className="flex gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                  className="w-full p-3 bg-[#EDEDED] border border-gray-200 rounded-md"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="px-5 py-3 bg-black text-white rounded-md font-semibold text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
            {promoResult && promoResult.invalid && (
              <div className="text-red-600 text-sm">{promoResult.message}</div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="agree"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="agree" className="text-sm text-gray-600">
                I agree to the terms and safety policy
              </label>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}
          </form>
        </div>

        <aside className="p-8 bg-gray-50 rounded-lg shadow-sm h-fit">
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span className="text-[#656565]">Experience</span>
              <span className="font-normal text-black">{experience.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#656565]">Date</span>
              <span className="font-normal text-black">{slot.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#656565]">Time</span>
              <span className="font-normal text-black">{slot.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#656565]">Qty</span>
              <span className="font-normal text-black">{qty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#656565]">Subtotal</span>
              <span className="font-normal text-black">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#656565]">Taxes</span>
              <span className="font-normal text-black">₹{taxes}</span>
            </div>
          </div>

          <div className="flex justify-between font-medium text-xl mt-6 pt-6 border-t">
            <span>Total</span>
            <span>₹{discounted}</span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-lg font-semibold text-center
                       bg-[#FFD643] text-black hover:bg-yellow-400
                       disabled:bg-gray-300 disabled:cursor-wait"
          >
            {loading ? "Processing..." : "Pay and Confirm"}
          </button>
        </aside>
      </div>
    </div>
  );
}
