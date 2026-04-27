// UnitSelectionDashboardComponents/BlocksModal.jsx
import React from "react";

const BlocksModal = ({ 
    isOpen, 
    blocks, 
    selectedBlock, 
    loading, 
    onBlockSelect, 
    onClose,
    onCloseAll 
}) => {
    if (!isOpen) return null;

    // Function to get block icon based on block name/number
    const getBlockIcon = (block, isSelected) => {
        const iconColor = isSelected ? "text-purple-600" : "text-gray-600";
        
        // Different icons based on block name
        const blockNum = parseInt(block) || 0;
        
        if (blockNum % 4 === 0) {
            // Tower/Apartment icon
            return (
                <svg className={`w-8 h-8 ${iconColor} mb-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            );
        } else if (blockNum % 3 === 0) {
            // Modern Building icon
            return (
                <svg className={`w-8 h-8 ${iconColor} mb-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            );
        } else if (blockNum % 2 === 0) {
            // Home/House icon
            return (
                <svg className={`w-8 h-8 ${iconColor} mb-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            );
        } else {
            // Villa/Cottage icon
            return (
                <svg className={`w-8 h-8 ${iconColor} mb-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            );
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h2 className="text-xl font-bold text-white">Select Block</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
                            <p className="mt-4 text-gray-600 font-medium">Loading blocks...</p>
                        </div>
                    ) : blocks.length > 0 ? (
                        <>
                            <p className="text-sm text-gray-600 mb-4">
                                Select a block to view available units
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {blocks.map((block) => {
                                    const isSelected = selectedBlock === block;
                                    return (
                                        <button
                                            key={block}
                                            onClick={() => onBlockSelect(block)}
                                            className={`
                                                relative group p-4 rounded-xl border-2 transition-all
                                                flex flex-col items-center
                                                ${isSelected 
                                                    ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' 
                                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                                                }
                                            `}
                                        >
                                            {/* Block Icon */}
                                            {getBlockIcon(block, isSelected)}
                                            
                                            {/* Block Name */}
                                            <div className={`
                                                font-semibold text-center
                                                ${isSelected ? 'text-purple-700' : 'text-gray-700'}
                                            `}>
                                                Block {block}
                                            </div>
                                            
                                            {/* Selected Indicator */}
                                            {isSelected && (
                                                <div className="absolute top-2 right-2">
                                                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                            
                                            {/* Hover Effect */}
                                            {!isSelected && (
                                                <div className="absolute inset-0 rounded-xl bg-purple-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {/* Footer Note */}
                            <p className="text-xs text-gray-400 text-center mt-6">
                                {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'} available
                            </p>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-gray-500 font-medium">No blocks available</p>
                            <p className="text-sm text-gray-400 mt-1">Check back later for updates</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlocksModal;