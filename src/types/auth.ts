export interface AuthSession {
  provider: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  authenticatedAt: string;
}

export interface OAuthProvider {
  id: string;
  label: string;
  href: string;
  description: string;
}
