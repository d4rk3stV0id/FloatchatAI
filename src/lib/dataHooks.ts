// lib/dataHooks.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

// --- This is the only hook you'll need for your analytics pages ---
export interface DashboardAnalytics {
  global_avg_temp?: number;
  global_avg_salinity?: number;
  active_float_count?: number;
  temp_trend?: number;
  depth_profile?: Array<{ depth_range: string; avg_temp: number }>;
  seasonal_pattern?: Array<{ month: string; avg_temp: number }>;
  regional_temps?: Array<{ region: string; avg_temp: number }>;
}

const fetchDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
  const { data, error } = await supabase.rpc('get_dashboard_analytics');
  if (error) throw new Error(error.message);
  return data || {};
};

export const useDashboardAnalytics = () => {
  return useQuery<DashboardAnalytics>({ 
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

// --- New hook for Professional Metrics dashboard ---
export interface MetricsData {
  stats: {
    temperature: { avg: number; min: number; max: number };
    salinity: { avg: number; min: number; max: number };
    pressure: { avg: number; min: number; max: number };
  };
  timeseries: Array<{
    timestamp: string;
    temperature: number;
    salinity: number;
    pressure: number;
  }>;
}

const fetchMetricsData = async (): Promise<MetricsData> => {
  const { data, error } = await supabase.rpc('get_metrics_data');
  if (error) throw new Error(error.message);
  return data || {
    stats: {
      temperature: { avg: 22.5, min: 18.2, max: 28.3 },
      salinity: { avg: 35.2, min: 32.1, max: 37.8 },
      pressure: { avg: 125.4, min: 5.2, max: 245.6 }
    },
    timeseries: []
  };
};

export const useMetricsData = () => {
  return useQuery<MetricsData>({ 
    queryKey: ['metrics_data'], 
    queryFn: fetchMetricsData 
  });
};