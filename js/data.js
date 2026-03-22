/* ================================================
   SISTEMA POLICIAL RD — data.js
   Datos simulados realistas de la PNRD
   Incluye casos, detenidos, patrullas,
   incidentes y personal policial
================================================ */


/* ================================================
   1. DATOS DE USUARIOS / OFICIALES
================================================ */
const usuarios = [
  { placa: "PN-10023", nombre: "Carlos Martínez",    rol: "admin",     avatar: "👮", unidad: "Comando Central",        turno: "Mañana"  },
  { placa: "PN-20045", nombre: "María Rodríguez",    rol: "detective", avatar: "🕵️", unidad: "Investigaciones",         turno: "Tarde"   },
  { placa: "PN-30067", nombre: "José Fernández",     rol: "oficial",   avatar: "👮", unidad: "Patrulla Norte",          turno: "Noche"   },
  { placa: "PN-40089", nombre: "Ana Peña",            rol: "analista",  avatar: "💻", unidad: "Análisis e Inteligencia", turno: "Mañana"  },
];

const rolesTexto = {
  admin:     { es: "Administrador General",   en: "General Administrator"  },
  detective: { es: "Detective / Investigador", en: "Detective / Investigator" },
  oficial:   { es: "Oficial de Patrulla",      en: "Patrol Officer"          },
  analista:  { es: "Analista de Datos",        en: "Data Analyst"            },
};


/* ================================================
   2. DATOS DE CASOS
================================================ */
const casos = [
  { id: "CASO-2025-001", tipo: "Robo",          descripcion: "Robo a mano armada en Tienda La Fe, Av. Duarte",          estado: "abierto",    fecha: "2025-01-15", investigador: "Det. Rodríguez",  prioridad: "alta"   },
  { id: "CASO-2025-002", tipo: "Homicidio",      descripcion: "Homicidio en sector Los Guandules, SDO",                 estado: "en_proceso", fecha: "2025-01-14", investigador: "Det. Fernández",  prioridad: "alta"   },
  { id: "CASO-2025-003", tipo: "Narcotráfico",   descripcion: "Decomiso de 120kg de cocaína en Puerto de Haina",        estado: "cerrado",    fecha: "2025-01-13", investigador: "Det. Martínez",   prioridad: "alta"   },
  { id: "CASO-2025-004", tipo: "Fraude",         descripcion: "Fraude bancario por RD$2.5M en Banco Nacional",          estado: "pendiente",  fecha: "2025-01-12", investigador: "Anal. Peña",       prioridad: "media"  },
  { id: "CASO-2025-005", tipo: "Violencia DOM",  descripcion: "Violencia doméstica reincidente en La Romana",           estado: "abierto",    fecha: "2025-01-11", investigador: "Of. Santos",       prioridad: "media"  },
  { id: "CASO-2025-006", tipo: "Secuestro",      descripcion: "Secuestro express en carretera Duarte km 14",            estado: "en_proceso", fecha: "2025-01-10", investigador: "Det. Rodríguez",  prioridad: "alta"   },
  { id: "CASO-2025-007", tipo: "Robo",          descripcion: "Robo de vehículo en estacionamiento Plaza Central",       estado: "cerrado",    fecha: "2025-01-09", investigador: "Of. Jiménez",      prioridad: "baja"   },
  { id: "CASO-2025-008", tipo: "Estafa",         descripcion: "Estafa telefónica masiva afectando 45 víctimas",         estado: "pendiente",  fecha: "2025-01-08", investigador: "Anal. Peña",       prioridad: "media"  },
  { id: "CASO-2025-009", tipo: "Narcotráfico",   descripcion: "Red de microtráfico desmantelada en Villa Juana",        estado: "cerrado",    fecha: "2025-01-07", investigador: "Det. Martínez",   prioridad: "alta"   },
  { id: "CASO-2025-010", tipo: "Homicidio",      descripcion: "Cuerpo hallado en río Isabela, sector Km 12",           estado: "abierto",    fecha: "2025-01-06", investigador: "Det. Fernández",  prioridad: "alta"   },
  { id: "CASO-2025-011", tipo: "Robo",          descripcion: "Asalto a farmacia en av. 27 de Febrero",                 estado: "en_proceso", fecha: "2025-01-05", investigador: "Of. Santos",       prioridad: "media"  },
  { id: "CASO-2025-012", tipo: "Fraude",         descripcion: "Documentos falsificados en consulado sector Norte",      estado: "pendiente",  fecha: "2025-01-04", investigador: "Det. Rodríguez",  prioridad: "baja"   },
];


