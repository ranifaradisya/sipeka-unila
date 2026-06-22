export type RiwayatItem = { c: "" | "g" | "w" | "r"; t: string; m: string };
export type PubItem = { tahun: number; judul: string; indeks: string };

export type Dosen = {
  id: string;
  nm: string;
  ini: string;
  nip: string;
  fak: string;
  prodi: string;
  pend: "S1" | "S2" | "S3" | "D3" | "D4" | "Profesi" | "Spesialis";
  inst: string;
  jabfung: string;
  gol: string;
  masa: string;
  status: string;
  sks: string;
  pub: string;
  email: string;
  telp: string;
  bidang: string;
  bimb: number;
  rw: RiwayatItem[];
  pubHistory: PubItem[];
  pubLast: string;   // e.g. "Nov 2023"
  pubDeadline: string; // e.g. "Nov 2026"
};

export type Mhs = {
  npm: string;
  nm: string;
  ini: string;
  fak: string;
  prodi: string;
  jenjang: "D3" | "D4" | "S1" | "Profesi" | "S2" | "Spesialis" | "S3";
  jalurMasuk: "PDB Murni" | "Pindahan" | "Lintas Jalur" | "Alih Jenjang" | "RPL";
  ang: string;
  sem: number;
  ipk: number;
  sks: number;
  status: string;
  email: string;
  pa: string;
  ta: string;
  n1: string;
  n2: string;
  n3: string;
  rw: RiwayatItem[];
};

export type BimbMhs = {
  npm: string;
  nm: string;
  prodi: string;
  sem: number;
  status: 'Aktif' | 'Selesai';
};

export type Bimb = {
  nm: string;
  fak: string;
  prodi: string;
  jenjang: string;
  total: number;
  aktif: number;
  selesai: number;
  mahasiswa?: BimbMhs[];
};

export type Notif = {
  id: number;
  ic: string;
  t: "d" | "w" | "b" | "g";
  title: string;
  body: string;
  time: string;
  unread: boolean;
  cat: "all" | "alert";
};

export type ToastType = "success" | "error" | "warn" | "info";
export type ToastItem = { id: number; type: ToastType; msg: string; visible: boolean };

export type KTWRecord = {
  prodi: string;
  fak: string;
  jenjang: "D3" | "S1" | "S2" | "S3";
  total: number;
  tepatWaktu: number;
  terlambat: number;
  pct: string;
  pctNum: number;
  jalurMasuk?: string;
};

export const KTW_BATAS: Record<string, number> = {
  D3: 6,
  S1: 8,
  S2: 4,
  S3: 6,
};

export const KTW_ROWS: KTWRecord[] = [
  { prodi: "Teknik Informatika",    fak: "Teknik",           jenjang: "S1", total: 142, tepatWaktu: 119, terlambat: 23,  pct: "83.8%", pctNum: 83.8 },
  { prodi: "Manajemen",             fak: "Ekonomi & Bisnis", jenjang: "S1", total: 210, tepatWaktu: 155, terlambat: 55,  pct: "73.8%", pctNum: 73.8 },
  { prodi: "Ilmu Hukum",            fak: "Hukum",            jenjang: "S1", total: 188, tepatWaktu: 160, terlambat: 28,  pct: "85.1%", pctNum: 85.1 },
  { prodi: "Matematika",            fak: "FMIPA",            jenjang: "S1", total: 76,  tepatWaktu: 51,  terlambat: 25,  pct: "67.1%", pctNum: 67.1 },
  { prodi: "Ilmu Komunikasi",       fak: "FISIP",            jenjang: "S1", total: 134, tepatWaktu: 107, terlambat: 27,  pct: "79.9%", pctNum: 79.9 },
  { prodi: "Teknik Sipil",          fak: "Teknik",           jenjang: "S1", total: 118, tepatWaktu:  88, terlambat: 30,  pct: "74.6%", pctNum: 74.6 },
  { prodi: "Akuntansi",             fak: "Ekonomi & Bisnis", jenjang: "S1", total: 196, tepatWaktu: 162, terlambat: 34,  pct: "82.7%", pctNum: 82.7 },
  { prodi: "Pendidikan Biologi",    fak: "FKIP",             jenjang: "S1", total: 88,  tepatWaktu:  70, terlambat: 18,  pct: "79.5%", pctNum: 79.5 },
  // D3
  { prodi: "Perpajakan",            fak: "Ekonomi & Bisnis", jenjang: "D3", total: 54,  tepatWaktu:  48, terlambat: 6,   pct: "88.9%", pctNum: 88.9 },
  { prodi: "Teknik Komputer",       fak: "Teknik",           jenjang: "D3", total: 62,  tepatWaktu:  52, terlambat: 10,  pct: "83.9%", pctNum: 83.9 },
  // S2
  { prodi: "Magister Manajemen",    fak: "Ekonomi & Bisnis", jenjang: "S2", total: 44,  tepatWaktu:  37, terlambat: 7,   pct: "84.1%", pctNum: 84.1 },
  { prodi: "Magister Hukum",        fak: "Hukum",            jenjang: "S2", total: 36,  tepatWaktu:  28, terlambat: 8,   pct: "77.8%", pctNum: 77.8 },
  // S3
  { prodi: "Doktor Ilmu Hukum",     fak: "Hukum",            jenjang: "S3", total: 22,  tepatWaktu:  15, terlambat: 7,   pct: "68.2%", pctNum: 68.2 },
  { prodi: "Doktor Matematika",     fak: "FMIPA",            jenjang: "S3", total: 14,  tepatWaktu:   9, terlambat: 5,   pct: "64.3%", pctNum: 64.3 },
];

export const DOSEN: Dosen[] = [
  {
    id: "001", nm: "Dr. Ahmad Fauzi, M.Si.", ini: "AF", nip: "197204152001121001",
    fak: "FMIPA", prodi: "Matematika", pend: "S3", inst: "ITB Bandung",
    jabfung: "Lektor Kepala", gol: "IV/b", masa: "18 tahun", status: "Normal",
    sks: "9", pub: "3", email: "ahmad.fauzi@unila.ac.id", telp: "081234567890",
    bidang: "Analisis Real & Kalkulus", bimb: 17,
    rw: [
      { c: "g", t: "Kenaikan Jabfung ke Lektor Kepala", m: "2018" },
      { c: "", t: "Lulus S3 — ITB", m: "2005" },
    ],
    pubHistory: [{ tahun: 2024, judul: "Topological Properties of Functional Spaces in Applied Analysis", indeks: "Scopus Q2" }, { tahun: 2023, judul: "Real Analysis on Metric Spaces", indeks: "Scopus Q2" }, { tahun: 2021, judul: "Calculus Methods in Applied Math", indeks: "Sinta 2" }, { tahun: 2020, judul: "Functional Spaces and Operators", indeks: "Scopus Q3" }],
    pubLast: "Aug 2024",
    pubDeadline: "Aug 2027",
  },
  {
    id: "002", nm: "Siti Rahayu, S.Pd.", ini: "SR", nip: "199001202021122002",
    fak: "FKIP", prodi: "Pendidikan Biologi", pend: "S1", inst: "UNILA",
    jabfung: "Belum Ada", gol: "III/a", masa: "3 tahun", status: "Perhatian",
    sks: "6", pub: "1", email: "siti.rahayu@unila.ac.id", telp: "082345678901",
    bidang: "Pendidikan Biologi", bimb: 2,
    rw: [
      { c: "r", t: "Belum ada jabatan fungsional", m: "3 tahun bertugas" },
      { c: "w", t: "Pendidikan masih S1", m: "Perlu segera S2" },
    ],
    pubHistory: [{ tahun: 2024, judul: "Implementasi Pembelajaran Berbasis Proyek pada Materi Ekosistem", indeks: "Sinta 4" }, { tahun: 2022, judul: "Penerapan Model Pembelajaran Berbasis Inkuiri pada Pendidikan Biologi SMA", indeks: "Sinta 4" }],
    pubLast: "Jan 2024",
    pubDeadline: "Jan 2027",
  },
  {
    id: "003", nm: "Budi Santoso, M.Eng.", ini: "BS", nip: "198503152010121003",
    fak: "Teknik", prodi: "Teknik Mesin", pend: "S2", inst: "UGM",
    jabfung: "Asisten Ahli", gol: "III/b", masa: "5 tahun", status: "Normal",
    sks: "6", pub: "6", email: "budi.santoso@unila.ac.id", telp: "083456789012",
    bidang: "Termodinamika", bimb: 8,
    rw: [{ c: "g", t: "Diangkat Asisten Ahli", m: "2021" }],
    pubHistory: [
      { tahun: 2024, judul: "Heat Transfer Optimization in Compact Heat Exchangers Using CFD Simulation", indeks: "Scopus Q2" },
      { tahun: 2023, judul: "Thermal Efficiency Analysis of Rankine Cycle Modifications for Waste Heat Recovery", indeks: "Sinta 2" },
      { tahun: 2023, judul: "Numerical Study of Turbulent Flow Characteristics in Industrial Pipe Systems", indeks: "Sinta 2" },
      { tahun: 2022, judul: "Thermodynamics in Mechanical Systems: A Comprehensive Review", indeks: "Sinta 3" },
      { tahun: 2021, judul: "Energy Audit and Conservation Strategies for Manufacturing Plants in Indonesia", indeks: "Sinta 3" },
      { tahun: 2020, judul: "Eksperimen Perpindahan Panas pada Material Komposit Berbasis Serat Alam", indeks: "Sinta 4" },
    ],
    pubLast: "Sep 2024",
    pubDeadline: "Sep 2027",
  },
  {
    id: "004", nm: "Dewi Kurniawati, M.Sc.", ini: "DK", nip: "199205102019122004",
    fak: "Ekonomi & Bisnis", prodi: "Manajemen", pend: "S2", inst: "UI Jakarta",
    jabfung: "Belum Ada", gol: "III/a", masa: "2.5 tahun", status: "Peringatan",
    sks: "8", pub: "1", email: "dewi.k@unila.ac.id", telp: "084567890123",
    bidang: "Manajemen Keuangan", bimb: 6,
    rw: [{ c: "w", t: "Jabfung mendekati batas 2 tahun", m: "Sisa ±6 bulan" }],
    pubHistory: [{ tahun: 2024, judul: "Pengaruh Likuiditas dan Leverage terhadap Profitabilitas Perusahaan Manufaktur", indeks: "Sinta 3" }, { tahun: 2023, judul: "Analisis Pengaruh Struktur Modal terhadap Kinerja Keuangan Perusahaan Manufaktur di BEI", indeks: "Sinta 3" }],
    pubLast: "Feb 2024",
    pubDeadline: "Feb 2027",
  },
  {
    id: "005", nm: "Prof. Hendra Wijaya, Ph.D.", ini: "HW", nip: "196801101992031005",
    fak: "Hukum", prodi: "Ilmu Hukum", pend: "S3", inst: "Leiden University",
    jabfung: "Profesor", gol: "IV/e", masa: "24 tahun", status: "Normal",
    sks: "12", pub: "5", email: "hendra.w@unila.ac.id", telp: "085678901234",
    bidang: "Hukum Tata Negara", bimb: 11,
    rw: [
      { c: "g", t: "Dikukuhkan sebagai Profesor", m: "2015" },
      { c: "g", t: "Lulus Ph.D. — Leiden", m: "2000" },
    ],
    pubHistory: [{ tahun: 2024, judul: "Constitutional Law in Southeast Asia", indeks: "Scopus Q1" }, { tahun: 2022, judul: "Judicial Review Mechanisms", indeks: "Scopus Q2" }, { tahun: 2021, judul: "State Law & Democracy", indeks: "Sinta 1" }, { tahun: 2019, judul: "Autonomy and Regional Governance", indeks: "Scopus Q3" }, { tahun: 2018, judul: "Comparative Constitutional Studies", indeks: "Sinta 2" }],
    pubLast: "Oct 2024",
    pubDeadline: "Oct 2027",
  },
  {
    id: "006", nm: "Rina Susanti, M.Hum.", ini: "RS", nip: "198002202009122006",
    fak: "FISIP", prodi: "Sosiologi", pend: "S2", inst: "UNPAD",
    jabfung: "Lektor", gol: "III/c", masa: "11 tahun", status: "Perlu S3",
    sks: "8", pub: "2", email: "rina.s@unila.ac.id", telp: "086789012345",
    bidang: "Sosiologi Pendidikan", bimb: 9,
    rw: [{ c: "w", t: "10+ tahun tanpa S3", m: "Segera lanjutkan studi" }],
    pubHistory: [{ tahun: 2024, judul: "Transformasi Sosial Masyarakat Pesisir di Era Digital", indeks: "Sinta 2" }, { tahun: 2023, judul: "Sosiologi Pendidikan Kontemporer", indeks: "Sinta 2" }, { tahun: 2020, judul: "Dinamika Sosial Masyarakat Urban", indeks: "Sinta 3" }],
    pubLast: "Mar 2024",
    pubDeadline: "Mar 2027",
  },
  {
    id: "007", nm: "Agus Prasetyo, M.T.", ini: "AP", nip: "199107152019121007",
    fak: "Teknik", prodi: "Teknik Sipil", pend: "S2", inst: "ITS",
    jabfung: "Belum Ada", gol: "III/a", masa: "2.8 tahun", status: "Peringatan",
    sks: "6", pub: "0", email: "agus.p@unila.ac.id", telp: "087890123456",
    bidang: "Teknik Struktur", bimb: 19,
    rw: [{ c: "w", t: "Jabfung sisa ±2 bulan", m: "Tindak lanjut diperlukan" }],
    pubHistory: [],
    pubLast: "—",
    pubDeadline: "—",
  },
  {
    id: "008", nm: "Nining Hartati, M.Pd.", ini: "NH", nip: "198611052014122008",
    fak: "FKIP", prodi: "Pendidikan IPA", pend: "S2", inst: "UNJ",
    jabfung: "Asisten Ahli", gol: "III/b", masa: "7 tahun", status: "Pantau S3",
    sks: "8", pub: "1", email: "nining.h@unila.ac.id", telp: "088901234567",
    bidang: "Pembelajaran IPA", bimb: 4,
    rw: [{ c: "w", t: "Sedang S3 tahun ke-2", m: "UNJ Jakarta" }],
    pubHistory: [{ tahun: 2021, judul: "Pendekatan Inkuiri dalam Pembelajaran IPA", indeks: "Sinta 3" }],
    pubLast: "Aug 2021",
    pubDeadline: "Aug 2024",
  },
  // Dosen dengan jenjang pend non-S: dipakai untuk test enum baru
  {
    id: "009", nm: "dr. Wahyu Hidayat, Sp.JP.", ini: "WH", nip: "197905122008121009",
    fak: "Kedokteran", prodi: "Kedokteran", pend: "Spesialis", inst: "RSCM Jakarta",
    jabfung: "Lektor", gol: "III/c", masa: "9 tahun", status: "Normal",
    sks: "10", pub: "2", email: "wahyu.h@unila.ac.id", telp: "089012345678",
    bidang: "Kardiologi", bimb: 5,
    rw: [{ c: "g", t: "Spesialis Jantung — RSCM", m: "2008" }],
    pubHistory: [{ tahun: 2024, judul: "Advances in Tropical Cardiology Care Models", indeks: "Scopus Q2" }, { tahun: 2022, judul: "Cardiology Management in Tropical Settings", indeks: "Scopus Q2" }, { tahun: 2020, judul: "Heart Failure Outcomes in Indonesia", indeks: "Sinta 1" }],
    pubLast: "Nov 2024",
    pubDeadline: "Nov 2027",
  },
  {
    id: "010", nm: "drg. Annisa Permata, Sp.KG.", ini: "APN", nip: "198804202016122010",
    fak: "Kedokteran Gigi", prodi: "Kedokteran Gigi", pend: "Profesi", inst: "Unpad",
    jabfung: "Asisten Ahli", gol: "III/b", masa: "4 tahun", status: "Normal",
    sks: "8", pub: "1", email: "annisa.p@unila.ac.id", telp: "080123456789",
    bidang: "Konservasi Gigi", bimb: 3,
    rw: [{ c: "g", t: "Spesialis Konservasi Gigi", m: "2016" }],
    pubHistory: [{ tahun: 2024, judul: "Minimally Invasive Endodontic Techniques: A Clinical Update", indeks: "Sinta 2" }, { tahun: 2023, judul: "Endodontic Treatment Outcomes", indeks: "Sinta 2" }],
    pubLast: "Dec 2024",
    pubDeadline: "Dec 2027",
  },
  {
    id: "011", nm: "Eko Wahyudi, S.Kom.", ini: "EW", nip: "199306102021121011",
    fak: "Teknik", prodi: "Teknik Informatika", pend: "S1", inst: "UNILA",
    jabfung: "Belum Ada", gol: "III/a", masa: "2.2 tahun", status: "Perhatian",
    sks: "8", pub: "0", email: "eko.wahyudi@unila.ac.id", telp: "081223344556",
    bidang: "Rekayasa Perangkat Lunak", bimb: 3,
    rw: [
      { c: "r", t: "Belum ada jabatan fungsional", m: "2.2 tahun bertugas" },
      { c: "w", t: "Pendidikan masih S1", m: "Perlu segera S2" },
    ],
    pubHistory: [],
    pubLast: "—",
    pubDeadline: "—",
  },
  {
    id: "012", nm: "Yuli Astuti, S.E.", ini: "YA", nip: "199407152021122012",
    fak: "Ekonomi & Bisnis", prodi: "Akuntansi", pend: "S1", inst: "UNILA",
    jabfung: "Belum Ada", gol: "III/a", masa: "1.8 tahun", status: "Perhatian",
    sks: "7", pub: "0", email: "yuli.astuti@unila.ac.id", telp: "081334455667",
    bidang: "Akuntansi Keuangan", bimb: 1,
    rw: [
      { c: "r", t: "Belum ada jabatan fungsional", m: "1.8 tahun bertugas" },
      { c: "w", t: "Pendidikan masih S1", m: "Perlu segera S2" },
    ],
    pubHistory: [],
    pubLast: "—",
    pubDeadline: "—",
  },
  {
    id: "013", nm: "Hendra Gunawan, M.Kom.", ini: "HG", nip: "199002112019121013",
    fak: "Teknik", prodi: "Teknik Informatika", pend: "S2", inst: "ITB",
    jabfung: "Belum Ada", gol: "III/b", masa: "2.4 tahun", status: "Peringatan",
    sks: "9", pub: "1", email: "hendra.gunawan@unila.ac.id", telp: "081445566778",
    bidang: "Jaringan Komputer", bimb: 7,
    rw: [{ c: "w", t: "Jabfung mendekati batas 2 tahun", m: "Sisa ±5 bulan" }],
    pubHistory: [{ tahun: 2024, judul: "Optimalisasi Keamanan Jaringan Nirkabel Berbasis WPA3 di Lingkungan Kampus", indeks: "Sinta 3" }, { tahun: 2022, judul: "Analisis Performa Jaringan Nirkabel Kampus", indeks: "Sinta 4" }],
    pubLast: "Apr 2024",
    pubDeadline: "Apr 2027",
  },
  {
    id: "014", nm: "Maya Indriani, M.Si.", ini: "MI", nip: "198909252018122014",
    fak: "FMIPA", prodi: "Kimia", pend: "S2", inst: "ITB",
    jabfung: "Lektor", gol: "III/c", masa: "12 tahun", status: "Perlu S3",
    sks: "10", pub: "2", email: "maya.indriani@unila.ac.id", telp: "081556677889",
    bidang: "Kimia Analitik", bimb: 10,
    rw: [{ c: "w", t: "10+ tahun tanpa S3", m: "Segera lanjutkan studi" }],
    pubHistory: [{ tahun: 2025, judul: "Advanced Spectrophotometric Techniques for Trace Metal Detection", indeks: "Scopus Q3" }, { tahun: 2022, judul: "Metode Spektrofotometri untuk Analisis Logam Berat", indeks: "Sinta 3" }, { tahun: 2019, judul: "Karakterisasi Senyawa Organik Bahan Alam", indeks: "Sinta 4" }],
    pubLast: "Jan 2025",
    pubDeadline: "Jan 2028",
  },
  {
    id: "015", nm: "Bambang Setiawan, M.Pd.", ini: "BSt", nip: "198304182012121015",
    fak: "FKIP", prodi: "Pendidikan Bahasa Indonesia", pend: "S2", inst: "UPI",
    jabfung: "Lektor", gol: "III/c", masa: "13 tahun", status: "Perlu S3",
    sks: "9", pub: "1", email: "bambang.setiawan@unila.ac.id", telp: "081667788990",
    bidang: "Pembelajaran Bahasa", bimb: 6,
    rw: [{ c: "w", t: "10+ tahun tanpa S3", m: "Segera lanjutkan studi" }],
    pubHistory: [{ tahun: 2021, judul: "Strategi Pembelajaran Bahasa Indonesia Berbasis Teks", indeks: "Sinta 3" }],
    pubLast: "Oct 2021",
    pubDeadline: "Oct 2024",
  },
  {
    id: "016", nm: "Lestari Wulandari, M.Si.", ini: "LW", nip: "198706142015122016",
    fak: "FMIPA", prodi: "Fisika", pend: "S2", inst: "UI Jakarta",
    jabfung: "Asisten Ahli", gol: "III/b", masa: "6 tahun", status: "Pantau S3",
    sks: "9", pub: "1", email: "lestari.wulandari@unila.ac.id", telp: "081778899001",
    bidang: "Fisika Material", bimb: 5,
    rw: [{ c: "w", t: "Sedang S3 tahun ke-1", m: "UI Jakarta" }],
    pubHistory: [{ tahun: 2024, judul: "Studi Sifat Optik Lapisan Tipis untuk Aplikasi Fotovoltaik", indeks: "Sinta 3" }, { tahun: 2022, judul: "Karakterisasi Material Semikonduktor untuk Aplikasi Sel Surya", indeks: "Sinta 3" }],
    pubLast: "May 2024",
    pubDeadline: "May 2027",
  },
];

export const MHS: Mhs[] = [
  {
    npm: "2021012001", nm: "Rizky Pratama", ini: "RP",
    fak: "Teknik", prodi: "Teknik Informatika", jenjang: "S1", jalurMasuk: "PDB Murni",
    ang: "2021", sem: 6, ipk: 3.72, sks: 96, status: "Normal",
    email: "rizky.p@student.unila.ac.id", pa: "Dr. Ahmad Fauzi",
    ta: "Sistem Rekomendasi berbasis ML", n1: "A", n2: "A", n3: "B+",
    rw: [{ c: "g", t: "IPK naik ke 3.72", m: "Sem 6" }],
  },
  {
    npm: "2020033044", nm: "Anisa Putri", ini: "AP",
    fak: "Ekonomi & Bisnis", prodi: "Manajemen", jenjang: "S1", jalurMasuk: "PDB Murni",
    ang: "2020", sem: 8, ipk: 1.85, sks: 96, status: "SP2",
    email: "anisa.p@student.unila.ac.id", pa: "Dewi Kurniawati",
    ta: "", n1: "D", n2: "C", n3: "C",
    rw: [
      { c: "r", t: "IPK di bawah 2.0 — Status SP2", m: "Sem 8" },
      { c: "w", t: "Belum daftar TA", m: "Sem 8" },
    ],
  },
  {
    npm: "2022011089", nm: "Fajar Nugroho", ini: "FN",
    fak: "FMIPA", prodi: "Matematika", jenjang: "S1", jalurMasuk: "PDB Murni",
    ang: "2022", sem: 4, ipk: 2.95, sks: 64, status: "Normal",
    email: "fajar.n@student.unila.ac.id", pa: "-",
    ta: "", n1: "B+", n2: "B", n3: "B",
    rw: [{ c: "g", t: "IPK stabil di 2.95", m: "Sem 4" }],
  },
  {
    npm: "2020055012", nm: "Lestari Dewi", ini: "LD",
    fak: "Hukum", prodi: "Ilmu Hukum", jenjang: "S1", jalurMasuk: "PDB Murni",
    ang: "2020", sem: 8, ipk: 3.41, sks: 108, status: "Normal",
    email: "lestari.d@student.unila.ac.id", pa: "Prof. Hendra Wijaya",
    ta: "Hukum Tata Negara & Otonomi Daerah", n1: "A", n2: "A-", n3: "B+",
    rw: [{ c: "g", t: "IPK naik ke 3.41", m: "Sem 8" }],
  },
  {
    npm: "2021044077", nm: "Bagas Surya", ini: "BS",
    fak: "Teknik", prodi: "Teknik Sipil", jenjang: "S1", jalurMasuk: "PDB Murni",
    ang: "2021", sem: 5, ipk: 1.70, sks: 48, status: "SP1",
    email: "bagas.s@student.unila.ac.id", pa: "Agus Prasetyo",
    ta: "", n1: "D", n2: "D+", n3: "C",
    rw: [
      { c: "r", t: "IPK di bawah 2.0 — Status SP1", m: "Sem 5" },
      { c: "w", t: "SKS tertinggal dari angkatan", m: "Sem 5" },
    ],
  },
  {
    npm: "2020022019", nm: "Maya Sari", ini: "MS",
    fak: "FISIP", prodi: "Ilmu Komunikasi", jenjang: "S1", jalurMasuk: "PDB Murni",
    ang: "2020", sem: 8, ipk: 2.10, sks: 100, status: "Perhatian",
    email: "maya.s@student.unila.ac.id", pa: "Rina Susanti",
    ta: "", n1: "C+", n2: "B-", n3: "C",
    rw: [
      { c: "w", t: "IPK di bawah 2.5", m: "Sem 8" },
      { c: "w", t: "Belum daftar TA", m: "Sem 8" },
    ],
  },
  {
    npm: "2023001055", nm: "Dimas Aditya", ini: "DA",
    fak: "Kedokteran", prodi: "Kedokteran", jenjang: "Profesi", jalurMasuk: "PDB Murni",
    ang: "2023", sem: 2, ipk: 3.55, sks: 24, status: "Normal",
    email: "dimas.a@student.unila.ac.id", pa: "-",
    ta: "", n1: "A", n2: "A-", n3: "A",
    rw: [{ c: "g", t: "IPK 3.55 di semester awal", m: "Sem 2" }],
  },
  {
    npm: "2022060011", nm: "Salsabila Nurdiana", ini: "SN",
    fak: "Ekonomi & Bisnis", prodi: "Perpajakan", jenjang: "D3", jalurMasuk: "PDB Murni",
    ang: "2022", sem: 3, ipk: 3.40, sks: 54, status: "Normal",
    email: "salsa.n@student.unila.ac.id", pa: "Dewi Kurniawati",
    ta: "", n1: "A", n2: "B+", n3: "A-",
    rw: [{ c: "g", t: "IPK 3.40 semester 3", m: "Sem 3" }],
  },
  {
    npm: "2021033090", nm: "Taufik Hidayatulloh", ini: "TH",
    fak: "Teknik", prodi: "Teknik Informatika", jenjang: "S1", jalurMasuk: "Pindahan",
    ang: "2021", sem: 5, ipk: 3.10, sks: 80, status: "Normal",
    email: "taufik.h@student.unila.ac.id", pa: "Budi Santoso",
    ta: "", n1: "B+", n2: "A-", n3: "B",
    rw: [{ c: "g", t: "Pindahan dari Unsri, sem 5", m: "2023" }],
  },
  {
    npm: "2019077034", nm: "Wulandari Putri", ini: "WP",
    fak: "Hukum", prodi: "Ilmu Hukum", jenjang: "S1", jalurMasuk: "Lintas Jalur",
    ang: "2019", sem: 10, ipk: 2.88, sks: 130, status: "Perhatian",
    email: "wulan.p@student.unila.ac.id", pa: "Prof. Hendra Wijaya",
    ta: "Hak Kekayaan Intelektual", n1: "B", n2: "B-", n3: "C+",
    rw: [{ c: "w", t: "Melampaui batas 8 semester", m: "Sem 10" }],
  },
  {
    npm: "2022044003", nm: "Hendra Kurniawan", ini: "HK",
    fak: "Teknik", prodi: "Teknik Komputer", jenjang: "D3", jalurMasuk: "Alih Jenjang",
    ang: "2022", sem: 2, ipk: 3.20, sks: 36, status: "Normal",
    email: "hendra.k@student.unila.ac.id", pa: "Agus Prasetyo",
    ta: "", n1: "A-", n2: "B+", n3: "B+",
    rw: [{ c: "g", t: "Alih jenjang dari SMK TKJ", m: "2022" }],
  },
  {
    npm: "2021090021", nm: "Eki Prastowo", ini: "EP",
    fak: "FMIPA", prodi: "Matematika", jenjang: "S1", jalurMasuk: "RPL",
    ang: "2021", sem: 4, ipk: 3.05, sks: 62, status: "Normal",
    email: "eki.p@student.unila.ac.id", pa: "Dr. Ahmad Fauzi",
    ta: "", n1: "B+", n2: "B", n3: "B+",
    rw: [{ c: "g", t: "Mahasiswa RPL — pengalaman industri 3 tahun", m: "2021" }],
  },
];

