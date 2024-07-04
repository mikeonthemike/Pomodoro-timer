import React, { useState, useEffect } from 'react';
import { FaCog } from 'react-icons/fa';

function SettingsModal({ isOpen, onClose, workDuration, breakDuration, longBreakDuration, sessionsBeforeLongBreak, onWorkDurationChange, onBreakDurationChange, onLongBreakDurationChange, onSessionsBeforeLongBreakChange }) {
  const [localWorkDuration, setLocalWorkDuration] = useState(workDuration);
  const [localBreakDuration, setLocalBreakDuration] = useState(breakDuration);
  const [localLongBreakDuration, setLocalLongBreakDuration] = useState(longBreakDuration);
  const [localSessionsBeforeLongBreak, setLocalSessionsBeforeLongBreak] = useState(sessionsBeforeLongBreak);

  useEffect(() => {
    setLocalWorkDuration(workDuration);
    setLocalBreakDuration(breakDuration);
    setLocalLongBreakDuration(longBreakDuration);
    setLocalSessionsBeforeLongBreak(sessionsBeforeLongBreak);
  }, [workDuration, breakDuration, longBreakDuration, sessionsBeforeLongBreak]);

  const handleWorkDurationChange = (e) => {
    const value = Math.max(1, Math.floor(Number(e.target.value)));
    setLocalWorkDuration(value);
  };

  const handleBreakDurationChange = (e) => {
    const value = Math.max(1, Math.floor(Number(e.target.value)));
    setLocalBreakDuration(value);
  };

  const handleLongBreakDurationChange = (e) => {
    const value = Math.max(1, Math.floor(Number(e.target.value)));
    setLocalLongBreakDuration(value);
  };

  const handleSessionsBeforeLongBreakChange = (e) => {
    const value = Math.max(1, Math.floor(Number(e.target.value)));
    setLocalSessionsBeforeLongBreak(value);
  };

  const handleSave = () => {
    onWorkDurationChange(localWorkDuration);
    onBreakDurationChange(localBreakDuration);
    onLongBreakDurationChange(localLongBreakDuration);
    onSessionsBeforeLongBreakChange(localSessionsBeforeLongBreak);
    onClose();
  };

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
                value={localWorkDuration}
                onChange={handleWorkDurationChange}
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
                value={localBreakDuration}
                onChange={handleBreakDurationChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="longBreakDuration" className="block text-sm font-medium text-gray-700">
                Long Break Duration (minutes):
              </label>
              <input
                type="number"
                id="longBreakDuration"
                value={localLongBreakDuration}
                onChange={handleLongBreakDurationChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="sessionsBeforeLongBreak" className="block text-sm font-medium text-gray-700">
                Sessions Before Long Break:
              </label>
              <input
                type="number"
                id="sessionsBeforeLongBreak"
                value={localSessionsBeforeLongBreak}
                onChange={handleSessionsBeforeLongBreakChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                min="1"
              />
            </div>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="save-btn"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsButton({ onClick }) {
  return (
    <button
      className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
      onClick={onClick}
    >
      <FaCog className="mr-2" />
      <span>Settings</span>
    </button>
  );
}

export default SettingsModal;