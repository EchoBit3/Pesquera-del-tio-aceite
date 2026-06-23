// Componente presentacional: renderiza una fila de la tabla con los datos de un lote
function FilaDesembarque({ lote, esPrioritario, onTogglePrioritario }) {
  const { id, especie, embarcacion, fecha, kilos, estado } = lote

  return (
    <tr className={esPrioritario ? 'fila--prioritaria' : ''}>
      <td>{especie}</td>
      <td>{embarcacion}</td>
      <td>{fecha}</td>
      <td className="col-kilos">{Number(kilos).toLocaleString('es-CL')} kg</td>
      <td className="col-centro">
        <span className={`badge badge--${estado}`}>{estado}</span>
      </td>
      <td className="col-centro">
        <button
          className={`btn-prioridad${esPrioritario ? ' btn-prioridad--activo' : ''}`}
          onClick={() => onTogglePrioritario(id)}
          title={esPrioritario ? 'Quitar prioridad' : 'Marcar como prioritario'}
        >
          {esPrioritario ? 'Prioritario' : 'Marcar'}
        </button>
      </td>
    </tr>
  )
}

export default FilaDesembarque
