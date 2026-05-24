// Database Connect to supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qzfvldovxrdknrqnzjym.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZnZsZG92eHJka25ycW56anltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODU0ODAsImV4cCI6MjA5Mzk2MTQ4MH0.vkqFMoX1d6CriuyxQkwTXb04GcGhOtUJWBPELAxxxuI';

export const supabase = createClient(supabaseUrl, supabaseKey);