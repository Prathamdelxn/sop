"use client";
import React, { useState } from 'react';
import { 
  UserCog, 
  Wrench, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  FileText,
  Camera,
  ClipboardCheck,
  Award
} from 'lucide-react';

const WorkflowSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
  {
    id: 1,
    icon: <UserCog className="h-8 w-8" />,
    title: "Admin Creates Tasks",
    role: "Admin",
    description: "Create comprehensive cleaning task forms with detailed descriptions, images, and step-by-step instructions for each piece of equipment. Define protocols and set quality standards.",
    features: [
      "Task form builder with drag-and-drop interface",
      "Image and document uploads for visual guidance",
      "Multi-step task breakdown and sequencing",
      "Equipment-specific cleaning protocols and standards"
    ],
    bgColor: "bg-blue-500",
    borderColor: "border-blue-500",
    textColor: "text-blue-600"
  },
  {
    id: 2,
    icon: <Wrench className="h-8 w-8" />,
    title: "Operator Executes",
    role: "Operator",
    description: "View assigned tasks, follow step-by-step cleaning procedures, and submit completion reports with photo evidence and detailed comments. Track progress in real-time.",
    features: [
      "Mobile-friendly task interface with offline support",
      "Real-time photo capture and upload functionality",
      "Progress tracking for each subtask and milestone",
      "Voice notes and text comments for documentation"
    ],
    bgColor: "bg-green-500",
    borderColor: "border-green-500",
    textColor: "text-green-600"
  },
  {
    id: 3,
    icon: <CheckCircle2 className="h-8 w-8" />,
    title: "Tester Validates",
    role: "Tester",
    description: "Review completed tasks, verify compliance with cleaning protocols, and either approve or return tasks with detailed feedback. Ensure quality standards are met.",
    features: [
      "Comprehensive task review dashboard and analytics",
      "Photo comparison tools with before/after views",
      "Rejection workflow with specific feedback options",
      "Compliance checklist verification and reporting"
    ],
    bgColor: "bg-purple-500",
    borderColor: "border-purple-500",
    textColor: "text-purple-600"
  },
  {
    id: 4,
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "QA Final Approval",
    role: "QA/Supervisor",
    description: "Final quality assurance review, regulatory compliance verification, and task archival for audit trails and documentation. Maintain comprehensive records.",
    features: [
      "Final approval workflow with digital signatures",
      "Regulatory compliance verification and reporting",
      "Comprehensive audit trail generation and storage",
      "Secure task archival with search capabilities"
    ],
    bgColor: "bg-orange-500",
    borderColor: "border-orange-500",
    textColor: "text-orange-600"
  }
];

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <span className="text-blue-700 text-sm font-medium">🔄 Streamlined Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How Our Cleaning Validation 
            <span className="text-blue-600 block">Process Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From task creation to final approval, our platform ensures every step of your cleaning validation process is tracked, verified, and compliant.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 to-orange-500 transition-all duration-1000"
              style={{ width: `${((activeStep + 1) / workflowSteps.length) * 100}%` }}
            ></div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  activeStep === index ? 'transform scale-105' : ''
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Step Card */}
                <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 ${
                  activeStep === index ? step.borderColor : 'border-gray-200'
                } hover:shadow-xl`}>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center text-white transition-all duration-300`}>
                      {step.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-300">
                      0{step.id}
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                    activeStep === index 
                      ? `${step.textColor} bg-opacity-10` 
                      : 'text-gray-500 bg-gray-100'
                  }`} style={{
                    backgroundColor: activeStep === index ? `${step.bgColor.replace('bg-', '').replace('-500', '')}20` : undefined
                  }}>
                    {step.role}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full ${step.bgColor} mt-2 mr-2 flex-shrink-0`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow (Desktop only) */}
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed View for Active Step */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${workflowSteps[activeStep].bgColor} rounded-full flex items-center justify-center text-white mr-4`}>
                  {workflowSteps[activeStep].icon}
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">
                    Step {activeStep + 1} - {workflowSteps[activeStep].role}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {workflowSteps[activeStep].title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-700 text-lg mb-6">
                {workflowSteps[activeStep].description}
              </p>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Digital Documentation</span>
                </div>
                <div className="flex items-center">
                  <Camera className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Photo Evidence</span>
                </div>
                <div className="flex items-center">
                  <ClipboardCheck className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">Real-time Tracking</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-sm text-gray-600">Compliance Ready</span>
                </div>
              </div>
            </div>

            {/* Visual Mockup */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">
                    {workflowSteps[activeStep].role} Dashboard
                  </h4>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                  <div className="flex space-x-2 mt-4">
                    <div className={`h-8 ${workflowSteps[activeStep].bgColor} rounded w-20 flex items-center justify-center`}>
                      <span className="text-white text-xs">Action</span>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            {workflowSteps.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === index ? workflowSteps[index].bgColor : 'bg-gray-300'
                }`}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSection;