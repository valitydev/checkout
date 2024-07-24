import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist/v1',
        rollupOptions: {
            input: {
                app: './checkout.html',
            },
        },
    },
    plugins: [
        react(),
        tsconfigPaths(),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/appConfig.json',
                    dest: './',
                },
                {
                    src: 'src/env.json',
                    dest: './',
                },
                {
                    src: 'src/assets/*',
                    dest: './assets',
                },
            ],
        }),
        visualizer(),
    ],
    server: {
        port: 7050,
        proxy: {
            '^/v1': {
                target: 'http://localhost:7050',
                rewrite: (path) => path.replace(/^\/v1/, ''),
            },
        },
    },
});
