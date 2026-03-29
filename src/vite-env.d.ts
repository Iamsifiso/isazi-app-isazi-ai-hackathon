/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANTHROPIC_API_KEY: string;
  readonly VITE_SPEECH_TO_TEXT_API_KEY: string;
  readonly VITE_GOOGLE_TRANSLATE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
