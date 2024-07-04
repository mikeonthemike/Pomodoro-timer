  import React, { useState, useEffect } from 'react';
  import { FaCog } from 'react-icons/fa';
import SettingsModal, { SettingsButton } from './components/Settings';
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

  useEffect(() => {
    let interval = null;
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Pomodoro Timer</h1>
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
      <SettingsButton onClick={() => setIsSettingsOpen(true)} />
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
  );
}

export default App;