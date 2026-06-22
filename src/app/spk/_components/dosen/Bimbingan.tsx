'use client';
import styles from '../../page.module.css';
import { useBimbinganCharts } from '../useSpkCharts';

import { useState } from 'react';
import { BIMB, Bimb, BimbMhs } from '../data';
import { BimbChip, Pagination, SecDiv } from '../shared/Helpers';
import GrafikBimbingan, { type FakultasBimbingan } from './GrafikBimbingan';

// Rata-rata beban bimbingan per fakultas, dihitung dari seluruh data dosen
// (bukan dari hasil filter tabel), supaya grafik tetap menggambarkan kondisi
// fakultas secara utuh dan tidak bergantung pada jumlah dosen individual.
const FAK_BIMB_AVG: FakultasBimbingan[] = (() => {
  const sum: Record<string, { total: number; count: number }> = {};
  BIMB.forEach(b => {
    if (!sum[b.fak]) sum[b.fak] = { total: 0, count: 0 };
    sum[b.fak].total += b.total;
    sum[b.fak].count += 1;
  });
  return Object.entries(sum)
    .map(([fak, { total, count }]) => ({ fak, avg: total / count }))
    .sort((a, b) => b.avg - a.avg);
})();

interface Props {
  onExport: (title: string, desc: string, data?: Record<string, unknown>[]) => void;
}

const STAT_CARDS = [
  { color: 'blue',  icon: '👨‍🏫', label: 'Rata-rata Bimbingan',     value: '8.2', sub: 'mahasiswa per dosen' },
  { color: 'red',   icon: '🔴',   label: 'Beban Tinggi (>12 mhs)',   value: '28',  sub: 'dosen kelebihan beban bimbingan', trend: 'Tinggi' },
  { color: 'amber', icon: '🟡',   label: 'Beban Rendah (<5 mhs)',    value: '22',  sub: 'dosen kurang beban bimbingan',    trend: 'Rendah' },
  { color: 'green', icon: '✅',   label: 'Beban Ideal (5–12 mhs)',   value: '298', sub: 'dosen dalam rentang ideal',       trend: 'Ideal'  },
];

const COLOR_MAP: Record<string, string> = {
  blue:  'from-[#1d6fc4] via-[#1a56db] to-[#073864]',
  red:   'from-[#f87171] via-[#ef4444] to-[#b91c1c]',
  amber: 'from-[#fcd34d] via-[#f59e0b] to-[#b45309]',
  green: 'from-[#34d399] via-[#10b981] to-[#047857]',
};
const SHADOW_MAP: Record<string, string> = {
  blue:  '0 8px 28px rgba(11,94,168,.35)',
  red:   '0 8px 28px rgba(220,38,38,.35)',
  amber: '0 8px 28px rgba(217,119,6,.35)',
  green: '0 8px 28px rgba(5,150,105,.35)',
};
const TREND_COLOR: Record<string, string> = {
  Tinggi: 'text-[#f87171]', Rendah: 'text-[#fcd34d]', Ideal: 'text-[#34d399]',
};

// Build fakultas & jenjang list from BIMB data
const ALL_FAKULTAS = ['Semua Fakultas', ...Array.from(new Set(BIMB.map(b => b.fak))).sort()];
const ALL_JENJANG  = ['Semua Jenjang',  ...Array.from(new Set(BIMB.map(b => b.jenjang))).sort()];

function MhsStatusBadge({ status }: { status: BimbMhs['status'] }) {
  if (status === 'Selesai') {
    return (
      <span className="inline-flex items-center gap-[5px] text-[11px] font-semibold text-[#475569]">
        <span className="w-[7px] h-[7px] rounded-full inline-block bg-[#94A3B8]" />
        Selesai
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-[5px] text-[11px] font-semibold text-[#059669]">
      <span className="w-[7px] h-[7px] rounded-full inline-block bg-[#059669]" />
      Aktif
    </span>
  );
}

const SEL_CLS = "";  // replaced by filterSelect

export default function Bimbingan({ onExport }: Props) {
  useBimbinganCharts();
  const [fakFilter,    setFakFilter]    = useState('Semua Fakultas');
  const [jenjangFilter, setJenjangFilter] = useState('Semua Jenjang');
  const [katFilter,    setKatFilter]    = useState('Semua Kategori');
  const [yearFilter,   setYearFilter]   = useState('2025/2026');
  const [selectedDosen, setSelectedDosen] = useState<Bimb | null>(null);
  const [statusFilter,  setStatusFilter]  = useState('Semua Status');

  const filtered: Bimb[] = BIMB.filter(b => {
    const fakOk     = fakFilter     === 'Semua Fakultas' || b.fak     === fakFilter;
    const jenjangOk = jenjangFilter === 'Semua Jenjang' || b.jenjang === jenjangFilter;
    const katOk =
      katFilter === 'Semua Kategori' ||
      (katFilter === 'Tinggi >12' && b.total > 12) ||
      (katFilter === 'Ideal 5–12' && b.total >= 5 && b.total <= 12) ||
      (katFilter === 'Rendah <5'  && b.total < 5);
    return fakOk && jenjangOk && katOk;
  });

  const mhsRaw  = selectedDosen?.mahasiswa ?? [];
  const mhsList = mhsRaw.filter(m =>
    statusFilter === 'Semua Status' || m.status === statusFilter
  );

  return (
    <>
      <SecDiv
        label="Beban Bimbingan Dosen"
        icon={
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
        }
      />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-[16px] font-bold text-[#0F172A] mb-[2px] pb-[6px] relative" style={{ display: 'inline-block' }}>
            Monitoring Beban Bimbingan Dosen
            <span className="absolute bottom-0 left-0 h-[2px] w-full rounded" style={{ background: 'linear-gradient(90deg,#1a56db,transparent)' }} />
          </div>
          <div className="text-[11px] text-[#64748B] mt-[4px]">
            Distribusi beban bimbingan mahasiswa per dosen — sistem monitoring ketidakmerataan terintegrasi
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-[10px] p-[12px_14px] mb-5">
        <div className="text-[18px] shrink-0 mt-[1px]">⚠️</div>
        <div className="text-[12px] text-[#78350f]">
          <strong className="font-bold">Ketidakmerataan Beban Bimbingan</strong>
          <p className="mt-[4px] leading-[1.6]">
            Beberapa dosen membimbing terlalu banyak mahasiswa sementara yang lain sangat sedikit,
            berdampak langsung pada <b>lama studi mahasiswa</b> dan <b>Kelulusan Tepat Waktu (KTW)</b>.
            Pimpinan memerlukan visualisasi grafis agar dapat mengambil tindakan penyerataan beban.
          </p>
        </div>
      </div>

      <div className="grid gap-[18px] mb-5" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {STAT_CARDS.map(c => (
          <div key={c.label}
            className={`bg-gradient-to-br ${COLOR_MAP[c.color]} border-none rounded-[18px] p-[22px_20px_20px] flex flex-col min-h-[178px] relative overflow-hidden`}
            style={{ boxShadow: SHADOW_MAP[c.color] }}>
            <span className="absolute top-[-22px] right-[-22px] w-[100px] h-[100px] rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,.09)' }} />
            <span className="absolute bottom-[-30px] left-[-20px] w-[90px] h-[90px] rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,.05)' }} />
            <div className="flex items-start justify-between mb-[14px]">
              {c.trend ? (
                <span className={`text-[10px] font-bold px-[9px] py-1 rounded-full inline-flex items-center text-white whitespace-nowrap ${TREND_COLOR[c.trend] ?? ''}`}
                  style={{ background: 'rgba(255,255,255,.22)' }}>{c.trend}</span>
              ) : <span />}
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

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden mb-5">
        <div className="text-white text-[13px] font-bold px-[18px] py-[13px] pb-[11px] flex items-center gap-2 tracking-[.1px]" style={{ background: 'linear-gradient(135deg,#1a56db 0%,#073864 100%)' }}>
          📊 Rata-rata Beban Bimbingan per Fakultas
        </div>
        <div className="text-[11px] text-[#64748B] px-[18px] py-2 pb-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9]">
          Perbandingan rata-rata jumlah mahasiswa bimbingan pada setiap fakultas sebagai indikator pemerataan beban bimbingan.
        </div>
        <div className="px-[18px] pt-[14px] pb-[6px]"><GrafikBimbingan data={FAK_BIMB_AVG} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] mb-5">
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden flex flex-col">
          <div className="text-white text-[13px] font-bold px-[18px] py-[13px] pb-[11px] flex items-center gap-2 tracking-[.1px]" style={{ background: 'linear-gradient(135deg,#1a56db 0%,#073864 100%)' }}>
            🍩 Distribusi Kategori Beban Bimbingan
          </div>
          <div className="text-[11px] text-[#64748B] px-[18px] py-2 pb-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9]">
            Persentase dosen per kategori beban bimbingan mahasiswa
          </div>
          <div className="relative h-[200px] p-[10px_14px_12px] flex-1"><canvas id="cBimbPie" /></div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden flex flex-col">
          <div className="text-white text-[13px] font-bold px-[18px] py-[13px] pb-[11px] flex items-center gap-2 tracking-[.1px]" style={{ background: 'linear-gradient(135deg,#1a56db 0%,#073864 100%)' }}>
            📉 Korelasi Beban Bimbingan Dosen &amp; KTW
          </div>
          <div className="text-[11px] text-[#64748B] px-[18px] py-2 pb-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9]">
            Dampak ketidakmerataan bimbingan terhadap Kelulusan Tepat Waktu (%)
          </div>
          <div className="relative h-[200px] p-[10px_14px_12px] flex-1"><canvas id="cBimbKTW" /></div>
        </div>
      </div>

      {/* ── Card tabel utama ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-[12px] border-b border-[#F1F5F9] bg-[#F8FAFC] flex-wrap">
          <div className="flex items-center gap-[8px]">
            {selectedDosen && (
              <button
                onClick={() => { setSelectedDosen(null); setStatusFilter('Semua Status'); }}
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
              {selectedDosen ? (
                <>
                  <span
                    className="text-[#94A3B8] font-normal cursor-pointer hover:text-[#1a56db] transition-colors"
                    onClick={() => { setSelectedDosen(null); setStatusFilter('Semua Status'); }}
                  >
                    Detail Beban Bimbingan
                  </span>
                  <svg width="10" height="10" fill="none" stroke="#CBD5E1" strokeWidth={2} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                  <span>{selectedDosen.nm}</span>
                </>
              ) : (
                'Detail Beban Bimbingan'
              )}
            </div>
          </div>

          <div className="flex items-center gap-[7px] flex-wrap">
            {/* Filter tabel dosen */}
            {!selectedDosen && (
              <>
                <select className={styles.filterSelect} value={jenjangFilter} onChange={e => setJenjangFilter(e.target.value)}>
                  {ALL_JENJANG.map(j => <option key={j}>{j}</option>)}
                </select>
                <select className={styles.filterSelect} value={fakFilter} onChange={e => setFakFilter(e.target.value)}>
                  {ALL_FAKULTAS.map(f => <option key={f}>{f}</option>)}
                </select>
                <select className={styles.filterSelect} value={katFilter} onChange={e => setKatFilter(e.target.value)}>
                  <option>Semua Kategori</option>
                  <option>Tinggi &gt;12</option>
                  <option>Ideal 5–12</option>
                  <option>Rendah &lt;5</option>
                </select>
                <select className={styles.filterSelect} value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                  <option>2025/2026</option>
                  <option>2024/2025</option>
                </select>
              </>
            )}

            {/* Filter tabel mahasiswa */}
            {selectedDosen && (
              <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option>Semua Status</option>
                <option>Aktif</option>
                <option>Selesai</option>
              </select>
            )}

            <button
              onClick={() => onExport(
                selectedDosen ? `Bimbingan ${selectedDosen.nm}` : 'Beban Bimbingan',
                selectedDosen ? `Daftar mahasiswa bimbingan ${selectedDosen.nm}` : 'Distribusi beban bimbingan per dosen',
                selectedDosen
                  ? mhsList.map(m => ({ nama: m.nm, npm: m.npm, prodi: m.prodi, semester: m.sem, status: m.status }))
                  : filtered.map(b => ({ nama: b.nm, fakultas: b.fak, prodi: b.prodi, jenjang: b.jenjang, total: b.total, aktif: b.aktif, selesai: b.selesai }))
              )}
              className="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] text-[11px] font-semibold bg-white border-[1.5px] border-[#CCE5F5] text-[#1a56db] cursor-pointer transition-all duration-[130ms] whitespace-nowrap hover:bg-[#EEF5FC] hover:border-[#1a56db]">
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Ekspor
            </button>
          </div>
        </div>

        {/* ── Tabel dosen ── */}
        {!selectedDosen && (
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {['#', 'Nama Dosen', 'Program Studi', 'Jenjang', 'Total Bimbingan', 'Aktif', 'Selesai', 'Kategori Beban'].map(h => (
                    <th key={h} className="text-left text-[10.5px] font-bold text-[#94A3B8] uppercase tracking-[.7px] px-4 py-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.nm}
                    className="border-b border-[#F8FAFC] transition-colors duration-[100ms] cursor-pointer hover:bg-[#F8FAFC]"
                    onClick={() => setSelectedDosen(b)}>
                    <td className="px-4 py-[11px] text-[#94A3B8] text-[11px]">{i + 1}</td>
                    <td className="px-4 py-[11px]"><b className="text-[#0F172A]">{b.nm}</b></td>
                    <td className="px-4 py-[11px] text-[#475569]">{b.prodi}</td>
                    <td className="px-4 py-[11px]">
                      <span className="inline-flex items-center rounded-[5px] font-semibold px-[8px] py-[2px] text-[10.5px] bg-[#EEF5FC] text-[#1a56db] whitespace-nowrap">
                        {b.jenjang}
                      </span>
                    </td>
                    <td className="px-4 py-[11px] text-[#475569] font-semibold">{b.total}</td>
                    <td className="px-4 py-[11px] text-[#475569]">{b.aktif}</td>
                    <td className="px-4 py-[11px] text-[#475569]">{b.selesai}</td>
                    <td className="px-4 py-[11px]"><BimbChip n={b.total} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Tabel mahasiswa bimbingan ── */}
        {selectedDosen && (
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {[
                    { label: '#',              cls: 'w-[36px]'  },
                    { label: 'Nama Mahasiswa', cls: 'w-[220px]' },
                    { label: 'NPM',            cls: 'w-[130px]' },
                    { label: 'Program Studi',  cls: 'w-[180px]' },
                    { label: 'Semester',       cls: 'w-[100px] text-center' },
                    { label: 'Status',         cls: 'w-[110px]' },
                  ].map(h => (
                    <th key={h.label}
                      className={`text-left text-[10.5px] font-bold text-[#94A3B8] uppercase tracking-[.7px] px-4 py-[12px] bg-[#F8FAFC] border-b border-[#F1F5F9] whitespace-nowrap ${h.cls}`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mhsList.map((m, j) => (
                  <tr key={m.npm} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors duration-[100ms]">
                    <td className="px-4 py-[13px] text-[#94A3B8] text-[11px]">{j + 1}</td>
                    <td className="px-4 py-[13px]"><b className="text-[#0F172A] font-semibold">{m.nm}</b></td>
                    <td className="px-4 py-[13px] text-[#475569] text-[12px] tabular-nums">{m.npm}</td>
                    <td className="px-4 py-[13px] text-[#475569]">{m.prodi}</td>
                    <td className="px-4 py-[13px] text-center">
                      <span className="inline-flex items-center justify-center rounded-[5px] font-bold text-[11px] w-[24px] h-[24px]"
                        style={{ background: '#EEF5FC', color: '#1a56db' }}>
                        {m.sem}
                      </span>
                    </td>
                    <td className="px-4 py-[13px]"><MhsStatusBadge status={m.status} /></td>
                  </tr>
                ))}
                {mhsList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-[12px] text-[#94A3B8] py-10">
                      Tidak ada data mahasiswa
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          current={1}
          total={2}
          info={selectedDosen
            ? `1–${mhsList.length} dari ${mhsRaw.length} mahasiswa`
            : `1–${filtered.length} dari 348 data`}
        />
      </div>
    </>
  );
}