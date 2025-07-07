import React from "react";
import InitiativeCard from "./InitiativeCard";
import { initiatives } from "@/data/initiatives";
import { resources } from "@/data/resources";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const InfoSection: React.FC = () => {
  return (
    <section className="w-full md:w-1/3 lg:w-1/4 order-2 md:order-1">
      <div className="sticky top-20">
        <Card className="mb-6 border-2 border-[#000080]/20">
          <CardContent className="p-4">
            <h2 className="font-['Poppins'] font-semibold text-lg mb-4 text-[#000080] border-b-2 border-[#FF9933] pb-2">
              Popular E-Governance Initiatives
            </h2>

            {initiatives.map((initiative, index) => (
              <InitiativeCard
                key={index}
                icon={initiative.icon}
                title={initiative.title}
                description={initiative.description}
                color={initiative.color}
                isLast={index === initiatives.length - 1}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="border-2 border-[#000080]/20">
          <CardContent className="p-4">
            <h2 className="font-['Poppins'] font-semibold text-lg mb-4 text-[#000080] border-b-2 border-[#FF9933] pb-2">
              Useful Resources
            </h2>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-[#FF9933] transition-colors"
                  >
                    <ExternalLink className="mr-2 h-4 w-4 text-gray-400" />
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InfoSection;
