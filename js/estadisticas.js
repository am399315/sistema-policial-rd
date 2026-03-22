/* ================================================
   SISTEMA POLICIAL RD — estadisticas.js
   Panel de Estadísticas Avanzadas
   Incluye:
     1. KPIs con semáforos
     2. Tendencia anual (línea)
     3. Radar de tipos de delito
     4. Top 5 zonas peligrosas
     5. Termómetro de nivel de alerta
     6. Comparativa mensual
     7. Tabla de rendimiento por unidad
================================================ */


/* ================================================
   1. DATOS DE ESTADÍSTICAS AVANZADAS
================================================ */
const datosEstadisticas = {

  kpis: {
    resolucion: { valor: 72, meta: 75,  unidad: "%"   },
    respuesta:  { valor: 6,  meta: 8,   unidad: " min" },
    cobertura:  { valor: 85, meta: 90,  unidad: "%"   },
    incidentes: { valor: 78, meta: 80,  unidad: "%"   },
  },

  // Tendencia anual 2024 vs 2025
  tendenciaAnual: {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    data2024: [38, 42, 35, 48, 52, 45, 58, 61, 49, 55, 43, 50],
    data2025: [45, 52, 48, 61, 58, 55, 0,  0,  0,  0,  0,  0 ],
  },

  // Radar de tipos de delito
  radar: {
    labels: ["Robo", "Homicidio", "Narcotráfico", "Fraude", "Violencia DOM", "Secuestro"],
    data:   [85,     45,           70,              30,        55,              20         ],
  },

  // Top zonas peligrosas
  topZonas: [
    { nombre: "Los Guandules",        incidentes: 45, color: "#ef4444" },
    { nombre: "Los Alcarrizos",       incidentes: 31, color: "#f59e0b" },
    { nombre: "Villa Consuelo",       incidentes: 22, color: "#3b82f6" },
    { nombre: "Distrito Nacional Norte", incidentes: 28, color: "#8b5cf6" },
    { nombre: "Santiago",             incidentes: 19, color: "#22c55e" },
  ],

  // Comparativa mensual (últimos 6 meses)
  comparativa: {
    labels:    ["Ago",  "Sep",  "Oct",  "Nov",  "Dic",  "Ene"  ],
    casos:     [61,     49,     55,     43,     50,     45     ],
    detenidos: [28,     22,     31,     19,     24,     21     ],
    incidentes:[45,     38,     42,     35,     40,     37     ],
  },

  // Rendimiento por unidad
  rendimiento: [
    { unidad: "Patrulla Alpha",   zona: "DN Norte",   casos: 18, incidentes: 12, tiempoResp: "5 min",  calificacion: 5 },
    { unidad: "Patrulla Bravo",   zona: "DN Sur",     casos: 14, incidentes: 9,  tiempoResp: "7 min",  calificacion: 4 },
    { unidad: "Patrulla Charlie", zona: "Alcarrizos", casos: 22, incidentes: 16, tiempoResp: "8 min",  calificacion: 4 },
    { unidad: "Patrulla Delta",   zona: "SDE",        casos: 10, incidentes: 7,  tiempoResp: "6 min",  calificacion: 3 },
    { unidad: "Patrulla Echo",    zona: "Boca Chica", casos: 8,  incidentes: 4,  tiempoResp: "9 min",  calificacion: 4 },
    { unidad: "Patrulla Foxtrot", zona: "S. Cristóbal",casos: 12,incidentes: 8,  tiempoResp: "11 min", calificacion: 3 },
    { unidad: "Unidad Motorizada",zona: "Z. Colonial",casos: 6,  incidentes: 5,  tiempoResp: "4 min",  calificacion: 5 },
    { unidad: "Patrulla Golf",    zona: "Santiago",   casos: 16, incidentes: 11, tiempoResp: "7 min",  calificacion: 4 },
  ],
};


