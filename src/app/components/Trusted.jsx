"use client";
import React from 'react';
import { Building2, Pill, UtensilsCrossed, FlaskConical, Factory } from 'lucide-react';

const TrustedBySection = () => {
  const industries = [
    {
      icon: <Pill className="h-12 w-12" />,
      name: "Pharmaceutical",
      description: "Leading pharma companies trust our validation process",
      color: "text-blue-600"
    },
    {
      icon: <UtensilsCrossed className="h-12 w-12" />,
      name: "Food Processing",
      description: "Food safety and hygiene compliance made simple",
      color: "text-green-600"
    },
    {
      icon: <FlaskConical className="h-12 w-12" />,
      name: "Chemical Manufacturing",
      description: "Streamlined cleaning validation for chemical plants",
      color: "text-purple-600"
    },
    {
      icon: <Factory className="h-12 w-12" />,
      name: "Industrial Manufacturing",
      description: "Complete compliance for manufacturing facilities",
      color: "text-orange-600"
    }
  ];

  const trustedBadges = [
    "FDA Compliant",
    "GMP Certified",
    "ISO 9001:2015",
    "21 CFR Part 11",
    "GAMP 5 Guidelines"
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading Industries Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From pharmaceutical giants to food processing facilities, our cleaning validation software 
            ensures compliance and efficiency across critical manufacturing sectors.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {industries.map((industry, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center group cursor-pointer"
            >
              <div className={`${industry.color} mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                {industry.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {industry.name}
              </h3>
              <p className="text-sm text-gray-600">
                {industry.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Manufacturing Sites</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Tasks Validated Daily</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Compliance Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Expert Support</div>
            </div>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Regulatory Compliance & Standards
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {trustedBadges.map((badge, index) => (
              <div 
                key={index}
                className="px-6 py-3 bg-gradient-to-r from-slate-900 via-slate-750 to-slate-800 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                ✓ {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Client Logos Placeholder */}
        
      </div>
    </div>
  );
};

export default TrustedBySection;