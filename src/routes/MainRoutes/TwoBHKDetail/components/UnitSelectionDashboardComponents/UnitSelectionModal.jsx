// UnitSelectionDashboardComponents/UnitSelectionModal.jsx
import React, { useState, useEffect } from "react";
import BlocksModal from "./BlocksModal";
import FloorsModal from "./FloorsModal";
import UnitsModal from "./UnitsModal";
import FloorPlanModal from "./FloorPlanModal";
import RoomDetailsModal from "./RoomDetailsModal";

import {
    getTowers,
    getFloorsByTower,
    getUnitsByFloor,
    getUnitDetails,
} from "../../../../../../api";

const UnitSelectionModal = ({ isOpen, onClose, projectSlug = "demo" }) => {
    const [towers, setTowers] = useState([]);
    const [floors, setFloors] = useState([]);
    const [units, setUnits] = useState([]);

    const [selectedTower, setSelectedTower] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedUnitForLayout, setSelectedUnitForLayout] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [error, setError] = useState("");
    const [apiStatus, setApiStatus] = useState("idle");

    // Loading states
    const [loadingTowers, setLoadingTowers] = useState(false);
    const [loadingFloors, setLoadingFloors] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Modal visibility states
    const [showBlocksModal, setShowBlocksModal] = useState(false);
    const [showFloorsModal, setShowFloorsModal] = useState(false);
    const [showUnitsModal, setShowUnitsModal] = useState(false);
    const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false);

    // Track modal stack for z-index
    const [modalStack, setModalStack] = useState([]);
    const BASE_Z_INDEX = 1050;
    const Z_INDEX_STEP = 10;

