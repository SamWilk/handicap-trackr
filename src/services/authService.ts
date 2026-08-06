import { AuthSession, OAuthProvider } from "../types/auth";

const AUTH_STORAGE_KEY = "handicap-trackr.auth-session";

const AUTH_PARAM_KEYS = [
  "auth_status",
  "auth_success",
  "auth_token",
  "access_token",
  "id_token",
  "provider",
  "name",
  "display_name",
  "email",
  "avatar_url",
  "error",
  "error_description",
  "auth_error",
] as const;

const PROVIDER_CONFIGS = [
  {
    id: "google",
    label: import.meta.env.VITE_AUTH_GOOGLE_LABEL ?? "Continue with Google",
    description: "Use your Google account to access your handicap history.",
    href: import.meta.env.VITE_AUTH_GOOGLE_URL,
  },
  {
    id: "microsoft",
    label:
      import.meta.env.VITE_AUTH_MICROSOFT_LABEL ?? "Continue with Microsoft",
    description: "Sign in with Microsoft if your golf data is tied to work.",
    href: import.meta.env.VITE_AUTH_MICROSOFT_URL,
  },
  {
    id: "github",
    label: import.meta.env.VITE_AUTH_GITHUB_LABEL ?? "Continue with GitHub",
    description: "Use GitHub when this tracker is part of an internal toolchain.",
    href: import.meta.env.VITE_AUTH_GITHUB_URL,
  },
  {
    id: "apple",
    label: import.meta.env.VITE_AUTH_APPLE_LABEL ?? "Continue with Apple",
    description: "Use Apple for a more private sign-in flow.",
    href: import.meta.env.VITE_AUTH_APPLE_URL,
  },
];

const getHashParams = () => {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;

  return new URLSearchParams(hash);
};

const cleanupAuthParams = () => {
  const url = new URL(window.location.href);
  const hashParams = getHashParams();

  AUTH_PARAM_KEYS.forEach((key) => {
    url.searchParams.delete(key);
    hashParams.delete(key);
  });

  const nextSearch = url.searchParams.toString();
  const nextHash = hashParams.toString();
  const nextUrl = `${url.pathname}${nextSearch ? `?${nextSearch}` : ""}${
    nextHash ? `#${nextHash}` : ""
  }`;

  window.history.replaceState({}, document.title, nextUrl);
};

export const getOAuthProviders = (): OAuthProvider[] =>
  PROVIDER_CONFIGS.filter(
    (provider): provider is (typeof PROVIDER_CONFIGS)[number] & { href: string } =>
      typeof provider.href === "string" && provider.href.trim() !== ""
  ).map((provider) => ({
    id: provider.id,
    label: provider.label,
    href: provider.href,
    description: provider.description,
  }));

export const beginOAuthSignIn = (provider: OAuthProvider) => {
  window.location.assign(provider.href);
};

export const getStoredSession = (): AuthSession | null => {
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed.displayName || !parsed.provider || !parsed.authenticatedAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const storeSession = (session: AuthSession) => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const consumeOAuthCallback = (): {
  session: AuthSession | null;
  error: string | null;
} => {
  const search = new URLSearchParams(window.location.search);
  const hash = getHashParams();

  const error =
    search.get("auth_error") ??
    search.get("error_description") ??
    search.get("error") ??
    hash.get("error_description") ??
    hash.get("error");

  if (error) {
    cleanupAuthParams();
    return { session: null, error };
  }

  const authSucceeded =
    search.get("auth_status") === "success" ||
    search.get("auth_success") === "1" ||
    search.has("auth_token") ||
    search.has("access_token") ||
    search.has("id_token") ||
    hash.has("access_token") ||
    hash.has("id_token");

  if (!authSucceeded) {
    return { session: null, error: null };
  }

  const session: AuthSession = {
    provider: search.get("provider") ?? hash.get("provider") ?? "oauth",
    displayName:
      search.get("display_name") ??
      search.get("name") ??
      search.get("email") ??
      "Signed in golfer",
    email: search.get("email") ?? undefined,
    avatarUrl: search.get("avatar_url") ?? undefined,
    authenticatedAt: new Date().toISOString(),
  };

  storeSession(session);
  cleanupAuthParams();

  return { session, error: null };
};
