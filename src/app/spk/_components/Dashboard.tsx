'use client';
import { useMemo, useState } from "react";
import styles from '../page.module.css';

import { useDashboardCharts } from "./useSpkCharts";

interface Props {
  dashTs: string;
  onScrollTo: (sectionId: string) => void;
  onExport: (title: string, desc: string) => void;
}

// ============================================================
// Data dashboard per tahun akademik & semester.
// NOTE (skripsi): ini data dummy yang diturunkan dari angka dasar
// 2025/2026-Genap memakai faktor pertumbuhan per tahun, supaya
// filter tahun/semester di dashboard benar-benar mengubah tampilan
// (statcard + chart) dan trennya tetap masuk akal secara historis.
// Bukan data riil — ganti dengan data hasil olahan asli sebelum
// dipakai di luar kebutuhan demo/sidang.
// ============================================================

const TAHUN_LIST = ["2025/2026", "2024/2025", "2023/2024"] as const;
const SEMESTER_LIST = ["Genap", "Ganjil"] as const;

type TahunOpt = typeof TAHUN_LIST[number];
type SemesterOpt = typeof SEMESTER_LIST[number];

// Faktor skala relatif terhadap tahun terbaru (2025/2026), makin lama makin kecil
// (jumlah dosen/mahasiswa & metrik tumbuh dari tahun ke tahun).
const TAHUN_FACTOR: Record<TahunOpt, number> = {
  "2025/2026": 1,
  "2024/2025": 0.94,
  "2023/2024": 0.88,
};

// Semester Ganjil biasanya dicatat di awal tahun akademik → sedikit lebih rendah dari Genap.
const SEMESTER_FACTOR: Record<SemesterOpt, number> = {
  Genap: 1,
  Ganjil: 0.97,
};

const round = (n: number) => Math.round(n);

function buildDashboardData(tahun: TahunOpt, semester: SemesterOpt) {
  const f = TAHUN_FACTOR[tahun] * SEMESTER_FACTOR[semester];
  const periodeLabel = `Semester ${semester} ${tahun}`;

  return {
    periodeLabel,
    totalDosen: round(348 * f),
    tanpaJabfung: round(27 * (2 - f)), // makin lawas, makin banyak yg belum diupdate
    belumPangkat: round(19 * (2 - f)),
    tanpaS3: round(31 * (2 - f)),
    belumS2: round(14 * (2 - f)),
    totalMhs: round(12847 * f),
    risikoDO: round(12 * (2 - f)),
    ktw: Math.max(60, Math.min(95, round(78 - (1 - f) * 45))),
    // distribusi pendidikan dosen (doughnut) — diskalakan dari basis 378 dosen
    distDosen: [160, 174, 14, 18, 12].map((v) => round(v * f)),
    // EWS DO per kelompok semester (bar)
    ewsDO: {
      sp1: [7, 3, 2, 0, 0].map((v) => round(v * (2 - f))),
      sp2: [0, 0, 0, 5, 2].map((v) => round(v * (2 - f))),
    },
    // tren KTW 5 tahun terakhir — bergeser sesuai tahun yang dipilih
    ktwTrend: getKtwTrend(tahun),
  };
}

// 5 tahun terakhir relatif terhadap tahun yang dipilih, biar grafik tren
// tetap berakhir di tahun yang sedang difilter.
function getKtwTrend(tahun: TahunOpt) {
  const endYear = parseInt(tahun.split("/")[0], 10);
  const base = [73, 75, 76, 78, 80]; // tren acuan utk 2021-2025
  const labels: string[] = [];
  const data: number[] = [];
  for (let i = 0; i < 5; i++) {
    const y = endYear - 4 + i;
    labels.push(String(y));
    data.push(base[i]);
  }
  return { labels, data };
}

const GRAD = 'linear-gradient(135deg,#1a56db 0%,#1d4ed8 100%)';

const SC: Record<string, string> = {
  green:  'linear-gradient(145deg,#34d399 0%,#10b981 50%,#047857 100%)',
  orange: 'linear-gradient(145deg,#fb923c 0%,#f97316 50%,#c2410c 100%)',
  amber:  'linear-gradient(145deg,#fcd34d 0%,#f59e0b 50%,#b45309 100%)',
  indigo: 'linear-gradient(145deg,#a5b4fc 0%,#818cf8 50%,#4f46e5 100%)',
  purple: 'linear-gradient(145deg,#d8b4fe 0%,#c084fc 50%,#9333ea 100%)',
  blue:   'linear-gradient(145deg,#1d6fc4 0%,#1a56db 50%,#073864 100%)',
  red:    'linear-gradient(145deg,#f87171 0%,#ef4444 50%,#b91c1c 100%)',
  teal:   'linear-gradient(145deg,#5eead4 0%,#14b8a6 50%,#0d9488 100%)',
};

