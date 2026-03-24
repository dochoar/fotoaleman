import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
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
        opiniones: 'opiniones.html',
      },
    },
  },
})