/* ================================================
   3. DATOS DE DETENIDOS
================================================ */
const detenidos = [
  { id: "DET-001", nombre: "Pedro Antonio Gómez",    cedula: "001-1234567-8", cargo: "Robo a mano armada",     fecha: "2025-01-15", oficial: "Of. Martínez",   estado: "detenido",  genero: "M", edad: 28, nacionalidad: "Dominicana" },
  { id: "DET-002", nombre: "Luis Miguel Sánchez",     cedula: "002-9876543-1", cargo: "Narcotráfico",           fecha: "2025-01-14", oficial: "Of. Fernández",  estado: "procesado", genero: "M", edad: 35, nacionalidad: "Dominicana" },
  { id: "DET-003", nombre: "Carmen Rosa Herrera",     cedula: "003-4567891-2", cargo: "Fraude bancario",         fecha: "2025-01-13", oficial: "Of. Peña",       estado: "liberado",  genero: "F", edad: 42, nacionalidad: "Dominicana" },
  { id: "DET-004", nombre: "Rafael Antonio Díaz",     cedula: "004-3214569-0", cargo: "Homicidio",              fecha: "2025-01-12", oficial: "Det. Rodríguez", estado: "procesado", genero: "M", edad: 31, nacionalidad: "Dominicana" },
  { id: "DET-005", nombre: "Ana María Castillo",      cedula: "005-7894561-3", cargo: "Violencia doméstica",    fecha: "2025-01-11", oficial: "Of. Santos",     estado: "detenido",  genero: "F", edad: 26, nacionalidad: "Dominicana" },
  { id: "DET-006", nombre: "Miguel Ángel Torres",     cedula: "006-1597534-7", cargo: "Secuestro",              fecha: "2025-01-10", oficial: "Det. Martínez",  estado: "procesado", genero: "M", edad: 39, nacionalidad: "Dominicana" },
  { id: "DET-007", nombre: "José Luis Ramírez",       cedula: "007-8521479-6", cargo: "Robo de vehículo",       fecha: "2025-01-09", oficial: "Of. Jiménez",    estado: "liberado",  genero: "M", edad: 22, nacionalidad: "Dominicana" },
  { id: "DET-008", nombre: "María Elena Vargas",      cedula: "008-9635274-5", cargo: "Estafa",                 fecha: "2025-01-08", oficial: "Anal. Peña",     estado: "detenido",  genero: "F", edad: 45, nacionalidad: "Dominicana" },
];


/* ================================================
   4. DATOS DE PATRULLAS
================================================ */
const patrullas = [
  { id: "PAT-001", unidad: "Patrulla Alpha",   zona: "Distrito Nacional Norte", personal: ["Of. Martínez", "Of. Jiménez"],        vehiculo: "Toyota Hilux RD-0012",  estado: "activa",       turno: "Mañana" },
  { id: "PAT-002", unidad: "Patrulla Bravo",   zona: "Distrito Nacional Sur",   personal: ["Of. Fernández", "Of. Castro"],        vehiculo: "Mitsubishi L200 RD-0034", estado: "en_servicio",  turno: "Tarde"  },
  { id: "PAT-003", unidad: "Patrulla Charlie",  zona: "Los Alcarrizos",          personal: ["Of. Santos", "Of. Reyes"],            vehiculo: "Toyota Fortuner RD-0056", estado: "activa",       turno: "Noche"  },
  { id: "PAT-004", unidad: "Patrulla Delta",   zona: "Santo Domingo Este",      personal: ["Of. Peña", "Of. Núñez", "Of. Cruz"],  vehiculo: "Ford Ranger RD-0078",     estado: "inactiva",     turno: "Mañana" },
  { id: "PAT-005", unidad: "Patrulla Echo",    zona: "Boca Chica",              personal: ["Of. Rosario", "Of. Vargas"],          vehiculo: "Nissan Frontier RD-0090", estado: "en_servicio",  turno: "Tarde"  },
  { id: "PAT-006", unidad: "Patrulla Foxtrot", zona: "San Cristóbal",           personal: ["Of. Luna", "Of. Marte"],              vehiculo: "Toyota Hilux RD-0102",    estado: "activa",       turno: "Noche"  },
  { id: "PAT-007", unidad: "Unidad Motorizada","zona": "Zona Colonial",         personal: ["Of. Tejeda"],                         vehiculo: "Honda CB500 RD-M001",     estado: "activa",       turno: "Mañana" },
  { id: "PAT-008", unidad: "Patrulla Golf",    zona: "Santiago de los Cab.",    personal: ["Of. Almonte", "Of. Brito"],           vehiculo: "Mitsubishi L200 RD-0124", estado: "en_servicio",  turno: "Tarde"  },
];


/* ================================================
   5. DATOS DE INCIDENTES
================================================ */
const incidentes = [
  { id: "INC-001", tipo: "Tiroteo",          ubicacion: "Av. Duarte #145, SDN",          gravedad: "alta",  fecha: "2025-01-15 14:32", estado: "activo",   patrulla: "PAT-001", heridos: 2 },
  { id: "INC-002", tipo: "Accidente Tránsito","ubicacion": "Autopista Duarte Km 8",      gravedad: "media", fecha: "2025-01-15 13:15", estado: "resuelto", patrulla: "PAT-002", heridos: 1 },
  { id: "INC-003", tipo: "Robo en Progreso",  ubicacion: "Calle El Conde, Z. Colonial",  gravedad: "alta",  fecha: "2025-01-15 12:00", estado: "activo",   patrulla: "PAT-007", heridos: 0 },
  { id: "INC-004", tipo: "Disturbio Público", ubicacion: "Parque Independencia, SDN",    gravedad: "media", fecha: "2025-01-15 10:45", estado: "resuelto", patrulla: "PAT-003", heridos: 0 },
  { id: "INC-005", tipo: "Incendio",          ubicacion: "Mercado Nuevo, Los Guandules",  gravedad: "alta",  fecha: "2025-01-15 09:30", estado: "resuelto", patrulla: "PAT-004", heridos: 3 },
  { id: "INC-006", tipo: "Violencia DOM",     ubicacion: "Calle Las Mercedes #78",       gravedad: "media", fecha: "2025-01-15 08:20", estado: "activo",   patrulla: "PAT-002", heridos: 1 },
  { id: "INC-007", tipo: "Persecución",       ubicacion: "Av. 27 de Febrero, SDE",       gravedad: "alta",  fecha: "2025-01-14 22:10", estado: "resuelto", patrulla: "PAT-005", heridos: 0 },
  { id: "INC-008", tipo: "Accidente Tránsito","ubicacion": "Carretera Sánchez Km 4",     gravedad: "baja",  fecha: "2025-01-14 19:05", estado: "resuelto", patrulla: "PAT-006", heridos: 0 },
  { id: "INC-009", tipo: "Robo en Progreso",  ubicacion: "Centro Comercial Sambil",      gravedad: "media", fecha: "2025-01-14 17:40", estado: "activo",   patrulla: "PAT-001", heridos: 0 },
  { id: "INC-010", tipo: "Tiroteo",          ubicacion: "Barrio Villa Consuelo",         gravedad: "alta",  fecha: "2025-01-14 16:25", estado: "resuelto", patrulla: "PAT-003", heridos: 1 },
];


