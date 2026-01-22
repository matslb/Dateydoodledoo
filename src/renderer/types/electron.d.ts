import { FileInfo, Settings, ProcessResult } from '../../shared/types';

export interface ElectronAPI {
  openFileDialog: () => Promise<FileInfo[]>;
  openFolderDialog: () => Promise<string | null>;
  processFiles: (
    files: FileInfo[],
    date: string,
    deleteOriginals: boolean
  ) => Promise<ProcessResult>;
  getSettings: () => Promise<Settings>;
  saveSettings: (settings: Partial<Settings>) => Promise<void>;
  getRootDestinationFolder: () => Promise<string>;
  setRootDestinationFolder: (folderPath: string) => Promise<void>;
  getDeleteOriginals: () => Promise<boolean>;
  setDeleteOriginals: (value: boolean) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
