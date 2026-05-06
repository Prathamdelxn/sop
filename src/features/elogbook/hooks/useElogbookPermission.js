'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { migrateLegacyPermissions, FEATURE_PERMISSIONS } from '@/utils/featurePermissions';

/**
 * Hook for elogbook permission checking.
 * Extracts the duplicated permission pattern from all elogbook pages.
 *
 * @param {string} requiredPermission - e.g. 'Bucket Execution', 'Quality Check'
 * @returns {{ userData, userTasks, isAllowed, isLoading }}
 */
export function useElogbookPermission(requiredPermission) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userdata = localStorage.getItem('user');
    if (userdata) {
      const parsedUser = JSON.parse(userdata);
      setUserData(parsedUser);

      const tasks = migrateLegacyPermissions(parsedUser.task || []);
      setUserTasks(tasks);

      // Permission Check
      if (
        requiredPermission &&
        parsedUser.role !== 'company-admin' &&
        parsedUser.role !== 'super-manager' &&
        parsedUser.role !== 'plant-head'
      ) {
        if (!tasks.includes(requiredPermission)) {
          router.replace('/dashboard/elogbook');
          return;
        }
      }
    }
    setIsLoading(false);
  }, [requiredPermission, router]);

  const hasPermission = (permission) => {
    if (!userData) return false;
    if (userData.role === 'company-admin' || userData.role === 'super-manager' || userData.role === 'plant-head') return true;
    return userTasks.includes(permission);
  };

  return {
    userData,
    userTasks,
    hasPermission,
    isLoading,
  };
}
