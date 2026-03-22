/* ================================================
   SISTEMA POLICIAL RD — i18n.js
   Sistema de internacionalización (ES / EN)
   Maneja todos los textos de la aplicación
================================================ */

const translations = {

  /* ============================================
     ESPAÑOL
  ============================================ */
  es: {
    // Login
    "login.title":       "Policía Nacional",
    "login.subtitle":    "República Dominicana",
    "login.system":      "Sistema de Gestión Policial",
    "login.badge":       "Número de Placa",
    "login.badge_hint":  "Formato: PN-XXXXX",
    "login.password":    "Contraseña",
    "login.role":        "Rol / Unidad",
    "login.role_admin":  "Administrador General",
    "login.role_detective": "Detective / Investigador",
    "login.role_oficial":   "Oficial de Patrulla",
    "login.role_analista":  "Analista de Datos",
    "login.btn":         "Acceder al Sistema",
    "login.error":       "Credenciales incorrectas. Intenta de nuevo.",
    "login.demo_hint":   "Demo: cualquier placa + contraseña de 4+ caracteres",
    "login.version":     "v1.0.0 — Uso Oficial",

    // App general
    "app.name":          "Policía Nacional",
    "app.country":       "República Dominicana",

    // Navegación
    "nav.dashboard":     "Dashboard",
    "nav.casos":         "Gestión de Casos",
    "nav.detenidos":     "Detenidos & Ficheros",
    "nav.patrullas":     "Patrullas & Personal",
    "nav.mapa":          "Mapa de Riesgo",
    "nav.incidentes":    "Incidentes",
    "nav.reportes":      "Reportes Oficiales",
    "nav.logout":        "Cerrar Sesión",

    // Modal
    "modal.cancel":      "Cancelar",
    "modal.confirm":     "Confirmar",

    // Dashboard
    "dash.title":        "Dashboard General",
    "dash.casos_activos":    "Casos Activos",
    "dash.detenidos_hoy":    "Detenidos Hoy",
    "dash.patrullas_activas":"Patrullas Activas",
    "dash.incidentes_hoy":   "Incidentes Hoy",
    "dash.casos_mes":        "Casos por Mes",
    "dash.tipos_delitos":    "Tipos de Delitos",
    "dash.actividad_reciente":"Actividad Reciente",
    "dash.alertas":          "Alertas Activas",

    // Casos
    "casos.title":       "Gestión de Casos",
    "casos.nuevo":       "Nuevo Caso",
    "casos.buscar":      "Buscar caso...",
    "casos.id":          "ID Caso",
    "casos.tipo":        "Tipo",
    "casos.descripcion": "Descripción",
    "casos.estado":      "Estado",
    "casos.fecha":       "Fecha",
    "casos.investigador":"Investigador",
    "casos.acciones":    "Acciones",
    "casos.abierto":     "Abierto",
    "casos.cerrado":     "Cerrado",
    "casos.pendiente":   "Pendiente",
    "casos.en_proceso":  "En Proceso",

    // Detenidos
    "detenidos.title":   "Detenidos & Ficheros",
    "detenidos.nuevo":   "Nuevo Detenido",
    "detenidos.buscar":  "Buscar detenido...",
    "detenidos.nombre":  "Nombre Completo",
    "detenidos.cedula":  "Cédula",
    "detenidos.cargo":   "Cargo",
    "detenidos.fecha_detencion": "Fecha Detención",
    "detenidos.oficial": "Oficial a Cargo",
    "detenidos.estado":  "Estado",
    "detenidos.detenido":"Detenido",
    "detenidos.liberado":"Liberado",
    "detenidos.procesado":"Procesado",

    // Patrullas
    "patrullas.title":   "Patrullas & Personal",
    "patrullas.nueva":   "Nueva Patrulla",
    "patrullas.buscar":  "Buscar patrulla...",
    "patrullas.id":      "ID Patrulla",
    "patrullas.unidad":  "Unidad",
    "patrullas.zona":    "Zona Asignada",
    "patrullas.personal":"Personal",
    "patrullas.vehiculo":"Vehículo",
    "patrullas.estado":  "Estado",
    "patrullas.activa":  "Activa",
    "patrullas.inactiva":"Inactiva",
    "patrullas.en_servicio":"En Servicio",

    // Mapa
    "mapa.title":        "Mapa de Riesgo",
    "mapa.zona_critica": "Zona Crítica",
    "mapa.zona_alta":    "Zona Alto Riesgo",
    "mapa.zona_media":   "Zona Riesgo Medio",
    "mapa.zona_baja":    "Zona Bajo Riesgo",
    "mapa.incidentes":   "Incidentes registrados",
    "mapa.actualizado":  "Última actualización",

    // Incidentes
    "incidentes.title":  "Gestión de Incidentes",
    "incidentes.nuevo":  "Nuevo Incidente",
    "incidentes.buscar": "Buscar incidente...",
    "incidentes.tipo":   "Tipo",
    "incidentes.ubicacion":"Ubicación",
    "incidentes.gravedad":"Gravedad",
    "incidentes.fecha":  "Fecha/Hora",
    "incidentes.estado": "Estado",
    "incidentes.alta":   "Alta",
    "incidentes.media":  "Media",
    "incidentes.baja":   "Baja",
    "incidentes.resuelto":"Resuelto",
    "incidentes.activo": "Activo",

    // Reportes
    "reportes.title":    "Reportes Oficiales",
    "reportes.generar":  "Generar Reporte",
    "reportes.exportar": "Exportar",
    "reportes.tipo":     "Tipo de Reporte",
    "reportes.periodo":  "Período",
    "reportes.mensual":  "Reporte Mensual",
    "reportes.semanal":  "Reporte Semanal",
    "reportes.anual":    "Reporte Anual",
    "reportes.casos":    "Reporte de Casos",
    "reportes.detenidos":"Reporte de Detenidos",
    "reportes.generado": "Reporte generado exitosamente",

    // Accesibilidad
    "a11y.menu":         "Menú principal",
    "a11y.close":        "Cerrar",
    "a11y.search":       "Buscar",
    "a11y.loading":      "Cargando...",
    "a11y.online":       "En línea",
  },


  /* ============================================
     ENGLISH
  ============================================ */
  en: {
    // Login
    "login.title":       "National Police",
    "login.subtitle":    "Dominican Republic",
    "login.system":      "Police Management System",
    "login.badge":       "Badge Number",
    "login.badge_hint":  "Format: PN-XXXXX",
    "login.password":    "Password",
    "login.role":        "Role / Unit",
    "login.role_admin":  "General Administrator",
    "login.role_detective": "Detective / Investigator",
    "login.role_oficial":   "Patrol Officer",
    "login.role_analista":  "Data Analyst",
    "login.btn":         "Access System",
    "login.error":       "Incorrect credentials. Please try again.",
    "login.demo_hint":   "Demo: any badge + password of 4+ characters",
    "login.version":     "v1.0.0 — Official Use",

    // App general
    "app.name":          "National Police",
    "app.country":       "Dominican Republic",

    // Navigation
    "nav.dashboard":     "Dashboard",
    "nav.casos":         "Case Management",
    "nav.detenidos":     "Detainees & Files",
    "nav.patrullas":     "Patrols & Staff",
    "nav.mapa":          "Risk Map",
    "nav.incidentes":    "Incidents",
    "nav.reportes":      "Official Reports",
    "nav.logout":        "Log Out",

    // Modal
    "modal.cancel":      "Cancel",
    "modal.confirm":     "Confirm",

    // Dashboard
    "dash.title":        "General Dashboard",
    "dash.casos_activos":    "Active Cases",
    "dash.detenidos_hoy":    "Detained Today",
    "dash.patrullas_activas":"Active Patrols",
    "dash.incidentes_hoy":   "Incidents Today",
    "dash.casos_mes":        "Cases per Month",
    "dash.tipos_delitos":    "Crime Types",
    "dash.actividad_reciente":"Recent Activity",
    "dash.alertas":          "Active Alerts",

    // Cases
    "casos.title":       "Case Management",
    "casos.nuevo":       "New Case",
    "casos.buscar":      "Search case...",
    "casos.id":          "Case ID",
    "casos.tipo":        "Type",
    "casos.descripcion": "Description",
    "casos.estado":      "Status",
    "casos.fecha":       "Date",
    "casos.investigador":"Investigator",
    "casos.acciones":    "Actions",
    "casos.abierto":     "Open",
    "casos.cerrado":     "Closed",
    "casos.pendiente":   "Pending",
    "casos.en_proceso":  "In Progress",

    // Detainees
    "detenidos.title":   "Detainees & Files",
    "detenidos.nuevo":   "New Detainee",
    "detenidos.buscar":  "Search detainee...",
    "detenidos.nombre":  "Full Name",
    "detenidos.cedula":  "ID Number",
    "detenidos.cargo":   "Charge",
    "detenidos.fecha_detencion": "Arrest Date",
    "detenidos.oficial": "Officer in Charge",
    "detenidos.estado":  "Status",
    "detenidos.detenido":"Detained",
    "detenidos.liberado":"Released",
    "detenidos.procesado":"Processed",

    // Patrols
    "patrullas.title":   "Patrols & Staff",
    "patrullas.nueva":   "New Patrol",
    "patrullas.buscar":  "Search patrol...",
    "patrullas.id":      "Patrol ID",
    "patrullas.unidad":  "Unit",
    "patrullas.zona":    "Assigned Zone",
    "patrullas.personal":"Staff",
    "patrullas.vehiculo":"Vehicle",
    "patrullas.estado":  "Status",
    "patrullas.activa":  "Active",
    "patrullas.inactiva":"Inactive",
    "patrullas.en_servicio":"On Duty",

    // Map
    "mapa.title":        "Risk Map",
    "mapa.zona_critica": "Critical Zone",
    "mapa.zona_alta":    "High Risk Zone",
    "mapa.zona_media":   "Medium Risk Zone",
    "mapa.zona_baja":    "Low Risk Zone",
    "mapa.incidentes":   "Registered incidents",
    "mapa.actualizado":  "Last updated",

    // Incidents
    "incidentes.title":  "Incident Management",
    "incidentes.nuevo":  "New Incident",
    "incidentes.buscar": "Search incident...",
    "incidentes.tipo":   "Type",
    "incidentes.ubicacion":"Location",
    "incidentes.gravedad":"Severity",
    "incidentes.fecha":  "Date/Time",
    "incidentes.estado": "Status",
    "incidentes.alta":   "High",
    "incidentes.media":  "Medium",
    "incidentes.baja":   "Low",
    "incidentes.resuelto":"Resolved",
    "incidentes.activo": "Active",

    // Reports
    "reportes.title":    "Official Reports",
    "reportes.generar":  "Generate Report",
    "reportes.exportar": "Export",
    "reportes.tipo":     "Report Type",
    "reportes.periodo":  "Period",
    "reportes.mensual":  "Monthly Report",
    "reportes.semanal":  "Weekly Report",
    "reportes.anual":    "Annual Report",
    "reportes.casos":    "Cases Report",
    "reportes.detenidos":"Detainees Report",
    "reportes.generado": "Report generated successfully",

    // Accessibility
    "a11y.menu":         "Main menu",
    "a11y.close":        "Close",
    "a11y.search":       "Search",
    "a11y.loading":      "Loading...",
    "a11y.online":       "Online",
  }
};


/* ================================================
   CLASE PRINCIPAL DE INTERNACIONALIZACIÓN
================================================ */
class I18n {
  constructor() {
    // Idioma por defecto: español
    this.lang = localStorage.getItem("idioma-policial") || "es";
  }

  // Obtener traducción por clave
  t(key) {
    const texto = translations[this.lang]?.[key];
    if (!texto) {
      console.warn(`[i18n] Clave no encontrada: ${key}`);
      return key;
    }
    return texto;
  }

  // Cambiar idioma
  setLang(lang) {
    if (!translations[lang]) return;
    this.lang = lang;
    localStorage.setItem("idioma-policial", lang);
    this.aplicarTraduccion();
  }

  // Alternar entre ES y EN
  toggle() {
    const nuevoLang = this.lang === "es" ? "en" : "es";
    this.setLang(nuevoLang);
  }

  // Aplicar traducciones a todos los elementos con data-i18n
  aplicarTraduccion() {
    const elementos = document.querySelectorAll("[data-i18n]");
    elementos.forEach((el) => {
      const clave = el.getAttribute("data-i18n");
      const texto = this.t(clave);
      if (texto) el.textContent = texto;
    });

    // Actualizar indicador de idioma en la barra de título
    const indicator = document.getElementById("lang-indicator");
    if (indicator) {
      indicator.textContent = this.lang.toUpperCase();
    }

    // Actualizar atributo lang del HTML
    document.documentElement.setAttribute("lang", this.lang);

    // Disparar evento para que los módulos se actualicen
    window.dispatchEvent(new CustomEvent("langChanged", {
      detail: { lang: this.lang }
    }));
  }

  // Obtener idioma actual
  getLang() {
    return this.lang;
  }
}

// Instancia global
const i18n = new I18n();