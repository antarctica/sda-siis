/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CACHE_ID: string; // Cache ID for the application
  readonly VITE_SERVICE_API_ENDPOINT: string; // Service API endpoint
  readonly VITE_SERVICE_API_OGC_ENDPOINT: string; // Service API OGC endpoint
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