/* ================================================
   2. INICIALIZAR MÓDULO
================================================ */
function inicializarEstadisticas() {
  actualizarPeriodoLabel();
  renderizarKPIs();
  renderizarTopZonas();
  renderizarTermometro();
  renderizarTablaRendimiento();

  // Gráficas (con pequeño delay para asegurar que el DOM esté listo)
  setTimeout(() => {
    renderizarGraficaTendencia();
    renderizarGraficaRadar();
    renderizarGraficaComparativa();
  }, 100);

  // Evento actualizar
  document.getElementById("btn-actualizar-stats")?.addEventListener("click", () => {
    actualizarEstadisticasConAnimacion();
  });

  // Evento cambio de período
  document.getElementById("stats-periodo-select")?.addEventListener("change", () => {
    actualizarEstadisticasConAnimacion();
  });
}


/* ================================================
   3. ACTUALIZAR LABEL DE PERÍODO
================================================ */
function actualizarPeriodoLabel() {
  const select = document.getElementById("stats-periodo-select");
  const label  = document.getElementById("stats-periodo");
  if (!label) return;

  const fecha = new Date();
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  const textos = {
    mes:       `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`,
    trimestre: `Q${Math.ceil((fecha.getMonth()+1)/3)} ${fecha.getFullYear()}`,
    anio:      `Año ${fecha.getFullYear()}`,
  };

  label.textContent = textos[select?.value || "mes"];
}


/* ================================================
   4. KPIs CON SEMÁFOROS
================================================ */
function renderizarKPIs() {
  const { kpis } = datosEstadisticas;

  // Resolucion
  renderizarKPI("resolucion", kpis.resolucion.valor, kpis.resolucion.meta, "%");

  // Respuesta (invertido: menor es mejor)
  const pctRespuesta = Math.round((1 - kpis.respuesta.valor / 15) * 100);
  renderizarKPI("respuesta", kpis.respuesta.valor, kpis.respuesta.meta, " min", pctRespuesta, true);

  // Cobertura
  renderizarKPI("cobertura", kpis.cobertura.valor, kpis.cobertura.meta, "%");

  // Incidentes resueltos
  renderizarKPI("incidentes", kpis.incidentes.valor, kpis.incidentes.meta, "%");
}

function renderizarKPI(id, valor, meta, unidad, pctCustom = null, invertido = false) {
  const elValor  = document.getElementById(`kpi-${id}`);
  const elBarra  = document.getElementById(`barra-${id}`);
  const elSem    = document.getElementById(`sem-${id}`);
  const elMeta   = document.getElementById(`meta-${id}`);

  if (elValor) {
    // Animar el número
    animarNumero(elValor, 0, valor, unidad);
  }

  const pct = pctCustom !== null ? pctCustom : Math.min(Math.round((valor / meta) * 100), 100);

  // Barra de progreso
  if (elBarra) {
    setTimeout(() => {
      elBarra.style.width = `${Math.min(valor, 100)}%`;

      // Color según rendimiento
      if (pct >= 90)      elBarra.style.backgroundColor = "#22c55e";
      else if (pct >= 70) elBarra.style.backgroundColor = "#f59e0b";
      else                elBarra.style.backgroundColor = "#ef4444";
    }, 300);
  }

  // Semáforo
  if (elSem) {
    let clase = "";
    if (invertido) {
      clase = valor <= meta ? "semaforo-verde" : valor <= meta * 1.5 ? "semaforo-amarillo" : "semaforo-rojo";
    } else {
      clase = valor >= meta ? "semaforo-verde" : valor >= meta * 0.8 ? "semaforo-amarillo" : "semaforo-rojo";
    }
    elSem.className = `kpi-card__semaforo ${clase}`;

    const textoSem = clase.includes("verde") ? "Cumpliendo meta" :
                     clase.includes("amarillo") ? "Cerca de la meta" : "Por debajo de la meta";
    elSem.setAttribute("aria-label", textoSem);
  }

  // Meta label
  if (elMeta) {
    const textoMeta = invertido ? `Meta: <${meta}${unidad}` : `Meta: ${meta}${unidad}`;
    elMeta.innerHTML = textoMeta;
  }
}

