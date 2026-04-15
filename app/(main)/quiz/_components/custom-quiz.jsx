"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { saveCustomQuizResult } from "@/actions/quiz";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

export default function CustomQuiz({ quizData, meta, onReset }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(quizData.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(quizData.length * 60);
  const timerRef = useRef(null);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
  } = useFetch(saveCustomQuizResult);

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) correct++;
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    clearInterval(timerRef.current);
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score, meta);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={onReset} />
      </div>
    );
  }

  const question = quizData[currentQuestion];
  const isLowTime = timeLeft <= 60;

  return (
    <Card className="mx-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Question {currentQuestion + 1} of {quizData.length}
          </CardTitle>
          <span className={`text-lg font-mono font-bold ${isLowTime ? "text-red-500" : "text-muted-foreground"}`}>
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
        >
          {savingResult && <BarLoader width={"100%"} color="gray" />}
          {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}