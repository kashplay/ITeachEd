import React from 'react';
import { Home, BarChart3, FileText, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  { icon: Home, label: 'Dashboard', isActive: true },
  { icon: BarChart3, label: 'Analytics', isActive: false },
  { icon: FileText, label: 'Documents', isActive: false },
  { icon: Settings, label: 'Settings', isActive: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  return (
    <nav 
      className={`flex w-[88px] h-[964px] flex-col justify-between items-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),24px_0px_80px_0px_rgba(49,79,124,0.02)] px-3 py-8 border-r-[#323232] border-r border-solid max-md:w-full max-md:h-auto max-md:flex-row max-md:justify-between max-md:p-4 max-sm:p-3 ${className}`}
      aria-label="Main navigation"
    >
      <div className="flex flex-col items-center gap-6 max-md:flex-row max-md:gap-4 max-sm:gap-3">
        {/* Logo */}
        <div className="w-10 h-10" role="img" aria-label="Company logo">
          <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
            <path d="M29 8.58193C20.2685 21.2343 23.6987 30.5995 26.5053 33.7006C15.2788 24.7695 19.3331 9.51225 22.7635 3C26.0066 4.24043 28.2725 7.23813 29 8.58193Z" fill="#6244FF"/>
            <path d="M9.04334 17.8851C12.2865 30.2894 21.8284 34.8377 26.194 35.5612C11.9738 38.5383 2.80623 25.6378 0 18.8155C4.73996 17.0789 8.00388 17.4717 9.04334 17.8851Z" fill="#6244FF"/>
            <text fill="white" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="'Righteous-Regular', Helvetical" fontSize="44" letterSpacing="0em">
              <tspan x="25" y="38.0166">e</tspan>
            </text>
            <path d="M17.7408 11.4112C15.745 25.5521 22.1065 32.6018 25.5368 34.3591C11.8153 31.134 8.80157 15.4426 9.00986 8C13.9993 8.49617 16.9094 10.4809 17.7408 11.4112Z" fill="#FFAE2D"/>
          </svg>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-[#303C33]" />

        {/* Navigation Items */}
        <div className="flex flex-col items-center gap-6 max-md:flex-row max-md:gap-4 max-sm:gap-3">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              className={`flex w-12 h-12 justify-center items-center gap-1 rounded-[999px] transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 max-sm:w-10 max-sm:h-10 max-sm:p-2 ${
                item.isActive 
                  ? 'shadow-[0px_4px_25px_0px_rgba(134,123,255,0.22)] bg-[#5765F2]' 
                  : 'hover:bg-[#5765F2] hover:bg-opacity-50'
              }`}
              aria-label={item.label}
              aria-current={item.isActive ? 'page' : undefined}
            >
              <item.icon className="w-6 h-6 text-white" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        className="flex items-center justify-center w-12 h-12 transition-all duration-200 hover:scale-110 hover:bg-red-500 hover:bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label="Logout"
      >
        <LogOut className="w-6 h-6 text-white" />
      </button>
    </nav>
  );
};
