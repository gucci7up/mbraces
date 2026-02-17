import React, { useState } from 'react';
import { Search, Trash2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { deleteTicketsByNumber } from '../data/supabaseService';
import { User } from '../types';

interface DeleteTicketsProps {
    user: User;
}

export const DeleteTickets: React.FC<DeleteTicketsProps> = ({ user }) => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [searching, setSearching] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

    const handleSearch = async () => {
        if (!ticketNumber.trim()) {
            setResult({ success: false, message: 'Por favor ingresa un número de ticket' });
            return;
        }

        setSearching(true);
        setResult(null);

        try {
            const { count } = await deleteTicketsByNumber(ticketNumber.trim());

            if (count === 0) {
                setResult({
                    success: false,
                    message: `No se encontraron tickets con el número "${ticketNumber}"`
                });
            } else {
                setResult({
                    success: true,
                    message: `Se encontraron ${count} ticket(s) con el número "${ticketNumber}". ¿Deseas eliminarlos permanentemente?`,
                    count
                });
            }
        } catch (error: any) {
            setResult({ success: false, message: error.message || 'Error al buscar tickets' });
        } finally {
            setSearching(false);
        }
    };

    const handleDelete = async () => {
        if (!result?.count) return;

        setDeleting(true);

        try {
            await deleteTicketsByNumber(ticketNumber.trim(), true); // true = confirm deletion

            setResult({
                success: true,
                message: `✅ ${result.count} ticket(s) eliminado(s) permanentemente`
            });

            // Clear form after 3 seconds
            setTimeout(() => {
                setTicketNumber('');
                setResult(null);
            }, 3000);
        } catch (error: any) {
            setResult({ success: false, message: error.message || 'Error al eliminar tickets' });
        } finally {
            setDeleting(false);
        }
    };

    const handleCancel = () => {
        setResult(null);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                    <Trash2 className="mr-3 text-red-500" size={32} />
                    Eliminar Tickets
                </h1>
                <p className="text-slate-400">
                    Busca y elimina permanentemente tickets por su número de ID
                </p>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start">
                <AlertTriangle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                <div>
                    <h3 className="text-red-400 font-bold mb-1">⚠️ Acción Permanente</h3>
                    <p className="text-red-300/80 text-sm">
                        Esta acción eliminará PERMANENTEMENTE todos los tickets con el número especificado.
                        No se puede deshacer. Úsala con precaución.
                    </p>
                </div>
            </div>

            {/* Search Form */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-400 mb-2">
                            Número de Ticket
                        </label>
                        <input
                            type="text"
                            value={ticketNumber}
                            onChange={(e) => setTicketNumber(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Ej: TCK-12345"
                            className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-slate-900"
                            disabled={searching || deleting}
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleSearch}
                            disabled={searching || deleting || !ticketNumber.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                        >
                            <Search size={18} />
                            {searching ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className={`border rounded-2xl p-6 ${result.success && result.count
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : result.success
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                    }`}>
                    <div className="flex items-start mb-4">
                        {result.success && result.count ? (
                            <AlertTriangle className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" size={24} />
                        ) : result.success ? (
                            <CheckCircle2 className="text-green-500 mr-3 flex-shrink-0 mt-0.5" size={24} />
                        ) : (
                            <XCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={24} />
                        )}
                        <div className="flex-1">
                            <p className={`font-semibold ${result.success && result.count
                                    ? 'text-yellow-400'
                                    : result.success
                                        ? 'text-green-400'
                                        : 'text-red-400'
                                }`}>
                                {result.message}
                            </p>
                        </div>
                    </div>

                    {/* Confirmation Buttons */}
                    {result.count && result.count > 0 && (
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={18} />
                                {deleting ? 'Eliminando...' : 'Sí, Eliminar Permanentemente'}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={deleting}
                                className="px-6 py-3 rounded-xl font-semibold border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
