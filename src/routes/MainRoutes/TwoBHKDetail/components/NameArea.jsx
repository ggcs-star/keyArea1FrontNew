import React, { useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import ShareModal from "./ShareModal";

const NameArea = ({ project = {}, builder = {}, totalPrice = {}, configurations = [] }) => {
  if (!project) return null;

  // 🔍 BACKWARD + NEW API SAFE LOGGING
  console.log("📌 NameArea project:", project);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  /**
   * ✅ LOCATION (NEW API FIRST)
   */
  const formattedLocation =
    project?.address ||
    [project?.area, project?.city].filter(Boolean).join(", ") ||
    "Location not available";

  /**
   * ✅ CONFIGURATION (unit_types from API)
   */
  const bhk =
    Array.isArray(configurations) && configurations.length > 0
      ? configurations.map((c) => c?.name || `${c?.bhk} BHK`).join(", ")
      : "N/A";

  /**
   * ✅ RERA (new key)
   */
  const rera =
    project?.rera_number ||
    project?.reraNumber || // fallback old
    "N/A";

  /**
   * ✅ PRICE
   */
  const price =
    totalPrice?.price ||
    project?.price ||
    "N/A";

  /**
   * ✅ STATUS (new key)
   */
  const status =
    project?.project_status ||
    project?.status ||
    "N/A";

  /**
   * ✅ LOGO / IMAGE
   */
  const logo =
    project?.cover_image ||
    project?.logo_image_id ||
    "https://via.placeholder.com/150x100?text=No+Logo";

  return (
    <div>
      <div className="pd-heading logoIcon pt-8 flex flex-col lg:flex-row">

        {/* LEFT */}
        <div className="pd-heading-left flex gap-4">

          {/* LOGO */}
          <div className="pd-logo w-[120px]">
            <img
              src={logo}
              alt={project?.name || "Project"}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* TITLE */}
          <div className="pd-title">
            <h1 className="pd-name text-xl font-bold">
              {project?.name || "Project Name"}
            </h1>

            {builder?.name && (
              <p className="text-sm text-gray-500 mt-1">
                By {builder.name}
              </p>
            )}

            <p className="pd-location text-md font-semibold text-gray-700 mt-1">
              {formattedLocation}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="pd-heading-right ml-auto">
          <div className="pd-price flex flex-col items-start lg:items-end pt-4 lg:pt-0">

            <div className="flex items-center text-gray-900">
              <span className="pr-2 font-medium">Price</span>
              <span>₹ {price}</span>
            </div>

            <div className="flex items-center">
              <span className="pr-2">Status:</span>
              <span className="capitalize">{status}</span>
            </div>

            <button
              className="flex items-center text-gray-500 hover:text-gray-800 text-lg cursor-pointer mt-2"
              onClick={() => setIsShareModalOpen(true)}
            >
              <FaShareAlt className="mr-1" />
              Share
            </button>

            {isShareModalOpen && (
              <ShareModal onClose={() => setIsShareModalOpen(false)} />
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center text-[14px] text-[#666] py-4 gap-4">

        {/* BHK */}
        <div className="text-[16px] font-medium text-[#333]">
          <div className="pd-bhk">{bhk}</div>
        </div>

        {/* RERA */}
        <div className="pd-rera text-[16px] font-semibold text-[#058374]">
          <span>Rera : </span>
          <i className="fa fa-check"></i> {rera}
        </div>

      </div>
    </div>
  );
};

export default NameArea;