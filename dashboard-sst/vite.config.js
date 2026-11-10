import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Rutas relativas: funciona aunque GitHub Pages publique el proyecto en una subcarpeta.
});
