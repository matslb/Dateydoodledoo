import React, { useState, useEffect } from 'react';
import { Settings as SettingsType } from '../../shared/types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<SettingsType>({
    rootDestinationFolder: '',
    deleteOriginals: false,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen && window.electronAPI) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    if (!window.electronAPI) return;
    
    const loadedSettings = await window.electronAPI.getSettings();
    setSettings(loadedSettings);
  };

  const handleSelectFolder = async () => {
    if (!window.electronAPI) return;
    
    const folderPath = await window.electronAPI.openFolderDialog();
    if (folderPath) {
      setSettings({ ...settings, rootDestinationFolder: folderPath });
    }
  };

  const handleSave = async () => {
    if (!window.electronAPI) return;
    
    try {
      await window.electronAPI.saveSettings(settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="form-group">
          <label className="label">Root Destination Folder</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="input"
              value={settings.rootDestinationFolder}
              readOnly
              placeholder="No folder selected"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="button button-secondary"
              onClick={handleSelectFolder}
            >
              Browse
            </button>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
            Images will be organized into year/month subfolders here
          </div>
        </div>

        <div className="form-group">
          <div className="toggle">
            <input
              type="checkbox"
              id="deleteOriginals"
              checked={settings.deleteOriginals}
              onChange={(e) =>
                setSettings({ ...settings, deleteOriginals: e.target.checked })
              }
            />
            <label htmlFor="deleteOriginals" style={{ cursor: 'pointer', margin: 0 }}>
              Delete original files after moving
            </label>
          </div>
        </div>

        {message && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="button-group">
          <button type="button" className="button" onClick={handleSave}>
            Save
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
