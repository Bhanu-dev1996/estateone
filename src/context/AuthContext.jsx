import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import {
  checkPasswordSecurity,
  AUTH_SECURITY_CONFIG,
  MASKED_AUTH_MESSAGES
} from '../lib/authSecurity';
import { resolvePostAuthDestination } from '../lib/postAuthDestination';

const AuthContext = createContext(null);

// Sample accounts for demos (password: Password@123). All users share one member type.
const SEEDED_USERS = [
  {
    id: 'usr-demo-01',
    name: 'Ananya Rao',
    email: 'demo1@estateone.in',
    phone: '+91 98201 11223',
    password: 'Password@123',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-demo-02',
    name: 'Rajesh Kumar',
    email: 'demo2@estateone.in',
    phone: '+91 98450 33445',
    password: 'Password@123',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-demo-03',
    name: 'Vikram Malhotra',
    email: 'demo3@estateone.in',
    phone: '+91 98110 55667',
    password: 'Password@123',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  }
];

const LEGACY_DEMO_ACCOUNTS = [
  { ...SEEDED_USERS[0], id: 'usr-buyer-01', email: 'buyer@estateone.in' },
  { ...SEEDED_USERS[1], id: 'usr-owner-02', email: 'owner@estateone.in' },
  { ...SEEDED_USERS[2], id: 'usr-agent-03', email: 'agent@estateone.in' }
];

