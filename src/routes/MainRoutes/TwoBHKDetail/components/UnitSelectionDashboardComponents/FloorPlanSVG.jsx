// UnitSelectionDashboardComponents/FloorPlanSVG.jsx
import React from 'react';

const FloorPlanSVG = ({ unit, onRoomClick }) => (
    <div className="bg-slate-50 p-8 flex items-center justify-center min-h-[500px]">
        <svg viewBox="0 0 500 400" className="w-full h-full max-w-4xl drop-shadow-xl" preserveAspectRatio="xMidYMid meet">
            <g className="cursor-pointer group" onClick={() => onRoomClick({
                name: "Living & Dining", type: "living", dimensions: "22' × 14'", area: "308 sq.ft",
                description: "Spacious for 6-seater dining + L-shaped sofa", color: "orange"
            })}>
                <title>Living & Dining: 22' x 14'</title>
                <path d="M150,50 L350,50 L350,250 L150,250 Z" className="fill-orange-100 stroke-orange-300 stroke-2 transition-all duration-200 hover:fill-orange-200"></path>
                <text x="250" y="150" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium pointer-events-none uppercase tracking-wider fill-gray-600 group-hover:fill-gray-800">Living</text>
            </g>
            <g className="cursor-pointer group" onClick={() => onRoomClick({
                name: "Kitchen", type: "kitchen", dimensions: "12' × 10'", area: "120 sq.ft",
                description: "Modular kitchen with premium fittings and ample storage", color: "green"
            })}>
                <title>Kitchen: 12' x 10'</title>
                <path d="M20,50 L150,50 L150,180 L20,180 Z" className="fill-green-100 stroke-green-300 stroke-2 transition-all duration-200 hover:fill-green-200"></path>
                <text x="85" y="115" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium pointer-events-none uppercase tracking-wider fill-gray-600 group-hover:fill-gray-800">Kitchen</text>
            </g>
            <g className="cursor-pointer group" onClick={() => onRoomClick({
                name: "Master Bedroom", type: "bedroom", dimensions: "16' × 14'", area: "224 sq.ft",
                description: "Spacious master bedroom with attached bathroom and walk-in closet", color: "blue"
            })}>
                <title>Master Bedroom: 16' x 14'</title>
                <path d="M350,150 L480,150 L480,300 L350,300 Z" className="fill-blue-100 stroke-blue-300 stroke-2 transition-all duration-200 hover:fill-blue-200"></path>
                <text x="415" y="225" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium pointer-events-none uppercase tracking-wider fill-gray-600 group-hover:fill-gray-800">Master</text>
            </g>
            <g className="cursor-pointer group" onClick={() => onRoomClick({
                name: "Kids Bedroom", type: "bedroom", dimensions: "14' × 12'", area: "168 sq.ft",
                description: "Perfect for children with study area and built-in storage", color: "blue"
            })}>
                <title>Kids Bedroom: 14' x 12'</title>
                <path d="M350,20 L480,20 L480,150 L350,150 Z" className="fill-blue-100 stroke-blue-300 stroke-2 transition-all duration-200 hover:fill-blue-200"></path>
                <text x="415" y="85" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium pointer-events-none uppercase tracking-wider fill-gray-600 group-hover:fill-gray-800">Kids</text>
            </g>
            <g className="cursor-pointer group" onClick={() => onRoomClick({
                name: "Guest Bedroom", type: "bedroom", dimensions: "12' × 11'", area: "132 sq.ft",
                description: "Comfortable guest bedroom with attached bathroom", color: "blue"
            })}>
                <title>Guest Bedroom: 12' x 11'</title>
                <path d="M20,180 L150,180 L150,320 L20,320 Z" className="fill-blue-100 stroke-blue-300 stroke-2 transition-all duration-200 hover:fill-blue-200"></path>
                <text x="85" y="250" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium pointer-events-none uppercase tracking-wider fill-gray-600 group-hover:fill-gray-800">Guest</text>
            </g>
            <g className="cursor-pointer group" onClick={() => onRoomClick({
                name: "Main Deck", type: "outdoor", dimensions: "14' × 6'", area: "84 sq.ft",
                description: "Perfect for outdoor seating and plants", color: "teal"
            })}>
                <title>Main Deck: 14' x 6'</title>
                <path d="M150,250 L350,250 L350,300 L150,300 Z" className="fill-teal-50 stroke-teal-200 stroke-2 transition-all duration-200 hover:fill-teal-100"></path>
                <text x="250" y="275" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium pointer-events-none uppercase tracking-wider fill-gray-600 group-hover:fill-gray-800">Main</text>
            </g>
            <g className="cursor-pointer group" onClick={() => onRoomClick({
                name: "Master Bathroom", type: "bathroom", dimensions: "8' × 6'", area: "48 sq.ft",
                description: "Modern bathroom with premium fixtures and ventilation", color: "gray"
            })}>
                <title>Master Bath: 8' x 6'</title>
                <path d="M350,300 L450,300 L450,350 L350,350 Z" className="fill-gray-100 stroke-gray-300 stroke-2 transition-all duration-200 hover:fill-gray-200"></path>
                <text x="400" y="325" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium pointer-events-none uppercase tracking-wider fill-gray-600 group-hover:fill-gray-800">Master</text>
            </g>
        </svg>
    </div>
);

export default FloorPlanSVG;