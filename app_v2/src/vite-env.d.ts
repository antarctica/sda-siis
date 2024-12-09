/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CACHE_ID: string; // Cache ID for the application
  readonly VITE_SERVICE_API_ENDPOINT: string; // Service API endpoint
  readonly VITE_SERVICE_API_OGC_ENDPOINT: string; // Service API OGC endpoint
  readonly VITE_VERSION: string; // Version of the application
  readonly VITE_BASE_URL: string; // Base URL for the application
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
