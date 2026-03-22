/* ================================================
   SISTEMA POLICIAL RD — chat.js
   Sistema de Chat Interno entre Oficiales
   Incluye:
     1. Contactos y grupos
     2. Historial de mensajes simulado
     3. Envío de mensajes en tiempo real
     4. Indicador de escritura
     5. Mensajes rápidos
     6. Notificaciones de nuevos mensajes
     7. Búsqueda de contactos
================================================ */


/* ================================================
   1. DATOS DE CONTACTOS
================================================ */
const chatContactos = [
  { id: "c1",  nombre: "Comando Central",     avatar: "🏛️", rol: "Comando",          estado: "online",   tipo: "directo" },
  { id: "c2",  nombre: "Det. Rodríguez",       avatar: "🕵️", rol: "Detective",         estado: "online",   tipo: "directo" },
  { id: "c3",  nombre: "Det. Martínez",        avatar: "🕵️", rol: "Detective",         estado: "online",   tipo: "directo" },
  { id: "c4",  nombre: "Of. Santos",           avatar: "👮", rol: "Oficial Patrulla",  estado: "ocupado",  tipo: "directo" },
  { id: "c5",  nombre: "Of. Jiménez",          avatar: "👮", rol: "Oficial Patrulla",  estado: "online",   tipo: "directo" },
  { id: "c6",  nombre: "Of. Fernández",        avatar: "👮", rol: "Oficial Patrulla",  estado: "ausente",  tipo: "directo" },
  { id: "c7",  nombre: "Anal. Peña",           avatar: "💻", rol: "Analista",          estado: "online",   tipo: "directo" },
  { id: "c8",  nombre: "Of. Rosario",          avatar: "👩‍✈️",rol: "Oficial Patrulla",  estado: "offline",  tipo: "directo" },
];

const chatGrupos = [
  { id: "g1", nombre: "🚔 Patrulla Alpha",      avatar: "🚔", miembros: 4,  estado: "online",  tipo: "grupo", descripcion: "Zona Norte"    },
  { id: "g2", nombre: "🔴 Alertas Urgentes",    avatar: "🚨", miembros: 12, estado: "online",  tipo: "grupo", descripcion: "Todo el personal" },
  { id: "g3", nombre: "🕵️ Investigaciones",     avatar: "🕵️", miembros: 5,  estado: "online",  tipo: "grupo", descripcion: "Unidad especial"  },
  { id: "g4", nombre: "📊 Análisis e Intel",    avatar: "📊", miembros: 3,  estado: "ausente", tipo: "grupo", descripcion: "Inteligencia"     },
  { id: "g5", nombre: "🌙 Turno Noche",         avatar: "🌙", miembros: 6,  estado: "online",  tipo: "grupo", descripcion: "10PM - 6AM"       },
];


