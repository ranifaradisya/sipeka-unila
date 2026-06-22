'use client';

import { useState } from 'react';
import { DOSEN } from '../data';
import { PendChip, Pagination, Sel} from '../shared/Helpers';
import styles from '../../page.module.css';

interface Props {
  onOpenDosen: (index: number) => void;
  onExport: (title: string, desc: string, data?: Record<string, unknown>[]) => void;
}

const ANALYSIS_CARDS = [
  { ic: '⚠️', chipCls: 'bg-[#FEE2E2] text-[#991b1b]', chip: 'Peringatan', label: 'Pendidikan < S2',         count: 3, color: '#D97706', desc: 'Belum memenuhi standar minimum S2' },
  { ic: '🚨', chipCls: 'bg-[#FEE2E2] text-[#991b1b]',  chip: 'Kritis',    label: 'Tanpa Jabfung >2th',      count: 27, color: '#DC2626', desc: 'Alert otomatis 6 bulan sebelum batas' },
  { ic: '📅', chipCls: 'bg-[#FEF3C7] text-[#92400e]',  chip: 'Perhatian', label: 'Kenaikan Pangkat >10th',  count: 19, color: '#0F172A', desc: 'Alert 3 tahun sebelum batas waktu' },
  { ic: '📚', chipCls: 'bg-[#FEF3C7] text-[#92400e]',  chip: 'Perhatian', label: 'Tanpa S3 >10th',          count: 31, color: '#D97706', desc: 'Masa kerja 10+ tahun, belum S3' },
  { ic: '🎓', chipCls: 'bg-[#FEF3C7] text-[#92400e]',  chip: 'Perhatian', label: 'S3 >5th Belum Selesai',   count: 8,  color: '#1a56db', desc: 'Studi S3 lebih dari 5 tahun' },
];

const CATEGORY_CHIP: Record<string, string> = {
  Perhatian:  'bg-[#FEF3C7] text-[#92400e]',
  Peringatan: 'bg-[#FEE2E2] text-[#991b1b]',
  'Perlu S3': 'bg-[#FEF3C7] text-[#92400e]',
  'Pantau S3':'bg-[#DBEAFE] text-[#1e40af]',
};

const KATEGORI_OPTIONS = ['Semua Kategori', 'Perhatian', 'Peringatan', 'Perlu S3', 'Pantau S3'] as const;

