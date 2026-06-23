# Pesquera Talcahuano Sur SpA — Panel de Desembarques

Aplicación web SPA desarrollada en React + Vite para el control de lotes de desembarque diario de la empresa Pesquera Talcahuano Sur SpA, bahía de Talcahuano.

---

## Estructura del Proyecto

El proyecto sigue **Screaming Architecture**: las carpetas reflejan dominios del negocio, no tipos de archivo ni tecnologías.

```
Pesquera-del-tio-aceite/
├── .github/
│   ├── dependabot.yml          # Actualizaciones automáticas de dependencias
│   └── SECURITY.md             # Política de seguridad del repositorio
├── api/
│   └── db_CasoA_desembarques.json  # Base de datos mock para json-server
├── docs/
│   └── LEEME.md                # Este documento (informe académico)
├── src/
│   ├── features/               # Dominios del negocio (Screaming Architecture)
│   │   ├── desembarques/       # Dominio principal implementado
│   │   │   ├── FilaDesembarque.jsx
│   │   │   ├── ListaDesembarques.jsx
│   │   │   └── desembarques.css
│   │   ├── capturas/           # Dominio reservado para desarrollo futuro
│   │   └── embarcaciones/      # Dominio reservado para desarrollo futuro
│   ├── App.jsx                 # Componente raíz: navbar y hero section
│   ├── App.css                 # Estilos del layout global
│   ├── index.css               # Variables CSS y reset
│   └── main.jsx                # Punto de entrada de React
├── .env.example                # Plantilla de variables de entorno
├── .gitignore
├── README.md                   # Portada del repositorio en GitHub
├── eslint.config.js
├── index.html                  # Entry point de Vite
├── package.json
└── vite.config.js
```

---

## 1. Elementos de React Utilizados (R1)

### Componentes

Se utilizan tres componentes en total, organizados bajo Screaming Architecture en `src/features/desembarques/`:

| Componente | Ubicación | Responsabilidad |
|---|---|---|
| `App` | `src/App.jsx` | Punto de entrada. Renderiza el encabezado de la empresa y monta `ListaDesembarques`. |
| `ListaDesembarques` | `src/features/desembarques/ListaDesembarques.jsx` | Consume la API REST, gestiona todos los estados de la aplicación (lotes, prioridades, filtro, carga, error) y renderiza la tabla. |
| `FilaDesembarque` | `src/features/desembarques/FilaDesembarque.jsx` | Renderiza una fila individual con los datos de un lote y el botón de prioridad. Componente presentacional puro. |

### Props

Las props permiten que `ListaDesembarques` (componente inteligente) controle el estado y que `FilaDesembarque` (componente presentacional) solo se encargue de la UI. `FilaDesembarque` recibe tres props:

```jsx
<FilaDesembarque
  lote={lote}                          // objeto con id, especie, embarcacion, fecha, kilos, estado
  esPrioritario={prioritarios.has(lote.id)}  // boolean derivado del Set de prioridades
  onTogglePrioritario={togglePrioritario}    // callback que modifica el estado en el padre
/>
```

Este diseño mantiene el flujo de datos unidireccional: el padre posee la fuente de verdad y el hijo nunca muta estado directamente.

### Estado con `useState`

`ListaDesembarques` declara cinco variables de estado:

```jsx
const [desembarques, setDesembarques] = useState([])
const [prioritarios, setPrioritarios] = useState(() => { /* lazy init desde localStorage */ })
const [filtro, setFiltro]             = useState('')
const [isLoading, setIsLoading]       = useState(true)
const [hasError, setHasError]         = useState(false)
```

- `desembarques`: array de objetos recibido desde la API REST.
- `prioritarios`: `Set` de IDs marcados. Se inicializa con un lazy initializer que lee `localStorage` para sobrevivir recargas de página.
- `filtro`: valor raw del `<input>` de búsqueda (nunca se usa directamente; siempre pasa por `sanitizarFiltro`).
- `isLoading` / `hasError`: controlan los tres estados posibles de la petición (cargando, error, éxito).

### `useEffect`

Se usan dos efectos en `ListaDesembarques`:

**Efecto 1 — Carga inicial de datos (se ejecuta una sola vez al montar):**
```jsx
useEffect(() => {
  const fetchDesembarques = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setDesembarques(data)
    } catch (err) {
      console.error('Error al obtener desembarques:', err)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }
  fetchDesembarques()
}, [])
```

**Efecto 2 — Sincronización de prioridades con `localStorage` (se ejecuta cada vez que `prioritarios` cambia):**
```jsx
useEffect(() => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...prioritarios]))
  } catch (err) {
    console.error('Error al persistir prioridades:', err)
  }
}, [prioritarios])
```

### JSX

JSX se emplea en los tres componentes para describir la UI de forma declarativa. Permite evaluar expresiones JavaScript dentro de `{}` sin manipular el DOM directamente. React escapa automáticamente el contenido renderizado, protegiendo contra inyección XSS sin necesidad de configuración adicional.

### Manejo de Eventos

- `onChange` en `<input id="filtro-desembarques">`: llama a `setFiltro(e.target.value)`. El valor no se usa en bruto; la función `sanitizarFiltro` lo procesa antes de aplicar el filtro real.
- `onClick` en el botón "Marcar / Prioritario" de cada `FilaDesembarque`: invoca `onTogglePrioritario(id)`, que actualiza el `Set` en el componente padre usando el patrón inmutable (`new Set(prev)`).

---

## 2. Registro de Sugerencia de GitHub Copilot (R1)

### Contexto

Durante la implementación de la función `sanitizarFiltro` (requerimiento R5), GitHub Copilot sugirió la siguiente versión al detectar el patrón de sanitización:

**Sugerencia original de Copilot:**
```js
function sanitizarFiltro(valor) {
  return valor
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .normalize('NFC')
    .slice(0, 100)
}
```

### Decisión

**Modificada.** La sugerencia de Copilot usaba la propiedad Unicode `\p{L}` (cualquier letra de cualquier script del mundo) con el flag `u`, lo que habría permitido el ingreso de caracteres en árabe, chino, cirílico, etc. Si bien es técnicamente válido, no es adecuado para el dominio de una pesquera de la Región del Biobío, donde los valores de `especie` y `estado` solo contienen caracteres del alfabeto español.

Se optó por una **whitelist explícita y más restrictiva** que reduce la superficie de entrada aceptada al mínimo necesario:

```js
function sanitizarFiltro(valor) {
  return valor
    .trim()
    .replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9\s]/g, '')
    .slice(0, 50)          // reducido de 100 a 50; los valores de especie/estado son cortos
}
```

El principio de seguridad aplicado es **mínimo privilegio de entrada**: aceptar solo lo que el sistema necesita y rechazar todo lo demás, en lugar de rechazar lo que parece peligroso.

---

## 3. Análisis con SonarLint en VS Code (R7)

El análisis estático se realizó con la extensión **SonarLint** en VS Code (versión conectada al servidor SonarQube Community). Se detectaron los siguientes hallazgos en el módulo `src/features/desembarques/ListaDesembarques.jsx`:

---

### Hallazgo 1 — Code Smell: Complejidad cognitiva elevada

- **Regla:** `javascript:S3776` — *Cognitive Complexity of functions should not be too high*
- **Archivo:** `src/features/desembarques/ListaDesembarques.jsx`
- **Descripción:** SonarLint marcó que la lógica de filtrado, sanitización y renderizado de la lista estaba concentrada en el cuerpo del `return` del componente, lo que elevaba la complejidad cognitiva de la función. El operador ternario para aplicar el filtro (`filtroSanitizado ? desembarques.filter(...) : desembarques`) estaba incrustado directamente dentro del JSX, dificultando la lectura.

**Corrección aplicada:**
Se extrajeron las operaciones a variables con nombres descriptivos **antes** del `return`, separando la lógica del renderizado:

```js
// Fuera del JSX, dentro del cuerpo del componente:
const filtroSanitizado = sanitizarFiltro(filtro)
const desembarquesFiltrados = filtroSanitizado
  ? desembarques.filter(
      (d) =>
        d.especie.toLowerCase().includes(filtroSanitizado.toLowerCase()) ||
        d.estado.toLowerCase().includes(filtroSanitizado.toLowerCase())
    )
  : desembarques
```

Esto reduce la complejidad cognitiva del bloque JSX y hace el flujo de transformación de datos legible de arriba hacia abajo.

---

### Hallazgo 2 — Bug: Acceso a `localStorage` sin manejo de excepciones

- **Regla:** `sonarjs:S2259` — *Null Pointers should not be dereferenced* / acceso a API del navegador sin protección
- **Archivo:** `src/features/desembarques/ListaDesembarques.jsx`
- **Descripción:** SonarLint identificó dos puntos donde se accedía a `localStorage` sin protección: la inicialización lazy del estado `prioritarios` (`localStorage.getItem(...)`) y el efecto de sincronización (`localStorage.setItem(...)`). En navegadores con modo de navegación privada estricta, con almacenamiento bloqueado por política de grupo, o cuando el disco está lleno, ambas llamadas pueden lanzar un `SecurityError` que detendría el componente completo.

**Corrección aplicada:**
Se envolvieron ambas operaciones en bloques `try/catch` independientes con comportamiento de degradación elegante:

```js
// Inicialización: si falla, arranca con Set vacío (sin crash)
const [prioritarios, setPrioritarios] = useState(() => {
  try {
    const stored = localStorage.getItem(LS_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
})

// Sincronización: si falla, registra el error pero no interrumpe la app
useEffect(() => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...prioritarios]))
  } catch (err) {
    console.error('Error al persistir prioridades:', err)
  }
}, [prioritarios])
```

La funcionalidad de persistencia queda como una mejora progresiva: si `localStorage` no está disponible, la app funciona correctamente en sesión pero sin guardar las prioridades entre recargas.
