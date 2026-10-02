import { mergeConfig, defineConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default defineConfig(
    mergeConfig(
        viteConfig,
        defineConfig({
            test: {
                globals: true,
                environment: 'happy-dom',
                setupFiles: ['./vitest.setup.ts'],
                coverage: {
                    provider: 'v8',
                    reporter: ['text', 'html'],
                    exclude: ['node_modules/', 'src/types/', 'src/plugins/', '**/*.d.ts'],
                },
                silent: true,
            },
        }),
    ),
);
