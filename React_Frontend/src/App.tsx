import { useState, useEffect, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { fileApi } from './api/fileApi';
import './App.css';

type ConversionStatus = 'idle' | 'converting' | 'success' | 'error';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpg'>('png');
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedFilename, setConvertedFilename] = useState<string>('');
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    const healthy = await fileApi.checkHealth();
    setIsBackendHealthy(healthy);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file');
      setStatus('error');
      return;
    }

    setSelectedFile(file);
    setStatus('idle');
    setErrorMessage('');
    setConvertedBlob(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setStatus('converting');
    setErrorMessage('');

    try {
      const result = await fileApi.transformImage(selectedFile, targetFormat);
      setConvertedBlob(result.data);
      setConvertedFilename(result.filename);
      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.response?.data || error.message || 'Conversion failed');
    }
  };

  const handleDownload = () => {
    if (!convertedBlob) return;

    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    setErrorMessage('');
    setConvertedBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <ImageIcon className="header-icon" size={40} />
            <h1>File Transformation API</h1>
            <p>Convert your images between PNG and JPG formats</p>
          </div>
          {isBackendHealthy !== null && (
            <div className={`health-indicator ${isBackendHealthy ? 'healthy' : 'unhealthy'}`}>
              {isBackendHealthy ? (
                <>
                  <CheckCircle size={16} />
                  <span>Backend Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>Backend Offline</span>
                </>
              )}
            </div>
          )}
        </header>

        <div className="main-content">
          {!selectedFile ? (
            <div
              className={`upload-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} />
              <h2>Drop your image here</h2>
              <p>or click to browse</p>
              <p className="supported-formats">Supports: PNG, JPG, JPEG</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="conversion-panel">
              <div className="preview-section">
                <h3>Original Image</h3>
                {previewUrl && (
                  <div className="preview-container">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                  </div>
                )}
                <div className="file-info">
                  <p><strong>Filename:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              </div>

              <div className="controls-section">
                <h3>Convert To</h3>
                <div className="format-selector">
                  <button
                    className={`format-btn ${targetFormat === 'png' ? 'active' : ''}`}
                    onClick={() => setTargetFormat('png')}
                    disabled={status === 'converting'}
                  >
                    PNG
                  </button>
                  <button
                    className={`format-btn ${targetFormat === 'jpg' ? 'active' : ''}`}
                    onClick={() => setTargetFormat('jpg')}
                    disabled={status === 'converting'}
                  >
                    JPG
                  </button>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-primary"
                    onClick={handleConvert}
                    disabled={status === 'converting' || !isBackendHealthy}
                  >
                    {status === 'converting' ? (
                      <>
                        <Loader2 className="spinner" size={20} />
                        Converting...
                      </>
                    ) : (
                      <>
                        <ImageIcon size={20} />
                        Convert Image
                      </>
                    )}
                  </button>

                  {status === 'success' && convertedBlob && (
                    <button className="btn btn-success" onClick={handleDownload}>
                      <Download size={20} />
                      Download {targetFormat.toUpperCase()}
                    </button>
                  )}

                  <button className="btn btn-secondary" onClick={handleReset}>
                    Upload Another
                  </button>
                </div>

                {status === 'success' && (
                  <div className="status-message success">
                    <CheckCircle size={20} />
                    <span>Conversion successful!</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="status-message error">
                    <AlertCircle size={20} />
                    <span>{errorMessage || 'Conversion failed'}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <footer className="footer">
          <p>Made with ❤️ using React + Go</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
