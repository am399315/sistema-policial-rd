/* ================================================
   SISTEMA POLICIAL RD — turnos.js
   Módulo de Gestión de Turnos y Horarios
   Incluye:
     1. Datos de turnos por semana
     2. Calendario semanal interactivo
     3. Vista por turno (mañana, tarde, noche)
     4. Vista por zona geográfica
     5. Navegación entre semanas
     6. Asignación de nuevos turnos
================================================ */


/* ================================================
   1. DATOS DE TURNOS
================================================ */
const turnosData = [
  // Formato: { oficial, zona, turno, dias: [0-6] (0=lunes) }
  { oficial: "Of. Martínez",  zona: "DN Norte",        turno: "manana", dias: [0,1,2,3,4],    avatar: "👮" },
  { oficial: "Of. Jiménez",   zona: "DN Norte",        turno: "manana", dias: [0,1,2,3,4],    avatar: "👮" },
  { oficial: "Of. Fernández", zona: "DN Sur",          turno: "tarde",  dias: [0,1,2,3,4],    avatar: "👮" },
  { oficial: "Of. Castro",    zona: "DN Sur",          turno: "tarde",  dias: [0,1,2,3,4],    avatar: "👮" },
  { oficial: "Of. Santos",    zona: "Los Alcarrizos",  turno: "noche",  dias: [0,1,2,3,4,5,6],avatar: "👮" },
  { oficial: "Of. Reyes",     zona: "Los Alcarrizos",  turno: "noche",  dias: [0,1,2,3,4,5,6],avatar: "👮" },
  { oficial: "Of. Peña",      zona: "SDE",             turno: "manana", dias: [1,2,3,4,5],    avatar: "👩‍✈️" },
  { oficial: "Of. Núñez",     zona: "SDE",             turno: "tarde",  dias: [0,2,3,4,5],    avatar: "👮" },
  { oficial: "Of. Cruz",      zona: "SDE",             turno: "noche",  dias: [0,1,3,4,5],    avatar: "👮" },
  { oficial: "Of. Rosario",   zona: "Boca Chica",      turno: "manana", dias: [0,1,2,3,4],    avatar: "👮" },
  { oficial: "Of. Vargas",    zona: "Boca Chica",      turno: "tarde",  dias: [0,1,2,3,4],    avatar: "👩‍✈️" },
  { oficial: "Of. Luna",      zona: "San Cristóbal",   turno: "noche",  dias: [0,1,2,3,4,5],  avatar: "👮" },
  { oficial: "Of. Marte",     zona: "San Cristóbal",   turno: "manana", dias: [2,3,4,5,6],    avatar: "👮" },
  { oficial: "Of. Tejeda",    zona: "Zona Colonial",   turno: "manana", dias: [0,1,2,3,4,5,6],avatar: "👮" },
  { oficial: "Of. Almonte",   zona: "Santiago",        turno: "tarde",  dias: [1,2,3,4,5],    avatar: "👮" },
  { oficial: "Of. Brito",     zona: "Santiago",        turno: "noche",  dias: [1,2,3,4,5],    avatar: "👮" },
];

const configuracionTurnos = {
  manana: { nombre: "Mañana",  icono: "🌅", hora: "6:00 AM — 2:00 PM",  color: "#f59e0b", claseBadge: "badge--warning" },
  tarde:  { nombre: "Tarde",   icono: "🌤️", hora: "2:00 PM — 10:00 PM", color: "#3b82f6", claseBadge: "badge--info"    },
  noche:  { nombre: "Noche",   icono: "🌙", hora: "10:00 PM — 6:00 AM", color: "#8b5cf6", claseBadge: "badge--neutral" },
};

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const diasCortos = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];


/* ================================================
   2. ESTADO DEL MÓDULO
================================================ */
const TurnosState = {
  semanaOffset: 0,    // 0 = semana actual, -1 = anterior, 1 = siguiente
  vistaActual:  "semana",
};


/* ================================================
   3. INICIALIZAR MÓDULO DE TURNOS
================================================ */
function inicializarTurnos() {
  actualizarEtiquetaSemana();
  renderizarVista(TurnosState.vistaActual);
  actualizarContadoresTurnos();
  iniciarEventosTurnos();
}


