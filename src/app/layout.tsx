import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIPEKA UNILA",
  description: "Sistem Informasi Pendukung Evaluasi Kinerja Akademik Universitas Lampung",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
