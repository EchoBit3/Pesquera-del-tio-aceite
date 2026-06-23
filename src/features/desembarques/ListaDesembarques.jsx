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
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card__numero">{desembarquesFiltrados.length}</span>
          <span className="stat-card__etiqueta">Total de Lotes</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__numero">
            {totalKilos.toLocaleString('es-CL')}
          </span>
          <span className="stat-card__etiqueta">Kilos Totales</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__numero">{totalPendientes}</span>
          <span className="stat-card__etiqueta">Lotes Pendientes</span>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel__titulo">Registro de Desembarques</h2>
        <div className="filtro">
          <label className="filtro__label" htmlFor="filtro-desembarques">
            Filtrar por especie o estado:
          </label>
          <input
            id="filtro-desembarques"
            className="filtro__input"
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Ej: anchoveta, pendiente..."
            maxLength={50}
          />
        </div>
        {desembarquesFiltrados.length === 0 ? (
          <p className="estado-vacio">No se encontraron lotes con ese criterio.</p>
        ) : (
          <table className="tabla-desembarques">
            <thead>
              <tr>
                <th scope="col">Especie</th>
                <th scope="col">Embarcacion</th>
                <th scope="col">Fecha</th>
                <th scope="col" className="col-kilos">Kilos</th>
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
      </div>
    </>
  )
}

export default ListaDesembarques
