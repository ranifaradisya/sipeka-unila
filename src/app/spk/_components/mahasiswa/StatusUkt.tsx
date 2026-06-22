'use client';
import styles from '../../page.module.css';

import { useState } from 'react';
import { Pagination, SecDiv } from '../shared/Helpers';

interface Props {
  onExport: (title: string, desc: string, data?: Record<string, unknown>[]) => void;
}

const STAT_CARDS = [
  { color: 'red',   icon: '⚠️', label: 'Total Kasus Ditemukan', value: '47',        sub: 'Mahasiswa aktif tanpa UKT' },
  { color: 'amber', icon: '📅', label: 'Rata-rata Tidak Bayar',   value: '3.7',       sub: 'semester berturut-turut' },
  { color: 'blue',  icon: '💰', label: 'Estimasi Tunggakan Total', value: 'Rp 847 Jt', sub: 'Estimasi keseluruhan kasus' },
];

const COLOR_MAP: Record<string, string> = {
  red:   'from-[#f87171] via-[#ef4444] to-[#b91c1c]',
  amber: 'from-[#fcd34d] via-[#f59e0b] to-[#b45309]',
  blue:  'from-[#1d6fc4] via-[#1a56db] to-[#073864]',
};
const SHADOW_MAP: Record<string, string> = {
  red:   '0 8px 28px rgba(220,38,38,.35)',
  amber: '0 8px 28px rgba(217,119,6,.35)',
  blue:  '0 8px 28px rgba(11,94,168,.35)',
};

interface AnomalRecord {
  npm: string;
  nm: string;
  prodi: string;
  ang: string;
  statusSiakad: 'Aktif';
  semTerakhirBayar: string;
  semMenunggak: number;
  totalTunggakan: string;
  keterangan: string;
}

const ANOMALI: AnomalRecord[] = [
  { npm: '2019012034', nm: 'Ahmad Rifai',      prodi: 'Manajemen',          ang: '2019', statusSiakad: 'Aktif', semTerakhirBayar: 'Genap 2022/2023', semMenunggak: 4, totalTunggakan: 'Rp 21.200.000', keterangan: 'Tidak ada pembayaran sejak Ganjil 2023/2024' },
  { npm: '2020033091', nm: 'Bintang Cahaya',   prodi: 'Teknik Sipil',       ang: '2020', statusSiakad: 'Aktif', semTerakhirBayar: 'Ganjil 2023/2024', semMenunggak: 3, totalTunggakan: 'Rp 18.600.000', keterangan: 'Tidak ada pembayaran sejak Genap 2023/2024' },
  { npm: '2019045011', nm: 'Citra Dewi',       prodi: 'Ilmu Hukum',         ang: '2019', statusSiakad: 'Aktif', semTerakhirBayar: 'Ganjil 2023/2024', semMenunggak: 3, totalTunggakan: 'Rp 15.900.000', keterangan: 'Tidak ada pembayaran sejak Genap 2023/2024' },
  { npm: '2020011077', nm: 'Dani Pratama',     prodi: 'Kimia',              ang: '2020', statusSiakad: 'Aktif', semTerakhirBayar: 'Genap 2021/2022', semMenunggak: 5, totalTunggakan: 'Rp 26.500.000', keterangan: 'Tidak ada pembayaran sejak Ganjil 2022/2023' },
  { npm: '2021023041', nm: 'Eka Pertiwi',      prodi: 'Pendidikan Biologi', ang: '2021', statusSiakad: 'Aktif', semTerakhirBayar: 'Genap 2023/2024', semMenunggak: 2, totalTunggakan: 'Rp 10.400.000', keterangan: 'Tidak ada pembayaran sejak Ganjil 2024/2025' },
  { npm: '2019031088', nm: 'Fajar Setiawan',   prodi: 'Teknik Informatika', ang: '2019', statusSiakad: 'Aktif', semTerakhirBayar: 'Ganjil 2022/2023', semMenunggak: 5, totalTunggakan: 'Rp 28.750.000', keterangan: 'Tidak ada pembayaran sejak Genap 2022/2023' },
  { npm: '2020044019', nm: 'Gita Maharani',    prodi: 'Akuntansi',          ang: '2020', statusSiakad: 'Aktif', semTerakhirBayar: 'Genap 2023/2024', semMenunggak: 2, totalTunggakan: 'Rp 11.200.000', keterangan: 'Tidak ada pembayaran sejak Ganjil 2024/2025' },
  { npm: '2021017062', nm: 'Hendra Wijaya',    prodi: 'Ilmu Komunikasi',    ang: '2021', statusSiakad: 'Aktif', semTerakhirBayar: 'Ganjil 2023/2024', semMenunggak: 3, totalTunggakan: 'Rp 16.800.000', keterangan: 'Tidak ada pembayaran sejak Genap 2023/2024' },
  { npm: '2019056003', nm: 'Indah Lestari',    prodi: 'Manajemen',          ang: '2019', statusSiakad: 'Aktif', semTerakhirBayar: 'Genap 2021/2022', semMenunggak: 6, totalTunggakan: 'Rp 33.600.000', keterangan: 'Tidak ada pembayaran sejak Ganjil 2022/2023' },
  { npm: '2020028077', nm: 'Joko Susilo',      prodi: 'Teknik Sipil',       ang: '2020', statusSiakad: 'Aktif', semTerakhirBayar: 'Ganjil 2023/2024', semMenunggak: 3, totalTunggakan: 'Rp 19.500.000', keterangan: 'Tidak ada pembayaran sejak Genap 2023/2024' },
  { npm: '2021039014', nm: 'Kartika Sari',     prodi: 'Kimia',              ang: '2021', statusSiakad: 'Aktif', semTerakhirBayar: 'Genap 2023/2024', semMenunggak: 2, totalTunggakan: 'Rp 10.800.000', keterangan: 'Tidak ada pembayaran sejak Ganjil 2024/2025' },
  { npm: '2019007055', nm: 'Lukman Hakim',     prodi: 'Ilmu Hukum',         ang: '2019', statusSiakad: 'Aktif', semTerakhirBayar: 'Genap 2022/2023', semMenunggak: 4, totalTunggakan: 'Rp 22.400.000', keterangan: 'Tidak ada pembayaran sejak Ganjil 2023/2024' },
];

