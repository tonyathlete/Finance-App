
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SurveyData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallVulnerability: {
      type: Type.STRING,
      description: "Évaluation globale de la vulnérabilité.",
    },
    score: {
      type: Type.NUMBER,
      description: "Score de vulnérabilité entre 0 et 100.",
    },
    zone: {
      type: Type.STRING,
      description: "Une seule valeur parmis: Green, Yellow, Red.",
    },
    mainRisks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Liste des 3 principaux risques détectés.",
    },
    priorityRisk: {
      type: Type.STRING,
      description: "Le risque prioritaire absolu.",
    },
    summary: {
      type: Type.STRING,
      description: "Résumé pédagogique et neutre incluant l'analyse de retraite.",
    },
    invitation: {
      type: Type.STRING,
      description: "Message de conclusion concernant le suivi.",
    },
  },
  required: ["overallVulnerability", "score", "zone", "mainRisks", "priorityRisk", "summary", "invitation"],
};

export async function analyzeFinancialVulnerability(data: SurveyData): Promise<AnalysisResult> {
  const nameContext = data.leadInfo ? `Le participant s'appelle ${data.leadInfo.firstName}.` : "";
  
  const prompt = `
    Agis comme un analyste en vulnérabilité financière et expert en planification de retraite pour des particuliers au Canada.
    ${nameContext}
    
    Données du participant :
    - Âge actuel: ${data.age} ans
    - Revenu: ${data.incomeRange}
    - Emploi: ${data.employmentStatus}
    - Fonds d'urgence: ${data.emergencyFund}
    - Dettes: ${data.debtLevel}
    - Logement: ${data.housingCost}
    
    DONNÉES RETRAITE :
    - Épargne actuelle cumulée: ${data.retirementSavings}
    - Âge visé de retraite: ${data.retirementAgeGoal} ans
    - Taux d'épargne mensuel: ${data.retirementContribution}

    MISSION :
    1. Évaluer la vulnérabilité globale actuelle.
    2. Analyser spécifiquement la "Préparation à la Retraite" : Est-ce que le rythme actuel et l'épargne accumulée permettront d'atteindre l'objectif de ${data.retirementAgeGoal} ans sans précarité ?
    3. Dans le "summary", commence par t'adresser à ${data.leadInfo?.firstName || 'l\'utilisateur'}. Inclus une section claire sur sa préparation à la retraite (en retard, sur la bonne voie, ou précaire).
    
    INSTRUCTION CRITIQUE POUR L'INVITATION :
    L'invitation doit obligatoirement être exactement la suivante : "Un membre de l'équipe vous contactera dans le prochain jour pour discuter de stratégies pour optimiser votre situation sans frais."
    
    Contraintes :
    - Score 0 (solide) à 100 (vulnérable).
    - Zones: Green (faible), Yellow (modérée), Red (élevée).
    - Jamais de noms de banques ou de placements précis.
    - Style professionnel, direct et bienveillant.
    - Langue : Français canadien.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Impossible de générer l'analyse. Vérifiez vos informations et réessayez.");
  }
}
