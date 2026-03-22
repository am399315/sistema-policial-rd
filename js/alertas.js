/* ================================================
   SISTEMA POLICIAL RD — alertas.js
   Sistema de Alertas en Tiempo Real
   Incluye:
     1. Generación automática de alertas
     2. Panel de notificaciones
     3. Alertas sonoras
     4. Historial de alertas del turno
     5. Contador de no leídas
     6. Niveles de prioridad
================================================ */


/* ================================================
   1. ESTADO DEL SISTEMA DE ALERTAS
================================================ */
const AlertasState = {
  alertas:          [],
  noLeidas:         0,
  panelVisible:     false,
  sonidoActivo:     true,
  intervaloAlertas: null,
  maxAlertas:       50,
};


/* ================================================
   2. TIPOS DE ALERTAS
================================================ */
const tiposAlertas = [
  { tipo: "critico",  icono: "🚨", label: "Crítico",   color: "#7c3aed", sonido: 3 },
  { tipo: "alto",     icono: "🔴", label: "Alto",       color: "#ef4444", sonido: 2 },
  { tipo: "medio",    icono: "🟡", label: "Medio",      color: "#f59e0b", sonido: 1 },
  { tipo: "info",     icono: "🔵", label: "Info",       color: "#3b82f6", sonido: 0 },
  { tipo: "success",  icono: "🟢", label: "Resuelto",   color: "#22c55e", sonido: 0 },
];

// Mensajes simulados de alertas reales de RD
const mensajesAlertas = {
  critico: [
    "🚨 Tiroteo activo en sector Los Guandules — Unidades requeridas",
    "🚨 Secuestro en progreso — Carretera Duarte Km 14",
    "🚨 Alerta máxima: Zona Villa Consuelo — Múltiples incidentes",
    "🚨 Oficial herido en servicio — Requiere evacuación inmediata",
  ],
  alto: [
    "🔴 Robo a mano armada — Centro Comercial Sambil",
    "🔴 Persecución vehicular activa — Av. 27 de Febrero",
    "🔴 Disturbio masivo — Parque Independencia",
    "🔴 Vehículo robado localizado — SDE Sector Alma Rosa",
    "🔴 Alerta narcotráfico — Puerto de Haina",
  ],
  medio: [
    "🟡 Accidente de tránsito — Autopista Duarte Km 8, heridos leves",
    "🟡 Violencia doméstica reportada — Sector Naco",
    "🟡 Robo de vehículo — Estacionamiento Plaza Central",
    "🟡 Incidente en proceso — Zona Colonial",
    "🟡 Patrulla PAT-003 requiere apoyo — Los Alcarrizos",
  ],
  info: [
    "🔵 Patrulla Alpha completó ronda — Distrito Nacional Norte",
    "🔵 Detenido procesado — DET-006 enviado a fiscalía",
    "🔵 Caso CASO-2025-003 cerrado exitosamente",
    "🔵 Nuevo oficial asignado — Unidad Motorizada",
    "🔵 Reporte mensual disponible para revisión",
    "🔵 Sistema actualizado — Datos de patrullas sincronizados",
  ],
  success: [
    "🟢 Incidente INC-002 resuelto — Autopista Duarte despejada",
    "🟢 Sospechoso capturado — Caso CASO-2025-006 actualizado",
    "🟢 Patrulla Bravo regresó a base sin novedades",
    "🟢 Zona Colonial — Situación normalizada",
  ],
};


/* ================================================
   3. INICIALIZACIÓN
================================================ */
function iniciarSistemaAlertas() {
  crearPanelAlertas();
  crearBotonAlertas();
  inyectarEstilosAlertas();

  // Agregar alertas iniciales del turno
  agregarAlertaInicial();

  // Iniciar generación automática de alertas
  iniciarAlertasAutomaticas();

  console.log("✅ Sistema de alertas iniciado");
}


/* ================================================
   4. AGREGAR ALERTA
================================================ */
function agregarAlerta(tipo, mensaje, reproducirSonido = true) {
  const config = tiposAlertas.find(t => t.tipo === tipo) || tiposAlertas[3];
  const ahora  = new Date();

  const alerta = {
    id:       `ALT-${Date.now()}`,
    tipo,
    icono:    config.icono,
    label:    config.label,
    color:    config.color,
    mensaje,
    hora:     ahora.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    fecha:    ahora.toLocaleDateString("es-DO", { day: "numeric", month: "short" }),
    leida:    false,
    timestamp: ahora.getTime(),
  };

  // Agregar al inicio de la lista
  AlertasState.alertas.unshift(alerta);
  AlertasState.noLeidas++;

  // Limitar el historial
  if (AlertasState.alertas.length > AlertasState.maxAlertas) {
    AlertasState.alertas = AlertasState.alertas.slice(0, AlertasState.maxAlertas);
  }

  // Actualizar contador
  actualizarContadorAlertas();

  // Renderizar en el panel si está visible
  if (AlertasState.panelVisible) {
    renderizarListaAlertas();
  }

  // Mostrar toast de alerta
  mostrarToastAlerta(alerta);

  // Reproducir sonido si aplica
  if (reproducirSonido && AlertasState.sonidoActivo && config.sonido > 0) {
    reproducirSonidoAlerta(config.sonido);
  }

  // Actualizar badge en topbar
  actualizarBadgeTopbar();

  // Anunciar para accesibilidad
  if (typeof anunciar === "function") {
    anunciar(`Nueva alerta ${config.label}: ${mensaje.replace(/[🚨🔴🟡🔵🟢]/g, "").trim()}`);
  }
}


/* ================================================
   5. ALERTAS INICIALES DEL TURNO
================================================ */
function agregarAlertaInicial() {
  setTimeout(() => agregarAlerta("info",    mensajesAlertas.info[5],   false), 500);
  setTimeout(() => agregarAlerta("medio",   mensajesAlertas.medio[0],  false), 800);
  setTimeout(() => agregarAlerta("alto",    mensajesAlertas.alto[4],   false), 1100);
  setTimeout(() => agregarAlerta("success", mensajesAlertas.success[0],false), 1400);
  setTimeout(() => agregarAlerta("critico", mensajesAlertas.critico[0],false), 1700);
  setTimeout(() => agregarAlerta("alto",    mensajesAlertas.alto[1],   false), 2000);
  setTimeout(() => agregarAlerta("medio",   mensajesAlertas.medio[2],  false), 2300);
  setTimeout(() => agregarAlerta("info",    mensajesAlertas.info[2],   false), 2600);
  setTimeout(() => agregarAlerta("success", mensajesAlertas.success[1],false), 2900);
  setTimeout(() => agregarAlerta("alto",    mensajesAlertas.alto[2],   false), 3200);
}


/* ================================================
   6. ALERTAS AUTOMÁTICAS (simuladas en tiempo real)
================================================ */
function iniciarAlertasAutomaticas() {
  // Generar alerta aleatoria cada 25-45 segundos
  function programarSiguiente() {
    const delay = 25000 + Math.random() * 20000;
    AlertasState.intervaloAlertas = setTimeout(() => {
      generarAlertaAleatoria();
      programarSiguiente();
    }, delay);
  }
  programarSiguiente();
}

function generarAlertaAleatoria() {
  // Probabilidades: 10% crítico, 25% alto, 35% medio, 20% info, 10% success
  const rand = Math.random();
  let tipo;
  if      (rand < 0.10) tipo = "critico";
  else if (rand < 0.35) tipo = "alto";
  else if (rand < 0.70) tipo = "medio";
  else if (rand < 0.90) tipo = "info";
  else                  tipo = "success";

  const mensajes = mensajesAlertas[tipo];
  const mensaje  = mensajes[Math.floor(Math.random() * mensajes.length)];
  agregarAlerta(tipo, mensaje, true);
}


/* ================================================
   7. SONIDO DE ALERTA (Web Audio API)
================================================ */
function reproducirSonidoAlerta(nivel) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const freq = nivel === 3 ? 880 : nivel === 2 ? 660 : 440;
    const veces = nivel === 3 ? 3 : nivel === 2 ? 2 : 1;

    for (let i = 0; i < veces; i++) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = freq;
      osc.type = "sine";

      const inicio = ctx.currentTime + (i * 0.3);
      gain.gain.setValueAtTime(0.3, inicio);
      gain.gain.exponentialRampToValueAtTime(0.001, inicio + 0.25);

      osc.start(inicio);
      osc.stop(inicio + 0.25);
    }
  } catch (e) {
    // Silenciar error si el navegador no soporta Web Audio
  }
}


/* ================================================
   8. BOTÓN DE ALERTAS EN EL TOPBAR
================================================ */
function crearBotonAlertas() {
  // Reemplazar el botón de alertas existente en el topbar
  const topbarAlert = document.getElementById("topbar-alert-btn");
  if (topbarAlert) {
    topbarAlert.addEventListener("click", togglePanelAlertas);
    return;
  }

  // Si no existe, buscar el área de alertas del topbar
  const alertCount = document.getElementById("alert-count");
  if (alertCount) {
    const parent = alertCount.closest(".topbar__alert");
    if (parent) {
      parent.style.cursor = "pointer";
      parent.setAttribute("role", "button");
      parent.setAttribute("aria-label", "Ver alertas del sistema");
      parent.setAttribute("tabindex", "0");
      parent.addEventListener("click", togglePanelAlertas);
      parent.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") togglePanelAlertas();
      });
    }
  }
}

function actualizarBadgeTopbar() {
  const badge = document.getElementById("alert-count");
  if (badge) {
    badge.textContent = AlertasState.noLeidas > 99 ? "99+" : AlertasState.noLeidas;
    badge.style.animation = "none";
    setTimeout(() => badge.style.animation = "", 10);
  }
}

function actualizarContadorAlertas() {
  actualizarBadgeTopbar();

  // Actualizar título del panel
  const titulo = document.getElementById("alertas-panel-titulo");
  if (titulo) {
    titulo.textContent = `Alertas del Turno (${AlertasState.alertas.length})`;
  }

  // Actualizar badge de no leídas
  const badgeNoLeidas = document.getElementById("alertas-no-leidas");
  if (badgeNoLeidas) {
    badgeNoLeidas.textContent = AlertasState.noLeidas > 0
      ? `${AlertasState.noLeidas} sin leer`
      : "Todo leído";
    badgeNoLeidas.className = AlertasState.noLeidas > 0
      ? "badge badge--danger"
      : "badge badge--success";
  }
}


