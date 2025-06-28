import React from 'react';

interface TopicCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  title,
  icon,
  onClick,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex justify-center items-center gap-6 flex-1 backdrop-blur-[60px] p-4 rounded-[20px] transition-all duration-200 hover:scale-105 hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 max-md:flex-[1_1_calc(50%_-_8px)] max-md:min-w-[250px] max-sm:flex-none max-sm:w-full max-sm:p-3 bg-white bg-opacity-10 ${className}`}
    >
      <div className="w-[71px] h-[65px] flex-shrink-0">
        {icon}
      </div>
      <h3 className="text-white text-lg font-medium leading-6 max-sm:text-base">
        {title}
      </h3>
    </button>
  );
};
