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
        "description": "Find the float with the highest or lowest surface temperature among the currently visible floats.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "condition": { "type": "STRING", "enum": ["warmest", "coldest"] },
            "visible_wmo_ids": { "type": "ARRAY", "items": { "type": "NUMBER" } }
          },
          "required": ["condition"]
        }
      },
      {
        "name": "get_example_float_info",
        "description": "Retrieves information for a single, random float from the currently visible set to be used as an example in a general informational response.",
        "parameters": { 
          "type": "OBJECT", 
          "properties": { 
            "visible_wmo_ids": { "type": "ARRAY", "items": { "type": "NUMBER" } }
          } 
        }
      },
      {
        "name": "get_float_by_wmo_id",
        "description": "Get details for a specific float by its WMO ID from the currently visible set.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "wmo_id": { "type": "NUMBER" },
            "visible_wmo_ids": { "type": "ARRAY", "items": { "type": "NUMBER" } }
          },
          "required": ["wmo_id"]
        }
      }
    ]
  }
];

// --- Tool Logic ---
async function find_warmest_or_coldest_float(supabaseClient, { condition, visible_wmo_ids = [] }) {
  // Robust two-step approach to avoid relying on implicit joins
  // 1) (Optional) Map visible WMO IDs -> float IDs
  let visibleFloatIds: number[] | null = null;
  if (Array.isArray(visible_wmo_ids) && visible_wmo_ids.length > 0) {
    const { data: vFloats, error: vErr } = await supabaseClient
      .from('floats')
      .select('id, wmo_id')
      .in('wmo_id', visible_wmo_ids as number[]);
    if (vErr) throw new Error(`Supabase error: ${vErr.message}`);
    visibleFloatIds = (vFloats || []).map((f: any) => f.id);
    if (visibleFloatIds.length === 0) return null;
  }

  // 2) Find the surface measurement with highest/lowest temperature
  let measQuery = supabaseClient
    .from('measurements')
    .select('id, float_id, temperature, pressure')
    .lt('pressure', 20)
    .not('temperature', 'is', null);

  if (visibleFloatIds) {
    measQuery = measQuery.in('float_id', visibleFloatIds);
  }

  const { data: meas, error: measErr } = await measQuery
    .order('temperature', { ascending: condition === 'coldest' })
    .limit(1)
    .maybeSingle();

  if (measErr) throw new Error(`Supabase error: ${measErr.message}`);
  if (!meas) return null;

  // 3) Fetch the corresponding float row to get accurate coordinates/metadata
  const { data: f, error: fErr } = await supabaseClient
    .from('floats')
    .select('id, wmo_id, latitude, longitude, region, last_seen')
    .eq('id', meas.float_id)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .maybeSingle();

  if (fErr) throw new Error(`Supabase error: ${fErr.message}`);
  if (!f) return null;
  
  return {
    id: f.id,
    wmo_id: f.wmo_id,
    temperature: meas.temperature,
    pressure: meas.pressure,
    latitude: f.latitude,
    longitude: f.longitude,
    region: f.region,
    last_seen: f.last_seen
  };
}

