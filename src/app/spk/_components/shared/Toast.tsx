'use client';

import { useEffect, useRef } from 'react';
// ✅ FIX: import ToastItem dari page.tsx, bukan dari menuConfig (tidak ada di sana)
import type { ToastItem } from '../data';
import styles from '../../page.module.css';

interface Props {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}

const IC: Record<string, string> = { success: '✅', error: '❌', warn: '⚠️', info: 'ℹ️' };

function ToastEntry({ toast, onRemove }: { toast: ToastItem; onRemove: (id: number) => void }) {
  const typeClass: Record<string, string> = {
    success: styles.toastSuccess,
    error:   styles.toastError,
    warn:    styles.toastWarn,
    info:    styles.toastInfo,
  };

  return (
    <div
      className={`${styles.toast} ${typeClass[toast.type]} ${toast.visible ? styles.toastVisible : ''}`}
    >
      <span>{IC[toast.type]}</span>
      <span>{toast.msg}</span>
    </div>
  );
}

export default function Toast({ toasts, onRemove }: Props) {
  return (
    <div className="fixed bottom-5 right-5 z-[1000] flex flex-col gap-[6px] pointer-events-none">
      {toasts.map(t => (
        <ToastEntry key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
