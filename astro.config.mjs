import {defineConfig, sharpImageService} from "astro/config";
import {SITE_URL} from "./src/constants/site";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  srcDir: "./src",
  publicDir: "./public",
  cacheDir: "./dist-cache-directory",
  site: SITE_URL,
  build: {
    inlineStylesheets: "never",
    assets: "assets",
  },
  compressHTML: false,
  scopedStyleStrategy: "class",
  integrations: [vue()],
  vite: {
    // plugins: ['prettier-plugin-astro'],
    overrides: [
      {
        files: "*.astro",
        options: {
          parser: "astro",
        },
      },
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/styles/index.scss";`,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/js/[name].js`,
          chunkFileNames: `assets/js/[name].js`,
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split(".").at(-1);
            if (/ts|js/i.test(extType)) {
              extType = "js";
            } else if (/css|scss/i.test(extType)) {
              extType = "css";
            } else if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = "images";
            }
            return `assets/${extType}/[name][extname]`;
          },
        },
      },
    },
  },
});
