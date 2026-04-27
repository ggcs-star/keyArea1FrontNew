// UnitSelectionDashboardComponents/UnitsModal.jsx
import React from 'react';

const ShimmerTile = () => (
    <div className="animate-pulse p-3 rounded-xl min-w-[100px] h-12 bg-gray-200 border border-gray-300"></div>
);

const UnitsModal = ({ isOpen, units, selectedFloor, selectedBlock, loading, onUnitClick, onClose, onBack, onCloseAll, zIndex }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all duration-300 animate-in zoom-in-95">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <div>
                                <h3 className="text-2xl font-bold">Select Unit</h3>
                                <p className="text-purple-100 mt-1">Block {selectedBlock} • Floor {selectedFloor}</p>
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

                <div className="p-8">
                    <div className="relative w-full max-w-lg mx-auto aspect-square bg-white shadow-xl rounded-2xl border border-gray-200 p-8">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-24 h-32 bg-slate-100 rounded flex flex-col items-center justify-center border border-slate-200">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Lobby</span>
                            </div>
                        </div>

                        {loading ? [...Array(4)].map((_, i) => <ShimmerTile key={i} />)
                            : units.length > 0 ? units.map((unit, index) => {
                                const status = (unit.status || "").toLowerCase();
                                const isSold = status === "sold";
                                const positions = ["top-4 left-4", "top-4 right-4", "bottom-4 right-4", "bottom-4 left-4"];

                                return (
                                    <button key={unit.number || index} disabled={isSold}
                                        onClick={() => !isSold && onUnitClick(unit)}
                                        className={`absolute w-32 h-24 sm:w-40 sm:h-32 rounded-lg border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${positions[index % 4]} ${
                                            isSold ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60" : "bg-white border-indigo-100 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                                        }`}
                                    >
                                        {!isSold && (
                                            <span className="text-indigo-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">Select Unit</span>
                                        )}
                                        {isSold ? (
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sold</span>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-1 text-gray-800 font-bold text-lg">🏠 {unit.number}</div>
                                                <div className="text-xs text-gray-500 mt-1">{unit.type || "3BHK"}</div>
                                                <div className="text-[10px] text-gray-400 mt-0.5">{unit.facing || "East Facing"}</div>
                                            </>
                                        )}
                                    </button>
                                );
                            }) : !loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-400">No units available</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitsModal;