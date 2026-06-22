import {
  FiUsers,
  FiBarChart2,
  FiActivity,
  FiAlertCircle,
  FiAlertTriangle,
  FiAward,
  FiBook,
} from "react-icons/fi";
import { MdDashboard, MdSchool } from "react-icons/md";
import type { ReactNode } from "react";

export interface SpkMenuItem {
  title: string;
  icon: ReactNode;
  href: string;
  roles: string[];
  group?: string;
  badge?: number;
}

export const spkMenuConfig: SpkMenuItem[] = [
  {
    title: "Dashboard",
    icon: <MdDashboard className="w-[15px] h-[15px]" />,
    href: "sec-dashboard",
    roles: ["pimpinan"],
    group: "MENU UTAMA",
  },
  {
    title: "Data Dosen",
    icon: <FiUsers className="w-[14px] h-[14px]" />,
    href: "sec-dosen",
    roles: ["pimpinan"],
    group: "MONITORING DOSEN",
  },
  {
    title: "Analisis Kepegawaian",
    icon: <FiBarChart2 className="w-[14px] h-[14px]" />,
    href: "sec-analisis",
    roles: ["pimpinan"],
  },
  {
    title: "Aktivitas Dosen",
    icon: <FiActivity className="w-[14px] h-[14px]" />,
    href: "sec-aktivitas",
    roles: ["pimpinan"],
  },
  {
    title: "Beban Bimbingan",
    icon: <FiUsers className="w-[14px] h-[14px]" />,
    href: "sec-beban",
    roles: ["pimpinan"],
  },
  {
    title: "EWS Publikasi",
    icon: <FiBook className="w-[14px] h-[14px]" />,
    href: "sec-publikasi",
    roles: ["pimpinan"],
  },
  {
    title: "Data Mahasiswa",
    icon: <MdSchool className="w-[14px] h-[14px]" />,
    href: "sec-mahasiswa",
    roles: ["pimpinan"],
    group: "MONITORING MAHASISWA",
  },
  {
    title: "Anomali Status UKT",
    icon: <FiAlertCircle className="w-[14px] h-[14px]" />,
    href: "sec-anomali",
    roles: ["pimpinan"],
    badge: 47,
  },
  {
    title: "Early Warning DO",
    icon: <FiAlertTriangle className="w-[14px] h-[14px]" />,
    href: "sec-ews",
    roles: ["pimpinan"],
    badge: 12,
  },
  {
    title: "Kelulusan Tepat Waktu",
    icon: <FiAward className="w-[14px] h-[14px]" />,
    href: "sec-kelulusan",
    roles: ["pimpinan"],
  },
];
