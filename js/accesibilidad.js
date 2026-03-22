/* ================================================
   SISTEMA POLICIAL RD — accesibilidad.js
   Módulo completo de accesibilidad
   Cumple con WCAG 2.1 AA
   Incluye:
     1. Panel de accesibilidad
     2. Alto contraste
     3. Modo daltónico
     4. Ajuste de tamaño de texto
     5. Navegación por teclado
     6. Lector de pantalla (anuncios)
     7. Reducir animaciones
     8. Cursor grande
     9. Guía de foco visible
    10. Persistencia de preferencias
================================================ */


/* ================================================
   1. ESTADO DE ACCESIBILIDAD
================================================ */
const A11yState = {
  altoContraste:      false,
  daltonico:          false,
  tiposDaltonismo:    "ninguno", // protanopia, deuteranopia, tritanopia
  tamanoTexto:        "normal",  // pequeno, normal, grande, extragrande
  reducirAnimaciones: false,
  cursorGrande:       false,
  panelVisible:       false,
  lectorActivo:       false,
};


/* ================================================
   2. INICIALIZACIÓN DEL MÓDULO
================================================ */
function iniciarAccesibilidad() {
  cargarPreferencias();
  crearBotonAccesibilidad();
  crearPanelAccesibilidad();
  aplicarTodasLasPreferencias();
  iniciarNavegacionTeclado();
  iniciarAnunciosLector();
  console.log("✅ Módulo de accesibilidad iniciado");
}


/* ================================================
   3. CARGAR / GUARDAR PREFERENCIAS
================================================ */
function cargarPreferencias() {
  const guardado = localStorage.getItem("a11y-policial");
  if (guardado) {
    try {
      const prefs = JSON.parse(guardado);
      Object.assign(A11yState, prefs);
    } catch (e) {
      console.warn("Error cargando preferencias de accesibilidad");
    }
  }
}

function guardarPreferencias() {
  localStorage.setItem("a11y-policial", JSON.stringify(A11yState));
}


/* ================================================
   4. BOTÓN FLOTANTE DE ACCESIBILIDAD
================================================ */
function crearBotonAccesibilidad() {
  const btn = document.createElement("button");
  btn.id = "btn-a11y";
  btn.className = "btn-a11y-flotante";
  btn.setAttribute("aria-label", "Abrir panel de accesibilidad");
  btn.setAttribute("title", "Opciones de Accesibilidad");
  btn.setAttribute("aria-haspopup", "dialog");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = `
    <span class="btn-a11y__icon" aria-hidden="true">♿</span>
    <span class="btn-a11y__label">Accesibilidad</span>
  `;

  btn.addEventListener("click", () => {
    togglePanel();
  });

  document.body.appendChild(btn);
}


