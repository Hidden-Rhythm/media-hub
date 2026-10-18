import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = usePlayer();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-xl border animate-slideUp pointer-events-auto ${
              isSuccess 
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : isError 
                ? 'bg-red-950/90 border-red-500/50 text-red-200' 
                : 'bg-[#151a2e]/95 border-[#252b45] text-slate-200'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            {isError && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
            {!isSuccess && !isError && <Info className="w-3.5 h-3.5 text-purple-400" />}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
