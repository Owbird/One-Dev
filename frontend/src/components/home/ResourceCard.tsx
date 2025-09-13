import React from "react";

const ResourceCard = ({
  title,
  children,
  className,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) => (
  <div
    className={`bg-gray-900/70 backdrop-blur-sm border border-gray-700 p-4 rounded-lg shadow-lg flex flex-col gap-3 ${className}`}
  >
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-base font-semibold text-gray-200">{title}</h3>
    </div>
    {children}
  </div>
);

export default ResourceCard;
