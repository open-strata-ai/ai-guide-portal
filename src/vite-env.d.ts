/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GUIDE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
