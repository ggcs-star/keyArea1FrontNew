// UnitSelectionDashboardComponents/FloorPlanModal.jsx
import React from 'react';
import FloorPlanSVG from './FloorPlanSVG';

const FloorPlanModal = ({ isOpen, unit, onClose, onRoomClick, onBack, onCloseAll, zIndex }) => {
    if (!isOpen || !unit) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all duration-300 animate-in zoom-in-95">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <div>
                                <h3 className="text-2xl font-bold">Unit {unit?.number} Floor Plan</h3>
                                <p className="text-purple-100 mt-1">{unit?.type || "3BHK"} • {unit?.facing || "East Facing"}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* <button onClick={onCloseAll} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">Close All</button> */}
                            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                                </svg> Close
                            </button>
                        </div>
                    </div>
                </div>

                <FloorPlanSVG unit={unit} onRoomClick={onRoomClick} />

                <div className="bg-gray-50 p-4 border-t border-gray-200 rounded-b-2xl sticky bottom-0">
                    <div className="flex gap-6 justify-center text-sm text-gray-600 flex-wrap">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></span><span>Living Area: 308 sq.ft</span></div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-100 border border-green-300 rounded"></span><span>Kitchen: 120 sq.ft</span></div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></span><span>Bedrooms: 224/168/132 sq.ft</span></div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-teal-50 border border-teal-200 rounded"></span><span>Deck: 84 sq.ft</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloorPlanModal;