import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const FALLBACK_LOCALITY = {
  name: "Locality",
  growth: "N/A",
  growthPeriod: "Last 5 years",
  growth_percent: 0,
};

const PriceRange = ({ refProp, localityData = FALLBACK_LOCALITY, id }) => {
  const [priceGrowthData, setPriceGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiGrowthPercent, setApiGrowthPercent] = useState(0);

  /**
   * ✅ API COMPATIBLE LOCALITY NORMALIZATION
   */
  const safeLocality = {
    name:
      localityData?.name ||
      localityData?.city ||
      localityData?.area ||
      localityData?.address ||
      "Locality",

    growth: localityData?.growth || "N/A",
    growthPeriod: localityData?.growthPeriod || "Last 5 years",

    // API priority
    growth_percent:
      apiGrowthPercent ||
      localityData?.growth_percent ||
      0,
  };

  /**
   * ✅ FETCH PRICE PROJECTION (SLUG/ID SAFE)
   */
  useEffect(() => {
    const fetchPriceProjection = async () => {
      try {
        if (!id) return;

        const res = await fetch(
          `https://backend.keyarea1.com/api/v1/landing/projects/${id}/price-projection`
        );

        const data = await res.json();

        /**
         * ✅ SAFE API PARSING
         */
        const growthPercent = Number(data?.growth_percent) || 0;
        setApiGrowthPercent(growthPercent);

        if (data?.status && Array.isArray(data?.projection)) {
          const formatted = data.projection.map((item) => ({
            year: item?.label || "Year",
            price:
              typeof item?.price === "number"
                ? (item.price / 100000).toFixed(2)
                : 0,
            display: item?.display || "",
          }));

          setPriceGrowthData(formatted);
        } else {
          setPriceGrowthData([]);
        }
      } catch (err) {
        console.error("❌ Price Projection Error:", err);
        setPriceGrowthData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceProjection();
  }, [id]);

  const hasData =
    Array.isArray(priceGrowthData) && priceGrowthData.length > 0;

  return (
    <section
      className="scroll-mt-28 w-full max-w-full pd-sec bsas border border-gray-300 p-4 mt-8 rounded-lg"
      id="pdPriceRange"
      ref={refProp}
    >
      <div className="pd-sec-title mb-4">
        <h2 className="text-xl font-semibold">Year-wise Price Growth</h2>
      </div>

      {/* Chart */}
      <div className="pds-body">
        {loading ? (
          <p className="text-sm text-gray-500">Loading chart...</p>
        ) : hasData ? (
          <div className="w-full h-[350px]">
            <Line
              data={{
                labels: priceGrowthData.map((d) => d.year),
                datasets: [
                  {
                    label: "Price (Lac)",
                    data: priceGrowthData.map((d) => d.price),
                    borderColor: "#A44CEE",
                    backgroundColor: "rgba(164, 76, 238, 0.15)",
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `₹ ${value} Lac`,
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">
            *Price projection data is not available.
          </p>
        )}
      </div>

      {/* Locality Info */}
      <div className="w-fit border border-gray-200 p-4 mt-4 rounded-lg shadow-sm">
        <div className="text-sm font-semibold mb-2">
          {safeLocality.name}
        </div>

        <div className="flex justify-between gap-6 text-sm">
          {/* Growth Percent */}
          <div>
            <div className="text-black font-semibold">
              {safeLocality.growth_percent}%
            </div>
            <div className="text-gray-500 text-xs">
              Avg. Growth
            </div>
          </div>
        </div>
      </div>

      {!hasData && (
        <p className="text-xs text-gray-500 italic mt-4">
          *Sample price projection shown. Actual values may vary.
        </p>
      )}
    </section>
  );
};

export default PriceRange;