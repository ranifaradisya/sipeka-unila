"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import Sidebar from "./_components/shared/Sidebar";
import Topbar from "./_components/shared/Topbar";
import NotifPanel from "./_components/shared/NotifPanel";
import ProfileModal from "./_components/shared/DetailModal";
import DosenProfileModal from "./_components/shared/DosenProfileModal";
import ExportModal from "./_components/shared/ExportModal";
import Toast from "./_components/shared/Toast";
import Dashboard from "./_components/Dashboard";
import DosenView from "./_components/dosen/DataDosen";
import Analisis from "./_components/dosen/AnalisisKepegawaian";
import Aktivitas from "./_components/dosen/AktivitasDosen";
import Bimbingan from "./_components/dosen/Bimbingan";
import Publikasi from "./_components/dosen/EwsPublikasi";
import Mahasiswa from "./_components/mahasiswa/DataMahasiswa";
import AnomaliUkt from "./_components/mahasiswa/StatusUkt";
import EwsDO from "./_components/mahasiswa/EwsDO";
import Kelulusan from "./_components/mahasiswa/Kelulusan";
import { spkMenuConfig } from "./config/menuConfig";
import { DOSEN, MHS, BIMB, INITIAL_NOTIFS, KTW_ROWS } from "./_components/data";
import type { Notif, ToastType, ToastItem, Dosen, Mhs, Bimb, RiwayatItem } from "./_components/data";

export type { Dosen, Mhs, Bimb, RiwayatItem, ToastType, ToastItem };


// ─── export helpers (inline) ─────────────────────────────────

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Gagal load: ${src}`));
    document.head.appendChild(s);
  });
}

function sanitizeFilename(s: string) { return s.replace(/[^a-zA-Z0-9_\-]/g, "_"); }

// Buang emoji di depan judul chart (mis. "📊 Distribusi ...") biar rapi waktu
// dipakai sebagai caption di PDF/Excel — font default jsPDF/ExcelJS tidak bisa render emoji.
function stripLeadingEmoji(s: string) {
  return s.replace(/^[\p{Extended_Pictographic}\u200d\uFE0F\s]+/gu, "").trim() || s;
}

type ChartCapture = { id: string; title: string; dataUrl: string; ratio: number };

// Ambil snapshot semua chart Chart.js yang sedang ter-render di halaman (section yang
// lagi aktif) sebagai gambar base64. Dipakai untuk menyisipkan grafik ke Excel & PDF.
// Aman dipanggil di section manapun: kalau tidak ada canvas/chart, langsung balikin [].
function captureChartImages(): ChartCapture[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const C = (window as any).Chart;
  if (!C) {
    console.warn("[SIPEKA export] window.Chart belum termuat — grafik tidak bisa disertakan ke file ekspor.");
    return [];
  }
  const canvases = Array.from(document.querySelectorAll<HTMLCanvasElement>("canvas[id]"));
  if (canvases.length === 0) {
    console.warn("[SIPEKA export] Tidak ditemukan elemen <canvas id=\"...\"> di halaman ini saat ekspor dijalankan.");
    return [];
  }
  const out: ChartCapture[] = [];
  for (const el of canvases) {
    let chart;
    try { chart = C.getChart(el); } catch (e) { chart = null; console.warn(`[SIPEKA export] Chart.getChart gagal untuk #${el.id}:`, e); }
    if (!chart) {
      console.warn(`[SIPEKA export] Canvas #${el.id} ditemukan, tapi tidak ada instance Chart.js yang menempel padanya.`);
      continue;
    }
    try {
      const dataUrl = chart.toBase64Image("image/png", 1);
      const title = stripLeadingEmoji(el.dataset.chartTitle || el.id);
      const ratio = el.width && el.height ? el.width / el.height : 16 / 9;
      out.push({ id: el.id, title, dataUrl, ratio });
    } catch (e) {
      console.warn(`[SIPEKA export] Gagal meng-capture canvas #${el.id} jadi gambar:`, e);
    }
  }
  console.info(`[SIPEKA export] ${out.length} dari ${canvases.length} canvas berhasil di-capture sebagai grafik.`);
  return out;
}

