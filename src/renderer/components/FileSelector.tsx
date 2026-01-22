import React, { useCallback, useState } from 'react';
import { FileInfo } from '../../shared/types';

interface FileSelectorProps {
  onFilesSelected: (files: FileInfo[]) => void;
  selectedFiles: FileInfo[];
}

const FileSelector: React.FC<FileSelectorProps> = ({
  onFilesSelected,
  selectedFiles,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDialog = async () => {
    if (!window.electronAPI) {
      console.error('electronAPI not available');
      return;
    }
    
    try {
      const files = await window.electronAPI.openFileDialog();
      if (files && files.length > 0) {
        onFilesSelected([...selectedFiles, ...files]);
      }
    } catch (error) {
      console.error('Error opening file dialog:', error);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files: FileInfo[] = [];
      const items = Array.from(e.dataTransfer.files);
      
      console.log('Drop event, files:', items.length);

      for (const file of items) {
        // Check if it's an image file
        const ext = file.name.toLowerCase().split('.').pop();
        const imageExts = ['jpg', 'jpeg', 'png', 'tiff', 'tif', 'heic', 'heif'];
        
        if (ext && imageExts.includes(ext)) {
          // In Electron, File objects from drag-and-drop have a path property
          // TypeScript doesn't know about this, so we use type assertion
          const electronFile = file as File & { path?: string };
          if (electronFile.path) {
            files.push({
              path: electronFile.path,
              name: file.name,
            });
            console.log('Added file:', file.name, 'path:', electronFile.path);
          } else {
            console.warn('File dropped but no path available:', file.name);
          }
        } else {
          console.log('Skipped non-image file:', file.name);
        }
      }

      if (files.length > 0) {
        console.log('Adding', files.length, 'files to selection');
        onFilesSelected([...selectedFiles, ...files]);
      } else {
        console.warn('No valid image files found in drop');
      }
    },
    [selectedFiles, onFilesSelected]
  );

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
  };

  const clearAll = () => {
    onFilesSelected([]);
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem', color: 'var(--text)', fontSize: '1.2rem' }}>
        Select Images
      </h2>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: isDragging ? 'var(--hover)' : 'transparent',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
        onClick={handleFileDialog}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📷</div>
        <div style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
          {isDragging ? 'Drop files here' : 'Drag and drop images here'}
        </div>
        <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          or click to browse
        </div>
      </div>

      <button
        type="button"
        className="button button-secondary"
        onClick={handleFileDialog}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        Open File Browser
      </button>

      {selectedFiles.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Selected files:
            </div>
            <button
              type="button"
              onClick={clearAll}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--error)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textDecoration: 'underline',
              }}
            >
              Clear all
            </button>
          </div>
          <ul className="file-list">
            {selectedFiles.map((file, index) => (
              <li key={`${file.path}-${index}`} className="file-list-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--error)',
                      cursor: 'pointer',
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileSelector;
