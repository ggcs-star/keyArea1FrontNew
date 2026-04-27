// UnitSelectionDashboardComponents/RoomDetailsModal.jsx
import React from 'react';

const RoomDetailsModal = ({ isOpen, onClose, roomData, onBack, onCloseAll, zIndex }) => {
    if (!isOpen || !roomData) return null;

    const getColorScheme = () => {
        const colors = {
            orange: { bg: 'bg-orange-50', border: 'border-orange-100', badge: 'bg-orange-50 text-orange-700', icon: 'text-orange-600', accent: 'text-orange-900', light: 'text-orange-300' },
            green: { bg: 'bg-green-50', border: 'border-green-100', badge: 'bg-green-50 text-green-700', icon: 'text-green-600', accent: 'text-green-900', light: 'text-green-300' },
            blue: { bg: 'bg-blue-50', border: 'border-blue-100', badge: 'bg-blue-50 text-blue-700', icon: 'text-blue-600', accent: 'text-blue-900', light: 'text-blue-300' },
            teal: { bg: 'bg-teal-50', border: 'border-teal-100', badge: 'bg-teal-50 text-teal-700', icon: 'text-teal-600', accent: 'text-teal-900', light: 'text-teal-300' },
        };
        return colors[roomData.color] || colors.blue;
    };

    const colors = getColorScheme();
    const dimensions = roomData.dimensions.split('×').map(d => d.trim().replace("'", ""));
    const length = dimensions[0] || "0";
    const width = dimensions[1] || "0";

    return (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ zIndex }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="bg-white w-full sm:w-96 p-6 rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 pointer-events-auto relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 ${colors.badge} text-xs font-bold uppercase rounded tracking-wide`}>{roomData.type}</span>
                    {/* <button onClick={onCloseAll} className="text-gray-400 hover:text-gray-600 text-sm font-medium">Close All</button> */}
                </div>
                
                <button onClick={onBack} className="absolute top-4 left-4 p-1 rounded-full hover:bg-gray-100 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                    </svg>
                </button>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-1 mt-6">{roomData.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{roomData.description}</p>
                
                <div className="space-y-4">
                    <div className={`${colors.bg} p-5 rounded-xl border ${colors.border} relative overflow-hidden`}>
                        <div className={`flex items-center gap-2 ${colors.icon} mb-3`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"></path>
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-wider">Dimensions (L × W)</span>
                        </div>
                        <div className="flex items-end justify-center gap-4">
                            <div><span className={`text-4xl sm:text-5xl font-black ${colors.accent} tracking-tighter`}>{length}</span><span className={`text-lg ${colors.icon} font-bold ml-1`}>'</span></div>
                            <span className={`${colors.light} text-3xl font-light`}>×</span>
                            <div><span className={`text-4xl sm:text-5xl font-black ${colors.accent} tracking-tighter`}>{width}</span><span className={`text-lg ${colors.icon} font-bold ml-1`}>'</span></div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 3h6v6"></path><path d="m21 3-7 7"></path><path d="m3 21 7-7"></path><path d="M9 21H3v-6"></path>
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-wider">Carpet Area</span>
                        </div>
                        <div><span className="text-2xl font-bold text-gray-900 tracking-tight">{roomData.area?.split(' ')[0] || "0"}</span><span className="text-sm font-medium text-gray-500 ml-1.5">{roomData.area?.split(' ')[1] || "sq.ft"}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailsModal;