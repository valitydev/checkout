import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'dist',
        lib: {
            entry: './src/initializer/index.ts',
            name: 'checkout',
        },
        rollupOptions: {
            output: {
                entryFileNames: 'checkout.js',
            },
        },
    },
});