/* ================================================
   5. PANEL COMPLETO DE ACCESIBILIDAD
================================================ */
function crearPanelAccesibilidad() {
  const panel = document.createElement("div");
  panel.id = "panel-a11y";
  panel.className = "panel-a11y";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "panel-a11y-titulo");
  panel.hidden = true;

  panel.innerHTML = `
    <div class="panel-a11y__inner">

      <!-- Header del panel -->
      <div class="panel-a11y__header">
        <div class="panel-a11y__titulo-wrap">
          <span aria-hidden="true" style="font-size:1.3rem;">♿</span>
          <h2 id="panel-a11y-titulo" class="panel-a11y__titulo">Opciones de Accesibilidad</h2>
        </div>
        <button
          id="btn-cerrar-a11y"
          class="panel-a11y__cerrar"
          aria-label="Cerrar panel de accesibilidad"
        >✕</button>
      </div>

      <!-- Descripción -->
      <p class="panel-a11y__desc">
        Personaliza la interfaz según tus necesidades visuales, motoras o cognitivas.
      </p>

      <div class="panel-a11y__contenido">

        <!-- ===== SECCIÓN: VISIÓN ===== -->
        <div class="a11y-seccion">
          <h3 class="a11y-seccion__titulo">
            <span aria-hidden="true">👁️</span> Visión
          </h3>

          <!-- Alto contraste -->
          <div class="a11y-opcion">
            <div class="a11y-opcion__info">
              <label class="a11y-opcion__label" for="toggle-contraste">
                Alto Contraste
              </label>
              <span class="a11y-opcion__desc">
                Aumenta el contraste entre texto y fondo
              </span>
            </div>
            <button
              id="toggle-contraste"
              class="a11y-toggle"
              role="switch"
              aria-checked="false"
              aria-label="Activar alto contraste"
            >
              <span class="a11y-toggle__thumb"></span>
            </button>
          </div>

          <!-- Modo daltónico -->
          <div class="a11y-opcion">
            <div class="a11y-opcion__info">
              <label class="a11y-opcion__label" for="select-daltonico">
                Modo Daltónico
              </label>
              <span class="a11y-opcion__desc">
                Ajusta los colores para diferentes tipos de daltonismo
              </span>
            </div>
            <select
              id="select-daltonico"
              class="a11y-select"
              aria-label="Tipo de daltonismo"
            >
              <option value="ninguno">Sin filtro</option>
              <option value="protanopia">Protanopia (rojo)</option>
              <option value="deuteranopia">Deuteranopia (verde)</option>
              <option value="tritanopia">Tritanopia (azul)</option>
              <option value="achromatopsia">Acromatopsia (sin color)</option>
            </select>
          </div>

        </div>


        <!-- ===== SECCIÓN: TEXTO ===== -->
        <div class="a11y-seccion">
          <h3 class="a11y-seccion__titulo">
            <span aria-hidden="true">🔤</span> Tamaño de Texto
          </h3>

          <div class="a11y-opcion">
            <div class="a11y-opcion__info">
              <label class="a11y-opcion__label">
                Tamaño de fuente
              </label>
              <span class="a11y-opcion__desc" id="texto-size-label">
                Normal (100%)
              </span>
            </div>
          </div>

          <!-- Botones de tamaño -->
          <div class="a11y-tamano-btns" role="group" aria-label="Seleccionar tamaño de texto">
            <button class="a11y-tamano-btn" data-size="pequeno"    aria-label="Texto pequeño">A<small>-</small></button>
            <button class="a11y-tamano-btn a11y-tamano-btn--active" data-size="normal" aria-label="Texto normal" aria-pressed="true">A</button>
            <button class="a11y-tamano-btn" data-size="grande"     aria-label="Texto grande">A<sup>+</sup></button>
            <button class="a11y-tamano-btn" data-size="extragrande" aria-label="Texto extra grande">A<sup>++</sup></button>
          </div>

        </div>


        <!-- ===== SECCIÓN: MOVIMIENTO ===== -->
        <div class="a11y-seccion">
          <h3 class="a11y-seccion__titulo">
            <span aria-hidden="true">🎭</span> Movimiento
          </h3>

          <!-- Reducir animaciones -->
          <div class="a11y-opcion">
            <div class="a11y-opcion__info">
              <label class="a11y-opcion__label" for="toggle-animaciones">
                Reducir Animaciones
              </label>
              <span class="a11y-opcion__desc">
                Elimina transiciones y efectos visuales
              </span>
            </div>
            <button
              id="toggle-animaciones"
              class="a11y-toggle"
              role="switch"
              aria-checked="false"
              aria-label="Reducir animaciones"
            >
              <span class="a11y-toggle__thumb"></span>
            </button>
          </div>

        </div>


        <!-- ===== SECCIÓN: NAVEGACIÓN ===== -->
        <div class="a11y-seccion">
          <h3 class="a11y-seccion__titulo">
            <span aria-hidden="true">⌨️</span> Navegación
          </h3>

          <!-- Cursor grande -->
          <div class="a11y-opcion">
            <div class="a11y-opcion__info">
              <label class="a11y-opcion__label" for="toggle-cursor">
                Cursor Grande
              </label>
              <span class="a11y-opcion__desc">
                Aumenta el tamaño del cursor del mouse
              </span>
            </div>
            <button
              id="toggle-cursor"
              class="a11y-toggle"
              role="switch"
              aria-checked="false"
              aria-label="Activar cursor grande"
            >
              <span class="a11y-toggle__thumb"></span>
            </button>
          </div>

          <!-- Lector de pantalla -->
          <div class="a11y-opcion">
            <div class="a11y-opcion__info">
              <label class="a11y-opcion__label" for="toggle-lector">
                Anuncios de Voz
              </label>
              <span class="a11y-opcion__desc">
                Anuncia acciones importantes en voz alta
              </span>
            </div>
            <button
              id="toggle-lector"
              class="a11y-toggle"
              role="switch"
              aria-checked="false"
              aria-label="Activar anuncios de voz"
            >
              <span class="a11y-toggle__thumb"></span>
            </button>
          </div>

          <!-- Atajos de teclado -->
          <div class="a11y-atajos">
            <h4 class="a11y-atajos__titulo">Atajos de Teclado</h4>
            <ul class="a11y-atajos__lista" role="list">
              <li><kbd>Alt + A</kbd> Abrir panel accesibilidad</li>
              <li><kbd>Alt + D</kbd> Ir al Dashboard</li>
              <li><kbd>Alt + C</kbd> Ir a Casos</li>
              <li><kbd>Alt + P</kbd> Ir a Patrullas</li>
              <li><kbd>Alt + M</kbd> Ir a Mapa</li>
              <li><kbd>Tab</kbd> Navegar entre elementos</li>
              <li><kbd>Enter / Space</kbd> Activar elemento</li>
              <li><kbd>Esc</kbd> Cerrar panel / modal</li>
            </ul>
          </div>

        </div>


        <!-- ===== SECCIÓN: IDIOMA ===== -->
        <div class="a11y-seccion">
          <h3 class="a11y-seccion__titulo">
            <span aria-hidden="true">🌐</span> Idioma / Language
          </h3>

          <div class="a11y-idioma-btns" role="group" aria-label="Seleccionar idioma">
            <button class="a11y-idioma-btn a11y-idioma-btn--active" data-lang="es" aria-pressed="true" aria-label="Español">
              🇩🇴 Español
            </button>
            <button class="a11y-idioma-btn" data-lang="en" aria-pressed="false" aria-label="English">
              🇺🇸 English
            </button>
          </div>
        </div>

      </div>


      <!-- Footer del panel -->
      <div class="panel-a11y__footer">
        <button class="btn-a11y-reset" id="btn-reset-a11y" aria-label="Restablecer todas las opciones de accesibilidad">
          🔄 Restablecer todo
        </button>
        <span class="panel-a11y__wcag">WCAG 2.1 AA</span>
      </div>

    </div>
  `;

  document.body.appendChild(panel);
  iniciarEventosPanel();
}


