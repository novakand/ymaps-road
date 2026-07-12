/// <reference types="vite/client" />

declare interface ImportMeta {
  globEager<T = any>(pattern: string): Record<string, T>;
}