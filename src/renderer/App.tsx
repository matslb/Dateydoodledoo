import React, { useState, useEffect } from 'react';
import FileSelector from './components/FileSelector';
import FileCounter from './components/FileCounter';
import DatePicker from './components/DatePicker';
import Settings from './components/Settings';
import { FileInfo, ProcessResult } from '../shared/types';

const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [deleteOriginals, setDeleteOriginals] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load settings on mount
    console.log('App mounted, electronAPI available:', !!window.electronAPI);
    if (window.electronAPI) {
      loadSettings();
    } else {
      console.error('electronAPI is not available!');
    }
  }, []);

  const loadSettings = async () => {
    if (!window.electronAPI) return;
    
    try {
      const deleteOriginalsSetting = await window.electronAPI.getDeleteOriginals();
      setDeleteOriginals(deleteOriginalsSetting);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one file' });
      return;
    }

    if (!window.electronAPI) {
      setMessage({ type: 'error', text: 'Electron API not available' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const result: ProcessResult = await window.electronAPI.processFiles(
        selectedFiles,
        selectedDate.toISOString(),
        deleteOriginals
      );

      if (result.success) {
        setMessage({
          type: 'success',
          text: result.message || `Successfully processed ${result.processedCount} files!`,
        });
        setSelectedFiles([]);
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'An error occurred while processing files',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      <button
        type="button"
        className="settings-button"
        onClick={() => setShowSettings(true)}
      >
        ⚙️ Settings
      </button>

      <div className="app-header">
        <h1 className="app-title">DateyDoodleDoo</h1>
        <p className="app-subtitle">Organize your film scans with proper dates</p>
      </div>

      <FileSelector
        selectedFiles={selectedFiles}
        onFilesSelected={setSelectedFiles}
      />

      <FileCounter files={selectedFiles} />

      <DatePicker
        onDateChange={setSelectedDate}
        initialDate={selectedDate}
      />

      <div className="card">
        <div className="form-group">
          <div className="toggle">
            <input
              type="checkbox"
              id="deleteOriginals"
              checked={deleteOriginals}
              onChange={(e) => setDeleteOriginals(e.target.checked)}
            />
            <label htmlFor="deleteOriginals" style={{ cursor: 'pointer', margin: 0 }}>
              Delete original files after moving
            </label>
          </div>
        </div>

        <button
          type="button"
          className="button"
          onClick={handleProcess}
          disabled={isProcessing || selectedFiles.length === 0}
          style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
        >
          {isProcessing ? 'Processing...' : 'Go'}
        </button>
      </div>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default App;
