import React from 'react';
import { User, ShieldAlert, ShieldCheck, Shield, Calendar } from 'lucide-react';

const DocumentList = ({ documents }) => {
  // Mapeo de estilos para la clasificación central
  const getPriorityData = (status) => {
    switch (status) {
      case 'red':
        return { 
          label: 'ALTA PRIORIDAD', 
          css: 'bg-red-500/10 border-red-500/20 text-red-400',
          icon: <ShieldAlert size={14} className="text-red-400" />
        };
      case 'amber':
        return { 
          label: 'MEDIA PRIORIDAD', 
          css: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          icon: <Shield size={14} className="text-amber-400" />
        };
      case 'green':
        return { 
          label: 'BAJA PRIORIDAD', 
          css: 'bg-green-500/10 border-green-500/20 text-green-400',
          icon: <ShieldCheck size={14} className="text-green-400" />
        };
      default:
        return { 
          label: 'SIN CLASIFICAR', 
          css: 'bg-white/5 border-white/10 text-gray-400',
          icon: <Shield size={14} />
        };
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">Gestión de Archivos</h2>
        </div>
        <span className="text-xs text-gray-500 font-mono">
          {documents.length} documentos encontrados
        </span>
      </div>

      <div className="space-y-4">
        {documents.map(doc => {
          const priority = getPriorityData(doc.status);
          return (
            <div 
              key={doc._id} // Cambiado a _id para MongoDB
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:bg-white/10 transition-colors group"
            >
              {/* IZQUIERDA: Nombre y Metadata */}
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-xl font-bold text-gray-100 mb-3 truncate group-hover:text-indigo-400 transition-colors" title={doc.title}>
                  {doc.title}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-white/10 border border-white/20 text-gray-300 px-3 py-1.5 rounded-md uppercase tracking-wider">
                    {doc.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                    <Calendar size={12} />
                    {doc.date}
                  </div>
                </div>
              </div>

              {/* CENTRO: Clasificación de Prioridad */}
              <div className="flex flex-col items-center w-72 shrink-0">
                <div className={`flex items-center justify-center gap-3 border px-6 py-2.5 rounded-full text-[11px] font-bold w-full tracking-widest ${priority.css}`}>
                  {priority.icon}
                  {priority.label}
                </div>
              </div>

              {/* DERECHA: Autor (Dinámico) */}
              <div className="w-64 flex items-center justify-end gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Subido por</p>
                  <p className="text-sm font-medium text-gray-200">
                    {doc.author || 'Luis José Castro'} {/* Prioriza el autor de la BD */}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <User size={20} className="text-indigo-400" />
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentList;