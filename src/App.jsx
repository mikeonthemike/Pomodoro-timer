  import { useState, useEffect, useRef, useCallback } from 'react';
import SettingsModal, { SettingsButton } from './components/Settings';
import TaskManager from './components/TaskManager';
  import './App.css';


function App() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(10);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentTask, setCurrentTask] = useState(/** @type {{id: string, content: string} | null} */ (null));
  const [isFocusMode, setIsFocusMode] = useState(false);
  const focusHandlersRef = useRef(/** @type {{ completeAndNext: () => void; selectNext: () => void } | null} */ (null));

  useEffect(() => {
    /** @type {ReturnType<typeof setInterval> | undefined} */
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(interval);
          setIsActive(false);
          if (mode === 'work') {
            const newCompletedSessions = completedSessions + 1;
            setCompletedSessions(newCompletedSessions);
            if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
              setMode('longBreak');
              setMinutes(longBreakDuration);
            } else {
              setMode('break');
              setMinutes(breakDuration);
            }
          } else {
            setMode('work');
            setMinutes(workDuration);
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, workDuration, breakDuration, longBreakDuration, completedSessions, sessionsBeforeLongBreak]);


  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? workDuration : (mode === 'break' ? breakDuration : longBreakDuration));
    setSeconds(0);
  };

  const handleWorkDurationChange = (newDuration) => {
    setWorkDuration(newDuration);
    if (mode === 'work' && !isActive) {
      setMinutes(newDuration);
    }
  };

  const handleBreakDurationChange = (newDuration) => {
    setBreakDuration(newDuration);
    if (mode === 'break' && !isActive) {
      setMinutes(newDuration);
    }
  };

  const handleLongBreakDurationChange = (newDuration) => {
    setLongBreakDuration(newDuration);
    if (mode === 'longBreak' && !isActive) {
      setMinutes(newDuration);
    }
  };

  const handleSessionsBeforeLongBreakChange = (newValue) => {
    setSessionsBeforeLongBreak(newValue);
  };

const handleTaskSelect = (task) => {
  setCurrentTask(task);
  if (task && mode !== 'work') {
    setMode('work');
    setMinutes(workDuration);
    setSeconds(0);
  }
};

const onRegisterFocusHandlers = useCallback((handlers) => {
  focusHandlersRef.current = handlers;
}, []);

return (
  <>
    {/* Focus mode overlay: expanded timer, calm blue background, current task, Complete, Exit (timer keeps running) */}
    {isFocusMode && (
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center min-h-screen bg-[#c5dff7] p-6">
        <button
          className="absolute top-4 right-4 text-slate-600 hover:text-slate-800 text-sm font-medium"
          onClick={() => setIsFocusMode(false)}
          aria-label="Exit focus mode"
        >
          Exit focus mode
        </button>
        <div className="text-8xl md:text-9xl font-mono mb-8 text-slate-800">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="space-x-4 mb-8">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
            onClick={toggleTimer}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg text-lg"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
        <p className="mb-6 text-xl text-slate-600">
          {mode === 'work' ? 'Work' : (mode === 'break' ? 'Short Break' : 'Long Break')}
        </p>
        <div className="w-full max-w-xl mb-6">
          {currentTask ? (
            <div className="p-6 bg-white/80 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-2 text-slate-700">Current task</h3>
              <p className="text-xl text-slate-800 mb-4">{currentTask.content}</p>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
                onClick={() => focusHandlersRef.current?.completeAndNext()}
              >
                Complete
              </button>
            </div>
          ) : (
            <div className="p-6 bg-white/80 rounded-xl shadow-lg">
              <p className="text-slate-600 mb-4">No task selected</p>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
                onClick={() => focusHandlersRef.current?.selectNext()}
              >
                Start next task
              </button>
            </div>
          )}
        </div>
      </div>
    )}

    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 ${isFocusMode ? 'invisible' : ''}`}>
    <h1 className="text-4xl font-bold mb-8">Pomodoro Timer</h1>
    <div className="flex flex-col md:flex-row w-full max-w-4xl">
      <div className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-4">
        <div className="text-6xl font-mono mb-8">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="space-x-4 mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleTimer}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
        <p className="mt-4 text-xl mb-4">
          Current mode: {mode === 'work' ? 'Work' : (mode === 'break' ? 'Short Break' : 'Long Break')}
        </p>
        <p className="text-xl mb-4">
          Completed work sessions: {completedSessions}
        </p>
        {currentTask && (
          <div className="mt-4 p-4 bg-white rounded shadow">
            <h3 className="font-bold">Current Task:</h3>
            <p>{currentTask.content}</p>

          </div>
        )}
        <button
          className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsFocusMode(true)}
        >
          Enter focus mode
        </button>
        <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      </div>
      <div className="w-full md:w-1/2">
        <TaskManager onTaskSelect={handleTaskSelect} onRegisterFocusHandlers={onRegisterFocusHandlers} />
      </div>
    </div>
    <SettingsModal
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      workDuration={workDuration}
      breakDuration={breakDuration}
      longBreakDuration={longBreakDuration}
      sessionsBeforeLongBreak={sessionsBeforeLongBreak}
      onWorkDurationChange={handleWorkDurationChange}
      onBreakDurationChange={handleBreakDurationChange}
      onLongBreakDurationChange={handleLongBreakDurationChange}
      onSessionsBeforeLongBreakChange={handleSessionsBeforeLongBreakChange}
    />
  </div>
  </>
);
}

export default App;