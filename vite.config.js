import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Cute Pomodoro',
        short_name: 'Pomodoro',
        description: 'A cute cat-themed productivity timer',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', // You'll need to put an icon in your public folder
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})