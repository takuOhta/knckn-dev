interface ImportMetaEnv {
  readonly PUBLIC_SITE_PATH: string;
  readonly PUBLIC_SITE_NAME: string;
  readonly PUBLIC_AAPI_ENDPOINT_WORDPRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