export const BIMB: Bimb[] = [
  {
    nm: "Agus Prasetyo, M.T.", fak: "Teknik", prodi: "Teknik Sipil", jenjang: "S1",
    total: 19, aktif: 15, selesai: 4,
    mahasiswa: [
      { npm: "2021044001", nm: "Bagas Wirawan",         prodi: "Teknik Sipil",     sem: 5,  status: "Aktif" },
      { npm: "2022044002", nm: "Hendri Kurnia",    prodi: "Teknik Sipil",     sem: 2,  status: "Aktif" },
      { npm: "2021044003", nm: "Rizal Firmansyah",    prodi: "Teknik Sipil",     sem: 6,  status: "Aktif" },
      { npm: "2020044004", nm: "Dian Permata",        prodi: "Teknik Sipil",     sem: 8,  status: "Aktif" },
      { npm: "2021044005", nm: "Andika Putra",        prodi: "Teknik Sipil",     sem: 5,  status: "Aktif" },
      { npm: "2020044006", nm: "Yusuf Ramadhan",      prodi: "Teknik Sipil",     sem: 7,  status: "Aktif" },
      { npm: "2022044007", nm: "Fitri Handayani",     prodi: "Teknik Sipil",     sem: 3,  status: "Aktif" },
      { npm: "2021044008", nm: "Eko Prasetyo",        prodi: "Teknik Sipil",     sem: 6,  status: "Aktif" },
      { npm: "2020044009", nm: "Larasati Dewi",       prodi: "Teknik Sipil",     sem: 8,  status: "Aktif" },
      { npm: "2023044010", nm: "Surya Dinata",        prodi: "Teknik Sipil",     sem: 1,  status: "Aktif" },
      { npm: "2020044011", nm: "Nanda Wijaya",        prodi: "Teknik Sipil",     sem: 9,  status: "Aktif" },
      { npm: "2021044012", nm: "Putri Rahayu",        prodi: "Teknik Sipil",     sem: 4,  status: "Aktif" },
      { npm: "2020044013", nm: "Bima Saputra",        prodi: "Teknik Sipil",     sem: 8,  status: "Aktif" },
      { npm: "2021044014", nm: "Sari Kusuma",         prodi: "Teknik Sipil",     sem: 5,  status: "Aktif" },
      { npm: "2019044015", nm: "Wahyu Nugroho",       prodi: "Teknik Sipil",     sem: 11, status: "Aktif" },
      { npm: "2018044016", nm: "Indah Lestari",       prodi: "Teknik Sipil",     sem: 13, status: "Selesai" },
      { npm: "2019044017", nm: "Febrian Santoso",     prodi: "Teknik Sipil",     sem: 10, status: "Selesai" },
      { npm: "2019044018", nm: "Melati Putri",        prodi: "Teknik Sipil",     sem: 9,  status: "Selesai" },
      { npm: "2018044019", nm: "Galih Prakoso",       prodi: "Teknik Sipil",     sem: 12, status: "Selesai" },
    ],
  },
  {
    nm: "Dr. Ahmad Fauzi, M.Si.", fak: "FMIPA", prodi: "Magister Matematika", jenjang: "S2",
    total: 17, aktif: 12, selesai: 5,
    mahasiswa: [
      { npm: "2021012001", nm: "Rizky Pratama",       prodi: "Matematika",       sem: 6,  status: "Aktif" },
      { npm: "2021090021", nm: "Eki Prastowo",        prodi: "Matematika",       sem: 4,  status: "Aktif" },
      { npm: "2022012003", nm: "Anisa Rahma",         prodi: "Matematika",       sem: 3,  status: "Aktif" },
      { npm: "2021012004", nm: "Dimas Kurniawan",     prodi: "Matematika",       sem: 5,  status: "Aktif" },
      { npm: "2022012005", nm: "Hana Safitri",        prodi: "Matematika",       sem: 4,  status: "Aktif" },
      { npm: "2020012006", nm: "Ilham Firdaus",       prodi: "Matematika",       sem: 7,  status: "Aktif" },
      { npm: "2022012007", nm: "Jihan Aulia",         prodi: "Matematika",       sem: 3,  status: "Aktif" },
      { npm: "2021012008", nm: "Kevin Santana",       prodi: "Matematika",       sem: 6,  status: "Aktif" },
      { npm: "2020012009", nm: "Lina Marlina",        prodi: "Matematika",       sem: 8,  status: "Aktif" },
      { npm: "2022012010", nm: "Maulana Yusuf",       prodi: "Matematika",       sem: 2,  status: "Aktif" },
      { npm: "2021012011", nm: "Nadia Permata",       prodi: "Matematika",       sem: 5,  status: "Aktif" },
      { npm: "2020012012", nm: "Oscar Hidayat",       prodi: "Matematika",       sem: 7,  status: "Aktif" },
      { npm: "2019012013", nm: "Prita Sari",          prodi: "Matematika",       sem: 9,  status: "Selesai" },
      { npm: "2019012014", nm: "Qori Ramadhan",       prodi: "Matematika",       sem: 10, status: "Selesai" },
      { npm: "2018012015", nm: "Reza Mahendra",       prodi: "Matematika",       sem: 11, status: "Selesai" },
      { npm: "2018012016", nm: "Sinta Dewi",          prodi: "Matematika",       sem: 12, status: "Selesai" },
      { npm: "2017012017", nm: "Teguh Prakoso",       prodi: "Matematika",       sem: 14, status: "Selesai" },
    ],
  },
  {
    nm: "Dr. Iwan Saputra, M.Sc.", fak: "Teknik", prodi: "Magister Teknik Sipil", jenjang: "S2",
    total: 16, aktif: 14, selesai: 2,
    mahasiswa: [
      { npm: "2021033001", nm: "Taufiq Hermawan", prodi: "Teknik Sipil", sem: 5,  status: "Aktif" },
      { npm: "2022033002", nm: "Umar Bakri",          prodi: "Teknik Sipil", sem: 3,  status: "Aktif" },
      { npm: "2021033003", nm: "Vina Cahyani",        prodi: "Teknik Sipil", sem: 6,  status: "Aktif" },
      { npm: "2022033004", nm: "Wahid Nurhadi",       prodi: "Teknik Sipil", sem: 4,  status: "Aktif" },
      { npm: "2021033005", nm: "Xena Putri",          prodi: "Teknik Sipil", sem: 5,  status: "Aktif" },
      { npm: "2020033006", nm: "Yoga Pratama",        prodi: "Teknik Sipil", sem: 7,  status: "Aktif" },
      { npm: "2022033007", nm: "Zahra Alifa",         prodi: "Teknik Sipil", sem: 2,  status: "Aktif" },
      { npm: "2021033008", nm: "Aldi Firmansyah",     prodi: "Teknik Sipil", sem: 6,  status: "Aktif" },
      { npm: "2020033009", nm: "Bella Savitri",       prodi: "Teknik Sipil", sem: 8,  status: "Aktif" },
      { npm: "2022033010", nm: "Citra Anggraini",     prodi: "Teknik Sipil", sem: 3,  status: "Aktif" },
      { npm: "2021033011", nm: "Daffa Ramadhan",      prodi: "Teknik Sipil", sem: 5,  status: "Aktif" },
      { npm: "2020033012", nm: "Elsa Maharani",       prodi: "Teknik Sipil", sem: 7,  status: "Aktif" },
      { npm: "2021033013", nm: "Fauzan Akbar",        prodi: "Teknik Sipil", sem: 6,  status: "Aktif" },
      { npm: "2020033014", nm: "Gracia Pertiwi",      prodi: "Teknik Sipil", sem: 8,  status: "Aktif" },
      { npm: "2019033015", nm: "Hafiz Maulana",       prodi: "Teknik Sipil", sem: 10, status: "Selesai" },
      { npm: "2018033016", nm: "Indira Kusuma",       prodi: "Teknik Sipil", sem: 12, status: "Selesai" },
    ],
  },
  {
    nm: "Prof. Hendra Wijaya, Ph.D.", fak: "Hukum", prodi: "Ilmu Hukum", jenjang: "S3",
    total: 11, aktif: 8, selesai: 3,
    mahasiswa: [
      { npm: "2020055012", nm: "Lestari Dewi",        prodi: "Ilmu Hukum",       sem: 8,  status: "Aktif" },
      { npm: "2019077034", nm: "Wulandari Putri",     prodi: "Ilmu Hukum",       sem: 10, status: "Aktif" },
      { npm: "2021055003", nm: "Arif Budiman",        prodi: "Ilmu Hukum",       sem: 5,  status: "Aktif" },
      { npm: "2022055004", nm: "Bintang Cahaya",      prodi: "Ilmu Hukum",       sem: 2,  status: "Aktif" },
      { npm: "2021055005", nm: "Cahya Ramadhani",     prodi: "Ilmu Hukum",       sem: 6,  status: "Aktif" },
      { npm: "2020055006", nm: "Dinda Kirana",        prodi: "Ilmu Hukum",       sem: 7,  status: "Aktif" },
      { npm: "2022055007", nm: "Evan Saputra",        prodi: "Ilmu Hukum",       sem: 3,  status: "Aktif" },
      { npm: "2021055008", nm: "Farah Adinda",        prodi: "Ilmu Hukum",       sem: 4,  status: "Aktif" },
      { npm: "2019055009", nm: "Gani Prawira",        prodi: "Ilmu Hukum",       sem: 9,  status: "Selesai" },
      { npm: "2018055010", nm: "Hesti Wulandari",     prodi: "Ilmu Hukum",       sem: 10, status: "Selesai" },
      { npm: "2019055011", nm: "Ivan Perdana",        prodi: "Ilmu Hukum",       sem: 11, status: "Selesai" },
    ],
  },
  {
    nm: "Rina Susanti, M.Hum.", fak: "FISIP", prodi: "Ilmu Komunikasi", jenjang: "S1",
    total: 9, aktif: 7, selesai: 2,
    mahasiswa: [
      { npm: "2020022019", nm: "Maya Sari",           prodi: "Ilmu Komunikasi",  sem: 8,  status: "Aktif" },
      { npm: "2021022002", nm: "Naufal Hakim",        prodi: "Ilmu Komunikasi",        sem: 5,  status: "Aktif" },
      { npm: "2022022003", nm: "Okta Virgiani",       prodi: "Ilmu Komunikasi",        sem: 3,  status: "Aktif" },
      { npm: "2021022004", nm: "Pandu Wijaya",        prodi: "Ilmu Komunikasi",  sem: 6,  status: "Aktif" },
      { npm: "2020022005", nm: "Qorina Fadila",       prodi: "Ilmu Komunikasi",        sem: 7,  status: "Aktif" },
      { npm: "2022022006", nm: "Ridwan Anwar",        prodi: "Ilmu Komunikasi",  sem: 2,  status: "Aktif" },
      { npm: "2021022007", nm: "Salma Nabila",        prodi: "Ilmu Komunikasi",        sem: 4,  status: "Aktif" },
      { npm: "2019022008", nm: "Tina Marlena",        prodi: "Ilmu Komunikasi",        sem: 9,  status: "Selesai" },
      { npm: "2018022009", nm: "Ucok Situmorang",     prodi: "Ilmu Komunikasi",  sem: 11, status: "Selesai" },
    ],
  },
  {
    nm: "Budi Santoso, M.Eng.", fak: "Teknik", prodi: "Teknik Mesin", jenjang: "S1",
    total: 8, aktif: 6, selesai: 2,
    mahasiswa: [
      { npm: "2021033090", nm: "Taufik Hidayatulloh", prodi: "Teknik Mesin",     sem: 5,  status: "Aktif" },
      { npm: "2022033091", nm: "Vino Aldiano",        prodi: "Teknik Mesin",     sem: 3,  status: "Aktif" },
      { npm: "2021033092", nm: "Widi Astuti",         prodi: "Teknik Mesin",     sem: 6,  status: "Aktif" },
      { npm: "2020033093", nm: "Xander Putra",        prodi: "Teknik Mesin",     sem: 7,  status: "Aktif" },
      { npm: "2022033094", nm: "Yanti Rahayu",        prodi: "Teknik Mesin",     sem: 2,  status: "Aktif" },
      { npm: "2021033095", nm: "Zaki Maulana",        prodi: "Teknik Mesin",     sem: 5,  status: "Aktif" },
      { npm: "2019033096", nm: "Ami Kusuma",          prodi: "Teknik Mesin",     sem: 9,  status: "Selesai" },
      { npm: "2018033097", nm: "Beni Hasan",          prodi: "Teknik Mesin",     sem: 11, status: "Selesai" },
    ],
  },
  {
    nm: "Dewi Kurniawati, M.Sc.", fak: "Ekonomi & Bisnis", prodi: "D3 Akuntansi", jenjang: "D3",
    total: 6, aktif: 5, selesai: 1,
    mahasiswa: [
      { npm: "2020033044", nm: "Anisa Putri",         prodi: "D3 Akuntansi",        sem: 8,  status: "Aktif" },
      { npm: "2022060011", nm: "Salsabila Nurdiana",  prodi: "D3 Akuntansi",        sem: 3,  status: "Aktif" },
      { npm: "2021060002", nm: "Bayu Aditya",         prodi: "D3 Akuntansi",        sem: 5,  status: "Aktif" },
      { npm: "2022060003", nm: "Cika Amalia",         prodi: "D3 Akuntansi",        sem: 4,  status: "Aktif" },
      { npm: "2021060004", nm: "Dian Novita",         prodi: "D3 Akuntansi",        sem: 6,  status: "Aktif" },
      { npm: "2019060005", nm: "Eka Sulistyo",        prodi: "D3 Akuntansi",        sem: 10, status: "Selesai" },
    ],
  },
  {
    nm: "Nining Hartati, M.Pd.", fak: "FKIP", prodi: "Magister Pendidikan Matematika", jenjang: "S2",
    total: 4, aktif: 4, selesai: 0,
    mahasiswa: [
      { npm: "2022070001", nm: "Farhan Maulana",      prodi: "Pendidikan Matematika", sem: 3, status: "Aktif" },
      { npm: "2021070002", nm: "Gita Puspita",        prodi: "Pendidikan Matematika", sem: 5, status: "Aktif" },
      { npm: "2022070003", nm: "Hafidz Arya",         prodi: "Pendidikan Matematika", sem: 2, status: "Aktif" },
      { npm: "2021070004", nm: "Ika Pratiwi",         prodi: "Pendidikan Matematika", sem: 4, status: "Aktif" },
    ],
  },
  {
    nm: "Siti Rahayu, S.Pd.", fak: "FKIP", prodi: "Pendidikan Biologi", jenjang: "S1",
    total: 2, aktif: 2, selesai: 0,
    mahasiswa: [
      { npm: "2022080001", nm: "Joko Susilo",         prodi: "Pendidikan Biologi", sem: 3, status: "Aktif" },
      { npm: "2022080002", nm: "Karina Dewi",         prodi: "Pendidikan Biologi", sem: 2, status: "Aktif" },
    ],
  },
];
export const INITIAL_NOTIFS: Notif[] = [
  {
    id: 1, ic: "🚨", t: "d",
    title: "SP2: 2 Mahasiswa Risiko DO",
    body: "Anisa Putri & Yusuf Ramadhan (Sem 8) IPK < 2.0.",
    time: "5 menit lalu", unread: true, cat: "all",
  },
  {
    id: 2, ic: "⚠️", t: "w",
    title: "Alert Jabfung: Agus Prasetyo",
    body: "Batas 2 tahun jabfung tersisa ±2 bulan.",
    time: "30 menit lalu", unread: true, cat: "alert",
  },
  {
    id: 3, ic: "🎓", t: "d",
    title: "EWS Publikasi Profesor: 5 Kritis",
    body: "Prof. Sari Kusuma & Prof. Diana Lestari melewati batas 3 tahun.",
    time: "1 jam lalu", unread: true, cat: "alert",
  },
  {
    id: 4, ic: "👤", t: "w",
    title: "47 Anomali Status Mahasiswa",
    body: "Mahasiswa tercatat aktif namun tidak membayar UKT 3+ semester.",
    time: "2 jam lalu", unread: true, cat: "alert",
  },
  {
    id: 5, ic: "✅", t: "g",
    title: "KTW Naik ke 78%",
    body: "Mendekati target nasional 80%. Kenaikan +2% dari tahun lalu.",
    time: "Kemarin", unread: true, cat: "all",
  },
  {
    id: 6, ic: "🔄", t: "b",
    title: "Sinkronisasi Selesai",
    body: "SIAKAD, Sister, PDDIKTI diperbarui sukses.",
    time: "Kemarin", unread: false, cat: "alert",
  },
];