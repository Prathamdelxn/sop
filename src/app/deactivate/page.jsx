// app/deactivated/page.jsx
'use client'
import { useRouter } from 'next/navigation';
export default function DeactivatedAccountPage() {
  const router=useRouter();
  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/new-login'); // You can also use replace instead of push
};
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mt-3 text-lg font-medium text-gray-900">
          Account Deactivated
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Your account has been deactivated. If you believe this is an error or
          would like to reactivate your account, please contact our support team.
        </p>
       
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Return to homepage
          </button>
        </div>
      </div>
    </div>
  );
}