/* ================================================
   6. EVENTOS DEL PANEL
================================================ */
function iniciarEventosPanel() {

  // Cerrar panel
  document.getElementById("btn-cerrar-a11y")?.addEventListener("click", () => {
    cerrarPanel();
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const panel = document.getElementById("panel-a11y");
      if (panel && !panel.hidden) cerrarPanel();
    }
  });

  // Alto contraste
  document.getElementById("toggle-contraste")?.addEventListener("click", (e) => {
    A11yState.altoContraste = !A11yState.altoContraste;
    actualizarToggle(e.currentTarget, A11yState.altoContraste);
    aplicarAltoContraste();
    anunciar(A11yState.altoContraste ? "Alto contraste activado" : "Alto contraste desactivado");
    guardarPreferencias();
  });

  // Modo daltónico
  document.getElementById("select-daltonico")?.addEventListener("change", (e) => {
    A11yState.tiposDaltonismo = e.target.value;
    A11yState.daltonico = e.target.value !== "ninguno";
    aplicarModoDaltonico();
    anunciar(`Modo daltónico: ${e.target.options[e.target.selectedIndex].text}`);
    guardarPreferencias();
  });

  // Tamaño de texto
  document.querySelectorAll(".a11y-tamano-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const size = btn.dataset.size;
      A11yState.tamanoTexto = size;

      document.querySelectorAll(".a11y-tamano-btn").forEach(b => {
        b.classList.remove("a11y-tamano-btn--active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("a11y-tamano-btn--active");
      btn.setAttribute("aria-pressed", "true");

      aplicarTamanoTexto();
      guardarPreferencias();
    });
  });

  // Reducir animaciones
  document.getElementById("toggle-animaciones")?.addEventListener("click", (e) => {
    A11yState.reducirAnimaciones = !A11yState.reducirAnimaciones;
    actualizarToggle(e.currentTarget, A11yState.reducirAnimaciones);
    aplicarReducirAnimaciones();
    anunciar(A11yState.reducirAnimaciones ? "Animaciones reducidas" : "Animaciones activadas");
    guardarPreferencias();
  });

  // Cursor grande
  document.getElementById("toggle-cursor")?.addEventListener("click", (e) => {
    A11yState.cursorGrande = !A11yState.cursorGrande;
    actualizarToggle(e.currentTarget, A11yState.cursorGrande);
    aplicarCursorGrande();
    anunciar(A11yState.cursorGrande ? "Cursor grande activado" : "Cursor grande desactivado");
    guardarPreferencias();
  });

  // Lector de pantalla
  document.getElementById("toggle-lector")?.addEventListener("click", (e) => {
    A11yState.lectorActivo = !A11yState.lectorActivo;
    actualizarToggle(e.currentTarget, A11yState.lectorActivo);
    anunciar(A11yState.lectorActivo ? "Anuncios de voz activados" : "Anuncios de voz desactivados");
    guardarPreferencias();
  });

  // Botones de idioma
  document.querySelectorAll(".a11y-idioma-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      document.querySelectorAll(".a11y-idioma-btn").forEach(b => {
        b.classList.remove("a11y-idioma-btn--active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("a11y-idioma-btn--active");
      btn.setAttribute("aria-pressed", "true");

      if (typeof i18n !== "undefined") {
        i18n.setLang(lang);
        if (typeof cargarModulo !== "undefined" && typeof AppState !== "undefined") {
          cargarModulo(AppState.moduloActual);
        }
      }
      anunciar(lang === "es" ? "Idioma: Español" : "Language: English");
    });
  });

  // Restablecer todo
  document.getElementById("btn-reset-a11y")?.addEventListener("click", () => {
    resetearAccesibilidad();
    anunciar("Todas las opciones de accesibilidad han sido restablecidas");
  });
}


