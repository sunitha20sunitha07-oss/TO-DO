import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Check, Trash2, Edit2, X, Calendar, Flag } from 'lucide-react';
import { Task } from '../types.ts';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      onEdit(task.id, trimmed);
    } else {
      setEditText(task.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  const getPriorityStyle = () => {
    switch (task.priority) {
      case 'high':
        return 'text-rose-700 bg-rose-50 border-rose-200/80';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200/80';
      case 'low':
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200/80';
    }
  };

  const getCategoryColor = () => {
    switch (task.category) {
      case 'Work':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'Personal':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'Health':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Study':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'Shopping':
        return 'bg-orange-50 text-orange-700 border-orange-200/60';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/60';
    }
  };

  // Due date status
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    const today = new Date().toISOString().split('T')[0];
    const isPast = dateString < today && !task.completed;
    const isToday = dateString === today;

    const parts = dateString.split('-');
    const formatted = `${parts[1]}/${parts[2]}`;

    if (isToday) {
      return {
        label: 'Due today',
        className: 'text-amber-600 bg-amber-50 border-amber-200',
      };
    }
    if (isPast) {
      return {
        label: `Overdue (${formatted})`,
        className: 'text-rose-600 bg-rose-50 border-rose-200',
      };
    }
    return {
      label: `Due ${formatted}`,
      className: 'text-slate-500 bg-slate-50 border-slate-200',
    };
  };

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <div
      className={`group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
          task.completed
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
            : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/30'
        }`}
      >
        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-1.5 text-sm bg-white border border-indigo-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              onClick={handleSave}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditText(task.text);
                setIsEditing(false);
              }}
              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <p
              onDoubleClick={() => !task.completed && setIsEditing(true)}
              className={`text-sm sm:text-base break-words font-medium select-text transition-all leading-snug ${
                task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
              }`}
            >
              {task.text}
            </p>

            {/* Badges / metadata */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span
                className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-md border font-medium ${getCategoryColor()}`}
              >
                {task.category}
              </span>

              {task.priority !== 'low' && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] px-2 py-0.5 rounded-md border font-medium capitalize ${getPriorityStyle()}`}
                >
                  <Flag className="w-2.5 h-2.5" />
                  {task.priority}
                </span>
              )}

              {dueInfo && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border font-medium ${dueInfo.className}`}
                >
                  <Calendar className="w-2.5 h-2.5" />
                  {dueInfo.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isEditing && (
        <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          {!task.completed && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="Edit task"
              aria-label="Edit task"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            aria-label="Delete task"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