/* ================================================
   2. HISTORIAL DE MENSAJES SIMULADOS
================================================ */
const historialMensajes = {
  "c1": [
    { id: "m1", autor: "Comando Central", avatar: "🏛️", texto: "Buenos días. Todas las unidades reportar novedad.", hora: "06:05", propio: false, leido: true },
    { id: "m2", autor: "Tú",             avatar: "👮", texto: "Unidad Alpha reporta sin novedad. Iniciando ronda.", hora: "06:07", propio: true,  leido: true },
    { id: "m3", autor: "Comando Central", avatar: "🏛️", texto: "Recibido. Mantengan comunicación cada hora.", hora: "06:08", propio: false, leido: true },
    { id: "m4", autor: "Comando Central", avatar: "🏛️", texto: "Alerta: Incrementar patrullaje en Los Guandules.", hora: "08:32", propio: false, leido: true },
    { id: "m5", autor: "Tú",             avatar: "👮", texto: "Confirmado. Redirigiendo patrulla al sector.", hora: "08:34", propio: true,  leido: true },
  ],
  "c2": [
    { id: "m6",  autor: "Det. Rodríguez", avatar: "🕵️", texto: "Necesito información sobre el caso CASO-2025-006.", hora: "09:15", propio: false, leido: true  },
    { id: "m7",  autor: "Tú",            avatar: "👮", texto: "Revisa el sistema, ya actualicé los datos del sospechoso.", hora: "09:18", propio: true,  leido: true  },
    { id: "m8",  autor: "Det. Rodríguez", avatar: "🕵️", texto: "Perfecto, gracias. ¿Tienes el número de cédula?", hora: "09:19", propio: false, leido: true  },
    { id: "m9",  autor: "Tú",            avatar: "👮", texto: "001-1234567-8. Está en el registro DET-001.", hora: "09:20", propio: true,  leido: true  },
    { id: "m10", autor: "Det. Rodríguez", avatar: "🕵️", texto: "Excelente. Voy a verificarlo ahora mismo. 👍", hora: "09:21", propio: false, leido: false },
  ],
  "c4": [
    { id: "m11", autor: "Of. Santos", avatar: "👮", texto: "Requiero apoyo 🚨 Situación en sector Los Alcarrizos.", hora: "11:45", propio: false, leido: false },
    { id: "m12", autor: "Of. Santos", avatar: "👮", texto: "Hay un altercado entre grupos. Al menos 10 personas.", hora: "11:46", propio: false, leido: false },
  ],
  "g2": [
    { id: "m13", autor: "Comando Central", avatar: "🏛️", texto: "🚨 ALERTA MÁXIMA: Zona Los Guandules nivel crítico.", hora: "10:00", propio: false, leido: true  },
    { id: "m14", autor: "Det. Martínez",   avatar: "🕵️", texto: "Confirmado. Ya tenemos 3 unidades en camino.", hora: "10:02", propio: false, leido: true  },
    { id: "m15", autor: "Of. Jiménez",     avatar: "👮", texto: "Patrulla Bravo en camino. ETA 5 minutos.", hora: "10:03", propio: false, leido: true  },
    { id: "m16", autor: "Tú",             avatar: "👮", texto: "En camino 🚔", hora: "10:04", propio: true,  leido: true  },
    { id: "m17", autor: "Anal. Peña",      avatar: "💻", texto: "Monitoreando desde central. Mantengan comunicación.", hora: "10:05", propio: false, leido: true  },
  ],
  "g1": [
    { id: "m18", autor: "Of. Martínez", avatar: "👮", texto: "Patrulla Alpha lista para el turno.", hora: "05:55", propio: false, leido: true },
    { id: "m19", autor: "Tú",          avatar: "👮", texto: "Confirmado. Ruta asignada: DN Norte sector A.", hora: "05:57", propio: true,  leido: true },
    { id: "m20", autor: "Of. Jiménez", avatar: "👮", texto: "Vehículo revisado y listo. Saliendo.", hora: "06:00", propio: false, leido: true },
  ],
};


/* ================================================
   3. ESTADO DEL CHAT
================================================ */
const ChatState = {
  contactoActivo: null,
  tabActiva:      "directos",
  intervaloSimulacion: null,
  noLeidosPorContacto: {
    "c4": 2,
    "c2": 1,
    "g2": 0,
  },
};


/* ================================================
   4. INICIALIZAR MÓDULO DE CHAT
================================================ */
function inicializarChat() {
  renderizarListaContactos();
  renderizarListaGrupos();
  actualizarEstadisticasChat();
  iniciarEventosChat();
  iniciarSimulacionMensajes();
}


/* ================================================
   5. RENDERIZAR LISTA DE CONTACTOS
================================================ */
function renderizarListaContactos(filtro = "") {
  const lista = document.getElementById("lista-directos");
  if (!lista) return;

  const contactosFiltrados = chatContactos.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.rol.toLowerCase().includes(filtro.toLowerCase())
  );

  if (contactosFiltrados.length === 0) {
    lista.innerHTML = `<div class="empty-state" style="padding:1.5rem;"><div class="empty-state__desc">Sin resultados</div></div>`;
    return;
  }

  lista.innerHTML = contactosFiltrados.map(c => {
    const mensajes   = historialMensajes[c.id] || [];
    const ultimo     = mensajes[mensajes.length - 1];
    const noLeidos   = ChatState.noLeidosPorContacto[c.id] || 0;
    const esActivo   = ChatState.contactoActivo?.id === c.id;

    const colorEstado = {
      online:  "verde",
      ocupado: "amarillo",
      ausente: "amarillo",
      offline: "gris",
    }[c.estado] || "gris";

    return `
      <div class="chat-contacto ${esActivo ? "chat-contacto--activo" : ""}"
           role="button"
           tabindex="0"
           data-id="${c.id}"
           data-tipo="directo"
           aria-label="Conversación con ${c.nombre}, ${c.estado}${noLeidos > 0 ? `, ${noLeidos} mensajes sin leer` : ""}"
           aria-pressed="${esActivo}">
        <div class="chat-contacto__avatar-wrap">
          <div class="chat-contacto__avatar">${c.avatar}</div>
          <span class="chat-contacto__online chat-contacto__online--${colorEstado}"
                aria-hidden="true"></span>
        </div>
        <div class="chat-contacto__info">
          <div class="chat-contacto__nombre">${c.nombre}</div>
          <div class="chat-contacto__preview">
            ${ultimo ? `${ultimo.propio ? "Tú: " : ""}${ultimo.texto.substring(0, 35)}${ultimo.texto.length > 35 ? "..." : ""}` : c.rol}
          </div>
        </div>
        <div class="chat-contacto__meta">
          ${ultimo ? `<span class="chat-contacto__hora">${ultimo.hora}</span>` : ""}
          ${noLeidos > 0 ? `<span class="chat-contacto__badge${c.id === "c4" ? " chat-contacto__badge--danger" : ""}" aria-label="${noLeidos} mensajes sin leer">${noLeidos}</span>` : ""}
        </div>
      </div>
    `;
  }).join("");

  // Eventos de clic en contactos
  lista.querySelectorAll(".chat-contacto").forEach(el => {
    el.addEventListener("click",   () => abrirConversacion(el.dataset.id, "directo"));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") abrirConversacion(el.dataset.id, "directo");
    });
  });
}