// Animar número del 0 al valor final
function animarNumero(el, desde, hasta, sufijo = "") {
  const duracion = 1200;
  const pasos    = 60;
  const incremento = (hasta - desde) / pasos;
  let actual = desde;
  let paso   = 0;

  const interval = setInterval(() => {
    actual += incremento;
    paso++;
    el.textContent = Math.round(actual) + sufijo;

    if (paso >= pasos) {
      clearInterval(interval);
      el.textContent = hasta + sufijo;
    }
  }, duracion / pasos);
}


/* ================================================
   5. GRÁFICA DE TENDENCIA ANUAL (Línea)
================================================ */
function renderizarGraficaTendencia() {
  const ctx = document.getElementById("chart-tendencia");
  if (!ctx || !window.Chart) return;

  // Destruir gráfica anterior si existe
  if (ctx._chartInstance) ctx._chartInstance.destroy();

  // Leyenda personalizada
  const legend = document.getElementById("legend-tendencia");
  if (legend) {
    legend.innerHTML = `
      <div class="chart-legend__item">
        <span class="chart-legend__dot" style="background:#3b82f6;"></span>
        2024
      </div>
      <div class="chart-legend__item">
        <span class="chart-legend__dot" style="background:#22c55e;"></span>
        2025
      </div>
    `;
  }

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: datosEstadisticas.tendenciaAnual.labels,
      datasets: [
        {
          label: "2024",
          data:  datosEstadisticas.tendenciaAnual.data2024,
          borderColor:     "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.08)",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#3b82f6",
          tension: 0.4,
          fill: true,
        },
        {
          label: "2025",
          data:  datosEstadisticas.tendenciaAnual.data2025.map(v => v > 0 ? v : null),
          borderColor:     "#22c55e",
          backgroundColor: "rgba(34,197,94,0.08)",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#22c55e",
          tension: 0.4,
          fill: true,
          spanGaps: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: "#64748b", font: { size: 10 } },
          grid:  { color: "rgba(255,255,255,0.05)" },
        },
        y: {
          ticks: { color: "#64748b", font: { size: 10 } },
          grid:  { color: "rgba(255,255,255,0.05)" },
          beginAtZero: true,
        }
      },
      interaction: { intersect: false, mode: "index" },
    }
  });

  ctx._chartInstance = chart;
}


/* ================================================
   6. GRÁFICA RADAR
================================================ */
function renderizarGraficaRadar() {
  const ctx = document.getElementById("chart-radar");
  if (!ctx || !window.Chart) return;

  if (ctx._chartInstance) ctx._chartInstance.destroy();

  const chart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: datosEstadisticas.radar.labels,
      datasets: [{
        label: "Incidencias",
        data:  datosEstadisticas.radar.data,
        backgroundColor: "rgba(59,130,246,0.15)",
        borderColor:     "#3b82f6",
        borderWidth: 2,
        pointBackgroundColor: "#3b82f6",
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          ticks: {
            color:     "#64748b",
            font:      { size: 9 },
            backdropColor: "transparent",
          },
          grid:        { color: "rgba(255,255,255,0.08)" },
          pointLabels: { color: "#94a3b8", font: { size: 10 } },
          beginAtZero: true,
          max: 100,
        }
      }
    }
  });

  ctx._chartInstance = chart;
}


