import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Mock data for Professional Metrics dashboard
    // In a real implementation, this would query actual measurement data
    const mockData = {
      stats: {
        temperature: {
          avg: 22.5,
          min: 1.2,
          max: 29.8
        },
        salinity: {
          avg: 35.2,
          min: 32.1,
          max: 37.8
        },
        pressure: {
          avg: 125.4,
          min: 5.2,
          max: 2000.6
        }
      },
      timeseries: generateMockTimeSeries()
    }

    return new Response(
      JSON.stringify(mockData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})

function generateMockTimeSeries() {
  const data = []
  const now = new Date()
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Generate realistic oceanographic data with some variation
    const baseTemp = 22 + Math.sin(i * 0.1) * 3 + (Math.random() - 0.5) * 2
    const baseSalinity = 35 + Math.sin(i * 0.08) * 1.5 + (Math.random() - 0.5)
    const basePressure = 125 + Math.sin(i * 0.12) * 50 + (Math.random() - 0.5) * 20
    
    data.push({
      timestamp: date.toISOString(),
      temperature: Math.round(baseTemp * 100) / 100,
      salinity: Math.round(baseSalinity * 100) / 100,
      pressure: Math.round(basePressure * 100) / 100
    })
  }
  
  return data
}