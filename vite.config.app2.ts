import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist/v2',
        rollupOptions: {
            input: {
                app: './index.html',
            },
        },
    },
    plugins: [
        react(),
        svgr(),
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
                {
                    src: 'src/locale/*.json',
                    dest: './locale',
                },
            ],
        }),
        visualizer(),
    ],
    server: {
        port: 7050,
    },
});
