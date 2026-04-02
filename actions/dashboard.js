"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

export const generateAIInsights = async (industry) => {
const prompt = `
  Analyze the current state of the ${industry} industry in India and provide insights in ONLY the following JSON format without any additional notes or explanations:
  {
    "salaryRanges": [
      { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
    ],
    "growthRate": number,
    "demandLevel": "High" | "Medium" | "Low",
    "topSkills": ["skill1", "skill2"],
    "marketOutlook": "Positive" | "Neutral" | "Negative",
    "keyTrends": ["trend1", "trend2"],
    "recommendedSkills": ["skill1", "skill2"]
  }
  
  IMPORTANT: 
  - Return ONLY the JSON. No additional text, notes, or markdown formatting.
  - All salary values (min, max, median) must be in INR (Indian Rupees) per annum as ACTUAL NUMBERS (e.g., 1200000 for 12 lakhs, not 12 or 1200).
  - Provide realistic salary ranges for India's ${industry} market.
  - Include at least 5 common roles with locations like "Bangalore", "Mumbai", "Pune", "Hyderabad", "Delhi NCR", "Chennai", or "India" for national average.
  - Growth rate should be a percentage (e.g., 15 for 15%).
  - Include at least 5 relevant skills and industry trends for India.
`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  const data = JSON.parse(cleanedText);
  
  // Transform to match Prisma enum format
  return {
    ...data,
    demandLevel: data.demandLevel.toUpperCase(),
    marketOutlook: data.marketOutlook.toUpperCase(),
  };
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}