'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthErrorContextType {
  hasAuthError: boolean;
  setHasAuthError: (value: boolean) => void;
}

const AuthErrorContext = createContext<AuthErrorContextType | undefined>(
  undefined
);

export function AuthErrorProvider({ children }: { children: ReactNode }) {
  const [hasAuthError, setHasAuthError] = useState(false);

  return (
    <AuthErrorContext.Provider value={{ hasAuthError, setHasAuthError }}>
      {children}
    </AuthErrorContext.Provider>
  );
}

export function useAuthError() {
  const context = useContext(AuthErrorContext);
  if (context === undefined) {
    throw new Error('useAuthError must be used within an AuthErrorProvider');
  }
  return context;
}
