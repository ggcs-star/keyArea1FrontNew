import React, { useState, useEffect } from "react";
import { Container } from "../../../../components/Layout";
import { GradientText } from "../../../../components/Button/GradientText";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PrimaryBtn } from "../../../../components/Button";
import { get5BhkProperty } from "../../../../../api"; // ✅ API import
import ShimmerCard from "../../../../components/ShimmerCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom slider arrows
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 md:-translate-x-1/2 bg-gray-500 text-white bg-opacity-70 hover:bg-opacity-100 hover:bg-white hover:text-gray-500 rounded-full p-2 shadow-md transition duration-200 ease-in-out z-10 focus:outline-none"
    aria-label="Previous project"
  >
    <ChevronLeft size={28} />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 md:translate-x-1/2 bg-gray-500 text-white bg-opacity-70 hover:bg-opacity-100 hover:bg-white hover:text-gray-500 rounded-full p-2 shadow-md transition duration-200 ease-in-out z-10 focus:outline-none"
    aria-label="Next project"
  >
    <ChevronRight size={28} />
  </button>
);

const FiveBHK = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleProjectClick = (slug) => {
    navigate(`/five-bhk-detail/${slug}`);
  };

  const handleClick = () => {
    console.log('Navigating to /five-bhk');
    navigate("/five-bhk");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await get5BhkProperty();
        console.log("5BHK API Response:", response);
        
        // Handle the API response structure - data is directly in response.data
        let projectsData = [];
        if (response.data && Array.isArray(response.data)) {
          projectsData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          projectsData = response.data.data;
        } else if (response.data && response.data.data) {
          projectsData = response.data.data;
        }
        
        console.log("Processed projects data:", projectsData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching 5BHK projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const settings = {
    dots: false,
    infinite: projects.length > 5,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    vertical: false,
    verticalSwiping: false,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <section className="bg-white">
      <Container>
        <div className="flex justify-between text-center lg:text-start mb-4">
          <GradientText>5 BHK Properties in Ahmedabad</GradientText>
          <PrimaryBtn className="hidden lg:flex" onClick={handleClick}>View All</PrimaryBtn>
        </div>

        <div className="relative my-4">
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array(5).fill(null).map((_, index) => (
                <div key={index} className="px-2 py-8 min-w-[250px]">
                  <ShimmerCard />
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <Slider {...settings}>
              {projects.map((project) => (
                <div key={project.slug} className="px-2 py-8">
                  <div
                    className="group cursor-pointer transform transition-all duration-300 h-full"
                    onClick={() => handleProjectClick(project.slug)}
                  >
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100 hover:border-blue-200">
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={
                            project.cover_image_url ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="block">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                            {project.city}, {project.area}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1 line-clamp-1">
                            {project.project_type}
                          </p>
                          <p className="text-sm font-semibold text-primary group-hover:text-primary-dark transition-colors duration-300">
                            {project.price}
                          </p>
                          <p className="text-xs text-gray-500">
                            {project.carpet_area}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No properties found</p>
            </div>
          )}

          {projects.length > 0 && (
            <div className="flex justify-center mt-6">
              <PrimaryBtn className="flex lg:hidden justify-center" onClick={handleClick}>
                View All
              </PrimaryBtn>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default FiveBHK;