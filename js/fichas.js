/* ================================================
   SISTEMA POLICIAL RD — fichas.js
   Módulo de Impresión de Fichas Oficiales
   Incluye:
     1. Ficha oficial de detenido
     2. Ficha de caso policial
     3. Reporte de incidente
     4. Vista previa antes de imprimir
     5. Estilos de impresión profesionales
================================================ */


/* ================================================
   1. GENERAR FICHA DE DETENIDO
================================================ */
function generarFichaDetenido(idDetenido) {
  const detenido = detenidos.find(d => d.id === idDetenido);
  if (!detenido) {
    if (typeof mostrarToast === "function") {
      mostrarToast("Detenido no encontrado", "danger");
    }
    return;
  }

  const numeroFicha = `FICHA-${Date.now().toString().slice(-6)}`;
  const fechaEmision = new Date().toLocaleDateString("es-DO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  const horaEmision = new Date().toLocaleTimeString("es-DO", {
    hour: "2-digit", minute: "2-digit"
  });

  const contenido = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8"/>
      <title>Ficha Oficial — ${detenido.nombre}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Arial', sans-serif;
          font-size: 12px;
          color: #000000;
          background: #ffffff;
          padding: 20px;
        }

        /* Encabezado oficial */
        .encabezado {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #003087;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .encabezado__logo {
          font-size: 48px;
          line-height: 1;
        }
        .encabezado__centro {
          text-align: center;
          flex: 1;
        }
        .encabezado__institucion {
          font-size: 16px;
          font-weight: 900;
          color: #003087;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .encabezado__pais {
          font-size: 11px;
          color: #666666;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .encabezado__titulo {
          font-size: 13px;
          font-weight: 700;
          color: #cc0000;
          margin-top: 6px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .encabezado__derecha {
          text-align: right;
          font-size: 10px;
          color: #666;
        }
        .encabezado__numero {
          font-size: 14px;
          font-weight: 700;
          color: #003087;
          font-family: monospace;
        }

        /* Clasificación */
        .clasificacion {
          background: #cc0000;
          color: #ffffff;
          text-align: center;
          padding: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          margin-bottom: 16px;
        }

        /* Secciones */
        .seccion {
          margin-bottom: 16px;
          border: 1px solid #cccccc;
          border-radius: 4px;
          overflow: hidden;
        }
        .seccion__titulo {
          background: #003087;
          color: #ffffff;
          padding: 5px 10px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .seccion__contenido {
          padding: 10px;
        }

        /* Grid de datos */
        .datos-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .datos-grid--3 {
          grid-template-columns: 1fr 1fr 1fr;
        }
        .dato {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .dato__label {
          font-size: 9px;
          color: #666666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
        .dato__valor {
          font-size: 12px;
          font-weight: 600;
          color: #000000;
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 2px;
        }
        .dato__valor--destacado {
          color: #cc0000;
          font-size: 13px;
        }

        /* Foto placeholder */
        .foto-section {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .foto-placeholder {
          width: 100px;
          height: 120px;
          border: 2px solid #003087;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          flex-shrink: 0;
          font-size: 36px;
        }
        .foto-placeholder__label {
          font-size: 8px;
          color: #999;
          margin-top: 4px;
          text-align: center;
        }
        .foto-datos { flex: 1; }

        /* Huellas */
        .huellas-section {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
        }
        .huella {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .huella__box {
          width: 100%;
          height: 50px;
          border: 1px solid #cccccc;
          background: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .huella__label {
          font-size: 8px;
          color: #999;
          text-align: center;
        }

        /* Firmas */
        .firmas-section {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
        }
        .firma {
          text-align: center;
        }
        .firma__linea {
          border-bottom: 1px solid #000;
          height: 40px;
          margin-bottom: 4px;
        }
        .firma__label {
          font-size: 9px;
          color: #666;
          text-transform: uppercase;
          font-weight: 700;
        }

        /* Código de verificación */
        .verificacion {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 2px solid #003087;
          font-size: 10px;
          color: #666;
        }
        .verificacion__codigo {
          font-family: monospace;
          font-size: 13px;
          font-weight: 700;
          color: #003087;
          background: #f0f4ff;
          padding: 4px 8px;
          border: 1px solid #003087;
          border-radius: 4px;
        }

        /* Advertencia */
        .advertencia {
          text-align: center;
          font-size: 9px;
          color: #666;
          margin-top: 8px;
          font-style: italic;
        }

        @media print {
          body { padding: 10px; }
          @page { margin: 1cm; size: letter; }
        }
      </style>
    </head>
    <body>

      <!-- ENCABEZADO OFICIAL -->
      <div class="encabezado">
        <div class="encabezado__logo">🚔</div>
        <div class="encabezado__centro">
          <div class="encabezado__institucion">Policía Nacional</div>
          <div class="encabezado__pais">República Dominicana</div>
          <div class="encabezado__titulo">⚠ Ficha de Detención — Documento Oficial ⚠</div>
        </div>
        <div class="encabezado__derecha">
          <div class="encabezado__numero">${numeroFicha}</div>
          <div>Emitido: ${fechaEmision}</div>
          <div>Hora: ${horaEmision}</div>
        </div>
      </div>

      <!-- CLASIFICACIÓN -->
      <div class="clasificacion">⚠ CONFIDENCIAL — USO OFICIAL EXCLUSIVO ⚠</div>

      <!-- DATOS PERSONALES -->
      <div class="seccion">
        <div class="seccion__titulo">I. Identificación del Detenido</div>
        <div class="seccion__contenido">
          <div class="foto-section">
            <div>
              <div class="foto-placeholder">
                ${detenido.genero === "M" ? "👨" : "👩"}
                <div class="foto-placeholder__label">FOTOGRAFÍA<br>FRONTAL</div>
              </div>
              <div style="margin-top:6px; text-align:center;">
                <div class="foto-placeholder" style="height:60px; font-size:20px;">
                  ${detenido.genero === "M" ? "👨" : "👩"}
                  <div class="foto-placeholder__label">PERFIL</div>
                </div>
              </div>
            </div>
            <div class="foto-datos">
              <div class="datos-grid" style="margin-bottom:8px;">
                <div class="dato" style="grid-column: 1/-1;">
                  <span class="dato__label">Nombre Completo</span>
                  <span class="dato__valor dato__valor--destacado">${detenido.nombre.toUpperCase()}</span>
                </div>
                <div class="dato">
                  <span class="dato__label">Número de Cédula</span>
                  <span class="dato__valor">${detenido.cedula}</span>
                </div>
                <div class="dato">
                  <span class="dato__label">ID de Registro</span>
                  <span class="dato__valor">${detenido.id}</span>
                </div>
                <div class="dato">
                  <span class="dato__label">Edad</span>
                  <span class="dato__valor">${detenido.edad} años</span>
                </div>
                <div class="dato">
                  <span class="dato__label">Género</span>
                  <span class="dato__valor">${detenido.genero === "M" ? "Masculino" : "Femenino"}</span>
                </div>
                <div class="dato">
                  <span class="dato__label">Nacionalidad</span>
                  <span class="dato__valor">${detenido.nacionalidad}</span>
                </div>
                <div class="dato">
                  <span class="dato__label">Estado Actual</span>
                  <span class="dato__valor dato__valor--destacado">${detenido.estado.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- INFORMACIÓN DEL ARRESTO -->
      <div class="seccion">
        <div class="seccion__titulo">II. Información del Arresto</div>
        <div class="seccion__contenido">
          <div class="datos-grid datos-grid--3">
            <div class="dato" style="grid-column: 1/-1;">
              <span class="dato__label">Cargo Imputado</span>
              <span class="dato__valor dato__valor--destacado">${detenido.cargo.toUpperCase()}</span>
            </div>
            <div class="dato">
              <span class="dato__label">Fecha de Detención</span>
              <span class="dato__valor">${detenido.fecha}</span>
            </div>
            <div class="dato">
              <span class="dato__label">Oficial a Cargo</span>
              <span class="dato__valor">${detenido.oficial}</span>
            </div>
            <div class="dato">
              <span class="dato__label">Unidad</span>
              <span class="dato__valor">Policía Nacional RD</span>
            </div>
            <div class="dato">
              <span class="dato__label">Lugar de Detención</span>
              <span class="dato__valor">Santo Domingo, RD</span>
            </div>
            <div class="dato">
              <span class="dato__label">Centro de Detención</span>
              <span class="dato__valor">Palacio de la Policía</span>
            </div>
            <div class="dato">
              <span class="dato__label">Número de Celda</span>
              <span class="dato__valor">—</span>
            </div>
          </div>
        </div>
      </div>

      <!-- HUELLAS DACTILARES -->
      <div class="seccion">
        <div class="seccion__titulo">III. Registro Dactilar</div>
        <div class="seccion__contenido">
          <div style="margin-bottom:8px; font-size:10px; color:#666;">Mano Derecha</div>
          <div class="huellas-section">
            ${["Pulgar", "Índice", "Medio", "Anular", "Meñique"].map(d => `
              <div class="huella">
                <div class="huella__box">👆</div>
                <div class="huella__label">${d}</div>
              </div>
            `).join("")}
          </div>
          <div style="margin: 8px 0; font-size:10px; color:#666;">Mano Izquierda</div>
          <div class="huellas-section">
            ${["Pulgar", "Índice", "Medio", "Anular", "Meñique"].map(d => `
              <div class="huella">
                <div class="huella__box">👆</div>
                <div class="huella__label">${d}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- OBSERVACIONES -->
      <div class="seccion">
        <div class="seccion__titulo">IV. Observaciones y Notas</div>
        <div class="seccion__contenido" style="min-height: 60px;">
          <div style="border: 1px solid #eee; min-height: 50px; padding: 6px; font-size:11px; color:#999;">
            Espacio para observaciones adicionales del oficial a cargo...
          </div>
        </div>
      </div>

      <!-- FIRMAS -->
      <div class="firmas-section">
        <div class="firma">
          <div class="firma__linea"></div>
          <div class="firma__label">Oficial que Detiene<br>${detenido.oficial}</div>
        </div>
        <div class="firma">
          <div class="firma__linea"></div>
          <div class="firma__label">Supervisor de Guardia<br>Firma y Sello</div>
        </div>
        <div class="firma">
          <div class="firma__linea"></div>
          <div class="firma__label">Detenido o Representante<br>Firma / Huella</div>
        </div>
      </div>

      <!-- VERIFICACIÓN -->
      <div class="verificacion">
        <div>
          <div>Documento generado por: Sistema Policial RD v1.0.0</div>
          <div>Fecha y hora de emisión: ${fechaEmision} — ${horaEmision}</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:9px; color:#999; margin-bottom:4px;">CÓDIGO DE VERIFICACIÓN</div>
          <div class="verificacion__codigo">${numeroFicha}-${detenido.cedula.slice(-4)}-PNRD</div>
        </div>
      </div>

      <div class="advertencia">
        Este documento es propiedad de la Policía Nacional de la República Dominicana.
        Su reproducción no autorizada está penada por la ley. Art. 210 del Código Penal RD.
      </div>

    </body>
    </html>
  `;

  abrirVentanaImpresion(contenido, `Ficha — ${detenido.nombre}`);
}


/* ================================================
   2. GENERAR FICHA DE CASO
================================================ */
function generarFichaCaso(idCaso) {
  const caso = casos.find(c => c.id === idCaso);
  if (!caso) {
    if (typeof mostrarToast === "function") {
      mostrarToast("Caso no encontrado", "danger");
    }
    return;
  }

  const numeroDoc   = `DOC-${Date.now().toString().slice(-6)}`;
  const fechaEmision = new Date().toLocaleDateString("es-DO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  const horaEmision = new Date().toLocaleTimeString("es-DO", {
    hour: "2-digit", minute: "2-digit"
  });

  const coloresEstado = {
    abierto:    "#f59e0b",
    cerrado:    "#22c55e",
    pendiente:  "#3b82f6",
    en_proceso: "#8b5cf6",
  };

  const contenido = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8"/>
      <title>Informe de Caso — ${caso.id}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #000; background: #fff; padding: 20px; }
        .encabezado { display:flex; align-items:center; justify-content:space-between; border-bottom: 3px solid #003087; padding-bottom: 12px; margin-bottom: 16px; }
        .encabezado__logo { font-size: 48px; }
        .encabezado__centro { text-align:center; flex:1; }
        .encabezado__institucion { font-size:16px; font-weight:900; color:#003087; letter-spacing:2px; text-transform:uppercase; }
        .encabezado__pais { font-size:11px; color:#666; letter-spacing:1px; text-transform:uppercase; margin-top:2px; }
        .encabezado__titulo { font-size:13px; font-weight:700; color:#cc0000; margin-top:6px; text-transform:uppercase; letter-spacing:1px; }
        .encabezado__derecha { text-align:right; font-size:10px; color:#666; }
        .encabezado__numero { font-size:14px; font-weight:700; color:#003087; font-family:monospace; }
        .clasificacion { background:#003087; color:#fff; text-align:center; padding:4px; font-size:11px; font-weight:700; letter-spacing:3px; margin-bottom:16px; }
        .seccion { margin-bottom:16px; border:1px solid #ccc; border-radius:4px; overflow:hidden; }
        .seccion__titulo { background:#003087; color:#fff; padding:5px 10px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
        .seccion__contenido { padding:10px; }
        .datos-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .dato { display:flex; flex-direction:column; gap:2px; }
        .dato__label { font-size:9px; color:#666; text-transform:uppercase; letter-spacing:.5px; font-weight:700; }
        .dato__valor { font-size:12px; font-weight:600; color:#000; border-bottom:1px solid #eee; padding-bottom:2px; }
        .estado-badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; color:#fff; background:${coloresEstado[caso.estado] || "#666"}; }
        .prioridad-alta { color:#cc0000; font-weight:900; }
        .prioridad-media { color:#f59e0b; font-weight:700; }
        .prioridad-baja { color:#22c55e; font-weight:700; }
        .linea-firma { border-bottom:1px solid #000; height:40px; margin-bottom:4px; }
        .firmas { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-top:24px; }
        .firma-label { font-size:9px; color:#666; text-transform:uppercase; font-weight:700; text-align:center; }
        .verificacion { display:flex; align-items:center; justify-content:space-between; margin-top:16px; padding-top:12px; border-top:2px solid #003087; font-size:10px; color:#666; }
        .verificacion__codigo { font-family:monospace; font-size:13px; font-weight:700; color:#003087; background:#f0f4ff; padding:4px 8px; border:1px solid #003087; border-radius:4px; }
        .advertencia { text-align:center; font-size:9px; color:#666; margin-top:8px; font-style:italic; }
        @media print { body { padding:10px; } @page { margin:1cm; size:letter; } }
      </style>
    </head>
    <body>

      <div class="encabezado">
        <div class="encabezado__logo">🚔</div>
        <div class="encabezado__centro">
          <div class="encabezado__institucion">Policía Nacional</div>
          <div class="encabezado__pais">República Dominicana</div>
          <div class="encabezado__titulo">Informe Oficial de Caso Policial</div>
        </div>
        <div class="encabezado__derecha">
          <div class="encabezado__numero">${numeroDoc}</div>
          <div>Emitido: ${fechaEmision}</div>
          <div>Hora: ${horaEmision}</div>
        </div>
      </div>

      <div class="clasificacion">DOCUMENTO OFICIAL — POLICÍA NACIONAL RD</div>

      <div class="seccion">
        <div class="seccion__titulo">I. Identificación del Caso</div>
        <div class="seccion__contenido">
          <div class="datos-grid">
            <div class="dato">
              <span class="dato__label">Número de Caso</span>
              <span class="dato__valor" style="color:#003087; font-size:14px;">${caso.id}</span>
            </div>
            <div class="dato">
              <span class="dato__label">Estado Actual</span>
              <span class="dato__valor"><span class="estado-badge">${caso.estado.replace("_", " ").toUpperCase()}</span></span>
            </div>
            <div class="dato">
              <span class="dato__label">Tipo de Delito</span>
              <span class="dato__valor" style="color:#cc0000; font-weight:700;">${caso.tipo.toUpperCase()}</span>
            </div>
            <div class="dato">
              <span class="dato__label">Prioridad</span>
              <span class="dato__valor ${caso.prioridad === "alta" ? "prioridad-alta" : caso.prioridad === "media" ? "prioridad-media" : "prioridad-baja"}">${caso.prioridad?.toUpperCase() || "MEDIA"}</span>
            </div>
            <div class="dato">
              <span class="dato__label">Fecha de Registro</span>
              <span class="dato__valor">${caso.fecha}</span>
            </div>
            <div class="dato">
              <span class="dato__label">Investigador Asignado</span>
              <span class="dato__valor">${caso.investigador}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="seccion">
        <div class="seccion__titulo">II. Descripción del Caso</div>
        <div class="seccion__contenido">
          <p style="font-size:12px; line-height:1.6; color:#333;">${caso.descripcion}</p>
          <div style="margin-top:12px; border:1px solid #eee; min-height:60px; padding:8px; font-size:11px; color:#999;">
            Narrativa adicional del caso (pendiente de completar por el investigador)...
          </div>
        </div>
      </div>

      <div class="seccion">
        <div class="seccion__titulo">III. Evidencias y Pruebas</div>
        <div class="seccion__contenido" style="min-height:60px;">
          <div style="border:1px solid #eee; min-height:50px; padding:6px; font-size:11px; color:#999;">
            Registro de evidencias recolectadas (pendiente de completar)...
          </div>
        </div>
      </div>

      <div class="seccion">
        <div class="seccion__titulo">IV. Personas Involucradas</div>
        <div class="seccion__contenido" style="min-height:60px;">
          <div style="border:1px solid #eee; min-height:50px; padding:6px; font-size:11px; color:#999;">
            Listado de personas involucradas, testigos y víctimas (pendiente)...
          </div>
        </div>
      </div>

      <div class="firmas">
        <div>
          <div class="linea-firma"></div>
          <div class="firma-label">Investigador a Cargo<br>${caso.investigador}</div>
        </div>
        <div>
          <div class="linea-firma"></div>
          <div class="firma-label">Jefe de Investigaciones<br>Firma y Sello</div>
        </div>
        <div>
          <div class="linea-firma"></div>
          <div class="firma-label">Director de la Unidad<br>Firma y Sello Oficial</div>
        </div>
      </div>

      <div class="verificacion">
        <div>
          <div>Generado por: Sistema Policial RD v1.0.0 — ${AppState?.usuario?.nombre || "Sistema"}</div>
          <div>Fecha: ${fechaEmision} — ${horaEmision}</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:9px; color:#999; margin-bottom:4px;">CÓDIGO DE VERIFICACIÓN</div>
          <div class="verificacion__codigo">${numeroDoc}-${caso.id.slice(-3)}-PNRD</div>
        </div>
      </div>

      <div class="advertencia">
        Documento oficial de la Policía Nacional de la República Dominicana.
        Uso exclusivo del personal autorizado. Ley 590-16 de Seguridad Pública.
      </div>

    </body>
    </html>
  `;

  abrirVentanaImpresion(contenido, `Caso — ${caso.id}`);
}


/* ================================================
   3. ABRIR VENTANA DE IMPRESIÓN
================================================ */
function abrirVentanaImpresion(contenido, titulo) {
  const ventana = window.open("", titulo, "width=900,height=700,scrollbars=yes");

  if (!ventana) {
    if (typeof mostrarToast === "function") {
      mostrarToast("Error al abrir la vista de impresión. Permite ventanas emergentes.", "danger");
    }
    return;
  }

  ventana.document.write(contenido);
  ventana.document.close();

  // Esperar a que cargue y abrir diálogo de impresión
  ventana.onload = () => {
    setTimeout(() => {
      ventana.focus();
      ventana.print();
    }, 500);
  };

  if (typeof mostrarToast === "function") {
    mostrarToast(`Ficha lista para imprimir: ${titulo}`, "success");
  }

  if (typeof anunciar === "function") {
    anunciar(`Ficha ${titulo} abierta para impresión`);
  }
}


/* ================================================
   4. AGREGAR BOTONES DE IMPRESIÓN A LAS TABLAS
   Se llama después de renderizar las tablas
================================================ */
function agregarBotonesImpresion() {

  // Agregar botón en tabla de detenidos
  const tbodyDetenidos = document.getElementById("detenidos-tbody");
  if (tbodyDetenidos) {
    tbodyDetenidos.querySelectorAll("tr").forEach(fila => {
      const celdaAcciones = fila.querySelector("td:last-child");
      const idDetenido = fila.querySelector(".text-accent")?.textContent?.trim();
      // Evitar duplicados con clase btn-imprimir
      if (celdaAcciones && idDetenido && !celdaAcciones.querySelector(".btn-imprimir")) {
        const btnImprimir = document.createElement("button");
        btnImprimir.className = "btn btn--sm btn--ghost btn-imprimir";
        btnImprimir.innerHTML = "🖨️";
        btnImprimir.title = "Imprimir ficha oficial";
        btnImprimir.setAttribute("aria-label", `Imprimir ficha del detenido ${idDetenido}`);
        btnImprimir.addEventListener("click", (e) => {
          e.stopPropagation();
          generarFichaDetenido(idDetenido);
        });
        const btnWrap = celdaAcciones.querySelector("div");
        if (btnWrap) btnWrap.appendChild(btnImprimir);
      }
    });
  }

  // Agregar botón en tabla de casos
  const tbodyCasos = document.getElementById("casos-tbody");
  if (tbodyCasos) {
    tbodyCasos.querySelectorAll("tr").forEach(fila => {
      const celdaAcciones = fila.querySelector("td:last-child");
      const idCaso = fila.querySelector(".text-accent")?.textContent?.trim();
      // Evitar duplicados con clase btn-imprimir
      if (celdaAcciones && idCaso && !celdaAcciones.querySelector(".btn-imprimir")) {
        const btnImprimir = document.createElement("button");
        btnImprimir.className = "btn btn--sm btn--ghost btn-imprimir";
        btnImprimir.innerHTML = "🖨️";
        btnImprimir.title = "Imprimir informe del caso";
        btnImprimir.setAttribute("aria-label", `Imprimir informe del caso ${idCaso}`);
        btnImprimir.addEventListener("click", (e) => {
          e.stopPropagation();
          generarFichaCaso(idCaso);
        });
        const btnWrap = celdaAcciones.querySelector("div");
        if (btnWrap) btnWrap.appendChild(btnImprimir);
      }
    });
  }
}


/* ================================================
   5. INTEGRACIÓN CON EL SISTEMA
================================================ */
document.addEventListener("DOMContentLoaded", () => {
  let procesando = false;

  const observer = new MutationObserver(() => {
    if (procesando) return;
    procesando = true;
    setTimeout(() => {
      agregarBotonesImpresion();
      procesando = false;
    }, 400);
  });

  const container = document.getElementById("module-container");
  if (container) {
    // Solo observar cambios directos (subtree: false evita el bucle)
    observer.observe(container, { childList: true, subtree: false });
  }

  console.log("✅ Módulo de fichas e impresión iniciado");
});