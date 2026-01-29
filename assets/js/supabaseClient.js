import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 🔵 AUTH (login)
export const auth = createClient(
    'https://login.papelerapierrastegui.com.ar',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrcHRjbnhnZXRydm1ibHBodWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzQ2ODMsImV4cCI6MjA3NjMxMDY4M30.IIJjxPA6vzZDaxwYnRhgERdCi-G-CG0-3y1EIlYL7v4'
);

// 🟢 PRODUCTOS (catálogo)
export const db = createClient(
    'https://cdnstatic.papelerapierrastegui.com.ar',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vYWNnendydmVncG9hdHdqcXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyOTM5MDQsImV4cCI6MjA4NDg2OTkwNH0.WGzWhO1KYKTXKLaIXIpE1OLs6o4BJK-Q4JLK_RPZkGM'
);