import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, AIAnalysis, GameState } from "../types";
import { PERSONAS, MAX_DAYS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateScenario(gameState: GameState): Promise<Scenario> {
  const persona = PERSONAS[gameState.persona];
  const historySummary = gameState.history.length > 0 
    ? gameState.history.map(h => `Day ${h.day}: ${h.scenario} -> ${h.choice} (${h.consequence})`).join('\n')
    : "No history yet.";

  const prompt = `
    Generate a realistic poverty simulation scenario for a B40 (Bottom 40% income group) household in Malaysia.
    
    Current Persona: ${persona.name}
    Persona Description: ${persona.description}
    Persona Passive Ability: ${persona.passiveAbility}

    Current Game State:
    - Day: ${gameState.day} of ${MAX_DAYS}
    - Money: RM${gameState.money}
    - Debt: RM${gameState.debt}
    - Stress Level: ${gameState.stress}/100
    - Active Loans: ${gameState.loans.length > 0 ? gameState.loans.map(l => `${l.type} (RM${l.remainingAmount} left)`).join(', ') : 'None'}

    Game History:
    ${historySummary}

    CRITICAL INSTRUCTIONS:
    1. The scenario MUST be tailored to the persona's background.
    2. DO NOT repeat scenarios or themes already present in the Game History.
    3. The scenario SHOULD feel like a consequence or continuation of previous choices if applicable.
    4. The scenario should be culturally relevant to Malaysia.
    5. Provide 2-3 choices with realistic financial and emotional consequences.
    6. If category is 'loan', offer specific borrowing options as instructed by the system rules.
    7. If category is 'debt_consequence', generate a scenario related to debt collectors, threats, or being blacklisted.
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
          category: { type: Type.STRING, enum: ['health', 'education', 'work', 'family', 'unexpected', 'loan', 'debt_consequence'] },
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
    Analyze the following ${MAX_DAYS}-day poverty simulation results for a B40 household in Malaysia.
    Persona: ${PERSONAS[gameState.persona].name}
    
    Final Stats:
    - Money: RM${gameState.money}
    - Debt: RM${gameState.debt}
    - Stress: ${gameState.stress}/100
    - Active Loans: ${gameState.loans.length}
    
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