export default function AnalisaKepegawaian({ onOpenDosen, onExport }: Props) {
  const [kategori, setKategori] = useState('Semua Kategori');
  const [year, setYear]         = useState('2025/2026');

  const abnormal = DOSEN.filter(d => d.status !== 'Normal');
  const filtered = kategori === 'Semua Kategori' ? abnormal : abnormal.filter(d => d.status === kategori);

  return (
    <>
      <div className="flex items-center gap-3 my-8 mb-[18px]">
        <div
          className="flex-1 h-px"
          style={{
            background:
              'linear-gradient(90deg,rgba(148,163,184,.08),rgba(148,163,184,.45),transparent)',
          }}
        />
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
            <path d="M3 3v18h18" />
            <path d="M7 14l3-3 3 2 4-5" />
          </svg>
          Analisis Kepegawaian
        </div>
        <div
          className="flex-1 h-px"
          style={{
            background:
              'linear-gradient(270deg,rgba(148,163,184,.08),rgba(148,163,184,.45),transparent)',
          }}
        />
      </div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div
            className="text-[16px] font-bold text-[#0F172A] mb-[2px] pb-[6px] relative inline-block"
          >
            Analisis Kepegawaian
            <span
              className="absolute bottom-0 left-0 h-[2px] rounded-full"
              style={{
                width: '100%',
                background:
                  'linear-gradient(90deg,#1a56db 0%,rgba(11,94,168,.55) 45%,transparent 100%)',
              }}
            />
          </div>
          <div className="text-[11px] text-[#64748B] mt-[5px] leading-[1.55]">
            Identifikasi dan monitoring dosen berdasarkan kriteria kepegawaian yang memerlukan perhatian khusus
          </div>
        </div>
      </div>

      {/* Analysis cards */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
        {ANALYSIS_CARDS.map(c => (
          <div key={c.label} className={`${styles.acCard} bg-white border border-[#F1F5F9] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)]`}>
            <div className="flex items-center justify-between mb-[10px]">
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[14px]"
                style={{ background: 'rgba(0,0,0,.04)' }}>{c.ic}</div>
              <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] ${c.chipCls}`}>{c.chip}</span>
            </div>
            <div className="text-[11.5px] font-semibold text-[#334155] mb-1">{c.label}</div>
            <div className="text-[28px] font-extrabold text-[#0F172A] leading-none mb-[5px]" style={{ color: c.color }}>{c.count}</div>
            <div className="text-[10.5px] text-[#94A3B8] leading-[1.5]">{c.desc}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 px-4 py-[13px] rounded-[10px] mb-[14px] bg-[#DBEAFE] border-l-4 border-[#2563EB]">
        <div className="text-[16px] shrink-0 mt-[1px]">⏰</div>
        <div>
          <strong className="text-[12.5px] font-bold text-[#0F172A]">Alert Otomatis Aktif</strong>
          <p className="text-[11.5px] text-[#475569] mt-[3px] leading-[1.6]">
            Sistem mengirim notifikasi kepada dosen dan pimpinan <b>3 tahun sebelum</b> batas kenaikan pangkat dan <b>6 bulan sebelum</b> batas jabfung.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden mb-5">
        <div className="px-[18px] py-[14px] border-b border-[#F1F5F9] flex items-center justify-between gap-[10px] flex-wrap bg-white">
          <div className={styles.theadTitle}>Dosen yang Memerlukan Tindak Lanjut</div>
          <div className="flex gap-[7px] items-center flex-wrap">
            <Sel value={kategori} onChange={e => setKategori(e.target.value)} >
              {KATEGORI_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
            </Sel>
            <Sel value={year} onChange={e => setYear(e.target.value)} >
              <option>2025/2026</option><option>2024/2025</option>
            </Sel>
            <button onClick={() => onExport('Analisis Dosen', 'Rekap kategori masalah dosen', filtered.map(d => ({ nip: d.nip, nama: d.nm, fakultas: d.fak, prodi: d.prodi, jabfung: d.jabfung, masa: d.masa, status: d.status })))} className="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] text-[11px] font-semibold bg-white border-[1.5px] border-[#CCE5F5] text-[#1a56db] cursor-pointer transition-all duration-[130ms] whitespace-nowrap hover:bg-[#EEF5FC] hover:border-[#1a56db]">
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Ekspor
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {['#','Nama Dosen','Fakultas','Masa Kerja','Pendidikan','Kategori'].map(h => (
                  <th key={h} className={`px-4 py-[11px] text-left text-[10px] font-bold text-[#64748B] uppercase tracking-[.8px] border-b-2 border-[#F1F5F9] whitespace-nowrap select-none ${styles.thSort}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} onClick={() => onOpenDosen(DOSEN.indexOf(d))}
                  className="cursor-pointer transition-colors duration-[100ms] hover:bg-[#F0F7FF] [&:last-child_td]:border-b-0">
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[11px] text-[#94A3B8] align-middle">{i + 1}</td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] align-middle">
                    <b className="text-[12.5px] text-[#0F172A]">{d.nm}</b>
                    <span className="text-[9.5px] text-[#94A3B8] ml-[5px]">👆 Profil</span>
                  </td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[12.5px] text-[#475569] align-middle">{d.fak}</td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[12.5px] text-[#475569] align-middle">{d.masa}</td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] align-middle"><PendChip pend={d.pend} /></td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] align-middle">
                    <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] ${CATEGORY_CHIP[d.status] ?? 'bg-[#F1F5F9] text-[#475569]'}`}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination current={1} total={1} info={`1–${filtered.length} dari ${filtered.length} data`} />
      </div>
    </>
  );
}