import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const MAX_CONTEXT_LENGTH = 100000; // Character limit for the context

let ai = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength);
};

export const answerWithRAG = async (query, context) => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. Check API Key.");
  }

  const truncatedContext = truncateText(context, MAX_CONTEXT_LENGTH);

  const systemInstruction = `You are an expert medical chatbot. Your purpose is to answer questions based *only* on the provided text from a medical document.
    - Analyze the following context carefully.
    - Answer the user's question using only the information found within the provided context.
    - Do not use any external knowledge or make assumptions.
    - If the answer to the question cannot be found in the provided context, you must explicitly state: "I could not find an answer to that question in the provided document."
    - Be concise and direct in your response.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `CONTEXT:\n---\n${truncatedContext}\n---\n\nQUESTION: ${query}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.1, // Lower temperature for more factual, less creative answers
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    if (error instanceof Error) {
      return `An error occurred while communicating with the AI model: ${error.message}`;
    }
    return "An unknown error occurred while communicating with the AI model.";
  }
};
