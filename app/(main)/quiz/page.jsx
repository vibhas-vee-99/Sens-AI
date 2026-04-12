import { getCustomAssessments } from "@/actions/quiz";
import QuizPageClient from "./_components/quiz-page-client";

export default async function QuizPage() {
  const assessments = await getCustomAssessments();
  return <QuizPageClient assessments={assessments} />;
}