// lib/dataHooks.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

// Update the Float type to include the latest measurement data
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

// Update fetchFloats to use the new, more efficient database function
const fetchFloats = async (): Promise<Float[]> => {
  const { data, error } = await supabase.rpc('get_floats_with_latest_measurements');
  if (error) throw new Error(error.message);
  return data || [];
};

export const useFloats = () => {
  return useQuery({ queryKey: ['floats'], queryFn: fetchFloats });
};


// --- The rest of your hooks (useSummaryStats, etc.) remain the same ---

// Fetch Summary Statistics
const fetchSummaryStats = async () => {
  const { data, error } = await supabase.rpc('get_summary_stats');
  if (error) throw new Error(error.message);
  return data[0];
};

export const useSummaryStats = () => {
  return useQuery({
    queryKey: ['summary_stats'],
    queryFn: fetchSummaryStats
  });
};

// Fetch Regional Temperature Averages
const fetchRegionalTemps = async () => {
  const { data, error } = await supabase.rpc('get_regional_avg_temp');
  if (error) throw new Error(error.message);
  return data;
};

export const useRegionalTemps = () => {
  return useQuery({
    queryKey: ['regional_temps'],
    queryFn: fetchRegionalTemps
  });
};

// Fetch Active Float Count
const fetchActiveFloatCount = async () => {
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
    const { count, error } = await supabase
        .from('floats')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', thirtyDaysAgo);

    if (error) throw new Error(error.message);
    return count || 0;
};

export const useActiveFloatCount = () => {
    return useQuery({
        queryKey: ['active_float_count'],
        queryFn: fetchActiveFloatCount
    });
};