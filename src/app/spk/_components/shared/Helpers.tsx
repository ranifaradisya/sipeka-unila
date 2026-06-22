'use client';

// ═══ CHIP / BADGE HELPERS ═══

export function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    Normal:      'bg-[#D1FAE5] text-[#065f46]',
    Perhatian:   'bg-[#FEF3C7] text-[#92400e]',
    Peringatan:  'bg-[#FEE2E2] text-[#991b1b]',
    'Perlu S3':  'bg-[#FEF3C7] text-[#92400e]',
    'Pantau S3': 'bg-[#DBEAFE] text-[#1e40af]',
    SP1:         'bg-[#FEE2E2] text-[#991b1b]',
    SP2:         'bg-[#FEE2E2] text-[#991b1b]',
  };
  const cls = map[status] ?? 'bg-[#F1F5F9] text-[#475569]';
  return (
    <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] tracking-[.1px] ${cls}`}>
      {status}
    </span>
  );
}

export function PendChip({ pend }: { pend: string }) {
  const cls =
    pend === 'S3' ? 'bg-[#D1FAE5] text-[#065f46]' :
    pend === 'S2' ? 'bg-[#EEF5FC] text-[#1a56db]' :
                    'bg-[#FEE2E2] text-[#991b1b]';
  return (
    <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] tracking-[.1px] ${cls}`}>
      {pend}
    </span>
  );
}

export function BimbChip({ n }: { n: number }) {
  const cls =
    n > 12 ? 'bg-[#FEE2E2] text-[#991b1b]' :
    n < 5  ? 'bg-[#FEF3C7] text-[#92400e]' :
              'bg-[#D1FAE5] text-[#065f46]';
  const label = n > 12 ? 'Tinggi' : n < 5 ? 'Rendah' : 'Ideal';
  return (
    <span className={`inline-flex items-center rounded-[6px] font-semibold whitespace-nowrap px-[10px] py-[3px] text-[11px] tracking-[.1px] ${cls}`}>
      {label}
    </span>
  );
}

export function ipkColor(v: number): string {
  return v < 2 ? '#DC2626' : v < 3 ? '#D97706' : '#059669';
}

// ═══ SELECT WRAPPER — fix @tailwindcss/forms yang hapus native chevron ═══
interface SelProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  sm?: boolean; // true = ukuran kecil (year filter)
}

export function Sel({ value, onChange, children, sm }: SelProps) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={onChange}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          border: '1.5px solid #E2E8F0',
          borderRadius: sm ? '7px' : '8px',
          padding: sm ? '5px 28px 5px 10px' : '7px 28px 7px 10px',
          fontSize: sm ? '11px' : '12px',
          color: '#334155',
          background: 'white',
          outline: 'none',
          cursor: 'pointer',
          fontFamily: "'Poppins',sans-serif",
          boxShadow: 'none',
        }}
      >
        {children}
      </select>
      {/* Custom chevron */}
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'absolute', right: 9, pointerEvents: 'none' }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

// Pagination row
export function Pagination({ current, total, info }: { current: number; total: number; info: string }) {
  return (
    <div className="px-4 py-[10px] flex items-center gap-[5px] border-t border-[#F1F5F9] bg-[#F8FAFC]">
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          className={`px-[10px] py-[5px] rounded-[6px] border-[1.5px] text-[11.5px] font-semibold cursor-pointer transition-all duration-[120ms] ${
            p === current
              ? 'bg-[#1a56db] border-[#1a56db] text-white'
              : 'bg-white border-[#E2E8F0] text-[#475569] hover:border-[#1a56db] hover:text-[#1a56db]'
          }`}
        >
          {p}
        </button>
      ))}
      <span className="ml-auto text-[10.5px] text-[#94A3B8]">{info}</span>
    </div>
  );
}

// Export button
export function BtnExport({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] text-[11px] font-semibold bg-white border-[1.5px] border-[#CCE5F5] text-[#1a56db] cursor-pointer transition-all duration-[130ms] whitespace-nowrap hover:bg-[#EEF5FC] hover:border-[#1a56db]"
    >
      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Ekspor
    </button>
  );
}

// Section divider
export function SecDiv({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[14px]" style={{ margin: '36px 0 22px' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#E2E8F0,transparent)' }} />
      <div className="flex items-center gap-2 text-white px-[18px] py-[6px] rounded-full text-[11.5px] font-bold whitespace-nowrap tracking-[.2px]"
        style={{ background: 'linear-gradient(135deg,#1a56db 0%,#073864 100%)', boxShadow: '0 4px 14px rgba(11,94,168,.28)' }}>
        {icon}
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,#E2E8F0)' }} />
    </div>
  );
}