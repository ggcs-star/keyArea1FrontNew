import React, { useState, useRef } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PropertyImageSlider = ({ images = [], imageRera }) => {

  // ✅ SUPPORT BOTH FORMATS
  const imageUrls = images.map((item) =>
    typeof item === "string" ? item : item?.image
  );

  const mainImage = imageUrls[0];
  const thumbnails = imageUrls.slice(1, 3);
  const remainingCount = imageUrls.length - 3;

  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const splideRef = useRef(null);

  const openCarousel = (index) => {
    setStartIndex(index);
    setIsCarouselOpen(true);
  };

  const goPrev = () => {
    const splide = splideRef.current?.splide;
    if (splide) splide.go("<");
  };

  const goNext = () => {
    const splide = splideRef.current?.splide;
    if (splide) splide.go(">");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2 mb-4">

      {/* MAIN IMAGE */}
      <div className="w-full lg:w-[65%] relative">
        {mainImage && (
          <div
            className="relative cursor-pointer"
            onClick={() => openCarousel(0)}
          >
            <img
              src={mainImage}
              alt="Main"
              className="w-full h-[400px] object-cover rounded-lg shadow"
            />

            {imageRera && (
              <img
                src={imageRera}
                alt="Verified"
                className="absolute top-2 left-2 w-10 h-10 object-contain z-10"
              />
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <p className="opacity-20 text-white text-5xl font-semibold">
                KEY AREA 1
              </p>
            </div>
          </div>
        )}
      </div>

      {/* THUMBNAILS */}
      <div className="w-full lg:w-[35%] flex flex-col gap-2">
        {thumbnails.map((img, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer"
            onClick={() => openCarousel(idx + 1)}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx}`}
              className="w-full h-[195px] object-cover rounded-lg shadow"
            />

            {idx === 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                <span className="text-white text-2xl font-bold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FULLSCREEN */}
      {isCarouselOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

          <button
            onClick={() => setIsCarouselOpen(false)}
            className="text-white text-2xl absolute top-4 right-6 z-50"
          >
            ✕
          </button>

          <div className="relative w-full h-full">

            <Splide
              ref={splideRef}
              options={{
                type: "loop",
                start: startIndex,
                perPage: 3,
                focus: "center",
                gap: "1rem",
                pagination: true,
                arrows: false,
                autoWidth: true,
              }}
            >
              {imageUrls.map((src, idx) => (
                <SplideSlide key={idx}>
                  <img
                    src={src}
                    alt={`Slide ${idx}`}
                    className="h-[450px] object-cover rounded-lg"
                  />
                </SplideSlide>
              ))}
            </Splide>

            {/* ARROWS */}
            <button
              onClick={goPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full"
            >
              <FiChevronLeft />
            </button>

            <button
              onClick={goNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full"
            >
              <FiChevronRight />
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImageSlider;