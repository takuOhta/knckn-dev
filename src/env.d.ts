interface ImportMetaEnv {
  readonly PUBLIC_SITE_PATH: string;
  readonly PUBLIC_SITE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}