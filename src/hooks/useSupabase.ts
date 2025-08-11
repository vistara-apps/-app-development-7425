import { useState, useEffect } from 'react';

export const useSupabase = () => {
  const [initialized, setInitialized] = useState(true);

  useEffect(() => {
    // For this demo, we'll use localStorage instead of Supabase
    // In production, you would initialize Supabase client here
    setInitialized(true);
  }, []);

  return { initialized };
};