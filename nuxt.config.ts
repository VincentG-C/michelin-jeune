export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: [
    '@vite-pwa/nuxt',
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Michelin Pulse',
      short_name: 'Pulse',
      description: 'Ton passeport gastronomique Michelin',
      theme_color: '#C8102E',
      background_color: '#1a1a2e',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'unsplash-images',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'michelin_jwt_secret_hackathon_2026',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    public: {
      mapboxToken: process.env.MAPBOX_PUBLIC_TOKEN || '',
    },
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
  },
})
