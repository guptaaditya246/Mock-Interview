import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { type QuizConfig, type Question, type QuizAnswer } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Moon, Sun, ChevronLeft, ChevronRight, SkipForward, Timer, Code2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Light theme; swap for dark if needed

export default function Quiz() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  const topicMap = {
  "csharp_basics": "C# Basics",
  "control_flows_csharp": "Control Flows C#",
  "csharp_aspdotnet_core": "C# ASP.NET Core",
  "csharp_entity_framework": "C# Entity Framework",
  "csharp_linq": "C# LINQ",
  "dotnet9_features": ".NET9 Features",
  "csharp_aspdotnet_middleware": "C# ASP.NET Core Middleware & Pipeline",
  "csharp_core": "C# Core",
} as const;

  // const quizConfig = JSON.parse(
  //   sessionStorage.getItem("quizConfig") || "{}"
  // ) as QuizConfig;

  // if (!quizConfig.topic) {
  //   setLocation("/");
  //   return null;
  // }

  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(() => {
  const stored = sessionStorage.getItem("quizConfig");
  return stored ? (JSON.parse(stored) as QuizConfig) : null;
});

useEffect(() => {
  if (!quizConfig?.topic) {
    const topicFromPath = window.location.pathname.replace("/", "");
    const topic = topicMap[topicFromPath as keyof typeof topicMap];
    if (topic) {
      const newConfig = { topic: topic as QuizConfig["topic"], questionCount: 10 };
      sessionStorage.setItem("quizConfig", JSON.stringify(newConfig));
      setQuizConfig(newConfig);
    } else {
      setLocation("/");
    }
  }
}, [quizConfig, setLocation]);