/* ================================================
   7. TOGGLE DEL PANEL
================================================ */
function togglePanel() {
  const panel = document.getElementById("panel-a11y");
  const btn   = document.getElementById("btn-a11y");
  if (!panel) return;

  if (panel.hidden) {
    abrirPanel();
  } else {
    cerrarPanel();
  }
}

function abrirPanel() {
  const panel = document.getElementById("panel-a11y");
  const btn   = document.getElementById("btn-a11y");
  if (!panel) return;

  panel.hidden = false;
  panel.style.display = "flex";
  A11yState.panelVisible = true;
  btn?.setAttribute("aria-expanded", "true");

  // Enfocar el panel para accesibilidad
  setTimeout(() => {
    document.getElementById("btn-cerrar-a11y")?.focus();
  }, 100);

  anunciar("Panel de accesibilidad abierto");
}

function cerrarPanel() {
  const panel = document.getElementById("panel-a11y");
  const btn   = document.getElementById("btn-a11y");
  if (!panel) return;

  panel.hidden = true;
  panel.style.display = "none";
  A11yState.panelVisible = false;
  btn?.setAttribute("aria-expanded", "false");

  // Devolver foco al botón
  btn?.focus();
  anunciar("Panel de accesibilidad cerrado");
}


/* ================================================
   8. APLICAR PREFERENCIAS
================================================ */
function aplicarTodasLasPreferencias() {
  aplicarAltoContraste();
  aplicarModoDaltonico();
  aplicarTamanoTexto();
  aplicarReducirAnimaciones();
  aplicarCursorGrande();
  sincronizarEstadoUI();
}

