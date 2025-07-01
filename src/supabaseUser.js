import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://diiwncuuhtufroxygjwm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaXduY3V1aHR1ZnJveHlnandtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTE0MTgsImV4cCI6MjA2NTc4NzQxOH0.i0Wm8mbXImlzKmJjqACkpch91cVvtttQ_O9oPC0H98A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);