const SHADOW: Record<string, string> = {
  green:  '0 6px 24px rgba(5,150,105,.22)',
  orange: '0 6px 24px rgba(249,115,22,.22)',
  amber:  '0 6px 24px rgba(217,119,6,.22)',
  indigo: '0 6px 24px rgba(99,102,241,.22)',
  purple: '0 6px 24px rgba(147,51,234,.22)',
  blue:   '0 6px 24px rgba(11,94,168,.18)',
  red:    '0 6px 24px rgba(220,38,38,.22)',
  teal:   '0 6px 24px rgba(20,184,166,.22)',
};

const SELECT_STYLE: React.CSSProperties = {};

function StatCard({ color, value, label, sub, trend, icon, onClick }: {
  color: string; value: string; label: string; sub: string;
  trend: string; icon: string; onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="border-none rounded-[18px] p-[22px_20px_20px] cursor-pointer flex flex-col min-h-[178px] relative overflow-hidden transition-transform duration-[170ms] hover:-translate-y-1"
      style={{ background: SC[color], boxShadow: SHADOW[color] }}
    >
      <span className="absolute top-[-22px] right-[-22px] w-[100px] h-[100px] rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,.09)' }} />
      <span className="absolute bottom-[-30px] left-[-20px] w-[90px] h-[90px] rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,.05)' }} />
      <div className="flex items-start justify-between mb-[14px]">
        <span className="text-[10px] font-bold px-[9px] py-1 rounded-full text-white whitespace-nowrap inline-flex items-center" style={{ background: 'rgba(255,255,255,.24)' }}>
          {trend}
        </span>
        <div className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center text-[21px] shrink-0" style={{ background: 'rgba(255,255,255,.22)' }}>
          {icon}
        </div>
      </div>
      <div className="text-[42px] font-extrabold leading-none text-white tracking-[-1px] mb-[5px]">{value}</div>
      <div className="text-[11.5px] font-bold text-white/95 tracking-[.3px] uppercase mb-[5px]">{label}</div>
      <div className="text-[10.5px] text-white/70 leading-[1.4] mt-auto">{sub}</div>
    </div>
  );
}

