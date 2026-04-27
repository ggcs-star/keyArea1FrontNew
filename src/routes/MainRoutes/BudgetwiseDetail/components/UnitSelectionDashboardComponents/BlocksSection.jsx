// components/BlocksSection.jsx
import React from 'react';
import ShimmerTile from './ShimmerTile';

const BlocksSection = ({ blocks, selectedBlock, loading, onBlockSelect }) => {
    return (
        <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Select Block
            </h3>

            <div
                className={`grid justify-center gap-6 ${
                    blocks.length >= 3
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : blocks.length === 2
                            ? "grid-cols-1 sm:grid-cols-2"
                            : "grid-cols-1"
                }`}
            >
                {loading
                    ? [...Array(3)].map((_, i) => <ShimmerTile key={i} />)
                    : blocks.length > 0 ? (
                        blocks.map((block, index) => (
                            <button
                                key={block}
                                onClick={() => onBlockSelect(block)}
                                className={`group relative bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 flex flex-col items-center hover:-translate-y-1 hover:shadow-xl ${
                                    selectedBlock === block
                                        ? "border-purple-500 ring-2 ring-purple-200"
                                        : "border-gray-200 hover:border-purple-300"
                                }`}
                            >
                                {/* Visual Block Illustration */}
                                <div className="mb-6 relative">
                                    <div
                                        className={`w-24 h-32 rounded-lg border-2 transition-colors flex flex-col items-center justify-end overflow-hidden ${
                                            selectedBlock === block
                                                ? "bg-purple-100 border-purple-400"
                                                : "bg-purple-50 border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-300"
                                        }`}
                                    >
                                        {/* Windows Grid */}
                                        <div className="grid grid-cols-3 gap-1 mb-4 opacity-40">
                                            {[...Array(9)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-4 h-4 bg-purple-300 rounded-sm"
                                                ></div>
                                            ))}
                                        </div>

                                        {/* Base */}
                                        <div className="w-8 h-6 bg-white rounded-t border-t border-x border-purple-200"></div>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3
                                    className={`text-xl font-bold transition-colors ${
                                        selectedBlock === block
                                            ? "text-purple-700"
                                            : "text-gray-900 group-hover:text-purple-700"
                                    }`}
                                >
                                    Tower {block}
                                </h3>

                                {/* CTA */}
                                <div
                                    className={`mt-6 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedBlock === block
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-50 text-gray-600 group-hover:bg-purple-600 group-hover:text-white"
                                    }`}
                                >
                                    Explore Block
                                </div>
                            </button>
                        ))
                    ) : !loading && (
                        <p className="text-gray-500 col-span-full">No blocks available</p>
                    )}
            </div>
        </div>
    );
};

export default BlocksSection;