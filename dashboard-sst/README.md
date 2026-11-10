# SAFETYOS — Dashboard SST

Centro de mando de Seguridad y Salud en el Trabajo. Aplicación web responsive publicada con GitHub Pages.

## Módulos

- Centro de mando con indicadores, eventos recientes y distribución de riesgos.
- **Mapa / Layout de riesgos:** carga un plano de planta en PNG, JPG o WEBP; registra, edita y elimina áreas; coloca los marcadores haciendo clic sobre el plano; clasifica los riesgos con probabilidad, severidad y exposición.
- **Accidentes e incidentes:** captura tipo, fecha, área, turno, severidad, días perdidos, descripción y acciones inmediatas.
- **Localización anatómica:** esquema corporal con vistas anterior y posterior; catálogo por cabeza/cara, tronco, extremidades superiores e inferiores; selección de lateralidad izquierda, centro o derecha.
- **Investigaciones:** 5 porqués, causa raíz y acciones correctivas/preventivas.
- **Simulador de riesgos**, matriz de seguimiento normativo y reportes CSV/JSON/PDF.

## Publicación

La aplicación autónoma se sirve desde `dashboard-sst/index.html`. GitHub Actions compila y valida el JavaScript antes de publicar.

URL: https://angelmaltos03-alt.github.io/seguridad-silmulador/dashboard-sst/

## Datos y privacidad

- Los registros y el plano cargado se guardan en el almacenamiento local del navegador.
- El plano se reduce y comprime antes de guardarse para limitar el espacio ocupado.
- La información **no se sincroniza entre usuarios ni dispositivos**. Para operación multiusuario se requiere conectar una base de datos y autenticación en la nube.
- Las áreas iniciales son datos de demostración. Sustituye los ejemplos y valida los criterios de evaluación y referencias normativas antes de utilizar el sistema en operación.
- No cargues información personal sensible de trabajadores en una página pública.
