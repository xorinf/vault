import { useReducer, useEffect, useCallback, useRef } from 'react';
import { POMODORO } from '../utils/constants';

const initialState = {
  mode: 'work', // 'work' | 'shortBreak' | 'longBreak'
  timeLeft: POMODORO.WORK,
  isRunning: false,
  sessions: 0,
};

function pomodoroReducer(state, action) {
  switch (action.type) {
    case 'TICK':
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'START':
      return { ...state, isRunning: true };
    case 'PAUSE':
      return { ...state, isRunning: false };
    case 'RESET':
      return {
        ...state,
        isRunning: false,
        timeLeft: getTime(state.mode),
      };
    case 'SWITCH_MODE': {
      const mode = action.payload;
      return {
        ...state,
        mode,
        timeLeft: getTime(mode),
        isRunning: false,
      };
    }
    case 'COMPLETE_SESSION':
      return {
        ...state,
        sessions: state.sessions + 1,
        isRunning: false,
      };
    default:
      return state;
  }
}

function getTime(mode) {
  switch (mode) {
    case 'work': return POMODORO.WORK;
    case 'shortBreak': return POMODORO.SHORT_BREAK;
    case 'longBreak': return POMODORO.LONG_BREAK;
    default: return POMODORO.WORK;
  }
}

export function usePomodoro() {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else if (state.timeLeft === 0) {
      dispatch({ type: 'COMPLETE_SESSION' });
      // Auto switch to break or work
      if (state.mode === 'work') {
        const nextMode = (state.sessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        dispatch({ type: 'SWITCH_MODE', payload: nextMode });
      } else {
        dispatch({ type: 'SWITCH_MODE', payload: 'work' });
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [state.isRunning, state.timeLeft, state.mode, state.sessions]);

  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const switchMode = useCallback((mode) => dispatch({ type: 'SWITCH_MODE', payload: mode }), []);

  return { ...state, start, pause, reset, switchMode };
}
