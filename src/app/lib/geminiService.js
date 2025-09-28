import { GoogleGenAI, Type } from "@google/genai";

// NOTE: This will run on the server, so process.env.API_KEY is secure.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function createSystemInstruction(userProfile) {
    if (!userProfile || !userProfile.hasAnsweredOnboarding) {
        return "You are a helpful and friendly AI development assistant designed to help users with API integration.";
    }

    const { projectType, techStack, experience } = userProfile;
    const parts = ["You are an expert AI development assistant."];

    if (projectType) parts.push(`The user is building a ${projectType}.`);
    if (techStack && techStack.length > 0) parts.push(`Their primary tech stack is ${techStack.join(', ')}. Tailor all code examples and technical explanations to this stack.`);
    if (experience) parts.push(`The user has a ${experience} experience level. Adjust the complexity of your answers accordingly. For beginners, be more verbose and explain concepts simply. For experts, be concise and direct.`);
    
    parts.push("When answering, be helpful, provide clear explanations, and format code examples in markdown code blocks.");
    return parts.join(' ');
}


export async function getChatResponse(prompt, userProfile) {
  try {
    const systemInstruction = createSystemInstruction(userProfile);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Error calling Gemini API");
  }
}

export async function isQuestionRelevant(question, apiDoc) {
  if (!apiDoc) {
    return true;
  }
  try {
    const docString = JSON.stringify(apiDoc);
    const prompt = `Analyze the user's question in relation to the provided API documentation and determine if it is relevant. The question is relevant if it pertains to the API's functionality, endpoints, authentication, parameters, usage, or concepts described in the documentation.

API DOCUMENTATION:
\`\`\`json
${docString}
\`\`\`

USER QUESTION:
"${question}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_relevant: {
              type: Type.BOOLEAN,
              description: 'Whether the question is relevant to the API documentation.',
            },
          },
          required: ['is_relevant'],
        },
        temperature: 0,
      }
    });
    
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse.is_relevant;
  } catch (error) {
    console.error("Error checking question relevance:", error);
    return true;
  }
}
