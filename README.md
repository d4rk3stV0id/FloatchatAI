# FloatChat 🌊💬

**Navigate the ocean's depths with a simple conversation. FloatChat is an AI-powered conversational interface for ARGO oceanographic data discovery and visualization.**

*This project was developed as a proof-of-concept during a 24-hour hackathon.*

![FloatChat Demo GIF](https://your-link-to-a-demo-gif-or-image.com/demo.gif)
*(Recommendation: Add a GIF here showing the app in action!)*

---

## 🚀 Mission

Vast and complex ocean data from the global **ARGO float network** is largely inaccessible to non-experts. FloatChat bridges this gap by replacing steep learning curves and technical barriers with an intuitive, AI-driven chat experience. Our mission is to democratize access to ocean science, enabling anyone to discover, visualize, and understand ocean phenomena through natural language.

This proof-of-concept focuses on the **Indian Ocean region**.

---

## ✨ Key Features

* 🧠 **AI as a Smart Router:** At its core, FloatChat uses Google's Gemini 1.5 Pro with **Function Calling**. The AI doesn't just generate text; it intelligently interprets user intent and orchestrates backend services, creating a seamless and powerful interaction between the chatbot and the map.

* 🌊 **AI Dive Mode:** Go beyond static charts. FloatChat tells data stories by animating a float's predicted future path, dynamically highlighting ocean anomalies like heatwaves, and enriching the experience with contextually relevant external data.

* 💬 **Conversational Data Discovery:** No SQL or Python skills needed. Users can simply ask questions like, *"Compare the salinity profiles of float X and float Y,"* and get instant, interactive visualizations.

---

## 💡 How It Works: The "AI as a Smart Router" Architecture

FloatChat's power comes from a modern AI architecture that is more robust and reliable than traditional Text-to-SQL systems.

1.  **User Query:** A user asks a question in the chat interface (e.g., "Show me the predicted path for float `12345`").
2.  **Intent Recognition:** The query is sent to a backend Supabase Edge Function. Gemini 1.5 Pro receives the query along with a list of available "tools" (pre-defined TypeScript functions).
3.  **Function Calling:** Gemini determines the user's intent is to see a path and decides to call the `getPredictedPath(floatId: '12345')` function.
4.  **Data Execution:** The backend executes this specific, pre-defined function, which reads from our static dataset to get the path coordinates.
5.  **Structured Response:** The function returns a single, structured JSON object containing a text summary, map data for animation, and any required graph data.
6.  **Dynamic UI Update:** The React frontend receives this JSON and updates all relevant components—the chat, the map, and the data visualization panel—in a single, synchronized action.

![Architecture Diagram](https://your-link-to-an-architecture-diagram.com/arch.png)
*(Recommendation: Add a simple architecture diagram here.)*

---

## 🛠️ Technology Stack

* **Frontend:** React (Vite), TypeScript
* **Backend:** Supabase Edge Functions (Deno/TypeScript)
* **Database:** Supabase (PostgreSQL for metadata, Storage for data files)
* **Language Model:** Google Gemini 1.5 Pro (for Function Calling)
* **State Management:** Zustand
* **Mapping:** React-Leaflet
* **Visualization:** Plotly.js

---

## 🏃‍♂️ Hackathon Proof-of-Concept

To deliver a polished and functional demo within a 24-hour timeframe, we adopted a "Simulate and Showcase" strategy:

* **Static Data:** We are using a recent, static snapshot of ARGO NetCDF data instead of a live pipeline.
* **Simulated Forecast:** The float path prediction is based on a pre-computed ocean forecast file, simulating the output of a complex 4D prediction model.

---

## 🔮 Future Vision

This hackathon project is the first step. Our long-term goal is to transition FloatChat into a production-grade application by:

1.  **Implementing a Live Data Pipeline:** Automatically ingest and process the latest ARGO and atmospheric data.
2.  **Developing a Real 4D Ocean Prediction Model:** Replace the simulated forecast with a genuine, in-house trained Spatio-Temporal AI model for real-time predictions.

---

## ⚙️ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/float-chat.git](https://github.com/your-username/float-chat.git)
    cd float-chat
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file and add your Supabase and Google Gemini API keys.
    ```
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 👥 Team

* [Dhanush P](https://github.com/dhanush4u2)
* [Lakshay Sharma](https://github.com/BugZero42)
* [Lochan](https://github.com/d4rk3stV0id)