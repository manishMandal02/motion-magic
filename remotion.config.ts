import { Config } from 'remotion';
import path from 'path';

Config.overrideWebpackConfig((currentConfig) => {
  return {
    ...currentConfig,
    resolve: {
      ...currentConfig.resolve,
      alias: {
        ...(currentConfig.resolve?.alias ?? {}),
        '@/components': path.join(process.cwd(), 'src', 'components'),
        '@/store': path.join(process.cwd(), 'src', 'store'),
        '@/hooks': path.join(process.cwd(), 'src', 'hooks'),
        '@/constants': path.join(process.cwd(), 'src', 'constants'),
        '@/lib': path.join(process.cwd(), 'src', 'lib'),
        '@/types': path.join(process.cwd(), 'src', 'types'),
      },
    },
  };
});
