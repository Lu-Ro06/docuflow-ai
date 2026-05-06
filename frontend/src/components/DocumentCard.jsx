import React, { useState } from 'react';
import { FileText, Clock, AlertCircle, CheckCircle2, Download, X } from 'lucide-react';
import api from '../api/axios.js';

// Recibimos _id que viene de tu esquema de MongoDB
const DocumentCard = ({ _id, document_id, title, type, status, date, summary }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Configuración de estilos según el status de MongoDB
  const getStatusConfig = () => {
    switch (status) {
      case 'green':
        return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: <CheckCircle2 size={16} /> };
      case 'amber':
        return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <Clock size={16} /> };
      case 'red':
        return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <AlertCircle size={16} /> };
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: <FileText size={16} /> };
    }
  };

  const config = getStatusConfig();

  // Función para descargar el archivo real desde el servidor vía Nginx
  const handleDownload = async (e) => {
    e.stopPropagation();
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      // Usamos axios (api) para incluir el token JWT y vamos por Nginx
      const response = await api.get(`/documents/download/${document_id || _id}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title); 
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error en la descarga:", error);
      alert("No se pudo descargar el archivo de la base de datos.");
    } finally {
      setIsDownloading(false);
      setIsModalOpen(false);
    }
  };

  const defaultSummary = "El documento solicitado contiene información procesada por el sistema. Se incluyen datos relevantes según el formato y origen del archivo.";

  return (
    <>
      {/* TARJETA DASHBOARD */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:translate-y-[-2px] transition-transform duration-300 cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
            <FileText className="text-indigo-400" size={24} />
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}>
            {config.icon}
            <span className="capitalize">
              {status === 'amber' ? 'Pendiente' : status === 'green' ? 'Procesado' : 'Fallido'}
            </span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-100 mb-1 truncate" title={title}>{title}</h3>
        <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
          <span className="uppercase tracking-wider font-bold">{type}</span>
          <span>{date}</span>
        </div>
      </div>

      {/* MODAL DE DETALLES */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-white/10 p-6 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 relative">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6 pr-8">
              <div className={`p-3 rounded-2xl ${config.bg} ${config.color}`}>
                <FileText size={28} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight break-all">{title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${config.bg} ${config.color} border ${config.border}`}>
                    {status === 'amber' ? 'Pendiente' : status === 'green' ? 'Procesado' : 'Fallido'}
                  </span>
                  <span className="text-xs text-gray-400 uppercase tracking-widest">{type} • {date}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                Resumen del Documento
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed text-justify">
                {summary || defaultSummary}
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                Cerrar
              </button>
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className={`flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 ${
                  isDownloading ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                }`}
              >
                {isDownloading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Descargando...
                  </span>
                ) : (
                  <>
                    <Download size={18} />
                    Descargar Archivo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentCard;