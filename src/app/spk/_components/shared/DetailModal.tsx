'use client';

import { Dosen, Mhs, PubItem } from '../data';
import { StatusChip, PendChip, ipkColor } from '../shared/Helpers';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Gagal load: ${src}`));
    document.head.appendChild(s);
  });
}

async function fetchLogoB64(): Promise<string> {
  try {
    const r = await fetch('/assets/images/logo-unila.png');
    if (!r.ok) return '';
    const blob = await r.blob();
    return await new Promise<string>((res, rej) => {
      const rd = new FileReader();
      rd.onload = () => res(rd.result as string);
      rd.onerror = rej;
      rd.readAsDataURL(blob);
    });
  } catch { return ''; }
}

async function cetakProfilDosen(d: Dosen) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210; const PL = 20; const PR = 20; const CW = W - PL - PR;

  const logoB64 = await fetchLogoB64();
  let y = 15;

  // ── KOP SURAT ─────────────────────────────────────────────
  if (logoB64) doc.addImage(logoB64, 'PNG', PL, y - 4, 20, 20);

  const kopX = W / 2;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(0, 0, 0);
  doc.text('KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI', kopX, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(0, 0, 0);
  doc.text('UNIVERSITAS LAMPUNG', kopX, y, { align: 'center' });
  y += 6;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(60, 60, 60);
  doc.text('Jl. Prof. Dr. Soemantri Brojonegoro No.1 Bandar Lampung', kopX, y, { align: 'center' });
  y += 4;
  doc.text('Telp : 702767, 702971, 703475, 702673, 701252, 701609', kopX, y, { align: 'center' });
  y += 5;
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(1.0); doc.line(PL, y, W - PR, y);
  y += 1;
  doc.setLineWidth(0.3); doc.line(PL, y, W - PR, y);
  y += 8;

  // ── helpers ──────────────────────────────────────────────
  const checkPage = (need = 10) => {
    if (y + need > 278) { doc.addPage(); y = 20; }
  };

  const sectionHeading = (t: string) => {
    checkPage(12);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(100, 116, 139);
    doc.text(t.toUpperCase(), PL, y); y += 4;
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3); doc.line(PL, y, W - PR, y);
    y += 5;
  };

  const row = (label: string, value: string) => {
    checkPage(7);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
    doc.text(label, PL, y);
    doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    const val = doc.splitTextToSize(value || '—', CW - 52);
    doc.text(val, PL + 52, y);
    y += Math.max(val.length * 5, 6);
  };

  // ── Judul Dokumen ─────────────────────────────────────────
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 0, 0);
  doc.text('PROFIL DOSEN', kopX, y, { align: 'center' }); y += 10;

  // ── Info 2 kolom ──────────────────────────────────────────
  const col1x = PL; const col2x = W / 2 + 5; const labelW = 30;
  const infoRow2Col = (l1: string, v1: string, l2: string, v2: string) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(0, 0, 0);
    doc.text(l1, col1x, y); doc.text(`: ${v1}`, col1x + labelW, y);
    doc.text(l2, col2x, y); doc.text(`: ${v2}`, col2x + labelW, y);
    y += 5.5;
  };
  infoRow2Col('NAMA',      d.nm,                       'Fakultas',       d.fak);
  infoRow2Col('NIP',       d.nip,                      'Golongan',       d.gol);
  infoRow2Col('Jabatan',   d.jabfung || 'Belum Ada',   'Bid. Keahlian',  d.bidang);
  infoRow2Col('Status',    d.status,                   'Masa Kerja',     d.masa);
  y += 3;
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3); doc.line(PL, y, W - PR, y); y += 7;

  // ── Informasi Kepegawaian ─────────────────────────────────
  sectionHeading('Informasi Kepegawaian');
  row('NIP',                 d.nip);
  row('Golongan',             d.gol);
  row('Masa Kerja',           d.masa);
  row('Pendidikan Terakhir',  `${d.pend} - ${d.inst}`);
  row('Program Studi',        d.prodi);
  row('Bidang Keahlian',      d.bidang);
  row('Email',                d.email);
  row('Telepon',              d.telp);
  y += 2;

  // ── Kinerja Akademik ──────────────────────────────────────
  sectionHeading('Kinerja Akademik');
  row('Beban Mengajar',   `${d.sks} SKS`);
  row('Publikasi Ilmiah', `${d.pub} publikasi`);
  row('Beban Bimbingan',  `${d.bimb} mahasiswa`);
  row('Status',            d.status);
  y += 2;

  // ── Riwayat Publikasi ─────────────────────────────────────
  if (d.pubHistory && d.pubHistory.length > 0) {
    sectionHeading('Riwayat Publikasi');
    d.pubHistory.forEach((p: PubItem, i: number) => {
      checkPage(8);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(15, 23, 42);
      const lines = doc.splitTextToSize(`${i + 1}. [${p.tahun}] ${p.judul} (${p.indeks})`, CW);
      doc.text(lines, PL, y);
      y += lines.length * 5 + 2;
    });
    y += 2;
  }

  // ── Riwayat & Catatan ─────────────────────────────────────
  if (d.rw && d.rw.length > 0) {
    sectionHeading('Riwayat & Catatan');
    d.rw.forEach(r => {
      checkPage(8);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80, 80, 80);
      const lines = doc.splitTextToSize(`\u2022 ${r.t}${r.m ? ' \u2014 ' + r.m : ''}`, CW);
      doc.text(lines, PL, y);
      y += lines.length * 4.5 + 2;
    });
  }

  // ── Footer tiap halaman ───────────────────────────────────
  const pages = doc.internal.getNumberOfPages();
  const tglCetak = new Date().toLocaleString('id-ID', {
    day: 'numeric', month: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3); doc.line(PL, 285, W - PR, 285);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(100, 116, 139);
    doc.text(`Dicetak: ${tglCetak} | SIPEKA Universitas Lampung`, PL, 290);
    doc.text(`Hal ${i} dari ${pages}`, W - PR, 290, { align: 'right' });
  }

  doc.save(`Profil_Dosen_${d.nm.replace(/[^a-zA-Z0-9]/g, '_')}_${d.nip}.pdf`);
}

async function cetakProfilMhs(m: Mhs) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210; const PL = 20; const PR = 20; let y = 20;

  const line = () => { doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3); doc.line(PL, y, W - PR, y); y += 5; };
  const heading = (t: string) => { doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(100, 116, 139); doc.text(t.toUpperCase(), PL, y); y += 5; line(); };
  const row = (label: string, value: string) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.text(label, PL, y); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42); doc.text(value || '—', PL + 52, y); y += 6; };

  // Header
  doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(5, 150, 105);
  doc.text('PROFIL MAHASISWA', PL, y); y += 6;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text('Sistem Pendukung Keputusan Pimpinan — Universitas Lampung', PL, y); y += 4;
  doc.setDrawColor(5, 150, 105); doc.setLineWidth(0.8); doc.line(PL, y, W - PR, y); y += 7;

  // Identitas
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(15, 23, 42);
  doc.text(m.nm, PL, y); y += 5;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text(`NPM: ${m.npm}  ·  ${m.prodi}  ·  Angkatan ${m.ang}`, PL, y); y += 8;

  heading('Data Akademik');
  row('NPM', m.npm); row('Program Studi', m.prodi); row('Fakultas', m.fak);
  row('Jenjang', m.jenjang); row('Angkatan', m.ang); row('Semester', `${m.sem}`);
  row('IPK', m.ipk.toFixed(2)); row('SKS Lulus', `${m.sks} SKS`);
  row('Status', m.status); row('Dosen PA', m.pa); y += 2;

  heading('Info Tambahan');
  row('Email', m.email); row('Jalur Masuk', m.jalurMasuk);
  row('Topik TA', m.ta || '—'); y += 2;

  if (m.rw && m.rw.length > 0) {
    heading('Riwayat & Catatan');
    m.rw.forEach(r => { row('·', `${r.t}${r.m ? ' — ' + r.m : ''}`); });
  }

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3);
    doc.line(PL, 287, W - PR, 287);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(148, 163, 184);
    doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}  |  SIPEKA Universitas Lampung`, PL, 291);
    doc.text(`Hal ${i}/${pages}`, W - PR, 291, { align: 'right' });
  }

  doc.save(`Profil_Mahasiswa_${m.nm.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

interface Props {
  open: boolean;
  type: 'dosen' | 'mahasiswa' | null;
  dosenData: Dosen[];
  mhsData: Mhs[];
  index: number;
  onClose: () => void;
}

/* ─── Shared sub-components ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[1px] mb-[10px] pb-[6px] border-b border-[#F1F5F9]">
      {children}
    </div>
  );
}

function ProgBar({
  label, val, max, pct, colorClass,
}: {
  label: string; val: string; max: string; pct: number; colorClass?: string;
}) {
  return (
    <div className="mb-[12px]">
      <div className="flex justify-between text-[11.5px] text-[#334155] mb-[5px] font-medium">
        <span>{label}</span>
        <span className="text-[#64748B] font-normal">{val}/{max}</span>
      </div>
      <div className="bg-[#F1F5F9] rounded-full h-[7px]">
        <div
          className={`h-[7px] rounded-full transition-all duration-[600ms] ${colorClass ?? 'bg-[#1a56db]'}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

function StatBox({
  val, label, bg, color,
}: {
  val: string | number; label: string; bg: string; color: string;
}) {
  return (
    <div className="rounded-[10px] px-3 py-[12px] text-center flex flex-col items-center gap-1" style={{ background: bg }}>
      <div className="text-[22px] font-bold leading-none" style={{ color }}>{val}</div>
      <div className="text-[9.5px] font-bold text-[#94A3B8] uppercase tracking-[.6px]">{label}</div>
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
    <div className="flex flex-col gap-[12px]">
      {items.map((r, i) => {
        const bg = dotColor(r.c);
        return (
          <div key={i} className="flex gap-[11px] items-start">
            <div
              className="w-[8px] h-[8px] rounded-full shrink-0 mt-[4px]"
              style={{ background: bg, boxShadow: `0 0 0 2.5px ${bg}33` }}
            />
            <div>
              <div className="text-[12.5px] font-semibold text-[#0F172A] leading-snug">{r.t}</div>
              {r.m && <div className="text-[10.5px] text-[#94A3B8] mt-[2px]">{r.m}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InfoRow({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] text-[#94A3B8] mb-[2px]">{label}</div>
      <div className={`font-semibold text-[#0F172A] ${small ? 'text-[11px]' : 'text-[12.5px]'}`}>{value || '—'}</div>
    </div>
  );
}

/* ─── Footer buttons ─── */
function ModalFooter({ onClose, onCetak, showCetak }: { onClose: () => void; onCetak: () => void; showCetak: boolean }) {
  return (
    <div className="px-[22px] pb-[18px] pt-[12px] flex gap-[8px] justify-end border-t border-[#F1F5F9]">
      <button
        onClick={onClose}
        className="inline-flex items-center gap-[6px] px-[16px] py-[7px] rounded-[8px] text-[12px] font-semibold bg-white text-[#475569] border border-[#E2E8F0] cursor-pointer hover:bg-[#F8FAFC] transition-colors duration-[120ms]"
      >
        Tutup
      </button>
      {showCetak && (
        <button
          onClick={onCetak}
          className="inline-flex items-center gap-[6px] px-[16px] py-[7px] rounded-[8px] text-[12px] font-semibold bg-[#1a56db] text-white cursor-pointer hover:bg-[#073864] transition-colors duration-[120ms]"
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Cetak Profil
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   DOSEN detail (Image 2 reference)
══════════════════════════════════════════ */
function DosenDetail({ d, onClose }: { d: Dosen; onClose: () => void }) {
  const pN = parseInt(d.pub) || 0;
  const sN = parseInt(d.sks) || 0;

  return (
    <>
      {/* ── Header ── */}
      <div className="flex items-start gap-[14px] px-[22px] py-[18px] border-b border-[#F1F5F9]">
        <div
          className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#1a56db,#073864)' }}
        >
          {d.ini}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-[#0F172A] leading-tight">{d.nm}</div>
          <div className="text-[10.5px] text-[#94A3B8] mt-[3px] leading-relaxed">
            NIP: {d.nip} · Fakultas {d.fak}
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
          className="text-[14px] text-[#94A3B8] w-[26px] h-[26px] flex items-center justify-center rounded-[6px] cursor-pointer hover:bg-[#F1F5F9] hover:text-[#0F172A] shrink-0 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* ── Body ── */}
      <div className="px-[22px] py-[16px] flex flex-col gap-[18px]">

        {/* Kinerja Akademik */}
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

        {/* Riwayat Publikasi */}
        <div>
          <SectionLabel>Riwayat Publikasi</SectionLabel>

          {/* Ringkasan — 4 stat cards */}
          <div className="grid grid-cols-4 gap-[8px] mb-[14px]">
            <div className="bg-[#EEF5FC] rounded-[10px] px-3 py-[10px] flex flex-col gap-[3px]">
              <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-[.5px]">Total</div>
              <div className="text-[20px] font-bold text-[#1a56db] leading-none">{d.pubHistory?.length ?? 0}</div>
              <div className="text-[9.5px] text-[#94A3B8]">publikasi</div>
            </div>
            <div className="bg-[#F0FDF4] rounded-[10px] px-3 py-[10px] flex flex-col gap-[3px]">
              <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-[.5px]">3 Thn Terakhir</div>
              <div className="text-[20px] font-bold text-[#059669] leading-none">{(d.pubHistory ?? []).filter(p => p.tahun >= new Date().getFullYear() - 3).length}</div>
              <div className="text-[9.5px] text-[#94A3B8]">publikasi</div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3 py-[10px] flex flex-col gap-[3px]">
              <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-[.5px]">Terakhir</div>
              <div className="text-[13px] font-bold text-[#0F172A] leading-snug mt-[2px]">{d.pubLast}</div>
              <div className="text-[9.5px] text-[#94A3B8]">tgl publikasi</div>
            </div>
            <div className="bg-[#FEF3C7] rounded-[10px] px-3 py-[10px] flex flex-col gap-[3px]">
              <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-[.5px]">Deadline</div>
              <div className="text-[13px] font-bold text-[#D97706] leading-snug mt-[2px]">{d.pubDeadline}</div>
              <div className="text-[9.5px] text-[#94A3B8]">berikutnya</div>
            </div>
          </div>

          {/* Tabel riwayat */}
          {d.pubHistory && d.pubHistory.length > 0 ? (
            <div className="rounded-[10px] border border-[#E2E8F0] overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-4 py-[10px] text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-[.8px] w-[64px]">Tahun</th>
                    <th className="px-4 py-[10px] text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-[.8px]">Judul</th>
                    <th className="px-4 py-[10px] text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-[.8px] w-[110px]">Indeks</th>
                  </tr>
                </thead>
                <tbody>
                  {d.pubHistory.map((p, i) => (
                    <tr key={i} className="[&:last-child_td]:border-b-0 hover:bg-[#F8FAFC] transition-colors duration-[80ms]">
                      <td className="px-4 py-[12px] border-b border-[#F1F5F9] align-top">
                        <span className="inline-flex items-center justify-center rounded-[6px] text-[11px] font-bold text-[#1a56db] bg-[#EEF5FC] px-[8px] py-[2px] whitespace-nowrap">{p.tahun}</span>
                      </td>
                      <td className="px-4 py-[12px] border-b border-[#F1F5F9] align-top">
                        <div className="text-[12px] font-medium text-[#0F172A] leading-[1.5]">{p.judul}</div>
                      </td>
                      <td className="px-4 py-[12px] border-b border-[#F1F5F9] align-top">
                        <span className={`inline-flex items-center rounded-[6px] font-semibold px-[9px] py-[3px] text-[10.5px] whitespace-nowrap ${
                          p.indeks.startsWith('Scopus Q1') ? 'bg-[#DBEAFE] text-[#1e3a8a]' :
                          p.indeks.startsWith('Scopus') ? 'bg-[#DBEAFE] text-[#1e40af]' :
                          p.indeks.startsWith('Sinta 1') || p.indeks.startsWith('Sinta 2') ? 'bg-[#D1FAE5] text-[#065f46]' :
                          'bg-[#F1F5F9] text-[#475569]'
                        }`}>{p.indeks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-[12px] text-[#94A3B8] italic py-2">Belum ada riwayat publikasi.</div>
          )}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   MAHASISWA detail (Image 1 reference)
══════════════════════════════════════════ */
function MhsDetail({ m, onClose }: { m: Mhs; onClose: () => void }) {
  const c = ipkColor(m.ipk);

  return (
    <>
      <div className="flex items-start gap-[14px] px-[22px] py-[18px] border-b border-[#F1F5F9]">
        <div
          className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
        >
          {m.ini}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-[#0F172A] leading-tight">{m.nm}</div>
          <div className="text-[10.5px] text-[#94A3B8] mt-[3px] leading-relaxed">
            NPM: {m.npm} · {m.prodi} · Angkatan {m.ang}
          </div>
          <div className="flex gap-[5px] mt-[8px] flex-wrap">
            <span className="inline-flex items-center rounded-[6px] font-semibold 
            whitespace-nowrap px-[10px] py-[3px] text-[11px] bg-[#DBEAFE] text-[#1e40af]">
              Semester {m.sem}
            </span>
            <span className="inline-flex items-center rounded-[6px] font-semibold 
            whitespace-nowrap px-[10px] py-[3px] text-[11px] bg-[#F1F5F9] text-[#475569]">
              {m.sks} SKS
            </span>
            <StatusChip status={m.status} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[14px] text-[#94A3B8] w-[26px] h-[26px] flex items-center 
          justify-center rounded-[6px] cursor-pointer hover:bg-[#F1F5F9] hover:text-[#0F172A] shrink-0 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="px-[22px] py-[16px] flex flex-col gap-[18px]">

        <div>
          <SectionLabel>Data Akademik</SectionLabel>

      <div className="grid grid-cols-2 gap-x-4 mb-[16px]">
        <div>
          <div className="text-[10.5px] text-[#94A3B8] mb-[3px]">
            IPK
          </div>
          <div
            className="text-[12.5px] font-semibold leading-snug"
            style={{ color: c }}
          >
            {m.ipk.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-[10.5px] text-[#94A3B8] mb-[3px]">
            SKS Lulus
          </div>
          <div className="text-[12.5px] font-semibold text-[#0F172A] leading-snug">
            {m.sks} SKS
          </div>
        </div>
      </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-[12px]">
            <InfoRow label="Program Studi" value={m.prodi} />
            <InfoRow label="Fakultas"      value={m.fak} />
            <InfoRow label="Dosen PA"      value={m.pa} />
            <InfoRow label="KKN"           value="Belum Melaksanakan" />
            <InfoRow label="Email"         value={m.email} small />
            <InfoRow label="TOEFL"         value="Belum Terverifikasi" />
          </div>
        </div>

        <div>
          <SectionLabel>Kinerja Akademik</SectionLabel>
          <ProgBar
            label="IPK"
            val={m.ipk.toFixed(2)}
            max="4.00"
            pct={(m.ipk / 4) * 100}
            colorClass={m.ipk >= 3 ? 'bg-[#059669]' : m.ipk >= 2 ? 'bg-[#D97706]' : 'bg-[#DC2626]'}
          />
          <ProgBar
            label="SKS Lulus"
            val={`${m.sks}`}
            max="144"
            pct={Math.min((m.sks / 144) * 100, 100)}
            colorClass="bg-[#1a56db]"
          />
          <ProgBar
            label="Semester Tempuh"
            val={`${m.sem}`}
            max="8 ideal"
            pct={Math.min((m.sem / 8) * 100, 100)}
            colorClass={m.sem > 8 ? 'bg-[#D97706]' : 'bg-[#1a56db]'}
          />
        </div>

        <div>
          <SectionLabel>Statistik Cepat</SectionLabel>
          <div className="grid grid-cols-3 gap-[8px]">
            <StatBox val={m.ipk.toFixed(2)} label="IPK"      bg="#FEE2E2" color={c} />
            <StatBox val={m.sks}            label="SKS"      bg="#FEF3C7" color="#D97706" />
            <StatBox val={m.sem}            label="Semester" bg="#EEF5FC" color="#1a56db" />
          </div>
        </div>

        <div>
          <SectionLabel>Riwayat &amp; Catatan</SectionLabel>
          <Timeline items={m.rw} />
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════ */
export default function DetailModal({ open, type, dosenData, mhsData, index, onClose }: Props) {
  if (!open || type === null || index < 0) return null;

  const d = type === 'dosen' ? dosenData[index] : null;
  const m = type === 'mahasiswa' ? mhsData[index] : null;
  if (!d && !m) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[600] flex items-center justify-center p-5 backdrop-blur-[4px]"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[18px] max-w-[560px] w-full max-h-[92vh] overflow-y-auto shadow-[0_28px_64px_rgba(0,0,0,.24)]">
        {d && <DosenDetail d={d} onClose={onClose} />}
        {m && <MhsDetail  m={m} onClose={onClose} />}
        <ModalFooter onClose={onClose} onCetak={() => { if (d) cetakProfilDosen(d); else if (m) cetakProfilMhs(m); }} showCetak={!!d} />
      </div>
    </div>
  );
}