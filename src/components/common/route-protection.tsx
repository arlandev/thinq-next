'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserSession, isUserLoggedIn, isSessionExpired } from '@/lib/session';

interface RouteProtectionProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function RouteProtection({ 
  children, 
  requiredRole, 
  redirectTo = '/' 
}: RouteProtectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is logged in and session is valid
      if (!isUserLoggedIn() || isSessionExpired()) {
        console.log('User not logged in or session expired, redirecting...');
        router.push(redirectTo);
        return;
      }

      const session = getUserSession();
      if (!session) {
        router.push(redirectTo);
        return;
      }

      // Check role-based access if required
      if (requiredRole && session.user_role.toLowerCase() !== requiredRole.toLowerCase()) {
        console.log(`Access denied. Required role: ${requiredRole}, User role: ${session.user_role}`);
        // Redirect to appropriate page based on user's actual role
        const userRole = session.user_role.toLowerCase();
        switch (userRole) {
          case 'admin':
            router.push('/admin');
            break;
          case 'inquirer':
            router.push('/inquirer');
            break;
          case 'personnel':
            router.push('/personnel');
            break;
          case 'dispatcher':
            router.push('/dispatcher');
            break;
          default:
            router.push(redirectTo);
        }
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [requiredRole, redirectTo, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Only render children if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Return null if not authorized (redirect will happen)
  return null;
}
