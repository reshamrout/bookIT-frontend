import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-green-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-red-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function Result() {
  const loc = useLocation();
  const state = loc.state || {};

  if (!state.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <XCircleIcon />
        <h2 className="text-3xl font-bold mt-6">Booking Failed</h2>
        <p className="text-gray-500 mt-2">{state.message || 'An unexpected error occurred. Please try again.'}</p>
        <Link 
          to="/" 
          className="mt-8 bg-[#FFD643] px-6 py-2 rounded font-semibold text-black hover:bg-yellow-400"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <CheckCircleIcon />
      <h2 className="text-3xl font-bold mt-6">Booking Confirmed</h2>
      <p className="text-gray-500 mt-2">
        Ref ID: <span className="font-mono">{state.booking?.bookingId || 'N/A'}</span>
      </p>
      <Link 
        to="/" 
        className="mt-8 bg-[#E3E3E3] px-6 py-2 rounded font-medium text-[#656565] hover:bg-yellow-400"
      >
        Back to Home
      </Link>
    </div>
  );
}