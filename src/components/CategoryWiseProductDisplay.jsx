import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]); // ✅ ALWAYS ARRAY
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();

  const subCategoryData = useSelector(
    (state) => state.product.allSubCategory || [] // ✅ SAFE DEFAULT
  );

  const loadingCardNumber = new Array(6).fill(null);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id },
      });

      const responseData = response?.data;

      // ✅ HARD SAFETY CHECK
      if (responseData?.success && Array.isArray(responseData.data)) {
        setData(responseData.data);
      } else {
        setData([]);
      }
    } catch (error) {
      AxiosToastError(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED DEPENDENCY
  useEffect(() => {
    if (id) {
      fetchCategoryWiseProduct();
    }
  }, [id]);

  const handleScrollRight = () => {
    if (containerRef.current) containerRef.current.scrollLeft += 200;
  };

  const handleScrollLeft = () => {
    if (containerRef.current) containerRef.current.scrollLeft -= 200;
  };

  // ✅ SAFE URL BUILDER
  const redirectURL = (() => {
    if (!subCategoryData.length) return "#";

    const subcategory = subCategoryData.find((sub) =>
      sub.category?.some((c) => c._id === id)
    );

    if (!subcategory) return "#";

    return `/${valideURLConvert(name)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;
  })();

  // ✅ NOTHING TO RENDER
  if (!loading && data.length === 0) return null;

  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
        {redirectURL !== "#" && (
          <Link to={redirectURL} className="text-green-600 hover:text-green-400">
            See All
          </Link>
        )}
      </div>

      <div className="relative flex items-center">
        <div
          ref={containerRef}
          className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth"
        >
          {loading &&
            loadingCardNumber.map((_, index) => (
              <CardLoading key={index} />
            ))}

          {!loading &&
            data.map((p, index) => (
              <CardProduct
                data={p}
                key={p._id + "CategorywiseProductDisplay" + index}
              />
            ))}
        </div>

        <div className="w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between">
          <button
            onClick={handleScrollLeft}
            className="bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className="bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
