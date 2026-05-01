import React from 'react';
import { Server, Activity } from 'lucide-react';

const ClusterStatus = () => {
  const nodes = [
    { id: 'Nodo 1', status: 'healthy', load: '45%' },
    { id: 'Nodo 2', status: 'healthy', load: '32%' },
    { id: 'Nodo 3', status: 'warning', load: '89%' },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="text-docu-accent" size={20} />
          Estado del Clúster
        </h2>
        <span className="text-xs px-2 py-1 bg-docu-blue/20 text-docu-accent rounded-full border border-docu-blue/30">
          3 Nodos Activos
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nodes.map((node) => (
          <div key={node.id} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Server size={16} />
                {node.id}
              </div>
              <div className={`w-2 h-2 rounded-full ${node.status === 'healthy' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]'}`}></div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xs text-gray-400">Carga</span>
              <span className="text-lg font-semibold text-white">{node.load}</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full ${node.status === 'healthy' ? 'bg-docu-blue' : 'bg-yellow-500'}`} 
                style={{ width: node.load }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClusterStatus;
