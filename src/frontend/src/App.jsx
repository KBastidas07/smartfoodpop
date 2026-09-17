import { useState } from 'react'

const initialForm = {
  nombre: '',
  correo: '',
  celular: '',
  contraseña: '',
}

function App() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setStatus({ type: '', text: '' })
  }

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setForm(initialForm)
    setStatus({ type: '', text: '' })
  }

  const submitForm = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus({ type: '', text: '' })

    const endpoint = isRegister
      ? '/api/inicioSesion/registrarUsuario'
      : '/api/inicioSesion/iniciarSesion'
    const payload = isRegister ? form : { correo: form.correo, contraseña: form.contraseña }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No pudimos completar la solicitud.')
      }

      if (data.token) {
        localStorage.setItem('smartfoodpop_token', data.token)
      }

      setStatus({ type: 'success', text: data.message })
      if (isRegister) {
        setForm(initialForm)
      }
    } catch (error) {
      setStatus({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-shell">
      <section className="brand-panel" aria-label="SmartFoodPop">
        <div className="brand-mark" aria-hidden="true">
          <span>sf</span>
        </div>
        <p className="eyebrow">Gestión inteligente</p>
        <h1>Alimenta mejor tu operación.</h1>
        <p className="brand-copy">
          Un espacio simple para organizar tu experiencia SmartFoodPop desde el primer acceso.
        </p>
        <div className="brand-note">
          <span className="note-dot" />
          Hecho para avanzar sin fricción
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-header">
          <p className="eyebrow">Bienvenido</p>
          <h2>{isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}</h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Regístrate para comenzar a usar SmartFoodPop.'
              : 'Ingresa tus datos para continuar.'}
          </p>
        </div>

        <div className="mode-switch" role="tablist" aria-label="Tipo de acceso">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => changeMode('login')}
            role="tab"
            aria-selected={mode === 'login'}
            type="button"
          >
            Iniciar sesión
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => changeMode('register')}
            role="tab"
            aria-selected={mode === 'register'}
            type="button"
          >
            Registrarme
          </button>
        </div>

        <form onSubmit={submitForm}>
          {isRegister && (
            <label>
              Nombre completo
              <input name="nombre" value={form.nombre} onChange={updateField} placeholder="Juan Pérez" required />
            </label>
          )}

          <label>
            Correo electrónico
            <input name="correo" type="email" value={form.correo} onChange={updateField} placeholder="tu@correo.com" required />
          </label>

          {isRegister && (
            <label>
              Celular
              <input name="celular" type="tel" value={form.celular} onChange={updateField} placeholder="300 123 4567" required />
            </label>
          )}

          <label>
            Contraseña
            <input name="contraseña" type="password" value={form.contraseña} onChange={updateField} placeholder="••••••••" required />
          </label>

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Procesando...' : isRegister ? 'Crear cuenta' : 'Entrar'}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>

        {status.text && <p className={`status-message ${status.type}`}>{status.text}</p>}

        <p className="legal-copy">Al continuar aceptas los términos de uso y la política de privacidad.</p>
      </section>
    </main>
  )
}

export default App
