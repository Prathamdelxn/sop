"use client";
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: "Smart Task Builder",
      description: "Create visual work instructions with drag-and-drop interface and multimedia attachments",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Role-Based Access",
      description: "Granular permissions for all stakeholders with customizable dashboards",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Real-Time Tracking",
      description: "Live status updates with automated notifications and escalation paths",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Mobile Optimized",
      description: "Full functionality on any device with offline capability",
      color: "from-green-500 to-green-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Audit Trail",
      description: "Complete digital paper trail with version history and change tracking",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      ),
      title: "Document Management",
      description: "Centralized storage for all attachments with version control",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: "Approval Workflows",
      description: "Configurable validation paths with electronic signatures",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "21 CFR Part 11 Ready",
      description: "Fully compliant electronic records and signatures",
      color: "from-red-500 to-red-600"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full mb-4">
            Enterprise Features
          </span>
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Built for <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Regulated Industries</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools designed specifically for pharmaceutical, food, and chemical manufacturing
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.color}`} />
              
              <div className="relative p-8 h-full flex flex-col">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 bg-gradient-to-br ${feature.color} text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                

              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Integration section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 md:p-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <h3 className="text-2xl font-bold mb-4">Seamless Ecosystem Integration</h3>
              <p className="text-gray-300 mb-6">Connect with your existing quality management systems and enterprise software</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ERP Systems
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  MES Solutions
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  LIMS Platforms
                </li>
              </ul>
            </div>
            <div className="p-10 md:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for Digital Transformation</h3>
              <p className="text-gray-600 mb-6">Our solution scales with your operations and adapts to your specific workflows</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Cloud Deployment</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">On-Premise Option</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Hybrid Model</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">API Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;