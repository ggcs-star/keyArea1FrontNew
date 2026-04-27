// components/UnitsSection.jsx
import React from 'react';
import ShimmerTile from './ShimmerTile';

const UnitsSection = ({ units, selectedFloor, loading, onUnitClick }) => {
    if (!selectedFloor) return null;

    return (
        <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col bg-white">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 relative bg-white z-10">
                    <div className="text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                            Floor Plate
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Floor {selectedFloor}
                        </h2>
                    </div>
                </div>

                {/* Floor Plate Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    {/* Floor Layout Box */}
                    <div className="relative w-full max-w-lg aspect-square bg-white shadow-xl rounded-2xl border border-gray-200 p-8">
                        {/* Lobby Center */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-24 h-32 bg-slate-100 rounded flex flex-col items-center justify-center border border-slate-200">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                                    Lobby
                                </span>
                            </div>
                        </div>

                        {/* Units */}
                        {loading
                            ? [...Array(4)].map((_, i) => (
                                <ShimmerTile key={i} />
                            ))
                            : units.length > 0 ? (
                                units.map((unit, index) => {
                                    const status = (unit.status || "").toLowerCase();
                                    const isSold = status === "sold";

                                    // Basic 4-corner positioning logic
                                    const positions = [
                                        "top-4 left-4",
                                        "top-4 right-4",
                                        "bottom-4 right-4",
                                        "bottom-4 left-4",
                                    ];

                                    return (
                                        <button
                                            key={unit.number || index}
                                            disabled={isSold}
                                            onClick={() =>
                                                !isSold && onUnitClick(unit)
                                            }
                                            className={`
                                                absolute w-32 h-24 sm:w-40 sm:h-32
                                                rounded-lg border-2 transition-all duration-300
                                                flex flex-col items-center justify-center p-2 shadow-sm
                                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                                ${positions[index % 4]}
                                                ${
                                                    isSold
                                                        ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
                                                        : "bg-white border-indigo-100 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                                                }
                                            `}
                                        >
                                            {!isSold && (
                                                <span className="text-indigo-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
                                                    Tap to View
                                                </span>
                                            )}

                                            {isSold ? (
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    Sold
                                                </span>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-1 text-gray-800 font-bold text-lg">
                                                        🏠 {unit.number}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {unit.type || "3BHK"}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 mt-0.5">
                                                        {unit.facing || "East Facing"}
                                                    </div>
                                                </>
                                            )}
                                        </button>
                                    );
                                })
                            ) : !loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-400">No units available</p>
                                </div>
                            )}
                    </div>

                    <p className="mt-8 text-sm text-gray-400 text-center max-w-xs">
                        Click on any available unit to view its detailed layout.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UnitsSection;