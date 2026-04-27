// UnitSelectionDashboardComponents/UnitSelectionModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import BlocksModal from "./BlocksModal";
import FloorsModal from "./FloorsModal";
import UnitsModal from "./UnitsModal";
import FloorPlanModal from "./FloorPlanModal";
import RoomDetailsModal from "./RoomDetailsModal";

const UnitSelectionModal = ({ isOpen, onClose, projectId = 30 }) => {
    const [blocks, setBlocks] = useState([]);
    const [floors, setFloors] = useState([]);
    const [units, setUnits] = useState([]);

    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedUnitForLayout, setSelectedUnitForLayout] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [error, setError] = useState("");
    const [apiStatus, setApiStatus] = useState("idle");

    // Loading states
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    const [loadingFloors, setLoadingFloors] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);

    // Modal visibility states - Start with all closed, will open blocks modal when isOpen becomes true
    const [showBlocksModal, setShowBlocksModal] = useState(false);
    const [showFloorsModal, setShowFloorsModal] = useState(false);
    const [showUnitsModal, setShowUnitsModal] = useState(false);
    const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false);

    // Track modal stack for z-index
    const [modalStack, setModalStack] = useState([]);
    const BASE_Z_INDEX = 1050;
    const Z_INDEX_STEP = 10;

    const BASE_URL = `https://smartrealestateapi.ggconsultancy.services/api/projects/${projectId}/units`;

    // Handle modal open/close - exactly like UnitSelectionDashboard but with backdrop
    useEffect(() => {
        if (isOpen) {
            // Open blocks modal and fetch data
            setShowBlocksModal(true);
            setModalStack(['blocks']);
            fetchData("blocks");
            document.body.style.overflow = 'hidden';
        } else {
            resetAll();
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, projectId]);

    const resetAll = () => {
        setShowBlocksModal(false);
        setShowFloorsModal(false);
        setShowUnitsModal(false);
        setShowFloorPlanModal(false);
        setShowRoomModal(false);
        setSelectedBlock("");
        setSelectedFloor("");
        setSelectedUnitForLayout(null);
        setSelectedRoom(null);
        setModalStack([]);
        setError("");
        setApiStatus("idle");
    };

    const handleCloseAll = () => {
        resetAll();
        onClose();
    };

    const getModalZIndex = (modalType) => {
        const index = modalStack.indexOf(modalType);
        return index === -1 ? BASE_Z_INDEX : BASE_Z_INDEX + (index * Z_INDEX_STEP);
    };

    // Manage modal stack (same as UnitSelectionDashboard)
    const openModal = (modalType) => {
        setModalStack(prev => [...prev, modalType]);
    };

    const closeModal = (modalType) => {
        setModalStack(prev => {
            const newStack = prev.filter(type => type !== modalType);
            return newStack;
        });
    };

    const fetchData = async (type, blockName = "", floorName = "") => {
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

            if (response.data && response.data.status) {
                const items = response.data.data || [];
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
            if (type === "blocks") setLoadingBlocks(false);
            if (type === "floors") setLoadingFloors(false);
            if (type === "units") setLoadingUnits(false);
        }
    };

    // Navigation handlers (exactly like UnitSelectionDashboard)
    const handleBlockSelect = (block) => {
        setSelectedBlock(block);
        setShowBlocksModal(false);
        closeModal('blocks');
        setShowFloorsModal(true);
        openModal('floors');
        fetchData("floors", block);
    };

    const handleFloorSelect = (floor) => {
        setSelectedFloor(floor);
        setShowFloorsModal(false);
        closeModal('floors');
        setShowUnitsModal(true);
        openModal('units');
        fetchData("units", selectedBlock, floor);
    };

    const handleUnitClick = (unit) => {
        setSelectedUnitForLayout(unit);
        setShowUnitsModal(false);
        closeModal('units');
        setShowFloorPlanModal(true);
        openModal('floorPlan');
    };

    const handleRoomClick = (roomData) => {
        setSelectedRoom(roomData);
        setShowFloorPlanModal(false);
        closeModal('floorPlan');
        setShowRoomModal(true);
        openModal('room');
    };

    const handleBackFromFloors = () => {
        setShowFloorsModal(false);
        closeModal('floors');
        setShowBlocksModal(true);
        openModal('blocks');
    };

    const handleBackFromUnits = () => {
        setShowUnitsModal(false);
        closeModal('units');
        setShowFloorsModal(true);
        openModal('floors');
    };

    const handleBackFromFloorPlan = () => {
        setShowFloorPlanModal(false);
        closeModal('floorPlan');
        setShowUnitsModal(true);
        openModal('units');
    };

    const handleBackFromRoom = () => {
        setShowRoomModal(false);
        closeModal('room');
        setShowFloorPlanModal(true);
        openModal('floorPlan');
    };

    const handleRetry = () => {
        setError("");
        setApiStatus("idle");
        fetchData("blocks");
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-opacity-50 backdrop-blur-sm"
                style={{ zIndex: BASE_Z_INDEX - 1 }}
                onClick={handleCloseAll}
            />
            
            {/* Modals Container */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: BASE_Z_INDEX }}>
                <div className="min-h-full flex items-center justify-center p-4">
                    {/* Blocks Modal */}
                    {showBlocksModal && (
                        <div className="pointer-events-auto" style={{ zIndex: getModalZIndex('blocks') }}>
                            <BlocksModal 
                                isOpen={showBlocksModal}
                                blocks={blocks}
                                selectedBlock={selectedBlock}
                                loading={loadingBlocks}
                                onBlockSelect={handleBlockSelect}
                                onClose={handleCloseAll}
                                onCloseAll={handleCloseAll}
                            />
                        </div>
                    )}

                    {/* Floors Modal */}
                    {showFloorsModal && (
                        <div className="pointer-events-auto" style={{ zIndex: getModalZIndex('floors') }}>
                            <FloorsModal 
                                isOpen={showFloorsModal}
                                floors={floors}
                                selectedFloor={selectedFloor}
                                selectedBlock={selectedBlock}
                                loading={loadingFloors}
                                onFloorSelect={handleFloorSelect}
                                onClose={handleCloseAll}
                                onBack={handleBackFromFloors}
                                onCloseAll={handleCloseAll}
                            />
                        </div>
                    )}

                    {/* Units Modal */}
                    {showUnitsModal && (
                        <div className="pointer-events-auto" style={{ zIndex: getModalZIndex('units') }}>
                            <UnitsModal 
                                isOpen={showUnitsModal}
                                units={units}
                                selectedFloor={selectedFloor}
                                selectedBlock={selectedBlock}
                                loading={loadingUnits}
                                onUnitClick={handleUnitClick}
                                onClose={handleCloseAll}
                                onBack={handleBackFromUnits}
                                onCloseAll={handleCloseAll}
                            />
                        </div>
                    )}

                    {/* Floor Plan Modal */}
                    {showFloorPlanModal && (
                        <div className="pointer-events-auto" style={{ zIndex: getModalZIndex('floorPlan') }}>
                            <FloorPlanModal 
                                isOpen={showFloorPlanModal}
                                unit={selectedUnitForLayout}
                                onClose={handleCloseAll}
                                onRoomClick={handleRoomClick}
                                onBack={handleBackFromFloorPlan}
                                onCloseAll={handleCloseAll}
                            />
                        </div>
                    )}

                    {/* Room Details Modal */}
                    {showRoomModal && (
                        <div className="pointer-events-auto" style={{ zIndex: getModalZIndex('room') }}>
                            <RoomDetailsModal 
                                isOpen={showRoomModal}
                                onClose={handleCloseAll}
                                roomData={selectedRoom}
                                onBack={handleBackFromRoom}
                                onCloseAll={handleCloseAll}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-xl p-4 max-w-md shadow-2xl" style={{ zIndex: BASE_Z_INDEX + 100 }}>
                    <p className="text-red-600 text-sm">{error}</p>
                    <button 
                        onClick={() => setError("")}
                        className="text-red-600 text-xs mt-2 underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </>
    );
};

export default UnitSelectionModal;