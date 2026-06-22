"use client";

import { useEffect } from "react";

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";

function loadChartJs(cb: () => void) {
  if (typeof (window as any).Chart !== "undefined") { cb(); return; }
  const existing = document.getElementById("chartjs-cdn");
  if (existing) {
    existing.addEventListener("load", cb);
    return;
  }
  const script = document.createElement("script");
  script.id = "chartjs-cdn";
  script.src = CDN;
  script.onload = cb;
  document.head.appendChild(script);
}

const F = { family: "'Poppins',sans-serif", size: 11 };
const G = "rgba(0,0,0,.05)";
const PRI = "#1a56db";

function destroyIfExists(id: string) {
  const el = document.getElementById(id) as HTMLCanvasElement | null;
  if (!el) return;
  const C = (window as any).Chart;
  if (C) { const ex = C.getChart(el); if (ex) ex.destroy(); }
}

type DashboardChartData = {
  distDosen: number[];
  ewsDO: { sp1: number[]; sp2: number[] };
  ktwTrend: { labels: string[]; data: number[] };
};

export function useDashboardCharts(data?: DashboardChartData) {
  useEffect(() => {
    loadChartJs(() => {
      const C = (window as any).Chart;
      C.defaults.font.family = "'Poppins',sans-serif";

      const dist = data?.distDosen ?? [160, 174, 14, 18, 12];
      const distLabelNames = ["S3", "S2", "S1", "Profesi", "Spesialis"];

      destroyIfExists("cDosen");
      new C(document.getElementById("cDosen"), {
        type: "doughnut",
        data: {
          labels: dist.map((v, i) => `${distLabelNames[i]} (${v})`),
          datasets: [{ data: dist, backgroundColor: ["#059669", PRI, "#DC2626", "#7C3AED", "#0891B2"], borderWidth: 0, hoverOffset: 5 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: "68%",
          plugins: { legend: { position: "right", labels: { font: F, padding: 12, usePointStyle: true, pointStyle: "circle" } } },
        },
      });

      const ews = data?.ewsDO ?? { sp1: [7, 3, 2, 0, 0], sp2: [0, 0, 0, 5, 2] };

      destroyIfExists("cDO");
      new C(document.getElementById("cDO"), {
        type: "bar",
        data: {
          labels: ["Sem 5", "Sem 6", "Sem 7", "Sem 8", "Sem 9+"],
          datasets: [
            { label: "SP1", data: ews.sp1, backgroundColor: "rgba(217,119,6,.75)", borderRadius: 4 },
            { label: "SP2", data: ews.sp2, backgroundColor: "rgba(220,38,38,.75)", borderRadius: 4 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { font: F } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: F } },
            y: { grid: { color: G }, ticks: { font: F }, beginAtZero: true },
          },
        },
      });

      const ktwTrend = data?.ktwTrend ?? { labels: ["2021", "2022", "2023", "2024", "2025"], data: [73, 75, 76, 78, 80] };

      setTimeout(() => {
        destroyIfExists("cKTW");
        const el = document.getElementById("cKTW");
        if (!el) return;
        new C(el, {
          type: "line",
          data: {
            labels: ktwTrend.labels,
            datasets: [{
              label: "% Tepat Waktu", data: ktwTrend.data,
              borderColor: PRI, backgroundColor: "rgba(11,94,168,.07)",
              fill: true, tension: 0.4, pointBackgroundColor: PRI, pointRadius: 4, pointHoverRadius: 6,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { font: F } } },
            scales: {
              x: { grid: { display: false }, ticks: { font: F } },
              y: { grid: { color: G }, ticks: { font: F, callback: (v: number) => v + "%" }, min: 60, max: 90 },
            },
          },
        });
      }, 150);
    });
  }, [data?.distDosen, data?.ewsDO, data?.ktwTrend]);
}

export function useAktivitasCharts() {
  useEffect(() => {
    loadChartJs(() => {
      const C = (window as any).Chart;
      destroyIfExists("cSKS");
      new C(document.getElementById("cSKS"), {
        type: "bar",
        data: {
          labels: ["Teknik", "FMIPA", "FKIP", "Ekonomi & Bisnis", "Hukum", "FISIP"],
          datasets: [
            {
              label: "Rata-rata SKS",
              data: [11.2, 9.7, 8.4, 8.3, 8.0, 7.0],
              backgroundColor: [
                "rgba(11,94,168,.85)",
                "rgba(124,58,237,.85)",
                "rgba(220,38,38,.75)",
                "rgba(217,119,6,.85)",
                "rgba(5,150,105,.85)",
                "rgba(8,145,178,.85)",
              ],
              borderRadius: 5,
              barPercentage: 0.62,
              categoryPercentage: 0.85,
            },
          ],
        },
        options: {
          indexAxis: "y" as const,
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx: any) => ` ${ctx.parsed.x} SKS rata-rata`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: G },
              ticks: { font: F, callback: (v: number) => v + " SKS" },
              beginAtZero: false, min: 4, max: 14,
            },
            y: {
              grid: { display: false },
              ticks: { font: { ...F, size: 12 } },
            },
          },
        },
      });

      destroyIfExists("cPub");
      new C(document.getElementById("cPub"), {
        type: "line",
        data: {
          labels: ["2021", "2022", "2023", "2024", "2025"],
          datasets: [
            { label: "Nasional", data: [148, 162, 178, 190, 205], borderColor: PRI, tension: 0.4, fill: false, pointRadius: 4 },
            { label: "Internasional", data: [61, 70, 84, 96, 110], borderColor: "#D97706", tension: 0.4, fill: false, pointRadius: 4 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { font: F } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: F } },
            y: { grid: { color: G }, ticks: { font: F }, beginAtZero: true },
          },
        },
      });
    });
  }, []);
}

export function useBimbinganCharts() {
  useEffect(() => {
    loadChartJs(() => {
      const C = (window as any).Chart;
      destroyIfExists("cBimbPie");
      new C(document.getElementById("cBimbPie"), {
        type: "doughnut",
        data: {
          labels: ["Tinggi >12 (28)", "Ideal 5–12 (298)", "Rendah <5 (22)"],
          datasets: [{ data: [28, 298, 22], backgroundColor: ["#DC2626", "#059669", "#D97706"], borderWidth: 0, hoverOffset: 5 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: "65%",
          plugins: {
            legend: { position: "right", labels: { font: { ...F, size: 10 }, padding: 9, usePointStyle: true, pointStyle: "circle" } },
            tooltip: {
              callbacks: {
                label: (ctx: any) => {
                  const labels = ["Tinggi (>12 mhs)", "Ideal (5–12 mhs)", "Rendah (<5 mhs)"];
                  return ` ${labels[ctx.dataIndex]}: ${ctx.parsed} dosen`;
                },
              },
            },
          },
        },
      });

      destroyIfExists("cBimbKTW");
      new C(document.getElementById("cBimbKTW"), {
        type: "bar",
        data: {
          labels: ["Beban Tinggi", "Beban Ideal", "Beban Rendah"],
          datasets: [{ label: "Rata-rata KTW Bimbingan (%)", data: [62, 84, 71], backgroundColor: ["rgba(220,38,38,.75)", "rgba(5,150,105,.75)", "rgba(217,119,6,.75)"], borderRadius: 4 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { font: F } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: F } },
            y: { grid: { color: G }, ticks: { font: F, callback: (v: number) => v + "%" }, beginAtZero: true, max: 100 },
          },
        },
      });
    });
  }, []);
}

export function useKelulusanCharts() {
  useEffect(() => {
    loadChartJs(() => {
      const C = (window as any).Chart;
      destroyIfExists("cGrad");
      new C(document.getElementById("cGrad"), {
        type: "bar",
        data: {
          labels: ["2021", "2022", "2023", "2024", "2025"],
          datasets: [
            { label: "Tepat Waktu", data: [1720, 1788, 1831, 1905, 1960], backgroundColor: "rgba(5,150,105,.75)", borderRadius: 3, stack: "s" },
            { label: "Terlambat", data: [540, 488, 517, 470, 440], backgroundColor: "rgba(220,38,38,.5)", borderRadius: 3, stack: "s" },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { font: F } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: F }, stacked: true },
            y: { grid: { color: G }, ticks: { font: F }, stacked: true, beginAtZero: true },
          },
        },
      });

      destroyIfExists("cFak");
      new C(document.getElementById("cFak"), {
        type: "radar",
        data: {
          labels: ["Teknik", "Ekonomi", "Hukum", "FMIPA", "FISIP", "FKIP", "Kedokteran"],
          datasets: [{
            label: "% KTW", data: [80, 73, 85, 67, 79, 75, 91],
            backgroundColor: "rgba(11,94,168,.1)", borderColor: PRI, pointBackgroundColor: PRI, pointRadius: 4,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { font: F } } },
          scales: { r: { ticks: { font: F, stepSize: 20 }, grid: { color: G }, pointLabels: { font: F } } },
        },
      });
    });
  }, []);
}