import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import viteConfig from './vite.config.ts';

export default mergeConfig(
    viteConfig,
    defineConfig({
        plugins: [vue()],
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
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    }),
);