function resolveExportData(title: string, year: string, sem: string, filteredData?: Record<string, unknown>[]): { headers: string[]; rows: (string | number)[][] } {
  const t = title.toLowerCase();
  const label = `${sem} ${year}`;

  // Kalau ada filteredData dari komponen, langsung pakai — ini data sesuai filter aktif
  if (filteredData && filteredData.length > 0) {
    const KEY_LABEL: Record<string, string> = {
      npm: "NPM", nim: "NPM", nama: "Nama", prodi: "Program Studi",
      semester: "Semester", sem: "Semester", status: "Status",
      fakultas: "Fakultas", fak: "Fakultas", jenjang: "Jenjang",
      total: "Total", aktif: "Aktif", selesai: "Selesai",
    };
    const headers = Object.keys(filteredData[0]).map(k =>
      KEY_LABEL[k] ?? (k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1'))
    );
    const rows = filteredData.map(row => Object.values(row) as (string | number)[]);
    return { headers, rows };
  }
  if (t.includes("kelulusan") || t.includes("ktw"))
    return {
      headers: ["Program Studi", "Fakultas", "Jenjang", "Total Lulus", "Tepat Waktu", "Terlambat", "% KTW"],
      rows: KTW_ROWS.map(r => [r.prodi, r.fak, r.jenjang, r.total, r.tepatWaktu, r.terlambat, r.pct]),
    };
  if (t.includes("dosen") || t.includes("analisis") || t.includes("aktivitas"))
    return {
      headers: ["NIP", "Nama", "Fakultas", "Prodi", "Pendidikan", "Jabfung", "Gol", "Masa Kerja", "SKS", "Publikasi", "Bimbingan", "Status"],
      rows: DOSEN.map(d => [d.nip, d.nm, d.fak, d.prodi, d.pend, d.jabfung, d.gol, d.masa, d.sks, d.pub, d.bimb, d.status]),
    };
  if (t.includes("publikasi") || t.includes("ews"))
    return {
      headers: ["Nama", "Prodi", "Jabfung", "Pub. Terakhir", "Deadline", "Status"],
      rows: DOSEN.map(d => [d.nm, d.prodi, d.jabfung, d.pubLast, d.pubDeadline, d.status]),
    };
  if (t.includes("bimbingan") || t.includes("beban"))
    return {
      headers: ["Nama Dosen", "Fakultas", "Prodi", "Jenjang", "Total", "Aktif", "Selesai"],
      rows: BIMB.map(b => [b.nm, b.fak, b.prodi, b.jenjang, b.total, b.aktif, b.selesai]),
    };
  if (t.includes("mahasiswa") || t.includes("ukt") || t.includes("anomali") || t.includes("do"))
    return {
      headers: ["NPM", "Nama", "Fakultas", "Prodi", "Jenjang", "Angkatan", "Semester", "IPK", "SKS", "Status"],
      rows: MHS.map(m => [m.npm, m.nm, m.fak, m.prodi, m.jenjang, m.ang, m.sem, m.ipk, m.sks, m.status]),
    };
  return {
    headers: ["Kategori", "Data", "Nilai", "Keterangan"],
    rows: [
      ["Mahasiswa", "Total Aktif", MHS.length, label],
      ["Mahasiswa", "Risiko DO (IPK<2)", MHS.filter(m => m.ipk < 2).length, label],
      ["Dosen", "Total Dosen", DOSEN.length, label],
      ["Dosen", "Tanpa Jabfung", DOSEN.filter(d => d.jabfung === "Belum Ada").length, label],
      ["KTW", "Rata-rata", (KTW_ROWS.reduce((s, r) => s + r.pctNum, 0) / KTW_ROWS.length).toFixed(1) + "%", label],
    ],
  };
}

async function doExport(format: "excel" | "pdf" | "csv", title: string, year: string, sem: string, filteredData?: Record<string, unknown>[]) {
  const fn = sanitizeFilename;
  const base = `${fn(title)}_${fn(sem)}_${fn(year)}`;
  const { headers, rows } = resolveExportData(title, year, sem, filteredData);

  if (format === "csv") {
    const esc = (v: string | number) => { const s = String(v); return (s.includes(",") || s.includes('"') || s.includes("\n")) ? `"${s.replace(/"/g, '\"\"')}"` : s; };
    const csv = "\uFEFF" + [headers, ...rows].map(r => r.map(esc).join(",")).join("\r\n");
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), base + ".csv");
    return;
  }

  if (format === "excel") {
    // Pakai ExcelJS (bukan SheetJS) karena SheetJS Community Edition tidak bisa
    // embed gambar ke worksheet — fitur itu cuma ada di SheetJS Pro.
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ExcelJS = (window as any).ExcelJS;
    const wb = new ExcelJS.Workbook();
    wb.creator = "SIPEKA UNILA";
    wb.created = new Date();

    // ── sheet data utama ──
    const ws = wb.addWorksheet(title.slice(0, 31) || "Data");
    ws.addRow(headers);
    const headRow = ws.getRow(1);
    headRow.font = { bold: true, color: { argb: "FF1A56DB" } };
    headRow.alignment = { vertical: "middle", horizontal: "center" };
    headRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEEF5FC" } };
    headRow.eachCell((c: any) => { c.border = { bottom: { style: "thin", color: { argb: "FFCBD5E1" } } }; });
    rows.forEach(r => ws.addRow(r));
    headers.forEach((h, i) => {
      const longest = Math.max(h.length, ...rows.map(r => String(r[i] ?? "").length));
      ws.getColumn(i + 1).width = Math.min(Math.max(longest + 2, 10), 40);
    });
    if (headers.length > 0 && rows.length > 0) {
      ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: headers.length } };
    }
    ws.views = [{ state: "frozen", ySplit: 1 }];

    // ── sheet info ──
    const infoWs = wb.addWorksheet("Info");
    infoWs.addRows([
      ["Laporan", title],
      ["Tahun Ajaran", year],
      ["Semester", sem],
      ["Diekspor", new Date().toLocaleString("id-ID")],
      ["Sistem", "SIPEKA UNILA"],
    ]);
    infoWs.getColumn(1).font = { bold: true };
    infoWs.getColumn(1).width = 16;
    infoWs.getColumn(2).width = 42;

    // ── sheet grafik (kalau ada chart yang sedang tampil di halaman) ──
    // Skip untuk laporan detail mahasiswa bimbingan (ada kolom "npm") — chart tidak relevan.
    const isDetailMahasiswaXls = filteredData && filteredData.length > 0 && "npm" in filteredData[0];
    const charts = isDetailMahasiswaXls ? [] : captureChartImages();
    if (charts.length > 0) {
      const chartWs = wb.addWorksheet("Grafik");
      chartWs.getColumn(1).width = 90;
      let rowCursor = 1;
      const PX_PER_ROW = 20; // tinggi default 1 baris Excel ≈ 20px, dipakai buat estimasi spasi
      for (const c of charts) {
        const titleCell = chartWs.getCell(`A${rowCursor}`);
        titleCell.value = c.title;
        titleCell.font = { bold: true, size: 12, color: { argb: "FF1E3A8A" } };
        rowCursor += 1;

        const base64 = c.dataUrl.split(",")[1] ?? "";
        if (base64) {
          const imageId = wb.addImage({ base64, extension: "png" });
          const imgW = 620;
          const imgH = Math.round(imgW / c.ratio);
          chartWs.addImage(imageId, {
            tl: { col: 0, row: rowCursor - 1 + 0.15 },
            ext: { width: imgW, height: imgH },
          });
          rowCursor += Math.ceil(imgH / PX_PER_ROW) + 2;
        }
      }
    }

    const buffer = await wb.xlsx.writeBuffer();
    downloadBlob(
      new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      base + ".xlsx"
    );
    return;
  }

  if (format === "pdf") {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { jsPDF } = (window as any).jspdf;

    // Laporan Dashboard dapet layout khusus: portrait, per-section, grafik besar —
    // bukan tabel data biasa. Report lain (Data Dosen, Kelulusan, dst) tetap landscape+tabel.
    const isDashboardReport = title.trim().toLowerCase() === "dashboard";
    const orientation: "portrait" | "landscape" = isDashboardReport ? "portrait" : "landscape";
    const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
    const W = orientation === "landscape" ? 297 : 210;
    const PL = 20; // margin kiri
    const PR = 20; // margin kanan
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageH = (doc as any).internal.pageSize.getHeight();

    // ── KOP SURAT ──
    // load logo dari public folder (taruh file di /public/logo-unila.png)
    const toBase64FromUrl = (url: string): Promise<string> =>
      fetch(url)
        .then(r => { if (!r.ok) throw new Error("fetch fail"); return r.blob(); })
        .then(blob => new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as string);
          reader.onerror = rej;
          reader.readAsDataURL(blob);
        }));

    let logoB64 = "";
    try {
      logoB64 = await toBase64FromUrl("/assets/images/logo-unila.png");
    } catch (_) {
      // fallback: tidak ada logo, kop tetap muncul
    }

    if (logoB64) doc.addImage(logoB64, "PNG", PL, 7, 22, 22);

    // teks kop tengah
    const cx = W / 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8); doc.setTextColor(0);
    doc.text("KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI", cx, 12, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("UNIVERSITAS LAMPUNG", cx, 20, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Jl. Prof. Dr. Soemantri Brojonegoro No.1 Bandar Lampung", cx, 26, { align: "center" });
    doc.text("Telp: 702767, 702971, 703475, 702673, 701252, 701609", cx, 30.5, { align: "center" });

    // garis tebal bawah kop
    doc.setDrawColor(0); doc.setLineWidth(1.2);
    doc.line(PL, 34, W - PR, 34);
    doc.setLineWidth(0.4);
    doc.line(PL, 35.2, W - PR, 35.2);

    // ── judul laporan ──
    const reportTitle = isDashboardReport ? "LAPORAN MONITORING AKADEMIK" : `LAPORAN ${title.toUpperCase()}`;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(reportTitle, cx, 43, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`Semester ${sem} Tahun Ajaran ${year}`, cx, 49, { align: "center" });

    // garis bawah judul
    doc.setLineWidth(0.3);
    doc.line(PL, 52, W - PR, 52);

    const black: [number,number,number] = [0,0,0];
    const white: [number,number,number] = [255,255,255];
    const lightGray: [number,number,number] = [240,240,240];
    const PRI: [number,number,number] = [26,86,219];

    if (isDashboardReport) {
      // ── ringkasan indikator (tabel kecil) ──
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).autoTable({
        head: [headers],
        body: rows,
        startY: 58,
        styles: {
          fontSize: 7.5,
          cellPadding: { top: 2.8, bottom: 2.8, left: 3, right: 3 },
          overflow: "linebreak",
          textColor: black,
          lineColor: black,
          lineWidth: 0.2,
          font: "helvetica",
        },
        headStyles: {
          fillColor: white,
          textColor: black,
          fontStyle: "bold",
          lineColor: black,
          lineWidth: 0.3,
          halign: "center",
        },
        alternateRowStyles: { fillColor: lightGray },
        bodyStyles: { fillColor: white },
        margin: { left: PL, right: PR },
        tableLineColor: black,
        tableLineWidth: 0.2,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cursorY: number = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 16 : 70;

      // ── grafik: satu section bernomor per chart, ditumpuk vertikal, gambar besar ──
      const charts = captureChartImages();
      const CHART_META: Record<string, { title: string; desc: string }> = {
        cDosen: {
          title: "Distribusi Jenjang Pendidikan Dosen",
          desc: "Komposisi tingkat pendidikan terakhir seluruh dosen aktif.",
        },
        cDO: {
          title: "Mahasiswa Berisiko DO",
          desc: "Distribusi mahasiswa bermasalah (SP1/SP2) per semester akademik.",
        },
        cKTW: {
          title: "Tren Kelulusan Tepat Waktu",
          desc: "Persentase kelulusan tepat waktu (KTW) per tahun akademik, 5 tahun terakhir.",
        },
      };
      const order = Object.keys(CHART_META);
      const ordered = order
        .map(id => charts.find(c => c.id === id))
        .filter((c): c is ChartCapture => !!c);
      const extra = charts.filter(c => !order.includes(c.id));
      const sections = [...ordered, ...extra];

      if (sections.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(
          "Grafik tidak disertakan — buka halaman Dashboard (sampai grafik tampil) sebelum mengekspor PDF.",
          PL, cursorY, { maxWidth: W - PL - PR }
        );
      }

      const contentW = W - PL - PR;
      const imgMaxH = 92;

      sections.forEach((c, idx) => {
        const meta = CHART_META[c.id];
        const sectionTitle = meta?.title ?? c.title;
        const sectionDesc = meta?.desc ?? "";

        const neededH = 9 + (sectionDesc ? 6 : 0) + imgMaxH + 16;
        if (cursorY + neededH > pageH - 18) {
          doc.addPage();
          cursorY = 20;
        }

        // heading bernomor + aksen garis biru pendek
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`${idx + 1}. ${sectionTitle}`, PL, cursorY);
        cursorY += 7;

        if (sectionDesc) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(100);
          doc.text(sectionDesc, PL, cursorY, { maxWidth: contentW });
          cursorY += 6;
        }

        // grafik besar, rasio asli dipertahankan, dikasih bingkai tipis biar rapi
        let imgW = contentW * 0.8;
        let imgH = imgW / c.ratio;
        if (imgH > imgMaxH) { imgH = imgMaxH; imgW = imgH * c.ratio; }
        const imgX = PL + (contentW - imgW) / 2;

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.rect(imgX - 4, cursorY - 4, imgW + 8, imgH + 8);
        doc.addImage(c.dataUrl, "PNG", imgX, cursorY, imgW, imgH);

        cursorY += imgH + 16;
      });
    } else {
      // ── tabel data (report list/rekap biasa) ──
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).autoTable({
        head: [headers],
        body: rows,
        startY: 55,
        styles: {
          fontSize: 7,
          cellPadding: { top: 2.5, bottom: 2.5, left: 2.5, right: 2.5 },
          overflow: "linebreak",
          textColor: black,
          lineColor: black,
          lineWidth: 0.2,
          font: "helvetica",
        },
        headStyles: {
          fillColor: white,
          textColor: black,
          fontStyle: "bold",
          lineColor: black,
          lineWidth: 0.3,
          halign: "center",
        },
        alternateRowStyles: { fillColor: lightGray },
        bodyStyles: { fillColor: white },
        margin: { left: PL, right: PR },
        tableLineColor: black,
        tableLineWidth: 0.2,
      });

      // Chart sengaja tidak disertakan — laporan cukup menampilkan tabel data.
      const rawCharts: ChartCapture[] = [];

      if (rawCharts.length > 0) {
        // ── metadata per chart: judul, deskripsi, ringkasan ──
        const CHART_META_BIMB: Record<string, {
          title: string;
          desc: string;
          summary: string;
        }> = {
          cBimbPie: {
            title: "Distribusi Kategori Beban Bimbingan Dosen",
            desc: "Menampilkan proporsi dosen berdasarkan kategori beban bimbingan untuk mendukung pemerataan distribusi mahasiswa bimbingan.",
            summary: "Mayoritas dosen berada pada kategori beban ideal (5–12 mahasiswa), sementara sebagian kecil memiliki beban tinggi (>12 mahasiswa) yang memerlukan perhatian dan redistribusi segera.",
          },
          cBimbKTW: {
            title: "Hubungan Beban Bimbingan Dosen dan Kelulusan Tepat Waktu",
            desc: "Visualisasi hubungan antara kategori beban bimbingan dosen dan tingkat kelulusan tepat waktu (KTW) mahasiswa bimbingan mereka.",
            summary: "Dosen dengan beban bimbingan ideal menunjukkan tingkat KTW tertinggi (84%), mengindikasikan bahwa pemerataan beban bimbingan berkontribusi positif terhadap kelulusan tepat waktu mahasiswa.",
          },
        };

        // Urutkan: cBimbPie dulu, cBimbKTW berikutnya, sisanya di belakang
        const ORDER = ["cBimbPie", "cBimbKTW"];
        const orderedCharts = [
          ...ORDER.map(id => rawCharts.find(c => c.id === id)).filter((c): c is ChartCapture => !!c),
          ...rawCharts.filter(c => !ORDER.includes(c.id)),
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cursorY: number = (doc as any).lastAutoTable?.finalY
          ? (doc as any).lastAutoTable.finalY + 18
          : 70;

        const contentW = W - PL - PR;

        // ── warna konsisten ──
        const accentBlue:  [number,number,number] = [26, 86, 219];
        const borderGray:  [number,number,number] = [203, 213, 225];
        const bgCard:      [number,number,number] = [248, 250, 252];
        const textGray:    [number,number,number] = [71, 85, 105];
        const textDark:    [number,number,number] = [15, 23, 42];
        const captionGray: [number,number,number] = [148, 163, 184];
        const summaryBg:   [number,number,number] = [239, 246, 255];
        const summaryBorder:[number,number,number]= [191, 219, 254];

        // Helper: gambar rounded-rect (simulasi dengan rect biasa di jsPDF)
        const drawCard = (x: number, y: number, w: number, h: number) => {
          doc.setFillColor(...bgCard);
          doc.setDrawColor(...borderGray);
          doc.setLineWidth(0.35);
          doc.roundedRect(x, y, w, h, 2, 2, "FD");
        };

        // Helper: wrap teks multi-baris & return tinggi terpakai
        const drawWrappedText = (
          text: string,
          x: number,
          y: number,
          maxW: number,
          fontSize: number,
          color: [number,number,number],
          fontStyle: "normal" | "bold" | "italic" = "normal",
          lineHeightPt = 1.4
        ): number => {
          doc.setFont("helvetica", fontStyle);
          doc.setFontSize(fontSize);
          doc.setTextColor(...color);
          const lines = doc.splitTextToSize(text, maxW) as string[];
          const lineH = fontSize * lineHeightPt * 0.352778; // pt → mm
          lines.forEach((line: string, i: number) => doc.text(line, x, y + i * lineH));
          return lines.length * lineH;
        };

        for (const c of orderedCharts) {
          const meta = CHART_META_BIMB[c.id];
          const chartTitle  = meta?.title   ?? c.title;
          const chartDesc   = meta?.desc    ?? "";
          const chartSummary= meta?.summary ?? "";

          // Estimasi tinggi card:
          // aksen bar 4 + judul ~6 + desc ~9 + gap 4 + chart 72 + caption 5 + gap summary 5 + summary ~10 + pad bawah 8
          const estimatedH = 4 + 7 + (chartDesc ? 10 : 0) + 5 + 72 + 5 + (chartSummary ? 14 : 0) + 10;

          // Page break kalau tidak cukup
          if (cursorY + estimatedH > pageH - 20) {
            doc.addPage();
            cursorY = 20;
          }

          const cardX = PL;
          const cardY = cursorY;

          // ── 1. Aksen garis biru kiri ──
          doc.setFillColor(...accentBlue);
          doc.rect(cardX, cardY, 3, estimatedH, "F");

          // ── 2. Card background ──
          drawCard(cardX + 3, cardY, contentW - 3, estimatedH);

          const innerX = cardX + 10;
          const innerW = contentW - 17;
          let cy = cardY + 7;

          // ── 3. Judul chart ──
          cy += drawWrappedText(chartTitle, innerX, cy, innerW, 10, textDark, "bold", 1.35);
          cy += 3;

          // ── 4. Deskripsi ──
          if (chartDesc) {
            cy += drawWrappedText(chartDesc, innerX, cy, innerW, 7.5, textGray, "italic", 1.4);
            cy += 4;
          }

          // ── 5. Garis pemisah tipis ──
          doc.setDrawColor(...borderGray);
          doc.setLineWidth(0.25);
          doc.line(innerX, cy, cardX + contentW - 4, cy);
          cy += 5;

          // ── 6. Chart image, proporsional, tengah ──
          const maxImgH = 70;
          let imgW = innerW * 0.88;
          let imgH = imgW / c.ratio;
          if (imgH > maxImgH) { imgH = maxImgH; imgW = imgH * c.ratio; }
          if (imgW > innerW) { imgW = innerW; imgH = imgW / c.ratio; }
          const imgX = innerX + (innerW - imgW) / 2;

          // frame chart tipis
          doc.setDrawColor(...borderGray);
          doc.setLineWidth(0.2);
          doc.rect(imgX - 1, cy - 1, imgW + 2, imgH + 2);
          doc.addImage(c.dataUrl, "PNG", imgX, cy, imgW, imgH);
          cy += imgH + 2;

          // ── 7. Caption sumber ──
          cy += 3;
          doc.setFont("helvetica", "italic");
          doc.setFontSize(6.5);
          doc.setTextColor(...captionGray);
          doc.text("Sumber: Sistem Monitoring Dosen dan Mahasiswa MyUnila", imgX, cy);
          cy += 5;

          // ── 8. Ringkasan temuan (box biru muda) ──
          if (chartSummary) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            const summaryLines = doc.splitTextToSize(`Temuan: ${chartSummary}`, innerW - 8) as string[];
            const summaryH = summaryLines.length * (7 * 1.4 * 0.352778) + 6;

            doc.setFillColor(...summaryBg);
            doc.setDrawColor(...summaryBorder);
            doc.setLineWidth(0.3);
            doc.roundedRect(innerX, cy, innerW, summaryH, 1.5, 1.5, "FD");

            doc.setTextColor(...accentBlue);
            summaryLines.forEach((line: string, i: number) => {
              doc.text(line, innerX + 4, cy + 4 + i * (7 * 1.4 * 0.352778));
            });
            cy += summaryH + 3;
          }

          cursorY = cy + 12;
        }
      }
    }

    // ── footer setiap halaman ──
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setDrawColor(0); doc.setLineWidth(0.3);
      doc.line(PL, pageH - 14, W - PR, pageH - 14);
      doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(0);
      doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")}  |  Dokumen ini diterbitkan secara resmi oleh SIPEKA Universitas Lampung.`, PL, pageH - 10);
      doc.text(`Halaman ${i} / ${pages}`, W - PR, pageH - 10, { align: "right" });
    }

    doc.save(base + ".pdf");
    return;
  }
}

