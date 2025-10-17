'use client';

import React, { useEffect, useState } from 'react';
import { X, Lock, XCircle } from 'lucide-react';

const PasswordModal = ({ onClose, onConfirm, loading, actionType = 'approve' }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userdata, setUserData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      try {
        setUserData(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Failed to load user data');
      }
    }
  }, []);

  const getActionDetails = () => {
    if (actionType === 'reject') {
      return {
        title: 'Confirm Rejection',
        description: 'Please enter your password to confirm rejection',
        icon: <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />,
        buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-600',
        buttonText: 'Confirm Rejection'
      };
    }
    return {
      title: 'Confirm Approval',
      description: 'Please enter your password to confirm approval',
      icon: <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />,
      buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600',
      buttonText: 'Confirm Approval'
    };
  };

  const verifyPassword = async (password) => {
    try {
      if (!userdata?.id) {
        throw new Error('User data not available');
      }

      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userdata.id,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password verification failed');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Password verification error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    if (!userdata?.id) {
      setError('User data not available. Please refresh the page.');
      return;
    }

    try {
      setError('');
      const isPasswordValid = await verifyPassword(password);
      
      if (isPasswordValid) {
        onConfirm(password);
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'Failed to verify password. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const actionDetails = getActionDetails();

  if (!userdata) {
    return (
      <div className="fixed pl-64 inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-200">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed pl-64 inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-200">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="text-center">
          {actionDetails.icon}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {actionDetails.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {actionDetails.description}
          </p>

          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 text-left">{error}</p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${actionDetails.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center min-w-[140px]`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                actionDetails.buttonText
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PasswordModal;