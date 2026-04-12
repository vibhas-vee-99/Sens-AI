"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = ["JavaScript", "Python", "Java", "C++", "TypeScript", "Go", "Rust", "C#"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const QUESTION_COUNTS = [20, 30, 50, 75];

export default function CustomQuizForm({ onStart, loading }) {
  const [language, setLanguage] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState(20);

  const handleSubmit = () => {
    if (!language || !topic || !difficulty) return;
    onStart({ language, topic, difficulty, numQuestions });
  };

  return (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header - same as page 1 */}
      <div className="flex items-center mb-6">
        <a href="/interview" className="text-sm text-muted-foreground hover:text-white flex items-center gap-1">
          ← Back to Interview Preparation
        </a>
      </div>

      <div className="mb-8">
        <h1 className="text-6xl font-bold gradient-title mb-2">Custom Quiz</h1>
        <p className="text-muted-foreground">
          Generate a quiz tailored to your language and topic
        </p>
      </div>

      {/* Form Card - same style as page 1 card */}
     <div className="border border-border rounded-xl p-6 w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <Label>Language</Label>
            <Select onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select onValueChange={setDifficulty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Topic</Label>
            <Input
              placeholder="e.g. Arrays, OOP, Async, Hooks..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Number of Questions</Label>
            <Select
              defaultValue="20"
              onValueChange={(val) => setNumQuestions(Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                {QUESTION_COUNTS.map((c) => (
                  <SelectItem key={c} value={String(c)}>{c} Questions</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        <p className="text-muted-foreground text-sm">
          Select your language, topic and difficulty. AI will generate questions specific to your choices.
        </p>

        <Button
          className="w-full bg-white text-black hover:bg-gray-100 border border-gray-200"
          onClick={handleSubmit}
          disabled={!language || !topic || !difficulty || loading}
        >
          {loading ? "Generating Quiz..." : "Start Quiz"}
        </Button>
      </div>
    </div>
  );
}