"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateCustomQuiz({ language, topic, difficulty, numQuestions }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const batchSize = 5;
  const numBatches = Math.ceil(numQuestions / batchSize);

  const prompt = (count) => `
    Generate exactly ${count} technical multiple choice questions about ${topic} in ${language} 
    at ${difficulty} difficulty level.
    Each question must have exactly 4 options.
    Return ONLY this JSON, no extra text:
    {"questions":[{"question":"","options":["","","",""],"correctAnswer":"","explanation":""}]}
  `;

  try {
    const allQuestions = [];
    for (let i = 0; i < numBatches; i++) {
      const count = i === numBatches - 1 ? numQuestions - i * batchSize : batchSize;
      if (i > 0) await new Promise(res => setTimeout(res, 3000));
      const result = await groq.chat.completions.create({
       model: "llama-3.1-8b-instant",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt(count) }],
      });
      const text = result.choices[0]?.message?.content || "";
      const cleaned = text
        .replace(/```(?:json)?\n?/g, "")
        .replace(/[\x00-\x1F\x7F]/g, " ")
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
        .trim();
      allQuestions.push(...JSON.parse(cleaned).questions);
    }
    return allQuestions.slice(0, numQuestions);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveCustomQuizResult(questions, answers, score, meta) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
  let improvementTip = null;

  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map((q) => `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`)
      .join("\n\n");

    try {
      const tipResult = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: `The user got these ${meta.language} - ${meta.topic} questions wrong:\n${wrongQuestionsText}\nProvide a concise improvement tip under 2 sentences.` }],
      });
      improvementTip = tipResult.choices[0]?.message?.content.trim();
    } catch (error) {
      console.error("Error generating improvement tip:", error);
    }
  }

  return await db.assessment.create({
    data: {
      userId: user.id,
      quizScore: score,
      questions: questionResults,
      category: "Custom",
      improvementTip,
    },
  });
}

export async function getCustomAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  try {
    return await db.assessment.findMany({
      where: { userId: user.id, category: "Custom" },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}