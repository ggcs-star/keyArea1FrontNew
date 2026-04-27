import React, { useEffect, useState } from "react";

const BlocksModal = ({ 
    isOpen, 
    blocks = [], 
    selectedBlock, 
    loading, 
    onBlockSelect, 
    onClose 
}) => {
    const [normalizedBlocks, setNormalizedBlocks] = useState([]);

    /**
     * ✅ CRITICAL FIX: RESET + NORMALIZE WHEN DATA CHANGES
     */
    useEffect(() => {
        if (Array.isArray(blocks)) {
            const formatted = blocks.map((tower) => ({
                id: tower?.id,
                name: tower?.name || "Tower",
                type: tower?.type || "",
                total_floors: tower?.total_floors || "",
            }));
            setNormalizedBlocks(formatted);
        } else {
            setNormalizedBlocks([]);
        }
    }, [blocks]);

    if (!isOpen) return null;

    const isTowerSelected = (tower) => {
        return selectedBlock?.id === tower?.id;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">

            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">
                        Select Tower
                    </h2>
                    <button onClick={onClose} className="text-white text-xl">✕</button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">

                    {loading ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Loading towers...</p>
                        </div>
                    ) : normalizedBlocks.length > 0 ? (

                        <>
                            <p className="text-sm text-gray-600 mb-4">
                                Select a tower
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {normalizedBlocks.map((tower) => {
                                    const selected = isTowerSelected(tower);

                                    return (
                                        <button
                                            key={tower.id}
                                            onClick={() => onBlockSelect(tower)}
                                            className={`
                                                p-4 rounded-xl border-2 transition
                                                ${selected 
                                                    ? "border-purple-600 bg-purple-50"
                                                    : "border-gray-200 hover:bg-gray-50"
                                                }
                                            `}
                                        >
                                            <div className="text-lg font-semibold">
                                                Tower {tower.name}
                                            </div>

                                            {tower.total_floors && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {tower.total_floors} floors
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                {normalizedBlocks.length} tower
                                {normalizedBlocks.length > 1 && "s"} available
                            </p>
                        </>

                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No towers available</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BlocksModal;