/* ================================================
   6. DATOS DEL MAPA DE RIESGO (Zonas de RD)
================================================ */
const zonasRiesgo = [
  { id: "z01", nombre: "Distrito Nacional Norte",  nivel: "alto",    incidentes: 28, lat: 18.50, lng: -69.98 },
  { id: "z02", nombre: "Distrito Nacional Sur",    nivel: "medio",   incidentes: 15, lat: 18.47, lng: -69.95 },
  { id: "z03", nombre: "Zona Colonial",            nivel: "medio",   incidentes: 12, lat: 18.47, lng: -69.88 },
  { id: "z04", nombre: "Los Alcarrizos",           nivel: "alto",    incidentes: 31, lat: 18.52, lng: -70.05 },
  { id: "z05", nombre: "Santo Domingo Este",       nivel: "medio",   incidentes: 18, lat: 18.49, lng: -69.85 },
  { id: "z06", nombre: "Los Guandules",            nivel: "critico", incidentes: 45, lat: 18.51, lng: -69.99 },
  { id: "z07", nombre: "Villa Consuelo",           nivel: "alto",    incidentes: 22, lat: 18.48, lng: -69.94 },
  { id: "z08", nombre: "Boca Chica",               nivel: "bajo",    incidentes: 5,  lat: 18.45, lng: -69.60 },
  { id: "z09", nombre: "San Cristóbal",            nivel: "medio",   incidentes: 14, lat: 18.41, lng: -70.10 },
  { id: "z10", nombre: "Santiago de los Cab.",     nivel: "medio",   incidentes: 19, lat: 19.45, lng: -70.69 },
  { id: "z11", nombre: "La Romana",                nivel: "bajo",    incidentes: 7,  lat: 18.43, lng: -68.97 },
  { id: "z12", nombre: "Puerto Plata",             nivel: "bajo",    incidentes: 6,  lat: 19.79, lng: -70.69 },
];


/* ================================================
   7. ESTADÍSTICAS PARA EL DASHBOARD
================================================ */
const estadisticas = {
  resumen: {
    casos_activos:     12,
    detenidos_hoy:      5,
    patrullas_activas:  6,
    incidentes_hoy:     7,
    casos_resueltos:   87,
    tasa_resolucion:   72,
  },

  // Casos por mes (últimos 6 meses)
  casosPorMes: {
    labels: ["Ago", "Sep", "Oct", "Nov", "Dic", "Ene"],
    data:   [45,    52,    38,    61,    48,    55   ],
  },

  // Tipos de delitos
  tiposDelitos: {
    labels: ["Robo", "Homicidio", "Narcotráfico", "Fraude", "Violencia DOM", "Otros"],
    data:   [35,     18,          22,              12,       8,               5      ],
    colores: ["#ef4444", "#f59e0b", "#8b5cf6", "#3b82f6", "#ec4899", "#6b7280"],
  },

  // Actividad reciente
  actividadReciente: [
    { tipo: "caso",      texto: "Nuevo caso registrado: Robo en Av. Duarte",        tiempo: "Hace 5 min",  icono: "📁" },
    { tipo: "detenido",  texto: "Detenido procesado: Pedro Antonio Gómez",          tiempo: "Hace 12 min", icono: "👤" },
    { tipo: "incidente", texto: "Incidente resuelto: Accidente Autopista Duarte",   tiempo: "Hace 18 min", icono: "⚠️" },
    { tipo: "patrulla",  texto: "Patrulla Alpha despachada a Zona Norte",            tiempo: "Hace 25 min", icono: "🚔" },
    { tipo: "caso",      texto: "Caso cerrado: Narcotráfico Puerto de Haina",       tiempo: "Hace 40 min", icono: "📁" },
    { tipo: "alerta",    texto: "Alerta: Zona Los Guandules nivel CRÍTICO",         tiempo: "Hace 55 min", icono: "🚨" },
  ],

  // Alertas activas
  alertas: [
    { nivel: "critico", texto: "Zona Los Guandules — 45 incidentes registrados",    zona: "z06" },
    { nivel: "alto",    texto: "Los Alcarrizos — Alta actividad delictiva",          zona: "z04" },
    { nivel: "alto",    texto: "Distrito Nacional Norte — Patrulla requerida",      zona: "z01" },
    { nivel: "medio",   texto: "Santo Domingo Este — Seguimiento activo caso #002", zona: "z05" },
  ],
};


/* ================================================
   8. FUNCIONES DE ACCESO A DATOS
================================================ */

// Autenticar usuario
function autenticarUsuario(placa, password, rol) {
  if (placa.trim().length < 3 || password.trim().length < 4) return null;
  // En demo, aceptamos cualquier placa válida
  const usuario = usuarios.find(u => u.rol === rol) || usuarios[0];
  return { ...usuario, placa, rol };
}

