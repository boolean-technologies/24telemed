/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEBSOCKET_BASE: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  