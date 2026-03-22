/* ================================================
   SISTEMA POLICIAL RD — main.js
   Proceso principal de Electron
   Controla la ventana de la aplicación
================================================ */

const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

// Variable global para la ventana principal
let mainWindow;

/* ================================================
   CREAR VENTANA PRINCIPAL
================================================ */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: "Sistema de Gestión Policial — Policía Nacional RD",
    // Icono de la aplicación
    icon: path.join(__dirname, "assets/images/logo.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    // Ventana sin bordes nativos para diseño personalizado
    frame: false,
    // Fondo oscuro mientras carga
    backgroundColor: "#0a0e1a",
    show: false,
    autoHideMenuBar: true,
  });

  // Cargar la página principal
  mainWindow.loadFile("index.html");

  // Mostrar ventana cuando esté lista (evita flash blanco)
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Limpiar referencia cuando se cierre
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/* ================================================
   EVENTOS DEL CICLO DE VIDA DE LA APP
================================================ */

// Crear ventana cuando Electron esté listo
app.whenReady().then(() => {
  createWindow();
});

// Cerrar app cuando todas las ventanas estén cerradas (Windows/Linux)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// En macOS, recrear ventana si se hace clic en el dock
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/* ================================================
   IPC — COMUNICACIÓN CON EL RENDERER
   Maneja eventos enviados desde la interfaz
================================================ */

// Minimizar ventana
ipcMain.on("window-minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

// Maximizar / restaurar ventana
ipcMain.on("window-maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  }
});

// Cerrar aplicación
ipcMain.on("window-close", () => {
  if (mainWindow) {
    mainWindow.destroy();
  }
});

// Diálogo de confirmación antes de cerrar
ipcMain.handle("confirm-close", async () => {
  return true;
});

// Exportar reporte (simulado)
ipcMain.handle("export-report", async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: "Exportar Reporte",
    defaultPath: `reporte-policial-${Date.now()}.txt`,
    filters: [{ name: "Texto", extensions: ["txt"] }],
  });

  if (!result.canceled) {
    const fs = require("fs");
    fs.writeFileSync(result.filePath, data);
    return { success: true, path: result.filePath };
  }
  return { success: false };
});