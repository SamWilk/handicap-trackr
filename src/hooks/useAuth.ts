import { useEffect, useState } from "react";
import {
  beginOAuthSignIn,
  clearSession,
  consumeOAuthCallback,
  getOAuthProviders,
  getStoredSession,
} from "../services/authService";
import { AuthSession, OAuthProvider } from "../types/auth";

export const useAuth = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [providers] = useState<OAuthProvider[]>(() => getOAuthProviders());

  useEffect(() => {
    const callbackResult = consumeOAuthCallback();
    setError(callbackResult.error);
    setSession(callbackResult.session ?? getStoredSession());
    setLoading(false);
  }, []);

  const signIn = (provider: OAuthProvider) => {
    beginOAuthSignIn(provider);
  };

  const signOut = () => {
    clearSession();
    setSession(null);
    setError(null);
  };

  return {
    session,
    error,
    loading,
    providers,
    signIn,
    signOut,
  };
};
