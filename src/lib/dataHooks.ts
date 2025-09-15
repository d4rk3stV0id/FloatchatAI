// lib/dataHooks.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

// --- This is the only hook you'll need for your analytics pages ---
const fetchDashboardAnalytics = async () => {
  const { data, error } = await supabase.rpc('get_dashboard_analytics');
  if (error) throw new Error(error.message);
  return data;
};

export const useDashboardAnalytics = () => {
  return useQuery({ 
    queryKey: ['dashboard_analytics'], 
    queryFn: fetchDashboardAnalytics 
  });
};


// --- Your hook for the map remains the same ---
export interface Float {
  id: number;
  wmo_id: number;
  latitude: number;
  longitude: number;
  last_seen: string | null;
  region: string | null;
  latest_temperature: number | null;
  latest_pressure: number | null;
}

const fetchFloats = async (): Promise<Float[]> => {
  const { data, error } = await supabase.rpc('get_floats_with_latest_measurements');
  if (error) throw new Error(error.message);
  return data || [];
};

export const useFloats = () => {
  return useQuery({ queryKey: ['floats'], queryFn: fetchFloats });
};