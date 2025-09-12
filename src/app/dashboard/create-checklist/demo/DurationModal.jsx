import React, { useState, useRef, useEffect } from 'react';

const Plus = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const Minus = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>;
const X = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const Clock = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const Camera = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;





const DurationModal = ({
  onClose,
  onSave,
  initialMin = { hours: 0, minutes: 0, seconds: 0 },
  initialMax = { hours: 0, minutes: 0, seconds: 0 }
}) => {
  const [minTime, setMinTime] = useState(initialMin);
  const [maxTime, setMaxTime] = useState(initialMax);
  const [activeInput, setActiveInput] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [hasUserModified, setHasUserModified] = useState(false);

  const validateAndSetTime = (type, field, value) => {
    setHasUserModified(true);
    const digitsOnly = value.replace(/\D/g, '').slice(0, 2);
    let numValue = parseInt(digitsOnly, 10) || 0;

    if (field === 'minutes' || field === 'seconds') {
      numValue = Math.min(59, numValue);
    }

    const setter = type === 'min' ? setMinTime : setMaxTime;
    const otherTime = type === 'min' ? maxTime : minTime;

    setter(prev => {
      const newTime = { ...prev, [field]: numValue };
      const newTotal = newTime.hours * 3600 + newTime.minutes * 60 + newTime.seconds;
      const otherTotal = otherTime.hours * 3600 + otherTime.minutes * 60 + otherTime.seconds;

      if (type === 'min' && newTotal > otherTotal) {
        setMaxTime(newTime);
      }

      return newTime;
    });
  };

  const adjustTime = (type, field, increment) => {
    setHasUserModified(true);
    const current = type === 'min' ? minTime : maxTime;
    const newValue = Math.max(0, current[field] + increment);
    validateAndSetTime(type, field, newValue.toString());
  };

  const handleInputChange = (type, field, e) => {
    validateAndSetTime(type, field, e.target.value);
  };

  const handleFocus = (type, field, e) => {
    setActiveInput(`${type}-${field}`);
    e.target.select();
  };

  const formatDisplayValue = (value) => {
    return String(value).padStart(2, '0');
  };

  const handleSave = () => {
    const minTotal = minTime.hours * 3600 + minTime.minutes * 60 + minTime.seconds;
    const maxTotal = maxTime.hours * 3600 + maxTime.minutes * 60 + maxTime.seconds;

    if (maxTotal < minTotal) {
      setAlertMessage('Maximum duration must be ≥ minimum duration');
      setShowAlert(true);
      return;
    }

    const minTotalMinutes = minTime.hours * 60 + minTime.minutes;
    const maxTotalMinutes = maxTime.hours * 60 + maxTime.minutes;

    onSave({
      minDuration: minTotalMinutes,
      maxDuration: maxTotalMinutes,
      minTime,
      maxTime,
      wasModified: hasUserModified
    });
    onClose();
  };

  const renderTimeField = (type, field) => {
    const currentTime = type === 'min' ? minTime : maxTime;
    const isActive = activeInput === `${type}-${field}`;
    const colorClass = type === 'min' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600';
    const ringColor = type === 'min' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500';

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <button
            onClick={() => adjustTime(type, field, 1)}
            className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 ${colorClass} text-white rounded-full flex items-center justify-center shadow hover:shadow-md active:scale-95`}
          >
            <Plus className="w-2.5 h-2.5" />
          </button>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={isActive ? currentTime[field] : formatDisplayValue(currentTime[field])}
            onChange={(e) => handleInputChange(type, field, e)}
            onFocus={(e) => handleFocus(type, field, e)}
            onBlur={() => setActiveInput(null)}
            className={`w-16 h-16 bg-gray-50 border border-gray-200 rounded-lg text-center text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 ${ringColor}`}
          />

          <button
            onClick={() => adjustTime(type, field, -1)}
            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 ${colorClass} text-white rounded-full flex items-center justify-center shadow hover:shadow-md active:scale-95`}
          >
            <Minus className="w-2.5 h-2.5" />
          </button>
        </div>
        <span className="text-xs mt-4 font-medium text-gray-500 mt-1 uppercase">
          {field.slice(0, 3)}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Set Duration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {showAlert && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {alertMessage}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <h3 className="text-sm font-medium text-gray-700">Minimum Duration</h3>
            </div>

            <div className="flex justify-center gap-3">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <div key={`min-${field}`}>
                  {renderTimeField('min', field)}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-xs text-gray-500">to</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h3 className="text-sm font-medium text-gray-700">Maximum Duration</h3>
            </div>

            <div className="flex justify-center gap-3">
              {['hours', 'minutes', 'seconds'].map((field) => (
                <div key={`max-${field}`}>
                  {renderTimeField('max', field)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DurationModal;