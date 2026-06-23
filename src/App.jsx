import './App.css'
import ListaDesembarques from './features/desembarques/ListaDesembarques'

function App() {
  return (
    <div className="app">
      <header>
        <nav className="navbar" aria-label="Navegación principal">
          <strong className="navbar__logo">Pesquera Talcahuano Sur SpA</strong>
          <ul className="navbar__links">
            <li><a href="#inicio" aria-current="page">Inicio</a></li>
            <li><a href="#panel">Panel</a></li>
            <li><a href="#embarcaciones">Embarcaciones</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero" aria-label="Presentación del sistema">
        <div className="hero__contenido">
          <p className="hero__eyebrow">Bahia de Talcahuano, Region del Biobio</p>
          <h1 className="hero__titulo">Control de Desembarques</h1>
          <p className="hero__subtitulo">
            Panel operativo para la gestion de lotes de recursos pelagicos
            capturados en la bahia de Talcahuano.
          </p>
        </div>
      </section>

      <main className="app-main" id="panel">
        <ListaDesembarques />
      </main>

      <footer className="app-footer">
        <p>© 2026 Pesquera Talcahuano Sur SpA — Region del Biobio</p>
      </footer>
    </div>
  )
}

export default App