/* ================================================
   6. RENDERIZAR LISTA DE GRUPOS
================================================ */
function renderizarListaGrupos(filtro = "") {
  const lista = document.getElementById("lista-grupos");
  if (!lista) return;

  const gruposFiltrados = chatGrupos.filter(g =>
    g.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  lista.innerHTML = gruposFiltrados.map(g => {
    const mensajes = historialMensajes[g.id] || [];
    const ultimo   = mensajes[mensajes.length - 1];
    const esActivo = ChatState.contactoActivo?.id === g.id;

    return `
      <div class="chat-contacto ${esActivo ? "chat-contacto--activo" : ""}"
           role="button"
           tabindex="0"
           data-id="${g.id}"
           data-tipo="grupo"
           aria-label="Grupo ${g.nombre}, ${g.miembros} miembros"
           aria-pressed="${esActivo}">
        <div class="chat-contacto__avatar-wrap">
          <div class="chat-contacto__avatar">${g.avatar}</div>
          <span class="chat-contacto__online chat-contacto__online--verde" aria-hidden="true"></span>
        </div>
        <div class="chat-contacto__info">
          <div class="chat-contacto__nombre">${g.nombre}</div>
          <div class="chat-contacto__preview">
            ${ultimo ? `${ultimo.propio ? "Tú: " : `${ultimo.autor}: `}${ultimo.texto.substring(0, 30)}...` : `${g.miembros} miembros · ${g.descripcion}`}
          </div>
        </div>
        <div class="chat-contacto__meta">
          ${ultimo ? `<span class="chat-contacto__hora">${ultimo.hora}</span>` : ""}
          <span class="chat-contacto__badge" style="background:var(--color-surface-2); color:var(--color-text-muted);">${g.miembros}</span>
        </div>
      </div>
    `;
  }).join("");

  lista.querySelectorAll(".chat-contacto").forEach(el => {
    el.addEventListener("click",   () => abrirConversacion(el.dataset.id, "grupo"));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") abrirConversacion(el.dataset.id, "grupo");
    });
  });
}


/* ================================================
   7. ABRIR CONVERSACIÓN
================================================ */
function abrirConversacion(id, tipo) {
  const contacto = tipo === "grupo"
    ? chatGrupos.find(g => g.id === id)
    : chatContactos.find(c => c.id === id);

  if (!contacto) return;

  ChatState.contactoActivo = { ...contacto, tipo };

  // Marcar mensajes como leídos
  if (ChatState.noLeidosPorContacto[id]) {
    ChatState.noLeidosPorContacto[id] = 0;
  }

  // Inicializar historial si no existe
  if (!historialMensajes[id]) {
    historialMensajes[id] = [];
  }

  // Actualizar UI del header
  const elAvatar = document.getElementById("chat-avatar");
  const elNombre = document.getElementById("chat-nombre");
  const elEstado = document.getElementById("chat-estado");

  if (elAvatar) elAvatar.textContent = contacto.avatar;
  if (elNombre) elNombre.textContent = contacto.nombre;
  if (elEstado) {
    const estadoTextos = {
      online:  "🟢 En línea",
      ocupado: "🟡 Ocupado",
      ausente: "🟡 Ausente",
      offline: "⚫ Desconectado",
    };
    elEstado.textContent = tipo === "grupo"
      ? `👥 ${contacto.miembros} miembros · ${contacto.descripcion || ""}`
      : estadoTextos[contacto.estado] || "⚫ Desconectado";
  }

  // Mostrar ventana de chat
  const vacio  = document.getElementById("chat-vacio");
  const activo = document.getElementById("chat-activo");
  if (vacio)  { vacio.hidden = true;  vacio.style.display  = "none";  }
  if (activo) { activo.hidden = false; activo.style.display = "flex"; }

  // Renderizar mensajes
  renderizarMensajes(id);

  // Refrescar listas
  renderizarListaContactos(document.getElementById("chat-search")?.value || "");
  renderizarListaGrupos(document.getElementById("chat-search")?.value    || "");

  // Enfocar input
  setTimeout(() => document.getElementById("chat-input")?.focus(), 100);
}


