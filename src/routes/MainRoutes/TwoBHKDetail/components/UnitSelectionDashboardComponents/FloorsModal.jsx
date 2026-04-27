// UnitSelectionDashboardComponents/FloorsModal.jsx
import React from 'react';

const ShimmerTile = () => (
    <div className="animate-pulse p-3 rounded-xl min-w-[100px] h-12 bg-gray-200 border border-gray-300"></div>
);

const FloorsModal = ({ isOpen, floors, selectedFloor, selectedBlock, loading, onFloorSelect, onClose, onBack, onCloseAll, zIndex }) => {
    if (!isOpen) return null;

    // Get display name for selected tower/block
    const getTowerDisplayName = () => {
        if (!selectedBlock) return '';
        if (typeof selectedBlock === 'string') return selectedBlock;
        return selectedBlock?.name || selectedBlock?.tower_name || selectedBlock?.id || 'Tower';
    };

    // Get floor view type based on floor number
    const getFloorView = (floor) => {
        const floorNum = parseInt(floor);
        if (floorNum >= 12) return "City View";
        if (floorNum >= 6) return "Pool View";
        return "Garden View";
    };

    // Get light condition based on floor number
    const getLightCondition = (floor) => {
        const floorNum = parseInt(floor);
        if (floorNum >= 10) return "Bright";
        if (floorNum >= 5) return "Moderate";
        return "Standard";
    };

    // Get floor icon
    const getFloorIcon = (floor, isSelected) => {
        const iconColor = isSelected ? "text-indigo-500" : "text-gray-400";
        const floorNum = parseInt(floor);
        
        if (floorNum === 0 || floorNum === 1) {
            return (
                <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            );
        } else if (floorNum >= 10) {
            return (
                <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            );
        } else {
            return (
                <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            );
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all duration-300 animate-in zoom-in-95">
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
                                <h3 className="text-2xl font-bold">Select Floor</h3>
                                <p className="text-purple-100 mt-1">
                                    {getTowerDisplayName()} • Choose your floor
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
                    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                        {loading ? (
                            [...Array(5)].map((_, i) => <ShimmerTile key={i} />)
                        ) : floors && floors.length > 0 ? (
                            floors.map((floor) => {
                                // Handle floor - can be string, number, or object
                                const floorNumber = typeof floor === 'object' 
                                    ? (floor.floor_number || floor.level || floor.name || floor)
                                    : floor;
                                const isSelected = selectedFloor === floorNumber || selectedFloor === floor;
                                const view = getFloorView(floorNumber);
                                const light = getLightCondition(floorNumber);
                                
                                // Additional floor metadata if available
                                const totalUnits = floor?.total_units || floor?.units_count;
                                const availableUnits = floor?.available_units;

                                return (
                                    <button 
                                        key={floor?.id || floorNumber} 
                                        onClick={() => onFloorSelect(floorNumber)}
                                        className={`w-full p-4 rounded-xl border shadow-sm transition-all duration-300 group flex items-center justify-between ${
                                            isSelected 
                                                ? "bg-indigo-50 border-indigo-600 shadow-lg" 
                                                : "bg-white border-gray-200 hover:shadow-md hover:border-indigo-400"
                                        }`}
                                    >
                                        <div className="flex items-center gap-6">
                                            {/* Floor Level with Icon */}
                                            <div className="flex flex-col items-center min-w-[3rem]">
                                                {getFloorIcon(floorNumber, isSelected)}
                                                <span className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${isSelected ? "text-indigo-500" : "text-gray-400"}`}>
                                                    Level
                                                </span>
                                                <span className={`text-2xl font-bold ${isSelected ? "text-indigo-700" : "text-gray-800"}`}>
                                                    {floorNumber}
                                                </span>
                                            </div>
                                            
                                            {/* Floor Details */}
                                            <div className="flex flex-col items-start gap-1">
                                                <div className="text-xs font-medium text-gray-600">{view}</div>
                                                <div className="text-xs text-gray-500">{light} Light</div>
                                                {totalUnits && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {totalUnits} total units
                                                        {availableUnits !== undefined && (
                                                            <span className="ml-1 text-green-600">
                                                                • {availableUnits} available
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Arrow Indicator */}
                                        <div className={`transition-all duration-300 transform ${
                                            isSelected 
                                                ? "opacity-100 translate-x-0 text-indigo-700" 
                                                : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-indigo-600"
                                        }`}>
                                            →
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            !loading && (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-gray-500 font-medium">No floors available</p>
                                    <p className="text-sm text-gray-400 mt-1">Check back later for updates</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloorsModal;