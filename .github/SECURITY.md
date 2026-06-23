# Política de Seguridad — Pesquera Talcahuano Sur SpA

## Alcance

Este repositorio corresponde a un proyecto académico desarrollado en React + Vite.
No maneja datos reales de producción ni expone servicios en infraestructura pública.

## Prácticas de seguridad aplicadas

| Práctica | Implementación |
| -------- | -------------- |
| Variables de entorno | La URL del servicio REST se define en `.env` (no versionado) y se accede mediante `import.meta.env.VITE_API_URL` |
| Sanitización de entradas | El filtro de búsqueda pasa por `sanitizarFiltro()` antes de usarse: whitelist explícita de caracteres del español, límite de 50 caracteres |
| Protección XSS | React escapa automáticamente todo contenido interpolado en JSX; no se usa `dangerouslySetInnerHTML` |
| Manejo de errores | Las operaciones sobre `localStorage` y `fetch` están envueltas en bloques `try/catch` con degradación elegante |
| Dependencias | Configuración de Dependabot activa para alertas automáticas de vulnerabilidades en dependencias npm |

## Reporte de vulnerabilidades

Si encuentras alguna vulnerabilidad en este proyecto, por favor repórtala
directamente al autor a través de los Issues del repositorio, indicando:

- Descripción del problema
- Pasos para reproducirlo
- Impacto potencial estimado

Las vulnerabilidades reportadas serán revisadas en un plazo de 7 días hábiles.
