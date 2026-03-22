/* ================================================
   SISTEMA POLICIAL RD — app.js
   Lógica principal de la aplicación
   Maneja: login, navegación, módulos,
   tema, reloj, notificaciones y accesibilidad
================================================ */

const { ipcRenderer } = require("electron");


/* ================================================
   1. ESTADO GLOBAL DE LA APLICACIÓN
================================================ */
const AppState = {
  usuario:       null,
  moduloActual:  "dashboard",
  tema:          localStorage.getItem("tema-policial") || "dark",
  lang:          localStorage.getItem("idioma-policial") || "es",
  sidebarOpen:   true,
  notificaciones: 10,
};


/* ================================================
   2. INICIALIZACIÓN
================================================ */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Sistema Policial RD iniciado");

  // Aplicar tema guardado
  aplicarTema(AppState.tema);

  // Aplicar idioma guardado
  i18n.aplicarTraduccion();

  // Iniciar reloj
  iniciarReloj();

  // Iniciar controles de ventana
  iniciarControlesVentana();

  // Iniciar login
  iniciarLogin();

  // Iniciar cambio de tema
  iniciarTema();

  // Iniciar cambio de idioma
  iniciarIdioma();
});


/* ================================================
   3. CONTROLES DE VENTANA (minimizar, max, cerrar)
================================================ */
function iniciarControlesVentana() {
  document.getElementById("btn-minimize")?.addEventListener("click", () => {
    ipcRenderer.send("window-minimize");
  });

  document.getElementById("btn-maximize")?.addEventListener("click", () => {
    ipcRenderer.send("window-maximize");
  });

  const btnClose = document.getElementById("btn-close");
  if (btnClose) {
    btnClose.addEventListener("click", async () => {
      const confirmar = await ipcRenderer.invoke("confirm-close");
      if (confirmar) ipcRenderer.send("window-close");
    });
  }

  // Pantalla completa
  document.getElementById("btn-fullscreen")?.addEventListener("click", () => {
    ipcRenderer.send("window-maximize");
  });
}


/* ================================================
   4. SISTEMA DE LOGIN
================================================ */
function iniciarLogin() {
  const btnLogin   = document.getElementById("btn-login");
  const inputUser  = document.getElementById("login-user");
  const inputPass  = document.getElementById("login-pass");
  const togglePass = document.getElementById("toggle-pass");
  const loginError = document.getElementById("login-error");

  // Mostrar/ocultar contraseña
  togglePass?.addEventListener("click", () => {
    const tipo = inputPass.type === "password" ? "text" : "password";
    inputPass.type = tipo;
    togglePass.textContent = tipo === "password" ? "👁" : "🙈";
  });

  // Enter en los campos
  [inputUser, inputPass].forEach(input => {
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") btnLogin?.click();
    });
  });

  // Botón de login
  btnLogin?.addEventListener("click", () => {
    const placa    = inputUser?.value.trim();
    const password = inputPass?.value.trim();
    const rol      = document.getElementById("login-role")?.value;

    // Validación básica
    if (!placa || !password) {
      mostrarLoginError();
      return;
    }

    // Autenticar
    const usuario = autenticarUsuario(placa, password, rol);

    if (usuario) {
      loginExitoso(usuario);
    } else {
      mostrarLoginError();
    }
  });
}

function mostrarLoginError() {
  const loginError = document.getElementById("login-error");
  if (loginError) {
    loginError.hidden = false;
    loginError.querySelector("#login-error-msg").textContent = i18n.t("login.error");
    // Auto-ocultar después de 3 segundos
    setTimeout(() => { loginError.hidden = true; }, 3000);
  }
}

function loginExitoso(usuario) {
  AppState.usuario = usuario;

  // Actualizar UI con datos del usuario
  const userNameEl   = document.getElementById("user-name");
  const userRoleEl   = document.getElementById("user-role");
  const userAvatarEl = document.getElementById("user-avatar");

  if (userNameEl)   userNameEl.textContent  = usuario.nombre;
  if (userRoleEl)   userRoleEl.textContent  = rolesTexto[usuario.rol]?.[i18n.getLang()] || usuario.rol;
  if (userAvatarEl) userAvatarEl.textContent = usuario.avatar;

  // Mostrar app principal PRIMERO antes de ocultar login
  const appShell    = document.getElementById("app-shell");
  const loginScreen = document.getElementById("login-screen");

  if (appShell) {
    appShell.removeAttribute("hidden");
    appShell.style.display = "flex";
  }

  // Ocultar pantalla de login
  if (loginScreen) {
    loginScreen.style.opacity    = "0";
    loginScreen.style.transition = "opacity 0.4s ease";
    setTimeout(() => {
      loginScreen.setAttribute("hidden", "");
      loginScreen.style.display  = "none";
      loginScreen.style.opacity  = "";
    }, 420);
  }

  // Cargar dashboard después de un pequeño delay
  setTimeout(() => {
    cargarModulo("dashboard");
    iniciarNavegacion();
  }, 100);

  // Mostrar bienvenida
  setTimeout(() => {
    mostrarToast(`Bienvenido, ${usuario.nombre} 👮`, "success");
  }, 600);
}


