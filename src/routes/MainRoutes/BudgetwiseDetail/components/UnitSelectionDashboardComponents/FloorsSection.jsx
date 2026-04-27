// components/FloorsSection.jsx
import React from 'react';
import ShimmerTile from './ShimmerTile';

const FloorsSection = ({ floors, selectedFloor, selectedBlock, loading, onFloorSelect }) => {
    if (!selectedBlock) return null;

    return (
        <div className="text-center">
            <h3 className="text-lg font-semibold mb-6 text-gray-700">
                Select Floor in Block {selectedBlock}
            </h3>

            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto overflow-x-auto scrollbar-hide">
                {loading
                    ? [...Array(5)].map((_, i) => <ShimmerTile key={i} />)
                    : floors.length > 0 ? (
                        floors.map((floor) => {
                            const isSelected = selectedFloor === floor;

                            const view =
                                floor >= 12
                                    ? "City View"
                                    : floor >= 6
                                        ? "Pool View"
                                        : "Garden View";

                            const light =
                                floor >= 10
                                    ? "Bright"
                                    : floor >= 6
                                        ? "Moderate"
                                        : "Moderate";

                            return (
                                <button
                                    key={floor}
                                    onClick={() => onFloorSelect(floor)}
                                    aria-pressed={isSelected}
                                    className={`
                                        w-full p-4 rounded-xl border shadow-sm
                                        transition-all duration-300 group
                                        flex items-center justify-between
                                        ${
                                            isSelected
                                                ? "bg-indigo-50 border-indigo-600 shadow-lg"
                                                : "bg-white border-gray-200 hover:shadow-md hover:border-indigo-400"
                                        }
                                    `}
                                >
                                    {/* Content */}
                                    <div className="flex items-center gap-6">
                                        {/* Floor Number */}
                                        <div className="flex flex-col items-center min-w-[3rem]">
                                            <span
                                                className={`text-[10px] uppercase font-bold tracking-wider ${
                                                    isSelected
                                                        ? "text-indigo-500"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                Level
                                            </span>
                                            <span
                                                className={`text-2xl font-bold ${
                                                    isSelected
                                                        ? "text-indigo-700"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {floor}
                                            </span>
                                        </div>

                                        {/* Meta Info */}
                                        <div className="flex flex-col items-start gap-1">
                                            <div className="text-xs font-medium text-gray-600">
                                                {view}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {light} Light
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div
                                        className={`
                                            transition-all duration-300 transform
                                            ${
                                                isSelected
                                                    ? "opacity-100 translate-x-0 text-indigo-700"
                                                    : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-indigo-600"
                                            }
                                        `}
                                    >
                                        →
                                    </div>
                                </button>
                            );
                        })
                    ) : !loading && (
                        <p className="text-gray-500">No floors available</p>
                    )}
            </div>
        </div>
    );
};

export default FloorsSection;