/* ================================================
   4. EVENTOS DEL MÓDULO
================================================ */
function iniciarEventosTurnos() {

  // Navegación de semana
  document.getElementById("btn-semana-anterior")?.addEventListener("click", () => {
    TurnosState.semanaOffset--;
    actualizarEtiquetaSemana();
    renderizarVista(TurnosState.vistaActual);
  });

  document.getElementById("btn-semana-siguiente")?.addEventListener("click", () => {
    TurnosState.semanaOffset++;
    actualizarEtiquetaSemana();
    renderizarVista(TurnosState.vistaActual);
  });

  // Tabs de vista
  document.querySelectorAll(".vista-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".vista-tab").forEach(b => {
        b.classList.remove("vista-tab--activo");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("vista-tab--activo");
      btn.setAttribute("aria-pressed", "true");

      TurnosState.vistaActual = btn.dataset.vista;
      renderizarVista(TurnosState.vistaActual);
    });
  });

  // Botón nuevo turno
  document.getElementById("btn-nuevo-turno")?.addEventListener("click", () => {
    if (typeof mostrarModal === "function") {
      mostrarModal(
        "➕ Asignar Nuevo Turno",
        formularioNuevoTurno(),
        () => {
          if (typeof mostrarToast === "function") {
            mostrarToast("Turno asignado exitosamente", "success");
          }
        }
      );
    }
  });
}


/* ================================================
   5. OBTENER FECHAS DE LA SEMANA ACTUAL
================================================ */
function obtenerFechasSemana() {
  const hoy   = new Date();
  const diaSemana = hoy.getDay(); // 0=domingo, 1=lunes...
  const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana;

  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diffLunes + (TurnosState.semanaOffset * 7));

  const fechas = [];
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    fechas.push(fecha);
  }
  return fechas;
}

function actualizarEtiquetaSemana() {
  const fechas  = obtenerFechasSemana();
  const primera = fechas[0];
  const ultima  = fechas[6];

  const opciones = { day: "numeric", month: "short" };
  const label = `${primera.toLocaleDateString("es-DO", opciones)} — ${ultima.toLocaleDateString("es-DO", { ...opciones, year: "numeric" })}`;

  const el = document.getElementById("semana-label");
  if (el) el.textContent = label;

  const rangoEl = document.getElementById("rango-semana");
  if (rangoEl) rangoEl.textContent = label;
}

function esHoy(fecha) {
  const hoy = new Date();
  return fecha.getDate()     === hoy.getDate()  &&
         fecha.getMonth()    === hoy.getMonth()  &&
         fecha.getFullYear() === hoy.getFullYear();
}


/* ================================================
   6. RENDERIZAR VISTA ACTIVA
================================================ */
function renderizarVista(vista) {
  // Ocultar todas las vistas
  ["semana", "turno", "zona"].forEach(v => {
    const el = document.getElementById(`vista-${v}`);
    if (el) {
      el.hidden = true;
      el.style.display = "none";
    }
  });

  // Mostrar vista activa
  const vistaEl = document.getElementById(`vista-${vista}`);
  if (vistaEl) {
    vistaEl.hidden = false;
    vistaEl.style.display = "block";
  }

  // Renderizar contenido
  switch (vista) {
    case "semana": renderizarCalendarioSemanal(); break;
    case "turno":  renderizarVistaPorTurno();     break;
    case "zona":   renderizarVistaPorZona();      break;
  }
}


