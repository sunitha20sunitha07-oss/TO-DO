import { CheckCircle2, ListTodo, Flame, Sparkles } from 'lucide-react';
import { Task } from '../types.ts';

interface TaskStatsProps {
  tasks: Task[];
  onClearCompleted: () => void;
}

export default function TaskStats({ tasks, onClearCompleted }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const getEncouragement = () => {
    if (total === 0) return 'No tasks yet. Add your first goal above!';
    if (completed === total) return 'All tasks completed! You crushed it! 🎉';
    if (percentage >= 50) return 'Over halfway there! Keep up the momentum 💪';
    if (completed > 0) return 'Good start! One task at a time ✨';
    return 'Ready to make today productive!';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-base">Progress</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {percentage}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 inline shrink-0" />
            {getEncouragement()}
          </p>
        </div>

        {completed > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-xs text-slate-500 hover:text-rose-600 font-medium px-2.5 py-1 rounded-lg hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors self-start sm:self-auto cursor-pointer"
          >
            Clear {completed} completed
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-4">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
            <ListTodo className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Total</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-slate-800">{total}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
          <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-amber-800">{pending}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Done</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-emerald-800">{completed}</p>
        </div>
      </div>
    </div>
  );
}
