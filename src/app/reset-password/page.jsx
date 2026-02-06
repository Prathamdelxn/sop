// "use client";
// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { FiLock, FiCheckCircle, FiMail } from 'react-icons/fi';

// export default function ResetPasswordPage() {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [tokenValid, setTokenValid] = useState(null);
//   const [email, setEmail] = useState('');
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         const response = await fetch('/api/auth/verify-reset-token', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ token }),
//         });

//         const data = await response.json();
        
//         if (!response.ok) {
//           throw new Error(data.message || 'Invalid or expired token');
//         }

//         setEmail(data.email);
//         setTokenValid(true);
//       } catch (err) {
//         setError(err.message);
//         setTokenValid(false);
//       }
//     };

//     if (token) {
//       verifyToken();
//     } else {
//       setError('No token provided');
//       setTokenValid(false);
//     }
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (password.length < 8) {
//       setError('Password must be at least 8 characters');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/auth/reset-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ token, password }),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to reset password');
//       }

//       setSuccess('Password reset successfully! Check your email for the new credentials.');
//       setTimeout(() => {
//         router.push(data.userType === 'superAdmin' ? '/new-login' : '/new-login');
//       }, 5000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (tokenValid === null) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">Verifying token...</div>
//       </div>
//     );
//   }

//   if (!tokenValid) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center text-red-500 max-w-md p-6">
//           <h2 className="text-2xl font-bold mb-4">Invalid Token</h2>
//           <p>{error || 'The password reset link is invalid or has expired.'}</p>
//           <button
//             onClick={() => router.push('/forgot-password')}
//             className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium"
//           >
//             Request a new reset link
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
//           <div className="flex items-center justify-center text-gray-600">
//             <FiMail className="mr-2" />
//             <span>{email}</span>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
//             <FiCheckCircle className="mr-2" />
//             {success}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiLock className="text-gray-400" />
//               </div>
//               <input
//                 type="password"
//                 placeholder="New Password (min 8 characters)"
//                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 minLength="8"
//               />
//             </div>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiLock className="text-gray-400" />
//               </div>
//               <input
//                 type="password"
//                 placeholder="Confirm New Password"
//                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 minLength="8"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center"
//           >
//             {loading ? (
//               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//             ) : null}
//             {loading ? 'Processing...' : 'Reset Password'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiLock, FiCheckCircle, FiMail } from 'react-icons/fi';

function ResetPasswordComponent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [email, setEmail] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify-reset-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Invalid or expired token');
        }

        setEmail(data.email);
        setTokenValid(true);
      } catch (err) {
        setError(err.message);
        setTokenValid(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setError('No token provided');
      setTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Verifying token...</div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500 max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4">Invalid Token</h2>
          <p>{error || 'The password reset link is invalid or has expired.'}</p>
          <button
            onClick={() => router.push('/forgot-password')}
            className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Request a new reset link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <div className="flex items-center justify-center text-gray-600">
            <FiMail className="mr-2" />
            <span>{email}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FiCheckCircle className="mr-2" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="New Password (min 8 characters)"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
}
