import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Nav({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center p-4">
        <Link to="/" className="flex items-center gap-2">
          <div>
            <div className="mt-1 w-[100px] h-[55px]">
                <img src={logo} alt="Highway Delite" />
            </div>
          </div>
        </Link>
        <div className="ml-auto w-96">
          <input 
            className="w-full border rounded p-2 bg-[#EDEDED] text-[#727272]" 
            placeholder="Search experiences" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button 
          className="ml-4 bg-[#FFD643] px-4 py-2 rounded text-[#161616]"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>
    </header>
  );
}