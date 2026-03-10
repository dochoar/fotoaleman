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
        trayectoria: 'trayectoria.html',
        contacto: 'contacto.html',

        estudio: 'estudio.html',
        editorial: 'editorial.html',
        producto: 'producto.html',
        infantiles: 'infantiles.html',
        politica: 'politica.html',
        gobernadores: 'gobernadores.html',
        pagos: 'pagos.html',
        moda: 'moda.html',
        quinceaneras: 'quinceaneras.html',
      },
    },
  },
})
