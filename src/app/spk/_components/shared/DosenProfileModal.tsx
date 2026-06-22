'use client';

import { Dosen } from '../data';
import { StatusChip, PendChip } from '../shared/Helpers';

interface Props {
  open: boolean;
  dosen: Dosen | null;
  onClose: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold text-[#1a56db] uppercase tracking-[1px] mb-[10px] pb-[6px] border-b border-[#F1F5F9]">
      {children}
    </div>
  );
}

function ProgBar({ label, val, max, pct, colorClass }: {
  label: string; val: string; max: string; pct: number; colorClass?: string;
}) {
  return (
    <div className="mb-[14px]">
      <div className="flex justify-between text-[12px] text-[#334155] mb-[6px] font-medium">
        <span>{label}</span>
        <span className="text-[#64748B] font-normal">{val}/{max}</span>
      </div>
      <div className="bg-[#F1F5F9] rounded-full h-[8px]">
        <div
          className={`h-[8px] rounded-full transition-all duration-[600ms] ${colorClass ?? 'bg-[#1a56db]'}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

function StatBox({ val, label, bg, color }: { val: string | number; label: string; bg: string; color: string }) {
  return (
    <div className="rounded-[12px] px-3 py-[14px] text-center flex flex-col items-center gap-1" style={{ background: bg }}>
      <div className="text-[24px] font-bold leading-none" style={{ color }}>{val}</div>
      <div className="text-[9.5px] font-bold text-[#94A3B8] uppercase tracking-[.6px] mt-[2px]">{label}</div>
    </div>
  );
}

function InfoRow({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] text-[#94A3B8] mb-[2px]">{label}</div>
      <div className={`font-semibold text-[#0F172A] ${small ? 'text-[11px]' : 'text-[13px]'}`}>{value || '—'}</div>
    </div>
  );
}

function Timeline({ items }: { items: { c: string; t: string; m: string }[] }) {
  const dotColor = (c: string) => {
    if (c === 'g') return '#059669';
    if (c === 'w') return '#D97706';
    if (c === 'r') return '#DC2626';
    return '#1a56db';
  };
  return (
    <div className="flex flex-col gap-[14px]">
      {items.map((r, i) => {
        const bg = dotColor(r.c);
        return (
          <div key={i} className="flex gap-[12px] items-start">
            <div className="flex flex-col items-center">
              <div
                className="w-[9px] h-[9px] rounded-full shrink-0 mt-[3px]"
                style={{ background: bg, boxShadow: `0 0 0 3px ${bg}33` }}
              />
              {i < items.length - 1 && <div className="w-px flex-1 bg-[#E2E8F0] mt-[4px] min-h-[16px]" />}
            </div>
            <div className="pb-[2px]">
              <div className="text-[12.5px] font-semibold text-[#0F172A] leading-snug">{r.t}</div>
              {r.m && <div className="text-[10.5px] text-[#94A3B8] mt-[2px]">{r.m}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DosenProfileModal({ open, dosen: d, onClose }: Props) {
  if (!open || !d) return null;

  const pN = parseInt(d.pub) || 0;
  const sN = parseInt(d.sks) || 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[600] flex items-center justify-center p-5 backdrop-blur-[4px]"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[18px] max-w-[560px] w-full max-h-[92vh] overflow-y-auto shadow-[0_28px_64px_rgba(0,0,0,.24)]">

        {/* ── Header ── */}
        <div className="flex items-start gap-[14px] px-[24px] py-[20px] border-b border-[#F1F5F9]">
          <div
            className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[14px] font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#1a56db,#073864)' }}
          >
            {d.ini}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-bold text-[#0F172A] leading-tight">{d.nm}</div>
            <div className="text-[10.5px] text-[#94A3B8] mt-[3px] leading-relaxed">
              NIP: {d.nip} · NUPTK: {d.nip.split('').reverse().join('').slice(0,16)} · Fakultas {d.fak}
            </div>
            <div className="flex gap-[5px] mt-[8px] flex-wrap">
              <PendChip pend={d.pend} />
              <span className="inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] bg-[#F1F5F9] text-[#475569]">
                {d.jabfung}
              </span>
              <StatusChip status={d.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[14px] text-[#94A3B8] w-[28px] h-[28px] flex items-center justify-center rounded-[6px] cursor-pointer hover:bg-[#F1F5F9] hover:text-[#0F172A] shrink-0 transition-colors"
          >✕</button>
        </div>

        <div className="px-[24px] py-[18px] flex flex-col gap-[22px]">

          <div>
            <SectionLabel>Informasi Kepegawaian</SectionLabel>
            <div className="grid grid-cols-2 gap-x-6 gap-y-[14px]">
              <InfoRow label="NIP"                  value={d.nip} />
              <InfoRow label="Golongan"              value={d.gol} />
              <InfoRow label="NUPTK"                 value={d.nip.split('').reverse().join('').slice(0,16)} />
              <InfoRow label="Masa Kerja"            value={d.masa} />
              <InfoRow label="Pendidikan Terakhir"   value={`${d.pend} ${d.prodi} - ${d.inst}`} small />
              <InfoRow label="Program Studi"         value={d.prodi} />
              <InfoRow label="Email"                 value={d.email} small />
              <InfoRow label="Telepon"               value={d.telp} />
            </div>
          </div>

          <div>
            <SectionLabel>Kinerja Akademik</SectionLabel>
            <ProgBar
              label="Beban Mengajar"
              val={`${sN}`}
              max="12 SKS"
              pct={Math.min((sN / 12) * 100, 100)}
              colorClass="bg-[#1a56db]"
            />
            <ProgBar
              label="Publikasi Ilmiah"
              val={`${pN}`}
              max="5 target"
              pct={Math.min((pN / 5) * 100, 100)}
              colorClass={pN >= 3 ? 'bg-[#059669]' : pN >= 1 ? 'bg-[#D97706]' : 'bg-[#DC2626]'}
            />
            <ProgBar
              label="Beban Bimbingan"
              val={`${d.bimb}`}
              max="12 ideal"
              pct={Math.min((d.bimb / 20) * 100, 100)}
              colorClass={d.bimb > 15 ? 'bg-[#DC2626]' : d.bimb < 3 ? 'bg-[#D97706]' : 'bg-[#059669]'}
            />
          </div>

          <div>
            <SectionLabel>Statistik Cepat</SectionLabel>
            <div className="grid grid-cols-3 gap-[10px]">
              <StatBox val={d.sks}  label="SKS Mengajar" bg="#EEF5FC" color="#1a56db" />
              <StatBox val={d.pub}  label="Publikasi"    bg="#D1FAE5" color="#059669" />
              <StatBox
                val={d.bimb}
                label="Bimbingan"
                bg={d.bimb > 15 ? '#FEE2E2' : d.bimb < 3 ? '#FEF3C7' : '#D1FAE5'}
                color={d.bimb > 15 ? '#DC2626' : d.bimb < 3 ? '#D97706' : '#059669'}
              />
            </div>
          </div>

          {d.rw && d.rw.length > 0 && (
            <div>
              <SectionLabel>Riwayat &amp; Catatan</SectionLabel>
              <Timeline items={d.rw} />
            </div>
          )}
        </div>

        <div className="px-[24px] pb-[20px] pt-[12px] flex gap-[8px] justify-end border-t border-[#F1F5F9]">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] text-[12px] font-semibold bg-white text-[#475569] border border-[#E2E8F0] cursor-pointer hover:bg-[#F8FAFC] transition-colors duration-[120ms]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}