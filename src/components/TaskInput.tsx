import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Plus, Tag, Flag, Calendar, Sparkles, ChevronDown } from 'lucide-react';
import { Category, Priority, Task } from '../types.ts';

interface TaskInputProps {
  onAddTask: (newTask: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

const CATEGORIES: Category[] = ['General', 'Personal', 'Work', 'Study', 'Health', 'Shopping'];

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('General');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    onAddTask({
      text: trimmed,
      category,
      priority,
      dueDate: dueDate || undefined,
    });

    setText('');
    setDueDate('');
    setShowOptions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 transition-all hover:shadow-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What needs to be done? (e.g. Call dentist at 2 PM)"
              className="w-full px-4 py-3 text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm md:text-base transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="flex items-center justify-center gap-1.5 px-4 md:px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-sm transition-all text-sm md:text-base shrink-0 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {/* Quick controls toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{showOptions ? 'Hide extra details' : 'Add priority & category'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
            </button>

            {!showOptions && (priority !== 'medium' || category !== 'General' || dueDate) && (
              <span className="text-xs text-slate-400 italic">
                {category} • {priority.toUpperCase()} {dueDate && `• Due ${dueDate}`}
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 font-mono">Enter ↵</kbd> to add
          </span>
        </div>

        {/* Expandable details panel */}
        {showOptions && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            {/* Category */}
            <div>
              <label className="flex items-center gap-1 text-slate-500 font-medium mb-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center gap-1 text-slate-500 font-medium mb-1.5">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-1 text-slate-500 font-medium mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due Date (optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
