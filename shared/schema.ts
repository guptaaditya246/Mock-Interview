import { z } from "zod";

export const quizTopics = [
  "C# Basics",
  "C# Classes",
  "Control Flows C#",
  "C# Core",
  "C# ASP.NET Core",
  "C# Entity Framework",
  "C# LINQ",
  ".NET9 Features",
  "C# ASP.NET Core Middleware & Pipeline"
] as const;



export type QuizTopic = typeof quizTopics[number];

export const questionSchema = z.object({
  q: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.number().min(0).max(3),
  explanation: z.string(),
});

export const quizDataSchema = z.object({
  topic: z.enum(quizTopics),
  questions: z.array(questionSchema),
});

export type Question = z.infer<typeof questionSchema>;
export type QuizData = z.infer<typeof quizDataSchema>;

export const quizConfigSchema = z.object({
  topic: z.enum(quizTopics),
  questionCount: z.number().min(5).max(50),
});

export type QuizConfig = z.infer<typeof quizConfigSchema>;

export interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: number;
  timeSpent: number;
}

export interface QuizResult {
  config: QuizConfig;
  answers: QuizAnswer[];
  questions: Question[];
  score: number;
  totalQuestions: number;
}
