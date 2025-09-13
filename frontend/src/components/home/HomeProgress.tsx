import { FC } from "react";

interface StatProgressBar {
  colorScheme: string;
  value: number;
}

const StatProgressBar: FC<StatProgressBar> = ({ colorScheme, value }) => {
  // Map Chakra color schemes to Tailwind colors
  const getColorClass = (scheme: string) => {
    switch (scheme) {
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      case "red":
        return "bg-red-500";
      case "yellow":
        return "bg-yellow-500";
      case "purple":
        return "bg-purple-500";
      case "pink":
        return "bg-pink-500";
      case "teal":
        return "bg-teal-500";
      case "orange":
        return "bg-orange-500";
      case "cyan":
        return "bg-cyan-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="w-[100px] h-8 bg-gray-200 rounded-md overflow-hidden">
      <div
        className={`h-full transition-all duration-900 ease-out ${getColorClass(colorScheme)}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
};

export default StatProgressBar;
