
import { useEffect } from "react";
import { useLocation } from "wouter";

const topicMap: Record<string, {
  topic: string;
  count: 10;  
  title: string;
  description: string;
}> = {
  "csharp_basics": {
    topic: "C# Basics",
    count: 10,
    title: "C# Basics: 10 Questions in 3 Minutes (No Signup) - MockDotNet.dev",
    description: "Free instant C# Basics quiz. No login, no email. Just 10 questions in 3 minutes. Start now!"
  },
  "control_flows_csharp": {
    topic: "Control Flows C#",
    count: 10,
    title: "C# Control Flow: 10 Questions in 3 Minutes (No Login) - MockDotNet.dev",
    description: "Free C# Control Flow quiz. No signup, no email. 10 questions, instant results. Start now!"
  },
  "csharp_core": {
    topic: "C# Core",
    count: 10,
    title: "C# Core Advanced: 10 Questions in 3 Minutes (Direct Start) - MockDotNet.dev",
    description: "Free C# Core quiz. No login required. 10 quick questions, instant feedback. Go!"
  },
  "csharp_aspdotnet_core": {
    topic: "C# ASP.NET Core",
    count: 10,
    title: "ASP.NET Core: 10 Questions in 3 Minutes (No Signup) - MockDotNet.dev",
    description: "Free ASP.NET Core quiz. No login, no signup. 10 questions, direct start!"
  },
  "csharp_entity_framework": {
    topic: "C# Entity Framework",
    count: 10,
    title: "Entity Framework: 10 Questions in 3 Minutes (Instant) - MockDotNet.dev",
    description: "Free EF quiz. No signup, no email. 10 questions, instant answers. Start now!"
  },
  "csharp_linq": {
    topic: "C# LINQ",
    count: 10,
    title: "LINQ: 10 Questions in 3 Minutes (No Login) - MockDotNet.dev",
    description: "Free LINQ quiz. No login, no signup. 10 quick questions. Start instantly!"
  },
  "dotnet9_features": {
    topic: ".NET9 Features",
    count: 10,
    title: ".NET 9 Features: 10 Questions in 3 Minutes (Direct) - MockDotNet.dev",
    description: "Free .NET 9 quiz. No signup, no email. 10 fresh questions for 2025 interviews!"
  },
  "csharp_aspdotnet_middleware": {
    topic: "C# ASP.NET Core Middleware & Pipeline",
    count: 10,
    title: "ASP.NET Middleware: 10 Questions in 3 Minutes (No Login) - MockDotNet.dev",
    description: "Free Middleware quiz. No signup, no email. 10 questions, instant start!"
  },
};

export default function TopicPage() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const path = location.slice(1);
    const config = topicMap[path];

    // console.log("Current location path:", path);
    // console.log("Location :", location);
    // console.log("Topic map keys:", Object.keys(topicMap));
    // console.log("Config found for this path:", config);

    if (config) {
      document.title = config.title;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', config.description);

      sessionStorage.setItem("quizConfig", JSON.stringify({
        topic: config.topic,
        questionCount: config.count
      }));
      setLocation("/quiz");
    }
  }, [location, setLocation]);

  return null; 
}