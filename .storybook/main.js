import path from 'path'

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts)'],
  addons: [
    path.dirname(
      require.resolve(path.join('@storybook/addon-links', 'package.json'))
    ),
    path.dirname(
      require.resolve(path.join('@storybook/addon-essentials', 'package.json'))
    ),
    path.dirname(
      require.resolve(
        path.join('@storybook/addon-interactions', 'package.json')
      )
    ),
  ],
  framework: {
    name: path.dirname(
      require.resolve(path.join('@storybook/vue3-vite', 'package.json'))
    ),
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    config.define = {
      'process.env': {},
    }
    config.css = {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/styles/index.scss";`,
        },
      },
    }
    Object.assign(config.resolve.alias, {
      vue$: 'vue/dist/vue.esm.js',
      '@images': path.resolve(__dirname, '../src/assets/images'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@constants': path.resolve(__dirname, '../src/constants'),
      '@layouts': path.resolve(__dirname, '../src/layouts'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@scripts': path.resolve(__dirname, '../src/scripts'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@tsTypes': path.resolve(__dirname, '../src/types'),
      '@utils': path.resolve(__dirname, '../src/utils'),
    })
    return config
  },
}

export default config
