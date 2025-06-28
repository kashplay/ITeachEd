import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { WelcomeCard } from '../components/dashboard/WelcomeCard';
import { GuildLevelCard } from '../components/dashboard/GuildLevelCard';
import { StatsCard } from '../components/dashboard/StatsCard';
import { TopicCard } from '../components/dashboard/TopicCard';
import { ProjectCard } from '../components/dashboard/ProjectCard';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
  };

  const handleContinueGoals = () => {
    console.log("Continue goals clicked");
  };

  const handleTopicClick = (topic: string) => {
    console.log("Topic clicked:", topic);
  };

  const handleProjectView = (project: string) => {
    console.log("View project:", project);
  };

  // Topic icons as JSX elements
  const platformIcon = (
    <div className="relative w-[71px] h-[65px]">
      <div className="absolute w-[63px] h-[65px] bg-[#FFAE2D] rounded-[5px] left-2 top-0" />
      <div className="absolute w-[67px] h-[65px] bg-[#5765F2] rounded-[5px] left-0 top-0" />
      <div className="absolute w-[55px] h-8 bg-white rounded-[5px] left-1.5 top-3" />
      <div className="absolute w-[55px] h-[5px] opacity-[0.48] bg-[#FDA10E] rounded-[5px] left-1.5 top-[47px]" />
      <div className="absolute w-[55px] h-[5px] opacity-[0.48] bg-[#FDA10E] rounded-[5px] left-1.5 top-[55px]" />
      <div className="absolute flex items-start gap-[3px] w-[18px] h-1 rounded-[5px] left-1.5 top-1">
        <div className="w-1 h-1 bg-[#2F2F2F] rounded-xl" />
        <div className="w-1 h-1 bg-[#2F2F2F] rounded-xl" />
        <div className="w-1 h-1 bg-[#2F2F2F] rounded-xl" />
      </div>
    </div>
  );

  const skillsIcon = (
    <svg width="72" height="66" viewBox="0 0 72 66" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[71px] h-[65px]">
      <rect x="6.625" y="2.8125" width="40" height="57" rx="3" fill="#FFAE2D"/>
      <rect x="3.625" y="2.8125" width="40" height="57" rx="3" fill="#5765F2"/>
      <rect x="14.625" y="44.8125" width="16" height="5" rx="2" fill="white"/>
      <path d="M50.079 16.3875C51.4829 14.9827 53.7739 15.0287 55.1202 16.4887C56.4666 17.9488 56.3272 20.236 54.8135 21.5217L34.6135 38.6789C33.6269 39.5169 32.1548 39.4271 31.2773 38.4755C30.3998 37.5239 30.4294 36.0494 31.3444 35.1338L50.079 16.3875Z" fill="#FFAE2D"/>
      <path d="M32.4745 33.9246C31.7152 33.5718 30.1578 34.7716 29.6571 35.2699L34.4701 39.8136C34.9459 39.5346 36.2204 38.4803 36.047 37.6612C35.8302 36.6373 33.4237 34.3655 32.4745 33.9246Z" fill="white"/>
      <path d="M22.7459 47.3499C23.0655 47.4355 25.926 44.4332 29.785 44.0968C34.6836 43.6698 37.2986 36.5167 30.8192 35.123C25.923 34.0698 22.4262 47.2642 22.7459 47.3499Z" fill="#2F2F2F"/>
      <circle cx="50.125" cy="49.3125" r="10.5" fill="#FFAE2D"/>
      <circle cx="48.125" cy="47.3125" r="7.5" fill="#5765F2"/>
      <circle cx="30.625" cy="10.8125" r="4" fill="white"/>
    </svg>
  );

  const logoIcon = (
    <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[71px] h-[65px]">
      <path d="M34.8857 8.85511C36.1591 8.50785 37.5185 8.68375 38.6616 9.3437L58.9902 21.0804C60.8466 22.1522 61.9902 24.133 61.9902 26.2766V48.3484C61.9902 50.492 60.8466 52.4728 58.9902 53.5446L38.8342 65.1816C37.5718 65.9105 36.0871 66.1548 34.6576 65.869L34.3799 65.8134C31.4946 65.2364 29.4536 62.6523 29.5605 59.7119L31.2428 13.449C31.3214 11.2857 32.7972 9.42465 34.8857 8.85511Z" fill="#FFAE2D"/>
      <path d="M30.875 2.04455C32.7314 0.972754 35.0186 0.972754 36.875 2.04455L59.4538 15.0804C61.3102 16.1522 62.4538 18.133 62.4538 20.2766V46.3484C62.4538 48.492 61.3102 50.4728 59.4538 51.5446L36.875 64.5805C35.0186 65.6522 32.7314 65.6522 30.875 64.5805L8.29616 51.5446C6.43976 50.4728 5.29616 48.492 5.29616 46.3484V20.2766C5.29616 18.133 6.43975 16.1522 8.29616 15.0804L30.875 2.04455Z" fill="#5765F2"/>
      <path d="M32.375 14.6426C33.3032 14.1067 34.4468 14.1067 35.375 14.6426L49.2939 22.6787C50.2219 23.2146 50.7939 24.2048 50.7939 25.2764V41.3486C50.7939 42.4202 50.2219 43.4104 49.2939 43.9463L35.375 51.9824C34.4468 52.5183 33.3032 52.5183 32.375 51.9824L18.4561 43.9463C17.5281 43.4104 16.9561 42.4202 16.9561 41.3486V25.2764C16.9561 24.2048 17.5281 23.2146 18.4561 22.6787L32.375 14.6426Z" stroke="white" strokeWidth="6"/>
      <path d="M31.2769 28.8125C32.8846 27.8843 34.8654 27.8843 36.4731 28.8125C38.0808 29.7407 39.0712 31.4561 39.0712 33.3125C39.0712 35.1689 38.0808 36.8843 36.4731 37.8125C34.8654 38.7407 32.8846 38.7407 31.2769 37.8125C29.6692 36.8843 28.6788 35.1689 28.6788 33.3125C28.6788 31.4561 29.6692 29.7407 31.2769 28.8125Z" fill="#2F2F2F"/>
    </svg>
  );

  const movieIcon = (
    <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[71px] h-[65px]">
      <path d="M50.1278 55.3125H55.625V60.8125H33.625C18.4368 60.8125 6.125 48.5007 6.125 33.3125C6.125 18.1243 18.4368 5.8125 33.625 5.8125C48.8133 5.8125 61.125 18.1243 61.125 33.3125C61.1285 37.5821 60.1364 41.7936 58.2273 45.6127C56.3183 49.4317 53.545 52.7529 50.1278 55.3125ZM33.625 27.8125C35.0837 27.8125 36.4826 27.233 37.5141 26.2016C38.5455 25.1701 39.125 23.7712 39.125 22.3125C39.125 20.8538 38.5455 19.4549 37.5141 18.4234C36.4826 17.392 35.0837 16.8125 33.625 16.8125C32.1663 16.8125 30.7674 17.392 29.7359 18.4234C28.7045 19.4549 28.125 20.8538 28.125 22.3125C28.125 23.7712 28.7045 25.1701 29.7359 26.2016C30.7674 27.233 32.1663 27.8125 33.625 27.8125ZM22.625 38.8125C24.0837 38.8125 25.4826 38.233 26.5141 37.2016C27.5455 36.1701 28.125 34.7712 28.125 33.3125C28.125 31.8538 27.5455 30.4549 26.5141 29.4234C25.4826 28.392 24.0837 27.8125 22.625 27.8125C21.1663 27.8125 19.7674 28.392 18.7359 29.4234C17.7045 30.4549 17.125 31.8538 17.125 33.3125C17.125 34.7712 17.7045 36.1701 18.7359 37.2016C19.7674 38.233 21.1663 38.8125 22.625 38.8125ZM44.625 38.8125C46.0837 38.8125 47.4826 38.233 48.5141 37.2016C49.5455 36.1701 50.125 34.7712 50.125 33.3125C50.125 31.8538 49.5455 30.4549 48.5141 29.4234C47.4826 28.392 46.0837 27.8125 44.625 27.8125C43.1663 27.8125 41.7674 28.392 40.7359 29.4234C39.7045 30.4549 39.125 31.8538 39.125 33.3125C39.125 34.7712 39.7045 36.1701 40.7359 37.2016C41.7674 38.233 43.1663 38.8125 44.625 38.8125ZM33.625 49.8125C35.0837 49.8125 36.4826 49.233 37.5141 48.2016C38.5455 47.1701 39.125 45.7712 39.125 44.3125C39.125 42.8538 38.5455 41.4549 37.5141 40.4234C36.4826 39.392 35.0837 38.8125 33.625 38.8125C32.1663 38.8125 30.7674 39.392 29.7359 40.4234C28.7045 41.4549 28.125 42.8538 28.125 44.3125C28.125 45.7712 28.7045 47.1701 29.7359 48.2016C30.7674 49.233 32.1663 49.8125 33.625 49.8125Z" fill="#5765F2"/>
      <path d="M34.625 60.8125C41.125 60.3125 46.625 57.8125 50.125 55.3125H55.625V60.8125H34.625Z" fill="#FFAE2D"/>
      <rect x="32.625" y="2.3125" width="25" height="25" rx="6" fill="white"/>
      <path d="M51.125 13.9465C51.7917 14.3314 51.7917 15.2936 51.125 15.6785L41.375 21.3077C40.7083 21.6926 39.875 21.2115 39.875 20.4417L39.875 9.18333C39.875 8.41353 40.7083 7.93241 41.375 8.31731L51.125 13.9465Z" fill="#5765F2"/>
    </svg>
  );

  const rankIcon = (
    <div className="w-[70px] h-[71px] relative">
      <div className="w-[70px] h-[71px] bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">TOP 50</span>
      </div>
    </div>
  );

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-900 max-md:flex-col">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto pl-[120px] pr-[127px] pt-[23px] pb-0 max-md:p-5 max-sm:p-4">
        <Header 
          onSearch={handleSearch}
          onNotificationClick={handleNotificationClick}
        />
        
        <div className="flex w-full flex-col items-start gap-[42px]">
          {/* Top Cards Section */}
          <section className="flex items-center gap-6 w-full max-md:flex-col max-md:gap-5">
            <WelcomeCard 
              userName="Mark Johnson"
              onContinueClick={handleContinueGoals}
            />
            
            <GuildLevelCard 
              xp={1245}
              growthPercentage={15}
            />
            
            <div className="grid gap-y-6 gap-x-6 flex-1 grid-rows-2 grid-cols-1 max-md:grid-cols-[repeat(2,1fr)] max-md:w-full max-sm:grid-cols-[1fr]">
              <StatsCard 
                title="Pathways completed"
                value={3}
              />
              
              <StatsCard 
                title="Total Hours of learning"
                value={1258}
              />
              
              <StatsCard 
                title="Guild rank"
                value={5428}
                growth="Top 50 percentile!"
                icon={rankIcon}
              />
              
              <StatsCard 
                title="Projects completed"
                value={121}
                growth="+55%"
              />
            </div>
          </section>
          
          {/* Topics Section */}
          <section className="flex flex-col items-start gap-[23px] w-full">
            <h2 className="text-white text-2xl font-semibold max-sm:text-xl">
              Begin with exploring these topics
            </h2>
            
            <div className="flex items-start gap-6 w-full max-md:flex-wrap max-md:gap-4 max-sm:flex-col">
              <TopicCard 
                title="How to use this platform"
                icon={platformIcon}
                onClick={() => handleTopicClick("platform")}
              />
              
              <TopicCard 
                title="Learn skills in your own way!"
                icon={skillsIcon}
                onClick={() => handleTopicClick("skills")}
              />
              
              <TopicCard 
                title="Logo Brand Identity"
                icon={logoIcon}
                onClick={() => handleTopicClick("logo")}
              />
              
              <TopicCard 
                title="Movie and Animation"
                icon={movieIcon}
                onClick={() => handleTopicClick("movie")}
              />
            </div>
          </section>
          
          {/* Projects Section */}
          <section className="w-full h-[485px] relative max-md:h-auto">
            <div className="w-full h-[485px] absolute left-0 top-0">
              <div className="w-full h-[485px] backdrop-blur-[60px] rounded-[20px] bg-white bg-opacity-10" />
            </div>
            
            <h2 className="text-white text-2xl font-semibold absolute w-[213px] h-7 left-[26px] top-7 max-sm:text-xl max-sm:left-4 max-sm:top-5">
              Start doing projects
            </h2>
            
            <div className="w-[1240px] h-[353px] absolute flex gap-[26px] left-[26px] top-[104px] max-md:w-full max-md:flex-col max-md:relative max-md:gap-5 max-md:left-0 max-md:top-[60px] max-sm:w-[calc(100%_-_32px)] max-sm:left-4 max-sm:top-[70px]">
              <ProjectCard 
                projectNumber="Project #1"
                title="Modern"
                description="As Uber works through a huge amount of internal management turmoil."
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/bbe38478653eeeeb2f7b1bc7aa968c23f2b02003?width=792"
                onViewAll={() => handleProjectView("Modern")}
              />
              
              <ProjectCard 
                projectNumber="Project #2"
                title="Scandinavian"
                description="Music is something that every person has his or her own specific opinion about."
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/2bb193bda10353acb786e2d3dc6706487c1b9b29?width=792"
                onViewAll={() => handleProjectView("Scandinavian")}
              />
              
              <ProjectCard 
                projectNumber="Project #3"
                title="Minimalist"
                description="Different people have different taste, and various types of music."
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/59c410c5f3ab22f412b56e221c47aee9ada68786?width=792"
                onViewAll={() => handleProjectView("Minimalist")}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