/* ================================================
   8. RENDERIZAR MENSAJES
================================================ */
function renderizarMensajes(id) {
  const contenedor = document.getElementById("chat-mensajes");
  if (!contenedor) return;

  const mensajes = historialMensajes[id] || [];

  if (mensajes.length === 0) {
    contenedor.innerHTML = `
      <div class="mensaje-sistema">
        No hay mensajes aún. ¡Inicia la conversación!
      </div>
    `;
    return;
  }

  let html = `<div class="mensaje-fecha"><span>Hoy</span></div>`;

  mensajes.forEach(m => {
    html += `
      <div class="mensaje mensaje--${m.propio ? "propio" : "ajeno"}"
           role="article"
           aria-label="${m.propio ? "Tú" : m.autor}: ${m.texto}, ${m.hora}">
        ${!m.propio ? `<div class="mensaje__autor">${m.autor}</div>` : ""}
        <div class="mensaje__burbuja">${m.texto}</div>
        <div class="mensaje__meta">
          <span class="mensaje__hora">${m.hora}</span>
          ${m.propio ? `<span class="mensaje__estado ${m.leido ? "mensaje__estado--leido" : ""}" aria-label="${m.leido ? "Leído" : "Enviado"}">${m.leido ? "✓✓" : "✓"}</span>` : ""}
        </div>
      </div>
    `;
  });

  contenedor.innerHTML = html;

  // Scroll al último mensaje
  contenedor.scrollTop = contenedor.scrollHeight;
}


/* ================================================
   9. ENVIAR MENSAJE
================================================ */
function enviarMensaje() {
  const input = document.getElementById("chat-input");
  const texto = input?.value.trim();

  if (!texto || !ChatState.contactoActivo) return;

  const ahora = new Date();
  const hora  = ahora.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" });
  const id    = ChatState.contactoActivo.id;

  // Crear mensaje
  const nuevoMensaje = {
    id:     `msg-${Date.now()}`,
    autor:  "Tú",
    avatar: "👮",
    texto,
    hora,
    propio: true,
    leido:  false,
  };

  // Agregar al historial
  if (!historialMensajes[id]) historialMensajes[id] = [];
  historialMensajes[id].push(nuevoMensaje);

  // Limpiar input
  input.value = "";
  actualizarContadorCaracteres(0);

  // Renderizar mensajes
  renderizarMensajes(id);

  // Actualizar lista de contactos
  renderizarListaContactos(document.getElementById("chat-search")?.value || "");
  renderizarListaGrupos(document.getElementById("chat-search")?.value    || "");

  // Simular respuesta después de un delay
  simularRespuesta(id);

  // Anunciar para accesibilidad
  if (typeof anunciar === "function") {
    anunciar(`Mensaje enviado a ${ChatState.contactoActivo.nombre}`);
  }
}


