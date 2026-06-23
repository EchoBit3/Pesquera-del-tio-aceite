import './App.css'
import ListaDesembarques from './features/desembarques/ListaDesembarques'

function App() {
  return (
    <div className="app">
      <header>
      <nav className="navbar">
        <span className="navbar__logo">Pesquera Talcahuano Sur SpA</span>
        <ul className="navbar__links">
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Panel</a></li>
          <li><a href="#">Embarcaciones</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </nav>
      </header>

      <section className="hero">
        <div className="hero__contenido">
          <span className="hero__eyebrow">Bahia de Talcahuano, Region del Biobio</span>
          <h1 className="hero__titulo">Control de Desembarques</h1>
          <p className="hero__subtitulo">
            Panel operativo para la gestion de lotes de recursos pelagicos
            capturados en la bahia de Talcahuano.
          </p>
        </div>
      </section>

      <main className="app-main">
        <ListaDesembarques />
      </main>
    </div>
  )
}

export default App
