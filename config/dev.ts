import type { UserConfigExport } from '@tarojs/cli'

export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {},
  plugins: [
    ['taro-plugin-sync-in-wsl', {
      weapp: [
        {
          sourcePath: 'dist',
          outputPath: '/mnt/c/projects/rms-mini-program',
        },
      ],
    } as any],
  ],
} satisfies UserConfigExport<'webpack5'>
