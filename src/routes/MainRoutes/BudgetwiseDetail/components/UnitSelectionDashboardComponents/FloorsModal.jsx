// UnitSelectionDashboardComponents/FloorsModal.jsx
import React from 'react';

const ShimmerTile = () => (
    <div className="animate-pulse p-3 rounded-xl min-w-[100px] h-12 bg-gray-200 border border-gray-300"></div>
);

const FloorsModal = ({ isOpen, floors, selectedFloor, selectedBlock, loading, onFloorSelect, onClose, onBack, onCloseAll, zIndex }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all duration-300 animate-in zoom-in-95">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <div>
                                <h3 className="text-2xl font-bold">Select Floor</h3>
                                <p className="text-purple-100 mt-1">Block {selectedBlock} • Choose your floor</p>
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
                    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                        {loading ? [...Array(5)].map((_, i) => <ShimmerTile key={i} />)
                            : floors.length > 0 ? floors.map((floor) => {
                                const isSelected = selectedFloor === floor;
                                const view = floor >= 12 ? "City View" : floor >= 6 ? "Pool View" : "Garden View";
                                const light = floor >= 10 ? "Bright" : "Moderate";

                                return (
                                    <button key={floor} onClick={() => onFloorSelect(floor)}
                                        className={`w-full p-4 rounded-xl border shadow-sm transition-all duration-300 group flex items-center justify-between ${
                                            isSelected ? "bg-indigo-50 border-indigo-600 shadow-lg" : "bg-white border-gray-200 hover:shadow-md hover:border-indigo-400"
                                        }`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-center min-w-[3rem]">
                                                <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-indigo-500" : "text-gray-400"}`}>Level</span>
                                                <span className={`text-2xl font-bold ${isSelected ? "text-indigo-700" : "text-gray-800"}`}>{floor}</span>
                                            </div>
                                            <div className="flex flex-col items-start gap-1">
                                                <div className="text-xs font-medium text-gray-600">{view}</div>
                                                <div className="text-xs text-gray-500">{light} Light</div>
                                            </div>
                                        </div>
                                        <div className={`transition-all duration-300 transform ${
                                            isSelected ? "opacity-100 translate-x-0 text-indigo-700" : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-indigo-600"
                                        }`}>→</div>
                                    </button>
                                );
                            }) : !loading && <p className="text-gray-500 text-center py-8">No floors available</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloorsModal;