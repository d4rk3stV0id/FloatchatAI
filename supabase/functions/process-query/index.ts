import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const tools = [
  {
    "function_declarations": [
      {
        "name": "get_location_details",
        "description": "Get the country and ocean/sea name for a specific latitude and longitude.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "latitude": { "type": "NUMBER" },
            "longitude": { "type": "NUMBER" },
          },
          "required": ["latitude", "longitude"]
        }
      }
    ]
  }
];

async function get_location_details({ latitude, longitude }: { latitude: number, longitude: number }) {
  console.log(`Getting location details for: ${latitude}, ${longitude}`);
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    if (!response.ok) throw new Error("Reverse geocoding API failed");
    const data = await response.json();
    return { "ocean": data.principalSubdivision, "countryName": data.countryName };
  } catch (error) {
    return { "error": `Could not determine location: ${error.message}` };
  }
}

serve(async (req) => {
  console.log("Function invoked.");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { query } = await req.json();
    console.log(`Received query: "${query}"`);

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) throw new Error("GEMINI_API_KEY secret not set in Supabase.");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    console.log("Fetching ARGO data from Supabase...");
    const { data: measurements, error } = await supabaseClient
      .from("measurements")
      .select(`*, floats ( wmo_id, latitude, longitude )`);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    console.log("Successfully fetched ARGO data.");

    const contents = [{
      role: "user",
      parts: [{ text: `
        You are an expert oceanographic AI assistant. Your task is to answer the user's question based on the provided ARGO float data.
        If you need to know the name of an ocean or country for a given coordinate, use your tools.
        Current ARGO Data: ${JSON.stringify(measurements, null, 2)}
        User's Question: "${query}"
      `}]
    }];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${geminiApiKey}`;
    
    console.log("Making first call to Gemini...");
    let geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, tools }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      throw new Error(`Gemini API Error (1st call): ${errorBody}`);
    }
    console.log("First Gemini call successful.");
    
    let geminiResult = await geminiResponse.json();
    let modelResponsePart = geminiResult.candidates[0].content.parts[0];

    if (modelResponsePart.functionCall) {
      console.log("Gemini requested a tool call:", modelResponsePart.functionCall.name);
      const functionCall = modelResponsePart.functionCall;
      
      const toolResult = await get_location_details(functionCall.args);
      console.log("Tool call result:", toolResult);

      contents.push({ role: "model", parts: [modelResponsePart] });
      contents.push({
          role: "tool",
          parts: [{ functionResponse: { name: functionCall.name, response: toolResult } }]
      });

      console.log("Making second call to Gemini with tool result...");
      geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, tools }),
      });

      if (!geminiResponse.ok) {
        const errorBody = await geminiResponse.text();
        throw new Error(`Gemini API Error (2nd call): ${errorBody}`);
      }
      console.log("Second Gemini call successful.");

      geminiResult = await geminiResponse.json();
      modelResponsePart = geminiResult.candidates[0].content.parts[0];
    }

    const aiResponseText = modelResponsePart.text;
    console.log("Sending final reply:", aiResponseText);

    return new Response(JSON.stringify({ reply: aiResponseText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Critical error in function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

