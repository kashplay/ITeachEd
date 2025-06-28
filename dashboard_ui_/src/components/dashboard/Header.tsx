import React from 'react';
import { SearchBar } from '../ui/SearchBar';
import { NotificationBell } from '../ui/NotificationBell';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onNotificationClick,
  className = ""
}) => {
  return (
    <header className={`flex w-full flex-col items-end gap-[59px] h-12 mb-[72px] max-md:mb-10 max-sm:mb-[30px] ${className}`}>
      <div className="flex items-start gap-3 max-md:flex-col max-md:gap-4 max-md:w-full">
        <SearchBar
          placeholder="Search.."
          onSearch={onSearch}
          className="w-[360px] max-md:w-full"
        />
        <NotificationBell
          hasNotifications={true}
          notificationCount={3}
          onClick={onNotificationClick}
        />
      </div>
    </header>
  );
};
