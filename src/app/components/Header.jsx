"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeModule, setActiveModule] = useState('');

    // Mock user data
    const currentUser = {
        name: "Pratham N",
        role: "Operator",
        initials: "PN",
        pendingApprovals: 3,
        overdueTasks: 1
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // System modules with access control
    const modules = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            roles: ['Operator', 'Supervisor', 'QA', 'Admin']
        },
        {
            name: 'Equipment',
            path: '/equipment',
            roles: ['Operator', 'Supervisor', 'Admin'],
            subItems: [
                { name: 'Master List', path: '/equipment/list' },
                { name: 'Add New', path: '/equipment/add' },
                { name: 'Status Labels', path: '/equipment/labels' }
            ]
        },
        {
            name: 'SOP Library',
            path: '/sop-library',
            roles: ['Supervisor', 'QA', 'Admin'],
            subItems: [
                { name: 'Type A SOPs', path: '/sop-library/type-a' },
                { name: 'Type B SOPs', path: '/sop-library/type-b' },
                { name: 'Templates', path: '/sop-library/templates' }
            ]
        },
        {
            name: 'Checklists',
            path: '/checklists',
            roles: ['Operator', 'Supervisor'],
            subItems: [
                { name: 'My Tasks', path: '/checklists/my-tasks' },
                { name: 'All Checklists', path: '/checklists/all' }
            ]
        },
        {
            name: 'Approvals',
            path: '/approvals',
            roles: ['Supervisor', 'QA'],
            subItems: [
                { name: 'Pending', path: '/approvals/pending' },
                { name: 'History', path: '/approvals/history' }
            ]
        },
        {
            name: 'Audit Trail',
            path: '/audit',
            roles: ['QA', 'Admin'],
            subItems: [
                { name: 'SOP Compliance', path: '/audit/sop-compliance' },
                { name: 'Equipment Logs', path: '/audit/equipment-logs' },
                { name: 'Export Reports', path: '/audit/export' }
            ]
        },
        {
            name: 'Admin',
            path: '/admin',
            roles: ['Admin'],
            subItems: [
                { name: 'User Management', path: '/admin/users' },
                { name: 'Role Configuration', path: '/admin/roles' },
                { name: 'System Settings', path: '/admin/settings' }
            ]
        }
    ];

    const filteredModules = modules.filter(module =>
        module.roles.includes(currentUser.role)
    );

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-2 border-b border-blue-50'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-12">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/dashboard" className="flex items-center">
                            <div className="h-12 flex items-center">
                                <img
                                    src="/Images/logo%20header.png"
                                    alt="Zydus Logo"
                                    className="h-full object-contain"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Without + icons */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {filteredModules.map((module) => (
                            <div key={module.name} className="relative group">
                                <Link
                                    href={module.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeModule === module.path.split('/')[1]
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                                >
                                    {module.name}
                                    {module.subItems && (
                                        <svg className="ml-1 h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </Link>

                                {/* Dropdown for sub-items */}
                                {module.subItems && (
                                    <div className="absolute left-0 mt-1 w-56 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        {module.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.name}
                                                href={subItem.path}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* User Controls */}
                    <div className="flex items-center space-x-3">
                        {/* Notifications */}
                        <Link href="/notifications" className="p-1 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 relative">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {currentUser.pendingApprovals > 0 && (
                                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center">
                                    {currentUser.pendingApprovals}
                                </span>
                            )}
                        </Link>

                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center space-x-1 focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-800">{currentUser.initials}</span>
                                </div>
                                <svg className={`h-4 w-4 text-gray-500 transition-transform ${userDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {userDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{currentUser.role.toLowerCase()}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        Your Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-t border-gray-100"
                                        onClick={() => {
                                            // Add logout logic here
                                            setUserDropdownOpen(false);
                                        }}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
                        >
                            {mobileMenuOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {filteredModules.map((module) => (
                            <div key={module.name}>
                                <Link
                                    href={module.path}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        activeModule === module.path.split('/')[1]
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {module.name}
                                </Link>
                                {module.subItems && (
                                    <div className="pl-4">
                                        {module.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.name}
                                                href={subItem.path}
                                                className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* ... rest of mobile menu remains unchanged ... */}
                </div>
            )}
        </header>
    );
};

export default Header;