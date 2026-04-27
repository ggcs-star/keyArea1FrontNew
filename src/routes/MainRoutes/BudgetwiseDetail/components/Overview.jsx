// components/Overview.jsx
import React, { useState } from "react";
import SideBySidePDFViewer from "./SideBySidePDFViewer";
import UnitSelectionModal from "./UnitSelectionDashboardComponents/UnitSelectionModal";

const Overview = ({ 
  project, 
  projectId: urlProjectId, // Accept projectId from URL as a prop
  builder, 
  bhkUnits, 
  refProp, 
  totalPrice, 
  totalSize 
}) => {
  const [isUnitSelectionOpen, setIsUnitSelectionOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({});

  const propertyName = project?.name || "M3M Antalya Hills";
  
  // Get project ID from multiple possible sources
  // Priority: URL param > project._id > project.id > project.projectId
  const projectId = urlProjectId || project?._id || project?.id || project?.projectId || null;
  
  console.log('📌 Overview - Project object:', project);
  console.log('📌 Overview - URL Project ID:', urlProjectId);
  console.log('📌 Overview - Final Project ID:', projectId);

  // Brochure handling
  const rawBrochureLink = project?.brochure || "";
  const brochureLink = (() => {
    if (!rawBrochureLink) return null;

    const fileIdMatch = rawBrochureLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/uc?export=preview&id=${fileIdMatch[1]}`;
    }

    const ucIdMatch = rawBrochureLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (ucIdMatch && ucIdMatch[1]) {
      return `https://drive.google.com/uc?export=preview&id=${ucIdMatch[1]}`;
    }

    return rawBrochureLink;
  })();

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name) errs.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Valid email is required";
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile))
      errs.mobile = "Valid 10-digit mobile number required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setShowModal(false);
      setTimeout(() => {
        setShowPdfModal(true);
        setFormData({ name: "", email: "", mobile: "" });
        setErrors({});
      }, 300);
    }
  };

  // Handle Explore Property click
  const handleExploreProperty = () => {
    if (!projectId) {
      console.error('❌ No project ID available');
      alert('Project ID not available. Please try again later.');
      return;
    }
    console.log('✅ Opening unit selection modal with projectId:', projectId);
    setIsUnitSelectionOpen(true);
  };

  return (
    <div id="pdOverview" ref={refProp} className="scroll-mt-28 pt-5">
      {/* Features Section */}
      <div className="text-[#333] text-xs font-sans m-0 p-0 border border-[#ddd] rounded overflow-hidden mb-5">
        <div className="border-b border-gray-200 overflow-hidden">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Property Type */}
            <li className="flex items-center p-3">
              <div className="mr-3 flex-shrink-0">
                <img
                  loading="lazy"
                  decoding="async"
                  src="https://static.realestateindia.com/rei/mobile-images/pf-img1.jpg"
                  width="27"
                  height="27"
                  alt="Property Type"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Property Type</p>
                <p className="font-semibold text-sm text-gray-800">{project?.type || 'N/A'}</p>
              </div>
            </li>

            {/* Configuration */}
            <li className="flex items-center p-3">
              <div className="mr-3 flex-shrink-0">
                <img
                  loading="lazy"
                  decoding="async"
                  src="https://static.realestateindia.com/rei/mobile-images/pf-img2.jpg"
                  width="27"
                  height="27"
                  alt="Configuration"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Configuration</p>
                <p className="font-semibold text-sm text-gray-800">
                  {Array.isArray(bhkUnits) && bhkUnits.length > 0 ? (
                    bhkUnits.map((unit, index) => (
                      <span key={index}>
                        {unit.bhkType}
                        {index < bhkUnits.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span>No configurations available</span>
                  )}
                </p>
              </div>
            </li>

            {/* Pricing */}
            <li className="flex items-center p-3">
              <div className="mr-3 flex-shrink-0">
                <img
                  loading="lazy"
                  decoding="async"
                  src="https://static.realestateindia.com/rei/mobile-images/pf-img3.jpg"
                  width="27"
                  height="27"
                  alt="Pricing"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pricing</p>
                <p className="font-semibold text-sm text-gray-800">{totalPrice?.price || 'N/A'}</p>
              </div>
            </li>

            {/* Possession Date */}
            <li className="flex items-center p-3">
              <div className="mr-3 flex-shrink-0">
                <img
                  loading="lazy"
                  decoding="async"
                  src="https://static.realestateindia.com/rei/mobile-images/pf-img4.jpg"
                  width="27"
                  height="27"
                  alt="Possession Date"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Possession Date</p>
                <p className="font-semibold text-sm text-gray-800">
                  {Array.isArray(bhkUnits) && bhkUnits.length > 0 ? (
                    <span>{bhkUnits[0]?.date || 'N/A'}</span>
                  ) : (
                    <span>N/A</span>
                  )}
                </p>
              </div>
            </li>

            {/* Total Units */}
            <li className="flex items-center p-3">
              <div className="mr-3 flex-shrink-0">
                <img
                  loading="lazy"
                  decoding="async"
                  src="https://static.realestateindia.com/rei/mobile-images/pf-img5.jpg"
                  width="27"
                  height="27"
                  alt="Total Units"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Units</p>
                <p className="font-semibold text-sm text-gray-800">80 units</p>
              </div>
            </li>

            {/* Total Area */}
            <li className="flex items-center p-3">
              <div className="mr-3 flex-shrink-0">
                <img
                  loading="lazy"
                  decoding="async"
                  src="https://static.realestateindia.com/rei/mobile-images/pf-img7.jpg"
                  width="27"
                  height="27"
                  alt="Total Area"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Area</p>
                <p className="font-semibold text-sm text-gray-800">{totalSize?.size || 'N/A'}</p>
              </div>
            </li>

            {/* Possession Status */}
            <li className="flex items-center p-3">
              <div className="mr-3 flex-shrink-0">
                <img
                  loading="lazy"
                  decoding="async"
                  src="https://static.realestateindia.com/rei/mobile-images/pf-img9.jpg"
                  width="27"
                  height="27"
                  alt="Possession Status"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Possession Status</p>
                <p className="font-semibold text-sm text-gray-800">{project?.phase || 'N/A'}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Brochure Section with Both Buttons */}
        <div className="flex items-center p-3 rounded bg-blue-50">
          <div className="mr-4">
            <img
              loading="lazy"
              src="https://static.realestateindia.com/rei/images/brochure_icon.jpg"
              width="34"
              height="41"
              alt="Brochure"
            />
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="font-semibold">
              Download Brochure of
              <span className="block font-normal text-sm">{propertyName}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Download Button */}
              <button
                onClick={() => setShowModal(true)}
                className="cursor-pointer hover:bg-red-500 hover:border-transparent border border-red-500 hover:text-white rounded-lg px-3 py-2 flex items-center gap-2 text-red-500 font-bold transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="54.13 48 402 402"
                  className="fill-current"
                >
                  <path d="M255.13 385.54a15 15 0 0 1-11.14-5L103.67 224.93a15 15 0 0 1 11.14-25H171V63a15 15 0 0 1 15-15h138.3a15 15 0 0 1 15 15v136.89h56.16a15 15 0 0 1 11.14 25L266.27 380.58a15 15 0 0 1-11.14 4.96Zm-106.6-155.65 106.6 118.25 106.61-118.25H324.3a15 15 0 0 1-15-15V78H201v136.89a15 15 0 0 1-15 15Z" />
                  <path d="M390.84 450H119.43a65.37 65.37 0 0 1-65.3-65.29v-38.17a15 15 0 0 1 30 0v38.17a35.34 35.34 0 0 0 35.3 35.29h271.41a35.33 35.33 0 0 0 35.29-35.29v-38.17a15 15 0 0 1 30 0v38.17A65.37 65.37 0 0 1 390.84 450Z" />
                </svg>
                <span>Download</span>
              </button>

              {/* Explore Property Button */}
              <button
                onClick={handleExploreProperty}
                className="cursor-pointer bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition min-w-[140px]"
                style={{ backgroundColor: '#2563eb' }}
                disabled={!projectId}
              >
                <span className="text-white font-medium">Explore Property</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal for Brochure Download */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-[5px] z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-lg font-bold mb-4">
              Enter your details to download
            </h2>

            {/* Name */}
            <div className="mb-3">
              <label className="block text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-sm font-medium">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Submit & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal for Brochure */}
      {showPdfModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-[5px] z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] relative">
            <button
              onClick={() => setShowPdfModal(false)}
              className="absolute top-3 right-3 bg-gray-300 text-gray-800 hover:text-white px-3 py-1 rounded cursor-pointer hover:bg-gray-500 z-10"
            >
              ✕
            </button>

            {brochureLink ? (
              <SideBySidePDFViewer
                fileUrl={brochureLink}
                onError={() => {
                  setShowPdfModal(false);
                  window.open(brochureLink, "_blank");
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full p-6">
                <p className="text-gray-600">Brochure not available.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Unit Selection Modal */}
      {projectId && (
        <UnitSelectionModal 
          isOpen={isUnitSelectionOpen}
          onClose={() => setIsUnitSelectionOpen(false)}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default Overview;