import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { organizeFiles } from './fileProcessor.js';
import { FileInfo, ProcessResult, Settings } from '../shared/types.js';
import {
  getSettings,
  saveSettings,
  getRootDestinationFolder,
  setRootDestinationFolder,
  getDeleteOriginals,
  setDeleteOriginals,
} from './settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  // Preload is built to the same directory as main.js
  const preloadPath = path.join(__dirname, 'preload.js');
  
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#F5F5DC',
    frame: true,
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, use app.getAppPath() to handle asar archives correctly
    const htmlPath = path.join(app.getAppPath(), 'dist', 'index.html');
    console.log('Loading HTML from:', htmlPath);
    mainWindow.loadFile(htmlPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

// File selection dialog
ipcMain.handle('open-file-dialog', async () => {
  if (!mainWindow) return [];

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'tiff', 'tif', 'png', 'heic', 'heif'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled) {
    return [];
  }

  return result.filePaths.map((filePath) => ({
    path: filePath,
    name: path.basename(filePath),
  }));
});

// Folder selection dialog
ipcMain.handle('open-folder-dialog', async () => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

// Process files
ipcMain.handle(
  'process-files',
  async (
    _event,
    files: FileInfo[],
    date: string,
    deleteOriginals: boolean
  ): Promise<ProcessResult> => {
    const rootPath = getRootDestinationFolder();
    if (!rootPath) {
      return {
        success: false,
        message: 'Root destination folder is not set. Please configure it in settings.',
        processedCount: 0,
        errorCount: files.length,
      };
    }

    const dateObj = new Date(date);
    return await organizeFiles(files, dateObj, rootPath, deleteOriginals);
  }
);

// Settings handlers
ipcMain.handle('get-settings', (): Settings => {
  return getSettings();
});

ipcMain.handle('save-settings', (_event, settings: Partial<Settings>) => {
  saveSettings(settings);
});

ipcMain.handle('get-root-destination-folder', (): string => {
  return getRootDestinationFolder();
});

ipcMain.handle('set-root-destination-folder', (_event, folderPath: string) => {
  setRootDestinationFolder(folderPath);
});

ipcMain.handle('get-delete-originals', (): boolean => {
  return getDeleteOriginals();
});

ipcMain.handle('set-delete-originals', (_event, value: boolean) => {
  setDeleteOriginals(value);
});
