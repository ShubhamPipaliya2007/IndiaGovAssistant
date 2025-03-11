import React from "react";

interface InitiativeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  isLast?: boolean;
}

const InitiativeCard: React.FC<InitiativeCardProps> = ({
  icon,
  title,
  description,
  color,
  isLast = false,
}) => {
  return (
    <div className={`mb-4 ${!isLast ? "border-b border-gray-100 pb-3" : "mb-0"}`}>
      <div className="flex items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
        <div className="ml-3">
          <h3 className="font-['Poppins'] font-medium text-sm">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InitiativeCard;
