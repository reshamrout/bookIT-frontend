import React from 'react';
import { Link } from 'react-router-dom';

export default function ExperienceCard({ exp }) {
  const price = exp.slots && exp.slots.length ? exp.slots[0].price : 0;
  return (
    <div className="card p-0 bg-[#F0F0F0] flex flex-col">
      <img src={exp.image || 'https://via.placeholder.com/600x350'} alt={exp.title} className="w-full h-44 object-cover" />
      
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-[16px]">{exp.title}</h3>
          <div className="text-xs bg-gray-200 rounded px-2 py-1">
              {(exp.location || '').split(',')[0].trim()}
          </div>
        </div>
        <p className="text-[12px] text-[#6C6C6C] mt-2">{exp.shortDescription}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-[12px]" >From <span className="text-[20px] font-normal">₹{price}</span> </div>
          <Link to={`/experiences/${exp._id}`} className="bg-primary px-3 py-1 rounded text-sm font-normal">View Details</Link>
        </div>
      </div>
    </div>
  );
}