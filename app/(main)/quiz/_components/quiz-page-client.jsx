"use client";

import { useState } from "react";
import { generateCustomQuiz } from "@/actions/quiz";
import CustomQuizForm from "./custom-quiz-form";
import CustomQuiz from "./custom-quiz";
import QuizList from "./quiz-list";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

export default function QuizPageClient({ assessments }) {
  const [meta, setMeta] = useState(null);
  const [showForm, setShowForm] = useState(!assessments?.length);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
    setData: setQuizData,
  } = useFetch(generateCustomQuiz);

  const handleStart = async (formData) => {
    setMeta(formData);
    await generateQuizFn(formData);
  };

  const handleReset = () => {
    setQuizData(null);
    setMeta(null);
    setShowForm(true);
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  if (quizData) {
    return <CustomQuiz quizData={quizData} meta={meta} onReset={handleReset} />;
  }

  if (showForm || !assessments?.length) {
    return <CustomQuizForm onStart={handleStart} loading={generatingQuiz} />;
  }

  return (
    <QuizList
      assessments={assessments}
      onStartNew={() => setShowForm(true)}
    />
  );
}