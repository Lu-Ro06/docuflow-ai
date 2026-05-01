import React from 'react';
import { FileText, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const DocumentCard = ({ title, type, status, date }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'green':
        return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: <CheckCircle2 size={16} /> };
      case 'amber':
        return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <Clock size={16} /> };
      case 'red':
        return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <AlertCircle size={16} /> };
      default:
        return { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: <FileText size={16} /> };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-transform duration-300 cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-docu-blue/10 rounded-xl group-hover:bg-docu-blue/20 transition-colors">
          <FileText className="text-docu-accent" size={24} />
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}>
          {config.icon}
          <span className="capitalize">{status === 'amber' ? 'Pendiente' : status === 'green' ? 'Procesado' : 'Fallido'}</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-100 mb-1 truncate" title={title}>{title}</h3>
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <span className="uppercase tracking-wider">{type}</span>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default DocumentCard;
