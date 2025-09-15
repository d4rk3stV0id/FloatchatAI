import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to process the complex API response into a simple format
function processWeatherData(apiData) {
  const dailyForecasts = {};
  
  // Group 3-hour forecasts by day
  for (const item of apiData.list) {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        temps: [],
        weathers: []
      };
    }
    dailyForecasts[date].temps.push(item.main.temp);
    // Store the weather from midday for the daily icon
    if (new Date(item.dt * 1000).getHours() >= 12) {
        dailyForecasts[date].weathers.push(item.weather[0]);
    }
  }

  // Create a clean daily forecast array
  const daily = Object.keys(dailyForecasts).slice(0, 5).map(date => {
    const dayData = dailyForecasts[date];
    const weather = dayData.weathers[dayData.weathers.length - 1] || dayData.weathers[0] || {};
    return {
      dt: new Date(date).getTime() / 1000,
      temp: {
        min: Math.min(...dayData.temps),
        max: Math.max(...dayData.temps)
      },
      weather: [weather]
    };
  });

  // Structure the final response
  return {
    current: {
      temp: apiData.list[0].main.temp,
      wind_speed: apiData.list[0].wind.speed,
      sunrise: apiData.city.sunrise,
      sunset: apiData.city.sunset
    },
    daily: daily,
  };
}


serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { lat, lon } = await req.json();
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");

    if (!apiKey) throw new Error("Server-side error: OPENWEATHER_API_KEY is not set.");
    if (lat === undefined || lon === undefined) throw new Error("Latitude or longitude not provided.");

    // Use the free-tier compatible 2.5 forecast endpoint
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    const weatherResponse = await fetch(apiUrl);
    if (!weatherResponse.ok) {
      const errorBody = await weatherResponse.json();
      throw new Error(`OpenWeatherMap API Error: ${errorBody.message}`);
    }

    const rawWeatherData = await weatherResponse.json();
    // Process the raw data into our clean format
    const processedData = processWeatherData(rawWeatherData);

    return new Response(JSON.stringify(processedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});