// PricingDetails.jsx
import React from "react";

const PricingDetails = ({ price }) => {

  return (
    <div className="w-full p-5 flex flex-col items-center">
      {/* Personalized report text */}
      <p className="text-black text-xl font-semibold text-center mt-1">
        Personalized report for <span className="text-mixed-400 ml-1">${price}</span>
      </p>

      {/* Total today section */}
      <div className="w-full mt-3 mb-2 flex justify-between items-center">
        <p className="text-black text-md font-medium text-left">
          Total today:
        </p>
        <p className="text-black text-md font-medium text-right">
          ${price}
        </p>
      </div>

      {/* Divider Line */}
      <hr className="w-full border-t-2 border-gray-300 mb-0" />

      {/* Cost per month section */}
      <div className="w-full mt-2 flex justify-between items-center">
        <p className="text-black text-sm font-medium text-left">
          Your cost per month <strong>after trial</strong>
        </p>
        <div className="text-right">
          <span className="text-gray-600 line-through text-sm mr-2">$60</span>
          <span className="text-black">$40</span>
        </div>
      </div>
    </div>
  );
};

export default PricingDetails;
