import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
    'https://pkptcnxgetrvmblphucg.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrcHRjbnhnZXRydm1ibHBodWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzQ2ODMsImV4cCI6MjA3NjMxMDY4M30.IIJjxPA6vzZDaxwYnRhgERdCi-G-CG0-3y1EIlYL7v4'
);

console.log("✅ Supabase conectado");

// Debug global
window.supabase = supabase;