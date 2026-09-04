import { createClient } from "@supabase/supabase-js";

// Remplacez ces deux valeurs par celles de VOTRE projet Supabase
// (Dashboard Supabase -> Project Settings -> API)
const supabaseUrl = "https://epszxrktalpvklfvhqnk.supabase.co/rest/v1/";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p4cmt0YWxwdmtsZnZocW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjE4NjksImV4cCI6MjEwNDAzNzg2OX0.61CtzTiyalDLJ8BvrRYTzOVob358rU4mcjPXGOREKyI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Nom du bucket de stockage à créer dans Supabase (Storage -> New bucket)
export const SONGS_BUCKET = "songs";