// Alto contraste
function aplicarAltoContraste() {
  const body = document.getElementById("app-body") || document.body;
  body.classList.toggle("a11y-alto-contraste", A11yState.altoContraste);
}

// Modo daltónico
function aplicarModoDaltonico() {
  const body = document.getElementById("app-body") || document.body;

  // Remover clases anteriores
  body.classList.remove(
    "a11y-protanopia",
    "a11y-deuteranopia",
    "a11y-tritanopia",
    "a11y-achromatopsia"
  );

  if (A11yState.tiposDaltonismo !== "ninguno") {
    body.classList.add(`a11y-${A11yState.tiposDaltonismo}`);
  }
}

// Tamaño de texto
function aplicarTamanoTexto() {
  const root = document.documentElement;
  const tamanosMap = {
    pequeno:     "12px",
    normal:      "14px",
    grande:      "17px",
    extragrande: "20px",
  };

  const labelsMap = {
    pequeno:     "Pequeño (85%)",
    normal:      "Normal (100%)",
    grande:      "Grande (120%)",
    extragrande: "Extra Grande (140%)",
  };

  root.style.fontSize = tamanosMap[A11yState.tamanoTexto] || "14px";

  const label = document.getElementById("texto-size-label");
  if (label) label.textContent = labelsMap[A11yState.tamanoTexto] || "Normal (100%)";
}

// Reducir animaciones
function aplicarReducirAnimaciones() {
  const body = document.getElementById("app-body") || document.body;
  body.classList.toggle("a11y-sin-animaciones", A11yState.reducirAnimaciones);
}

// Cursor grande
function aplicarCursorGrande() {
  const body = document.getElementById("app-body") || document.body;
  body.classList.toggle("a11y-cursor-grande", A11yState.cursorGrande);
}

// Sincronizar estado visual de los toggles
function sincronizarEstadoUI() {
  const toggleContraste   = document.getElementById("toggle-contraste");
  const toggleAnimaciones = document.getElementById("toggle-animaciones");
  const toggleCursor      = document.getElementById("toggle-cursor");
  const toggleLector      = document.getElementById("toggle-lector");
  const selectDaltonico   = document.getElementById("select-daltonico");

  if (toggleContraste)   actualizarToggle(toggleContraste,   A11yState.altoContraste);
  if (toggleAnimaciones) actualizarToggle(toggleAnimaciones, A11yState.reducirAnimaciones);
  if (toggleCursor)      actualizarToggle(toggleCursor,      A11yState.cursorGrande);
  if (toggleLector)      actualizarToggle(toggleLector,      A11yState.lectorActivo);
  if (selectDaltonico)   selectDaltonico.value = A11yState.tiposDaltonismo;

  // Tamaño de texto
  document.querySelectorAll(".a11y-tamano-btn").forEach(btn => {
    const activo = btn.dataset.size === A11yState.tamanoTexto;
    btn.classList.toggle("a11y-tamano-btn--active", activo);
    btn.setAttribute("aria-pressed", activo ? "true" : "false");
  });

  // Idioma
  document.querySelectorAll(".a11y-idioma-btn").forEach(btn => {
    const activo = btn.dataset.lang === (typeof i18n !== "undefined" ? i18n.getLang() : "es");
    btn.classList.toggle("a11y-idioma-btn--active", activo);
    btn.setAttribute("aria-pressed", activo ? "true" : "false");
  });
}

// Actualizar estado visual del toggle
function actualizarToggle(btn, activo) {
  if (!btn) return;
  btn.setAttribute("aria-checked", activo ? "true" : "false");
  btn.classList.toggle("a11y-toggle--activo", activo);
}