const getAksi = (sem: number) => sem >= 4 ? 'Perlu Verifikasi' : 'Pantau';
const AKSI_CHIP: Record<string, string> = {
  'Perlu Verifikasi': 'bg-[#FEE2E2] text-[#991b1b]',
  'Pantau':           'bg-[#FEF3C7] text-[#92400e]',
};

const SEM_COLOR = (n: number) =>
  n >= 5 ? '#DC2626' : n >= 3 ? '#D97706' : '#059669';

export default function StatusUkt({ onExport }: Props) {
  const [prodiFilter, setProdiFilter] = useState('Semua Prodi');
  const [angFilter, setAngFilter]     = useState('Semua Angkatan');
  const [yearFilter, setYearFilter]   = useState('2025/2026');
  const [selected, setSelected]       = useState<AnomalRecord | null>(null);

  const filtered = ANOMALI.filter(a => {
    const prodiOk = prodiFilter === 'Semua Prodi' || a.prodi === prodiFilter;
    const angOk   = angFilter === 'Semua Angkatan' || a.ang === angFilter;
    return prodiOk && angOk;
  });

  return (
    <>
      <SecDiv
        label="Anomali Status UKT"
        icon={
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
      />

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-[16px] font-bold text-[#0F172A] mb-[2px] pb-[6px] relative" style={{ display: 'inline-block' }}>
            Monitoring Pembayaran UKT Mahasiswa
            <span className="absolute bottom-0 left-0 h-[2px] w-full rounded" style={{ background: 'linear-gradient(90deg,#1a56db,transparent)' }} />
          </div>
          <div className="text-[11px] text-[#64748B] mt-[4px]">
            Mahasiswa tercatat "Aktif" di SIAKADU namun tidak membayar UKT selama beberapa semester
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="flex items-start gap-3 bg-[#FEE2E2] border border-[#FECACA] rounded-[10px] p-[12px_14px] mb-5">
        <div className="text-[18px] shrink-0 mt-[1px]">🔍</div>
        <div className="text-[12px] text-[#7f1d1d]">
          <strong className="font-bold">Monitoring Ketidaksesuaian Pembayaran UKT</strong>
          <p className="mt-[4px] leading-[1.6]">
            Di SIAKADU, mahasiswa tercatat <b>"Aktif"</b> padahal sudah <b>3–4 semester tidak membayar UKT</b> dan
            menghilang. Data ini tidak sinkron antara sistem keuangan dan akademik, menyebabkan distorsi pada
            rasio mahasiswa aktif dan data akreditasi.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-[18px] mb-5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {STAT_CARDS.map(c => (
          <div key={c.label}
            className={`bg-gradient-to-br ${COLOR_MAP[c.color]} border-none rounded-[18px] p-[22px_20px_20px] flex flex-col min-h-[178px] relative overflow-hidden`}
            style={{ boxShadow: SHADOW_MAP[c.color] }}>
            <span className="absolute top-[-22px] right-[-22px] w-[100px] h-[100px] rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,.09)' }} />
            <span className="absolute bottom-[-30px] left-[-20px] w-[90px] h-[90px] rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,.05)' }} />
            <div className="flex items-start justify-between mb-[14px]">
              <span />
              <div className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center text-[21px] shrink-0" style={{ background: 'rgba(255,255,255,.22)' }}>
                {c.icon}
              </div>
            </div>
            <div className="text-[11.5px] font-bold text-white/95 tracking-[.3px] mb-1 uppercase">{c.label}</div>
            <div className="text-[42px] font-extrabold leading-none text-white tracking-[-1px] mb-[5px]">{c.value}</div>
            <div className="text-[10.5px] text-white/70 mt-auto">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Card tabel utama (replace antara daftar ↔ detail) ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-[12px] border-b border-[#F1F5F9] bg-[#F8FAFC] flex-wrap">
          <div className="flex items-center gap-[8px]">
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-[5px] px-[9px] py-[5px] rounded-[7px] text-[11px] font-semibold bg-white border border-[#E2E8F0] text-[#475569] cursor-pointer hover:bg-[#F1F5F9] transition-colors mr-1"
              >
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Kembali
              </button>
            )}
            <span className="w-[3px] h-[16px] rounded-[2px] inline-block shrink-0" style={{ background: 'linear-gradient(180deg,#1a56db,#073864)' }} />
            <div className="text-[12.5px] font-bold text-[#0F172A] flex items-center gap-[6px]">
              {selected ? (
                <>
                  <span className="text-[#94A3B8] font-normal cursor-pointer hover:text-[#1a56db] transition-colors"
                    onClick={() => setSelected(null)}>
                    Daftar Anomali
                  </span>
                  <svg width="10" height="10" fill="none" stroke="#CBD5E1" strokeWidth={2} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                  <span>{selected.nm}</span>
                </>
              ) : (
                'Pemantauan Status Pembayaran UKT'
              )}
            </div>
          </div>

          <div className="flex items-center gap-[7px] flex-wrap">
            {!selected && (
              <>
                <select className={styles.filterSelect}
                  value={prodiFilter} onChange={e => setProdiFilter(e.target.value)}>
                  <option>Semua Prodi</option>
                  <option>Manajemen</option>
                  <option>Teknik Sipil</option>
                  <option>Teknik Informatika</option>
                  <option>Ilmu Hukum</option>
                  <option>Kimia</option>
                  <option>Akuntansi</option>
                  <option>Ilmu Komunikasi</option>
                  <option>Pendidikan Biologi</option>
                </select>
                <select className={styles.filterSelect}
                  value={angFilter} onChange={e => setAngFilter(e.target.value)}>
                  <option>Semua Angkatan</option>
                  <option>2019</option>
                  <option>2020</option>
                  <option>2021</option>
                </select>
                <select className={styles.filterSelect}
                  value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                  <option>2025/2026</option>
                  <option>2024/2025</option>
                </select>
              </>
            )}
            <button
              onClick={() => onExport(
                selected ? `Detail ${selected.nm}` : 'Mahasiswa Aktif dengan Tunggakan UKT',
                selected ? `Detail anomali UKT mahasiswa ${selected.nm}` : 'Mahasiswa aktif tanpa pembayaran UKT'
              , (selected ? [selected] : filtered).map(a => ({ npm: a.npm, nama: a.nm, prodi: a.prodi, angkatan: a.ang, semTerakhirBayar: a.semTerakhirBayar, semMenunggak: a.semMenunggak, totalTunggakan: a.totalTunggakan, keterangan: a.keterangan })))}
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

        {/* ── Tabel daftar anomali ── */}
        {!selected && (
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {['NPM', 'Nama', 'Prodi', 'Angkatan', 'Status SIAKADU', 'Semester Tidak Bayar', 'Aksi'].map(h => (
                    <th key={h} className="text-left text-[10.5px] font-bold text-[#94A3B8] uppercase tracking-[.7px] px-4 py-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.npm}
                    className="border-b border-[#F8FAFC] transition-colors duration-[100ms] cursor-pointer hover:bg-[#F8FAFC]"
                    onClick={() => setSelected(a)}>
                    <td className="px-4 py-[11px] text-[#475569] text-[11px]">{a.npm}</td>
                    <td className="px-4 py-[11px]"><b className="text-[#0F172A]">{a.nm}</b></td>
                    <td className="px-4 py-[11px] text-[#475569]">{a.prodi}</td>
                    <td className="px-4 py-[11px] text-[#475569]">{a.ang}</td>
                    <td className="px-4 py-[11px]">
                      <span className="inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] bg-[#D1FAE5] text-[#065f46]">
                        Aktif
                      </span>
                    </td>
                    <td className="px-4 py-[11px]">
                      <span className="font-bold" style={{ color: SEM_COLOR(a.semMenunggak) }}>
                        {a.semMenunggak} semester
                      </span>
                    </td>
                    <td className="px-4 py-[11px]">
                      <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] ${AKSI_CHIP[getAksi(a.semMenunggak)]}`}>
                        {getAksi(a.semMenunggak)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Tabel detail mahasiswa ── */}
        {selected && (
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {[
                    { label: 'Nama Mahasiswa',           cls: '' },
                    { label: 'NPM',                      cls: 'w-[130px]' },
                    { label: 'Prodi & Angkatan',         cls: 'w-[180px]' },
                    { label: 'Status SIAKADU',            cls: 'w-[120px]' },
                    { label: 'Sem. Terakhir Bayar',      cls: 'w-[170px]' },
                    { label: 'Jml. Menunggak',           cls: 'w-[120px]' },
                    { label: 'Total Tunggakan',          cls: 'w-[150px]' },
                    { label: 'Keterangan',               cls: 'w-[260px]' },
                  ].map(h => (
                    <th key={h.label}
                      className={`text-left text-[10.5px] font-bold text-[#94A3B8] uppercase tracking-[.7px] px-3 py-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9] whitespace-nowrap ${h.cls}`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#F8FAFC]">
                  <td className="px-3 py-[13px]"><b className="text-[#0F172A] font-semibold">{selected.nm}</b></td>
                  <td className="px-3 py-[13px] text-[#475569]">{selected.npm}</td>
                  <td className="px-3 py-[13px]">
                    <div className="text-[#0F172A] font-medium">{selected.prodi}</div>
                    <div className="text-[10.5px] text-[#94A3B8] mt-[1px]">Angkatan {selected.ang}</div>
                  </td>
                  <td className="px-3 py-[13px]">
                    <span className="inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] bg-[#D1FAE5] text-[#065f46]">
                      {selected.statusSiakad}
                    </span>
                  </td>
                  <td className="px-3 py-[13px] text-[#475569]">{selected.semTerakhirBayar}</td>
                  <td className="px-3 py-[13px]">
                    <span className="font-bold text-[13px]" style={{ color: SEM_COLOR(selected.semMenunggak) }}>
                      {selected.semMenunggak} semester
                    </span>
                  </td>
                  <td className="px-3 py-[13px]">
                    <span className="font-bold text-[13px] text-[#DC2626]">{selected.totalTunggakan}</span>
                  </td>
                  <td className="px-3 py-[13px] text-[#475569] text-[11px] leading-[1.6]">{selected.keterangan}</td>
                </tr>
              </tbody>
            </table>

            {/* Aksi chip di bawah tabel */}
            <div className="px-4 py-[12px] border-t border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
              <span className="text-[11px] text-[#64748B]">Status tindakan saat ini:</span>
              <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[12px] py-[4px] text-[11px] ${AKSI_CHIP[getAksi(selected.semMenunggak)]}`}>
                {getAksi(selected.semMenunggak)}
              </span>
            </div>
          </div>
        )}

        <Pagination
          current={1}
          total={3}
          info={selected
            ? '1 dari 1 entri'
            : `1–${filtered.length} dari 47 data anomali`}
        />
      </div>
    </>
  );
}