/* ================================================
   5. NAVEGACIÓN ENTRE MÓDULOS
================================================ */
function iniciarNavegacion() {
  // Botones del sidebar
  const navBtns = document.querySelectorAll(".nav-btn[data-module]");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modulo = btn.dataset.module;
      if (modulo && modulo !== AppState.moduloActual) {
        cargarModulo(modulo);
      }
    });
  });

  // Botón colapsar sidebar
  const btnCollapse = document.getElementById("btn-collapse");
  const sidebar      = document.getElementById("sidebar");
  btnCollapse?.addEventListener("click", () => {
    AppState.sidebarOpen = !AppState.sidebarOpen;
    sidebar?.classList.toggle("collapsed", !AppState.sidebarOpen);
    btnCollapse.setAttribute(
      "aria-label",
      AppState.sidebarOpen ? "Colapsar menú" : "Expandir menú"
    );
  });

  // Botón cerrar sesión
  document.getElementById("btn-logout")?.addEventListener("click", () => {
    mostrarModal(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      () => cerrarSesion()
    );
  });
}

async function cargarModulo(nombre) {
  AppState.moduloActual = nombre;

  // Actualizar botones activos en sidebar
  document.querySelectorAll(".nav-btn[data-module]").forEach(btn => {
    const esActivo = btn.dataset.module === nombre;
    btn.classList.toggle("nav-btn--active", esActivo);
    btn.setAttribute("aria-current", esActivo ? "page" : "false");
  });

  // Actualizar título y breadcrumb
  const titulos = {
    dashboard:    i18n.t("nav.dashboard"),
    casos:        i18n.t("nav.casos"),
    detenidos:    i18n.t("nav.detenidos"),
    patrullas:    i18n.t("nav.patrullas"),
    mapa:         i18n.t("nav.mapa"),
    incidentes:   i18n.t("nav.incidentes"),
    reportes:     i18n.t("nav.reportes"),
    turnos:       "Turnos & Horarios",
    chat:         "Chat Interno",
    estadisticas: "Estadísticas Avanzadas",
  };

  const titulo = titulos[nombre] || nombre;
  const pageTitle = document.getElementById("page-title");
  const breadcrumb = document.getElementById("breadcrumb-current");
  if (pageTitle) pageTitle.textContent = titulo;
  if (breadcrumb) breadcrumb.textContent = titulo;

  // Mostrar spinner mientras carga
  const container = document.getElementById("module-container");
  if (container) {
    container.innerHTML = `
      <div class="flex-center" style="height: 300px;">
        <div class="spinner" aria-label="Cargando módulo..." role="status"></div>
      </div>
    `;
  }

  // Cargar el módulo
  try {
    const path = require("path");
    const fs   = require("fs");
    const rutaModulo = path.join(__dirname, `modules/${nombre}.html`);

    if (fs.existsSync(rutaModulo)) {
      const contenido = fs.readFileSync(rutaModulo, "utf8");
      if (container) {
        container.innerHTML = contenido;
        container.classList.add("animate-fadeIn");
      }
      // Inicializar módulo
      inicializarModulo(nombre);
    } else {
      if (container) {
        container.innerHTML = moduloNoEncontrado(nombre);
      }
    }
  } catch (err) {
    console.error("Error cargando módulo:", err);
    if (container) {
      container.innerHTML = moduloNoEncontrado(nombre);
    }
  }
}

function moduloNoEncontrado(nombre) {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">🚧</div>
      <div class="empty-state__title">Módulo en construcción</div>
      <div class="empty-state__desc">El módulo "${nombre}" está siendo desarrollado.</div>
    </div>
  `;
}

// Inicializar lógica específica de cada módulo
function inicializarModulo(nombre) {
  switch(nombre) {
    case "dashboard":    inicializarDashboard();    break;
    case "casos":        inicializarCasos();        break;
    case "detenidos":    inicializarDetenidos();    break;
    case "patrullas":    inicializarPatrullas();    break;
    case "mapa":         inicializarMapa();         break;
    case "incidentes":   inicializarIncidentes();   break;
    case "reportes":     inicializarReportes();     break;
    case "turnos":       inicializarTurnos();       break;
    case "chat":         inicializarChat();         break;
    case "estadisticas": inicializarEstadisticas(); break;
  }
}


/* ================================================
   6. MÓDULO: DASHBOARD
================================================ */
function inicializarDashboard() {
  const stats = getEstadisticas();
  const lang  = i18n.getLang();

  // Actualizar tarjetas de estadísticas
  setEl("stat-casos",     stats.resumen.casos_activos);
  setEl("stat-detenidos", stats.resumen.detenidos_hoy);
  setEl("stat-patrullas", stats.resumen.patrullas_activas);
  setEl("stat-incidentes",stats.resumen.incidentes_hoy);

  // Renderizar actividad reciente
  const actividadEl = document.getElementById("actividad-lista");
  if (actividadEl) {
    actividadEl.innerHTML = stats.actividadReciente.map(a => `
      <div class="actividad-item">
        <span class="actividad-item__icon">${a.icono}</span>
        <div class="actividad-item__content">
          <p class="actividad-item__texto">${a.texto}</p>
          <span class="actividad-item__tiempo">${a.tiempo}</span>
        </div>
      </div>
    `).join("");
  }

  // Renderizar alertas
  const alertasEl = document.getElementById("alertas-lista");
  if (alertasEl) {
    alertasEl.innerHTML = stats.alertas.map(a => `
      <div class="alerta-item alerta-item--${a.nivel}">
        <span class="alerta-item__dot"></span>
        <span class="alerta-item__texto">${a.texto}</span>
        <span class="badge badge--${a.nivel === 'critico' ? 'danger' : a.nivel === 'alto' ? 'danger' : 'warning'}">
          ${a.nivel.toUpperCase()}
        </span>
      </div>
    `).join("");
  }

  // Gráfica de casos por mes
  const ctxCasos = document.getElementById("chart-casos");
  if (ctxCasos && window.Chart) {
    new Chart(ctxCasos, {
      type: "bar",
      data: {
        labels: stats.casosPorMes.labels,
        datasets: [{
          label: lang === "es" ? "Casos" : "Cases",
          data:  stats.casosPorMes.data,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor:     "#3b82f6",
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: "#64748b" }, grid: { color: "rgba(255,255,255,0.05)" } },
          y: { ticks: { color: "#64748b" }, grid: { color: "rgba(255,255,255,0.05)" } }
        }
      }
    });
  }

  // Gráfica de tipos de delitos (dona)
  const ctxDelitos = document.getElementById("chart-delitos");
  if (ctxDelitos && window.Chart) {
    new Chart(ctxDelitos, {
      type: "doughnut",
      data: {
        labels:   stats.tiposDelitos.labels,
        datasets: [{
          data:            stats.tiposDelitos.data,
          backgroundColor: stats.tiposDelitos.colores,
          borderWidth: 0,
          hoverOffset: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { color: "#94a3b8", font: { size: 11 }, boxWidth: 12 }
          }
        },
        cutout: "65%",
      }
    });
  }
}


/* ================================================
   7. MÓDULO: CASOS
================================================ */
function inicializarCasos() {
  renderizarTablaCasos(getCasos());

  // Búsqueda en tiempo real
  const searchInput = document.getElementById("casos-search");
  const estadoFilter = document.getElementById("casos-estado-filter");

  function filtrarCasos() {
    const filtro = searchInput?.value || "";
    const estado = estadoFilter?.value || "";
    renderizarTablaCasos(getCasos(filtro, estado));
  }

  searchInput?.addEventListener("input",  filtrarCasos);
  estadoFilter?.addEventListener("change", filtrarCasos);

  // Botón nuevo caso
  document.getElementById("btn-nuevo-caso")?.addEventListener("click", () => {
    mostrarModal(
      i18n.t("casos.nuevo"),
      formularioNuevoCaso(),
      () => {
        mostrarToast("Caso registrado exitosamente", "success");
      }
    );
  });
}

function renderizarTablaCasos(data) {
  const tbody = document.getElementById("casos-tbody");
  if (!tbody) return;
  const lang = i18n.getLang();

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--color-text-muted);">No se encontraron casos</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(c => `
    <tr>
      <td><span class="text-accent font-bold">${c.id}</span></td>
      <td>${c.tipo}</td>
      <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.descripcion}">${c.descripcion}</td>
      <td><span class="badge ${getBadgeClass(c.estado)}">${getEstadoTexto(c.estado, lang)}</span></td>
      <td>${formatearFecha(c.fecha)}</td>
      <td>${c.investigador}</td>
      <td>
        <div style="display:flex; gap:4px;">
          <button class="btn btn--sm btn--ghost" onclick="verDetalle('caso','${c.id}')" aria-label="Ver detalle del caso ${c.id}">👁</button>
          <button class="btn btn--sm btn--ghost" onclick="editarRegistro('caso','${c.id}')" aria-label="Editar caso ${c.id}">✏️</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function formularioNuevoCaso() {
  return `
    <div class="form-grid-modal">
      <div class="form-group">
        <label class="form-label">Tipo de Caso</label>
        <select class="form-input form-select" id="m-caso-tipo">
          <option>Robo</option><option>Homicidio</option>
          <option>Narcotráfico</option><option>Fraude</option>
          <option>Violencia DOM</option><option>Otro</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Investigador</label>
        <input type="text" class="form-input" id="m-caso-investigador" placeholder="Nombre del investigador" />
      </div>
      <div class="form-group" style="grid-column: 1/-1;">
        <label class="form-label">Descripción</label>
        <textarea class="form-input form-textarea" id="m-caso-desc" placeholder="Describe el caso..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Prioridad</label>
        <select class="form-input form-select" id="m-caso-prioridad">
          <option value="alta">Alta</option>
          <option value="media" selected>Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>
    </div>
  `;
}


/* ================================================
   8. MÓDULO: DETENIDOS
================================================ */
function inicializarDetenidos() {
  renderizarTablaDetenidos(getDetenidos());

  const searchInput  = document.getElementById("detenidos-search");
  const estadoFilter = document.getElementById("detenidos-estado-filter");

  function filtrar() {
    const filtro = searchInput?.value || "";
    const estado = estadoFilter?.value || "";
    renderizarTablaDetenidos(getDetenidos(filtro, estado));
  }

  searchInput?.addEventListener("input",   filtrar);
  estadoFilter?.addEventListener("change", filtrar);

  document.getElementById("btn-nuevo-detenido")?.addEventListener("click", () => {
    mostrarModal(
      i18n.t("detenidos.nuevo"),
      formularioNuevoDetenido(),
      () => mostrarToast("Detenido registrado exitosamente", "success")
    );
  });
}