/* ================================================
   7. CALENDARIO SEMANAL
================================================ */
function renderizarCalendarioSemanal() {
  const contenedor = document.getElementById("calendario-semana");
  if (!contenedor) return;

  const fechas = obtenerFechasSemana();

  let html = `<div class="calendario-grid">`;

  // Columna vacía arriba a la izquierda
  html += `<div class="cal-dia-header" style="background:var(--color-surface-2);">
    <div class="cal-dia-header__nombre">Turno</div>
  </div>`;

  // Encabezados de días
  fechas.forEach((fecha, idx) => {
    const hoy = esHoy(fecha);
    html += `
      <div class="cal-dia-header ${hoy ? "cal-dia-header--hoy" : ""}"
           role="columnheader"
           aria-label="${diasSemana[idx]} ${fecha.getDate()}">
        <div class="cal-dia-header__nombre">${diasCortos[idx]}</div>
        <div class="cal-dia-header__numero">${fecha.getDate()}</div>
        ${hoy ? '<div style="font-size:0.6rem; color:var(--color-accent);">HOY</div>' : ""}
      </div>
    `;
  });

  // Filas por turno
  ["manana", "tarde", "noche"].forEach(turno => {
    const config = configuracionTurnos[turno];

    // Etiqueta del turno
    html += `
      <div class="cal-turno-label" role="rowheader" style="border-left: 3px solid ${config.color};">
        <div class="cal-turno-label__nombre">${config.icono} ${config.nombre}</div>
        <div class="cal-turno-label__hora">${config.hora}</div>
      </div>
    `;

    // Celdas por día
    fechas.forEach((fecha, diaIdx) => {
      const oficiales = turnosData.filter(t =>
        t.turno === turno && t.dias.includes(diaIdx)
      );

      html += `
        <div class="cal-celda cal-celda--${turno}"
             role="gridcell"
             aria-label="${diasSemana[diaIdx]} turno ${config.nombre}: ${oficiales.length} oficiales">
          ${oficiales.map(o => `
            <div class="cal-oficial-chip cal-oficial-chip--${turno}"
                 title="${o.oficial} — ${o.zona}"
                 tabindex="0"
                 role="button"
                 aria-label="${o.oficial}, zona ${o.zona}">
              ${o.avatar} ${o.oficial.replace("Of. ", "")}
            </div>
          `).join("")}
          ${oficiales.length === 0 ? `<div style="font-size:0.65rem; color:var(--color-text-muted); padding:4px;">Sin asignar</div>` : ""}
        </div>
      `;
    });
  });

  html += `</div>`;
  contenedor.innerHTML = html;
}


/* ================================================
   8. VISTA POR TURNO
================================================ */
function renderizarVistaPorTurno() {
  ["manana", "tarde", "noche"].forEach(turno => {
    const lista   = document.getElementById(`lista-turno-${turno}`);
    const badge   = document.getElementById(`badge-${turno}`);
    const config  = configuracionTurnos[turno];

    if (!lista) return;

    const oficiales = turnosData.filter(t => t.turno === turno);

    if (badge) {
      badge.textContent = `${oficiales.length} oficial${oficiales.length !== 1 ? "es" : ""}`;
    }

    if (oficiales.length === 0) {
      lista.innerHTML = `
        <div class="empty-state" style="padding:1rem;">
          <div class="empty-state__desc">Sin oficiales asignados</div>
        </div>
      `;
      return;
    }

    lista.innerHTML = oficiales.map(o => {
      // Calcular días activos esta semana
      const diasActivos = o.dias.length;
      const diasTexto   = diasActivos === 7 ? "Todos los días" :
                          diasActivos >= 5  ? "Lun — Vie" :
                          `${diasActivos} días/semana`;

      return `
        <div class="turno-oficial-item" role="listitem" tabindex="0"
             aria-label="${o.oficial}, zona ${o.zona}, ${diasTexto}">
          <div class="turno-oficial-avatar">${o.avatar}</div>
          <div class="turno-oficial-info">
            <div class="turno-oficial-nombre">${o.oficial}</div>
            <div class="turno-oficial-zona">📍 ${o.zona} — ${diasTexto}</div>
          </div>
          <div class="turno-oficial-estado">
            <span class="badge ${config.claseBadge}" style="font-size:0.65rem;">
              ${config.icono}
            </span>
          </div>
        </div>
      `;
    }).join("");
  });
}


