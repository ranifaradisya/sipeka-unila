'use client';

import { useState } from 'react';
import { DOSEN } from '../data';
import { StatusChip, PendChip, Pagination, Sel } from '../shared/Helpers';
import styles from '../../page.module.css';

interface Props {
  onOpenDosen: (index: number) => void;
  onExport: (title: string, desc: string, data?: Record<string, unknown>[]) => void;
}

export default function DataDosen({ onOpenDosen, onExport }: Props) {
  const [search, setSearch] = useState('');
  const [fak, setFak]       = useState('Semua Fakultas');
  const [pend, setPend]     = useState('Semua Pendidikan');
  const [year, setYear]     = useState('2025/2026');

  const filtered = DOSEN.filter(d => {
    const q = search.toLowerCase();
    const matchQ    = !q || d.nm.toLowerCase().includes(q) || d.nip.includes(q);
    const matchFak  = fak === 'Semua Fakultas'  || d.fak === fak;
    const matchPend = pend === 'Semua Pendidikan' || d.pend === pend;
    return matchQ && matchFak && matchPend;
  });

  return (
    <>
  <div className="flex items-center gap-3 my-8 mb-[18px]">
    <div className="flex-1 h-px bg-[var(--gray-200)]" />

    <div className="flex items-center gap-[7px] bg-[var(--myunila)] text-white px-4 py-[5px] rounded-full text-[11.5px] font-bold shadow-[0_2px_8px_rgba(11,94,168,0.22)] whitespace-nowrap">
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
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
        Data Dosen
    </div>
    <div className="flex-1 h-px bg-[var(--gray-200)]" />
  </div>

<div className="flex items-start justify-between mb-4 flex-wrap gap-[7px]">
  <div>
    <div
      className="text-[18px] font-bold text-[var(--gray-900)] mb-[2px] pb-[6px] relative"
      style={{ display: 'inline-block' }}
    >
      Data Dosen Aktif

      <span
        className="absolute bottom-0 left-0 h-[2px] w-full rounded"
        style={{
          background: 'linear-gradient(90deg,#1a56db,transparent)',
        }}
      />
    </div>

    <div className="text-[11px] text-[#64748B] mt-[4px]">
      348 dosen aktif terdaftar semester ini · Klik baris untuk melihat profil lengkap
    </div>
  </div>
</div>

<div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden mb-5">

        <div className="px-[18px] py-[14px] border-b border-[#F1F5F9] flex items-center justify-between gap-[10px] flex-wrap bg-white">
          <div className={styles.theadTitle}>Daftar Dosen Aktif</div>
          <div className="flex gap-[7px] items-center flex-wrap">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama / NIP..."
              className={styles.searchInput}
            />
            <Sel value={fak} onChange={e => setFak(e.target.value)}>
              <option>Semua Fakultas</option><option>FMIPA</option><option>Teknik</option>
              <option>Ekonomi &amp; Bisnis</option><option>Hukum</option><option>FISIP</option><option>FKIP</option>
            </Sel>
            <Sel value={pend} onChange={e => setPend(e.target.value)}>
              <option>Semua Pendidikan</option><option>S1</option><option>S2</option><option>S3</option>
            </Sel>
            <Sel value={year} onChange={e => setYear(e.target.value)} sm>
              <option>2025/2026</option><option>2024/2025</option><option>2023/2024</option>
            </Sel>
            <button onClick={() => onExport('Data Dosen', 'Profil lengkap 348 dosen aktif', filtered.map(d => ({ nip: d.nip, nama: d.nm, fakultas: d.fak, prodi: d.prodi, pendidikan: d.pend, jabfung: d.jabfung, gol: d.gol, masa: d.masa, sks: d.sks, pub: d.pub, bimb: d.bimb, status: d.status })))} className="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] text-[11px] font-semibold bg-white border-[1.5px] border-[#CCE5F5] text-[#1a56db] cursor-pointer transition-all duration-[130ms] whitespace-nowrap hover:bg-[#EEF5FC] hover:border-[#1a56db]">
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Ekspor
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {['#','Nama Dosen','Fakultas','Pendidikan','Jabatan Fungsional','Masa Kerja','Status'].map(h => (
                  <th key={h} className={`px-4 py-[11px] text-left text-[10px] font-bold text-[#64748B] uppercase tracking-[.8px] border-b-2 border-[#F1F5F9] whitespace-nowrap select-none ${styles.thSort}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, idx) => (
                <tr
                  key={d.id}
                  onClick={() => onOpenDosen(DOSEN.indexOf(d))}
                  className="cursor-pointer transition-colors duration-[100ms] hover:bg-[#F0F7FF] [&:last-child_td]:border-b-0"
                >
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[11px] text-[#94A3B8] align-middle">{d.id}</td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] align-middle">
                    <b className="text-[12.5px] text-[#0F172A]">{d.nm}</b>
                    <span className="text-[9.5px] text-[#94A3B8] ml-[5px]">👆 Profil</span>
                  </td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[12.5px] text-[#475569] align-middle">{d.fak}</td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] align-middle"><PendChip pend={d.pend} /></td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[12.5px] text-[#475569] align-middle">{d.jabfung}</td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] text-[12.5px] text-[#475569] align-middle">{d.masa}</td>
                  <td className="px-4 py-[13px] border-b border-[#F1F5F9] align-middle"><StatusChip status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination current={1} total={3} info={`1–${filtered.length} dari 348 data`} />
      </div>
    </>
  );
}