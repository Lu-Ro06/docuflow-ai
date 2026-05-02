import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="glass-panel p-6 rounded-2xl mb-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Subir Documentos</h2>
      <div 
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
          isDragging 
            ? 'border-docu-accent bg-docu-accent/5' 
            : 'border-white/10 hover:border-docu-blue/50 hover:bg-white/5'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      >
        <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${isDragging ? 'bg-docu-accent/20 text-docu-accent' : 'bg-docu-blue/10 text-docu-blue'}`}>
          <UploadCloud size={32} />
        </div>
        <p className="text-sm font-medium text-gray-200 mb-1">
          Arrastra y suelta tus archivos aquí
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Soporte para archivos PDF, DOCX y TXT
        </p>
        <button className="px-4 py-2 bg-docu-blue hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-docu-blue/20">
          Explorar Archivos
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
