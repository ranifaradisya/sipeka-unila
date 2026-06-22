'use client';

// ── PdfKop (inline) ─────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsPDFDoc = any;
const JSPDF_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
const LOGO_PATH = '/assets/images/logo-unila.png';
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error(`Gagal load: ${src}`));
    document.head.appendChild(s);
  });
}
async function loadJsPDF(): Promise<JsPDFDoc> {
  await loadScript(JSPDF_CDN);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).jspdf.jsPDF;
}
async function fetchLogoB64(): Promise<string> {
  try {
    const r = await fetch(LOGO_PATH);
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
const PAGE_W = 210, PAGE_L = 20, PAGE_R = 20, CONTENT_W = 170;
function drawKopSurat(doc: JsPDFDoc, logoB64: string, startY = 15): number {
  let y = startY;
  const kopX = PAGE_W / 2;
  if (logoB64) doc.addImage(logoB64, 'PNG', PAGE_L, y - 4, 20, 20);
  doc.setFont('times', 'normal'); doc.setFontSize(8); doc.setTextColor(0, 0, 0);
  doc.text('KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI', kopX, y, { align: 'center' }); y += 5;
  doc.setFont('times', 'bold'); doc.setFontSize(16);
  doc.text('UNIVERSITAS LAMPUNG', kopX, y, { align: 'center' }); y += 6;
  doc.setFont('courier', 'normal'); doc.setFontSize(7.5); doc.setTextColor(60, 60, 60);
  doc.text('Jl. Prof. Dr. Soemantri Brojonegoro No.1 Bandar Lampung', kopX, y, { align: 'center' }); y += 4;
  doc.text('Telp : 702767, 702971, 703475, 702673, 701252, 701609', kopX, y, { align: 'center' }); y += 5;
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(1.0);
  doc.line(PAGE_L, y, PAGE_W - PAGE_R, y); y += 1;
  doc.setLineWidth(0.3); doc.line(PAGE_L, y, PAGE_W - PAGE_R, y); y += 8;
  return y;
}
function drawFooterCetak(doc: JsPDFDoc): void {
  const pages = doc.internal.getNumberOfPages();
  const tglCetak = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
    doc.line(PAGE_L, 285, PAGE_W - PAGE_R, 285);
    doc.setFont('courier', 'normal'); doc.setFontSize(7); doc.setTextColor(100, 116, 139);
    doc.text(`Bandar Lampung, ${tglCetak}`, PAGE_L, 290);
    doc.text(`Hal ${i} dari ${pages}`, PAGE_W - PAGE_R, 290, { align: 'right' });
  }
}
// ────────────────────────────────────────────────────────────────

export type ProfesorData = {
  no: number;
  nm: string;
  fak: string;
  totalPub: number;
  lastPub: string;
  batas: string;
  status: string;
  statusCls: string;
  nip: string;
  gol: string;
  bidang: string;
};

async function cetakProfilProfesor(
  p: ProfesorData,
  pubHistory: { tahun: number; judul: string; indeks: string }[],
) {
  const jsPDF = await loadJsPDF();
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = PAGE_W; const PL = PAGE_L; const PR = PAGE_R; const CW = CONTENT_W;

  // ── KOP SURAT (gaya transkrip Unila, dgn logo) ────────────
  const logoB64 = await fetchLogoB64();
  let y = drawKopSurat(doc, logoB64);
  const kopX = W / 2;

  // ── helpers (font Courier — menyamai dokumen resmi) ───────
  const checkPage = (need = 10) => {
    if (y + need > 278) { doc.addPage(); y = 20; }
  };

  const sectionHeading = (t: string) => {
    checkPage(12);
    doc.setFont('courier', 'bold'); doc.setFontSize(8); doc.setTextColor(100, 116, 139);
    doc.text(t.toUpperCase(), PL, y); y += 4;
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3); doc.line(PL, y, W - PR, y);
    y += 5;
  };

  const row = (label: string, value: string) => {
    checkPage(7);
    doc.setFont('courier', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
    doc.text(label, PL, y);
    doc.setFont('courier', 'bold'); doc.setTextColor(15, 23, 42);
    const val = doc.splitTextToSize(value || '—', CW - 52);
    doc.text(val, PL + 52, y);
    y += Math.max(val.length * 5, 6);
  };

  // ── Judul Dokumen ─────────────────────────────────────────
  doc.setFont('courier', 'bold'); doc.setFontSize(11); doc.setTextColor(0, 0, 0);
  doc.text('PROFIL GURU BESAR', kopX, y, { align: 'center' }); y += 10;

  // ── Info 2 kolom (gaya transkrip) ─────────────────────────
  const col1x = PL; const col2x = W / 2 + 5; const labelW = 30;
  const infoRow2Col = (l1: string, v1: string, l2: string, v2: string) => {
    doc.setFont('courier', 'normal'); doc.setFontSize(9); doc.setTextColor(0, 0, 0);
    doc.text(l1, col1x, y); doc.text(`: ${v1}`, col1x + labelW, y);
    doc.text(l2, col2x, y); doc.text(`: ${v2}`, col2x + labelW, y);
    y += 5.5;
  };
  infoRow2Col('NAMA',            p.nm,               'Fakultas',        p.fak);
  infoRow2Col('NIP',             p.nip,              'Golongan',        p.gol);
  infoRow2Col('Jabatan Fung.',   'Guru Besar',        'Bidang Keahlian', p.bidang);
  infoRow2Col('Status',          p.status,            'Total Publikasi', `${p.totalPub} publikasi`);
  y += 3;
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3); doc.line(PL, y, W - PR, y); y += 7;

  // ── Identitas Guru Besar ──────────────────────────────────
  sectionHeading('Identitas Guru Besar');
  row('Nama Lengkap',       p.nm);
  row('NIP',                p.nip);
  row('Golongan',           p.gol);
  row('Bidang Keahlian',    p.bidang);
  row('Jabatan Fungsional', 'Guru Besar / Profesor');
  row('Fakultas',           `Fakultas ${p.fak}`);
  row('Universitas',        'Universitas Lampung');
  y += 2;

  // ── Kewajiban Publikasi ───────────────────────────────────
  const recentPub = pubHistory.filter(h => h.tahun >= new Date().getFullYear() - 3).length;
  sectionHeading('Ringkasan Kewajiban Publikasi');
  row('Total Publikasi',                `${p.totalPub} publikasi`);
  row('Publikasi 3 Tahun Terakhir',     `${recentPub} publikasi`);
  row('Tanggal Publikasi Terakhir',     p.lastPub);
  row('Batas Publikasi Berikutnya',     p.batas);
  row('Status Kepatuhan',               p.status);
  y += 2;

  // ── Riwayat Publikasi ─────────────────────────────────────
  sectionHeading('Riwayat Publikasi');
  pubHistory.forEach((h, i) => {
    checkPage(8);
    doc.setFont('courier', 'normal'); doc.setFontSize(9); doc.setTextColor(15, 23, 42);
    const lines = doc.splitTextToSize(`${i + 1}. [${h.tahun}] ${h.judul} (${h.indeks})`, CW);
    doc.text(lines, PL, y);
    y += lines.length * 5 + 2;
  });
  y += 2;

  // ── Catatan ───────────────────────────────────────────────
  checkPage(30);
  sectionHeading('Catatan');
  const notes = [
    '1. Guru Besar wajib mempublikasikan karya ilmiah pada jurnal internasional bereputasi minimal 1 (satu) kali dalam 3 (tiga) tahun.',
    '2. Kegagalan memenuhi kewajiban dapat mengakibatkan penangguhan tunjangan jabatan fungsional sesuai peraturan berlaku.',
    '3. Data publikasi bersumber dari SISTER, PDDIKTI, dan Scopus yang diintegrasikan ke SIPEKA Universitas Lampung.',
  ];
  notes.forEach(n => {
    checkPage(10);
    doc.setFont('courier', 'normal'); doc.setFontSize(8); doc.setTextColor(80, 80, 80);
    const lines = doc.splitTextToSize(n, CW);
    doc.text(lines, PL, y);
    y += lines.length * 4.5 + 2;
  });

  // ── Footer tiap halaman ───────────────────────────────────
  drawFooterCetak(doc);

  doc.save(`Profil_${p.nm.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

interface Props {
  open: boolean;
  profesor: ProfesorData | null;
  onClose: () => void;
}

/* ─── Sub-components ─── */

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

function InfoRow({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] text-[#94A3B8] mb-[2px]">{label}</div>
      <div className={`font-semibold text-[#0F172A] ${small ? 'text-[11px]' : 'text-[13px]'}`}>{value || '—'}</div>
    </div>
  );
}

function makePubHistory(nm: string, total: number, lastPub: string) {
  const lastName = nm.split(' ').slice(-2).join(' ');
  const lastYear = parseInt(lastPub.split(' ')[1]) || 2024;
  const topics = [
    'Analisis Kebijakan dan Implementasi',
    'Studi Komparatif Pendekatan Metodologi',
    'Pengembangan Model Berbasis Data',
    'Kajian Empiris dan Tinjauan Sistematis',
    'Inovasi dan Transformasi dalam Konteks Lokal',
    'Evaluasi Sistem dan Pendekatan Kuantitatif',
    'Perspektif Kritis terhadap Regulasi',
    'Pemodelan Statistik dan Aplikasinya',
    'Tata Kelola dan Akuntabilitas Publik',
    'Strategi Pengembangan Sumber Daya',
    'Integrasi Teknologi dalam Pendidikan Tinggi',
    'Metodologi Penelitian Lintas Disiplin',
  ];
  const indeksList = [
    'Scopus Q1','Scopus Q2','Sinta 1','Sinta 2','Sinta 3',
    'Sinta 2','Scopus Q2','Sinta 1','Sinta 3','Sinta 2','Sinta 1','Scopus Q3',
  ];
  return Array.from({ length: total }, (_, i) => ({
    tahun: lastYear - i,
    judul: `${topics[i % topics.length]} — ${lastName}`,
    indeks: indeksList[i % indeksList.length],
  }));
}

export default function ProfesorModal({ open, profesor: p, onClose }: Props) {
  if (!open || !p) return null;

  const pubHistory = makePubHistory(p.nm, p.totalPub, p.lastPub);
  const recentPub  = pubHistory.filter(h => h.tahun >= new Date().getFullYear() - 3).length;
  const ini        = p.nm.split(' ').filter(w => w.match(/^[A-Z]/)).slice(0, 2).map(w => w[0]).join('');

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
            {ini}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-bold text-[#0F172A] leading-tight">{p.nm}</div>
            <div className="text-[10.5px] text-[#94A3B8] mt-[3px] leading-relaxed">
              NIP: {p.nip} · Golongan {p.gol} · Fakultas {p.fak}
            </div>
            <div className="flex gap-[5px] mt-[8px] flex-wrap">
              <span className="inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] bg-[#DBEAFE] text-[#1e40af]">
                Guru Besar
              </span>
              <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] ${p.statusCls}`}>
                {p.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[14px] text-[#94A3B8] w-[28px] h-[28px] flex items-center justify-center rounded-[6px] cursor-pointer hover:bg-[#F1F5F9] hover:text-[#0F172A] shrink-0 transition-colors"
          >✕</button>
        </div>

        {/* ── Body ── */}
        <div className="px-[24px] py-[18px] flex flex-col gap-[22px]">

          {/* Informasi Kepegawaian */}
          <div>
            <SectionLabel>Informasi Kepegawaian</SectionLabel>
            <div className="grid grid-cols-2 gap-x-6 gap-y-[14px]">
              <InfoRow label="NIP"             value={p.nip} />
              <InfoRow label="Golongan"        value={p.gol} />
              <InfoRow label="Bidang Keahlian" value={p.bidang} small />
              <InfoRow label="Fakultas"        value={p.fak} />
            </div>
          </div>

          {/* Status Publikasi */}
          <div>
            <SectionLabel>Status Kewajiban Publikasi</SectionLabel>
            <ProgBar
              label="Total Publikasi"
              val={`${p.totalPub}`}
              max="Target"
              pct={Math.min((p.totalPub / 10) * 100, 100)}
              colorClass="bg-[#1a56db]"
            />
            <ProgBar
              label="Publikasi 3 Thn Terakhir"
              val={`${recentPub}`}
              max="1 wajib"
              pct={Math.min(recentPub * 100, 100)}
              colorClass={recentPub >= 1 ? 'bg-[#059669]' : 'bg-[#DC2626]'}
            />
          </div>

          {/* Statistik Cepat */}
          <div>
            <SectionLabel>Statistik Cepat</SectionLabel>
            <div className="grid grid-cols-3 gap-[10px]">
              <div className="rounded-[12px] px-3 py-[14px] text-center flex flex-col items-center gap-1 bg-[#EEF5FC]">
                <div className="text-[24px] font-bold leading-none text-[#1a56db]">{p.totalPub}</div>
                <div className="text-[9.5px] font-bold text-[#94A3B8] uppercase tracking-[.6px] mt-[2px]">Total Pub.</div>
              </div>
              <div className="rounded-[12px] px-3 py-[14px] text-center flex flex-col items-center gap-1 bg-[#D1FAE5]">
                <div className="text-[24px] font-bold leading-none text-[#059669]">{recentPub}</div>
                <div className="text-[9.5px] font-bold text-[#94A3B8] uppercase tracking-[.6px] mt-[2px]">3 Thn Terakhir</div>
              </div>
              <div className={`rounded-[12px] px-3 py-[14px] text-center flex flex-col items-center gap-1 ${p.status === 'Kritis' ? 'bg-[#FEE2E2]' : p.status === 'Perhatian' ? 'bg-[#FEF3C7]' : 'bg-[#D1FAE5]'}`}>
                <div className={`text-[13px] font-bold leading-snug mt-[2px] ${p.status === 'Kritis' ? 'text-[#DC2626]' : p.status === 'Perhatian' ? 'text-[#D97706]' : 'text-[#059669]'}`}>{p.status}</div>
                <div className="text-[9.5px] font-bold text-[#94A3B8] uppercase tracking-[.6px] mt-[2px]">Status</div>
              </div>
            </div>
          </div>

          {/* Riwayat Publikasi */}
          <div>
            <SectionLabel>Riwayat Publikasi</SectionLabel>
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
                  {pubHistory.map((h, i) => (
                    <tr key={i} className="[&:last-child_td]:border-b-0 hover:bg-[#F8FAFC] transition-colors duration-[80ms]">
                      <td className="px-4 py-[12px] border-b border-[#F1F5F9] align-top">
                        <span className="inline-flex items-center justify-center rounded-[6px] text-[11px] font-bold text-[#1a56db] bg-[#EEF5FC] px-[8px] py-[2px] whitespace-nowrap">{h.tahun}</span>
                      </td>
                      <td className="px-4 py-[12px] border-b border-[#F1F5F9] align-top">
                        <div className="text-[12px] font-medium text-[#0F172A] leading-[1.5]">{h.judul}</div>
                      </td>
                      <td className="px-4 py-[12px] border-b border-[#F1F5F9] align-top">
                        <span className={`inline-flex items-center rounded-[6px] font-semibold px-[9px] py-[3px] text-[10.5px] whitespace-nowrap ${
                          h.indeks.startsWith('Scopus Q1') ? 'bg-[#DBEAFE] text-[#1e3a8a]' :
                          h.indeks.startsWith('Scopus')    ? 'bg-[#DBEAFE] text-[#1e40af]' :
                          h.indeks.startsWith('Sinta 1') || h.indeks.startsWith('Sinta 2') ? 'bg-[#D1FAE5] text-[#065f46]' :
                          'bg-[#F1F5F9] text-[#475569]'
                        }`}>{h.indeks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-[24px] pb-[20px] pt-[12px] flex gap-[8px] justify-end border-t border-[#F1F5F9]">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] text-[12px] font-semibold bg-white text-[#475569] border border-[#E2E8F0] cursor-pointer hover:bg-[#F8FAFC] transition-colors duration-[120ms]"
          >Tutup</button>
          <button
            onClick={() => cetakProfilProfesor(p!, pubHistory)}
            className="inline-flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] text-[12px] font-semibold bg-[#1a56db] text-white cursor-pointer hover:bg-[#073864] transition-colors duration-[120ms]"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Cetak Profil
          </button>
        </div>
      </div>
    </div>
  );
}