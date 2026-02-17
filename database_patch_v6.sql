-- Database Patch v6: Add status for ticket cancellation
-- Actualizar tabla de transacciones manuales
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'voided'));

-- Actualizar tabla de tickets sincronizados (Collector)
ALTER TABLE public.sync_tickets 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'voided'));

-- Comentario para el log de parches
-- Este parche habilita la anulación de tickets vinculando un estado a cada transacción.