/* ================================================
   10. SIMULAR RESPUESTA AUTOMÁTICA
================================================ */
const respuestasAutomaticas = {
  "c1": ["Recibido. Continuad con la misión.", "Entendido. Mantengan el área asegurada.", "Confirmado. Buen trabajo al equipo.", "Procedan según protocolo."],
  "c2": ["Gracias, lo reviso ahora.", "Perfecto, eso me ayuda mucho.", "Entendido. Te aviso si necesito algo más.", "Roger, procediendo con la investigación."],
  "c3": ["Ok, recibido.", "Confirmado. Caso en seguimiento.", "Bien, lo verifico.", "Entendido detective."],
  "c4": ["Necesito refuerzos ahora mismo 🚨", "Situación bajo control ✅", "En camino 🚔", "Recibiendo instrucciones."],
  "c5": ["👍 Entendido.", "Confirmado, en ruta.", "Sin novedades por aquí.", "Patrulla activa."],
  "c6": ["...", "Recibido.", "Ok."],
  "c7": ["Analizando los datos...", "Sistema actualizado.", "Procesando información.", "Reporte listo en 5 minutos."],
  "c8": ["...", "Recibido.", "En descanso."],
  "g1": ["Unidad lista. 🚔", "Confirmado.", "En posición.", "Roger que."],
  "g2": ["🚨 Todas las unidades en alerta máxima.", "Confirmado. Refuerzos en camino.", "Mantengan comunicación constante.", "Situación siendo monitoreada."],
  "g3": ["Investigación en curso.", "Procesando evidencias.", "Detective en campo.", "Caso bajo seguimiento."],
  "g4": ["Analizando datos...", "Informe en preparación.", "Inteligencia activa."],
  "g5": ["Turno en curso. Sin novedades.", "Patrullaje nocturno activo.", "Zona asegurada.", "🌙 Todo tranquilo."],
};

function simularRespuesta(id) {
  const contacto = ChatState.contactoActivo;
  if (!contacto || contacto.estado === "offline") return;

  // Mostrar indicador de escritura
  mostrarIndicadorEscritura();

  const delay = 1500 + Math.random() * 2000;

  setTimeout(() => {
    // Ocultar indicador
    ocultarIndicadorEscritura();

    const respuestas = respuestasAutomaticas[id] || ["Recibido.", "Ok.", "Entendido."];
    const texto      = respuestas[Math.floor(Math.random() * respuestas.length)];
    const ahora      = new Date();
    const hora       = ahora.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" });

    const respuesta = {
      id:     `msg-${Date.now()}`,
      autor:  contacto.nombre,
      avatar: contacto.avatar,
      texto,
      hora,
      propio: false,
      leido:  false,
    };

    historialMensajes[id].push(respuesta);

    // Solo renderizar si la conversación sigue activa
    if (ChatState.contactoActivo?.id === id) {
      renderizarMensajes(id);
    }

    // Notificar si hay nueva alerta
    if (texto.includes("🚨") && typeof mostrarToast === "function") {
      mostrarToast(`${contacto.nombre}: ${texto}`, "danger");
    }

  }, delay);
}

function mostrarIndicadorEscritura() {
  const contenedor = document.getElementById("chat-mensajes");
  if (!contenedor) return;

  const indicator = document.createElement("div");
  indicator.id        = "escribiendo-indicator";
  indicator.className = "mensaje-escribiendo";
  indicator.setAttribute("aria-label", "El otro usuario está escribiendo");
  indicator.innerHTML = `
    <span style="font-size:0.72rem; color:var(--color-text-muted);">escribiendo</span>
    <div class="escribiendo-puntos" aria-hidden="true">
      <span class="escribiendo-punto"></span>
      <span class="escribiendo-punto"></span>
      <span class="escribiendo-punto"></span>
    </div>
  `;

  contenedor.appendChild(indicator);
  contenedor.scrollTop = contenedor.scrollHeight;
}

function ocultarIndicadorEscritura() {
  document.getElementById("escribiendo-indicator")?.remove();
}


