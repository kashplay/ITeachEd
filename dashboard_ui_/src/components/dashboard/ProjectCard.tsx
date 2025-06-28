import React from 'react';

interface ProjectCardProps {
  projectNumber: string;
  title: string;
  description: string;
  image: string;
  onViewAll?: () => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  projectNumber,
  title,
  description,
  image,
  onViewAll,
  className = ""
}) => {
  return (
    <article className={`w-[396px] h-[353px] relative max-md:w-full ${className}`}>
      <img
        src={image}
        alt={`${title} project preview`}
        className="w-[396px] h-48 absolute rounded-[20px_20px_0_0] left-0 top-0 max-md:w-full object-cover"
      />
      
      <div className="absolute w-[376px] h-[142px] left-2.5 top-[212px] max-md:w-[calc(100%_-_20px)] max-sm:w-[calc(100%_-_16px)] max-sm:left-2 max-sm:top-[200px] bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-[0_0_20px_20px] p-4">
        <div className="text-[#A0AEC0] text-[10px] font-normal leading-[15px] mb-[15px]">
          {projectNumber}
        </div>
        
        <h3 className="text-white text-lg font-medium mb-[18px]">
          {title}
        </h3>
        
        <p className="text-[#A0AEC0] text-sm font-normal leading-[21px] mb-[17px] max-sm:text-xs max-sm:mb-[15px]">
          {description}
        </p>
        
        <button
          onClick={onViewAll}
          className="flex w-[118px] h-[35px] justify-center items-center border border-white rounded-xl transition-all duration-200 hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 max-sm:w-[100px] max-sm:h-8"
          aria-label={`View all details for ${title} project`}
        >
          <span className="text-white text-center text-[10px] font-bold leading-[15px] max-sm:text-[9px] hover:text-gray-900">
            VIEW ALL
          </span>
        </button>
      </div>
    </article>
  );
};
