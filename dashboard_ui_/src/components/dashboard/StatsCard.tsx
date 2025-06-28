import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  growth?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  growth,
  icon,
  className = ""
}) => {
  return (
    <article className={`flex justify-center items-center flex-1 relative ${className}`}>
      <div className="w-[307px] h-[141px] backdrop-blur-[60px] absolute rounded-[20px] left-0 top-0 max-md:w-full max-sm:h-[120px] bg-white bg-opacity-10" />
      
      <div className="w-36 h-[73px] absolute left-[17px] top-5 max-sm:w-[calc(100%_-_34px)]">
        <h3 className="text-[#A0AEC0] text-sm font-normal mb-[15px] max-sm:text-xs">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-white text-2xl font-medium max-sm:text-xl">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {growth && (
            <span className="text-[#01B574] text-sm font-bold max-sm:text-xs">
              {growth}
            </span>
          )}
        </div>
        {icon && (
          <div className="absolute right-0 top-0">
            {icon}
          </div>
        )}
      </div>
    </article>
  );
};
