import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    build: {
        outDir: 'dist/v1',
        rollupOptions: {
            input: {
                app: './checkout.html'
            }
        }
    },
    plugins: [
        react(),
        svgr(),
        tsconfigPaths(),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/appConfig.json',
                    dest: './'
                },
                {
                    src: 'src/env.json',
                    dest: './'
                },
                {
                    src: 'src/assets/*',
                    dest: './assets'
                },
                {
                    src: 'src/locale/*.json',
                    dest: './locale'
                }
            ]
        })
    ],
    server: {
        port: 7050,
        proxy: {
            '^/v1': {
                target: 'http://localhost:7050',
                rewrite: (path) => path.replace(/^\/v1/, '')
            }
        }
    }
});