/* ================================================
   9. PANEL DE ALERTAS
================================================ */
function crearPanelAlertas() {
  const panel = document.createElement("div");
  panel.id = "panel-alertas";
  panel.className = "panel-alertas";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "alertas-panel-titulo");
  panel.hidden = true;
  panel.style.display = "none";

  panel.innerHTML = `
    <div class="panel-alertas__inner">

      <!-- Header -->
      <div class="panel-alertas__header">
        <div>
          <h2 id="alertas-panel-titulo" class="panel-alertas__titulo">
            Alertas del Turno
          </h2>
          <span id="alertas-no-leidas" class="badge badge--danger">0 sin leer</span>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <!-- Toggle sonido -->
          <button
            id="btn-toggle-sonido"
            class="panel-alertas__btn-icon"
            aria-label="Activar/desactivar sonido de alertas"
            title="Sonido"
          >🔔</button>
          <!-- Marcar todas como leídas -->
          <button
            id="btn-marcar-leidas"
            class="panel-alertas__btn-icon"
            aria-label="Marcar todas las alertas como leídas"
            title="Marcar todo como leído"
          >✅</button>
          <!-- Limpiar historial -->
          <button
            id="btn-limpiar-alertas"
            class="panel-alertas__btn-icon"
            aria-label="Limpiar historial de alertas"
            title="Limpiar"
          >🗑️</button>
          <!-- Cerrar panel -->
          <button
            id="btn-cerrar-alertas"
            class="panel-alertas__btn-icon"
            aria-label="Cerrar panel de alertas"
          >✕</button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="panel-alertas__filtros" role="group" aria-label="Filtrar alertas por tipo">
        <button class="alerta-filtro alerta-filtro--activo" data-filtro="todos" aria-pressed="true">Todos</button>
        <button class="alerta-filtro" data-filtro="critico" aria-pressed="false">🚨 Crítico</button>
        <button class="alerta-filtro" data-filtro="alto"    aria-pressed="false">🔴 Alto</button>
        <button class="alerta-filtro" data-filtro="medio"   aria-pressed="false">🟡 Medio</button>
        <button class="alerta-filtro" data-filtro="info"    aria-pressed="false">🔵 Info</button>
      </div>

      <!-- Lista de alertas -->
      <div
        id="alertas-lista-panel"
        class="panel-alertas__lista"
        role="feed"
        aria-label="Lista de alertas del turno"
        aria-live="polite"
      >
        <!-- Se llena con JavaScript -->
      </div>

      <!-- Footer -->
      <div class="panel-alertas__footer">
        <span class="text-sm text-muted" id="alertas-footer-info">
          Actualizando en tiempo real
        </span>
        <div class="alerta-indicador-vivo" aria-hidden="true">
          <span class="alerta-dot-vivo"></span>
          <span style="font-size:0.72rem; color: #22c55e;">EN VIVO</span>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(panel);
  iniciarEventosPanelAlertas();
}

function iniciarEventosPanelAlertas() {
  // Cerrar panel
  document.getElementById("btn-cerrar-alertas")?.addEventListener("click", cerrarPanelAlertas);

  // Toggle sonido
  document.getElementById("btn-toggle-sonido")?.addEventListener("click", () => {
    AlertasState.sonidoActivo = !AlertasState.sonidoActivo;
    const btn = document.getElementById("btn-toggle-sonido");
    if (btn) {
      btn.textContent = AlertasState.sonidoActivo ? "🔔" : "🔕";
      btn.title = AlertasState.sonidoActivo ? "Silenciar alertas" : "Activar sonido";
    }
    if (typeof mostrarToast === "function") {
      mostrarToast(
        AlertasState.sonidoActivo ? "Sonido de alertas activado" : "Alertas silenciadas",
        AlertasState.sonidoActivo ? "success" : "info"
      );
    }
  });

  // Marcar todas como leídas
  document.getElementById("btn-marcar-leidas")?.addEventListener("click", () => {
    AlertasState.alertas.forEach(a => a.leida = true);
    AlertasState.noLeidas = 0;
    actualizarContadorAlertas();
    renderizarListaAlertas();
    if (typeof mostrarToast === "function") {
      mostrarToast("Todas las alertas marcadas como leídas", "success");
    }
  });

  // Limpiar historial
  document.getElementById("btn-limpiar-alertas")?.addEventListener("click", () => {
    AlertasState.alertas = [];
    AlertasState.noLeidas = 0;
    actualizarContadorAlertas();
    renderizarListaAlertas();
    if (typeof mostrarToast === "function") {
      mostrarToast("Historial de alertas limpiado", "info");
    }
  });

  // Filtros
  document.querySelectorAll(".alerta-filtro").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".alerta-filtro").forEach(b => {
        b.classList.remove("alerta-filtro--activo");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("alerta-filtro--activo");
      btn.setAttribute("aria-pressed", "true");
      renderizarListaAlertas(btn.dataset.filtro);
    });
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && AlertasState.panelVisible) {
      cerrarPanelAlertas();
    }
  });

  // Cerrar al hacer clic fuera
  document.addEventListener("click", (e) => {
    const panel = document.getElementById("panel-alertas");
    const topbarAlert = document.querySelector(".topbar__alert");
    if (panel && !panel.contains(e.target) && !topbarAlert?.contains(e.target)) {
      if (AlertasState.panelVisible) cerrarPanelAlertas();
    }
  });
}


/* ================================================
   10. RENDERIZAR LISTA DE ALERTAS
================================================ */
function renderizarListaAlertas(filtro = "todos") {
  const lista = document.getElementById("alertas-lista-panel");
  if (!lista) return;

  const alertasFiltradas = filtro === "todos"
    ? AlertasState.alertas
    : AlertasState.alertas.filter(a => a.tipo === filtro);

  if (alertasFiltradas.length === 0) {
    lista.innerHTML = `
      <div class="alertas-empty">
        <span style="font-size:2rem;">🔕</span>
        <p>No hay alertas ${filtro !== "todos" ? `de tipo ${filtro}` : ""}</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = alertasFiltradas.map(a => `
    <div
      class="alerta-item-panel ${!a.leida ? "alerta-item-panel--no-leida" : ""} alerta-item-panel--${a.tipo}"
      role="article"
      aria-label="Alerta ${a.label}: ${a.mensaje}"
      data-id="${a.id}"
      tabindex="0"
    >
      <div class="alerta-item-panel__left">
        <span class="alerta-item-panel__icono" aria-hidden="true">${a.icono}</span>
        ${!a.leida ? '<span class="alerta-item-panel__dot" aria-label="No leída"></span>' : ""}
      </div>
      <div class="alerta-item-panel__content">
        <div class="alerta-item-panel__header">
          <span class="alerta-item-panel__tipo" style="color:${a.color};">${a.label}</span>
          <span class="alerta-item-panel__hora">${a.hora}</span>
        </div>
        <p class="alerta-item-panel__mensaje">${a.mensaje}</p>
        <span class="alerta-item-panel__fecha">${a.fecha}</span>
      </div>
      <button
        class="alerta-item-panel__btn-leer"
        onclick="marcarAlertaLeida('${a.id}')"
        aria-label="Marcar alerta como leída"
        title="Marcar como leída"
        ${a.leida ? "disabled" : ""}
      >${a.leida ? "✓" : "○"}</button>
    </div>
  `).join("");

  // Click en alerta para marcarla como leída
  lista.querySelectorAll(".alerta-item-panel").forEach(item => {
    item.addEventListener("click", (e) => {
      if (!e.target.classList.contains("alerta-item-panel__btn-leer")) {
        marcarAlertaLeida(item.dataset.id);
      }
    });
  });
}