if (!quizConfig?.topic) {
  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Redirecting...
    </div>
  );
}

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions", quizConfig.topic, quizConfig.questionCount],
    queryFn: async () => {
      const response = await fetch(
        `/api/questions?topic=${encodeURIComponent(quizConfig.topic)}&count=${quizConfig.questionCount}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      return response.json();
    },
  });

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    if (isAnswerLocked || !questions || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNext(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isAnswerLocked, questions]);

  const handleNext = useCallback((autoAdvance = false) => {
    const answer: QuizAnswer = {
      questionIndex: currentQuestionIndex,
      selectedAnswer: selectedOption ?? -1,
      timeSpent: 30 - timeRemaining,
    };

    setAnswers((prev) => {
      const newAnswers = [...prev];
      const existingIndex = newAnswers.findIndex(
        (a) => a.questionIndex === currentQuestionIndex
      );
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = answer;
      } else {
        newAnswers.push(answer);
      }
      return newAnswers;
    });

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeRemaining(30);
      setIsAnswerLocked(false);
    } else {
      finishQuiz();
    }
  }, [currentQuestionIndex, selectedOption, timeRemaining, totalQuestions]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const previousAnswer = answers.find(
        (a) => a.questionIndex === currentQuestionIndex - 1
      );
      setSelectedOption(previousAnswer?.selectedAnswer ?? null);
      setTimeRemaining(30);
      setIsAnswerLocked(false);
    }
  };

  const handleSkip = () => {
    handleNext(true);
  };

  const finishQuiz = () => {
    const finalAnswers = [
      ...answers,
      {
        questionIndex: currentQuestionIndex,
        selectedAnswer: selectedOption ?? -1,
        timeSpent: 30 - timeRemaining,
      },
    ];

    const score = finalAnswers.reduce((acc, answer, idx) => {
      if (questions && answer.selectedAnswer === questions[idx]?.answer) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const result = {
      config: quizConfig,
      answers: finalAnswers,
      questions: questions || [],
      score,
      totalQuestions,
    };

    sessionStorage.setItem("quizResult", JSON.stringify(result));
    setLocation("/results");
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  const timerColor = timeRemaining <= 5 ? "text-destructive" : timeRemaining <= 10 ? "text-warning" : "text-primary";
  const timerPercentage = (timeRemaining / 30) * 100;

  const renderQuestion = (question: string) => {
  // First, handle triple backticks for blocks (priority)
  let parts = question.split(/```(\w+)?\n?([^`]+)```/g); // Captures lang (optional), code
  if (parts.length > 1) {
    // Rebuild with blocks; fallback to single if no triples
    return parts.map((part, i) => {
      if (i % 3 === 2) { // Code parts (every 3rd: lang?, code, closing)
        const lang = parts[i - 1] || 'csharp'; // Default C#
        return (
          <SyntaxHighlighter
            key={i}
            language={lang}
            style={oneLight}
            customStyle={{
              borderRadius: '0.5rem',
              margin: '0.5rem 0',
              padding: '1rem',
              backgroundColor: '#f8fafc', // Tailwind slate-50 vibe
              border: '1px solid #e2e8f0', // slate-200
              fontSize: '0.875rem', // text-sm
            }}
            showLineNumbers={part.includes('\n')}
            wrapLongLines={true}
            lineNumberStyle={{ color: '#94a3b8' }} // Muted for numbers
          >
            {part.trim()} // Trim any extra spaces
          </SyntaxHighlighter>
        );
      }
      return <span key={i} className="inline">{part}</span>;
    });
  }

  // Fallback: Single backticks for inlines/blocks
  parts = question.split(/`([^`]+)`/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? ( // Code part
      (() => {
        const code = part.trim();
        const isShortInline = code.length < 20 && !code.includes('\n');
        if (isShortInline) {
          // Inline badge: No highlighter (too heavy), just styled code
          return (
            <code
              key={i}
              className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md font-mono text-sm border border-gray-200 inline-block mx-1"
            >
              {code}
            </code>
          );
        } else {
          // Full block
          return (
            <SyntaxHighlighter
              key={i}
              language="csharp"
              style={oneLight}
              customStyle={{
                borderRadius: '0.5rem',
                margin: '0.5rem 0',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
              }}
              showLineNumbers={code.includes('\n')}
              wrapLongLines={true}
              lineNumberStyle={{ color: '#94a3b8' }}
            >
              {code}
            </SyntaxHighlighter>
          );
        }
      })()
    ) : (
      <span key={i} className="inline">{part}</span>
    )
  );
};
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> */}
      <header className="sticky top-0 z-50 border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">.NET Quiz</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {quizConfig.topic}
              </Badge>
              <Button
                variant="outline"
                onClick={() => setShowQuitDialog(true)}
                className="hover-elevate"
              >
                Home
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleTheme}
                data-testid="button-theme-toggle"
                className="hover-elevate"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" data-testid="progress-bar" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Timer */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-muted/30"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className={`${timerColor} transition-all duration-300`}
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - timerPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Timer className={`w-5 h-5 mx-auto mb-1 ${timerColor}`} />
                  <span className={`text-2xl font-bold ${timerColor}`} data-testid="text-timer">
                    {timeRemaining}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <h2 className="text-xl md:text-2xl font-medium leading-relaxed" data-testid="text-question">
                {/* {currentQuestion.q} */}
                {renderQuestion(currentQuestion.q)}
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index;
                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto py-4 px-6 text-base transition-all ${
                      isSelected ? "" : "hover-elevate"
                    }`}
                    onClick={() => setSelectedOption(index)}
                    data-testid={`button-option-${index}`}
                  >
                    <span className="font-mono mr-3 flex-shrink-0">
                      {String.fromCharCode(65 + index)})
                    </span>
                    <span className="flex-1">{option.replace(/^[A-D]\)\s*/, "")}</span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="hover-elevate"
              data-testid="button-previous"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="hover-elevate"
                data-testid="button-skip"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>

              <Button
                onClick={() => handleNext(false)}
                disabled={selectedOption === null}
                data-testid="button-next"
              >
                {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
                {currentQuestionIndex !== totalQuestions - 1 && (
                  <ChevronRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Dialog open={showQuitDialog} onOpenChange={setShowQuitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quit Quiz?</DialogTitle>
            <DialogDescription>
              Are you sure you want to quit? Your current progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuitDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowQuitDialog(false);
                setLocation("/");
              }}
            >
              Quit Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
