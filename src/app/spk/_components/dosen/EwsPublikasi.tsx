'use client';

import { useState } from 'react';
import styles from '../../page.module.css';
import ProfesorModal, { type ProfesorData } from '../shared/ProfesorModal';

interface Props {
  onExport: (title: string, desc: string, data?: Record<string, unknown>[]) => void;
}

const PROFESOR_DATA = [
  {
    no: 1, nm: 'Prof. Hendra Wijaya, Ph.D.',  fak: 'Hukum',   totalPub: 12,
    lastPub: 'Jan 2025', batas: 'Jan 2028', status: 'Aman',       statusCls: 'bg-[#D1FAE5] text-[#065F46]',
    nip: '196503011990031002', gol: 'IV/d', bidang: 'Hukum Tata Negara',
  },
  {
    no: 2, nm: 'Prof. Sari Kusuma, Ph.D.',    fak: 'FMIPA',   totalPub: 7,
    lastPub: 'Mar 2022', batas: 'Mar 2025', status: 'Peringatan', statusCls: 'bg-[#FEE2E2] text-[#991B1B]',
    nip: '197108151998032001', gol: 'IV/c', bidang: 'Kimia Analitik',
  },
  {
    no: 3, nm: 'Prof. Ahmad Subhan, M.Sc.',   fak: 'Teknik',  totalPub: 9,
    lastPub: 'Nov 2024', batas: 'Nov 2027', status: 'Perhatian',  statusCls: 'bg-[#FEF3C7] text-[#92400E]',
    nip: '196812201994031003', gol: 'IV/d', bidang: 'Teknik Sipil & Konstruksi',
  },
  {
    no: 4, nm: 'Prof. Diana Lestari, Ph.D.',  fak: 'Ekonomi', totalPub: 5,
    lastPub: 'Feb 2021', batas: 'Feb 2024', status: 'Peringatan', statusCls: 'bg-[#FEE2E2] text-[#991B1B]',
    nip: '197205102000032002', gol: 'IV/c', bidang: 'Manajemen Keuangan',
  },
  {
    no: 5, nm: 'Prof. Bambang Riyadi, Ph.D.', fak: 'FISIP',   totalPub: 8,
    lastPub: 'Jun 2024', batas: 'Jun 2027', status: 'Perhatian',  statusCls: 'bg-[#FEF3C7] text-[#92400E]',
    nip: '196609231993031004', gol: 'IV/e', bidang: 'Ilmu Pemerintahan',
  },
];

const STATS = [
  { 
    bg: 'linear-gradient(135deg,#1d6fc4 0%,#1a56db 55%,#073864 100%)',
    ic: '🎓',
    label: 'TOTAL GURU BESAR AKTIF',
    val: '42',
    sub: 'Profesor aktif di UNILA',
    trend: null
  },

  { 
    bg: 'linear-gradient(135deg,#34d399 0%,#10b981 55%,#047857 100%)',
    ic: '✅',
    label: 'KEWAJIBAN TERPENUHI',
    val: '28',
    sub: 'Sudah publikasi ≤3 tahun ini',
    trend: { txt: 'Aman', blink: false }
  },

  { 
    bg: 'linear-gradient(135deg,#fcd34d 0%,#f59e0b 55%,#b45309 100%)',
    ic: '⏰',
    label: 'MENDEKATI BATAS (<1 TAHUN)',
    val: '9',
    sub: 'Perlu segera publikasi',
    trend: { txt: 'Segera', blink: true }
  },

  { 
    bg: 'linear-gradient(135deg,#f87171 0%,#ef4444 55%,#b91c1c 100%)',
    ic: '🚨',
    label: 'MELEWATI BATAS 3 TAHUN',
    val: '5',
    sub: 'Berisiko kehilangan tunjangan',
    trend: { txt: 'Kritis', blink: true }
  },
];

const FAK_OPTIONS    = ['Semua Fakultas', 'Hukum', 'FMIPA', 'Teknik', 'Ekonomi'];
const STATUS_OPTIONS = ['Semua Status', 'Aman', 'Perhatian', 'Peringatan'];
const TH = ['#', 'Nama Profesor', 'Fakultas', 'Status', 'Total Publikasi', 'Publikasi Terakhir', 'Batas Publikasi'];