function marcarAlertaLeida(id) {
  const alerta = AlertasState.alertas.find(a => a.id === id);
  if (alerta && !alerta.leida) {
    alerta.leida = true;
    AlertasState.noLeidas = Math.max(0, AlertasState.noLeidas - 1);
    actualizarContadorAlertas();
    renderizarListaAlertas(
      document.querySelector(".alerta-filtro--activo")?.dataset.filtro || "todos"
    );
  }
}


/* ================================================
   11. TOGGLE DEL PANEL
================================================ */
function togglePanelAlertas() {
  if (AlertasState.panelVisible) {
    cerrarPanelAlertas();
  } else {
    abrirPanelAlertas();
  }
}

function abrirPanelAlertas() {
  const panel = document.getElementById("panel-alertas");
  if (!panel) return;

  panel.hidden = false;
  panel.style.display = "flex";
  AlertasState.panelVisible = true;

  renderizarListaAlertas();

  // Enfocar para accesibilidad
  setTimeout(() => {
    document.getElementById("btn-cerrar-alertas")?.focus();
  }, 100);
}

function cerrarPanelAlertas() {
  const panel = document.getElementById("panel-alertas");
  if (!panel) return;

  panel.hidden = true;
  panel.style.display = "none";
  AlertasState.panelVisible = false;
}


