import React from 'react';
import { PrintData } from '../types';

interface ThermalTicketProps {
  data: PrintData;
  logoUrl?: string | null;
  headerName?: string;
  systemName?: string;
}

const ThermalTicket: React.FC<ThermalTicketProps> = ({ data, logoUrl, headerName, systemName }) => {
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
          #thermal-ticket-area {
            width: 68mm !important;
            margin: 0 auto !important;
            padding: 5mm !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}} />
      <div
        id="thermal-ticket-area"
        className="bg-white text-black font-mono text-[11px] py-6 px-4 w-[68mm] mx-auto border border-gray-100 shadow-sm print:shadow-none print:border-none print:p-0 print:mx-0 overflow-hidden"
      >
        <div className="text-center mb-6">
          {logoUrl && (
            <div className="flex justify-center mb-4">
              <img src={logoUrl} alt="Logo" className="max-h-32 max-w-full object-contain grayscale" />
            </div>
          )}
          <h2 className="text-lg font-black uppercase leading-tight">{headerName || data.bancaName}</h2>
          <p className="text-[10px] mt-1 font-bold uppercase tracking-widest text-gray-600 border-t border-gray-100 pt-1">
            SISTEMA {systemName || 'GALGOTRACK'}
          </p>
        </div>

        <div className="border-b-2 border-dashed border-black my-2"></div>

        <div className="flex justify-between text-xs mb-2">
          <span>FECHA:</span>
          <span>{data.date}</span>
        </div>

        <div className="border-b-2 border-dashed border-black my-2"></div>

        <div className="space-y-2 my-4">
          <div className="flex justify-between font-bold">
            <span>TOTAL APUESTAS:</span>
            <span>RD${data.totalBet.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span>TOTAL PAGOS:</span>
            <span>RD${data.totalPaid.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="border-b-2 border-dashed border-black my-2"></div>

        <div className="flex justify-between text-lg font-black my-4">
          <span>GANANCIA:</span>
          <span>RD${data.profit.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="border-b-2 border-dashed border-black my-2"></div>

        <div className="text-center mt-6 text-xs leading-relaxed">
          <p className="font-bold">GRACIAS POR SU PREFERENCIA</p>
          <p className="mt-1 text-[9px] opacity-70">*** COPIA ADMINISTRATIVA ***</p>
        </div>
      </div>
    </>
  );
};

export default ThermalTicket;