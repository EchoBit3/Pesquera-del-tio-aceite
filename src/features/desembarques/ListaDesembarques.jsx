import { useState, useEffect } from 'react'
import FilaDesembarque from './FilaDesembarque'
import './desembarques.css'

const LS_KEY = 'pesquera_prioritarios'

// Sanea la entrada del usuario: elimina caracteres no permitidos y limita la longitud
function sanitizarFiltro(valor) {
  return valor
    .trim()
    .replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9\s]/g, '')
    .slice(0, 50)
}

function ListaDesembarques() {
  const [desembarques, setDesembarques] = useState([])
  const [prioritarios, setPrioritarios] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [filtro, setFiltro] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Consume la API REST al montar el componente; gestiona estados de carga y error
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

  // Persiste el conjunto de IDs prioritarios en localStorage cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify([...prioritarios]))
    } catch (err) {
      console.error('Error al persistir prioridades:', err)
    }
  }, [prioritarios])

  const togglePrioritario = (id) => {
    setPrioritarios((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtroSanitizado = sanitizarFiltro(filtro)
  const desembarquesFiltrados = filtroSanitizado
    ? desembarques.filter(
        (d) =>
          d.especie.toLowerCase().includes(filtroSanitizado.toLowerCase()) ||
          d.estado.toLowerCase().includes(filtroSanitizado.toLowerCase())
      )
    : desembarques

  if (isLoading) {
    return (
      <div className="panel">
        <p className="estado-carga">Cargando desembarques...</p>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="panel">
        <p className="estado-error">
          No se pudo conectar al servicio de datos. Verifique que el servidor
          este activo en <code>{import.meta.env.VITE_API_URL}</code>.
        </p>
      </div>
    )
  }

  const totalKilos = desembarquesFiltrados.reduce((sum, d) => sum + Number(d.kilos), 0)
  const totalPendientes = desembarquesFiltrados.filter((d) => d.estado === 'pendiente').length

  return (
    <>
      <section className="stats-grid" aria-label="Resumen estadístico">
        <article className="stat-card">
          <dl>
            <dt className="stat-card__etiqueta">Total de Lotes</dt>
            <dd className="stat-card__numero">{desembarquesFiltrados.length}</dd>
          </dl>
        </article>
        <article className="stat-card">
          <dl>
            <dd className="stat-card__numero">{totalKilos.toLocaleString('es-CL')}</dd>
            <dt className="stat-card__etiqueta">Kilos Totales</dt>
          </dl>
        </article>
        <article className="stat-card">
          <dl>
            <dd className="stat-card__numero">{totalPendientes}</dd>
            <dt className="stat-card__etiqueta">Lotes Pendientes</dt>
          </dl>
        </article>
      </section>

      <section className="panel" aria-labelledby="titulo-registro">
        <h2 className="panel__titulo" id="titulo-registro">Registro de Desembarques</h2>
        <div className="filtro" role="search">
          <label className="filtro__label" htmlFor="filtro-desembarques">
            Filtrar por especie o estado:
          </label>
          <input
            id="filtro-desembarques"
            className="filtro__input"
            type="search"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Ej: anchoveta, pendiente..."
            maxLength={50}
            aria-label="Filtrar desembarques por especie o estado"
          />
        </div>
        {desembarquesFiltrados.length === 0 ? (
          <p className="estado-vacio" role="status">No se encontraron lotes con ese criterio.</p>
        ) : (
          <table className="tabla-desembarques">
            <colgroup>
              <col className="col-especie" />
              <col className="col-embarcacion" />
              <col className="col-fecha" />
              <col className="col-kilos" />
              <col className="col-estado" />
              <col className="col-prioridad" />
            </colgroup>
            <caption className="sr-only">
              Registro de lotes de desembarque — {desembarquesFiltrados.length} lotes, {totalKilos.toLocaleString('es-CL')} kg totales
            </caption>
            <thead>
              <tr>
                <th scope="col">Especie</th>
                <th scope="col">Embarcacion</th>
                <th scope="col" className="col-centro">Fecha</th>
                <th scope="col" className="col-kilos">Kilos (kg)</th>
                <th scope="col" className="col-centro">Estado</th>
                <th scope="col" className="col-centro">Prioridad</th>
              </tr>
            </thead>
            <tbody>
              {desembarquesFiltrados.map((lote) => (
                <FilaDesembarque
                  key={lote.id}
                  lote={lote}
                  esPrioritario={prioritarios.has(lote.id)}
                  onTogglePrioritario={togglePrioritario}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  )
}

export default ListaDesembarques