function renderizarTablaDetenidos(data) {
  const tbody = document.getElementById("detenidos-tbody");
  if (!tbody) return;
  const lang = i18n.getLang();

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--color-text-muted);">No se encontraron detenidos</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(d => `
    <tr>
      <td><span class="text-accent font-bold">${d.id}</span></td>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.2rem;">${d.genero === "M" ? "👨" : "👩"}</span>
          <div>
            <div style="font-weight:500;">${d.nombre}</div>
            <div class="text-muted text-sm">${d.cedula}</div>
          </div>
        </div>
      </td>
      <td>${d.cargo}</td>
      <td>${formatearFecha(d.fecha)}</td>
      <td>${d.oficial}</td>
      <td><span class="badge ${getBadgeClass(d.estado)}">${getEstadoTexto(d.estado, lang)}</span></td>
      <td>
        <div style="display:flex; gap:4px;">
          <button class="btn btn--sm btn--ghost" onclick="verDetalle('detenido','${d.id}')" aria-label="Ver ficha de ${d.nombre}">👁</button>
          <button class="btn btn--sm btn--ghost" onclick="editarRegistro('detenido','${d.id}')" aria-label="Editar registro de ${d.nombre}">✏️</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function formularioNuevoDetenido() {
  return `
    <div class="form-grid-modal">
      <div class="form-group">
        <label class="form-label">Nombre Completo</label>
        <input type="text" class="form-input" placeholder="Nombre completo del detenido" />
      </div>
      <div class="form-group">
        <label class="form-label">Cédula</label>
        <input type="text" class="form-input" placeholder="000-0000000-0" />
      </div>
      <div class="form-group">
        <label class="form-label">Cargo</label>
        <input type="text" class="form-input" placeholder="Cargo imputado" />
      </div>
      <div class="form-group">
        <label class="form-label">Oficial a Cargo</label>
        <input type="text" class="form-input" placeholder="Nombre del oficial" />
      </div>
      <div class="form-group">
        <label class="form-label">Edad</label>
        <input type="number" class="form-input" min="14" max="99" placeholder="Edad" />
      </div>
      <div class="form-group">
        <label class="form-label">Género</label>
        <select class="form-input form-select">
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>
    </div>
  `;
}


/* ================================================
   9. MÓDULO: PATRULLAS
================================================ */
function inicializarPatrullas() {
  renderizarTablaPatrullas(getPatrullas());

  const searchInput  = document.getElementById("patrullas-search");
  const estadoFilter = document.getElementById("patrullas-estado-filter");

  function filtrar() {
    const filtro = searchInput?.value || "";
    const estado = estadoFilter?.value || "";
    renderizarTablaPatrullas(getPatrullas(filtro, estado));
  }

  searchInput?.addEventListener("input",   filtrar);
  estadoFilter?.addEventListener("change", filtrar);

  document.getElementById("btn-nueva-patrulla")?.addEventListener("click", () => {
    mostrarModal(
      i18n.t("patrullas.nueva"),
      formularioNuevaPatrulla(),
      () => mostrarToast("Patrulla registrada exitosamente", "success")
    );
  });
}

