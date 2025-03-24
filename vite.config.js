import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

{
  pattern: /^animate-spin$/,
  variants; ['hover', 'focus','active']
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Permissions-Policy': 'partitioned-cookies=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
      "Content-Security-Policy": "frame-ancestors 'self' https://pay.google.com/;",
    }
  },
})