export default function EwsPublikasi({ onExport }: Props) {
  const [fakFilter,  setFakFilter]  = useState('Semua Fakultas');
  const [statFilter, setStatFilter] = useState('Semua Status');
  const [yearFilter, setYearFilter] = useState('2025/2026');
  const [activeProfesor, setActiveProfesor] = useState<ProfesorData | null>(null);

  const filtered = PROFESOR_DATA.filter(p => {
    const fakOk  = fakFilter  === 'Semua Fakultas' || p.fak     === fakFilter;
    const statOk = statFilter === 'Semua Status'   || p.status  === statFilter;
    return fakOk && statOk;
  });

  return (
    <>
      {/* ── Section divider ── */}
      <div className="flex items-center gap-3 my-8 mb-[18px]">
        <div className="flex-1 h-px bg-[var(--gray-200)]" />
        <div className="flex items-center gap-[7px] bg-[var(--myunila)] text-white px-4 py-[5px] rounded-full text-[11.5px] font-bold shadow-[0_2px_8px_rgba(11,94,168,0.22)] whitespace-nowrap">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M2 20h20M7 20V10M12 20V4M17 20v-7" />
          </svg>
          EWS Publikasi Dosen
        </div>
        <div className="flex-1 h-px bg-[var(--gray-200)]" />
      </div>

      {/* ── Page header ── */}
      <div className="mb-[6px]">
        <div className="text-[16px] font-bold text-[var(--gray-900)] pb-[6px] relative inline-block">
          Early Warning System Publikasi — Kewajiban Publikasi Profesor & Lektor Kepala
          <span className="absolute bottom-0 left-0 h-[3px] w-[200px] rounded" style={{ background: 'linear-gradient(90deg,#1a56db,transparent)' }} />
        </div>
        <div className="text-[11px] text-[var(--gray-400)] mt-[8px]">
         Monitoring aktivitas publikasi ilmiah dosen dengan jabatan akademik Profesor dan Lektor Kepala sebagai bagian dari pembinaan karier akademik dan penguatan kinerja penelitian.
        </div>
      </div>

      {/* ── Alert ── */}
      <div className="flex gap-3 bg-[#FFF5F5] border-l-[4px] border-[#DC2626] rounded-r-[10px] px-4 py-3 mb-5 mt-4">
        <div className="text-[16px] shrink-0 mt-[1px]">🚨</div>
        <div>
          <div className="text-[12.5px] font-bold text-[var(--gray-900)] mb-[3px]">
            Kewajiban Publikasi Profesor dan Lektor Kepala Tidak Terpantau
          </div>
          <p className="text-[11.5px] text-[var(--gray-600)] leading-[1.6]">
            Profesor dan Lektor Kepala wajib mempublikasikan karya ilmiah setiap <b>3 tahun</b>. Tanpa monitoring otomatis,
            banyak yang terlambat dan berisiko kehilangan tunjangan jabatan. Sistem mengirimkan{' '}
            <b>peringatan otomatis</b> jauh sebelum batas waktu untuk mencegah risiko tersebut.
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {STATS.map(s => (
          <div
            key={s.label}
            className="relative rounded-[14px] p-5 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.15)] min-h-[130px]"
            style={{ background: s.bg }}
          >
            {/* decorative circles */}
            <div className="absolute top-[-18px] right-[-18px] w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute bottom-[-24px] left-[-10px] w-20 h-20 rounded-full bg-white/[0.06]" />

            {/* trend badge top-right */}
            {s.trend && (
              <span className={`absolute top-3 right-3 text-[9.5px] font-bold px-[9px] py-[3px] rounded-full bg-white/20 text-white ${s.trend.blink ? styles.animBlink : ''}`}>
                {s.trend.txt}
              </span>
            )}

            <div className="relative z-10">
              {/* icon */}
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px] bg-white/20 mb-3">
                {s.ic}
              </div>
              <div className="text-[9px] font-bold text-white/75 uppercase tracking-[0.8px] mb-[4px]">{s.label}</div>
              <div className="text-[30px] font-extrabold text-white leading-none mb-[4px]">{s.val}</div>
              {s.sub && <div className="text-[10px] text-white/65">{s.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="bg-white border border-[var(--gray-200)] rounded-[11px] shadow-[var(--card-shadow)] overflow-hidden mb-[18px]">
        {/* table toolbar */}
        <div className="px-4 py-3 border-b border-[var(--gray-100)] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-[7px] text-[12.5px] font-bold text-[var(--gray-900)]">
            <span className="w-[3px] h-[16px] rounded-[2px] inline-block" style={{ background: 'linear-gradient(180deg,#1a56db,#073864)' }} />
            Status Publikasi Profesor
          </div>
          <div className="flex gap-[6px] items-center flex-wrap">
            <select value={fakFilter}  onChange={e => setFakFilter(e.target.value)}  className={styles.filterSelect}>
              {FAK_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <select value={statFilter} onChange={e => setStatFilter(e.target.value)} className={styles.filterSelect}>
              {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className={styles.filterSelect}>
              <option>2025/2026</option>
              <option>2024/2025</option>
            </select>
            <button
              onClick={() => onExport('EWS Publikasi Profesor', 'Status kewajiban publikasi Profesor UNILA', filtered.map(p => ({ nama: p.nm, fakultas: p.fak, totalPublikasi: p.totalPub, pubTerakhir: p.lastPub, batas: p.batas, status: p.status })))}
              className={`${styles.noPrint} inline-flex items-center gap-[5px] px-[11px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-white border-[1.5px] border-[var(--myunila-100,#CCE5F5)] text-[var(--myunila)] cursor-pointer transition-all duration-[120ms] whitespace-nowrap hover:bg-[#EEF5FC] hover:border-[var(--myunila)]`}
            >
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Ekspor
            </button>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {TH.map(h => (
                  <th key={h} className="px-[13px] py-[9px] text-left text-[9.5px] font-bold text-[var(--gray-400)] uppercase tracking-[0.6px] border-b border-[var(--gray-100)] bg-[var(--gray-50)] whitespace-nowrap">
                    {h} {h !== '#' && h !== 'Status' ? <span className="text-[var(--gray-300)]">:</span> : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.no} onClick={() => setActiveProfesor(p)} className="cursor-pointer transition-colors duration-100 hover:bg-[#EFF6FF]">
                  <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] text-[11px] text-[var(--gray-400)]">{p.no}</td>
                  <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)]">
                    <b className="text-[12px] text-[var(--gray-900)]">{p.nm}</b>
                    <span className="text-[9.5px] text-[#94A3B8] ml-[5px]">👆 Profil</span>
                  </td>
                  <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] text-[11.5px] text-[var(--gray-600)]">{p.fak}</td>
                  <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)]">
                    <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[9px] py-[3px] text-[11px] ${p.statusCls}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)]">
                    <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] ${p.totalPub >= 5 ? 'bg-[#D1FAE5] text-[#065f46]' : 'bg-[#FEE2E2] text-[#991b1b]'}`}>
                      {p.totalPub} Jurnal
                    </span>
                  </td>
                  <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] text-[11.5px] text-[var(--gray-600)]">{p.lastPub}</td>
                  <td className="px-[13px] py-[11px] border-b border-[var(--gray-100)] text-[11.5px] text-[var(--gray-600)]">{p.batas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="px-[14px] py-[9px] flex items-center gap-1 border-t border-[var(--gray-100)]">
          <button className="px-[9px] py-1 rounded-[5px] border-[1.5px] border-[var(--myunila)] bg-[var(--myunila)] text-[11px] font-semibold text-white cursor-pointer">1</button>
          <button className="px-[9px] py-1 rounded-[5px] border-[1.5px] border-[var(--gray-200)] bg-white text-[11px] font-semibold text-[var(--gray-600)] cursor-pointer">2</button>
          <span className="ml-auto text-[10.5px] text-[var(--gray-400)]">1–{filtered.length} dari 42 Profesor</span>
        </div>
      </div>

      <ProfesorModal
        open={activeProfesor !== null}
        profesor={activeProfesor}
        onClose={() => setActiveProfesor(null)}
      />
    </>
  );
}