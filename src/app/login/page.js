"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log('Login form submitted:', formData);
    };

    return (
        <div
            className="pt-15 min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: "url('/Images/Backg.png')" }}
        >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-sm border border-white/20">
                <div className="p-6">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
                        <p className="text-gray-500 text-sm mt-1">Login to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </label>
                            </div>
                            <Link href="/forgetpassword" className="text-sm text-blue-500 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-sm"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Don't have an account? </span>
                        <Link href="/signup" className="text-blue-500 font-medium hover:underline">
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}