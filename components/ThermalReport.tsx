import React from 'react';
import { Transaction } from '../types';

interface ThermalReportProps {
    transactions: Transaction[];
    dateStart: string;
    dateEnd: string;
    selectedMachine: string;
    machineName: string;
    totalBet: number;
    totalPayout: number;
    profit: number;
    headerName?: string;
    logoUrl?: string | null;
}

const ThermalReport: React.FC<ThermalReportProps> = ({
    transactions,
    dateStart,
    dateEnd,
    selectedMachine,
    machineName,
    totalBet,
    totalPayout,
    profit,
    headerName,
    logoUrl
}) => {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          @page { 
            margin: 0; 
            size: 80mm auto;
          }
          body { 
            margin: 0; 
            padding: 0;
          }
          #thermal-report-area {
            width: 68mm !important;
            margin: 0 auto !important;
            padding: 5mm !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}} />
            <div
                id="thermal-report-area"
                className="bg-white text-black font-mono text-[11px] py-6 px-4 w-[68mm] mx-auto border border-gray-100 shadow-sm print:shadow-none print:border-none print:p-0 print:mx-0 overflow-hidden"
            >
                <div className="text-center mb-6">
                    {logoUrl && (
                        <div className="flex justify-center mb-4">
                            <img src={logoUrl} alt="Logo" className="max-h-32 max-w-full object-contain grayscale" />
                        </div>
                    )}
                    <h2 className="text-lg font-black uppercase leading-tight">{headerName || 'MBRACES'}</h2>
                    <p className="text-[10px] mt-1 font-bold uppercase tracking-widest text-gray-600 border-t border-gray-100 pt-1">
                        REPORTE DE TRANSACCIONES
                    </p>
                </div>

                <div className="border-b-2 border-dashed border-black my-2"></div>

                <div className="text-xs mb-2">
                    <div className="flex justify-between">
                        <span>PERÍODO:</span>
                        <span>{dateStart} - {dateEnd}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>TERMINAL:</span>
                        <span>{machineName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>FECHA:</span>
                        <span>{new Date().toLocaleString('es-DO')}</span>
                    </div>
                </div>

                <div className="border-b-2 border-dashed border-black my-2"></div>

                <div className="text-center font-bold text-xs mb-2">RESUMEN</div>

                <div className="space-y-2 my-4">
                    <div className="flex justify-between font-bold">
                        <span>TOTAL VENTAS:</span>
                        <span>RD${totalBet.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>TOTAL PAGOS:</span>
                        <span>RD${totalPayout.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="border-b-2 border-dashed border-black my-2"></div>

                <div className="flex justify-between text-lg font-black my-4">
                    <span>GANANCIA:</span>
                    <span>RD${profit.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="border-b-2 border-dashed border-black my-2"></div>

                <div className="text-center font-bold text-xs mb-2">DETALLE DE TRANSACCIONES</div>

                <div className="border-b-2 border-dashed border-black my-2"></div>

                {transactions.map((t, index) => (
                    <div key={t.id} className="mb-3">
                        <div className="font-bold text-xs">#{index + 1} - {t.ticketId}</div>
                        <div className="text-[10px]">{t.date}</div>
                        <div className="text-[10px]">Terminal: {t.machineName}</div>
                        <div className="text-[10px]">
                            Tipo: {t.type} | Núm: {t.numbers || '-'}
                        </div>
                        <div className="flex justify-between font-bold text-xs mt-1">
                            <span>Monto:</span>
                            <span>RD${t.amount.toLocaleString('es-DO')}</span>
                        </div>
                        <div className="border-b border-dashed border-gray-400 my-2"></div>
                    </div>
                ))}

                <div className="text-center mt-6 text-xs leading-relaxed">
                    <p className="font-bold">GRACIAS POR SU PREFERENCIA</p>
                    <p className="text-[10px] mt-2 text-gray-500">
                        Total de transacciones: {transactions.length}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ThermalReport;
