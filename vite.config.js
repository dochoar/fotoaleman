import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        graduaciones: 'graduaciones.html',
        bodas: 'bodas.html',
        estolas: 'estolas.html',
        empresas: 'empresas.html',
        trayectoria: 'trayectoria.html',
        contacto: 'contacto.html',
        politicas: 'politicas.html',
        estudio: 'estudio.html',
      },
    },
  },
})
