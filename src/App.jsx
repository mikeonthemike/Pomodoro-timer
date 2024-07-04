  import React, { useState, useEffect } from 'react';
  import { FaCog } from 'react-icons/fa';
  import './App.css';

  function SettingsModal({ isOpen, onClose, workDuration, breakDuration, onWorkDurationChange, onBreakDurationChange }) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Timer Settings</h3>
            <div className="mt-2 px-7 py-3">
              <div className="mb-4">
                <label htmlFor="workDuration" className="block text-sm font-medium text-gray-700">
                  Work Duration (minutes):
                </label>
                <input
                  type="number"
                  id="workDuration"
                  value={workDuration}
                  onChange={onWorkDurationChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="breakDuration" className="block text-sm font-medium text-gray-700">
                  Break Duration (minutes):
                </label>
                <input
                  type="number"
                  id="breakDuration"
                  value={breakDuration}
                  onChange={onBreakDurationChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  min="1"
                />
              </div>
            </div>
            <div className="items-center px-4 py-3">
              <button
                id="ok-btn"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function App() {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work');
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
            setMode('break');
            setMinutes(breakDuration);
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
  }, [isActive, minutes, seconds, mode, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? workDuration : breakDuration);
    setSeconds(0);
  };

  const handleWorkDurationChange = (e) => {
    setWorkDuration(Number(e.target.value));
    if (mode === 'work' && !isActive) {
      setMinutes(Number(e.target.value));
    }
  };

  const handleBreakDurationChange = (e) => {
    setBreakDuration(Number(e.target.value));
    if (mode === 'break' && !isActive) {
      setMinutes(Number(e.target.value));
    }
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
      Current mode: {mode === 'work' ? 'Work' : 'Break'}
    </p>
    <button
      className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
      onClick={() => setIsSettingsOpen(true)}
    >
      <FaCog className="mr-2" />
      <span>Settings</span>
    </button>
    <SettingsModal
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      workDuration={workDuration}
      breakDuration={breakDuration}
      onWorkDurationChange={handleWorkDurationChange}
      onBreakDurationChange={handleBreakDurationChange}
    />
  </div>
);
}

export default App;