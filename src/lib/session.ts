'use client';

export interface UserSession {
  id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
  user_type: string;
  user_affiliation: string;
}

const SESSION_KEY = 'thinq_user_session';

export const setUserSession = (user: UserSession): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
};

export const getUserSession = (): UserSession | null => {
  if (typeof window !== 'undefined') {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      try {
        return JSON.parse(sessionData);
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