/* ================================================
   9. RESETEAR ACCESIBILIDAD
================================================ */
function resetearAccesibilidad() {
  A11yState.altoContraste      = false;
  A11yState.daltonico          = false;
  A11yState.tiposDaltonismo    = "ninguno";
  A11yState.tamanoTexto        = "normal";
  A11yState.reducirAnimaciones = false;
  A11yState.cursorGrande       = false;
  A11yState.lectorActivo       = false;

  aplicarTodasLasPreferencias();
  guardarPreferencias();
}


/* ================================================
   10. LECTOR DE PANTALLA (ANUNCIOS)
================================================ */
let regionAnuncios = null;

function iniciarAnunciosLector() {
  regionAnuncios = document.createElement("div");
  regionAnuncios.id = "a11y-anuncios";
  regionAnuncios.setAttribute("role", "status");
  regionAnuncios.setAttribute("aria-live", "polite");
  regionAnuncios.setAttribute("aria-atomic", "true");
  regionAnuncios.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(regionAnuncios);
}

function anunciar(mensaje) {
  if (!regionAnuncios) return;

  // Limpiar y anunciar
  regionAnuncios.textContent = "";
  setTimeout(() => {
    regionAnuncios.textContent = mensaje;

    // Si el lector de voz está activo, usar Web Speech API
    if (A11yState.lectorActivo && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(mensaje);
      utterance.lang  = typeof i18n !== "undefined" ? (i18n.getLang() === "es" ? "es-DO" : "en-US") : "es-DO";
      utterance.rate  = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, 100);
}


/* ================================================
   11. NAVEGACIÓN POR TECLADO
================================================ */
function iniciarNavegacionTeclado() {

  // Atajos de teclado globales
  document.addEventListener("keydown", (e) => {

    // Alt + A → Panel de accesibilidad
    if (e.altKey && e.key === "a") {
      e.preventDefault();
      togglePanel();
      return;
    }

    // Solo si el usuario ya hizo login
    if (typeof AppState === "undefined" || !AppState.usuario) return;

    // Alt + D → Dashboard
    if (e.altKey && e.key === "d") {
      e.preventDefault();
      if (typeof cargarModulo === "function") {
        cargarModulo("dashboard");
        anunciar("Navegando al Dashboard");
      }
    }

    // Alt + C → Casos
    if (e.altKey && e.key === "c") {
      e.preventDefault();
      if (typeof cargarModulo === "function") {
        cargarModulo("casos");
        anunciar("Navegando a Gestión de Casos");
      }
    }

    // Alt + P → Patrullas
    if (e.altKey && e.key === "p") {
      e.preventDefault();
      if (typeof cargarModulo === "function") {
        cargarModulo("patrullas");
        anunciar("Navegando a Patrullas");
      }
    }

    // Alt + M → Mapa
    if (e.altKey && e.key === "m") {
      e.preventDefault();
      if (typeof cargarModulo === "function") {
        cargarModulo("mapa");
        anunciar("Navegando al Mapa de Riesgo");
      }
    }

    // Alt + I → Incidentes
    if (e.altKey && e.key === "i") {
      e.preventDefault();
      if (typeof cargarModulo === "function") {
        cargarModulo("incidentes");
        anunciar("Navegando a Incidentes");
      }
    }

    // Alt + R → Reportes
    if (e.altKey && e.key === "r") {
      e.preventDefault();
      if (typeof cargarModulo === "function") {
        cargarModulo("reportes");
        anunciar("Navegando a Reportes");
      }
    }

  });

  // Mejorar la visibilidad del foco
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("a11y-usando-teclado");
    }
  });

  document.addEventListener("mousedown", () => {
    document.body.classList.remove("a11y-usando-teclado");
  });
}


