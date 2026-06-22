"use client";

import styles from "../../page.module.css";

// Rata-rata beban bimbingan per fakultas (bukan per dosen individu),
// supaya grafik tetap relevan & ringkas meskipun jumlah dosen sangat besar.
export type FakultasBimbingan = {
  fak: string;
  avg: number;
};

const MAX = 22;
const BATAS_RENDAH = 5;
const BATAS_IDEAL = 12;

function kategoriColor(avg: number): string {
  if (avg > BATAS_IDEAL) return "var(--danger)";
  if (avg < BATAS_RENDAH) return "var(--warning)";
  return "var(--success)";
}

type Props = {
  data: FakultasBimbingan[];
};

export default function BimbinganBars({ data }: Props) {
  return (
    <div>
      {data.map((d) => {
        const pct = Math.min((d.avg / MAX) * 100, 100);
        const color = kategoriColor(d.avg);
        return (
          <div key={d.fak} className="flex items-center gap-2 mb-[7px]">
            <div className="text-[11px] font-semibold text-[var(--gray-900)] min-w-[185px] whitespace-nowrap overflow-hidden text-ellipsis">
              {d.fak}
            </div>
            <div className="flex-1 bg-[var(--gray-100)] rounded-full h-[9px] relative">
              <div
                className={`h-[9px] rounded-full ${styles.bbFill}`}
                style={{ width: `${pct}%`, background: color }}
              />
              <div
                className="absolute top-[-2px] h-[13px] w-[2px] bg-[var(--gray-400)] rounded-[2px]"
                style={{ left: `${(BATAS_RENDAH / MAX) * 100}%` }}
                title={`Batas bawah Ideal: ${BATAS_RENDAH} mahasiswa (<${BATAS_RENDAH} = Rendah)`}
              />
              <div
                className="absolute top-[-2px] h-[13px] w-[2px] bg-[var(--gray-400)] rounded-[2px]"
                style={{ left: `${(BATAS_IDEAL / MAX) * 100}%` }}
                title={`Batas atas Ideal: ${BATAS_IDEAL} mahasiswa (>${BATAS_IDEAL} = Tinggi)`}
              />
            </div>
            <div
              className="text-[11px] font-bold min-w-[34px] text-right"
              style={{ color }}
            >
              {d.avg.toFixed(1)}
            </div>
          </div>
        );
      })}
      {/* Legend */}
      <div className="flex items-center gap-[14px] mt-[10px] pt-[8px] border-t border-[var(--gray-100)]">
        <span className="text-[10px] font-semibold text-[var(--gray-500)]">Kategori:</span>
        <span className="flex items-center gap-[5px] text-[10px] text-[var(--gray-700)]">
          <span className="inline-block w-[10px] h-[10px] rounded-full" style={{ background: "var(--danger)" }} />
          Tinggi (&gt;12 mhs)
        </span>
        <span className="flex items-center gap-[5px] text-[10px] text-[var(--gray-700)]">
          <span className="inline-block w-[10px] h-[10px] rounded-full" style={{ background: "var(--success)" }} />
          Ideal (5–12 mhs)
        </span>
        <span className="flex items-center gap-[5px] text-[10px] text-[var(--gray-700)]">
          <span className="inline-block w-[10px] h-[10px] rounded-full" style={{ background: "var(--warning)" }} />
          Rendah (&lt;5 mhs)
        </span>
      </div>
    </div>
  );
}