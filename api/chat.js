const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function (req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
    
    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
