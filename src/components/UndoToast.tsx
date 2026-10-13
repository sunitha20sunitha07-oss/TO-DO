import { Undo2, X } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export default function UndoToast({ message, onUndo, onDismiss }: UndoToastProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 text-sm animate-fade-in max-w-sm w-full mx-4">
      <span className="flex-1 truncate">{message}</span>
      <button
        onClick={onUndo}
        className="flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
      >
        <Undo2 className="w-3.5 h-3.5" />
        Undo
      </button>
      <button
        onClick={onDismiss}
        className="p-1 text-slate-400 hover:text-white rounded transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
