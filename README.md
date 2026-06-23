# Pesquera Talcahuano Sur SpA — Panel de Desembarques

Aplicación web SPA desarrollada en **React + Vite** para la gestión de lotes de desembarque de la empresa Pesquera Talcahuano Sur SpA, Bahía de Talcahuano, Región del Biobío.

> El documento académico completo (elementos de React, sugerencias de IA y análisis con SonarLint) se encuentra en [docs/LEEME.md](./docs/LEEME.md).

---

## Tecnologías

| Herramienta | Versión | Rol |
|---|---|---|
| React | 18 | Librería de interfaz |
| Vite | 5 | Bundler y servidor de desarrollo |
| json-server | 0.17 | API REST simulada |
| ESLint | 9 | Análisis estático |

## Requisitos previos

- Node.js ≥ 18
- npm ≥ 9

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/EchoBit3/Pesquera-del-tio-aceite.git
cd Pesquera-del-tio-aceite

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

## Ejecución

Requiere **dos terminales** en paralelo:

```bash
# Terminal 1 — API REST (json-server en :3001)
npm run server

# Terminal 2 — Frontend (Vite en :5173)
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

## Estructura del proyecto

```
├── api/
│   └── db_CasoA_desembarques.json   # Base de datos mock (json-server)
├── src/
│   ├── features/
│   │   ├── desembarques/            # Dominio principal
│   │   │   ├── FilaDesembarque.jsx
│   │   │   ├── ListaDesembarques.jsx
│   │   │   └── desembarques.css
│   │   ├── capturas/                # Dominio reservado
│   │   └── embarcaciones/           # Dominio reservado
│   ├── App.jsx                      # Componente raíz (navbar + hero)
│   ├── App.css
│   ├── index.css                    # Variables CSS globales
│   └── main.jsx
├── .env.example                     # Plantilla de variables de entorno
├── index.html
└── package.json
```

La estructura sigue **Screaming Architecture**: las carpetas reflejan dominios del negocio, no tipos de archivo.

## Funcionalidades

- Listado de lotes de desembarque consumidos desde la API REST
- Estadísticas en tiempo real (total de lotes, kilos, lotes pendientes)
- Filtro por especie o estado con sanitización de entrada
- Marcado de lotes como prioritarios con persistencia en `localStorage`
- Gestión de estados de carga y error

## Licencia

Proyecto académico — sin licencia de distribución.