/* ================================================
   11. EVENTOS DEL CHAT
================================================ */
function iniciarEventosChat() {

  // Búsqueda
  document.getElementById("chat-search")?.addEventListener("input", (e) => {
    const filtro = e.target.value;
    if (ChatState.tabActiva === "directos") {
      renderizarListaContactos(filtro);
    } else {
      renderizarListaGrupos(filtro);
    }
  });

  // Tabs
  document.querySelectorAll(".chat-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chat-tab").forEach(b => {
        b.classList.remove("chat-tab--activo");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("chat-tab--activo");
      btn.setAttribute("aria-selected", "true");

      ChatState.tabActiva = btn.dataset.tab;

      const listaDirectos = document.getElementById("lista-directos");
      const listaGrupos   = document.getElementById("lista-grupos");

      if (ChatState.tabActiva === "directos") {
        if (listaDirectos) { listaDirectos.hidden = false; listaDirectos.style.display = "block"; }
        if (listaGrupos)   { listaGrupos.hidden   = true;  listaGrupos.style.display   = "none";  }
      } else {
        if (listaDirectos) { listaDirectos.hidden = true;  listaDirectos.style.display = "none";  }
        if (listaGrupos)   { listaGrupos.hidden   = false; listaGrupos.style.display   = "block"; }
      }
    });
  });

  // Botón enviar
  document.getElementById("btn-enviar-chat")?.addEventListener("click", enviarMensaje);

  // Enter para enviar, Shift+Enter para nueva línea
  document.getElementById("chat-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  });

  // Contador de caracteres
  document.getElementById("chat-input")?.addEventListener("input", (e) => {
    actualizarContadorCaracteres(e.target.value.length);
    // Ajustar altura del textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  });

  // Mensajes rápidos
  document.querySelectorAll(".chat-rapido-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById("chat-input");
      if (input) {
        input.value = btn.dataset.msg;
        actualizarContadorCaracteres(btn.dataset.msg.length);
        input.focus();
      }
    });
  });

  // Limpiar historial
  document.getElementById("btn-chat-limpiar")?.addEventListener("click", () => {
    if (!ChatState.contactoActivo) return;
    const id = ChatState.contactoActivo.id;
    historialMensajes[id] = [];
    renderizarMensajes(id);
    if (typeof mostrarToast === "function") {
      mostrarToast("Historial limpiado", "info");
    }
  });
}

function actualizarContadorCaracteres(length) {
  const el = document.getElementById("chat-char-count");
  if (!el) return;
  el.textContent = `${length}/500`;
  el.className = "chat-char-count";
  if (length > 450) el.classList.add("cerca-limite");
  if (length >= 500) el.classList.add("limite-alcanzado");
}


/* ================================================
   12. ESTADÍSTICAS DEL CHAT
================================================ */
function actualizarEstadisticasChat() {
  const online   = chatContactos.filter(c => c.estado === "online").length;
  const mensajes = Object.values(historialMensajes).flat().length;
  const grupos   = chatGrupos.length;

  const elOnline   = document.getElementById("chat-stat-online");
  const elMensajes = document.getElementById("chat-stat-mensajes");
  const elGrupos   = document.getElementById("chat-stat-grupos");

  if (elOnline)   elOnline.textContent   = online;
  if (elMensajes) elMensajes.textContent = mensajes;
  if (elGrupos)   elGrupos.textContent   = grupos;
}


/* ================================================
   13. SIMULACIÓN DE MENSAJES ENTRANTES
================================================ */
function iniciarSimulacionMensajes() {
  // Simular mensaje entrante cada 40-70 segundos
  function programarSiguiente() {
    const delay = 40000 + Math.random() * 30000;
    setTimeout(() => {
      recibirMensajeAleatorio();
      programarSiguiente();
    }, delay);
  }
  programarSiguiente();
}

function recibirMensajeAleatorio() {
  // No interrumpir si el usuario está en la conversación activa
  const contactosDisponibles = chatContactos.filter(c =>
    c.estado !== "offline" && ChatState.contactoActivo?.id !== c.id
  );

  if (contactosDisponibles.length === 0) return;

  const contacto = contactosDisponibles[Math.floor(Math.random() * contactosDisponibles.length)];
  const mensajes = respuestasAutomaticas[contacto.id] || ["Mensaje entrante."];
  const texto    = mensajes[Math.floor(Math.random() * mensajes.length)];
  const ahora    = new Date();
  const hora     = ahora.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" });

  const mensaje = {
    id:     `msg-${Date.now()}`,
    autor:  contacto.nombre,
    avatar: contacto.avatar,
    texto,
    hora,
    propio: false,
    leido:  false,
  };

  if (!historialMensajes[contacto.id]) historialMensajes[contacto.id] = [];
  historialMensajes[contacto.id].push(mensaje);

  // Incrementar no leídos
  ChatState.noLeidosPorContacto[contacto.id] =
    (ChatState.noLeidosPorContacto[contacto.id] || 0) + 1;

  // Refrescar lista
  renderizarListaContactos(document.getElementById("chat-search")?.value || "");

  // Toast de notificación
  if (typeof mostrarToast === "function") {
    mostrarToast(`💬 ${contacto.nombre}: ${texto.substring(0, 40)}...`, "info", 4000);
  }

  // Anunciar para accesibilidad
  if (typeof anunciar === "function") {
    anunciar(`Nuevo mensaje de ${contacto.nombre}`);
  }
}