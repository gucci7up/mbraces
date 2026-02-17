-- 1. Corregir tabla de Perfiles (full_name -> name)
ALTER TABLE public.profiles RENAME COLUMN full_name TO name;

-- 2. Corregir tabla de Transacciones (owner_id -> terminal_owner_id + machine_name)
ALTER TABLE public.transactions RENAME COLUMN owner_id TO terminal_owner_id;
ALTER TABLE public.transactions ADD COLUMN machine_name TEXT;

-- 3. Cambiar ID de Terminales a TEXT (Solución al error de FK)
-- Primero eliminamos la restricción de llave foránea
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_terminal_id_fkey;

-- Cambiamos los tipos de datos a TEXT
ALTER TABLE public.terminals ALTER COLUMN id SET DATA TYPE TEXT;
ALTER TABLE public.transactions ALTER COLUMN terminal_id SET DATA TYPE TEXT;

-- Recreamos la restricción de llave foránea
ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_terminal_id_fkey 
FOREIGN KEY (terminal_id) REFERENCES public.terminals(id) 
ON DELETE CASCADE;

-- 4. Crear tabla de Notificaciones (Faltante)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('connection', 'disconnection', 'alert')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insertar registros iniciales (APP SETTINGS y JACKPOT)
INSERT INTO public.app_settings (id, app_name, ticket_name)
VALUES (1, 'GalgoTrack', 'CONSORCIO GALGOTRACK')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.jackpot_values (id, current_value)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- 6. Habilitar Notificaciones en Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
