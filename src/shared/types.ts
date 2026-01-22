export interface FileInfo {
  path: string;
  name: string;
}

export interface Settings {
  rootDestinationFolder: string;
  deleteOriginals: boolean;
}

export interface ProcessResult {
  success: boolean;
  message: string;
  processedCount: number;
  errorCount: number;
}
