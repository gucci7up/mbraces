
import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Power, Wifi, WifiOff, Shield, Database, Loader2 } from 'lucide-react';
// Fix: Removed createTerminal as it is not exported from supabaseService and not used in this component
import { getTerminals } from '../data/supabaseService';
import { Machine, MachineStatus, User, UserRole } from '../types';

interface MachinesProps {
  user: User;
}

const Machines: React.FC<MachinesProps> = ({ user }) => {
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadMachines = async () => {
    setLoading(true);
    try {
      const data = await getTerminals(user);
      setMachines(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMachines();
  }, [user]);

  const filteredMachines = machines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terminales</h1>
          <p className="text-slate-500 mt-1">
             {user.role === UserRole.SUPER_ADMIN 
               ? 'Vista Global (Todos los Consorcios)' 
               : `Terminales de ${user.consortiumName}`}
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
        >
          <Plus size={18} />
          <span className="font-bold uppercase text-xs tracking-widest">Nueva Máquina</span>
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full pl-11 pr-4 py-3 bg-transparent rounded-lg focus:outline-none text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
        {loading ? (
           <div className="p-12 text-center flex flex-col items-center">
             <Loader2 size={32} className="text-emerald-500 animate-spin mb-4" />
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Consultando Supabase...</p>
           </div>
        ) : filteredMachines.length === 0 ? (
           <div className="p-12 text-center text-slate-400">
             No hay máquinas registradas.
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Terminal</th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Estado</th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Software</th>
                  <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredMachines.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${m.status === 'En Línea' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                           <Database size={20} />
                         </div>
                         <div>
                            <div className="font-bold text-slate-800">{m.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{m.ip_address || 'Sin IP'}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        m.status === 'En Línea' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {m.software_version || 'v1.0.0'}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400 text-xs">
                      {new Date(m.last_sync).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Machines;