/* ================================================
   9. VISTA POR ZONA
================================================ */
function renderizarVistaPorZona() {
  const contenedor = document.getElementById("zonas-cobertura");
  if (!contenedor) return;

  // Agrupar oficiales por zona
  const zonas = {};
  turnosData.forEach(t => {
    if (!zonas[t.zona]) {
      zonas[t.zona] = { manana: 0, tarde: 0, noche: 0, total: 0 };
    }
    zonas[t.zona][t.turno]++;
    zonas[t.zona].total++;
  });

  const maxTotal = Math.max(...Object.values(zonas).map(z => z.total));

  contenedor.innerHTML = Object.entries(zonas).map(([zona, data]) => {
    const porcentaje = Math.round((data.total / maxTotal) * 100);
    const cobertura  = porcentaje >= 80 ? "badge--success" :
                       porcentaje >= 50 ? "badge--warning" : "badge--danger";

    return `
      <div class="zona-cobertura-card" role="listitem"
           aria-label="Zona ${zona}: ${data.total} oficiales asignados">
        <div class="zona-cobertura-header">
          <span class="zona-cobertura-nombre">📍 ${zona}</span>
          <span class="badge ${cobertura}" style="font-size:0.65rem;">
            ${data.total} oficial${data.total !== 1 ? "es" : ""}
          </span>
        </div>
        <div class="zona-cobertura-barra-wrap">
          <div class="zona-cobertura-barra" style="width:${porcentaje}%;"
               role="progressbar"
               aria-valuenow="${data.total}"
               aria-valuemin="0"
               aria-valuemax="${maxTotal}"
               aria-label="${data.total} de ${maxTotal} oficiales máximo">
          </div>
        </div>
        <div class="zona-cobertura-info">
          <span>🌅 ${data.manana} mañana</span>
          <span>🌤️ ${data.tarde} tarde</span>
          <span>🌙 ${data.noche} noche</span>
        </div>
      </div>
    `;
  }).join("");
}


/* ================================================
   10. CONTADORES DE TURNOS
================================================ */
function actualizarContadoresTurnos() {
  const contadores = { manana: 0, tarde: 0, noche: 0 };

  turnosData.forEach(t => {
    contadores[t.turno]++;
  });

  const elManana = document.getElementById("count-manana");
  const elTarde  = document.getElementById("count-tarde");
  const elNoche  = document.getElementById("count-noche");

  if (elManana) elManana.textContent = contadores.manana;
  if (elTarde)  elTarde.textContent  = contadores.tarde;
  if (elNoche)  elNoche.textContent  = contadores.noche;
}


/* ================================================
   11. FORMULARIO DE NUEVO TURNO
================================================ */
function formularioNuevoTurno() {
  return `
    <div class="form-grid-modal">

      <div class="form-group">
        <label class="form-label">Oficial</label>
        <input type="text" class="form-input" id="nuevo-turno-oficial"
               placeholder="Nombre del oficial" />
      </div>

      <div class="form-group">
        <label class="form-label">Zona Asignada</label>
        <select class="form-input form-select" id="nuevo-turno-zona">
          <option value="">Selecciona zona</option>
          <option>DN Norte</option>
          <option>DN Sur</option>
          <option>Los Alcarrizos</option>
          <option>SDE</option>
          <option>Boca Chica</option>
          <option>San Cristóbal</option>
          <option>Zona Colonial</option>
          <option>Santiago</option>
        </select>
      </div>

      <div class="form-group form-group--full">
        <label class="form-label">Turno</label>
        <div style="display:flex; gap:0.75rem;">
          ${["manana", "tarde", "noche"].map(t => {
            const c = configuracionTurnos[t];
            return `
              <label style="display:flex; align-items:center; gap:0.4rem; cursor:pointer;
                            padding:0.5rem 0.75rem; border:1px solid var(--color-border);
                            border-radius:8px; flex:1; justify-content:center;
                            font-size:0.82rem; color:var(--color-text);">
                <input type="radio" name="nuevo-turno" value="${t}"
                       ${t === "manana" ? "checked" : ""}
                       style="accent-color:${c.color};" />
                ${c.icono} ${c.nombre}
              </label>
            `;
          }).join("")}
        </div>
      </div>

      <div class="form-group form-group--full">
        <label class="form-label">Días de la Semana</label>
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
          ${diasCortos.map((d, i) => `
            <label style="display:flex; flex-direction:column; align-items:center;
                          gap:3px; cursor:pointer; padding:0.4rem 0.6rem;
                          border:1px solid var(--color-border); border-radius:6px;
                          font-size:0.72rem; color:var(--color-text); min-width:40px;">
              <input type="checkbox" value="${i}"
                     ${i < 5 ? "checked" : ""}
                     style="accent-color:var(--color-accent);" />
              ${d}
            </label>
          `).join("")}
        </div>
      </div>

      <div class="form-group form-group--full">
        <label class="form-label">Observaciones</label>
        <textarea class="form-input form-textarea" rows="2"
                  placeholder="Notas adicionales sobre el turno..."></textarea>
      </div>

    </div>
  `;
}