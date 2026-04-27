import React, { useState, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const FALLBACK_THUMB =
  "https://via.placeholder.com/350x200?text=No+Thumbnail";

const FALLBACK_FULL =
  "https://via.placeholder.com/800x500?text=No+Image";

const ImageGallery = ({ project, images = [] }) => {
  /**
   * ✅ NORMALIZED IMAGE SOURCE (FIXED)
   * Handles:
   * - project.gallery_images (NEW API)
   * - project.galleryImages (ADAPTED API)
   * - images prop (fallback)
   */
  const gallerySource =
    project?.gallery_images ||
    project?.galleryImages ||
    images ||
    [];

  /**
   * ✅ NORMALIZE IMAGES (MEMOIZED FOR PERFORMANCE)
   */
  const galleryImages = useMemo(() => {
    if (!Array.isArray(gallerySource)) return [];

    return gallerySource.map((img, index) => {
      if (typeof img === "string") {
        return {
          thumb: img,
          full: img,
          alt: `Gallery Image ${index + 1}`,
        };
      }

      return {
        thumb: img?.thumb || img?.full || FALLBACK_THUMB,
        full: img?.full || img?.thumb || FALLBACK_FULL,
        alt: img?.alt || `Gallery Image ${index + 1}`,
      };
    });
  }, [gallerySource]);

  const totalImages = galleryImages.length;
  const hasMoreThanFour = totalImages > 4;

  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  /**
   * ✅ SAFE VISIBLE IMAGES
   */
  const visibleImages = showAll
    ? galleryImages
    : galleryImages.slice(0, 4);

  const isEmpty = totalImages === 0;

  return (
    <section
      className="pd-sec bsas border border-gray-300 p-4 mt-8 rounded-lg"
      id="pdImageGallery"
    >
      {/* Title */}
      <div className="pd-sec-title mb-3">
        <h2 className="text-xl font-semibold">
          Image Gallery Of This Project
        </h2>
      </div>

      {/* Images */}
      {!isEmpty ? (
        <>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {visibleImages.map((img, idx) => (
              <li key={idx} className="group">
                <div className="overflow-hidden rounded">
                  <img
                    src={img.thumb || FALLBACK_THUMB}
                    alt={img.alt}
                    className="w-full h-[220px] object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    loading="lazy"
                    onClick={() => setLightboxIndex(idx)}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* ✅ View More / Less */}
          {hasMoreThanFour && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="border border-primary text-primary hover:bg-primary hover:text-white rounded px-4 py-2 transition"
              >
                {showAll
                  ? "View Less"
                  : `View All (${totalImages})`}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-xs text-gray-500 italic mt-4">
          *No gallery images available for this project.
        </p>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex !== -1}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={galleryImages.map((img, i) => ({
          src: img.full || FALLBACK_FULL,
          thumbnail: img.thumb || img.full || FALLBACK_THUMB,
          title: img.alt || `Gallery Image ${i + 1}`,
        }))}
        plugins={[Thumbnails]}
        thumbnails={{
          position: "bottom",
          width: 100,
          height: 70,
          gap: 10,
          borderRadius: 4,
          padding: 4,
          imageFit: "cover",
        }}
      />
    </section>
  );
};

export default ImageGallery;