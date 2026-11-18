import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

/**
 * ProtectedRoute Component (PRD Acceptance Rule 5 & 6)
 * - Checks user authentication status.
 * - If unauthenticated, preserves the target destination URL in AuthContext & sessionStorage.
 * - Redirects to /login gracefully with an alert notice.
 * - If authenticated, renders the protected child views.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, saveIntendedDestination } = useAuth();
  const { toastInfo } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      const fullPath = `${location.pathname}${location.search}`;
      saveIntendedDestination(fullPath);
      toastInfo('Sign in required', 'Please sign in to access this protected area. We have preserved your destination.');
    }
  }, [isAuthenticated, location, saveIntendedDestination, toastInfo]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
