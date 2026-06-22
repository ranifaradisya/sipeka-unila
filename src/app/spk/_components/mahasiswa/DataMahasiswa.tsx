"use client";

import { useMemo, useState } from "react";
import styles from "../../page.module.css";
import type { Mhs } from "../data";

const SEMESTER_OPTIONS = ["Semua Semester", "Sem 1–2", "Sem 3–4", "Sem 5–6", "Sem 7+"];
const STATUS_OPTIONS = ["Semua Status", "Normal", "Perhatian", "SP1", "SP2"];
const JENJANG_OPTIONS = ["Semua Jenjang", "S1", "S2", "S3", "D3", "D4", "Profesi"];

const statusChip = (s: string) => {
  const map: Record<string, string> = {
    Normal: "bg-[var(--success-bg)] text-[var(--success)]",
    Perhatian: "bg-[var(--warning-bg)] text-[var(--warning)]",
    SP1: "bg-[var(--danger-bg)] text-[var(--danger)]",
    SP2: "bg-[var(--danger-bg)] text-[var(--danger)]",
  };
  return map[s] || "bg-[var(--gray-100)] text-[var(--gray-600)]";
};

const ipkColor = (v: number) =>
  v < 2 ? "var(--danger)" : v < 3 ? "var(--warning)" : "var(--success)";

const semGroup = (sem: number): string => {
  if (sem <= 2) return "Sem 1–2";
  if (sem <= 4) return "Sem 3–4";
  if (sem <= 6) return "Sem 5–6";
  return "Sem 7+";
};

type Props = {
  sectionRef: (el: HTMLDivElement | null) => void;
  data: Mhs[];
  onOpenMhs: (npm: string) => void;
  onOpenExport: (title: string, desc: string, data?: Record<string, unknown>[]) => void;
};

