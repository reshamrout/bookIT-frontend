import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    API.get(`/experiences/${id}`)
      .then((res) => {
        setExp(res.data);
        if (res.data && res.data.slots.length > 0) {
          const uniqueDates = [...new Set(res.data.slots.map((s) => s.date))];
          setSelectedDate(uniqueDates[0]);
        }
      })
      .catch(() => setErr("Failed to load details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setQty(1);
  };

  const handleTimeSelect = (slot) => {
    setSelectedSlot(slot);
    setQty(1);
  };

  const goCheckout = () => {
    if (!selectedSlot) {
      console.error("Please select a time slot");
      return;
    }

    const subtotal = selectedSlot.price * qty;
    const taxes = Math.round(subtotal * 0.059);
    const total = subtotal + taxes;

    navigate("/checkout", {
      state: {
        experience: exp,
        slot: selectedSlot,
        qty,
        subtotal,
        taxes,
        total,
      },
    });
  };

  if (loading)
    return <div className="py-20 text-center">Loading details...</div>;
  if (err || !exp)
    return (
      <div className="py-20 text-center text-red-600">
        {err || "Experience not found"}
      </div>
    );

  const uniqueDates = exp.slots
    ? [...new Set(exp.slots.map((s) => s.date))]
    : [];
  const availableTimes = exp.slots
    ? exp.slots.filter((s) => s.date === selectedDate)
    : [];

  const basePrice = exp.slots[0]?.price || 0;
  const selectedPrice = selectedSlot?.price || 0;
  const subtotal = selectedPrice * qty;
  const taxes = Math.round(subtotal * 0.059);
  const total = subtotal + taxes;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="md:col-span-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-700 mb-4 hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Details
        </button>

        <img
          src={exp.image || "https://via.placeholder.com/1000x600"}
          alt={exp.title}
          className="w-[765px] h-[381px] max-h-[500px] object-cover rounded-lg"
        />

        <h2 className="text-2xl font-normal mt-6">{exp.title}</h2>
        <p className="text-gray-600 mt-3 text-base">{exp.longDescription}</p>

        <div className="mt-8">
          <h4 className="font-semibold text-lg mb-3">Choose date</h4>
          <div className="flex flex-wrap gap-3">
            {uniqueDates.map((date) => {
              const d = new Date(date + "T00:00:00");
              const formattedDate = d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <button
                  key={date}
                  onClick={() => handleDateSelect(date)}
                  className={`px-6 py-3 rounded-lg border transition-colors ${
                    selectedDate === date
                      ? "bg-[#FFD643] border-[#FFD643] text-black font-medium"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base">{formattedDate}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <h4 className="font-semibold text-lg mb-3">Choose time</h4>
          <div className="flex flex-wrap gap-3">
            {availableTimes.map((slot) => (
              <button
                key={slot._id}
                onClick={() => handleTimeSelect(slot)}
                disabled={slot.remaining <= 0}
                className={`px-5 py-3 rounded-lg border text-base font-medium transition-colors ${
                  selectedSlot?._id === slot._id
                    ? "bg-[#FFD643] border-[#FFD643]"
                    : slot.remaining <= 0
                    ? "bg-[#CCCC] border-gray-200  cursor-not-allowed"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`mr-2 ${
                    selectedSlot?._id === slot._id
                      ? "text-black"
                      : slot.remaining <= 0
                      ? "text-[#838383]"
                      : "text-gray-700"
                  }`}
                >
                  {slot.time}
                </span>

                <span
                  className={`text-sm font-medium ${
                    slot.remaining <= 0 ? "text-[#6A6A6A]" : "text-red-500"
                  }`}
                >
                  {slot.remaining <= 0 ? "Sold out" : `${slot.remaining} left`}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            All times are in IST (GMT +5:30)
          </p>
        </div>

        <div className="mt-8">
          <h4 className="font-semibold text-lg mb-3">About</h4>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              {exp.shortDescription ||
                "Scenic routes, trained guides, and safety briefing. Minimum age 10."}
            </p>
          </div>
        </div>
      </div>

      <aside className="p-6 bg-gray-50 rounded-lg shadow-sm h-fit sticky top-8">
        <div className="flex justify-between items-baseline">
          <span className="text-gray-600">Starts at</span>
          <span className="font-normal text-lg">₹{basePrice}</span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-600">Quantity</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={!selectedSlot}
              className="p-1 border rounded"
            >
              -
            </button>
            <span className="">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              disabled={!selectedSlot}
              className="border px-0 py-0"
            >
              +
            </button>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between pt-4 text-gray-600">
            <span>Taxes</span>
            <span>₹{taxes}</span>
          </div>
        </div>

        <div className="flex justify-between font-medium text-xl mt-4 pt-4 border-t">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={goCheckout}
          disabled={!selectedSlot}
          className="w-full mt-6 py-3 rounded-lg font-semibold text-center
                     disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                     bg-[#FFD643] text-black hover:bg-yellow-400"
        >
          Confirm
        </button>
      </aside>
    </div>
  );
}
