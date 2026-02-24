import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, AIAnalysis, GameState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateScenario(gameState: GameState): Promise<Scenario> {
  const prompt = `
    Generate a realistic poverty simulation scenario for a B40 (Bottom 40% income group) household in Malaysia.
    Current Game State:
    - Day: ${gameState.day}
    - Money: RM${gameState.money}
    - Debt: RM${gameState.debt}
    - Stress Level: ${gameState.stress}/100
    - Opportunity Level: ${gameState.opportunity}/100

    The scenario should be culturally relevant to Malaysia (mentioning Ringgit RM, local food, public transport like LRT/RapidKL, government hospitals, or school expenses).
    Provide 2-3 choices with realistic financial and emotional consequences.
    IMPORTANT: Write everything entirely in English. Do not use any Bahasa Malaysia words or phrases.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['health', 'education', 'work', 'family', 'unexpected'] },
          choices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                consequence: { type: Type.STRING },
                impact: {
                  type: Type.OBJECT,
                  properties: {
                    money: { type: Type.NUMBER },
                    stress: { type: Type.NUMBER },
                    opportunity: { type: Type.NUMBER },
                    debt: { type: Type.NUMBER },
                  }
                }
              },
              required: ["text", "consequence", "impact"]
            }
          }
        },
        required: ["title", "description", "category", "choices"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as Scenario;
}

export async function analyzeGame(gameState: GameState): Promise<AIAnalysis> {
  const prompt = `
    Analyze the following 30-day poverty simulation results for a B40 household in Malaysia.
    Final Stats:
    - Money: RM${gameState.money}
    - Debt: RM${gameState.debt}
    - Stress: ${gameState.stress}/100
    - Opportunity: ${gameState.opportunity}/100
    
    History of choices:
    ${gameState.history.map(h => `Day ${h.day}: ${h.scenario} -> Chose: ${h.choice} -> Result: ${h.consequence}`).join('\n')}

    Provide a deep analysis of how poverty cycles form based on these choices. 
    Explain the structural challenges in Malaysia (e.g., stagnant wages, rising cost of living, lack of social safety nets).
    Be empathetic but educational.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          structuralInsights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          povertyCycleExplanation: { type: Type.STRING }
        },
        required: ["summary", "structuralInsights", "povertyCycleExplanation"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as AIAnalysis;
}
