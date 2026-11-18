import React from 'react';
import { Compass, MessageSquare, Newspaper, UserCircle2 } from 'lucide-react';
import { NavTab } from '../../types/union';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadChatCount?: number;
}

const NAV_ITEMS: { id: NavTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'feed', label: 'Bảng tin', Icon: Newspaper },
  { id: 'discover', label: 'Khám phá', Icon: Compass },
  { id: 'messages', label: 'Tin nhắn', Icon: MessageSquare },
  { id: 'profile', label: 'Cá nhân', Icon: UserCircle2 },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadChatCount = 0,
}) => {
  return (
    <nav
      aria-label="Điều hướng di động"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8EAF1] px-2 pt-1.5 pb-2.5"
    >
      <div className="grid grid-cols-4 gap-1">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative min-h-[48px] flex flex-col items-center justify-center rounded-2xl transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#6C63FF] ${
                isActive
                  ? 'text-[#6C63FF] bg-[#6C63FF]/8'
                  : 'text-[#747B91] hover:text-[#20243A] hover:bg-[#F8F9FC]'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {id === 'messages' && unreadChatCount > 0 && (
                  <span
                    aria-label={`${unreadChatCount} tin nhắn mới`}
                    className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF6B81] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums"
                  >
                    {unreadChatCount}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[11px] font-medium leading-none whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
