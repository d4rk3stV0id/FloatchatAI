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
  const { data, error } = await supabaseClient
    .from("measurements")
    .select(`temperature, floats!inner(wmo_id, latitude, longitude)`)
    .lt('pressure', 20) // Use pressure for surface readings
    .order('temperature', { ascending: condition === 'coldest' })
    .limit(1)
    .single();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  
  return {
    wmo_id: data.floats.wmo_id,
    temperature: data.temperature,
    latitude: data.floats.latitude,
    longitude: data.floats.longitude
  };
}

// NEW FUNCTION: Fetches a random float to be used as an example
async function get_example_float_info(supabaseClient) {
    const { data, error } = await supabaseClient
        .rpc('get_floats_with_latest_measurements') // Use our existing powerful function
        .order('random()') // A simple way to get a random row in Postgres
        .limit(1)
        .single();
    
    if (error) throw new Error(`Supabase error: ${error.message}`);

    return {
        wmo_id: data.wmo_id,
        region: data.region,
        temperature: data.latest_temperature
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

          REQUIRED JSON Response format:
          {
            "reply": "Your conversational answer including float details",
            "actions": [
              { "type": "MAP_PAN_ZOOM", "payload": { "lat": number, "lng": number, "zoom": 8 } },
              { "type": "HIGHLIGHT_FLOAT", "payload": { "wmo_id": number } }
            ]
          }

          EXAMPLES:
          - Query: "What's the warmest float?" → Use find_warmest_or_coldest_float tool, then return reply with float details + MAP_PAN_ZOOM and HIGHLIGHT_FLOAT actions
          - Query: "Tell me about floats" → Use get_example_float_info tool, provide educational answer with example + MAP_PAN_ZOOM and HIGHLIGHT_FLOAT actions

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
            let toolResult;

            // Route to the correct tool logic
            if (functionCall.name === 'find_warmest_or_coldest_float') {
                toolResult = await find_warmest_or_coldest_float(supabaseClient, functionCall.args);
            } else if (functionCall.name === 'get_example_float_info') {
                toolResult = await get_example_float_info(supabaseClient);
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