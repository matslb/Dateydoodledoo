import React from 'react';
import { FileInfo } from '../../shared/types';

interface FileCounterProps {
  files: FileInfo[];
}

const FileCounter: React.FC<FileCounterProps> = ({ files }) => {
  const count = files.length;
  
  return (
    <div className="card">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '500', marginBottom: '0.5rem' }}>
          {count}
        </div>
        <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          {count === 1 ? 'file selected' : 'files selected'}
        </div>
      </div>
    </div>
  );
};

export default FileCounter;
