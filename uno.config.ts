import { defineConfig, presetIcons } from 'unocss'
import presetWeapp, { colors } from 'unocss-preset-weapp'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify()

export default defineConfig({
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp(
      {
        // eslint-disable-next-line node/prefer-global/process
        isH5: process.env.TARO_ENV === 'h5',
        platform: 'taro',
        taroWebpack: 'webpack5',
        designWidth: 375,
        deviceRatio: {
          640: 2.34 / 2,
          750: 1,
          828: 1.81 / 2,
          375: 2 / 1,
        },
      },
    ),
    presetWeappAttributify(),
    presetIcons({
      collections: {
        'material-symbols': () => import('@iconify-json/material-symbols/icons.json').then(i => i.default) as any,
      },
    }),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500/10',
      'center': 'flex justify-center items-center',
    },
  ],

  transformers: [

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
  theme: {
    colors: {
      primary: '#215EBE',
    },

  },
})
