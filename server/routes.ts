import type { Express } from "express";
import { createServer, type Server } from "http";
import { readFileSync } from "fs";
import { join } from "path";
import { quizTopics } from "../shared/schema.ts";

interface QuestionsData {
  [key: string]: Array<{
    q: string;
    options: string[];
    answer: number;
    explanation: string;
  }>;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const questionsPath = join(process.cwd(), "server", "data", "questions.json");
  const questionsData: QuestionsData = JSON.parse(
    readFileSync(questionsPath, "utf-8")
  );

  app.get("/api/questions", (req, res) => {
    const topic = req.query.topic as string;
    const count = parseInt(req.query.count as string) || 20;
    
    
    if (!topic || !quizTopics.includes(topic as any)) {
      
      return res.status(400).json({ error: "Invalid topic" });
    }


    const topicKey = topic
      .toLowerCase()
      .replace(/c#/g, "csharp")
      .replace(/\.net/g, "dotnet")
      .replace(/&/g, "and")       
      .replace(/\s+/g, "_")
      .replace(/\./g, "");
    const allQuestions = questionsData[topicKey] || [];

    if (allQuestions.length === 0) {
      return res.status(404).json({ error: "No questions found for this topic" });
    }

    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    res.json(selected);
  });

  const httpServer = createServer(app);
  return httpServer;
}
