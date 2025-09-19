// supabase/functions/process-query/index.ts

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// --- Tool Definitions ---
// We've added a new tool, "get_example_float_info"
const tools = [
  {
    "function_declarations": [
      {
        "name": "find_warmest_or_coldest_float",
        "description": "Find the float with the highest or lowest surface temperature, returning its details including coordinates.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "condition": { "type": "STRING", "enum": ["warmest", "coldest"] }
          },
          "required": ["condition"]
        }
      },
      {
        "name": "get_example_float_info",
        "description": "Retrieves information for a single, random float to be used as an example in a general informational response.",
        "parameters": { "type": "OBJECT", "properties": {} } // No parameters needed
      }
    ]
  }
];

// --- Tool Logic ---
async function find_warmest_or_coldest_float(supabaseClient, { condition }) {
  // Get surface measurements (pressure < 20) with float details
  const { data, error } = await supabaseClient
    .from("measurements")
    .select(`
      temperature, 
      pressure,
      floats!inner(wmo_id, latitude, longitude, region, last_seen, id)
    `)
    .lt('pressure', 20)
    .not('temperature', 'is', null)
    .order('temperature', { ascending: condition === 'coldest' })
    .limit(1)
    .single();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  
  return {
    id: data.floats.id,
    wmo_id: data.floats.wmo_id,
    temperature: data.temperature,
    pressure: data.pressure,
    latitude: data.floats.latitude,
    longitude: data.floats.longitude,
    region: data.floats.region,
    last_seen: data.floats.last_seen
  };
}

// NEW FUNCTION: Fetches a random float to be used as an example
async function get_example_float_info(supabaseClient) {
    // Get all floats first, then pick a random one
    const { data: allFloats, error: floatsError } = await supabaseClient
        .rpc('get_floats_with_latest_measurements');
    
    if (floatsError) throw new Error(`Supabase error: ${floatsError.message}`);
    if (!allFloats || allFloats.length === 0) throw new Error('No floats available');

    // Pick a random float from the results
    const randomIndex = Math.floor(Math.random() * allFloats.length);
    const randomFloat = allFloats[randomIndex];

    return {
        id: randomFloat.id,
        wmo_id: randomFloat.wmo_id,
        region: randomFloat.region,
        latitude: randomFloat.latitude,
        longitude: randomFloat.longitude,
        temperature: randomFloat.latest_temperature,
        pressure: randomFloat.latest_pressure,
        salinity: randomFloat.latest_salinity,
        last_seen: randomFloat.last_seen
    };
}

// --- Main Request Handler ---
const handler = async (req: Request) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const { query } = await req.json();
        const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
        );

        // UPDATED PROMPT: More conversational and allows for general questions
        const contents = [{
            role: "user",
            parts: [{
                text: `
          You are a friendly and knowledgeable oceanographic AI assistant called FloatChat. 
          Your primary task is to answer the user's question by using your available tools.

          TOOL USAGE RULES:
          - If the user asks for "warmest float" or "coldest float", use the 'find_warmest_or_coldest_float' tool
          - For general questions, use 'get_example_float_info' to fetch a real float as an example
          
          ACTION GENERATION RULES:
          - When you find a specific float (warmest/coldest), ALWAYS include these actions:
            1. MAP_PAN_ZOOM: { "lat": latitude, "lng": longitude, "zoom": 8 }
            2. HIGHLIGHT_FLOAT: { "wmo_id": wmo_id }
          - For general answers with example floats, include the same actions to show the example float
          - If no float is involved, use empty actions array: []

          CRITICAL RESPONSE RULES:
          - You MUST ONLY use the exact data returned by the tools - NEVER make up or invent data
          - Use the exact WMO ID, coordinates, temperature, and other values from the tool results
          - If a tool returns specific data, use that exact data in your response
          - NEVER use placeholder values like "28.2°C" or fake coordinates
          - The map will only highlight floats that actually exist in the database

          REQUIRED JSON Response format:
          {
            "reply": "Your conversational answer using ONLY the exact data from tool results",
            "actions": [
              { "type": "MAP_PAN_ZOOM", "payload": { "lat": [exact_latitude_from_tool], "lng": [exact_longitude_from_tool], "zoom": 8 } },
              { "type": "HIGHLIGHT_FLOAT", "payload": { "wmo_id": [exact_wmo_id_from_tool] } }
            ]
          }

          EXAMPLES WITH EXACT DATA USAGE:
          - Query: "What's the warmest float?" → Use find_warmest_or_coldest_float tool, then reply: "The warmest float is WMO ID {exact_wmo_id} with a temperature of {exact_temperature}°C, located at {exact_latitude}, {exact_longitude} in the {exact_region}."
          - Query: "Tell me about floats" → Use get_example_float_info tool, provide educational answer mentioning: "For example, float WMO ID {exact_wmo_id} is currently recording {exact_temperature}°C at coordinates {exact_latitude}, {exact_longitude}."

          Remember: The user will see the map pan to the exact coordinates you provide, so they MUST match a real float in the database.

          User's Question: "${query}"
        `
            }]
        }];

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;

        let geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents,
                tools,
                "generation_config": { "response_mime_type": "application/json" }
            }),
        });
        if (!geminiResponse.ok) throw new Error(await geminiResponse.text());

        let geminiResult = await geminiResponse.json();
        let modelResponsePart = geminiResult.candidates[0].content.parts[0];

        if (modelResponsePart.functionCall) {
            const functionCall = modelResponsePart.functionCall;
            console.log('=== FUNCTION CALL ===', JSON.stringify(functionCall, null, 2));
            let toolResult;

            // Route to the correct tool logic
            if (functionCall.name === 'find_warmest_or_coldest_float') {
                console.log('Finding warmest/coldest float with condition:', functionCall.args.condition);
                toolResult = await find_warmest_or_coldest_float(supabaseClient, functionCall.args);
                console.log('=== TOOL RESULT (warmest/coldest) ===', JSON.stringify(toolResult, null, 2));
            } else if (functionCall.name === 'get_example_float_info') {
                console.log('Getting example float info');
                toolResult = await get_example_float_info(supabaseClient);
                console.log('=== TOOL RESULT (example) ===', JSON.stringify(toolResult, null, 2));
            } else {
                throw new Error(`Unknown function call: ${functionCall.name}`);
            }

            contents.push(
                { role: "model", parts: [modelResponsePart] },
                { role: "tool", parts: [{ functionResponse: { name: functionCall.name, response: { "result": toolResult } } }] }
            );

            geminiResponse = await fetch(geminiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents,
                    tools,
                    "generation_config": { "response_mime_type": "application/json" }
                }),
            });
            if (!geminiResponse.ok) throw new Error(await geminiResponse.text());
            
            geminiResult = await geminiResponse.json();
            modelResponsePart = geminiResult.candidates[0].content.parts[0];
        }

        const aiResponseJson = JSON.parse(modelResponsePart.text);
        return new Response(JSON.stringify(aiResponseJson), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("--- CRITICAL ERROR IN FUNCTION ---", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500
        });
    }
};

// --- Entry Point ---
serve(handler);