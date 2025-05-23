import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"
import { VitePWA } from 'vite-plugin-pwa'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        TanStackRouterVite({ target: "react", autCodeSplitting: true }),
        svgr(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.png'],
            manifest: {
                name: "PROGEEK PDF Compressor",
                short_name: "PDF Compressor",
                description: "Webservice to compress PDF files in browser",
                theme_color: "#ED6B1C",
                icons: [
                    {
                        src: 'pwa-64x64.png',
                        sizes: '64x64',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                ]
            },
            devOptions: {
                enabled: true
            },
            workbox: {
                maximumFileSizeToCacheInBytes: 18000000
            }
        })
    ],
    worker: {
        format: "es"
    },
    build: { target: 'esnext' },
    base: "/"
})
