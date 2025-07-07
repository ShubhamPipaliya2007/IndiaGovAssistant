import React from "react";
import { Globe } from "lucide-react";

const GovBanner: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="bg-[#000080] text-white py-1 px-4 text-xs">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-4">
          <span>{formattedDate}</span>
          <span>|</span>
          <a href="#" className="hover:underline">Screen Reader Access</a>
          <span>|</span>
          <a href="#" className="hover:underline">A- A A+</a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Globe className="h-3 w-3 mr-1" />
            <select className="bg-transparent text-white text-xs border-0 focus:ring-0 py-0">
              <option value="en" className="text-black">English</option>
              <option value="hi" className="text-black">हिंदी</option>
              <option value="ta" className="text-black">தமிழ்</option>
              <option value="te" className="text-black">తెలుగు</option>
              <option value="bn" className="text-black">বাংলা</option>
            </select>
          </div>
          <span>|</span>
          <a href="#" className="hover:underline">Site Map</a>
          <span>|</span>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default GovBanner;