export default function MahasiswaSection({
  sectionRef,
  data,
  onOpenMhs,
  onOpenExport,
}: Props) {
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("Semua Semester");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [jenjangFilter, setJenjangFilter] = useState("Semua Jenjang");
  const [year, setYear] = useState("2025/2026");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((m) => {
      if (q && !m.nm.toLowerCase().includes(q) && !m.npm.includes(q)) return false;
      if (semester !== "Semua Semester" && semGroup(m.sem) !== semester) return false;
      if (statusFilter !== "Semua Status" && m.status !== statusFilter) return false;
      if (jenjangFilter !== "Semua Jenjang" && m.jenjang !== jenjangFilter) return false;
      return true;
    });
  }, [data, search, semester, statusFilter, jenjangFilter]);

  return (
    <div ref={sectionRef} id="sec-mahasiswa">
      {/* Section divider */}
      <div className="flex items-center gap-3 my-8 mb-[18px]">
        <div className="flex-1 h-px bg-[var(--gray-200)]" />
        <div className="flex items-center gap-[7px] bg-[var(--myunila)] text-white px-4 py-[5px] rounded-full text-[11.5px] font-bold shadow-[0_2px_8px_rgba(11,94,168,0.22)] whitespace-nowrap">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          Data Mahasiswa
        </div>
        <div className="flex-1 h-px bg-[var(--gray-200)]" />
      </div>

      <div className="flex items-start justify-between mb-4 flex-wrap gap-[7px]">
        <div>
          <div
            className="text-[18px] font-bold text-[var(--gray-900)] relative inline-block pb-[6px]"
          >
            Data Mahasiswa Aktif
          <span
            className="absolute bottom-0 left-0 h-[2px] w-full rounded"
            style={{
            background: "linear-gradient(90deg,#1a56db,transparent)",
          }}
        />
      </div>

    <div className="text-[11px] text-[var(--gray-400)] mt-[2px]">
      12.847 mahasiswa aktif terdaftar · Klik nama untuk melihat profil dan riwayat akademik lengkap
    </div>
  </div>
</div>

      <div className="bg-white border border-[var(--gray-200)] rounded-[11px] shadow-[var(--card-shadow)] overflow-hidden mb-[18px]">
        <div className="px-4 py-3 border-b border-[var(--gray-100)] flex items-center justify-between gap-2 flex-wrap">
          <div className="text-[12.5px] font-bold text-[var(--gray-900)]">Daftar Mahasiswa</div>
          <div className="flex gap-[6px] items-center flex-wrap">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari NPM / nama..."
              className="pl-[27px] pr-[10px] py-[6px] border-[1.5px] border-[var(--gray-200)] rounded-[6px] text-[11.5px] outline-none bg-[var(--gray-50)] bg-no-repeat bg-[8px_center] min-w-[160px] text-[var(--gray-900)] transition-colors duration-[120ms] focus:border-[var(--myunila)]"
              style={{
                fontFamily: "'Poppins',sans-serif",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' fill='none' stroke='%236B7280' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E\")",
              }}
            />
            <select
              value={jenjangFilter}
              onChange={(e) => setJenjangFilter(e.target.value)}
              className={styles.filterSelect}
              style={{ fontFamily: "'Poppins',sans-serif" }}
            >
              {JENJANG_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className={styles.filterSelect}
              style={{ fontFamily: "'Poppins',sans-serif" }}
            >
              {SEMESTER_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
              style={{ fontFamily: "'Poppins',sans-serif" }}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={styles.filterSelect}
              style={{ fontFamily: "'Poppins',sans-serif" }}
            >
              <option>2025/2026</option>
              <option>2024/2025</option>
              <option>2023/2024</option>
            </select>
            <button
              onClick={() => onOpenExport("Data Mahasiswa", "Data mahasiswa aktif UNILA", filtered.map(m => ({ npm: m.npm, nama: m.nm, fakultas: m.fak, prodi: m.prodi, jenjang: m.jenjang, angkatan: m.ang, semester: m.sem, ipk: m.ipk, sks: m.sks, status: m.status })))}
              className={`${styles.noPrint} inline-flex items-center gap-[5px] px-[11px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-white border-[1.5px] border-[var(--myunila-100)] text-[var(--myunila)] cursor-pointer transition-all duration-[120ms] whitespace-nowrap hover:bg-[var(--myunila-50)] hover:border-[var(--myunila)]`}
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["NPM", "Nama", "Program Studi", "Jenjang", "Angkatan", "Semester", "IPK", "SKS", "Dosen PA", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-[13px] py-[9px] text-left text-[9.5px] font-bold text-[var(--gray-400)] uppercase tracking-[0.6px] border-b border-[var(--gray-100)] bg-[var(--gray-50)]"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
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
                  <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs">
                    <span className={`inline-flex items-center rounded-[5px] font-semibold whitespace-nowrap px-[7px] py-[2px] text-[10px] ${
                      m.jenjang === "S1"       ? "bg-[#DBEAFE] text-[#1e40af]" :
                      m.jenjang === "D3"       ? "bg-[#F3E8FF] text-[#6b21a8]" :
                      m.jenjang === "D4"       ? "bg-[#EDE9FE] text-[#5b21b6]" :
                      m.jenjang === "S2"       ? "bg-[#D1FAE5] text-[#065f46]" :
                      m.jenjang === "S3"       ? "bg-[#FEE2E2] text-[#991b1b]" :
                      m.jenjang === "Profesi"  ? "bg-[#FEF3C7] text-[#92400e]" :
                                                 "bg-[#F1F5F9]  text-[#475569]"
                    }`}>{m.jenjang}</span>
                  </td>
                  <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs text-[var(--gray-600)]">
                    {m.ang}
                  </td>
                  <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs text-[var(--gray-600)]">
                    {m.sem}
                  </td>
                  <td
                    className="px-[13px] py-[11px] border-b border-[var(--gray-100)] align-middle text-xs font-bold"
                    style={{ color: ipkColor(m.ipk) }}
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
          <button className="px-[9px] py-1 rounded-[5px] border-[1.5px] border-[var(--gray-200)] bg-white text-[11px] font-semibold text-[var(--gray-600)] cursor-pointer">
            2
          </button>
          <button className="px-[9px] py-1 rounded-[5px] border-[1.5px] border-[var(--gray-200)] bg-white text-[11px] font-semibold text-[var(--gray-600)] cursor-pointer">
            3
          </button>
          <span className="ml-auto text-[10.5px] text-[var(--gray-400)]">
            1–{filtered.length} dari 12.847 data
          </span>
        </div>
      </div>
    </div>
  );
}