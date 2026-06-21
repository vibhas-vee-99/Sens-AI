import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  const serialized = assessments.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt?.toISOString(),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={serialized} />
        <PerformanceChart assessments={serialized} />
        <QuizList assessments={serialized} />
      </div>
    </div>
  );
}