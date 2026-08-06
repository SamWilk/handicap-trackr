/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_APPLE_LABEL?: string;
  readonly VITE_AUTH_APPLE_URL?: string;
  readonly VITE_AUTH_GITHUB_LABEL?: string;
  readonly VITE_AUTH_GITHUB_URL?: string;
  readonly VITE_AUTH_GOOGLE_LABEL?: string;
  readonly VITE_AUTH_GOOGLE_URL?: string;
  readonly VITE_AUTH_MICROSOFT_LABEL?: string;
  readonly VITE_AUTH_MICROSOFT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
