"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your password reset logic here
    console.log('Password reset requested for:', email);
    setMessage('Password reset link has been sent to your email');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Images/Backg.png')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold text-center mb-6">Forgot Password</h1>
        
        {message ? (
          <div className="text-center py-4">
            <p className="text-green-600 mb-4">{message}</p>
            <Link href="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  required
                />
              </div>
              
              <div className="flex justify-between mt-8">
                <Link href="/login" className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-center">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Reset Password
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <span className="text-sm">Remember your password? </span>
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}