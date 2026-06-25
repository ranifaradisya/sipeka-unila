'use client';
import styles from '../../page.module.css';
import { useKelulusanCharts } from '../useSpkCharts';

import { useState } from 'react';
import { Pagination, SecDiv } from '../shared/Helpers';

interface Props {
  onExport: (title: string, desc: string, data?: Record<string, unknown>[]) => void;
}

const STAT_CARDS = [
  { color: 'blue',  icon: '🎓', label: 'Total Lulusan Tahun 2025', value: '2,348', sub: '' },
  { color: 'green', icon: '✅', label: 'Tepat Waktu ≤8 Semester',  value: '1,831', sub: 'dari total lulusan tahun ini', trend: '78%' },
  { color: 'amber', icon: '⏱',  label: 'Terlambat 9–10 Semester',  value: '412',   sub: '', trend: '17.5%' },
  { color: 'red',   icon: '⛔', label: 'Terlambat >10 Semester',   value: '105',   sub: '', trend: '4.5%' },
];

const COLOR_MAP: Record<string, string> = {
  blue:  'from-[#1d6fc4] via-[#1a56db] to-[#073864]',
  green: 'from-[#34d399] via-[#10b981] to-[#047857]',
  amber: 'from-[#fcd34d] via-[#f59e0b] to-[#b45309]',
  red:   'from-[#f87171] via-[#ef4444] to-[#b91c1c]',
};
const SHADOW_MAP: Record<string, string> = {
  blue:  '0 8px 28px rgba(11,94,168,.35)',
  green: '0 8px 28px rgba(5,150,105,.35)',
  amber: '0 8px 28px rgba(217,119,6,.35)',
  red:   '0 8px 28px rgba(220,38,38,.35)',
};

interface KTWRecord {
  prodi: string;
  jenjang: string;
  fak: string;
  total: number;
  tepatWaktu: number;
  terlambat: number;
  pct: string;
  pctCls: string;
}

const JENJANG_BADGE: Record<string, string> = {
  'S1':       'bg-[#DBEAFE] text-[#1d4ed8]',
  'S2':       'bg-[#EDE9FE] text-[#6d28d9]',
  'S3':       'bg-[#FCE7F3] text-[#9d174d]',
  'D3':       'bg-[#FEF3C7] text-[#92400e]',
  'Profesi':  'bg-[#D1FAE5] text-[#065f46]',
};

