"use client";

import { useState } from "react";
import styles from "../../page.module.css";
import type { Mhs } from "../data";

type Tab = "sp1" | "sp2";

const statusChip = (s: string) => {
  const map: Record<string, string> = {
    SP1: "bg-[var(--danger-bg)] text-[var(--danger)]",
    SP2: "bg-[var(--danger-bg)] text-[var(--danger)]",
    Normal: "bg-[var(--success-bg)] text-[var(--success)]",
    Perhatian: "bg-[var(--danger-bg)] text-[var(--danger)]",
  };
  return map[s] || "bg-[var(--gray-100)] text-[var(--gray-600)]";
};

type Props = {
  sectionRef: (el: HTMLDivElement | null) => void;
  data: Mhs[];
  onOpenMhs: (npm: string) => void;
  onOpenExport: (title: string, desc: string, data?: Record<string, unknown>[]) => void;
};

function EwsTable({
  rows,
  onOpenMhs,
  pageInfo,
}: {
  rows: Mhs[];
  onOpenMhs: (npm: string) => void;
  pageInfo: string;
}) {
  return (
    <div className="bg-white border border-[var(--gray-200)] rounded-[11px] shadow-[var(--card-shadow)] overflow-hidden mb-[18px]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["NPM", "Nama", "Prodi", "Sem", "IPK", "SKS", "Dosen PA", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-[13px] py-[9px] text-left text-[9.5px] font-bold text-[var(--gray-400)] uppercase tracking-[0.6px] border-b border-[var(--gray-100)] bg-[var(--gray-50)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr
                key={m.npm}
                onClick={() => onOpenMhs(m.npm)}
                className="cursor-pointer transition-colors duration-100 hover:bg-[#EFF6FF]"
              >
                <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs text-[var(--gray-400)]">
                  {m.npm}
                </td>
                <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs">
                  <b className="text-[var(--gray-900)]">{m.nm}</b>
                  <span className="text-[9.5px] text-[var(--gray-400)] ml-1">👆 Profil</span>
                </td>
                <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs text-[var(--gray-600)]">
                  {m.prodi}
                </td>
                <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs text-[var(--gray-600)]">
                  {m.sem}
                </td>
                <td
                  className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs font-bold text-[var(--danger)]"
                >
                  {m.ipk.toFixed(2)}
                </td>
                <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs text-[var(--gray-600)]">
                  {m.sks}
                </td>
                <td
                  className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs text-[var(--gray-600)]"
                  style={{ fontSize: 11 }}
                >
                  {m.pa}
                </td>
                <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs">
                  <span
                    className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap px-2 py-[2px] text-[10px] ${statusChip(m.status)}`}
                  >
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-[14px] py-[9px] flex items-center gap-1 border-t border-[var(--gray-100)]">
        <button className="px-[9px] py-1 rounded-[5px] border-[1.5px] border-[var(--myunila)] bg-[var(--myunila)] text-[11px] font-semibold text-white cursor-pointer">
          1
        </button>
        <span className="ml-auto text-[10.5px] text-[var(--gray-400)]">{pageInfo}</span>
      </div>
    </div>
  );
}

export default function EwsSection({ sectionRef, data, onOpenMhs, onOpenExport }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("sp1");
  const [year, setYear] = useState("2025/2026");

  const sp1Rows = data.filter((m) => m.status === "SP1");
  const sp2Rows = data.filter((m) => m.status === "SP2");

  return (
    <div ref={sectionRef} id="sec-ews">
      {/* Section divider */}
      <div className="flex items-center gap-3 my-8 mb-[18px]">
        <div className="flex-1 h-px bg-[var(--gray-200)]" />
        <div className="flex items-center gap-[7px] bg-[var(--myunila)] text-white px-4 py-[5px] rounded-full text-[11.5px] font-bold shadow-[0_2px_8px_rgba(11,94,168,0.22)] whitespace-nowrap">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
          </svg>
          Early Warning Drop Out
        </div>
        <div className="flex-1 h-px bg-[var(--gray-200)]" />
      </div>

      <div className="flex items-start justify-between mb-4 flex-wrap gap-[7px]">
    <div>
      <div
        className="text-[18px] font-bold text-[var(--gray-900)] relative inline-block pb-[6px]"
      >
        Early Warning Drop Out
      <span
        className="absolute bottom-0 left-0 h-[2px] w-full rounded"
        style={{
        background: "linear-gradient(90deg,#1a56db,transparent)",
        }}
      />
    </div>

    <div className="text-[11px] text-[var(--gray-400)] mt-[2px]">
      Deteksi otomatis mahasiswa berisiko · Klik baris untuk profil lengkap
    </div>
  </div>
        <div className={`flex gap-[6px] items-center ${styles.noPrint}`}>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={styles.filterSelect}
            style={{ fontFamily: "'Poppins',sans-serif" }}
          >
            <option>2025/2026</option>
            <option>2024/2025</option>
          </select>
          <button
            onClick={() =>
              onOpenExport("EWS Drop Out", "Mahasiswa berisiko DO semester ini", [...sp1Rows, ...sp2Rows].map(m => ({ npm: m.npm, nama: m.nm, fakultas: m.fak, prodi: m.prodi, semester: m.sem, ipk: m.ipk, sks: m.sks, status: m.status })))
            }
            className="inline-flex items-center gap-[5px] px-[11px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-white border-[1.5px] border-[var(--myunila-100)] text-[var(--myunila)] cursor-pointer transition-all duration-[120ms] whitespace-nowrap hover:bg-[var(--myunila-50)] hover:border-[var(--myunila)]"
            style={{ fontFamily: "'Poppins',sans-serif" }}
          >
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Ekspor
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-[5px] mb-[14px]">
        <div
          onClick={() => setActiveTab("sp1")}
          className={`px-[14px] py-[7px] rounded-[7px] text-xs font-semibold border-[1.5px] cursor-pointer transition-all duration-[120ms] ${
            activeTab === "sp1"
              ? "bg-[var(--myunila-50)] text-[var(--myunila)] border-[var(--myunila-100)]"
              : "text-[var(--gray-500)] border-[var(--gray-200)] hover:bg-[var(--myunila-50)] hover:text-[var(--myunila)] hover:border-[var(--myunila-100)]"
          }`}
        >
          ⚠️ SP1 — Semester 5
        </div>
        <div
          onClick={() => setActiveTab("sp2")}
          className={`px-[14px] py-[7px] rounded-[7px] text-xs font-semibold border-[1.5px] cursor-pointer transition-all duration-[120ms] ${
            activeTab === "sp2"
              ? "bg-[var(--myunila-50)] text-[var(--myunila)] border-[var(--myunila-100)]"
              : "text-[var(--gray-500)] border-[var(--gray-200)] hover:bg-[var(--myunila-50)] hover:text-[var(--myunila)] hover:border-[var(--myunila-100)]"
          }`}
        >
          🚨 SP2 — Semester 8
        </div>
      </div>

      {/* SP1 panel */}
      {activeTab === "sp1" && (
        <div id="sp1-c">
          <div className="flex gap-[10px] px-[14px] py-[11px] rounded-[8px] mb-3 bg-[var(--warning-bg)] border-l-[3px] border-[var(--warning)]">
            <div className="text-[15px] flex-shrink-0 mt-[1px]">⚠️</div>
            <div>
              <strong className="text-xs font-bold text-[var(--gray-900)]">
                Surat Peringatan 1 (SP1)
              </strong>
              <p className="text-[11px] text-[var(--gray-600)] mt-[2px] leading-[1.5]">
                Mahasiswa semester 5, IPK &lt; 2.0. Total:{" "}
                <b>{sp1Rows.length} mahasiswa</b>.  Perlu perhatian khusus agar tidak lanjut ke SP2 atau DO.
              </p>
            </div>
          </div>
          <div className="bg-white border border-[var(--gray-200)] rounded-[11px] shadow-[var(--card-shadow)] overflow-hidden mb-[18px]">
            <div className="px-4 py-3 border-b border-[var(--gray-100)]">
              <div className="text-[12.5px] font-bold text-[var(--gray-900)]">Mahasiswa SP1</div>
            </div>
            <EwsTable
              rows={sp1Rows}
              onOpenMhs={onOpenMhs}
              pageInfo={`1–${sp1Rows.length} dari 7 data`}
            />
          </div>
        </div>
      )}

      {/* SP2 panel */}
      {activeTab === "sp2" && (
        <div id="sp2-c">
          <div className="flex gap-[10px] px-[14px] py-[11px] rounded-[8px] mb-3 bg-[var(--danger-bg)] border-l-[3px] border-[var(--danger)]">
            <div className="text-[15px] flex-shrink-0 mt-[1px]">🚨</div>
            <div>
              <strong className="text-xs font-bold text-[var(--gray-900)]">
                Surat Peringatan 2 (SP2)
              </strong>
              <p className="text-[11px] text-[var(--gray-600)] mt-[2px] leading-[1.5]">
                Mahasiswa semester 8, IPK &lt; 2.0. Total:{" "}
                <b>{sp2Rows.length} mahasiswa</b>. Risiko DROP OUT sangat tinggi.
              </p>
            </div>
          </div>
          <div className="bg-white border border-[var(--gray-200)] rounded-[11px] shadow-[var(--card-shadow)] overflow-hidden mb-[18px]">
            <div className="px-4 py-3 border-b border-[var(--gray-100)]">
              <div className="text-[12.5px] font-bold text-[var(--gray-900)]">
                Mahasiswa SP2 — Risiko Tinggi
              </div>
            </div>
            <EwsTable
              rows={sp2Rows}
              onOpenMhs={onOpenMhs}
              pageInfo={`1–${sp2Rows.length} dari 5 data`}
            />
          </div>
        </div>
      )}
    </div>
  );
}