// Obtener casos filtrados
function getCasos(filtro = "", estado = "") {
  return casos.filter(c => {
    const matchFiltro = filtro === "" ||
      c.id.toLowerCase().includes(filtro.toLowerCase()) ||
      c.tipo.toLowerCase().includes(filtro.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
      c.investigador.toLowerCase().includes(filtro.toLowerCase());
    const matchEstado = estado === "" || c.estado === estado;
    return matchFiltro && matchEstado;
  });
}

// Obtener detenidos filtrados
function getDetenidos(filtro = "", estado = "") {
  return detenidos.filter(d => {
    const matchFiltro = filtro === "" ||
      d.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      d.cedula.includes(filtro) ||
      d.cargo.toLowerCase().includes(filtro.toLowerCase());
    const matchEstado = estado === "" || d.estado === estado;
    return matchFiltro && matchEstado;
  });
}

// Obtener patrullas filtradas
function getPatrullas(filtro = "", estado = "") {
  return patrullas.filter(p => {
    const matchFiltro = filtro === "" ||
      p.unidad.toLowerCase().includes(filtro.toLowerCase()) ||
      p.zona.toLowerCase().includes(filtro.toLowerCase());
    const matchEstado = estado === "" || p.estado === estado;
    return matchFiltro && matchEstado;
  });
}

// Obtener incidentes filtrados
function getIncidentes(filtro = "", gravedad = "") {
  return incidentes.filter(i => {
    const matchFiltro = filtro === "" ||
      i.tipo.toLowerCase().includes(filtro.toLowerCase()) ||
      i.ubicacion.toLowerCase().includes(filtro.toLowerCase());
    const matchGravedad = gravedad === "" || i.gravedad === gravedad;
    return matchFiltro && matchGravedad;
  });
}

// Obtener estadísticas del dashboard
function getEstadisticas() {
  return estadisticas;
}

// Obtener zonas de riesgo
function getZonasRiesgo() {
  return zonasRiesgo;
}

// Generar ID único
function generarId(prefijo) {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${prefijo}-${num}`;
}

// Formatear fecha
function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-DO", {
    year: "numeric", month: "short", day: "numeric"
  });
}

// Obtener color del badge según estado
function getBadgeClass(estado) {
  const mapa = {
    abierto:     "badge--warning",
    cerrado:     "badge--neutral",
    pendiente:   "badge--info",
    en_proceso:  "badge--info",
    detenido:    "badge--danger",
    liberado:    "badge--success",
    procesado:   "badge--warning",
    activa:      "badge--success",
    inactiva:    "badge--neutral",
    en_servicio: "badge--info",
    activo:      "badge--danger",
    resuelto:    "badge--success",
    alta:        "badge--danger",
    media:       "badge--warning",
    baja:        "badge--success",
    critico:     "badge--danger",
  };
  return mapa[estado] || "badge--neutral";
}

// Obtener texto de estado según idioma
function getEstadoTexto(estado, lang = "es") {
  const textos = {
    abierto:     { es: "Abierto",      en: "Open"        },
    cerrado:     { es: "Cerrado",      en: "Closed"      },
    pendiente:   { es: "Pendiente",    en: "Pending"     },
    en_proceso:  { es: "En Proceso",   en: "In Progress" },
    detenido:    { es: "Detenido",     en: "Detained"    },
    liberado:    { es: "Liberado",     en: "Released"    },
    procesado:   { es: "Procesado",    en: "Processed"   },
    activa:      { es: "Activa",       en: "Active"      },
    inactiva:    { es: "Inactiva",     en: "Inactive"    },
    en_servicio: { es: "En Servicio",  en: "On Duty"     },
    activo:      { es: "Activo",       en: "Active"      },
    resuelto:    { es: "Resuelto",     en: "Resolved"    },
    alta:        { es: "Alta",         en: "High"        },
    media:       { es: "Media",        en: "Medium"      },
    baja:        { es: "Baja",         en: "Low"         },
    critico:     { es: "Crítico",      en: "Critical"    },
  };
  return textos[estado]?.[lang] || estado;
}