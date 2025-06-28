import React from 'react';
import { ArrowRight } from 'lucide-react';

interface WelcomeCardProps {
  userName?: string;
  backgroundImage?: string;
  onContinueClick?: () => void;
  className?: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  userName = "Mark Johnson",
  backgroundImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/b1669f09468ec08b605e706238342a73629dbc92?width=598",
  onContinueClick,
  className = ""
}) => {
  return (
    <article className={`w-[299px] h-[306px] relative max-md:w-full max-md:max-w-[400px] max-sm:h-[280px] ${className}`}>
      <div 
        className="w-[299px] h-[306px] absolute rounded-[20px] left-0 top-0 max-md:w-full max-sm:h-[280px] bg-gradient-to-br from-purple-600 to-blue-600"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        role="img"
        aria-label="Welcome card background"
      />
      
      <div className="w-[250px] h-[53px] absolute left-4 top-6">
        <div className="flex w-[250px] flex-col items-start gap-[9px]">
          <h2 className="text-white text-2xl font-medium max-sm:text-xl">
            Welcome back!
          </h2>
          <p className="text-white text-sm font-normal max-sm:text-xs">
            Nice to see you, {userName}!
          </p>
        </div>
      </div>
      
      <button
        onClick={onContinueClick}
        className="flex w-[21px] justify-between items-center absolute h-[41px] px-0 py-2.5 left-[15px] top-[250px] group transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label="Continue your goals"
      >
        <span className="text-white text-lg font-medium absolute left-[181px] top-2.5 max-sm:text-base group-hover:translate-x-1 transition-transform duration-200">
          Continue your goals
        </span>
        <ArrowRight className="w-[21px] h-[21px] text-white group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </article>
  );
};
