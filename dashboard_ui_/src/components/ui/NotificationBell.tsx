import React, { useState } from 'react';
import { Bell } from 'lucide-react';

interface NotificationBellProps {
  hasNotifications?: boolean;
  notificationCount?: number;
  onClick?: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  hasNotifications = false,
  notificationCount = 0,
  onClick
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center justify-center p-3 border shadow-[0px_4px_40px_0px_rgba(136,122,166,0.08)] rounded-xl border-solid border-[#3C423D] transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 max-sm:p-2.5 ${
        isPressed ? 'scale-95' : ''
      }`}
      aria-label={`Notifications${hasNotifications ? ` (${notificationCount} new)` : ''}`}
    >
      <Bell className="w-6 h-6 text-white" />
      {hasNotifications && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
          <span className="sr-only">{notificationCount} new notifications</span>
        </span>
      )}
    </button>
  );
};
