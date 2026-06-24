import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

import 'dotenv/config'; // Cargar variables de entorno del archivo .env


import { GoogleGenerativeAI } from '@google/generative-ai';

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env['GEMINI_API_KEY'] || '');
    const systemInstruction = `Eres Nexus AI, un asistente experto cinéfilo y crítico de cine en la plataforma MovieNexus.
Tus respuestas deben ser estructuradas en formato JSON estricto.
Estructura del JSON:
{
  "text": "Tu respuesta enriquecida en formato Markdown aquí (usa negritas, listas, cursivas). No uses HTML.",
  "suggestedMovies": ["Título Exacto Película 1", "Título Exacto Película 2"]
}
El arreglo "suggestedMovies" debe contener los nombres exactos de las películas mencionadas o recomendadas en tu respuesta, máximo 3 películas. Si no hay recomendaciones, devuelve un arreglo vacío [].
Responde de manera entusiasta y amigable.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction
    });
    const { history, message } = req.body;

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    return res.status(200).json(JSON.parse(cleanText));
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
