"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  title: string;
  desc: string;
  onClose: () => void;
  onExport: (format: "excel" | "pdf" | "csv", year: string, sem: string) => void;
};

const FORMATS: Array<{
  key: "excel" | "pdf" | "csv";
  icon: string;
  iconBg: string;
  title: string;
  desc: string;
}> = [
  {
    key: "excel",
    icon: "📊",
    iconBg: "bg-[#E8F5E9]",
    title: "Microsoft Excel (.xlsx)",
    desc: "Tabel + grafik terintegrasi",
  },
  {
    key: "pdf",
    icon: "📄",
    iconBg: "bg-[#FCE4EC]",
    title: "PDF Document (.pdf)",
    desc: "Format resmi, siap cetak",
  },
  {
    key: "csv",
    icon: "📋",
    iconBg: "bg-[var(--info-bg)]",
    title: "CSV (.csv)",
    desc: "Untuk analisis lanjutan",
  },
];

export default function ExportModal({ open, title, desc, onClose, onExport }: Props) {
  const [year, setYear] = useState("2025/2026");
  const [sem, setSem] = useState("Genap");

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className={`fixed inset-0 bg-black/[0.48] z-[700] items-center justify-center p-5 backdrop-blur-[3px] ${
        open ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white rounded-[14px] max-w-[360px] w-full max-h-[92vh] overflow-y-auto 
      shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <div className="flex items-start gap-3 px-[18px] pt-[15px] pb-3 border-b border-[var(--gray-100)]">
          <div className="flex-1">
            <div className="text-sm font-bold text-[var(--gray-900)]">
              Ekspor: {title}
            </div>
            <div className="text-[10.5px] text-[var(--gray-400)] mt-[2px]">{desc}</div>
          </div>
          <div
            onClick={onClose}
            className="cursor-pointer text-sm text-[var(--gray-400)] px-[5px] py-[2px] rounded-[5px] 
            hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)]"
          >
            ✕
          </div>
        </div>
        <div className="px-[18px] py-[13px]">
          <div className="flex items-center gap-2 mb-[10px]">
            <span className="text-[11.5px] text-[var(--gray-600)] font-medium">
              Tahun Ajaran:
            </span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="pl-[10px] pr-[26px] py-[5px] border-[1.5px] border-[var(--gray-200)] rounded-[6px] text-[11px] text-[var(--gray-700)] bg-white outline-none cursor-pointer focus:border-[var(--myunila)] appearance-none"
              style={{ fontFamily: "'Poppins',sans-serif", 
                backgroundImage: 
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", 
                backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: "10px" }}
            >
              <option>2025/2026</option>
              <option>2024/2025</option>
              <option>2023/2024</option>
            </select>
            <select
              value={sem}
              onChange={(e) => setSem(e.target.value)}
              className="pl-[10px] pr-[26px] py-[5px] border-[1.5px] border-[var(--gray-200)] rounded-[6px] text-[11px] text-[var(--gray-700)] bg-white outline-none cursor-pointer focus:border-[var(--myunila)] appearance-none"
              style={{ fontFamily: "'Poppins',sans-serif", 
                backgroundImage: 
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", 
                backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: "10px" }}
            >
              <option>Genap</option>
              <option>Ganjil</option>
            </select>
          </div>
          {FORMATS.map((f) => (
            <div
              key={f.key}
              onClick={() => onExport(f.key, year, sem)}
              className="flex items-center gap-[10px] px-3 py-[10px] rounded-[7px] border-[1.5px] border-[var(--gray-200)] cursor-pointer transition-all duration-[120ms] mb-[7px] hover:border-[var(--myunila)] hover:bg-[var(--myunila-50)]"
            >
              <div
                className={`w-[34px] h-[34px] rounded-[8px] flex items-center justify-center text-[17px] flex-shrink-0 ${f.iconBg}`}
              >
                {f.icon}
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--gray-900)]">{f.title}</div>
                <div className="text-[10.5px] text-[var(--gray-400)] mt-[1px]">{f.desc}</div>
              </div>
            </div>
          ))}
          <div className="bg-[var(--myunila-50)] border border-[var(--myunila-100)] rounded-[6px] px-[10px] py-2 text-[11px] text-[var(--myunila-700)]">
            📌 Ekspor sesuai filter aktif. Grafik disertakan pada Excel &amp; PDF.
          </div>
        </div>
        <div className="px-5 pt-[11px] pb-4 flex gap-[6px] justify-end border-t border-[var(--gray-100)]">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-[5px] px-[13px] py-[7px] rounded-[7px] text-[11.5px] font-semibold 
            border-none cursor-pointer transition-all duration-[120ms] bg-[var(--gray-100)] text-[var(--gray-700)] border border-[var(--gray-200)] hover:bg-[var(--gray-200)]"
            style={{ fontFamily: "'Poppins',sans-serif" }}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}