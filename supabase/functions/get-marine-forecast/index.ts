// supabase/functions/get-marine-forecast/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function processWeatherData(apiData) {
  const dailyForecasts = {};
  
  for (const item of apiData.list) {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        temps: [],
        winds: [], // Array to hold wind speeds for the day
        weathers: [],
        humidities: [], // Array for humidity
      };
    }
    dailyForecasts[date].temps.push(item.main.temp);
    dailyForecasts[date].winds.push(item.wind.speed); // Capture wind speed
    dailyForecasts[date].humidities.push(item.main.humidity); // Capture humidity

    if (new Date(item.dt * 1000).getHours() >= 12) {
        dailyForecasts[date].weathers.push(item.weather[0]);
    }
  }

  const daily = Object.keys(dailyForecasts).slice(0, 5).map(date => {
    const dayData = dailyForecasts[date];
    const weather = dayData.weathers[dayData.weathers.length - 1] || dayData.weathers[0] || {};
    return {
      dt: new Date(date).getTime() / 1000,
      temp: {
        min: Math.min(...dayData.temps),
        max: Math.max(...dayData.temps)
      },
      weather: [weather],
      // Calculate the average wind speed for the day
      wind_speed: dayData.winds.reduce((a, b) => a + b, 0) / dayData.winds.length,
      // Calculate the average humidity for the day
      humidity: Math.round(dayData.humidities.reduce((a, b) => a + b, 0) / dayData.humidities.length),
    };
  });

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
  // ... (The rest of the function remains the same)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { lat, lon } = await req.json();
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
    if (!apiKey) throw new Error("Server-side error: OPENWEATHER_API_KEY is not set.");
    if (lat === undefined || lon === undefined) throw new Error("Latitude or longitude not provided.");
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherResponse = await fetch(apiUrl);
    if (!weatherResponse.ok) {
      const errorBody = await weatherResponse.json();
      throw new Error(`OpenWeatherMap API Error: ${errorBody.message}`);
    }
    const rawWeatherData = await weatherResponse.json();
    const processedData = processWeatherData(rawWeatherData);
    return new Response(JSON.stringify(processedData), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});