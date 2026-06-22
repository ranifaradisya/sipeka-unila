"use client";

import { useEffect, useRef } from "react";
import styles from "../../page.module.css";
import type { Notif } from "../data";

type Props = {
  open: boolean;
  tab: "all" | "unread" | "alert";
  notifs: Notif[];
  unreadCount: number;
  onSetTab: (tab: "all" | "unread" | "alert") => void;
  onReadNotif: (id: number) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
};

const ICON_BG: Record<Notif["t"], string> = {
  d: "bg-red-100",
  w: "bg-amber-100",
  b: "bg-blue-100",
  g: "bg-green-100",
};

export default function NotifPanel({ open, notifs, unreadCount, onReadNotif, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          !(e.target as HTMLElement).closest("header")) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const preview = notifs.slice(0, 5);

  return (
    <div
      ref={panelRef}
      className={`fixed right-[14px] w-[300px] bg-white border border-[#E2E8F0] rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.14)] 
        z-[500] overflow-hidden ${styles.notifPanel} ${open ? styles.notifPanelOpen : ""}`}
      style={{ top: 66 }}
    >
      <div className="px-[14px] py-[12px] flex items-center justify-between border-b border-[#F1F5F9]">
        <span className="text-[13.5px] font-bold text-[#0F172A]">Notifikasi</span>
        <span className={`text-[10px] font-bold px-[8px] py-[2px] rounded-full ${unreadCount > 0 ? "bg-[#DC2626] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
          {unreadCount > 0 ? `${unreadCount} Baru` : "0 Baru"}
        </span>
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {preview.length === 0 ? (
          <div className="px-[14px] py-[20px] text-center text-[11.5px] text-[#94A3B8]">
            Tidak ada notifikasi
          </div>
        ) : (
          preview.map(n => (
            <div
              key={n.id}
              onClick={() => onReadNotif(n.id)}
              className={`flex gap-[10px] px-[14px] py-[11px] border-b border-[#F8FAFC] cursor-pointer transition-colors duration-100 hover:bg-[#F8FAFC] relative ${
                n.unread ? "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#0B5EA8] before:rounded-r" : ""
              }`}
            >
              <div className={`w-[34px] h-[34px] rounded-[8px] flex items-center justify-center flex-shrink-0 text-[15px] ${ICON_BG[n.t]}`}>
                {n.ic}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11.5px] font-semibold text-[#0F172A] leading-snug">{n.title}</div>
                <div className="text-[10px] text-[#64748B] mt-[2px] leading-[1.4] line-clamp-2">{n.body}</div>
                <div className="text-[9px] text-[#94A3B8] mt-[3px]">🕐 {n.time}</div>
              </div>
              {n.unread && (
                <div className="w-[6px] h-[6px] rounded-full bg-[#0B5EA8] flex-shrink-0 mt-[5px]" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="px-[14px] py-[10px] text-center border-t border-[#F1F5F9]">
        <button className="text-[11.5px] font-semibold text-[#0B5EA8] cursor-pointer bg-transparent border-none hover:underline">
          Lihat Semua Notifikasi
        </button>
      </div>
    </div>
  );
}