/* ================================================
   7. TOP 5 ZONAS MÁS PELIGROSAS
================================================ */
function renderizarTopZonas() {
  const contenedor = document.getElementById("top-zonas");
  if (!contenedor) return;

  const zonas    = datosEstadisticas.topZonas;
  const maxVal   = Math.max(...zonas.map(z => z.incidentes));
  const medalles = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

  contenedor.innerHTML = zonas
    .sort((a, b) => b.incidentes - a.incidentes)
    .map((zona, idx) => {
      const pct = Math.round((zona.incidentes / maxVal) * 100);
      return `
        <div class="top-zona-item" role="listitem"
             aria-label="${idx + 1}. ${zona.nombre}: ${zona.incidentes} incidentes">
          <div class="top-zona-item__posicion top-zona-item__posicion--${idx + 1}"
               aria-hidden="true">
            ${medalles[idx]}
          </div>
          <div class="top-zona-item__info">
            <div class="top-zona-item__nombre">${zona.nombre}</div>
            <div class="top-zona-item__barra-wrap">
              <div class="top-zona-item__barra"
                   style="width:0%; background-color:${zona.color};"
                   data-width="${pct}">
              </div>
            </div>
          </div>
          <div class="top-zona-item__count">${zona.incidentes}</div>
        </div>
      `;
    }).join("");

  // Animar barras
  setTimeout(() => {
    contenedor.querySelectorAll(".top-zona-item__barra").forEach(barra => {
      barra.style.transition = "width 1s ease";
      barra.style.width = barra.dataset.width + "%";
    });
  }, 200);
}


/* ================================================
   8. TERMÓMETRO DE NIVEL DE ALERTA
================================================ */
function renderizarTermometro() {
  // Calcular nivel basado en KPIs y zonas críticas
  const { kpis } = datosEstadisticas;
  const zonasAlto = datosEstadisticas.topZonas.filter(z => z.incidentes > 25).length;

  // Fórmula: promedio ponderado de factores negativos
  const nivelBase = Math.round(
    (100 - kpis.resolucion.valor) * 0.3 +
    (kpis.respuesta.valor / 15 * 100) * 0.2 +
    (100 - kpis.cobertura.valor) * 0.2 +
    (zonasAlto / datosEstadisticas.topZonas.length * 100) * 0.3
  );

  const nivel = Math.min(Math.max(nivelBase, 0), 100);

  const elTermometro = document.getElementById("termometro");
  const elRelleno    = document.getElementById("termometro-relleno");
  const elValor      = document.getElementById("termometro-valor");
  const elLabel      = document.getElementById("termometro-label");

  if (elTermometro) {
    elTermometro.setAttribute("aria-valuenow", nivel);
  }

  // Determinar color y etiqueta
  let color, label;
  if (nivel >= 75) {
    color = "#ef4444"; label = "🔴 Nivel Crítico";
  } else if (nivel >= 50) {
    color = "#f59e0b"; label = "🟡 Nivel Alto";
  } else if (nivel >= 25) {
    color = "#3b82f6"; label = "🔵 Nivel Medio";
  } else {
    color = "#22c55e"; label = "🟢 Nivel Bajo";
  }

  if (elRelleno) {
    setTimeout(() => {
      elRelleno.style.height = `${nivel}%`;
      elRelleno.style.backgroundColor = color;
    }, 400);
  }

  if (elValor) animarNumero(elValor, 0, nivel, "");
  if (elLabel) elLabel.textContent = label;
  if (elLabel) elLabel.style.color = color;
}