export default function SpkDashboardPage() {
  const [activeSection, setActiveSection] = useState("sec-dashboard");

  // Background fix — set after HeroUI/NextThemes mount
  useEffect(() => {
    const t = setTimeout(() => {
      document.body.style.setProperty('background', '#F0F4F9', 'important');
      document.documentElement.style.setProperty('background', '#F0F4F9', 'important');
    }, 100);
    return () => {
      clearTimeout(t);
      document.body.style.removeProperty('background');
      document.documentElement.style.removeProperty('background');
    };
  }, []);

  const [lastUpdate, setLastUpdate] = useState("—");
  const [dashTs, setDashTs] = useState(
    "Semester Genap 2025/2026 · Data real-time SIAKAD, Sister, PDDIKTI"
  );

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<"all" | "unread" | "alert">("all");
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [profileModal, setProfileModal] = useState<{
    open: boolean;
    type: "dosen" | "mahasiswa" | null;
    index: number;
  }>({ open: false, type: null, index: -1 });

  const [dosenSimpleModal, setDosenSimpleModal] = useState<{ open: boolean; index: number }>({
    open: false, index: -1,
  });

  const [exportModal, setExportModal] = useState<{
    open: boolean;
    title: string;
    desc: string;
    filteredData?: Record<string, unknown>[];
  }>({ open: false, title: "", desc: "" });

  const showToast = (msg: string, type: ToastType = "info") => {
    const id = ++toastIdRef.current;
    setToasts((prev: ToastItem[]) => [...prev, { id, type, msg, visible: false }]);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts((prev: ToastItem[]) =>
          prev.map((t: ToastItem) => (t.id === id ? { ...t, visible: true } : t))
        );
      });
    });
    setTimeout(() => {
      setToasts((prev: ToastItem[]) =>
        prev.map((t: ToastItem) => (t.id === id ? { ...t, visible: false } : t))
      );
      setTimeout(() => {
        setToasts((prev: ToastItem[]) => prev.filter((t: ToastItem) => t.id !== id));
      }, 300);
    }, 3000);
  };

  useEffect(() => {
    const t = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setLastUpdate(t + " WIB");
    const welcome = setTimeout(() => {
      showToast("Dashboard berhasil dimuat — Semester Genap 2025/2026", "success");
    }, 600);
    return () => clearTimeout(welcome);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate to section — just set active, scroll to top
  const navigateToSection = (id: string) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenDosenByIndex = (index: number) => {
    setProfileModal({ open: true, type: "dosen", index });
  };

  const handleOpenDosenSimple = (index: number) => {
    setDosenSimpleModal({ open: true, index });
  };

  const handleOpenMhsByNpm = (npm: string) => {
    const index = MHS.findIndex((x: Mhs) => x.npm === npm);
    if (index !== -1) setProfileModal({ open: true, type: "mahasiswa", index });
  };

  const handleOpenExport = (title: string, desc: string, filteredData?: Record<string, unknown>[]) => {
    setExportModal({ open: true, title, desc, filteredData });
  };

  const handleDoExport = async (format: "excel" | "pdf" | "csv", year: string, sem: string) => {
    const ctx = exportModal.title;
    setExportModal({ open: false, title: "", desc: "" });
    const labels: Record<string, string> = { excel: "Excel (.xlsx)", pdf: "PDF (.pdf)", csv: "CSV (.csv)" };
    showToast(`Menyiapkan "${ctx}" → ${labels[format]}...`, "info");
    try {
      await doExport(format, ctx, year, sem, exportModal.filteredData);
      showToast(`✅ File berhasil diunduh!`, "success");
    } catch (err) {
      console.error(err);
      showToast("❌ Gagal mengekspor file. Coba lagi.", "error");
    }
  };

  const handleReadNotif = (id: number) => {
    setNotifs((prev: Notif[]) =>
      prev.map((n: Notif) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifs((prev: Notif[]) => prev.map((n: Notif) => ({ ...n, unread: false })));
    showToast("Semua notifikasi sudah dibaca", "success");
  };

  const handleRemoveToast = (id: number) => {
    setToasts((prev: ToastItem[]) => prev.filter((t: ToastItem) => t.id !== id));
  };

  const handleLogout = () => {
    console.log("logout");
  };

  const unreadCount = notifs.filter((n: Notif) => n.unread).length;

  // Render only the active section
  const renderSection = () => {
    switch (activeSection) {
      case "sec-dashboard":
        return <Dashboard dashTs={dashTs} onExport={handleOpenExport} onScrollTo={navigateToSection} />;
      case "sec-dosen":
        return <DosenView onOpenDosen={handleOpenDosenSimple} onExport={handleOpenExport} />;
      case "sec-analisis":
        return <Analisis onOpenDosen={handleOpenDosenSimple} onExport={handleOpenExport} />;
      case "sec-aktivitas":
        return <Aktivitas onOpenDosen={handleOpenDosenByIndex} onExport={handleOpenExport} />;
      case "sec-beban":
        return <Bimbingan onExport={handleOpenExport} />;
      case "sec-publikasi":
        return <Publikasi onExport={handleOpenExport} />;
      case "sec-mahasiswa":
        return (
          <Mahasiswa
            sectionRef={() => {}}
            data={MHS}
            onOpenMhs={handleOpenMhsByNpm}
            onOpenExport={handleOpenExport}
          />
        );
      case "sec-anomali":
        return <AnomaliUkt onExport={handleOpenExport} />;
      case "sec-ews":
        return (
          <EwsDO
            sectionRef={() => {}}
            data={MHS}
            onOpenMhs={handleOpenMhsByNpm}
            onOpenExport={handleOpenExport}
          />
        );
      case "sec-kelulusan":
        return <Kelulusan onExport={handleOpenExport} />;
      default:
        return <Dashboard dashTs={dashTs} onExport={handleOpenExport} onScrollTo={navigateToSection} />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F0F4F9' }}>
      <DosenProfileModal
        open={dosenSimpleModal.open}
        dosen={dosenSimpleModal.index >= 0 ? DOSEN[dosenSimpleModal.index] : null}
        onClose={() => setDosenSimpleModal({ open: false, index: -1 })}
      />
      <ProfileModal
        open={profileModal.open}
        type={profileModal.type}
        dosenData={DOSEN}
        mhsData={MHS}
        index={profileModal.index}
        onClose={() => setProfileModal({ open: false, type: null, index: -1 })}
      />
      <ExportModal
        open={exportModal.open}
        title={exportModal.title}
        desc={exportModal.desc}
        onClose={() => setExportModal({ open: false, title: "", desc: "" })}
        onExport={handleDoExport}
      />
      <NotifPanel
        open={notifOpen}
        tab={notifTab}
        notifs={notifs}
        unreadCount={unreadCount}
        onSetTab={(t: "all" | "unread" | "alert") => setNotifTab(t)}
        onReadNotif={handleReadNotif}
        onMarkAllRead={handleMarkAllRead}
        onClose={() => setNotifOpen(false)}
      />
      <Toast toasts={toasts} onRemove={handleRemoveToast} />

      <Sidebar
        activeSection={activeSection}
        onNavigate={navigateToSection}
        lastUpdate={lastUpdate}
        onLogout={handleLogout}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className={`${styles.appWrap} ml-[252px] flex-1 flex flex-col min-h-screen min-w-0`}>
        <Topbar
          title="Sistem Informasi Pendukung Evaluasi Kinerja Akademik Universitas Lampung"
          breadcrumb={spkMenuConfig.find(m => m.href === activeSection)?.title ?? activeSection.replace("sec-", "").replace(/-/g, " ")}
          unreadCount={unreadCount}
          onToggleNotif={() => setNotifOpen((o: boolean) => !o)}
          lastUpdate={lastUpdate}
          onOpenMobileMenu={() => setMobileNavOpen(true)}
        />
        <main className="flex-1">
          <div className="p-[18px_22px] max-w-[1440px]">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}