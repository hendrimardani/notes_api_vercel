const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://fahmwxazdiuwypqcsslz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaG13eGF6ZGl1d3lwcWNzc2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzOTEzMTYsImV4cCI6MjA1Njk2NzMxNn0.ijpsL4dSFzn3tg9YyStYjXEsRuHlSgsJeWcstM7f-x0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };