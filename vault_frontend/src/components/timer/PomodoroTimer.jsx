import { Play, Pause, RotateCcw, Coffee, Brain, Sunset } from 'lucide-react';
import Modal from '../ui/Modal';
import { usePomodoro } from '../../hooks/usePomodoro';
import { formatTimer } from '../../utils/formatters';

const modeConfig = {
  work: { label: 'Focus', icon: Brain, color: 'bg-accent' },
  shortBreak: { label: 'Short Break', icon: Coffee, color: 'bg-success' },
  longBreak: { label: 'Long Break', icon: Sunset, color: 'bg-warning' },
};

/**
 * Pomodoro timer modal.
 */
export default function PomodoroTimer({ isOpen, onClose }) {
  const { mode, timeLeft, isRunning, sessions, start, pause, reset, switchMode } = usePomodoro();
  const config = modeConfig[mode];
  const Icon = config.icon;

  const progress = (() => {
    const total = mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
    return ((total - timeLeft) / total) * 100;
  })();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pomodoro Timer" size="sm">
      <div className="flex flex-col items-center py-4">
        {/* Mode tabs */}
        <div className="flex gap-1 bg-hover rounded-lg p-1 mb-8">
          {Object.entries(modeConfig).map(([key, cfg]) => {
            const ModeIcon = cfg.icon;
            return (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  mode === key ? 'bg-surface text-heading shadow-card' : 'text-muted hover:text-heading'
                }`}
              >
                <ModeIcon size={14} />
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Timer circle */}
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="4"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon size={20} className="text-muted mb-1" />
            <span className="text-4xl font-bold font-mono text-heading">
              {formatTimer(timeLeft)}
            </span>
            <span className="text-xs text-muted mt-1">{config.label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="p-3 rounded-xl text-muted hover:text-heading hover:bg-hover transition-colors"
            aria-label="Reset timer"
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={isRunning ? pause : start}
            className="p-4 rounded-2xl bg-accent text-white hover:bg-heading transition-colors shadow-card"
            aria-label={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <div className="p-3 text-center">
            <p className="text-lg font-bold font-mono text-heading">{sessions}</p>
            <p className="text-[10px] text-muted">sessions</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
