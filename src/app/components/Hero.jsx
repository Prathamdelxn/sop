"use client";
import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Subtle particle animation background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24">
        <div className="text-center">
          {/* Pre-headline */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 mb-6">
            <span className="text-sm font-medium text-cyan-300">GMP Compliance Platform</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="block">Modern Cleaning Validation</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Without the Paperwork</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Digitally transform your equipment cleaning processes with automated workflows, real-time tracking, and full audit compliance for pharmaceutical and food manufacturing.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button className="group relative px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:scale-[1.02] flex items-center">
              Request Demo
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group relative px-8 py-3.5 bg-transparent text-white font-medium rounded-lg border border-slate-600 hover:border-slate-500 transition-all duration-300 flex items-center">
              <Play className="mr-2 h-4 w-4 text-cyan-300" />
              Watch Overview
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="inline-flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center text-slate-300">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              21 CFR Part 11 Compliant
            </div>
            <div className="flex items-center text-slate-300">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              EU Annex 11 Ready
            </div>
            <div className="flex items-center text-slate-300">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              Audit-Ready Documentation
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Transition */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div> */}
    </div>
  );
};

export default HeroSection;