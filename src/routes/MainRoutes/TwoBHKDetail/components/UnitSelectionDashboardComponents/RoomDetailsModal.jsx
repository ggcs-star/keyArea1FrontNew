// UnitSelectionDashboardComponents/RoomDetailsModal.jsx
import React from 'react';

const RoomDetailsModal = ({ isOpen, onClose, roomData, onBack, onCloseAll, zIndex }) => {
    if (!isOpen || !roomData) return null;

    // Helper function to get room color scheme based on room type
    const getColorSchemeByRoomType = (roomType) => {
        const type = (roomType || '').toLowerCase();
        
        const colors = {
            orange: { 
                bg: 'bg-orange-50', 
                border: 'border-orange-100', 
                badge: 'bg-orange-100 text-orange-700', 
                icon: 'text-orange-600', 
                accent: 'text-orange-900', 
                light: 'text-orange-300',
                hover: 'hover:bg-orange-100'
            },
            green: { 
                bg: 'bg-green-50', 
                border: 'border-green-100', 
                badge: 'bg-green-100 text-green-700', 
                icon: 'text-green-600', 
                accent: 'text-green-900', 
                light: 'text-green-300',
                hover: 'hover:bg-green-100'
            },
            blue: { 
                bg: 'bg-blue-50', 
                border: 'border-blue-100', 
                badge: 'bg-blue-100 text-blue-700', 
                icon: 'text-blue-600', 
                accent: 'text-blue-900', 
                light: 'text-blue-300',
                hover: 'hover:bg-blue-100'
            },
            teal: { 
                bg: 'bg-teal-50', 
                border: 'border-teal-100', 
                badge: 'bg-teal-100 text-teal-700', 
                icon: 'text-teal-600', 
                accent: 'text-teal-900', 
                light: 'text-teal-300',
                hover: 'hover:bg-teal-100'
            },
            purple: { 
                bg: 'bg-purple-50', 
                border: 'border-purple-100', 
                badge: 'bg-purple-100 text-purple-700', 
                icon: 'text-purple-600', 
                accent: 'text-purple-900', 
                light: 'text-purple-300',
                hover: 'hover:bg-purple-100'
            },
            yellow: { 
                bg: 'bg-yellow-50', 
                border: 'border-yellow-100', 
                badge: 'bg-yellow-100 text-yellow-700', 
                icon: 'text-yellow-600', 
                accent: 'text-yellow-900', 
                light: 'text-yellow-300',
                hover: 'hover:bg-yellow-100'
            }
        };

        // Determine color based on room type
        if (type.includes('living') || type.includes('hall')) return colors.orange;
        if (type.includes('kitchen')) return colors.green;
        if (type.includes('bedroom') || type.includes('master')) return colors.blue;
        if (type.includes('deck') || type.includes('balcony') || type.includes('terrace')) return colors.teal;
        if (type.includes('bath') || type.includes('toilet') || type.includes('washroom')) return colors.purple;
        if (type.includes('dining')) return colors.yellow;
        
        // Fallback to provided color or default
        return colors[roomData.color] || colors.blue;
    };

    const colors = getColorSchemeByRoomType(roomData.type || roomData.roomType);
    
    // Parse dimensions from various formats (including "12 * 10" from your API)
    const parseDimensions = () => {
        // Handle dimension string from API: "12 * 10"
        const dimensionStr = roomData.dimensions || roomData.size || roomData.area_size || '';
        
        // Handle format with asterisk (your API format)
        if (dimensionStr.includes('*')) {
            const dimensions = dimensionStr.split('*').map(d => d.trim().replace(/['"]/g, ''));
            return { length: dimensions[0] || '0', width: dimensions[1] || '0' };
        }
        
        // Handle format with × symbol
        if (dimensionStr.includes('×')) {
            const dimensions = dimensionStr.split('×').map(d => d.trim().replace(/['"]/g, ''));
            return { length: dimensions[0] || '0', width: dimensions[1] || '0' };
        }
        
        // Handle dimensions as separate fields
        if (roomData.length && roomData.width) {
            return { length: roomData.length, width: roomData.width };
        }
        
        // If area is provided, calculate approximate dimensions
        if (roomData.area) {
            const areaMatch = roomData.area.match(/\d+/);
            if (areaMatch) {
                const areaNum = parseInt(areaMatch[0]);
                if (!isNaN(areaNum)) {
                    const approxSide = Math.sqrt(areaNum).toFixed(1);
                    return { length: approxSide, width: approxSide };
                }
            }
        }
        
        return { length: 'N/A', width: 'N/A' };
    };
    
    const { length, width } = parseDimensions();
    
    // Get room display name
    const getRoomDisplayName = () => {
        return roomData.name || roomData.roomName || roomData.label || 'Room';
    };
    
    // Get room type display
    const getRoomTypeDisplay = () => {
        return roomData.type || roomData.roomType || 'Room';
    };
    
    // Get room description - enhanced with specific details
    const getRoomDescription = () => {
        if (roomData.description) return roomData.description;
        
        const roomName = getRoomDisplayName();
        const roomType = getRoomTypeDisplay();
        
        // Generate intelligent descriptions based on room type
        if (roomType.toLowerCase().includes('bedroom')) {
            if (roomName.toLowerCase().includes('master')) {
                return `Spacious master bedroom featuring ample natural light, premium flooring, and elegant finishes. Perfect for relaxation and privacy.`;
            }
            return `Well-appointed bedroom with large windows, built-in wardrobe space, and comfortable layout.`;
        }
        
        if (roomType.toLowerCase().includes('living') || roomType.toLowerCase().includes('hall')) {
            return `Expansive living area designed for entertaining guests and family gatherings. Features abundant natural light and flexible layout options.`;
        }
        
        if (roomType.toLowerCase().includes('kitchen')) {
            return `Modern kitchen with premium fittings, ample storage, and efficient workspace. Designed for both functionality and style.`;
        }
        
        if (roomType.toLowerCase().includes('bath')) {
            return `Elegant bathroom with high-quality fixtures, modern design, and premium finishes.`;
        }
        
        if (roomType.toLowerCase().includes('balcony') || roomType.toLowerCase().includes('deck')) {
            return `Private outdoor space offering fresh air and scenic views. Perfect for relaxation and morning coffee.`;
        }
        
        return `Detailed specifications for ${roomName}`;
    };
    
    // Get room area - handles various formats
    const getRoomArea = () => {
        // If area is directly provided
        if (roomData.area) {
            if (roomData.area.includes('sq.ft')) return roomData.area;
            const areaNum = parseInt(roomData.area);
            if (!isNaN(areaNum)) return `${areaNum} sq.ft`;
        }
        
        // Calculate area from dimensions if available
        if (length !== 'N/A' && width !== 'N/A') {
            const lengthNum = parseFloat(length);
            const widthNum = parseFloat(width);
            if (!isNaN(lengthNum) && !isNaN(widthNum)) {
                const calculatedArea = (lengthNum * widthNum).toFixed(0);
                return `${calculatedArea} sq.ft`;
            }
        }
        
        // Check for carpet area
        if (roomData.carpet_area) {
            return roomData.carpet_area.includes('sq.ft') ? roomData.carpet_area : `${roomData.carpet_area} sq.ft`;
        }
        
        if (roomData.sqft) {
            return `${roomData.sqft} sq.ft`;
        }
        
        return 'N/A';
    };
    
    // Get additional features based on room type
    const getAdditionalFeatures = () => {
        if (roomData.features && roomData.features.length > 0) return roomData.features;
        if (roomData.specifications && roomData.specifications.length > 0) return roomData.specifications;
        
        const roomType = getRoomTypeDisplay().toLowerCase();
        const features = [];
        
        // Add intelligent default features based on room type
        if (roomType.includes('bedroom')) {
            features.push('Large windows', 'Built-in wardrobe', 'Premium flooring');
            if (roomName.toLowerCase().includes('master')) {
                features.push('Ensuite bathroom', 'Walk-in closet');
            }
        } else if (roomType.includes('living') || roomType.includes('hall')) {
            features.push('Abundant natural light', 'Premium flooring', 'High ceilings');
        } else if (roomType.includes('kitchen')) {
            features.push('Modular cabinets', 'Granite countertop', 'Premium appliances', 'Ventilation system');
        } else if (roomType.includes('bath')) {
            features.push('Premium fixtures', 'Modern vanity', 'Exhaust fan');
        } else if (roomType.includes('balcony')) {
            features.push('Glass railing', 'Tiled flooring', 'Scenic view');
        }
        
        return features;
    };
    
    const roomName = getRoomDisplayName();
    const roomType = getRoomTypeDisplay();
    const roomDescription = getRoomDescription();
    const roomArea = getRoomArea();
    const additionalFeatures = getAdditionalFeatures();
    
    // Check if dimensions are valid for display
    const hasValidDimensions = length !== 'N/A' && width !== 'N/A';

    return (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ zIndex }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="bg-white w-full sm:w-96 p-6 rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 pointer-events-auto relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 max-h-[90vh] overflow-y-auto">
                {/* Room Type Badge */}
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 ${colors.badge} text-xs font-bold uppercase rounded tracking-wide`}>
                        {roomType}
                    </span>
                </div>
                
                {/* Back Button */}
                <button 
                    onClick={onBack} 
                    className={`absolute top-4 left-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors ${colors.hover}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                </button>
                
                {/* Room Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-1 mt-6">{roomName}</h3>
                
                {/* Room Description */}
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{roomDescription}</p>
                
                <div className="space-y-4">
                    {/* Dimensions Section - Only show if dimensions are valid */}
                    {hasValidDimensions && (
                        <div className={`${colors.bg} p-5 rounded-xl border ${colors.border} relative overflow-hidden transition-all`}>
                            <div className={`flex items-center gap-2 ${colors.icon} mb-3`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"></path>
                                    <path d="m14.5 12.5 2-2"></path>
                                    <path d="m11.5 9.5 2-2"></path>
                                    <path d="m8.5 6.5 2-2"></path>
                                    <path d="m17.5 15.5 2-2"></path>
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-wider">Dimensions (L × W)</span>
                            </div>
                            <div className="flex items-end justify-center gap-4">
                                <div>
                                    <span className={`text-4xl sm:text-5xl font-black ${colors.accent} tracking-tighter`}>
                                        {length}
                                    </span>
                                    <span className={`text-lg ${colors.icon} font-bold ml-1`}>'</span>
                                </div>
                                <span className={`${colors.light} text-3xl font-light`}>×</span>
                                <div>
                                    <span className={`text-4xl sm:text-5xl font-black ${colors.accent} tracking-tighter`}>
                                        {width}
                                    </span>
                                    <span className={`text-lg ${colors.icon} font-bold ml-1`}>'</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Carpet Area Section */}
                    {roomArea !== 'N/A' && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between transition-all hover:shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h6v6"></path>
                                    <path d="m21 3-7 7"></path>
                                    <path d="m3 21 7-7"></path>
                                    <path d="M9 21H3v-6"></path>
                                    <path d="M21 15v6h-6"></path>
                                    <path d="M3 9V3h6"></path>
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-wider">Carpet Area</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                                    {roomArea.split(' ')[0] || '0'}
                                </span>
                                <span className="text-sm font-medium text-gray-500 ml-1.5">
                                    {roomArea.includes('sq.ft') ? 'sq.ft' : roomArea.split(' ')[1] || 'sq.ft'}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {/* Additional Features */}
                    {additionalFeatures.length > 0 && (
                        <div className="border-t border-gray-100 pt-3">
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                                    <path d="M8 10h8"></path>
                                    <path d="M8 14h5"></path>
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-wider">Features</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {additionalFeatures.map((feature, idx) => (
                                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomDetailsModal;