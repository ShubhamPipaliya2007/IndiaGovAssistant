import React from "react";
import { 
  CreditCard, 
  Landmark, 
  Wallet, 
  HandCoins, 
  IdCard 
} from "lucide-react";

export const initiatives = [
  {
    icon: <IdCard className="h-5 w-5" />,
    title: "Aadhaar",
    description: "Unique identification for residents",
    color: "bg-[#FF9933]/10 text-[#FF9933]",
  },
  {
    icon: <Wallet className="h-5 w-5" />,
    title: "DigiLocker",
    description: "Digital document wallet",
    color: "bg-[#138808]/10 text-[#138808]",
  },
  {
    icon: <HandCoins className="h-5 w-5" />,
    title: "UMANG",
    description: "Unified mobile application",
    color: "bg-[#000080]/10 text-[#000080]",
  },
  {
    icon: <Landmark className="h-5 w-5" />,
    title: "MyGov",
    description: "Citizen engagement platform",
    color: "bg-[#FF9933]/10 text-[#FF9933]",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: "BHIM",
    description: "Digital payment application",
    color: "bg-[#138808]/10 text-[#138808]",
  },
];
