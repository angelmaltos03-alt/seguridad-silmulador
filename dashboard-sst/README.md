# Dashboard SST — SafetyOS Control Tower

Centro de mando interactivo de Seguridad y Salud en el Trabajo, construido como aplicación web responsive y desplegado mediante GitHub Pages.

## Stack tecnológico

- **HTML5 semántico:** estructura de interfaz con `header`, `main`, `nav`, `aside` y `section`.
- **CSS3:** diseño industrial oscuro, profundidad visual, paneles glass, animaciones, estados hover y adaptación móvil.
- **JavaScript ES6+:** lógica de indicadores, eventos, exportación CSV y actualización del panel.
- **React 18 + JSX:** componentes e interfaz reactiva.
- **Three.js / WebGL:** escena 3D de una planta industrial con maquinaria, transportadores, almacenamiento, trabajador, señalización y punto de riesgo pulsante. Arrastra la escena para cambiar su orientación.
- **Recharts:** visualización de datos e indicadores.
- **Tailwind CSS + Vite:** utilidades de estilo y empaquetado de producción.

## Ejecución local

```bash
cd dashboard-sst
npm install
npm run dev
```

Para compilar y revisar el resultado:

```bash
npm run build
npm run preview
```

## Publicación

El workflow `.github/workflows/deploy-dashboard-sst.yml` compila esta aplicación y la publica en:

https://angelmaltos03-alt.github.io/seguridad-silmulador/dashboard-sst/

La fuente de publicación debe ser **GitHub Actions** en Settings → Pages → Build and deployment.

El sitio principal del repositorio conserva la simulación industrial que ya existía.

## Datos y privacidad

- Los valores que aparecen al iniciar son datos de demostración.
- Los cambios se mantienen en el estado de la sesión del navegador; esta versión no tiene base de datos ni sincronización entre usuarios.
- El botón de descarga genera un archivo CSV de resumen.
- No cargues información personal o registros reales de trabajadores en un sitio público. Antes de utilizarlo operativamente, valida los indicadores, las fórmulas y los criterios normativos con el responsable de SST.


## Publicación

La aplicación pública se sirve desde `index.html` autónomo: no depende de rutas de desarrollo, React en el navegador ni archivos externos para iniciar. El flujo de GitHub Actions valida el JavaScript de arranque antes de publicar.
