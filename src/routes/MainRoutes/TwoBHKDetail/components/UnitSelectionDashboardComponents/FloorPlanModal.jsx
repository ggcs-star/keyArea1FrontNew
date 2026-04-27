// UnitSelectionDashboardComponents/FloorPlanModal.jsx
import React from 'react';
import FloorPlanSVG from './FloorPlanSVG';

const FloorPlanModal = ({ isOpen, unit, onClose, onRoomClick, onBack, onCloseAll, zIndex, loading = false }) => {
    if (!isOpen) return null;

    // Get unit number from API response
    const getUnitNumber = () => {
        if (!unit) return '';
        return unit?.unit_number || unit?.number || unit?.name || 'N/A';
    };

    // Get unit type/BHK from API response
    const getUnitType = () => {
        if (!unit) return '';
        // Handle your API's unit_type object structure
        if (unit?.unit_type?.name) {
            const bhkNumber = unit.unit_type.bhk || unit.unit_type.name.match(/\d+/)?.[0];
            return bhkNumber ? `${bhkNumber} BHK` : unit.unit_type.name.toUpperCase();
        }
        return unit?.type || unit?.bhk || 'Apartment';
    };

    // Get unit facing (not in your API, but kept for compatibility)
    const getUnitFacing = () => {
        if (!unit) return '';
        return unit?.facing || unit?.direction || '';
    };

    // Parse room sizes from API format "12 * 10" to readable format
    const parseRoomSize = (sizeString) => {
        if (!sizeString) return null;
        
        // Handle format "12 * 10"
        if (typeof sizeString === 'string' && sizeString.includes('*')) {
            const [length, width] = sizeString.split('*').map(s => parseFloat(s.trim()));
            if (!isNaN(length) && !isNaN(width)) {
                const area = (length * width).toFixed(0);
                return {
                    raw: sizeString,
                    length,
                    width,
                    area: `${area} sq.ft`,
                    display: `${area} sq.ft (${length}' × ${width}')`
                };
            }
        }
        
        // Handle if already formatted
        if (typeof sizeString === 'string' && sizeString.includes('sq.ft')) {
            return {
                raw: sizeString,
                display: sizeString,
                area: sizeString
            };
        }
        
        return null;
    };

    // Get room sizes from unit data - Updated for your API structure
    const getRoomSizes = () => {
        if (!unit) return {};
        
        // Your API returns room_sizes as an object with room names and size strings
        // Example: { "Bedroom 1": "12 * 10", "Hall": "12 * 10", "Kitchen": "12 * 10" }
        if (unit.room_sizes && typeof unit.room_sizes === 'object') {
            const formattedSizes = {};
            Object.entries(unit.room_sizes).forEach(([room, size]) => {
                const parsed = parseRoomSize(size);
                if (parsed) {
                    formattedSizes[room] = parsed.display;
                } else {
                    formattedSizes[room] = size;
                }
            });
            return formattedSizes;
        }
        
        // Fallback for other possible structures
        if (unit.rooms) return unit.rooms;
        if (unit.room_details) return unit.room_details;
        
        // Default room sizes based on unit type (fallback)
        const unitType = getUnitType().toLowerCase();
        if (unitType.includes('2')) {
            return {
                'Living Area': '220 sq.ft',
                'Kitchen': '110 sq.ft',
                'Bedroom 1': '180 sq.ft',
                'Bedroom 2': '150 sq.ft',
                'Balcony': '60 sq.ft'
            };
        } else if (unitType.includes('3')) {
            return {
                'Living Area': '308 sq.ft',
                'Kitchen': '120 sq.ft',
                'Bedroom 1': '224 sq.ft',
                'Bedroom 2': '168 sq.ft',
                'Bedroom 3': '132 sq.ft',
                'Deck': '84 sq.ft'
            };
        } else if (unitType.includes('4')) {
            return {
                'Living Area': '450 sq.ft',
                'Kitchen': '180 sq.ft',
                'Bedroom 1': '280 sq.ft',
                'Bedroom 2': '220 sq.ft',
                'Bedroom 3': '190 sq.ft',
                'Bedroom 4': '160 sq.ft',
                'Deck': '120 sq.ft'
            };
        }
        
        return {
            'Living Area': '250 sq.ft',
            'Kitchen': '120 sq.ft',
            'Bedroom': '180 sq.ft',
            'Balcony': '60 sq.ft'
        };
    };

    // Prepare room data for click handler with parsed dimensions
    const handleRoomClick = (roomName) => {
        if (!onRoomClick || !unit?.room_sizes) return;
        
        const roomSizeRaw = unit.room_sizes[roomName];
        const parsed = parseRoomSize(roomSizeRaw);
        
        // Create room data object for RoomDetailsModal
        const roomData = {
            name: roomName,
            type: getRoomType(roomName),
            description: getRoomDescription(roomName, getUnitType()),
            dimensions: parsed ? `${parsed.length}' × ${parsed.width}'` : 'N/A',
            area: parsed ? parsed.area : 'N/A',
            color: getRoomColorCode(roomName)
        };
        
        onRoomClick(roomData);
    };

    // Get room type based on room name
    const getRoomType = (roomName) => {
        const name = roomName.toLowerCase();
        if (name.includes('bedroom')) return 'Bedroom';
        if (name.includes('living') || name.includes('hall')) return 'Living Area';
        if (name.includes('kitchen')) return 'Kitchen';
        if (name.includes('bath') || name.includes('toilet')) return 'Bathroom';
        if (name.includes('deck') || name.includes('balcony')) return 'Outdoor';
        if (name.includes('dining')) return 'Dining Area';
        return 'Room';
    };

    // Get room description
    const getRoomDescription = (roomName, unitType) => {
        const name = roomName.toLowerCase();
        if (name.includes('master') || (name.includes('bedroom') && name.includes('1'))) {
            return `Spacious master bedroom with attached bathroom and walk-in closet`;
        }
        if (name.includes('bedroom')) {
            return `Well-appointed bedroom with large windows and ample natural light`;
        }
        if (name.includes('living') || name.includes('hall')) {
            return `Expansive living area perfect for entertaining guests and family gatherings`;
        }
        if (name.includes('kitchen')) {
            return `Modern ${unitType} kitchen with premium fittings and ample storage`;
        }
        return `Detailed specifications for ${roomName}`;
    };

    // Get color code for room type (for RoomDetailsModal)
    const getRoomColorCode = (roomName) => {
        const name = roomName.toLowerCase();
        if (name.includes('living') || name.includes('hall')) return 'orange';
        if (name.includes('kitchen')) return 'green';
        if (name.includes('bedroom')) return 'blue';
        if (name.includes('deck') || name.includes('balcony')) return 'teal';
        if (name.includes('bath') || name.includes('toilet')) return 'purple';
        if (name.includes('dining')) return 'yellow';
        return 'blue';
    };

    // Get color for legend display
    const getRoomColor = (roomName) => {
        const name = roomName.toLowerCase();
        if (name.includes('living')) return 'bg-orange-100 border-orange-300';
        if (name.includes('kitchen')) return 'bg-green-100 border-green-300';
        if (name.includes('bedroom')) return 'bg-blue-100 border-blue-300';
        if (name.includes('deck') || name.includes('balcony')) return 'bg-teal-50 border-teal-200';
        if (name.includes('bath') || name.includes('toilet')) return 'bg-purple-100 border-purple-300';
        if (name.includes('dining')) return 'bg-yellow-100 border-yellow-300';
        return 'bg-gray-100 border-gray-300';
    };

    const roomSizes = getRoomSizes();
    const unitNumber = getUnitNumber();
    const unitType = getUnitType();
    const unitFacing = getUnitFacing();

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all duration-300 animate-in zoom-in-95">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={onBack} 
                                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <div>
                                <h3 className="text-2xl font-bold">Unit {unitNumber} Floor Plan</h3>
                                <p className="text-purple-100 mt-1">
                                    {unitType}
                                    {unitFacing && ` • ${unitFacing}`}
                                </p>
                                {unit?.unit_size && (
                                    <p className="text-purple-200 text-sm mt-1">
                                        Total Area: {unit.unit_size} sq.ft
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={onClose} 
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg> 
                                Close
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
                    </div>
                ) : (
                    <FloorPlanSVG 
                        unit={unit} 
                        onRoomClick={handleRoomClick}
                        roomSizes={roomSizes}
                    />
                )}

                <div className="bg-gray-50 p-4 border-t border-gray-200 rounded-b-2xl sticky bottom-0">
                    <div className="flex gap-6 justify-center text-sm text-gray-600 flex-wrap">
                        {Object.entries(roomSizes).map(([room, size]) => (
                            <div key={room} className="flex items-center gap-2">
                                <span className={`w-3 h-3 ${getRoomColor(room)} border rounded`}></span>
                                <span>{room}: {size}</span>
                            </div>
                        ))}
                    </div>
                    
                    {/* Interactive Hint */}
                    <div className="text-center mt-3">
                        <p className="text-xs text-gray-400">
                            💡 Click on any room to view detailed specifications
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloorPlanModal;