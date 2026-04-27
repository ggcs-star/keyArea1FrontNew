// UnitSelectionDashboardComponents/UnitsModal.jsx
import React from 'react';

const ShimmerTile = () => (
    <div className="animate-pulse p-3 rounded-xl min-w-[100px] h-12 bg-gray-200 border border-gray-300"></div>
);

const UnitsModal = ({ isOpen, units, selectedFloor, selectedBlock, loading, onUnitClick, onClose, onBack, onCloseAll, zIndex }) => {
    if (!isOpen) return null;

    // Get display name for selected tower/block
    const getTowerDisplayName = () => {
        if (!selectedBlock) return '';
        if (typeof selectedBlock === 'string') return selectedBlock;
        return selectedBlock?.name || selectedBlock?.tower_name || selectedBlock?.id || 'Tower';
    };

    // Get unit status color and text - Updated for your API response
    const getUnitStatus = (unit) => {
        const status = (unit?.status || '').toLowerCase();
        
        if (status === 'sold' || status === 'booked' || status === 'unavailable') {
            return { type: 'sold', label: 'Sold', color: 'gray' };
        } else if (status === 'reserved' || status === 'hold') {
            return { type: 'reserved', label: 'Reserved', color: 'orange' };
        } else if (status === 'available' || status === 'ready') {
            return { type: 'available', label: 'Available', color: 'green' };
        }
        return { type: 'available', label: 'Available', color: 'green' };
    };

    // Get unit type display - Updated for your API response structure
    const getUnitTypeDisplay = (unit) => {
        // Your API returns unit_type as an object with name property
        if (unit?.unit_type?.name) {
            return unit.unit_type.name.toUpperCase();
        }
        if (unit?.unit_type?.bhk) {
            return `${unit.unit_type.bhk} BHK`;
        }
        return unit?.type || unit?.bhk || '2 BHK';
    };

    // Get unit facing - Default if not available
    const getUnitFacing = (unit) => {
        return unit?.facing || unit?.direction || 'Standard';
    };

    // Get unit number - Updated for your API response
    const getUnitNumber = (unit) => {
        return unit?.unit_number || unit?.number || unit?.name || 'Unit';
    };

    // Get unit size - Updated for your API response
    const getUnitSize = (unit) => {
        return unit?.unit_size || unit?.size || unit?.area || null;
    };

    // Position units around the lobby (for visual representation)
    const getUnitPosition = (index, totalUnits) => {
        // Different layouts based on number of units
        const positions = [
            "top-4 left-4",           // Top Left
            "top-4 right-4",          // Top Right
            "bottom-4 right-4",       // Bottom Right
            "bottom-4 left-4",        // Bottom Left
            "top-1/2 left-4 transform -translate-y-1/2",  // Middle Left
            "top-1/2 right-4 transform -translate-y-1/2", // Middle Right
            "top-4 left-1/2 transform -translate-x-1/2",  // Top Center
            "bottom-4 left-1/2 transform -translate-x-1/2" // Bottom Center
        ];
        
        if (totalUnits <= 4) {
            return positions[index % 4];
        } else if (totalUnits <= 6) {
            return positions[index % 6];
        }
        return positions[index % 8];
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all duration-300 animate-in zoom-in-95">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={onBack} 
                                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <div>
                                <h3 className="text-2xl font-bold">Select Unit</h3>
                                <p className="text-purple-100 mt-1">
                                    {getTowerDisplayName()} • Floor {selectedFloor}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={onClose} 
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg> 
                                Close
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="relative w-full max-w-lg mx-auto aspect-square bg-white shadow-xl rounded-2xl border border-gray-200 p-8">
                        {/* Lobby/Center Area */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-24 h-32 bg-slate-100 rounded flex flex-col items-center justify-center border border-slate-200">
                                <svg className="w-8 h-8 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    Lobby
                                </span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 gap-4 absolute inset-0 p-8">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-24"></div>
                                ))}
                            </div>
                        ) : units && units.length > 0 ? (
                            units.map((unit, index) => {
                                const status = getUnitStatus(unit);
                                const isSold = status.type === 'sold';
                                const isReserved = status.type === 'reserved';
                                const unitNumber = getUnitNumber(unit);
                                const unitType = getUnitTypeDisplay(unit);
                                const unitFacing = getUnitFacing(unit);
                                const unitSize = getUnitSize(unit);
                                const position = getUnitPosition(index, units.length);
                                
                                // Status-based styling
                                const getStatusStyles = () => {
                                    if (isSold) {
                                        return "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60";
                                    }
                                    if (isReserved) {
                                        return "bg-orange-50 border-orange-200 hover:border-orange-400";
                                    }
                                    return "bg-white border-indigo-100 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer group";
                                };

                                return (
                                    <button 
                                        key={unit?.id || unitNumber || index} 
                                        disabled={isSold}
                                        onClick={() => !isSold && onUnitClick(unit)}
                                        className={`absolute w-32 h-24 sm:w-40 sm:h-32 rounded-lg border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${position} ${getStatusStyles()}`}
                                    >
                                        {/* Hover Tooltip */}
                                        {!isSold && !isReserved && (
                                            <span className="text-indigo-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-sm">
                                                Select Unit
                                            </span>
                                        )}
                                        
                                        {isSold ? (
                                            <>
                                                <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sold</span>
                                            </>
                                        ) : isReserved ? (
                                            <>
                                                <svg className="w-6 h-6 text-orange-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Reserved</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-1 text-gray-800 font-bold text-lg">
                                                    🏠 {unitNumber}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 text-center">
                                                    {unitType}
                                                </div>
                                                {unitSize && (
                                                    <div className="text-[10px] text-gray-400 mt-0.5">
                                                        {unitSize} sqft
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            !loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <p className="text-gray-500 font-medium">No units available</p>
                                        <p className="text-sm text-gray-400 mt-1">No units found on this floor</p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                    
                    {/* Legend */}
                    {units && units.length > 0 && (
                        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-white border-2 border-indigo-100 rounded"></div>
                                <span className="text-xs text-gray-600">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-50 border-2 border-orange-200 rounded"></div>
                                <span className="text-xs text-gray-600">Reserved</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded"></div>
                                <span className="text-xs text-gray-600">Sold</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnitsModal;