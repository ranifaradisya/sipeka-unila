"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../../page.module.css";

type Props = {
  title: string;
  breadcrumb: string;
  unreadCount: number;
  onToggleNotif: () => void;
  lastUpdate?: string;
  onOpenMobileMenu?: () => void;
};

const USER = {
  ini:   "PS",
  name:  "Prof. Dr. Sukirman",
  role:  "Pimpinan",
  unit:  "Universitas Lampung",
  email: "sukirman@unila.ac.id",
};

export default function Topbar({ title, breadcrumb, unreadCount, onToggleNotif, onOpenMobileMenu }: Props) {
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className="sticky top-0 bg-white z-[200] flex items-stretch"
      style={{ height: 60, borderBottom: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      {/* Hamburger: only visible on small screens, opens the sidebar */}
      <button
        onClick={onOpenMobileMenu}
        aria-label="Buka menu"
        className={`${styles.mobileMenuBtn} items-center justify-center bg-transparent border-none cursor-pointer text-[#0F172A] px-[16px]`}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Main topbar content */}
      <div className="flex-1 flex items-center px-[22px] gap-[10px] min-w-0">
        <div className="text-[13px] font-bold text-[#0F172A] whitespace-nowrap truncate">{title}</div>
        <div className="w-px h-[14px] bg-[#E2E8F0] shrink-0 hidden sm:block" />
        <div className="text-[10.5px] text-[#94A3B8] whitespace-nowrap hidden sm:block">
          Beranda · <b className="text-[#0B5EA8] font-semibold">{breadcrumb}</b>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-[8px]">
          {/* Bell */}
          <button
            onClick={onToggleNotif}
            className={`${styles.noPrint} flex items-center justify-center cursor-pointer relative flex-shrink-0 
            bg-transparent border-none p-[6px] rounded-[8px] text-[#475569] transition-colors duration-[120ms] hover:text-[#0B5EA8] hover:bg-[#EEF5FC]`}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-[2px] right-[2px] min-w-[16px] h-[16px] bg-[#DC2626] text-white text-[8px] font-bold rounded-full flex items-center 
              justify-center px-[3px] border-[1.5px] border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile button */}
          <div ref={ddRef} className="relative">
            <button
              onClick={() => setDdOpen(o => !o)}
              className="flex items-center gap-[8px] px-[10px] py-[6px] rounded-[8px] cursor-pointer bg-transparent border border-[#E2E8F0] transition-colors duration-[120ms] hover:bg-[#F8FAFC]"
            >
              <div
                className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg,#0B5EA8,#073864)" }}
              >
                {USER.ini}
              </div>
              <div className="text-left leading-tight">
                <div className="text-[12px] font-bold text-[#0F172A]">{USER.name}</div>
                <div className="text-[9.5px] text-[#94A3B8]">{USER.role}</div>
              </div>
              <svg width="10" height="10" fill="none" stroke="#94A3B8" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown */}
            {ddOpen && (
              <div
                className="absolute right-0 top-[calc(100%+8px)] w-[280px] bg-white rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.14)] border border-[#E2E8F0] overflow-hidden z-[500]"
              >
                {/* User info */}
                <div className="px-[16px] pt-[16px] pb-[12px]">
                  <div className="text-[15px] font-bold text-[#0F172A]">{USER.name}</div>
                  <div className="text-[11px] text-[#94A3B8] mt-[2px]">{USER.email}</div>
                  <div className="mt-[10px] bg-[#EEF5FC] rounded-[8px] px-[12px] py-[8px] flex flex-col gap-[3px]">
                    <div className="flex items-center gap-[7px]">
                      <svg width="13" height="13" fill="none" stroke="#0B5EA8" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span className="text-[12px] font-semibold text-[#0B5EA8]">{USER.role}</span>
                    </div>
                    <div className="flex items-center gap-[7px]">
                      <svg width="13" height="13" fill="none" stroke="#64748B" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="text-[11px] text-[#64748B]">{USER.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#F1F5F9]" />

                {/* Menu items */}
                {[
                  { icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: "Profil Saya" },
                  { icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Portal Aplikasi" },
                  { icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, label: "Pengaturan" },
                ].map(item => (
                  <button key={item.label} className="w-full flex items-center gap-[12px] px-[16px] py-[11px] text-[13px] text-[#334155] cursor-pointer bg-transparent border-none hover:bg-[#F8FAFC] transition-colors duration-[100ms] text-left">
                    <span className="text-[#64748B]">{item.icon}</span>
                    {item.label}
                  </button>
                ))}

                <div className="border-t border-[#F1F5F9]" />

                {/* Logout */}
                <button className="w-full flex items-center gap-[12px] px-[16px] py-[11px] text-[13px] text-[#DC2626] cursor-pointer bg-transparent border-none hover:bg-[#FEF2F2] transition-colors duration-[100ms] text-left">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}