import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg', 'icons/icon-maskable.svg'],
      manifest: {
        name: 'DM PASS — NOVAKORAX Music & Studio DM Record',
        short_name: 'DM PASS',
        description: 'Pré-inscription NOVAKORAX Music et réservation au Studio DM Record (Brazzaville).',
        theme_color: '#0B1B33',
        background_color: '#0B1B33',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'fr',
        icons: [
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icons/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,webmanifest}'], navigateFallback: '/index.html' }
    })
  ]
})