/* ================================================
   12. TOAST DE ALERTA (diferente al toast normal)
================================================ */
function mostrarToastAlerta(alerta) {
  // Solo mostrar toast para alertas críticas y altas
  if (alerta.tipo !== "critico" && alerta.tipo !== "alto") return;

  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-alerta";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.innerHTML = `
    <div class="toast-alerta__nivel" style="background:${alerta.color};">
      ${alerta.icono} ${alerta.label.toUpperCase()}
    </div>
    <div class="toast-alerta__body">
      <p class="toast-alerta__msg">${alerta.mensaje}</p>
      <span class="toast-alerta__hora">${alerta.hora}</span>
    </div>
    <button class="toast-alerta__close" aria-label="Cerrar alerta">✕</button>
  `;

  container.appendChild(toast);

  toast.querySelector(".toast-alerta__close")?.addEventListener("click", () => {
    toast.remove();
  });

  const duracion = alerta.tipo === "critico" ? 8000 : 5000;
  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity    = "0";
    toast.style.transform  = "translateX(20px)";
    setTimeout(() => toast.remove(), 300);
  }, duracion);
}


/* ================================================
   13. ESTILOS DEL SISTEMA DE ALERTAS
================================================ */
function inyectarEstilosAlertas() {
  const style = document.createElement("style");
  style.id = "estilos-alertas";
  style.textContent = `

    /* ===== PANEL DE ALERTAS ===== */
    .panel-alertas {
      position: fixed;
      top: 94px;
      right: 1.5rem;
      z-index: 800;
      width: 380px;
      max-height: 75vh;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.25s ease;
    }

    .panel-alertas__inner {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .panel-alertas__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
      gap: 0.5rem;
    }

    .panel-alertas__titulo {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 4px 0;
    }

    .panel-alertas__btn-icon {
      background: none;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.85rem;
      color: var(--color-text-muted);
      transition: all 0.15s;
      flex-shrink: 0;
    }

    .panel-alertas__btn-icon:hover {
      background-color: var(--color-hover);
      color: var(--color-text);
    }

    /* Filtros */
    .panel-alertas__filtros {
      display: flex;
      gap: 0.4rem;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
      overflow-x: auto;
    }

    .alerta-filtro {
      padding: 0.25rem 0.6rem;
      border-radius: 20px;
      border: 1px solid var(--color-border);
      background: transparent;
      color: var(--color-text-muted);
      font-size: 0.72rem;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s;
      font-family: 'Inter', sans-serif;
    }

    .alerta-filtro:hover {
      border-color: var(--color-accent);
      color: var(--color-text);
    }

    .alerta-filtro--activo {
      background-color: var(--color-accent-subtle);
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    /* Lista */
    .panel-alertas__lista {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem 0;
    }

    /* Item de alerta */
    .alerta-item-panel {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
      cursor: pointer;
      transition: background-color 0.15s;
      position: relative;
    }

    .alerta-item-panel:last-child { border-bottom: none; }

    .alerta-item-panel:hover,
    .alerta-item-panel:focus {
      background-color: var(--color-hover);
      outline: none;
    }

    .alerta-item-panel--no-leida {
      background-color: rgba(59, 130, 246, 0.04);
    }

    .alerta-item-panel--critico.alerta-item-panel--no-leida {
      background-color: rgba(124, 58, 237, 0.06);
      border-left: 3px solid #7c3aed;
    }

    .alerta-item-panel--alto.alerta-item-panel--no-leida {
      background-color: rgba(239, 68, 68, 0.06);
      border-left: 3px solid #ef4444;
    }

    .alerta-item-panel__left {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .alerta-item-panel__icono { font-size: 1rem; }

    .alerta-item-panel__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--color-accent);
    }

    .alerta-item-panel__content { flex: 1; min-width: 0; }

    .alerta-item-panel__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 3px;
    }

    .alerta-item-panel__tipo {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .alerta-item-panel__hora {
      font-size: 0.68rem;
      color: var(--color-text-muted);
    }

    .alerta-item-panel__mensaje {
      font-size: 0.78rem;
      color: var(--color-text);
      line-height: 1.4;
      margin: 0 0 3px 0;
    }

    .alerta-item-panel__fecha {
      font-size: 0.68rem;
      color: var(--color-text-muted);
    }

    .alerta-item-panel__btn-leer {
      background: none;
      border: 1px solid var(--color-border);
      border-radius: 50%;
      width: 22px;
      height: 22px;
      font-size: 0.7rem;
      cursor: pointer;
      color: var(--color-text-muted);
      flex-shrink: 0;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .alerta-item-panel__btn-leer:hover:not(:disabled) {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
      color: #ffffff;
    }

    .alerta-item-panel__btn-leer:disabled {
      opacity: 0.4;
      cursor: default;
    }

    /* Empty state */
    .alertas-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: var(--color-text-muted);
      gap: 0.5rem;
      text-align: center;
      font-size: 0.82rem;
    }

    /* Footer */
    .panel-alertas__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 1.25rem;
      border-top: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .alerta-indicador-vivo {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .alerta-dot-vivo {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #22c55e;
      animation: pulsarVivo 1.5s infinite;
    }

    @keyframes pulsarVivo {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(0.8); }
    }


    /* ===== TOAST DE ALERTA CRÍTICA ===== */
    .toast-alerta {
      display: flex;
      align-items: stretch;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      overflow: hidden;
      min-width: 320px;
      max-width: 400px;
      animation: slideInRight 0.3s ease;
    }

    .toast-alerta__nivel {
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      padding: 0.75rem 0.5rem;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #ffffff;
      min-width: 36px;
      gap: 4px;
    }

    .toast-alerta__body {
      flex: 1;
      padding: 0.75rem;
    }

    .toast-alerta__msg {
      font-size: 0.82rem;
      color: var(--color-text);
      line-height: 1.4;
      margin: 0 0 4px 0;
    }

    .toast-alerta__hora {
      font-size: 0.7rem;
      color: var(--color-text-muted);
    }

    .toast-alerta__close {
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 0.5rem;
      font-size: 0.8rem;
      align-self: flex-start;
    }

    .toast-alerta__close:hover {
      color: var(--color-text);
    }

    /* Animación del badge de alertas */
    #alert-count {
      animation: none;
    }

    @keyframes badgePulse {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  `;

  document.head.appendChild(style);
}


/* ================================================
   INICIAR AL CARGAR
================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Esperar a que el login esté listo
  setTimeout(() => {
    iniciarSistemaAlertas();
  }, 300);
});