const KTW_ROWS: KTWRecord[] = [
  { prodi: 'Teknik Informatika',         jenjang: 'S1',      fak: 'Teknik',           total: 142, tepatWaktu: 119, terlambat: 23, pct: '83.8%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'Teknik Sipil',               jenjang: 'S1',      fak: 'Teknik',           total: 98,  tepatWaktu: 78,  terlambat: 20, pct: '79.6%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'Ilmu Komunikasi',            jenjang: 'S1',      fak: 'FISIP',            total: 134, tepatWaktu: 107, terlambat: 27, pct: '79.9%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'Manajemen',                  jenjang: 'S1',      fak: 'Ekonomi & Bisnis', total: 210, tepatWaktu: 155, terlambat: 55, pct: '73.8%', pctCls: 'bg-[#FEF3C7] text-[#92400e]' },
  { prodi: 'Akuntansi',                  jenjang: 'S1',      fak: 'Ekonomi & Bisnis', total: 186, tepatWaktu: 148, terlambat: 38, pct: '79.6%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'Pendidikan Matematika',      jenjang: 'S1',      fak: 'FKIP',             total: 76,  tepatWaktu: 51,  terlambat: 25, pct: '67.1%', pctCls: 'bg-[#FEF3C7] text-[#92400e]' },
  { prodi: 'Pendidikan Bahasa Inggris',  jenjang: 'S1',      fak: 'FKIP',             total: 89,  tepatWaktu: 72,  terlambat: 17, pct: '80.9%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'Agroteknologi',              jenjang: 'S1',      fak: 'Pertanian',        total: 112, tepatWaktu: 84,  terlambat: 28, pct: '75.0%', pctCls: 'bg-[#FEF3C7] text-[#92400e]' },
  { prodi: 'Ilmu Komputer',              jenjang: 'S1',      fak: 'FMIPA',           total: 103, tepatWaktu: 88,  terlambat: 15, pct: '85.4%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'Hubungan Internasional',     jenjang: 'S1',      fak: 'FISIP',            total: 95,  tepatWaktu: 74,  terlambat: 21, pct: '77.9%', pctCls: 'bg-[#FEF3C7] text-[#92400e]' },
  { prodi: 'Magister Manajemen',         jenjang: 'S2',      fak: 'Pascasarjana',     total: 58,  tepatWaktu: 49,  terlambat: 9,  pct: '84.5%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'Magister Teknik Elektro',    jenjang: 'S2',      fak: 'Pascasarjana',     total: 34,  tepatWaktu: 27,  terlambat: 7,  pct: '79.4%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'Ilmu Ekonomi',               jenjang: 'S3',      fak: 'Pascasarjana',     total: 18,  tepatWaktu: 12,  terlambat: 6,  pct: '66.7%', pctCls: 'bg-[#FEF3C7] text-[#92400e]' },
  { prodi: 'Profesi Dokter',             jenjang: 'Profesi', fak: 'Kedokteran',       total: 64,  tepatWaktu: 55,  terlambat: 9,  pct: '85.9%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'Profesi Akuntansi',          jenjang: 'Profesi', fak: 'Ekonomi & Bisnis', total: 41,  tepatWaktu: 35,  terlambat: 6,  pct: '85.4%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'D3 Manajemen Informatika',   jenjang: 'D3',      fak: 'Teknik',           total: 67,  tepatWaktu: 54,  terlambat: 13, pct: '80.6%', pctCls: 'bg-[#D1FAE5] text-[#065f46]' },
  { prodi: 'D3 Teknik Sipil',            jenjang: 'D3',      fak: 'Teknik',           total: 45,  tepatWaktu: 34,  terlambat: 11, pct: '75.6%', pctCls: 'bg-[#FEF3C7] text-[#92400e]' },
  { prodi: 'D3 Perpajakan',              jenjang: 'D3',      fak: 'Ekonomi & Bisnis', total: 52,  tepatWaktu: 40,  terlambat: 12, pct: '76.9%', pctCls: 'bg-[#FEF3C7] text-[#92400e]' },
];

export default function Kelulusan({ onExport }: Props) {
  useKelulusanCharts();
  const [fakFilter, setFakFilter]   = useState('Semua Fakultas');
  const [yearFilter, setYearFilter] = useState('2025/2026');
  const [search, setSearch]         = useState('');

  const filtered = KTW_ROWS.filter(r => {
    const matchFak    = fakFilter === 'Semua Fakultas' || r.fak === fakFilter;
    const matchSearch = search.trim() === '' || r.prodi.toLowerCase().includes(search.toLowerCase());
    return matchFak && matchSearch;
  });

  return (
    <>
      <SecDiv
        label="Kelulusan Tepat Waktu (KTW)"
        icon={
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        }
      />

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-[16px] font-bold text-[#0F172A] mb-[2px] pb-[6px] relative" style={{ display: 'inline-block' }}>
            Kelulusan Tepat Waktu (KTW)
            <span className="absolute bottom-0 left-0 h-[2px] w-full rounded" style={{ background: 'linear-gradient(90deg,#1a56db,transparent)' }} />
          </div>
          <div className="text-[11px] text-[#64748B] mt-[4px]">
            Statistik kelulusan mahasiswa dalam batas waktu studi normal — indikator efektivitas utama sistem monitoring
          </div>
        </div>
        <div className="flex items-center gap-[7px] shrink-0">
          <select
            className={styles.filterSelect}
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
          >
            <option>2025/2026</option>
            <option>2024/2025</option>
            <option>2023/2024</option>
          </select>
          <button
            onClick={() => onExport('Kelulusan Tepat Waktu', 'Statistik KTW per prodi dan tahun', filtered.map(r => ({ prodi: r.prodi, fakultas: r.fak, jenjang: r.jenjang, total: r.total, tepatWaktu: r.tepatWaktu, terlambat: r.terlambat, pct: r.pct })))}
            className="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] text-[11px] font-semibold bg-white border-[1.5px] border-[#CCE5F5] text-[#1a56db] cursor-pointer transition-all duration-[130ms] whitespace-nowrap hover:bg-[#EEF5FC] hover:border-[#1a56db]"
          >
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Ekspor Data
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px] mb-5">
        {STAT_CARDS.map(c => (
          <div
            key={c.label}
            className={`bg-gradient-to-br ${COLOR_MAP[c.color]} border-none rounded-[18px] p-[22px_20px_20px] flex flex-col min-h-[178px] relative overflow-hidden`}
            style={{ boxShadow: SHADOW_MAP[c.color] }}
          >
          <span
            className="absolute top-[-22px] right-[-22px] w-[100px] h-[100px] rounded-full pointer-events-none"
            style={{ background: 'rgba(255,255,255,.09)' }}
          />
          <span
            className="absolute bottom-[-30px] left-[-20px] w-[90px] h-[90px] rounded-full pointer-events-none"
            style={{ background: 'rgba(255,255,255,.05)' }}
          />
            <div className="flex items-start justify-between mb-[14px]">
              {c.trend ? (
                <span className="text-[10px] font-bold px-[9px] py-1 rounded-full inline-flex items-center text-white whitespace-nowrap" style={{ background: 'rgba(255,255,255,.22)' }}>
                  {c.trend}
                </span>
              ) : <span />}
              <div className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center text-[21px] shrink-0" style={{ background: 'rgba(255,255,255,.22)' }}>
                {c.icon}
              </div>
            </div>
            <div className="text-[11.5px] font-bold text-white/95 tracking-[.3px] mb-1 uppercase">{c.label}</div>
            <div className="text-[42px] font-extrabold leading-none text-white tracking-[-1px] mb-[5px]">{c.value}</div>
            {c.sub && <div className="text-[10.5px] text-white/70 mt-auto">{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Two charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] mb-5">
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden flex flex-col">
          <div className="text-white text-[13px] font-bold px-[18px] py-[13px] pb-[11px] flex items-center gap-2 tracking-[.1px]" style={{ background: 'linear-gradient(135deg,#1a56db 0%,#073864 100%)' }}>
            📊 Tren Kelulusan per Tahun Akademik
          </div>
          <div className="text-[11px] text-[#64748B] px-[18px] py-2 pb-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9]">
            Perbandingan jumlah lulusan tepat waktu vs. terlambat
          </div>
          <div className="relative h-[200px] p-[10px_14px_12px] flex-1">
            <canvas id="cGrad" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden flex flex-col">
          <div className="text-white text-[13px] font-bold px-[18px] py-[13px] pb-[11px] flex items-center gap-2 tracking-[.1px]" style={{ background: 'linear-gradient(135deg,#1a56db 0%,#073864 100%)' }}>
            🕸️ KTW per Fakultas — Tahun 2025
          </div>
          <div className="text-[11px] text-[#64748B] px-[18px] py-2 pb-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9]">
            Persentase kelulusan tepat waktu per unit fakultas (radar)
          </div>
          <div className="relative h-[200px] p-[10px_14px_12px] flex-1">
            <canvas id="cFak" />
          </div>
        </div>
      </div>

      {/* KTW Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-[12px] border-b border-[#F1F5F9] bg-[#F8FAFC] flex-wrap">
          <div className="text-[12.5px] font-bold text-[#0F172A] flex items-center gap-2">
            <span className="w-[3px] h-[16px] rounded-[2px] inline-block" style={{ background: 'linear-gradient(180deg,#1a56db,#073864)' }} />
            Rekap Kelulusan Tepat Waktu per Program Studi
          </div>
          <div className="flex items-center gap-[7px] flex-wrap">
            {/* Search program studi */}
            <div className="relative flex items-center">
              <svg className="absolute left-[8px] pointer-events-none text-[#94A3B8]" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Cari program studi..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-[11px] font-medium text-[#475569] border border-[#E2E8F0] rounded-[7px] pl-[26px] pr-[10px] py-[5px] bg-white outline-none w-[180px] focus:border-[#1a56db] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-[7px] text-[#94A3B8] hover:text-[#475569] leading-none cursor-pointer"
                  style={{ fontSize: 14, lineHeight: 1 }}
                >×</button>
              )}
            </div>
            <select className={styles.filterSelect} value={fakFilter} onChange={e => setFakFilter(e.target.value)}>
              <option>Semua Fakultas</option>
              <option>Teknik</option>
              <option value="Ekonomi & Bisnis">Ekonomi &amp; Bisnis</option>
              <option>FISIP</option>
              <option>FKIP</option>
              <option>Pertanian</option>
              <option>Kedokteran</option>
              <option>Pascasarjana</option>
            </select>
            <select className={styles.filterSelect} value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
              <option>2025/2026</option>
              <option>2024/2025</option>
              <option>2023/2024</option>
            </select>
            <button
              onClick={() => onExport('KTW per Prodi', 'Rekap kelulusan tepat waktu per program studi', filtered.map(r => ({ prodi: r.prodi, fakultas: r.fak, jenjang: r.jenjang, total: r.total, tepatWaktu: r.tepatWaktu, terlambat: r.terlambat, pct: r.pct })))}
              className="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] text-[11px] font-semibold bg-white border-[1.5px] border-[#CCE5F5] text-[#1a56db] cursor-pointer transition-all duration-[130ms] whitespace-nowrap hover:bg-[#EEF5FC] hover:border-[#1a56db]"
            >
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Ekspor
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#F1F5F9]">
                {['Program Studi', 'Jenjang', 'Fakultas', 'Total', 'Tepat Waktu', 'Terlambat', '%'].map(h => (
                  <th key={h} className="text-left text-[10.5px] font-bold text-[#94A3B8] uppercase tracking-[.7px] px-4 py-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.prodi} className="border-b border-[#F8FAFC] transition-colors duration-[100ms] hover:bg-[#F8FAFC]">
                  <td className="px-4 py-[11px]"><b className="text-[#0F172A]">{r.prodi}</b></td>
                  <td className="px-4 py-[11px]">
                    <span className={`inline-flex items-center rounded-[5px] font-semibold whitespace-nowrap px-[8px] py-[2px] text-[10.5px] tracking-[.1px] ${JENJANG_BADGE[r.jenjang] ?? 'bg-[#F1F5F9] text-[#475569]'}`}>
                      {r.jenjang}
                    </span>
                  </td>
                  <td className="px-4 py-[11px] text-[#475569]">{r.fak}</td>
                  <td className="px-4 py-[11px] text-[#475569]">{r.total}</td>
                  <td className="px-4 py-[11px] text-[#475569]">{r.tepatWaktu}</td>
                  <td className="px-4 py-[11px] text-[#475569]">{r.terlambat}</td>
                  <td className="px-4 py-[11px]">
                    <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] tracking-[.1px] ${r.pctCls}`}>
                      {r.pct}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination current={1} total={1} info={`1–${filtered.length} dari ${KTW_ROWS.length} prodi`} />
      </div>
    </>
  );
}