function renderizarTablaPatrullas(data) {
  const tbody = document.getElementById("patrullas-tbody");
  if (!tbody) return;
  const lang = i18n.getLang();

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--color-text-muted);">No se encontraron patrullas</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(p => `
    <tr>
      <td><span class="text-accent font-bold">${p.id}</span></td>
      <td>
        <div style="font-weight:500;">🚔 ${p.unidad}</div>
        <div class="text-muted text-sm">${p.turno}</div>
      </td>
      <td>${p.zona}</td>
      <td>
        <div style="display:flex; flex-direction:column; gap:2px;">
          ${p.personal.map(per => `<span class="text-sm">👮 ${per}</span>`).join("")}
        </div>
      </td>
      <td class="text-sm">${p.vehiculo}</td>
      <td><span class="badge ${getBadgeClass(p.estado)}">${getEstadoTexto(p.estado, lang)}</span></td>
    </tr>
  `).join("");
}

function formularioNuevaPatrulla() {
  return `
    <div class="form-grid-modal">
      <div class="form-group">
        <label class="form-label">Nombre de Unidad</label>
        <input type="text" class="form-input" placeholder="Ej: Patrulla Hotel" />
      </div>
      <div class="form-group">
        <label class="form-label">Zona Asignada</label>
        <input type="text" class="form-input" placeholder="Zona de cobertura" />
      </div>
      <div class="form-group">
        <label class="form-label">Vehículo</label>
        <input type="text" class="form-input" placeholder="Marca, modelo y placa" />
      </div>
      <div class="form-group">
        <label class="form-label">Turno</label>
        <select class="form-input form-select">
          <option>Mañana</option>
          <option>Tarde</option>
          <option>Noche</option>
        </select>
      </div>
    </div>
  `;
}


/* ================================================
   10. MÓDULO: MAPA DE RIESGO
================================================ */
function inicializarMapa() {
  const zonas = getZonasRiesgo();
  const lang  = i18n.getLang();

  // Renderizar lista de zonas
  const listaEl = document.getElementById("zonas-lista");
  if (listaEl) {
    listaEl.innerHTML = zonas.map(z => `
      <div class="zona-item zona-item--${z.nivel}" tabindex="0" role="button"
           aria-label="Zona ${z.nombre}, nivel ${z.nivel}"
           onclick="seleccionarZona('${z.id}')">
        <div class="zona-item__header">
          <span class="zona-item__nombre">${z.nombre}</span>
          <span class="badge ${getBadgeClass(z.nivel)}">${getEstadoTexto(z.nivel, lang)}</span>
        </div>
        <div class="zona-item__info">
          <span>⚠️ ${z.incidentes} ${lang === "es" ? "incidentes" : "incidents"}</span>
        </div>
      </div>
    `).join("");
  }

  // Renderizar mapa SVG simplificado de RD
  renderizarMapaRD(zonas);
}

function renderizarMapaRD(zonas) {
  const mapaEl = document.getElementById("mapa-svg-container");
  if (!mapaEl) return;

  const colores = {
    bajo:    "#22c55e",
    medio:   "#f59e0b",
    alto:    "#ef4444",
    critico: "#7c3aed",
  };

  // Representación esquemática de zonas de RD
  const zonasVisuales = [
    { id: "z06", nombre: "Los Guandules",     x: 200, y: 180, r: 28, nivel: "critico" },
    { id: "z04", nombre: "Los Alcarrizos",    x: 150, y: 160, r: 24, nivel: "alto"    },
    { id: "z01", nombre: "DN Norte",          x: 230, y: 155, r: 22, nivel: "alto"    },
    { id: "z07", nombre: "Villa Consuelo",    x: 215, y: 195, r: 20, nivel: "alto"    },
    { id: "z02", nombre: "DN Sur",            x: 240, y: 210, r: 20, nivel: "medio"   },
    { id: "z03", nombre: "Z. Colonial",       x: 265, y: 200, r: 18, nivel: "medio"   },
    { id: "z05", nombre: "SDE",               x: 295, y: 195, r: 22, nivel: "medio"   },
    { id: "z09", nombre: "San Cristóbal",     x: 185, y: 235, r: 18, nivel: "medio"   },
    { id: "z10", nombre: "Santiago",          x: 220, y: 100, r: 20, nivel: "medio"   },
    { id: "z08", nombre: "Boca Chica",        x: 300, y: 225, r: 16, nivel: "bajo"    },
    { id: "z11", nombre: "La Romana",         x: 360, y: 220, r: 16, nivel: "bajo"    },
    { id: "z12", nombre: "Puerto Plata",      x: 195, y: 60,  r: 16, nivel: "bajo"    },
  ];

  mapaEl.innerHTML = `
    <svg viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg"
         role="img" aria-label="Mapa de riesgo República Dominicana"
         style="width:100%; height:100%;">

      <!-- Fondo del mar -->
      <rect width="500" height="320" fill="var(--color-bg-primary)" rx="8"/>

      <!-- Contorno simplificado de RD -->
      <ellipse cx="250" cy="175" rx="180" ry="95"
               fill="var(--color-surface-2)" stroke="var(--color-border)" stroke-width="1.5"/>

      <!-- Título -->
      <text x="250" y="30" text-anchor="middle"
            font-size="12" font-weight="600" fill="var(--color-text-muted)"
            font-family="Inter, sans-serif">
        República Dominicana — Mapa de Riesgo
      </text>

      <!-- Zonas como círculos -->
      ${zonasVisuales.map(z => `
        <g class="mapa-zona" onclick="seleccionarZona('${z.id}')"
           role="button" tabindex="0" aria-label="${z.nombre}">
          <circle cx="${z.x}" cy="${z.y}" r="${z.r}"
                  fill="${colores[z.nivel]}"
                  fill-opacity="0.75"
                  stroke="${colores[z.nivel]}"
                  stroke-width="1.5"/>
          <circle cx="${z.x}" cy="${z.y}" r="${z.r}"
                  fill="transparent"
                  stroke="${colores[z.nivel]}"
                  stroke-width="2"
                  opacity="0.4">
            <animate attributeName="r" values="${z.r};${z.r + 6};${z.r}"
                     dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;0;0.4"
                     dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="${z.x}" y="${z.y + 4}" text-anchor="middle"
                font-size="9" fill="white" font-weight="600"
                font-family="Inter, sans-serif"
                style="pointer-events:none;">
            ${z.nombre.split(" ")[0]}
          </text>
        </g>
      `).join("")}

      <!-- Leyenda -->
      <g transform="translate(16, 255)">
        <rect width="130" height="56" rx="6"
              fill="var(--color-surface)" fill-opacity="0.9"
              stroke="var(--color-border)" stroke-width="1"/>
        ${[
          { nivel: "critico", label: "Crítico",  color: "#7c3aed", y: 14 },
          { nivel: "alto",    label: "Alto",      color: "#ef4444", y: 26 },
          { nivel: "medio",   label: "Medio",     color: "#f59e0b", y: 38 },
          { nivel: "bajo",    label: "Bajo",      color: "#22c55e", y: 50 },
        ].map(l => `
          <circle cx="14" cy="${l.y}" r="5" fill="${l.color}"/>
          <text x="24" y="${l.y + 4}" font-size="9"
                fill="var(--color-text-muted)"
                font-family="Inter, sans-serif">${l.label}</text>
        `).join("")}
      </g>
    </svg>
  `;
}

function seleccionarZona(id) {
  const zonas = getZonasRiesgo();
  const zona  = zonas.find(z => z.id === id);
  if (!zona) return;

  const lang = i18n.getLang();
  mostrarModal(
    `📍 ${zona.nombre}`,
    `
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <div class="flex-between">
          <span class="text-muted">Nivel de riesgo:</span>
          <span class="badge ${getBadgeClass(zona.nivel)}">${getEstadoTexto(zona.nivel, lang).toUpperCase()}</span>
        </div>
        <div class="flex-between">
          <span class="text-muted">Incidentes registrados:</span>
          <strong>${zona.incidentes}</strong>
        </div>
        <div class="flex-between">
          <span class="text-muted">Coordenadas:</span>
          <span class="text-sm">${zona.lat}°N, ${zona.lng}°W</span>
        </div>
      </div>
    `,
    null
  );
}


/* ================================================
   11. MÓDULO: INCIDENTES
================================================ */
function inicializarIncidentes() {
  renderizarTablaIncidentes(getIncidentes());

  const searchInput   = document.getElementById("incidentes-search");
  const gravedadFilter = document.getElementById("incidentes-gravedad-filter");

  function filtrar() {
    const filtro   = searchInput?.value || "";
    const gravedad = gravedadFilter?.value || "";
    renderizarTablaIncidentes(getIncidentes(filtro, gravedad));
  }

  searchInput?.addEventListener("input",    filtrar);
  gravedadFilter?.addEventListener("change", filtrar);

  document.getElementById("btn-nuevo-incidente")?.addEventListener("click", () => {
    mostrarModal(
      i18n.t("incidentes.nuevo"),
      formularioNuevoIncidente(),
      () => mostrarToast("Incidente registrado exitosamente", "success")
    );
  });
}

function renderizarTablaIncidentes(data) {
  const tbody = document.getElementById("incidentes-tbody");
  if (!tbody) return;
  const lang = i18n.getLang();

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--color-text-muted);">No se encontraron incidentes</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(i => `
    <tr>
      <td><span class="text-accent font-bold">${i.id}</span></td>
      <td>${i.tipo}</td>
      <td style="max-width:160px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${i.ubicacion}">${i.ubicacion}</td>
      <td><span class="badge ${getBadgeClass(i.gravedad)}">${getEstadoTexto(i.gravedad, lang)}</span></td>
      <td class="text-sm">${i.fecha}</td>
      <td><span class="badge ${getBadgeClass(i.estado)}">${getEstadoTexto(i.estado, lang)}</span></td>
      <td>
        <div style="display:flex; gap:4px;">
          <button class="btn btn--sm btn--ghost" onclick="verDetalle('incidente','${i.id}')" aria-label="Ver detalle incidente ${i.id}">👁</button>
          ${i.estado === "activo" ? `<button class="btn btn--sm btn--secondary" onclick="resolverIncidente('${i.id}')" aria-label="Resolver incidente ${i.id}">✅</button>` : ""}
        </div>
      </td>
    </tr>
  `).join("");
}

function formularioNuevoIncidente() {
  return `
    <div class="form-grid-modal">
      <div class="form-group">
        <label class="form-label">Tipo de Incidente</label>
        <select class="form-input form-select">
          <option>Tiroteo</option><option>Robo en Progreso</option>
          <option>Accidente Tránsito</option><option>Violencia DOM</option>
          <option>Incendio</option><option>Disturbio Público</option>
          <option>Persecución</option><option>Otro</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Gravedad</label>
        <select class="form-input form-select">
          <option value="alta">Alta</option>
          <option value="media" selected>Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1;">
        <label class="form-label">Ubicación</label>
        <input type="text" class="form-input" placeholder="Dirección o sector del incidente" />
      </div>
      <div class="form-group">
        <label class="form-label">Patrulla Asignada</label>
        <select class="form-input form-select">
          ${getPatrullas().filter(p => p.estado !== "inactiva").map(p =>
            `<option value="${p.id}">${p.unidad}</option>`
          ).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Heridos</label>
        <input type="number" class="form-input" min="0" value="0" />
      </div>
    </div>
  `;
}

function resolverIncidente(id) {
  mostrarToast(`Incidente ${id} marcado como resuelto`, "success");
  // En producción real actualizaría la base de datos
}


/* ================================================
   12. MÓDULO: REPORTES
================================================ */
function inicializarReportes() {
  document.getElementById("btn-generar-reporte")?.addEventListener("click", () => {
    const tipo    = document.getElementById("reporte-tipo")?.value || "mensual";
    const periodo = document.getElementById("reporte-periodo")?.value || "";
    generarReporte(tipo, periodo);
  });

  document.getElementById("btn-exportar-reporte")?.addEventListener("click", () => {
    exportarReporte();
  });
}

function generarReporte(tipo, periodo) {
  const previewEl = document.getElementById("reporte-preview");
  if (!previewEl) return;

  const stats = getEstadisticas();
  const fecha = new Date().toLocaleDateString("es-DO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  previewEl.innerHTML = `
    <div class="reporte-doc animate-slideUp">
      <div class="reporte-doc__header">
        <div style="display:flex; align-items:center; gap:1rem;">
          <span style="font-size:2.5rem;">🚔</span>
          <div>
            <h2 style="font-family:'Rajdhani',sans-serif; font-size:1.2rem; letter-spacing:0.05em;">POLICÍA NACIONAL</h2>
            <p style="font-size:0.75rem; color:var(--color-text-muted);">REPÚBLICA DOMINICANA</p>
          </div>
        </div>
        <div style="text-align:right;">
          <p class="text-sm text-muted">Generado: ${fecha}</p>
          <p class="text-sm text-muted">Por: ${AppState.usuario?.nombre || "Sistema"}</p>
          <p class="text-sm text-accent font-bold">REP-${Date.now().toString().slice(-6)}</p>
        </div>
      </div>

      <div class="reporte-doc__title">
        REPORTE OFICIAL — ${tipo.toUpperCase()}
      </div>

      <div class="grid-4" style="margin: 1.5rem 0;">
        ${[
          { label: "Casos Activos",      value: stats.resumen.casos_activos     },
          { label: "Detenidos",          value: stats.resumen.detenidos_hoy     },
          { label: "Patrullas Activas",  value: stats.resumen.patrullas_activas },
          { label: "Tasa de Resolución", value: stats.resumen.tasa_resolucion + "%" },
        ].map(s => `
          <div class="reporte-stat">
            <div class="reporte-stat__valor">${s.value}</div>
            <div class="reporte-stat__label">${s.label}</div>
          </div>
        `).join("")}
      </div>

      <div class="reporte-doc__section">
        <h3>Resumen de Casos</h3>
        <table class="data-table" style="margin-top:0.75rem;">
          <thead>
            <tr>
              <th>ID</th><th>Tipo</th><th>Estado</th><th>Investigador</th><th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${getCasos().slice(0, 6).map(c => `
              <tr>
                <td class="text-accent">${c.id}</td>
                <td>${c.tipo}</td>
                <td><span class="badge ${getBadgeClass(c.estado)}">${getEstadoTexto(c.estado)}</span></td>
                <td>${c.investigador}</td>
                <td>${formatearFecha(c.fecha)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="reporte-doc__footer">
        <p>Este documento es de uso oficial y confidencial.</p>
        <p>Policía Nacional — República Dominicana © 2025</p>
      </div>
    </div>
  `;

  mostrarToast(i18n.t("reportes.generado"), "success");
}

async function exportarReporte() {
  const previewEl = document.getElementById("reporte-preview");
  if (!previewEl || !previewEl.textContent.trim()) {
    mostrarToast("Genera un reporte primero", "warning");
    return;
  }

  const contenido = `
POLICÍA NACIONAL — REPÚBLICA DOMINICANA
Sistema de Gestión Policial v1.0.0
========================================
Fecha: ${new Date().toLocaleString("es-DO")}
Generado por: ${AppState.usuario?.nombre || "Sistema"}
========================================

RESUMEN ESTADÍSTICO:
- Casos Activos: ${getEstadisticas().resumen.casos_activos}
- Detenidos Hoy: ${getEstadisticas().resumen.detenidos_hoy}
- Patrullas Activas: ${getEstadisticas().resumen.patrullas_activas}
- Tasa de Resolución: ${getEstadisticas().resumen.tasa_resolucion}%

CASOS REGISTRADOS:
${getCasos().map(c => `[${c.id}] ${c.tipo} — ${c.estado.toUpperCase()} — ${c.investigador}`).join("\n")}

========================================
Documento oficial — Uso exclusivo PNRD
  `;

  try {
    const resultado = await ipcRenderer.invoke("export-report", contenido);
    if (resultado.success) {
      mostrarToast(`Reporte exportado: ${resultado.path}`, "success");
    }
  } catch (err) {
    mostrarToast("Error al exportar el reporte", "danger");
  }
}


/* ================================================
   13. TEMA OSCURO / CLARO
================================================ */
function iniciarTema() {
  const btnTema = document.getElementById("btn-theme");
  btnTema?.addEventListener("click", () => {
    const nuevoTema = AppState.tema === "dark" ? "light" : "dark";
    aplicarTema(nuevoTema);
  });
}

function aplicarTema(tema) {
  AppState.tema = tema;
  localStorage.setItem("tema-policial", tema);

  const body      = document.getElementById("app-body");
  const themeIcon = document.getElementById("theme-icon");

  if (body) {
    body.classList.remove("theme-dark", "theme-light");
    body.classList.add(`theme-${tema}`);
  }

  if (themeIcon) {
    themeIcon.textContent = tema === "dark" ? "☀️" : "🌙";
  }
}


/* ================================================
   14. IDIOMA
================================================ */
function iniciarIdioma() {
  document.getElementById("btn-lang")?.addEventListener("click", () => {
    i18n.toggle();
    // Recargar módulo actual con nuevo idioma
    cargarModulo(AppState.moduloActual);
  });

  // Actualizar al cambiar idioma
  window.addEventListener("langChanged", () => {
    const userRoleEl = document.getElementById("user-role");
    if (userRoleEl && AppState.usuario) {
      userRoleEl.textContent = rolesTexto[AppState.usuario.rol]?.[i18n.getLang()] || AppState.usuario.rol;
    }
  });
}


/* ================================================
   15. MODAL
================================================ */
function mostrarModal(titulo, contenido, onConfirmar) {
  const overlay    = document.getElementById("modal-overlay");
  const titleEl    = document.getElementById("modal-title");
  const bodyEl     = document.getElementById("modal-body");
  const btnConfirm = document.getElementById("modal-confirm");
  const btnCancel  = document.getElementById("modal-cancel");
  const btnClose   = document.getElementById("modal-close");

  if (!overlay) return;

  if (titleEl) titleEl.textContent = titulo;
  if (bodyEl)  bodyEl.innerHTML    = contenido;

  // Mostrar/ocultar botón confirmar según si hay callback
  if (btnConfirm) {
    btnConfirm.style.display = onConfirmar ? "flex" : "none";
  }

  // Mostrar modal correctamente
  overlay.hidden = false;
  overlay.style.display = "flex";

  const cerrar = () => {
    overlay.hidden = true;
    overlay.style.display = "none";
  };

  // Remover listeners anteriores clonando los botones
  const newBtnClose   = btnClose?.cloneNode(true);
  const newBtnCancel  = btnCancel?.cloneNode(true);
  const newBtnConfirm = btnConfirm?.cloneNode(true);

  if (btnClose && newBtnClose)   btnClose.parentNode.replaceChild(newBtnClose, btnClose);
  if (btnCancel && newBtnCancel) btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);
  if (btnConfirm && newBtnConfirm) btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);

  document.getElementById("modal-close")?.addEventListener("click",  cerrar);
  document.getElementById("modal-cancel")?.addEventListener("click", cerrar);

  overlay.onclick = (e) => { if (e.target === overlay) cerrar(); };

  if (onConfirmar) {
    document.getElementById("modal-confirm")?.addEventListener("click", () => {
      onConfirmar();
      cerrar();
    });
  }
}


