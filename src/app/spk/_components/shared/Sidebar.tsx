'use client';

import styles from '../../page.module.css';
import { spkMenuConfig } from '../../config/menuConfig';
import type { SpkMenuItem } from '../../config/menuConfig';

interface Props {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  lastUpdate: string;
  onLogout: () => void;
  role?: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeSection, onNavigate, lastUpdate, onLogout, role, mobileOpen, onCloseMobile,
}: Props) {
  const visibleItems: SpkMenuItem[] = role
    ? spkMenuConfig.filter(item => item.roles?.includes(role))
    : spkMenuConfig;

  return (
    <>
      <div
        className={`${styles.sidebarOverlay} ${mobileOpen ? styles.sidebarOverlayOpen : ''}`}
        onClick={onCloseMobile}
      />
      <aside
        className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''} w-[252px] min-w-[252px] bg-white border-r border-[#E2E8F0] 
        flex flex-col fixed top-0 left-0 bottom-0 z-[300] overflow-y-auto`}
      >
      
      <div className="w-full py-[16px] pb-[14px] border-b border-[#F1F5F9] flex justify-center items-center relative">
        <span className="text-[26px] font-extrabold leading-none tracking-[-0.5px]">
          <span style={{ color: '#073864' }}>SIPEKA</span>{' '}
          <span style={{ color: '#0B5EA8' }}>myUnila</span>
        </span>
       
        <button
          onClick={onCloseMobile}
          aria-label="Tutup menu"
          className="md:hidden absolute right-[14px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#64748B] p-[4px]"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 py-2 pt-[8px]">
        {visibleItems.map((item) => {
          const isActive = activeSection === item.href;
          return (
            <div key={item.href}>
              {item.group && (
                <div className="px-[18px] pt-[14px] pb-[5px] text-[9px] font-bold text-[#94A3B8] uppercase tracking-[1.2px]">
                  {item.group}
                </div>
              )}
              <button
                onClick={() => { onNavigate(item.href); onCloseMobile?.(); }}
                className={`flex items-center gap-[9px] px-[11px] py-2 rounded-[8px] my-[1px] mx-[7px] 
                  text-[12px] font-medium cursor-pointer transition-all duration-[130ms] whitespace-nowrap select-none relative 
                  border-none w-[calc(100%-14px)] text-left 
                  ${ isActive
                    ? `${styles.nbItemActive}`
                    : 'bg-transparent text-[#475569] hover:bg-[#EEF5FC] hover:text-[#0B5EA8]'
                }`}
              >
                <span className="shrink-0 text-current">{item.icon}</span>
                <span className="flex-1 truncate">{item.title}</span>
                {item.badge != null && (
                  <span className={`ml-auto text-[9px] font-bold text-white px-[6px] py-[1px] rounded-[20px] bg-[#DC2626] ${styles.animBlink}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto px-[12px] py-[10px] border-t border-[#F1F5F9]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-[8px] px-[12px] py-[9px] rounded-[8px] 
          cursor-pointer bg-transparent border-none text-[#475569] text-[12px] font-medium transition-colors duration-[120ms] hover:bg-[#EEF5FC] hover:text-[#0B5EA8]"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Kembali ke Portal
        </button>
      </div>
      </aside>
    </>
  );
}