/* ================================================
   9. GRÁFICA COMPARATIVA MENSUAL (Barras agrupadas)
================================================ */
function renderizarGraficaComparativa() {
  const ctx = document.getElementById("chart-comparativa");
  if (!ctx || !window.Chart) return;

  if (ctx._chartInstance) ctx._chartInstance.destroy();

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: datosEstadisticas.comparativa.labels,
      datasets: [
        {
          label: "Casos",
          data:  datosEstadisticas.comparativa.casos,
          backgroundColor: "rgba(59,130,246,0.75)",
          borderColor:     "#3b82f6",
          borderWidth: 1,
          borderRadius: 3,
        },
        {
          label: "Detenidos",
          data:  datosEstadisticas.comparativa.detenidos,
          backgroundColor: "rgba(239,68,68,0.75)",
          borderColor:     "#ef4444",
          borderWidth: 1,
          borderRadius: 3,
        },
        {
          label: "Incidentes",
          data:  datosEstadisticas.comparativa.incidentes,
          backgroundColor: "rgba(245,158,11,0.75)",
          borderColor:     "#f59e0b",
          borderWidth: 1,
          borderRadius: 3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color:    "#94a3b8",
            font:     { size: 11 },
            boxWidth: 12,
            padding:  12,
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#64748b", font: { size: 11 } },
          grid:  { display: false },
        },
        y: {
          ticks: { color: "#64748b", font: { size: 10 } },
          grid:  { color: "rgba(255,255,255,0.05)" },
          beginAtZero: true,
        }
      }
    }
  });

  ctx._chartInstance = chart;
}


/* ================================================
   10. TABLA DE RENDIMIENTO POR UNIDAD
================================================ */
function renderizarTablaRendimiento() {
  const tbody = document.getElementById("tabla-rendimiento");
  if (!tbody) return;

  tbody.innerHTML = datosEstadisticas.rendimiento.map(u => {
    // Estrellas de calificación
    const estrellas = Array.from({ length: 5 }, (_, i) =>
      `<span class="${i < u.calificacion ? "star-llena" : "star-vacia"}" aria-hidden="true">★</span>`
    ).join("");

    // Badge de calificación
    const badgeClass = u.calificacion >= 5 ? "badge--success" :
                       u.calificacion >= 4 ? "badge--info"    :
                       u.calificacion >= 3 ? "badge--warning" : "badge--danger";

    const tiempoNum = parseInt(u.tiempoResp);
    const tiempoClass = tiempoNum <= 5 ? "badge--success" :
                        tiempoNum <= 8 ? "badge--warning" : "badge--danger";

    return `
      <tr>
        <td>
          <div style="font-weight:600;">🚔 ${u.unidad}</div>
        </td>
        <td>
          <span class="text-sm text-muted">📍 ${u.zona}</span>
        </td>
        <td>
          <span class="font-bold" style="color:var(--color-accent);">${u.casos}</span>
        </td>
        <td>
          <span class="font-bold">${u.incidentes}</span>
        </td>
        <td>
          <span class="badge ${tiempoClass}">${u.tiempoResp}</span>
        </td>
        <td>
          <div class="calificacion-stars" aria-label="${u.calificacion} de 5 estrellas">
            ${estrellas}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}


/* ================================================
   11. ACTUALIZAR CON ANIMACIÓN
================================================ */
function actualizarEstadisticasConAnimacion() {
  // Simular variación aleatoria en los datos
  const variacion = () => Math.round((Math.random() - 0.5) * 10);

  datosEstadisticas.kpis.resolucion.valor = Math.min(100, Math.max(50, 72 + variacion()));
  datosEstadisticas.kpis.respuesta.valor  = Math.min(15,  Math.max(3,   6  + Math.round((Math.random()-0.5)*3)));
  datosEstadisticas.kpis.cobertura.valor  = Math.min(100, Math.max(60, 85 + variacion()));
  datosEstadisticas.kpis.incidentes.valor = Math.min(100, Math.max(50, 78 + variacion()));

  // Re-renderizar todo
  actualizarPeriodoLabel();
  renderizarKPIs();
  renderizarTopZonas();
  renderizarTermometro();

  setTimeout(() => {
    renderizarGraficaTendencia();
    renderizarGraficaRadar();
    renderizarGraficaComparativa();
  }, 100);

  if (typeof mostrarToast === "function") {
    mostrarToast("Estadísticas actualizadas correctamente", "success");
  }

  if (typeof anunciar === "function") {
    anunciar("Estadísticas actualizadas");
  }
}