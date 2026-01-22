const { contextBridge, ipcRenderer } = require('electron');

// Import types are only for TypeScript, not used at runtime
interface FileInfo {
  path: string;
  name: string;
}

interface Settings {
  rootDestinationFolder: string;
  deleteOriginals: boolean;
}

interface ProcessResult {
  success: boolean;
  message: string;
  processedCount: number;
  errorCount: number;
}

contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  openFileDialog: (): Promise<FileInfo[]> =>
    ipcRenderer.invoke('open-file-dialog'),
  
  openFolderDialog: (): Promise<string | null> =>
    ipcRenderer.invoke('open-folder-dialog'),
  
  processFiles: (
    files: FileInfo[],
    date: string,
    deleteOriginals: boolean
  ): Promise<ProcessResult> =>
    ipcRenderer.invoke('process-files', files, date, deleteOriginals),
  
  // Settings
  getSettings: (): Promise<Settings> =>
    ipcRenderer.invoke('get-settings'),
  
  saveSettings: (settings: Partial<Settings>): Promise<void> =>
    ipcRenderer.invoke('save-settings', settings),
  
  getRootDestinationFolder: (): Promise<string> =>
    ipcRenderer.invoke('get-root-destination-folder'),
  
  setRootDestinationFolder: (folderPath: string): Promise<void> =>
    ipcRenderer.invoke('set-root-destination-folder', folderPath),
  
  getDeleteOriginals: (): Promise<boolean> =>
    ipcRenderer.invoke('get-delete-originals'),
  
  setDeleteOriginals: (value: boolean): Promise<void> =>
    ipcRenderer.invoke('set-delete-originals', value),
});