/* ================================================
   16. TOAST NOTIFICATIONS
================================================ */
function mostrarToast(mensaje, tipo = "info", duracion = 3500) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const iconos = {
    success: "✅", danger: "❌", warning: "⚠️", info: "ℹ️"
  };

  const toast = document.createElement("div");
  toast.className = `toast toast--${tipo}`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <span class="toast__icon" aria-hidden="true">${iconos[tipo] || "ℹ️"}</span>
    <span class="toast__msg">${mensaje}</span>
    <button class="toast__close" aria-label="Cerrar notificación">✕</button>
  `;

  container.appendChild(toast);

  toast.querySelector(".toast__close")?.addEventListener("click", () => {
    toast.remove();
  });

  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity    = "0";
    toast.style.transform  = "translateX(20px)";
    setTimeout(() => toast.remove(), 300);
  }, duracion);
}


/* ================================================
   17. RELOJ EN TIEMPO REAL
================================================ */
function iniciarReloj() {
  function actualizar() {
    const ahora = new Date();
    const relojEl = document.getElementById("topbar-clock");
    const fechaEl = document.getElementById("topbar-date");

    if (relojEl) {
      relojEl.textContent = ahora.toLocaleTimeString("es-DO", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
      });
    }

    if (fechaEl) {
      fechaEl.textContent = ahora.toLocaleDateString("es-DO", {
        weekday: "short", day: "numeric", month: "short"
      });
    }
  }

  actualizar();
  setInterval(actualizar, 1000);
}


/* ================================================
   18. CERRAR SESIÓN
================================================ */
function cerrarSesion() {
  AppState.usuario = null;

  const appShell   = document.getElementById("app-shell");
  const loginScreen = document.getElementById("login-screen");

  if (appShell)   appShell.hidden   = true;
  if (loginScreen) {
    loginScreen.hidden = false;
    loginScreen.style.opacity = "1";
  }

  // Limpiar campos de login
  const inputUser = document.getElementById("login-user");
  const inputPass = document.getElementById("login-pass");
  if (inputUser) inputUser.value = "";
  if (inputPass) inputPass.value = "";

  mostrarToast("Sesión cerrada correctamente", "info");
}


/* ================================================
   19. FUNCIONES DE ACCIONES (ver, editar)
================================================ */
function verDetalle(tipo, id) {
  const textos = {
    caso:      { data: casos,     nombre: "Caso"     },
    detenido:  { data: detenidos, nombre: "Detenido" },
    incidente: { data: incidentes,nombre: "Incidente"},
  };

  const config = textos[tipo];
  if (!config) return;

  const item = config.data.find(i => i.id === id);
  if (!item) return;

  const filas = Object.entries(item).map(([k, v]) => `
    <div class="flex-between" style="padding: 0.4rem 0; border-bottom: 1px solid var(--color-border);">
      <span class="text-muted text-sm" style="text-transform:capitalize;">${k.replace(/_/g, " ")}</span>
      <span class="text-sm font-bold">${Array.isArray(v) ? v.join(", ") : v}</span>
    </div>
  `).join("");

  mostrarModal(`${config.nombre}: ${id}`, `<div>${filas}</div>`, null);
}

function editarRegistro(tipo, id) {
  mostrarToast(`Editando ${tipo} ${id}...`, "info");
}


/* ================================================
   20. UTILIDADES
================================================ */
function setEl(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}