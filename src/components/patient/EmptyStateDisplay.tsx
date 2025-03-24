
import React from "react";
import { FileText } from "lucide-react";

interface EmptyStateDisplayProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyStateDisplay: React.FC<EmptyStateDisplayProps> = ({
  icon = <FileText className="h-12 w-12 text-gray-400 mb-3" />,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
      {icon}
      <h3 className="text-lg font-medium text-gray-600">{title}</h3>
      <p className="text-gray-500 mt-1">{description}</p>
    </div>
  );
};
