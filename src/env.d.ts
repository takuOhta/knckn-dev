interface ImportMetaEnv {
  readonly PUBLIC_SITE_PATH: string;
  readonly PUBLIC_SITE_NAME: string;
  readonly PUBLIC_DOMAIN_SERVICE_MICROCMS: string;
  readonly PUBLIC_API_ENDPOINT_MICROCMS: string;
  readonly PUBLIC_API_ENDPOINT_WORDPRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
