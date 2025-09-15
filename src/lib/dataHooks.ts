import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { DateRange } from 'react-day-picker';

// --- Hook for Main Analytics & Trends ---
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

// --- Hook for Map Floats ---
export interface Float {
  id: number; wmo_id: number; latitude: number; longitude: number;
  last_seen: string | null; region: string | null;
  latest_temperature: number | null; latest_pressure: number | null;
}
const fetchFloats = async (): Promise<Float[]> => {
  const { data, error } = await supabase.rpc('get_floats_with_latest_measurements');
  if (error) throw new Error(error.message);
  return data || [];
};
export const useFloats = () => {
  return useQuery({ queryKey: ['floats'], queryFn: fetchFloats });
};

export interface MetricsData {
  stats: {
    temperature: { avg: number; min: number; max: number };
    salinity: { avg: number; min: number; max: number };
    pressure: { avg: number; min: number; max: number };
    // Add the new metrics
    density: { avg: number; min: number; max: number };
    speed_of_sound: { avg: number; min: number; max: number };
  };
  timeseries: Array<{
    timestamp: string;
    temperature: number;
    salinity: number;
    pressure: number;
    // Add the new metrics
    density: number;
    speed_of_sound: number;
  }>;
}

const fetchMetricsData = async (): Promise<MetricsData> => {
  const { data, error } = await supabase.rpc('get_metrics_data');
  if (error) throw new Error(error.message);

  if (data.timeseries) {
    data.timeseries.reverse();
  }
  return data;
};

export const useMetricsData = () => {
  return useQuery<MetricsData>({ 
    queryKey: ['metrics_data'], 
    queryFn: fetchMetricsData 
  });
};

// --- Updated hook for the Report Generator page with Pagination ---
export interface ReportData {
  timestamp: string | null;
  wmo_id: number;
  region: string;
  latitude: number;
  longitude: number;
  temperature: number;
  salinity: number;
  pressure: number;
}
export interface PaginatedReportResponse {
  data: ReportData[];
  total_count: number;
}
const fetchReportData = async (
  dateRange: DateRange, 
  pagination: { pageIndex: number, pageSize: number }
): Promise<PaginatedReportResponse> => {
  if (!dateRange.from || !dateRange.to) {
    return { data: [], total_count: 0 };
  }
  
  const { data, error } = await supabase.rpc('get_report_data', {
    start_date: dateRange.from.toISOString(),
    end_date: dateRange.to.toISOString(),
    page_index: pagination.pageIndex,
    page_size: pagination.pageSize,
  });

  if (error) throw new Error(error.message);
  return data || { data: [], total_count: 0 };
};
export const useReportData = (
  dateRange: DateRange | undefined,
  pagination: { pageIndex: number, pageSize: number }
) => {
  return useQuery({
    queryKey: ['report_data', dateRange, pagination],
    queryFn: () => fetchReportData(dateRange!, pagination),
    enabled: !!dateRange?.from && !!dateRange?.to,
    keepPreviousData: true,
  });
};

const fetchMarineForecast = async (location: { lat: number; lon: number }): Promise<any> => {
  const { data, error } = await supabase.functions.invoke('get-marine-forecast', {
    body: { lat: location.lat, lon: location.lon },
  });
  if (error) throw new Error(error.message);
  return data;
};

export const useMarineForecast = (location: { lat: number; lon: number } | null) => {
  return useQuery({
    queryKey: ['marine_forecast', location],
    queryFn: () => fetchMarineForecast(location!),
    // Only run the query if a location is selected
    enabled: !!location,
  });
};