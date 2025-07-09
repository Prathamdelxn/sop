
// "use client";
// import React, { useState } from 'react';
// import { ArrowRight, User, Lock, Shield, CheckCircle, Settings, Eye, EyeOff, Beaker, ClipboardCheck } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import { useAuth } from '@/context/AuthContext';
// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const { login } = useAuth();
//   const [password, setPassword] = useState('');
//   const [selectedRole, setSelectedRole] = useState('operator');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const roles = [
//     { id: 'admin', name: 'Admin', icon: Shield, color: 'bg-red-500 hover:bg-red-600' },
//     { id: 'operator', name: 'Operator', icon: User, color: 'bg-blue-500 hover:bg-blue-600' },
//     { id: 'supervisor', name: 'Supervisor', icon: CheckCircle, color: 'bg-green-500 hover:bg-green-600' },
//     { id: 'qa', name: 'QA', icon: ClipboardCheck, color: 'bg-purple-500 hover:bg-purple-600' },
//     { id: 'equipment_admin', name: 'Equipment', icon: Settings, color: 'bg-orange-500 hover:bg-orange-600' }
//   ];

// const handleLogin = async () => {
//   try {
//     setIsLoading(true);

//     const response = await fetch(`/api/${selectedRole}/auth/login`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();
// console.log(data);
//     if (!response.ok) throw new Error(data.message || 'Login failed');

//  login(data.token,data.user)
//     toast.success('Login successful!');
//     console.log(selectedRole)
//     if(selectedRole=="admin"){
//       router.push('/admin');
//     }
//     else if(selectedRole=="supervisor"){
//       router.push('/supervisor-dashboard');
//     }
   
//   } catch (error) {
//     toast.error(error.message);
//     console.error('Login error:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };


//   return (
//     <div className="min-h-screen flex">
//       {/* Left Side - Company Branding */}
//       <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
//         {/* Subtle background pattern */}
//         <div className="absolute inset-0 opacity-5">
//           <div className="absolute inset-0" style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
//           }}></div>
//         </div>

//         <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
//           {/* Company Logo/Icon */}
//           <div className="mb-12">
//             <div className="relative">
//               {/* Glow effect */}
//               <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl"></div>
//               {/* Main logo container */}
//               <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl border border-blue-400/20">
//                 <Beaker className="w-16 h-16 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Company Info */}
//           <div className="max-w-md">
//             <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
//               Manufacturing Execution System
//               <span className="text-blue-400">Pro</span>
//             </h1>
//             <div className="w-16 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
//             <p className="text-xl text-slate-300 mb-8 leading-relaxed">
//               Industrial Cleaning Validation System
//             </p>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               GMP compliant digital workflow for pharmaceutical and food manufacturing excellence. 
//               Streamline your validation processes with our comprehensive platform.
//             </p>
//           </div>

//           {/* Features */}
//           {/* <div className="mt-12 grid grid-cols-1 gap-4 w-full max-w-sm">
//             {[
//               { icon: Shield, text: 'GMP Compliant' },
//               { icon: ClipboardCheck, text: 'Digital Workflows' },
//               { icon: CheckCircle, text: 'Real-time Monitoring' }
//             ].map((feature, index) => (
//               <div key={index} className="flex items-center space-x-3 text-slate-300 group hover:text-white transition-colors">
//                 <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
//                   <feature.icon className="w-4 h-4" />
//                 </div>
//                 <span className="text-sm font-medium">{feature.text}</span>
//               </div>
//             ))}
//           </div> */}
//         </div>

//         {/* Bottom decoration */}
//         <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
//       </div>

//       {/* Right Side - Login Form */}
//      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
//             <p className="text-gray-600">Sign in to access your dashboard</p>
//           </div>

//           {/* Role Selection */}
//           <div className="mb-8">
//             <label className="block text-sm font-semibold text-gray-700 mb-4">Select Your Role</label>
//             <div className="grid grid-cols-5 gap-2">
//               {roles.map((role) => {
//                 const IconComponent = role.icon;
//                 return (
//                   <button
//                     key={role.id}
//                     onClick={() => setSelectedRole(role.id)}
//                     className={`group relative p-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
//                       selectedRole === role.id
//                         ? `${role.color.split(' ')[0]} text-white shadow-lg`
//                         : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
//                     }`}
//                   >
//                     <IconComponent className="w-5 h-5 mx-auto mb-1" />
//                     <div className="text-xs font-medium">{role.name}</div>
//                     {selectedRole === role.id && (
//                       <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500 ring-opacity-50"></div>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Login Form */}
//           <div className="space-y-6">
//             {/* Email Input */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                 </div>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                 </div>
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               onClick={handleLogin}
//               disabled={isLoading}
//               className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                 isLoading 
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
//               }`}
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
//                   Signing In...
//                 </>
//               ) : (
//                 <>
//                   <span>Sign In to Dashboard</span>
//                   <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


"use client";
import React, { useState } from 'react';
import {
  ArrowRight,
  User,
  Lock,
  Shield,
  CheckCircle,
  Settings,
  Eye,
  EyeOff,
  Beaker,
  ClipboardCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('operator');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const roles = [
    { id: 'admin', name: 'Admin', icon: Shield, color: 'bg-red-500 hover:bg-red-600' },
    { id: 'facility-admin', name: 'Facility', icon: Settings, color: 'bg-teal-500 hover:bg-teal-600' },
    { id: 'operator', name: 'Operator', icon: User, color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'supervisor', name: 'Supervisor', icon: CheckCircle, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'qa', name: 'QA', icon: ClipboardCheck, color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'equipment_admin', name: 'Equipment', icon: Settings, color: 'bg-orange-500 hover:bg-orange-600' },
  
  ];
  

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/${selectedRole}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) throw new Error(data.message || 'Login failed');

      login(data.token, data.user);
      toast.success('Login successful!');

      if (selectedRole === "admin") {
        router.push('/admin');
      } else if (selectedRole === "supervisor") {
        router.push('/supervisor-dashboard');
      } else if (selectedRole === "operator") {
        router.push('/operator-dashboard');
      } 
      else if (selectedRole === "facility-admin") {
        router.push('/facility-dashboard');
      }

    } catch (error) {
      toast.error(error.message);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="mb-12">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl border border-blue-400/20">
                <Beaker className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Manufacturing Execution System <span className="text-blue-400">Pro</span>
            </h1>
            <div className="w-16 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Industrial Cleaning Validation System
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              GMP compliant digital workflow for pharmaceutical and food manufacturing excellence. 
              Streamline your validation processes with our comprehensive platform.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Select Your Role</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {roles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`group relative p-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      selectedRole === role.id
                        ? `${role.color.split(' ')[0]} text-white shadow-lg`
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{role.name}</div>
                    {selectedRole === role.id && (
                      <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500 ring-opacity-50"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Signing In...
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
