import React from 'react';

interface GuildLevelCardProps {
  xp?: number;
  growthPercentage?: number;
  badgeImage?: string;
  className?: string;
}

export const GuildLevelCard: React.FC<GuildLevelCardProps> = ({
  xp = 1245,
  growthPercentage = 15,
  badgeImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/e4d18bcc0387e42cd37a9e12d5d5f166c467fd3a?width=268",
  className = ""
}) => {
  return (
    <article className={`w-[306px] h-[305px] relative max-md:w-full max-md:max-w-[400px] max-sm:h-[280px] ${className}`}>
      <div className="w-[306px] h-[305px] backdrop-blur-[60px] absolute rounded-[20px] left-0 top-0 max-md:w-full max-sm:h-[280px] bg-white bg-opacity-10" />
      
      <h2 className="w-[119px] h-7 text-white text-2xl font-semibold absolute left-4 top-5 max-sm:text-xl">
        Guild Level
      </h2>
      
      <div className="flex w-[134px] h-[134px] justify-center items-center absolute left-[86px] top-[67px] max-sm:w-[100px] max-sm:h-[100px] max-sm:-translate-x-2/4 max-sm:left-2/4 max-sm:top-[50px]">
        <div 
          className="w-[134px] h-[134px] max-sm:w-[100px] max-sm:h-[100px] bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
          style={{
            backgroundImage: `url(${badgeImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          role="img"
          aria-label="Guild level badge"
        >
          <span className="text-white font-bold text-lg">ROOKIE</span>
        </div>
      </div>
      
      <div className="flex w-[210px] flex-col items-center absolute h-[76px] left-12 top-[216px] max-sm:-translate-x-2/4 max-sm:left-2/4 max-sm:top-[180px]">
        <div className="text-white text-center text-2xl font-medium max-sm:text-xl">
          {xp.toLocaleString()} XP
        </div>
        <div className="flex flex-col justify-center items-start gap-2 self-stretch p-2.5">
          <div className="text-[#01B574] text-2xl font-semibold max-sm:text-xl">
            +{growthPercentage}%
          </div>
          <div className="text-white text-sm font-normal">
            since last month
          </div>
        </div>
      </div>
    </article>
  );
};
