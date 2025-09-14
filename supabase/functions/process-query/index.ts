import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

// Handle CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) throw new Error("GEMINI_API_KEY is not set.");
    
    // Connect to Supabase to get data
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Fetch all measurements to use as context for the AI
    // --- FIX: Added latitude and longitude to the selection from the related floats table ---
    const { data: measurements, error } = await supabaseClient
      .from("measurements")
      .select(`
        depth,
        temperature,
        salinity,
        pressure,
        conductivity,
        floats ( wmo_id, latitude, longitude )
      `);

    if (error) throw error;

    // Construct a simple, direct prompt
    const prompt = `
      You are an expert oceanographic AI assistant called FloatChat. 
      Your task is to answer the user's question based *only* on the provided real-time ARGO float data.
      Be concise, helpful, and do not ask for historical data. If you cannot answer from the data, say so.

      Here is the complete dataset available to you:
      ${JSON.stringify(measurements, null, 2)}

      User's question: "${query}"

      Your answer:
    `;

    // Make a single, simple call to the Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      throw new Error(`Gemini API Error: ${errorBody}`);
    }

    const geminiResult = await geminiResponse.json();

    if (!geminiResult.candidates || geminiResult.candidates.length === 0) {
      throw new Error("No response from Gemini.");
    }

    const aiResponseText = geminiResult.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ reply: aiResponseText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