useEffect(() => {
    if (isOpen) {
        // 🔥 HARD RESET (prevents stale towers)
        setTowers([]);
        setFloors([]);
        setUnits([]);

        setSelectedTower(null);
        setSelectedFloor("");
        setSelectedUnitForLayout(null);

        setShowBlocksModal(true);
        setModalStack(['blocks']);

        // fetch AFTER reset
        fetchData("towers");

        document.body.style.overflow = 'hidden';
    } else {
        resetAll();
        document.body.style.overflow = 'unset';
    }

    return () => {
        document.body.style.overflow = 'unset';
    };
}, [isOpen, projectSlug]);

    const resetAll = () => {
        setShowBlocksModal(false);
        setShowFloorsModal(false);
        setShowUnitsModal(false);
        setShowFloorPlanModal(false);
        setShowRoomModal(false);
        setSelectedTower(null);
        setSelectedFloor("");
        setSelectedUnitForLayout(null);
        setSelectedRoom(null);
        setModalStack([]);
        setError("");
        setApiStatus("idle");
        setTowers([]);
        setFloors([]);
        setUnits([]);
    };

    const handleCloseAll = () => {
        resetAll();
        onClose();
    };

    const getModalZIndex = (modalType) => {
        const index = modalStack.indexOf(modalType);
        return index === -1 ? BASE_Z_INDEX : BASE_Z_INDEX + (index * Z_INDEX_STEP);
    };

    const openModal = (modalType) => {
        setModalStack(prev => [...prev, modalType]);
    };

    const closeModal = (modalType) => {
        setModalStack(prev => prev.filter(type => type !== modalType));
    };

    const fetchData = async (type, towerId = null, floor = "", unitNumber = "") => {
        try {
            setError("");
            setApiStatus("loading");

            if (type === "towers") setLoadingTowers(true);
            if (type === "floors") setLoadingFloors(true);
            if (type === "units") setLoadingUnits(true);
            if (type === "detail") setLoadingDetail(true);

            let response;

            if (type === "towers") {
                response = await getTowers(projectSlug);
                const towersData = response?.data?.data?.towers || [];
                setTowers(Array.isArray(towersData) ? towersData : []);
                setApiStatus("success");
            }

            if (type === "floors") {
                response = await getFloorsByTower(projectSlug, towerId);
                const floorsData = response?.data?.data?.floors || [];
                setFloors(Array.isArray(floorsData) ? floorsData : []);
                setApiStatus("success");
            }

            if (type === "units") {
                response = await getUnitsByFloor(projectSlug, towerId, floor);
                const unitsData = response?.data?.data?.units || [];
                setUnits(Array.isArray(unitsData) ? unitsData : []);
                setApiStatus("success");
            }

            if (type === "detail") {
                response = await getUnitDetails(projectSlug, towerId, floor, unitNumber);
                const unitData = response?.data?.data?.unit || response?.data?.data || null;
                setSelectedUnitForLayout(unitData);
                setApiStatus("success");
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

            if (type === "towers") setTowers([]);
            if (type === "floors") setFloors([]);
            if (type === "units") setUnits([]);
            if (type === "detail") setSelectedUnitForLayout(null);
        } finally {
            if (type === "towers") setLoadingTowers(false);
            if (type === "floors") setLoadingFloors(false);
            if (type === "units") setLoadingUnits(false);
            if (type === "detail") setLoadingDetail(false);
        }
    };

    // Navigation handlers
    const handleBlockSelect = (tower) => {
        setSelectedTower(tower);
        setShowBlocksModal(false);
        closeModal('blocks');
        setShowFloorsModal(true);
        openModal('floors');
        fetchData("floors", tower.id);
    };

    const handleFloorSelect = (floor) => {
        setSelectedFloor(floor);
        setShowFloorsModal(false);
        closeModal('floors');
        setShowUnitsModal(true);
        openModal('units');
        fetchData("units", selectedTower?.id, floor);
    };

    const handleUnitClick = (unit) => {
        setShowUnitsModal(false);
        closeModal('units');
        setShowFloorPlanModal(true);
        openModal('floorPlan');
        fetchData("detail", selectedTower?.id, selectedFloor, unit.unit_number);
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
        setFloors([]);
        setSelectedFloor("");
    };

    const handleBackFromUnits = () => {
        setShowUnitsModal(false);
        closeModal('units');
        setShowFloorsModal(true);
        openModal('floors');
        setUnits([]);
    };

    const handleBackFromFloorPlan = () => {
        setShowFloorPlanModal(false);
        closeModal('floorPlan');
        setShowUnitsModal(true);
        openModal('units');
        setSelectedUnitForLayout(null);
    };

    const handleBackFromRoom = () => {
        setShowRoomModal(false);
        closeModal('room');
        setShowFloorPlanModal(true);
        openModal('floorPlan');
        setSelectedRoom(null);
    };

    const handleRetry = () => {
        setError("");
        setApiStatus("idle");
        if (showBlocksModal) fetchData("towers");
        else if (showFloorsModal) fetchData("floors", selectedTower?.id);
        else if (showUnitsModal) fetchData("units", selectedTower?.id, selectedFloor);
        else if (showFloorPlanModal && selectedUnitForLayout) {
            fetchData("detail", selectedTower?.id, selectedFloor, selectedUnitForLayout?.unit_number);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                style={{ zIndex: BASE_Z_INDEX - 1 }}
                onClick={handleCloseAll}
            />

            {/* Modals Container */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: BASE_Z_INDEX }}>
                <div className="min-h-full flex items-center justify-center p-4">
                    {/* Blocks/Towers Modal */}
                    {showBlocksModal && (
                        <div className="pointer-events-auto" style={{ zIndex: getModalZIndex('blocks') }}>
                            <BlocksModal
                                key={projectSlug}   // 🔥 FORCE RESET ON PROJECT CHANGE

                                isOpen={showBlocksModal}
                                blocks={towers}
                                selectedBlock={selectedTower}
                                loading={loadingTowers}
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
                                selectedBlock={selectedTower?.name || selectedTower}
                                loading={loadingFloors}
                                onFloorSelect={handleFloorSelect}
                                onClose={handleCloseAll}
                                onBack={handleBackFromFloors}
                                onCloseAll={handleCloseAll}
                                zIndex={getModalZIndex('floors')}
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
                                selectedBlock={selectedTower?.name || selectedTower}
                                loading={loadingUnits}
                                onUnitClick={handleUnitClick}
                                onClose={handleCloseAll}
                                onBack={handleBackFromUnits}
                                onCloseAll={handleCloseAll}
                                zIndex={getModalZIndex('units')}
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
                                loading={loadingDetail}
                                zIndex={getModalZIndex('floorPlan')}
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
                                zIndex={getModalZIndex('room')}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-xl p-4 max-w-md shadow-2xl z-[9999]">
                    <p className="text-red-600 text-sm">{error}</p>
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={handleRetry}
                            className="text-red-600 text-xs underline hover:text-red-800"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => setError("")}
                            className="text-red-600 text-xs underline hover:text-red-800"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UnitSelectionModal;