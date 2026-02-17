-- 1. Añadir columna is_approved a profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- 2. Asegurar que el primer usuario (Super Admin) esté aprobado por defecto
-- Nota: Esto se puede hacer manualmente o mediante un trigger si es necesario, 
-- pero por ahora asumimos que el admin se aprueba solo o se crea manualmente.

-- 3. Actualizar políticas de RLS para considerar la aprobación
DROP POLICY IF EXISTS "Terminals are viewable by owners" ON public.terminals;
CREATE POLICY "Terminals are viewable by approved owners" ON public.terminals 
FOR SELECT USING (
  (auth.uid() = owner_id AND (SELECT is_approved FROM public.profiles WHERE id = auth.uid()) = TRUE)
  OR 
  ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Super Admin')
);

DROP POLICY IF EXISTS "Transactions are viewable by terminal owners" ON public.transactions;
CREATE POLICY "Transactions are viewable by approved owners" ON public.transactions 
FOR SELECT USING (
  (auth.uid() = terminal_owner_id AND (SELECT is_approved FROM public.profiles WHERE id = auth.uid()) = TRUE)
  OR 
  ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Super Admin')
);

-- 4. Habilitar lectura de perfiles para que el Admin pueda ver quién aprobar
DROP POLICY IF EXISTS "Profiles visibles por Admins y el propio usuario" ON public.profiles;
CREATE POLICY "Admins can view all profiles, users view their own" ON public.profiles
FOR SELECT USING (
  auth.uid() = id 
  OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Super Admin'
);

-- Política para que el Admin pueda actualizar el estado de aprobación
CREATE POLICY "Admins can approve profiles" ON public.profiles
FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Super Admin'
);
