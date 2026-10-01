/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_EMAILS?: string;
  // add other env variables if needed...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
