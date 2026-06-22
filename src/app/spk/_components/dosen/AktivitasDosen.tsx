'use client';
import { useAktivitasCharts } from '../useSpkCharts';

import { useState, useMemo } from 'react';
import { DOSEN } from '../data';
import { Pagination, Sel} from '../shared/Helpers';
import styles from '../../page.module.css';

interface Props {
  onOpenDosen: (index: number) => void;
  onExport: (title: string, desc: string, data?: Record<string, unknown>[]) => void;
}

const GRAD_MYUNILA = 'linear-gradient(135deg,#1a56db 0%,#1d4ed8 100%)';

// Target: 2 publikasi per 3 tahun
const PUB_TARGET = 2;

function ChartCard({ id, title, sub, height = 220 }: { id: string; title: string; sub: string; height?: number }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden flex flex-col">
      <div className="text-white text-[13px] font-bold px-[18px] py-[13px] pb-[11px] flex items-center gap-2"
        style={{ background: GRAD_MYUNILA }}>{title}</div>
      <div className="text-[11px] text-[#64748B] px-[18px] py-2 pb-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9]">{sub}</div>
      <div className="relative p-[14px_18px_16px] flex-1" style={{ height }}>
        <canvas id={id} />
      </div>
    </div>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function monthsUntilDeadline(pubDeadline: string): number | null {
  if (!pubDeadline || pubDeadline === '—') return null;
  const [monStr, yearStr] = pubDeadline.split(' ');
  const mIdx = MONTHS.indexOf(monStr);
  const year = parseInt(yearStr, 10);
  if (mIdx === -1 || Number.isNaN(year)) return null;
  const now = new Date();
  return (year - now.getFullYear()) * 12 + (mIdx - now.getMonth());
}

function computePubStatus(pubDeadline: string): 'Normal' | 'Perhatian' | 'Peringatan' {
  const sisa = monthsUntilDeadline(pubDeadline);
  if (sisa === null || sisa <= 6) return 'Peringatan';
  if (sisa <= 12) return 'Perhatian';
  return 'Normal';
}

const ACT_ROWS = DOSEN.map(d => ({
  nm: d.nm,
  fak: d.fak,
  status: computePubStatus(d.pubDeadline),
  sks: d.sks,
  pub: d.pub,
  pubLast: d.pubLast,
  pubDeadline: d.pubDeadline,
  dosenIdx: DOSEN.indexOf(d),
}));

export default function AktivitasDosen({ onOpenDosen, onExport }: Props) {
  useAktivitasCharts();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFak, setFilterFak] = useState('');

  // Daftar unik status & fakultas untuk opsi dropdown
  const statusOptions = useMemo(() => Array.from(new Set(ACT_ROWS.map(r => r.status))).sort(), []);
  const fakOptions = useMemo(() => Array.from(new Set(ACT_ROWS.map(r => r.fak))).sort(), []);

  const filtered = ACT_ROWS.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.nm.toLowerCase().includes(q);
    const matchStatus = !filterStatus || r.status === filterStatus;
    const matchFak = !filterFak || r.fak === filterFak;
    return matchSearch && matchStatus && matchFak;
  });

  return (
    <>
       {/* Section divider */}
    <div className="flex items-center gap-3 my-8 mb-[18px]">
      <div className="flex-1 h-px bg-[#E2E8F0]" />

      <div
        className="flex items-center gap-[7px] text-white px-4 py-[5px] rounded-full text-[11.5px] font-bold shadow-[0_2px_8px_rgba(11,94,168,0.22)] whitespace-nowrap"
        style={{
          background: 'linear-gradient(135deg,#1a56db 0%,#073864 100%)',
        }}
      >
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>

        Aktivitas Dosen
      </div>

      <div className="flex-1 h-px bg-[#E2E8F0]" />
    </div>

    <div className="flex items-start justify-between gap-4 mb-5">
  <div>
    <div
      className="text-[16px] font-bold text-[#0F172A] mb-[2px] pb-[6px] relative"
      style={{ display: 'inline-block' }}
    >
      Aktivitas Dosen
      <span
        className="absolute bottom-0 left-0 h-[2px] w-full rounded"
        style={{
          background: 'linear-gradient(90deg,#1a56db,transparent)',
        }}
      />
    </div>

        <div className="text-[11px] text-[#64748B] mt-[4px]">
          Monitoring beban mengajar (SKS) dan rekam jejak publikasi ilmiah per dosen
        </div>
      </div>
    </div>

      {/* Charts */}
      <div className="flex flex-col gap-3 mb-5">
        <ChartCard id="cSKS" title="📚 Distribusi Beban Mengajar Dosen Antar Fakultas" sub="Perbandingan rata-rata beban mengajar dosen pada masing-masing fakultas sebagai indikator pemerataan beban kerja." height={260} />
        <ChartCard id="cPub" title="📝 Tren Publikasi Ilmiah 5 Tahun Terakhir" sub="Jumlah publikasi nasional dan internasional berdasarkan data historis hingga tahun terakhir yang telah lengkap." height={220} />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden mb-5">
        <div className="px-[18px] py-[14px] border-b border-[#F1F5F9] flex items-center justify-between gap-[10px] flex-wrap bg-white">
          <div className={styles.theadTitle}>Riwayat Mengajar &amp; Publikasi Dosen</div>
          <div className="flex gap-[7px] items-center flex-wrap">
            {/* Filter Semua Status */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
              style={{ minWidth: 130 }}
            >
              <option value="">Semua Status</option>
              {statusOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Filter Semua Fakultas */}
            <select
              value={filterFak}
              onChange={e => setFilterFak(e.target.value)}
              className={styles.filterSelect}
              style={{ minWidth: 150 }}
            >
              <option value="">Semua Fakultas</option>
              {fakOptions.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari dosen..."
              className={styles.searchInput}
            />
            <button onClick={() => onExport('Aktivitas Dosen', 'Beban mengajar dan publikasi dosen', filtered.map(r => ({ nama: r.nm, fakultas: r.fak, sks: r.sks, publikasi: r.pub, pubTerakhir: r.pubLast, deadline: r.pubDeadline, status: r.status })))} className="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] text-[11px] font-semibold bg-white border-[1.5px] border-[#CCE5F5] text-[#1a56db] cursor-pointer transition-all duration-[130ms] whitespace-nowrap hover:bg-[#EEF5FC] hover:border-[#1a56db]">
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Ekspor
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className={`px-4 py-[11px] text-left text-[10px] font-bold text-[#64748B] uppercase tracking-[.8px] border-b-2 border-[#F1F5F9] whitespace-nowrap select-none w-[220px] ${styles.thSort}`}>Nama Dosen</th>
                <th className={`px-4 py-[11px] text-left text-[10px] font-bold text-[#64748B] uppercase tracking-[.8px] border-b-2 border-[#F1F5F9] whitespace-nowrap select-none w-[150px] ${styles.thSort}`}>Fakultas</th>
                <th className={`px-4 py-[11px] text-left text-[10px] font-bold text-[#64748B] uppercase tracking-[.8px] border-b-2 border-[#F1F5F9] whitespace-nowrap select-none w-[90px] ${styles.thSort}`}>Status</th>
                <th className={`px-4 py-[11px] text-left text-[10px] font-bold text-[#64748B] uppercase tracking-[.8px] border-b-2 border-[#F1F5F9] whitespace-nowrap select-none w-[80px] ${styles.thSort}`}>SKS</th>
                <th className={`px-4 py-[11px] text-left text-[10px] font-bold text-[#64748B] uppercase tracking-[.8px] border-b-2 border-[#F1F5F9] whitespace-nowrap select-none w-[130px] ${styles.thSort}`}>Total Publikasi</th>
                <th className={`px-4 py-[11px] text-left text-[10px] font-bold text-[#64748B] uppercase tracking-[.8px] border-b-2 border-[#F1F5F9] whitespace-nowrap select-none w-[140px] ${styles.thSort}`}>Publikasi Terakhir</th>
                <th className={`px-4 py-[11px] text-left text-[10px] font-bold text-[#64748B] uppercase tracking-[.8px] border-b-2 border-[#F1F5F9] whitespace-nowrap select-none w-[140px] ${styles.thSort}`}>Batas Publikasi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const pubNum = parseInt(r.pub) || 0;
                const reached = pubNum >= PUB_TARGET;

                // warna badge status
                const statusColor =
                  r.status === 'Normal'
                    ? 'bg-[#D1FAE5] text-[#065f46]'
                    : r.status === 'Peringatan'
                    ? 'bg-[#FEE2E2] text-[#991b1b]'
                    : r.status === 'Perhatian'
                    ? 'bg-[#FEF3C7] text-[#92400e]'
                    : 'bg-[#EDE9FE] text-[#5b21b6]';

                return (
                  <tr key={i} onClick={() => onOpenDosen(r.dosenIdx)}
                    className="cursor-pointer transition-colors duration-[100ms] hover:bg-[#F0F7FF] [&:last-child_td]:border-b-0">
                    <td className="px-4 py-[13px] border-b border-[#F1F5F9] align-middle">
                      <b className="text-[12.5px] text-[#0F172A]">{r.nm}</b>
                      <span className="text-[9.5px] text-[#94A3B8] ml-[5px]">👆 Profil</span>
                    </td>
                    <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[12px] text-[#475569] align-middle">{r.fak}</td>
                    <td className="px-4 py-[13px] border-b border-[#F1F5F9] align-middle">
                      <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[9px] py-[3px] text-[11px] ${statusColor}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[12.5px] text-[#475569] align-middle">{r.sks} SKS</td>
                    <td className="px-4 py-[13px] border-b border-[#F1F5F9] align-middle">
                      <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] ${reached ? 'bg-[#D1FAE5] text-[#065f46]' : 'bg-[#FEE2E2] text-[#991b1b]'}`}>
                        {pubNum} Jurnal
                      </span>
                    </td>
                    <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[12.5px] text-[#475569] align-middle">{r.pubLast}</td>
                    <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[12.5px] text-[#475569] align-middle">{r.pubDeadline}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination current={1} total={1} info="1–16 dari 16 data" />
      </div>
    </>
  );
}