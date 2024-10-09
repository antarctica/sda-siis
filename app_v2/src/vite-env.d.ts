/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CACHE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
