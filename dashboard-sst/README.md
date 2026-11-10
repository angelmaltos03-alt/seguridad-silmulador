# Dashboard SST

Aplicación React para visualizar indicadores y registros de Seguridad y Salud en el Trabajo.

## Ejecución local

```bash
cd dashboard-sst
npm install
npm run dev
```

Para generar la versión de producción:

```bash
npm run build
```

## Publicación

El flujo `.github/workflows/deploy-dashboard-sst.yml` compila esta aplicación y la publica en la ruta:

`https://angelmaltos03-alt.github.io/seguridad-silmulador/dashboard-sst/`

El sitio principal del repositorio conserva la simulación industrial que ya existía.

Para activar la publicación, entra a **Settings → Pages** y selecciona **GitHub Actions** como fuente de despliegue.

## Datos y privacidad

- Los valores que aparecen al iniciar son datos de demostración.
- Los cambios se mantienen en el estado de la sesión del navegador; esta versión no tiene base de datos ni sincronización entre usuarios.
- El botón de descarga genera un archivo CSV de resumen.
- No cargues información personal o registros reales de trabajadores en un sitio público. Antes de utilizarlo operativamente, valida los indicadores, las fórmulas y los criterios normativos con el responsable de SST.
