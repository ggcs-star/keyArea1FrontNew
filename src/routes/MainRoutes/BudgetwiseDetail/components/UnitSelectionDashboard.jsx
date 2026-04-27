// UnitSelectionDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

// Import components
import ErrorBoundary from "./UnitSelectionDashboardComponents/ErrorBoundary";
import BlocksModal from "./UnitSelectionDashboardComponents/BlocksModal";
import FloorsModal from "./UnitSelectionDashboardComponents/FloorsModal";
import UnitsModal from "./UnitSelectionDashboardComponents/UnitsModal";
import FloorPlanModal from "./UnitSelectionDashboardComponents/FloorPlanModal";
import RoomDetailsModal from "./UnitSelectionDashboardComponents/RoomDetailsModal";

const STATUS_TEXT = {
    booked: "Booked",
    unbooked: "Available",
    available: "Available",
};

const STATUS_COLORS = {
    booked: "bg-red-100 text-red-700 border-red-300",
    unbooked: "bg-green-100 text-green-700 border-green-300",
    available: "bg-green-100 text-green-700 border-green-300",
};

const UnitSelectionDashboard = ({ projectId = 30 }) => {
    const [blocks, setBlocks] = useState([]);
    const [floors, setFloors] = useState([]);
    const [units, setUnits] = useState([]);

    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedUnitForLayout, setSelectedUnitForLayout] = useState(null);
    const [projectLogo, setProjectLogo] = useState(null);
    const [sizeRange, setSizeRange] = useState(null);
    const [error, setError] = useState("");
    const [apiStatus, setApiStatus] = useState("idle");

    // Loading states
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    const [loadingFloors, setLoadingFloors] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);

    // Modal states - Start with all closed
    const [isBlocksModalOpen, setIsBlocksModalOpen] = useState(false);
    const [isFloorsModalOpen, setIsFloorsModalOpen] = useState(false);
    const [isUnitsModalOpen, setIsUnitsModalOpen] = useState(false);
    const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Track modal stack for z-index management
    const [modalStack, setModalStack] = useState([]);
    
    // Base z-index values
    const BASE_Z_INDEX = 40;
    const Z_INDEX_STEP = 10;

    const BASE_URL = `https://smartrealestateapi.ggconsultancy.services/api/projects/${projectId}/units`;

    useEffect(() => {
        let isMounted = true;
        
        const fetchInitialData = async () => {
            if (isMounted) {
                await fetchData("blocks");
            }
        };

        fetchInitialData();

        // Add style for tooltips
        const style = document.createElement("style");
        style.textContent = `
            .tippy-box[data-theme~='modern-purple'] {
                background-color: #7c3aed;
                color: white;
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2),
                            0 4px 6px -4px rgba(0,0,0,0.2);
                padding: 0;
            }
            .tippy-box[data-theme~='modern-purple'] .tippy-content {
                padding: 0;
            }
            .tippy-box[data-theme~='modern-purple'][data-placement^='bottom'] 
                > .tippy-arrow::before {
                border-bottom-color: #7c3aed;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            isMounted = false;
            document.head.removeChild(style);
        };
    }, []);

    // Manage modal stack
    const openModal = (modalType) => {
        setModalStack(prev => [...prev, modalType]);
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modalType) => {
        setModalStack(prev => {
            const newStack = prev.filter(type => type !== modalType);
            // Restore body scrolling if no modals are open
            if (newStack.length === 0) {
                document.body.style.overflow = 'unset';
            }
            return newStack;
        });
    };

    const getModalZIndex = (modalType) => {
        const index = modalStack.indexOf(modalType);
        return index === -1 ? BASE_Z_INDEX : BASE_Z_INDEX + (index * Z_INDEX_STEP);
    };

    const fetchData = async (type, blockName = "", floorName = "") => {
        let isMounted = true;
        
        try {
            setError("");
            setApiStatus("loading");

            if (type === "blocks") setLoadingBlocks(true);
            if (type === "floors") setLoadingFloors(true);
            if (type === "units") setLoadingUnits(true);

            let url = BASE_URL;
            if (type === "floors") url += `?block=${encodeURIComponent(blockName)}`;
            if (type === "units") url += `?block=${encodeURIComponent(blockName)}&floor=${encodeURIComponent(floorName)}`;

            const response = await axios.get(url, { timeout: 10000 });

            if (!isMounted) return;

            if (response.data && response.data.status) {
                const items = response.data.data || [];

                if (response.data.project_logo) setProjectLogo(response.data.project_logo);
                if (response.data.size_range) setSizeRange(response.data.size_range);

                if (type === "blocks") setBlocks(Array.isArray(items) ? items : []);
                if (type === "floors") setFloors(Array.isArray(items) ? items : []);
                if (type === "units") setUnits(Array.isArray(items) ? items : []);
                
                setApiStatus("success");
            } else {
                setError(`No ${type} data available`);
                setApiStatus("error");
                
                if (type === "blocks") setBlocks([]);
                if (type === "floors") setFloors([]);
                if (type === "units") setUnits([]);
            }
        } catch (err) {
            if (!isMounted) return;
            
            console.error(`Error fetching ${type}:`, err);
            
            let errorMessage = "Error fetching data";
            if (err.code === 'ECONNABORTED') {
                errorMessage = "Request timed out. Please check your connection.";
            } else if (err.response) {
                errorMessage = `Server error: ${err.response.status}`;
            } else if (err.request) {
                errorMessage = "Network error. Please check your internet connection.";
            }
            
            setError(errorMessage);
            setApiStatus("error");
            
            if (type === "blocks") setBlocks([]);
            if (type === "floors") setFloors([]);
            if (type === "units") setUnits([]);
            
        } finally {
            if (isMounted) {
                if (type === "blocks") setLoadingBlocks(false);
                if (type === "floors") setLoadingFloors(false);
                if (type === "units") setLoadingUnits(false);
            }
        }
        
        return () => { isMounted = false; };
    };

    const handleBlockSelect = (block) => {
        setSelectedBlock(block);
        setIsBlocksModalOpen(false);
        closeModal('blocks');
        setIsFloorsModalOpen(true);
        openModal('floors');
        fetchData("floors", block);
    };

    const handleFloorSelect = (floor) => {
        setSelectedFloor(floor);
        setIsFloorsModalOpen(false);
        closeModal('floors');
        setIsUnitsModalOpen(true);
        openModal('units');
        if (selectedBlock) {
            fetchData("units", selectedBlock, floor);
        }
    };

    const handleUnitClick = (unit) => {
        setSelectedUnitForLayout(unit);
        setIsUnitsModalOpen(false);
        closeModal('units');
        setIsFloorPlanModalOpen(true);
        openModal('floorPlan');
    };

    const handleRoomClick = (roomData) => {
        setSelectedRoom(roomData);
        setIsFloorPlanModalOpen(false);
        closeModal('floorPlan');
        setIsRoomModalOpen(true);
        openModal('room');
    };

    const handleCloseBlocksModal = () => {
        setIsBlocksModalOpen(false);
        closeModal('blocks');
    };

    const handleCloseFloorsModal = () => {
        setIsFloorsModalOpen(false);
        closeModal('floors');
    };

    const handleCloseUnitsModal = () => {
        setIsUnitsModalOpen(false);
        closeModal('units');
    };

    const handleCloseFloorPlanModal = () => {
        setIsFloorPlanModalOpen(false);
        setSelectedUnitForLayout(null);
        closeModal('floorPlan');
    };

    const handleCloseRoomModal = () => {
        setIsRoomModalOpen(false);
        setSelectedRoom(null);
        closeModal('room');
    };

    const handleBackFromFloors = () => {
        setIsFloorsModalOpen(false);
        closeModal('floors');
        setIsBlocksModalOpen(true);
        openModal('blocks');
    };

    const handleBackFromUnits = () => {
        setIsUnitsModalOpen(false);
        closeModal('units');
        setIsFloorsModalOpen(true);
        openModal('floors');
    };

    const handleBackFromFloorPlan = () => {
        setIsFloorPlanModalOpen(false);
        closeModal('floorPlan');
        setIsUnitsModalOpen(true);
        openModal('units');
    };

    const handleBackFromRoom = () => {
        setIsRoomModalOpen(false);
        closeModal('room');
        setIsFloorPlanModalOpen(true);
        openModal('floorPlan');
    };

    const handleRetry = () => {
        setError("");
        setApiStatus("idle");
        fetchData("blocks");
    };

    // Close all modals and restore scrolling
    const handleCloseAll = () => {
        setIsBlocksModalOpen(false);
        setIsFloorsModalOpen(false);
        setIsUnitsModalOpen(false);
        setIsFloorPlanModalOpen(false);
        setIsRoomModalOpen(false);
        setModalStack([]);
        document.body.style.overflow = 'unset';
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-5xl mx-auto px-6 py-4">
                        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            🏗️ Unit Booking Flow
                        </h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto p-6">
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Unit Booking</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Click on "Select Block" to start browsing available units and floor plans.
                        </p>
                        <button
                            onClick={() => {
                                setIsBlocksModalOpen(true);
                                openModal('blocks');
                            }}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Select Block
                        </button>
                    </div>
                </div>

                {/* Error Display with Retry */}
                {error && (
                    <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-xl p-6 max-w-md shadow-2xl z-50">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Modals */}
                <BlocksModal 
                    isOpen={isBlocksModalOpen}
                    blocks={blocks}
                    selectedBlock={selectedBlock}
                    loading={loadingBlocks}
                    onBlockSelect={handleBlockSelect}
                    onClose={handleCloseBlocksModal}
                    onCloseAll={handleCloseAll}
                    zIndex={getModalZIndex('blocks')}
                />

                <FloorsModal 
                    isOpen={isFloorsModalOpen}
                    floors={floors}
                    selectedFloor={selectedFloor}
                    selectedBlock={selectedBlock}
                    loading={loadingFloors}
                    onFloorSelect={handleFloorSelect}
                    onClose={handleCloseFloorsModal}
                    onBack={handleBackFromFloors}
                    onCloseAll={handleCloseAll}
                    zIndex={getModalZIndex('floors')}
                />

                <UnitsModal 
                    isOpen={isUnitsModalOpen}
                    units={units}
                    selectedFloor={selectedFloor}
                    selectedBlock={selectedBlock}
                    loading={loadingUnits}
                    onUnitClick={handleUnitClick}
                    onClose={handleCloseUnitsModal}
                    onBack={handleBackFromUnits}
                    onCloseAll={handleCloseAll}
                    zIndex={getModalZIndex('units')}
                />

                <FloorPlanModal 
                    isOpen={isFloorPlanModalOpen}
                    unit={selectedUnitForLayout}
                    onClose={handleCloseFloorPlanModal}
                    onRoomClick={handleRoomClick}
                    onBack={handleBackFromFloorPlan}
                    onCloseAll={handleCloseAll}
                    zIndex={getModalZIndex('floorPlan')}
                />

                <RoomDetailsModal 
                    isOpen={isRoomModalOpen}
                    onClose={handleCloseRoomModal}
                    roomData={selectedRoom}
                    onBack={handleBackFromRoom}
                    onCloseAll={handleCloseAll}
                    zIndex={getModalZIndex('room')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default UnitSelectionDashboard;