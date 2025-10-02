'use client';

export interface UserSession {
  id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
  user_type: string;
  user_affiliation: string;
  createdAt: number;
  expiresAt: number;
}

const SESSION_KEY = 'thinq_user_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const setUserSession = (user: Omit<UserSession, 'createdAt' | 'expiresAt'>): void => {
  if (typeof window !== 'undefined') {
    const now = Date.now();
    const sessionData: UserSession = {
      ...user,
      createdAt: now,
      expiresAt: now + SESSION_DURATION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  }
};

export const getUserSession = (): UserSession | null => {
  if (typeof window !== 'undefined') {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      try {
        const session: UserSession = JSON.parse(sessionData);
        
        // Check if session has expired
        if (Date.now() > session.expiresAt) {
          console.log('Session expired, clearing...');
          clearUserSession();
          return null;
        }
        
        return session;
      } catch (error) {
        console.error('Error parsing session data:', error);
        return null;
      }
    }
  }
  return null;
};

export const clearUserSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const isUserLoggedIn = (): boolean => {
  return getUserSession() !== null;
};

export const getSessionTimeRemaining = (): number => {
  const session = getUserSession();
  if (!session) return 0;
  return Math.max(0, session.expiresAt - Date.now());
};

export const isSessionExpired = (): boolean => {
  const session = getUserSession();
  return session === null;
};