function ChartCard({ id, title, sub, full }: { id: string; title: string; sub: string; full?: boolean }) {
  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,.04),0_4px_16px_rgba(0,0,0,.06)] overflow-hidden flex flex-col${full ? ' col-span-2' : ''}`}>
      <div className="text-white text-[13px] font-bold px-[18px] py-[13px] pb-[11px] flex items-center gap-2 tracking-[.1px]" style={{ background: GRAD }}>
        {title}
      </div>
      <div className="text-[11px] text-[#64748B] px-[18px] py-2 pb-[10px] bg-[#F8FAFC] border-b border-[#F1F5F9]">{sub}</div>
      <div className="relative h-[200px] p-[10px_14px_12px] flex-1">
        <canvas id={id} data-chart-title={title} />
      </div>
    </div>
  );
}

export default function Dashboard({ dashTs, onScrollTo, onExport }: Props) {
  const [tahun, setTahun] = useState<TahunOpt>("2025/2026");
  const [semester, setSemester] = useState<SemesterOpt>("Genap");

  const d = useMemo(() => buildDashboardData(tahun, semester), [tahun, semester]);

  useDashboardCharts(d);

  const totalMhsLabel = d.totalMhs.toLocaleString("id-ID");
  const isLatestPeriod = tahun === "2025/2026" && semester === "Genap";

  return (
    <div id="sec-dashboard">
      <div className="flex items-start justify-between mb-[22px] flex-wrap gap-2">
        <div className="flex flex-col">
          <div className="text-[32px] font-bold text-[#1e3a8a] leading-[1.2] relative inline-block pb-4">
            Dashboard Monitoring Akademik
          </div>
          <div className="text-[12px] text-[#64748B] mt-1 leading-[1.55]">{dashTs}</div>
        </div>
        <div className="flex gap-[7px] items-center">
          <select
            className={styles.filterSelect}
            value={tahun}
            onChange={(e) => setTahun(e.target.value as TahunOpt)}
          >
            {TAHUN_LIST.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            className={styles.filterSelect}
            value={semester}
            onChange={(e) => setSemester(e.target.value as SemesterOpt)}
          >
            {SEMESTER_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => onExport('Dashboard', `Ringkasan monitoring ${d.periodeLabel}`)}
            className="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] text-[11px] font-semibold bg-white border-[1.5px] border-[#CCE5F5] text-[#1a56db] cursor-pointer transition-all duration-[130ms] whitespace-nowrap hover:bg-[#EEF5FC] hover:border-[#1a56db]"
          >
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Ekspor Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[14px] mb-6">
        <div className="col-span-full flex items-center gap-[10px] text-[9.5px] font-bold text-[#64748B] uppercase tracking-[1.6px] mt-[6px] mb-[2px] pl-3 border-l-[3px] border-[#1a56db]">
          Monitoring Dosen
        </div>
        <StatCard color="green"  value={String(d.totalDosen)}  label="Total Dosen Aktif"        sub={d.periodeLabel}                      trend={isLatestPeriod ? "↑ 4% semester ini" : "Data periode terpilih"} icon="👨‍🏫" onClick={() => onScrollTo('sec-dosen')} />
        <StatCard color="orange" value={String(d.tanpaJabfung)} label="Tanpa Jabatan Fungsional" sub="Lebih dari 2 tahun belum diperbarui" trend="Perlu Tindak Lanjut"   icon="⚠️"  onClick={() => onScrollTo('sec-analisis')} />
        <StatCard color="amber"  value={String(d.belumPangkat)} label="Belum Kenaikan Pangkat"   sub="Masa kerja lebih dari 10 tahun"      trend="Perlu Perhatian"       icon="📅"  onClick={() => onScrollTo('sec-analisis')} />
        <StatCard color="indigo" value={String(d.tanpaS3)}      label="Dosen Tanpa Gelar S3"     sub="Mengajar lebih dari 10 tahun"        trend="Perlu Monitoring"      icon="🎓"  onClick={() => onScrollTo('sec-analisis')} />
        <StatCard color="purple" value={String(d.belumS2)}      label="Dosen Belum Bergelar S2"  sub="Perlu percepatan studi lanjut"       trend="Perlu Tindak Lanjut"   icon="📖"  onClick={() => onScrollTo('sec-analisis')} />
        <div className="col-span-full flex items-center gap-[10px] text-[9.5px] font-bold text-[#64748B] uppercase tracking-[1.6px] mt-[6px] mb-[2px] pl-3 border-l-[3px] border-[#1a56db]">
          Monitoring Mahasiswa
        </div>
        <StatCard color="blue" value={totalMhsLabel}     label="Total Mahasiswa Aktif"  sub={d.periodeLabel}              trend={isLatestPeriod ? "Aktif semester ini" : "Data periode terpilih"} icon="🎓" onClick={() => onScrollTo('sec-mahasiswa')} />
        <StatCard color="red"  value={String(d.risikoDO)} label="Mahasiswa Risiko DO"    sub="Dalam pemantauan ketat"      trend="EWS Aktif"          icon="🚨" onClick={() => onScrollTo('sec-ews')} />
        <StatCard color="teal" value={`${d.ktw}%`}        label="Kelulusan Tepat Waktu"  sub={d.ktw >= 80 ? "Mencapai target nasional" : `${80 - d.ktw}% di bawah target nasional`} trend="Target: 80%" icon="✅" onClick={() => onScrollTo('sec-kelulusan')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <ChartCard id="cDosen" title="📊 Distribusi Jenjang Pendidikan Dosen"        sub="Komposisi tingkat pendidikan terakhir seluruh dosen aktif" />
        <ChartCard id="cDO"    title="🚨 Early Warning Mahasiswa Berisiko DO"         sub="Distribusi mahasiswa bermasalah per semester akademik" />
        <ChartCard id="cKTW"   title="📈 Tren Kelulusan Tepat Waktu (KTW) — 5 Tahun" sub="Persentase kelulusan tepat waktu per tahun akademik · Indikator efektivitas utama sistem monitoring" full />
      </div>
    </div>
  );
}