"use client"
import React, { useState } from 'react';

const Footer = () => {
    const [systemStatus, setSystemStatus] = useState('operational');
    const [pendingApprovals, setPendingApprovals] = useState(3);
    const [overdueSOPs, setOverdueSOPs] = useState(2);
    const [lastAuditAction, setLastAuditAction] = useState('SOP #PH-2023-456 completed by Pratham N.');
    const [currentTime, setCurrentTime] = useState('');

    // Set current time on client-side only
    React.useEffect(() => {
        setCurrentTime(new Date().toLocaleString());
    }, []);

    // SVG Icons as components
    const ZapIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );

    const BellIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );

    const DatabaseIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
    );

    const ShieldIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );

    const UsersIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    const SettingsIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const ActivityIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );

    const ExternalLinkIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    );

    const ChevronRightIcon = () => (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );

    const CheckCircleIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const AlertCircleIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const ClockIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const DownloadIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    );

    const BarChart3Icon = () => (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );

    const GlobeIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    );

    const SmartphoneIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    );

    const quickLinks = [
        { name: 'API Documentation', href: '/api-docs', icon: ExternalLinkIcon },
        { name: 'Employee Data Import', href: '/employee-data-import', icon: UsersIcon },
        { name: 'Equipment Integration', href: '/equipment-integration', icon: SettingsIcon },
        { name: 'System Health', href: '/system-health', icon: ActivityIcon }
    ];

    const integrationFeatures = [
        {
            icon: UsersIcon,
            title: 'Employee Data',
            description: 'API/CSV import for role management',
            status: 'active'
        },
        {
            icon: () => <DatabaseIcon />,
            title: 'Equipment Data',
            description: 'Barcode scan or API integration',
            status: 'active'
        },
        {
            icon: BarChart3Icon,
            title: 'Analytics',
            description: 'Real-time reporting dashboard',
            status: 'beta'
        }
    ];

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                }}></div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">

                    {/* System Status & Quick Links */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                                    <ZapIcon />
                                </div>
                                <h3 className="text-lg font-semibold text-white">System Status</h3>
                            </div>

                            <div className="mb-6">
                                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${systemStatus === 'operational'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    }`}>
                                    {systemStatus === 'operational' ? (
                                        <CheckCircleIcon />
                                    ) : (
                                        <AlertCircleIcon />
                                    )}
                                    <span className="ml-2">{systemStatus.toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className="flex items-center text-slate-300 hover:text-white transition-colors duration-200 group"
                                    >
                                        <link.icon />
                                        <span className="text-sm ml-3">{link.name}</span>
                                        <ChevronRightIcon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-amber-500/20 rounded-lg mr-3">
                                    <BellIcon />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                                    <span className="text-sm text-slate-300">Pending Approvals</span>
                                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        {pendingApprovals}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                                    <span className="text-sm text-slate-300">Overdue SOPs</span>
                                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        {overdueSOPs}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center group">
                                <SettingsIcon />
                                <span className="ml-2">Configure Alerts</span>
                            </button>
                        </div>
                    </div>

                    {/* Data Integration */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                                    <DatabaseIcon />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Data Integration</h3>
                            </div>

                            <div className="space-y-4">
                                {integrationFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-start p-3 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors">
                                        <div className="p-1.5 bg-slate-600/50 rounded-md mr-3 mt-0.5">
                                            <feature.icon />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center mb-1">
                                                <p className="font-medium text-white text-sm">{feature.title}</p>
                                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${feature.status === 'active'
                                                        ? 'bg-emerald-500/20 text-emerald-300'
                                                        : 'bg-blue-500/20 text-blue-300'
                                                    }`}>
                                                    {feature.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 text-xs">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Audit Trail */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-emerald-500/20 rounded-lg mr-3">
                                    <ShieldIcon />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Audit Trail</h3>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-start p-3 bg-slate-700/20 rounded-lg">
                                    <ClockIcon />
                                    <div className="ml-3">
                                        <p className="text-sm text-white font-medium">Last Action</p>
                                        <p className="text-xs text-slate-300 mt-1">{lastAuditAction}</p>
                                        <p className="text-xs text-slate-400 mt-1">{currentTime || 'Loading...'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <button className="flex items-center justify-between text-blue-300 hover:text-blue-200 text-sm p-2 rounded-lg hover:bg-slate-700/30 transition-all group">
                                    <span>View Full Log</span>
                                    <ExternalLinkIcon />
                                </button>

                                <div className="flex items-center space-x-2">
                                    <select className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white text-sm rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option>Export Format</option>
                                        <option>PDF</option>
                                        <option>Excel</option>
                                        <option>CSV</option>
                                    </select>
                                    <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                        <DownloadIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
               
            </div>
        </footer>
    );
};

export default Footer;