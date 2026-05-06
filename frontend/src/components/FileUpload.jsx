import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api/axios.js';

const FileUpload = ({ onSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadSuccess(false);
    }
  };

  // Lógica para enviar el archivo al docs_service vía Nginx
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    // 'file' debe coincidir con el nombre que espera el endpoint de FastAPI
    formData.append('file', selectedFile); 

    try {
      // Usamos api (axios) para que incluya el token JWT automáticamente
      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadSuccess(true);
      setSelectedFile(null);
      
      // Callback para refrescar la lista de DocumentList
      if (onSuccess) onSuccess(); 

    } catch (error) {
      console.error("Error al subir archivo:", error);
      const message = error.response?.data?.detail || "Error al subir el archivo al servidor.";
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
          <h2 className="text-lg font-bold text-white tracking-tight">Subir Documentos</h2>
        </div>
        {uploadSuccess && (
          <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-400/10 px-3 py-1 rounded-full animate-in fade-in zoom-in">
            <CheckCircle size={14} /> LISTO
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="hidden" 
        accept=".pdf,.docx,.txt"
      />

      <div 
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
            : 'border-white/10 hover:border-indigo-500/40 hover:bg-white/5'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <>
            <div className={`p-5 rounded-2xl mb-4 transition-all ${isDragging ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
              <UploadCloud size={38} />
            </div>
            <p className="text-sm font-semibold text-gray-200 mb-1">
              {isDragging ? '¡Suéltalo ahora!' : 'Arrastra tus archivos aquí'}
            </p>
            <p className="text-[11px] text-gray-500 mb-5 uppercase tracking-widest font-bold">
              PDF • DOCX • TXT
            </p>
            <button 
              type="button"
              onClick={handleBrowseClick}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              EXPLORAR DISCO
            </button>
          </>
        ) : (
          /* Previsualización del archivo seleccionado */
          <div className="w-full flex items-center justify-between bg-[#0f172a] p-5 rounded-2xl border border-indigo-500/30 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                <File size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm text-white font-bold truncate max-w-[180px]">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-gray-500 font-mono">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedFile(null)}
                disabled={uploading}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all disabled:opacity-30"
              >
                <X size={20} />
              </button>
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:bg-gray-800 disabled:text-gray-500"
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    SUBIENDO
                  </>
                ) : (
                  'CONFIRMAR'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;