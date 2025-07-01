
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Headers';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('user');

    if (!data) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(data);
      if (userData?.role === 'admin') {
        setIsAuthorized(true);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Invalid user data:', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!isAuthorized) {
    return null; // Don't render anything if unauthorized (redirecting)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