/* ================================================
   12. ESTILOS CSS DEL PANEL (inyectados dinámicamente)
================================================ */
function inyectarEstilosAccesibilidad() {
  const style = document.createElement("style");
  style.id = "estilos-a11y";
  style.textContent = `

    /* ===== BOTÓN FLOTANTE ===== */
    .btn-a11y-flotante {
      position: fixed;
      bottom: 1.5rem;
      left: 1.5rem;
      z-index: 900;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background-color: var(--color-accent);
      color: #ffffff;
      border: none;
      border-radius: 30px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
      transition: all 0.2s;
      font-family: 'Inter', sans-serif;
    }

    .btn-a11y-flotante:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
    }

    .btn-a11y-flotante:focus-visible {
      outline: 3px solid #ffffff;
      outline-offset: 2px;
    }

    .btn-a11y__icon { font-size: 1rem; }

    /* ===== PANEL ===== */
    .panel-a11y {
      position: fixed;
      bottom: 5rem;
      left: 1.5rem;
      z-index: 950;
      width: 360px;
      max-height: 80vh;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.25s ease;
    }

    .panel-a11y__inner {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .panel-a11y__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .panel-a11y__titulo-wrap {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .panel-a11y__titulo {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0;
    }

    .panel-a11y__cerrar {
      background: none;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-text-muted);
      font-size: 0.9rem;
      transition: all 0.15s;
    }

    .panel-a11y__cerrar:hover {
      background-color: var(--color-hover);
      color: var(--color-text);
    }

    .panel-a11y__desc {
      font-size: 0.78rem;
      color: var(--color-text-muted);
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
      line-height: 1.5;
    }

    .panel-a11y__contenido {
      flex: 1;
      overflow-y: auto;
      padding: 0.75rem 1.25rem;
    }

    .panel-a11y__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.25rem;
      border-top: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .panel-a11y__wcag {
      font-size: 0.7rem;
      color: var(--color-text-muted);
      background-color: var(--color-surface-2);
      padding: 2px 8px;
      border-radius: 10px;
      border: 1px solid var(--color-border);
    }

    /* ===== SECCIONES ===== */
    .a11y-seccion {
      margin-bottom: 1.25rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--color-border);
    }

    .a11y-seccion:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .a11y-seccion__titulo {
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-accent);
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    /* ===== OPCIONES ===== */
    .a11y-opcion {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .a11y-opcion__info { flex: 1; }

    .a11y-opcion__label {
      display: block;
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--color-text);
      cursor: pointer;
    }

    .a11y-opcion__desc {
      display: block;
      font-size: 0.72rem;
      color: var(--color-text-muted);
      margin-top: 2px;
      line-height: 1.4;
    }

    /* ===== TOGGLE SWITCH ===== */
    .a11y-toggle {
      position: relative;
      width: 44px;
      height: 24px;
      border-radius: 12px;
      border: 2px solid var(--color-border);
      background-color: var(--color-surface-2);
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .a11y-toggle__thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: var(--color-text-muted);
      transition: transform 0.2s, background-color 0.2s;
    }

    .a11y-toggle--activo {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
    }

    .a11y-toggle--activo .a11y-toggle__thumb {
      transform: translateX(20px);
      background-color: #ffffff;
    }

    /* ===== SELECT ===== */
    .a11y-select {
      padding: 0.4rem 0.75rem;
      background-color: var(--color-input-bg);
      border: 1px solid var(--color-border);
      border-radius: 6px;
      color: var(--color-text);
      font-size: 0.78rem;
      cursor: pointer;
      flex-shrink: 0;
      max-width: 160px;
    }

    /* ===== BOTONES TAMAÑO ===== */
    .a11y-tamano-btns {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .a11y-tamano-btn {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      background-color: var(--color-surface-2);
      color: var(--color-text-muted);
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      transition: all 0.15s;
      text-align: center;
    }

    .a11y-tamano-btn:hover {
      border-color: var(--color-accent);
      color: var(--color-text);
    }

    .a11y-tamano-btn--active {
      border-color: var(--color-accent);
      background-color: var(--color-accent-subtle);
      color: var(--color-accent);
    }

    /* ===== ATAJOS ===== */
    .a11y-atajos {
      margin-top: 0.75rem;
      padding: 0.75rem;
      background-color: var(--color-surface-2);
      border-radius: 8px;
      border: 1px solid var(--color-border);
    }

    .a11y-atajos__titulo {
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.5rem;
    }

    .a11y-atajos__lista {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      font-size: 0.72rem;
      color: var(--color-text-muted);
    }

    .a11y-atajos__lista li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    kbd {
      display: inline-flex;
      align-items: center;
      padding: 1px 6px;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.7rem;
      color: var(--color-text);
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* ===== BOTONES IDIOMA ===== */
    .a11y-idioma-btns {
      display: flex;
      gap: 0.5rem;
    }

    .a11y-idioma-btn {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      background-color: var(--color-surface-2);
      color: var(--color-text-muted);
      cursor: pointer;
      font-size: 0.78rem;
      font-family: 'Inter', sans-serif;
      transition: all 0.15s;
    }

    .a11y-idioma-btn--active {
      border-color: var(--color-accent);
      background-color: var(--color-accent-subtle);
      color: var(--color-accent);
    }

    /* ===== RESET ===== */
    .btn-a11y-reset {
      background: none;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      padding: 0.35rem 0.75rem;
      font-size: 0.75rem;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all 0.15s;
      font-family: 'Inter', sans-serif;
    }

    .btn-a11y-reset:hover {
      background-color: var(--color-hover);
      color: var(--color-text);
    }


    /* ===== MODOS DE ACCESIBILIDAD ===== */

    /* Alto contraste */
    .a11y-alto-contraste {
      filter: contrast(1.5) !important;
    }

    .a11y-alto-contraste .card,
    .a11y-alto-contraste .stat-card {
      border-width: 2px !important;
      border-color: var(--color-text) !important;
    }

    /* Filtros para daltonismo */
    .a11y-protanopia {
      filter: url('#filtro-protanopia');
    }

    .a11y-deuteranopia {
      filter: url('#filtro-deuteranopia');
    }

    .a11y-tritanopia {
      filter: url('#filtro-tritanopia');
    }

    .a11y-achromatopsia {
      filter: grayscale(100%);
    }

    /* Sin animaciones */
    .a11y-sin-animaciones *,
    .a11y-sin-animaciones *::before,
    .a11y-sin-animaciones *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }

    /* Cursor grande */
    .a11y-cursor-grande,
    .a11y-cursor-grande * {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M8 2L8 26L14 20L18 28L21 27L17 19L24 19Z' fill='white' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E") 8 2, auto !important;
    }

    /* Foco visible mejorado para usuarios de teclado */
    .a11y-usando-teclado *:focus {
      outline: 3px solid var(--color-accent) !important;
      outline-offset: 3px !important;
      border-radius: 4px !important;
    }

  `;

  document.head.appendChild(style);

  // SVG Filters para daltonismo (ocultos visualmente)
  const svgFilters = document.createElement("div");
  svgFilters.style.cssText = "position:absolute; width:0; height:0; overflow:hidden;";
  svgFilters.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" style="display:none;">
      <defs>
        <!-- Protanopia (ceguera rojo) -->
        <filter id="filtro-protanopia">
          <feColorMatrix type="matrix"
            values="0.567 0.433 0     0 0
                    0.558 0.442 0     0 0
                    0     0.242 0.758 0 0
                    0     0     0     1 0"/>
        </filter>
        <!-- Deuteranopia (ceguera verde) -->
        <filter id="filtro-deuteranopia">
          <feColorMatrix type="matrix"
            values="0.625 0.375 0   0 0
                    0.7   0.3   0   0 0
                    0     0.3   0.7 0 0
                    0     0     0   1 0"/>
        </filter>
        <!-- Tritanopia (ceguera azul) -->
        <filter id="filtro-tritanopia">
          <feColorMatrix type="matrix"
            values="0.95 0.05  0    0 0
                    0    0.433 0.567 0 0
                    0    0.475 0.525 0 0
                    0    0     0     1 0"/>
        </filter>
      </defs>
    </svg>
  `;
  document.body.appendChild(svgFilters);
}


/* ================================================
   INICIAR TODO AL CARGAR LA PÁGINA
================================================ */
document.addEventListener("DOMContentLoaded", () => {
  inyectarEstilosAccesibilidad();
  iniciarAccesibilidad();
});