function loadRegisteredUsers() {
  const seedPool = [...SEEDED_USERS, ...LEGACY_DEMO_ACCOUNTS];
  try {
    const stored = localStorage.getItem('estateone_registered_users');
    if (!stored) {
      localStorage.setItem('estateone_registered_users', JSON.stringify(seedPool));
      return seedPool;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return seedPool;

    const normalized = parsed.map((user) => ({
      ...user,
      role: 'Member'
    }));

    seedPool.forEach((seed) => {
      const email = seed.email?.toLowerCase();
      const exists = normalized.some((u) => u.email?.toLowerCase() === email);
      if (!exists) normalized.push(seed);
    });

    return normalized;
  } catch {
    return seedPool;
  }
}

export function AuthProvider({ children }) {
  const { toastSuccess, toastInfo, toastWarning, toastError } = useToast();

  // 1. Registered Users Database (Persistent in localStorage)
  const [registeredUsers, setRegisteredUsers] = useState(loadRegisteredUsers);

  // 2. Active Authenticated User & Session Expiry
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_auth_user');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Validate session expiry
      if (parsed.sessionExpiry && Date.now() > parsed.sessionExpiry) {
        localStorage.removeItem('estateone_auth_user');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // 3. Intended Destination Preservation
  const [intendedDestination, setIntendedDestination] = useState(() => {
    try {
      return sessionStorage.getItem('estateone_intended_destination') || null;
    } catch {
      return null;
    }
  });

  // 4. Session Expired Notice Flag (for login banner display)
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

  // 5. Pending Registration & OTP State
  const [pendingRegistration, setPendingRegistration] = useState(() => {
    try {
      const stored = sessionStorage.getItem('estateone_pending_registration');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync active user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('estateone_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('estateone_auth_user');
      }
    } catch {
      // storage unavailable
    }
  }, [user]);

  // Sync registered users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('estateone_registered_users', JSON.stringify(registeredUsers));
    } catch {}
  }, [registeredUsers]);

  // Sync pending registration to sessionStorage
  useEffect(() => {
    try {
      if (pendingRegistration) {
        sessionStorage.setItem('estateone_pending_registration', JSON.stringify(pendingRegistration));
      } else {
        sessionStorage.removeItem('estateone_pending_registration');
      }
    } catch {}
  }, [pendingRegistration]);

  // Save / Clear Intended Destination (PRD Acceptance Rule 6)
  const saveIntendedDestination = useCallback((path) => {
    const normalized = path ? resolvePostAuthDestination(path) : null;
    setIntendedDestination(normalized);
    try {
      if (normalized) {
        sessionStorage.setItem('estateone_intended_destination', normalized);
      } else {
        sessionStorage.removeItem('estateone_intended_destination');
      }
    } catch {}
  }, []);

  // Gracefully handle Session Expiry (PRD Acceptance Rule 7)
  const handleSessionExpiry = useCallback(() => {
    if (!user) return;
    // Capture current path as intended destination before clearing session
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath && !['/login', '/register', '/verify-otp'].includes(window.location.pathname)) {
      saveIntendedDestination(currentPath);
    }

    setUser(null);
    setSessionExpiredNotice(true);
    toastWarning('Session expired', MASKED_AUTH_MESSAGES.SESSION_EXPIRED);
  }, [user, saveIntendedDestination, toastWarning]);

  // Periodic Session Expiry Monitor (Checks every 30 seconds)
  useEffect(() => {
    if (!user?.sessionExpiry) return;

    const interval = setInterval(() => {
      if (Date.now() > user.sessionExpiry) {
        handleSessionExpiry();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, handleSessionExpiry]);

  // Manual Trigger to Simulate Session Expiry (for verification / testing Rule 7)
  const simulateSessionExpiry = useCallback(() => {
    handleSessionExpiry();
  }, [handleSessionExpiry]);

  const clearSessionExpiredNotice = useCallback(() => {
    setSessionExpiredNotice(false);
  }, []);

  // Authenticate & Validate Credentials (PRD Acceptance Rule 1, 3, 6)
  const login = useCallback((emailOrPhone, password) => {
    const cleanId = (emailOrPhone || '').trim().toLowerCase();
    const cleanPhone = cleanId.replace(/\s+/g, '');

    // Check credentials against registered users
    const matchedUser = registeredUsers.find((u) => {
      const emailMatches = u.email?.toLowerCase() === cleanId;
      const phoneMatches = u.phone?.replace(/\s+/g, '') === cleanPhone;
      return emailMatches || phoneMatches;
    });

    if (!cleanId || !password) {
      return {
        success: false,
        error: MASKED_AUTH_MESSAGES.INVALID_CREDENTIALS
      };
    }

    if (!matchedUser || matchedUser.password !== password) {
      return {
        success: false,
        error: MASKED_AUTH_MESSAGES.INVALID_CREDENTIALS
      };
    }

    // Session creation with configured duration (Rule 7: 2 hours lifetime)
    const sessionExpiry = Date.now() + AUTH_SECURITY_CONFIG.SESSION_DURATION_MS;
    const detectedRole = matchedUser.role || 'Member';

    const sessionUser = {
      id: matchedUser?.id || `usr-${Date.now().toString(36)}`,
      name: matchedUser?.name || cleanId.split('@')[0].replace(/[._]/g, ' ') || 'EstateOne Member',
      email: matchedUser?.email || (cleanId.includes('@') ? cleanId : `${cleanId}@estateone.in`),
      phone: matchedUser?.phone || '+91 98201 11223',
      role: detectedRole,
      company: matchedUser?.company || '',
      avatar: matchedUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      loginTimestamp: Date.now(),
      sessionExpiry
    };

    setUser(sessionUser);
    setSessionExpiredNotice(false);
    toastSuccess('Signed in successfully', `Welcome back, ${sessionUser.name}.`);

    // Preserve Intended Destination (Rule 6)
    const destination = resolvePostAuthDestination(intendedDestination || '/');
    saveIntendedDestination(null);

    return {
      success: true,
      user: sessionUser,
      destination
    };
  }, [registeredUsers, intendedDestination, saveIntendedDestination, toastSuccess]);

  // Start Registration Flow (PRD Acceptance Rule 1, 4: Validate password & issue OTP)
  const startRegistration = useCallback((registrationData) => {
    const { name, email, phone, password } = registrationData;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPhone = (phone || '').trim().replace(/\s+/g, '');

    // Validate password meets all 5 configured security criteria (Rule 1)
    const passCheck = checkPasswordSecurity(password);
    if (!passCheck.isValid) {
      return {
        success: false,
        error: 'Password does not meet the configured security requirements.'
      };
    }

    const emailTaken = registeredUsers.some((u) => u.email?.toLowerCase() === normalizedEmail);
    const phoneTaken = registeredUsers.some(
      (u) => u.phone?.replace(/\s+/g, '') === normalizedPhone
    );
    if (emailTaken || phoneTaken) {
      return {
        success: false,
        error: 'An account with this email or mobile number already exists. Please sign in instead.'
      };
    }

    // Generate OTP and configure lifespan & resend cooldown (Rule 4)
    const otp = AUTH_SECURITY_CONFIG.DEMO_OTP; // '123456' for reliable demonstration
    const otpExpiresAt = Date.now() + AUTH_SECURITY_CONFIG.OTP_EXPIRATION_MS;
    const resendCooldownUntil = Date.now() + AUTH_SECURITY_CONFIG.OTP_RESEND_COOLDOWN_SECONDS * 1000;

    const pending = {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      role: 'Member',
      password,
      otp,
      otpExpiresAt,
      resendCooldownUntil,
      resendCount: 0
    };

    setPendingRegistration(pending);
    toastInfo('Verification code dispatched', `A 6 digit OTP has been sent to ${pending.phone || pending.email}.`);

    return {
      success: true,
      pending
    };
  }, [registeredUsers, toastInfo]);

  // Verify OTP & Create Account (PRD Flowchart Step: Verify OTP -> Create Account -> Open Destination)
  const verifyOtp = useCallback((enteredOtp) => {
    if (!pendingRegistration) {
      return {
        success: false,
        error: 'No active registration in progress. Please start sign up again.'
      };
    }

    const cleanOtp = enteredOtp.replace(/\D/g, '');

    // Check expiration (Rule 4)
    if (Date.now() > pendingRegistration.otpExpiresAt) {
      return {
        success: false,
        error: MASKED_AUTH_MESSAGES.OTP_EXPIRED
      };
    }

    // Verify code match
    if (cleanOtp !== pendingRegistration.otp && cleanOtp !== AUTH_SECURITY_CONFIG.DEMO_OTP) {
      return {
        success: false,
        error: MASKED_AUTH_MESSAGES.OTP_INVALID
      };
    }

    // Create Account per Flowchart
    const newUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      phone: pendingRegistration.phone,
      password: pendingRegistration.password,
      role: pendingRegistration.role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    };

    // Save to registered database
    setRegisteredUsers((prev) => [...prev, newUser]);

    // Establish active session
    const sessionExpiry = Date.now() + AUTH_SECURITY_CONFIG.SESSION_DURATION_MS;
    const sessionUser = {
      ...newUser,
      loginTimestamp: Date.now(),
      sessionExpiry
    };

    setUser(sessionUser);
    setPendingRegistration(null);
    setSessionExpiredNotice(false);

    toastSuccess('Account verified & created', `Welcome to EstateOne, ${sessionUser.name}.`);

    // Return intended destination (Rule 6)
    const destination = resolvePostAuthDestination(intendedDestination || '/');
    saveIntendedDestination(null);

    return {
      success: true,
      user: sessionUser,
      destination
    };
  }, [pendingRegistration, intendedDestination, saveIntendedDestination, toastSuccess]);

  // Resend OTP with Limit Enforcement (PRD Acceptance Rule 4)
  const resendOtp = useCallback(() => {
    if (!pendingRegistration) {
      return {
        success: false,
        error: 'No active registration found. Please register your details.'
      };
    }

    // Check if max resends exceeded (Rule 4: max 3 attempts)
    if (pendingRegistration.resendCount >= AUTH_SECURITY_CONFIG.OTP_MAX_RESEND_ATTEMPTS) {
      return {
        success: false,
        error: MASKED_AUTH_MESSAGES.OTP_MAX_RESENDS
      };
    }

    // Increment resend attempt and renew lifespan & cooldown
    const nextCount = pendingRegistration.resendCount + 1;
    const otpExpiresAt = Date.now() + AUTH_SECURITY_CONFIG.OTP_EXPIRATION_MS;
    const resendCooldownUntil = Date.now() + AUTH_SECURITY_CONFIG.OTP_RESEND_COOLDOWN_SECONDS * 1000;

    const updated = {
      ...pendingRegistration,
      otpExpiresAt,
      resendCooldownUntil,
      resendCount: nextCount
    };

    setPendingRegistration(updated);
    toastSuccess('New code dispatched', `Verification code resent. ${AUTH_SECURITY_CONFIG.OTP_MAX_RESEND_ATTEMPTS - nextCount} resend attempts remaining.`);

    return {
      success: true,
      remainingAttempts: AUTH_SECURITY_CONFIG.OTP_MAX_RESEND_ATTEMPTS - nextCount,
      resendCooldownUntil
    };
  }, [pendingRegistration, toastSuccess]);

  // Masked Account Reset Dispatch (PRD Acceptance Rule 3: Error messages must not expose sensitive account information)
  const dispatchPasswordReset = useCallback((emailOrPhone) => {
    const clean = (emailOrPhone || '').trim();
    // In all cases, show the masked response to avoid user enumeration
    toastInfo('Verification dispatched', MASKED_AUTH_MESSAGES.ACCOUNT_RESET_DISPATCHED);
    return {
      success: true,
      message: MASKED_AUTH_MESSAGES.ACCOUNT_RESET_DISPATCHED
    };
  }, [toastInfo]);

  // Sign out
  const logout = useCallback(() => {
    setUser(null);
    saveIntendedDestination(null);
    setSessionExpiredNotice(false);
    toastInfo('Signed out', 'You have been securely signed out of EstateOne.');
  }, [saveIntendedDestination, toastInfo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        registeredUsers,
        login,
        logout,
        intendedDestination,
        saveIntendedDestination,
        startRegistration,
        verifyOtp,
        resendOtp,
        pendingRegistration,
        dispatchPasswordReset,
        sessionExpiredNotice,
        clearSessionExpiredNotice,
        simulateSessionExpiry
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