// NEW FUNCTION: Fetches a random float to be used as an example
async function get_example_float_info(supabaseClient, { visible_wmo_ids = [] } = {}) {
    // Get all floats with their latest measurements
    const { data: allFloats, error: floatsError } = await supabaseClient
        .rpc('get_floats_with_latest_measurements');
    
    if (floatsError) throw new Error(`Supabase error: ${floatsError.message}`);
    if (!allFloats || allFloats.length === 0) return null;

    // Restrict to visible set if provided
    const candidates = Array.isArray(visible_wmo_ids) && visible_wmo_ids.length > 0
      ? allFloats.filter((f: any) => visible_wmo_ids.includes(f.wmo_id))
      : allFloats;

    if (candidates.length === 0) return null;

    // Pick a random float from the results
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const randomFloat = candidates[randomIndex];

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

// NEW FUNCTION: Get a specific float by WMO ID (restricted to visible set if provided)
async function get_float_by_wmo_id(supabaseClient, { wmo_id, visible_wmo_ids = [] }) {
  if (!wmo_id) return null;
  if (Array.isArray(visible_wmo_ids) && visible_wmo_ids.length > 0 && !visible_wmo_ids.includes(wmo_id)) {
    return null; // Not visible, don't expose
  }

  const { data: floatData, error: floatError } = await supabaseClient
    .from('floats')
    .select('id, wmo_id, latitude, longitude, region, last_seen')
    .eq('wmo_id', wmo_id)
    .maybeSingle();

  if (floatError) throw new Error(`Supabase error: ${floatError.message}`);
  if (!floatData) return null;

  const { data: surf, error: measError } = await supabaseClient
    .from('measurements')
    .select('temperature, pressure')
    .eq('float_id', floatData.id)
    .lt('pressure', 20)
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (measError) throw new Error(`Supabase error: ${measError.message}`);

  return {
    id: floatData.id,
    wmo_id: floatData.wmo_id,
    latitude: floatData.latitude,
    longitude: floatData.longitude,
    region: floatData.region,
    last_seen: floatData.last_seen,
    temperature: surf?.temperature ?? null,
    pressure: surf?.pressure ?? null
  };
}

// --- Main Request Handler ---
const handler = async (req: Request) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const { query, visible_wmo_ids = [] } = await req.json();
        const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
        );

        // Deterministic routing for common intents to ensure exact data and actions
        const norm = (query || '').toLowerCase();
        const visibleList = Array.isArray(visible_wmo_ids) ? visible_wmo_ids : [];
        function buildResponseFromFloat(f: any, intent: 'warmest' | 'coldest' | 'by_wmo_id' | 'example') {
          if (!f) return { reply: "I couldn't find any float matching your request within the current view.", actions: [] };
          const regionText = f?.region ? ` in the ${f.region}` : '';
          let reply = '';
          if (intent === 'warmest' || intent === 'coldest') {
            reply = `The ${intent} float is WMO ID ${f.wmo_id} with a temperature of ${f.temperature}°C, located at ${f.latitude}, ${f.longitude}${regionText}.`;
          } else if (intent === 'by_wmo_id') {
            const tempText = (f?.temperature !== null && f?.temperature !== undefined) ? `, with a surface temperature of ${f.temperature}°C` : '';
            reply = `Float WMO ID ${f.wmo_id} is located at ${f.latitude}, ${f.longitude}${regionText}${tempText}.`;
          } else {
            reply = `For example, float WMO ID ${f.wmo_id} is currently recording ${f.temperature}°C at coordinates ${f.latitude}, ${f.longitude}${regionText}.`;
          }
          const actions = (f?.latitude !== null && f?.longitude !== null)
            ? [
                { type: 'MAP_PAN_ZOOM', payload: { lat: f.latitude, lng: f.longitude, zoom: 8 } },
                { type: 'HIGHLIGHT_FLOAT', payload: { wmo_id: f.wmo_id } }
              ]
            : [];
          return { reply, actions };
        }

        if (/\b(warmest|hottest|highest\s+temp(?:erature)?)\b/.test(norm)) {
          console.log('[Router] Direct warmest route');
          const f = await find_warmest_or_coldest_float(supabaseClient, { condition: 'warmest', visible_wmo_ids: visibleList });
          const res = buildResponseFromFloat(f, 'warmest');
          return new Response(JSON.stringify(res), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
        }
        if (/\b(coldest|coolest|lowest\s+temp(?:erature)?)\b/.test(norm)) {
          console.log('[Router] Direct coldest route');
          const f = await find_warmest_or_coldest_float(supabaseClient, { condition: 'coldest', visible_wmo_ids: visibleList });
          const res = buildResponseFromFloat(f, 'coldest');
          return new Response(JSON.stringify(res), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
        }
        const wmoMatch = (query || '').match(/\b\d{5,9}\b/);
        if (wmoMatch) {
          const wmo_id = parseInt(wmoMatch[0], 10);
          console.log('[Router] Direct by WMO route', wmo_id);
          const f = await get_float_by_wmo_id(supabaseClient, { wmo_id, visible_wmo_ids: visibleList });
          const res = buildResponseFromFloat(f, 'by_wmo_id');
          return new Response(JSON.stringify(res), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
        }

        // UPDATED PROMPT: More conversational and allows for general questions
        const contents = [{
            role: "user",
            parts: [{
                text: `
          You are a friendly and knowledgeable oceanographic AI assistant called FloatChat. 
          Your primary task is to answer the user's question by using your available tools.

          TOOL USAGE RULES:
          - If the user asks for "warmest float" or "coldest float", use the 'find_warmest_or_coldest_float' tool
          - For general questions, you may use 'get_example_float_info' to fetch a real float as an example
          
          VISIBLE FLOATS SCOPE:
          - Only consider floats whose WMO IDs are in this list: ${JSON.stringify(visible_wmo_ids)}
          - When calling any tool, pass the argument visible_wmo_ids: ${JSON.stringify(visible_wmo_ids)}
          
          ACTION GENERATION RULES:
          - When you mention a specific float (warmest/coldest or by ID), ALWAYS include these actions:
            1. MAP_PAN_ZOOM: { "lat": latitude, "lng": longitude, "zoom": 8 }
            2. HIGHLIGHT_FLOAT: { "wmo_id": wmo_id }
          - For general answers that DO NOT reference a specific float, return actions: []

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
        let lastFunctionName = null;
        let lastToolResult = null;
        let lastFunctionArgs: any = null;

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
                toolResult = await get_example_float_info(supabaseClient, functionCall.args);
                console.log('=== TOOL RESULT (example) ===', JSON.stringify(toolResult, null, 2));
            } else if (functionCall.name === 'get_float_by_wmo_id') {
                console.log('Getting float by WMO ID:', functionCall.args.wmo_id);
                toolResult = await get_float_by_wmo_id(supabaseClient, functionCall.args);
                console.log('=== TOOL RESULT (by_wmo_id) ===', JSON.stringify(toolResult, null, 2));
            } else {
                throw new Error(`Unknown function call: ${functionCall.name}`);
            }

            // Keep track of the last tool invocation so we can construct a precise response
            lastFunctionName = functionCall.name;
            lastFunctionArgs = functionCall.args;
            lastToolResult = toolResult;

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

        let aiResponseJson;
        if (lastToolResult) {
            const f = lastToolResult;
            const regionText = f?.region ? ` in the ${f.region}` : '';
            let reply = '';
            if (lastFunctionName === 'find_warmest_or_coldest_float') {
                const cond = (lastFunctionArgs?.condition === 'coldest') ? 'coldest' : 'warmest';
                reply = `The ${cond} float is WMO ID ${f.wmo_id} with a temperature of ${f.temperature}°C, located at ${f.latitude}, ${f.longitude}${regionText}.`;
            } else if (lastFunctionName === 'get_example_float_info') {
                reply = `For example, float WMO ID ${f.wmo_id} is currently recording ${f.temperature}°C at coordinates ${f.latitude}, ${f.longitude}${regionText}.`;
            } else if (lastFunctionName === 'get_float_by_wmo_id') {
                const tempText = (f?.temperature !== null && f?.temperature !== undefined) ? `, with a surface temperature of ${f.temperature}°C` : '';
                reply = `Float WMO ID ${f.wmo_id} is located at ${f.latitude}, ${f.longitude}${regionText}${tempText}.`;
            } else {
                // Fallback to model response if we don't recognize the tool
                reply = JSON.parse(modelResponsePart.text).reply ?? 'Here are the details.';
            }
            const actions = (f?.latitude !== null && f?.longitude !== null) ? [
                { type: 'MAP_PAN_ZOOM', payload: { lat: f.latitude, lng: f.longitude, zoom: 8 } },
                { type: 'HIGHLIGHT_FLOAT', payload: { wmo_id: f.wmo_id } }
            ] : [];
            aiResponseJson = { reply, actions };
        } else {
            aiResponseJson = JSON.parse(modelResponsePart.text);
        }
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