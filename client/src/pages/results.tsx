import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Confetti from "react-confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTheme } from "@/components/theme-provider";
import { AdSensePlaceholder } from "@/components/adsense-placeholder";
import { type QuizResult } from "@shared/schema";
import { CheckCircle2, XCircle, Moon, Sun, RotateCcw, Code2, Trophy } from "lucide-react";

export default function Results() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const resultData = sessionStorage.getItem("quizResult");
  if (!resultData) {
    setLocation("/");
    return null;
  }

  const result: QuizResult = JSON.parse(resultData);
  const { score, totalQuestions, questions, answers, config } = result;
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    if (percentage === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    let currentScore = 0;
    const increment = score / 30;
    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(currentScore));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [percentage, score]);

  const handleRestart = () => {
    sessionStorage.removeItem("quizResult");
    setLocation("/");
  };

  const getScoreMessage = () => {
    if (percentage === 100) return "Perfect Score! Outstanding!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    if (percentage >= 40) return "Keep Practicing!";
    return "Don't Give Up!";
  };

  const getScoreColor = () => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-primary";
    if (percentage >= 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">.NET Quiz</span>
            </div>
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
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          {/* Score Hero */}
          <Card className="shadow-xl overflow-hidden">
            <div className={`bg-gradient-to-r ${percentage >= 80 ? 'from-success/20 to-success/5' : percentage >= 60 ? 'from-primary/20 to-primary/5' : 'from-muted to-muted/50'} p-8`}>
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3">
                  <Trophy className={`w-12 h-12 ${getScoreColor()}`} />
                  <h1 className="text-3xl md:text-4xl font-bold">Quiz Complete!</h1>
                </div>

                <div className="space-y-2">
                  <div className={`text-6xl md:text-8xl font-bold ${getScoreColor()} animate-count-up`} data-testid="text-score">
                    {percentage}%
                  </div>
                  <p className="text-xl md:text-2xl text-muted-foreground">
                    {animatedScore} out of {totalQuestions} correct
                  </p>
                  <p className={`text-lg md:text-xl font-semibold ${getScoreColor()}`}>
                    {getScoreMessage()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    Topic: {config.topic}
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    Questions: {totalQuestions}
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className="pt-6 pb-8">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  onClick={handleRestart}
                  data-testid="button-restart"
                  className="px-8"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Take Another Quiz
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  data-testid="button-home"
                  className="px-8 hover-elevate"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AdSense Rectangle - Desktop Right, Mobile Below */}
          {/* <div className="flex justify-center lg:hidden hidden"> */}
          {/* <div className="py-6 hidden">
            <AdSensePlaceholder variant="rectangle" />
          </div> */}

          {/* Question Review */}
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Review Your Answers</h2>
              
              <Accordion type="multiple" className="space-y-4">
                {questions.map((question, index) => {
                  const userAnswer = answers.find((a) => a.questionIndex === index);
                  const isCorrect = userAnswer?.selectedAnswer === question.answer;
                  
                  return (
                    <AccordionItem 
                      key={index} 
                      value={`question-${index}`}
                      className="border rounded-lg overflow-hidden"
                      data-testid={`accordion-question-${index}`}
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover-elevate">
                        <div className="flex items-start gap-4 text-left w-full">
                          <div className="flex-shrink-0 mt-1">
                            {isCorrect ? (
                              <CheckCircle2 className="w-6 h-6 text-success" data-testid={`icon-correct-${index}`} />
                            ) : (
                              <XCircle className="w-6 h-6 text-destructive" data-testid={`icon-incorrect-${index}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-muted-foreground">
                                Question {index + 1}
                              </span>
                              <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs">
                                {isCorrect ? "Correct" : "Incorrect"}
                              </Badge>
                            </div>
                            <p className="text-base font-medium line-clamp-2">{question.q}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="px-6 pb-4 pt-2">
                        <div className="space-y-4">
                          {/* Options */}
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => {
                              const isUserAnswer = userAnswer?.selectedAnswer === optIndex;
                              const isCorrectAnswer = question.answer === optIndex;
                              
                              let bgColor = "";
                              if (isCorrectAnswer) {
                                bgColor = "bg-success/10 border-success/30";
                              } else if (isUserAnswer && !isCorrect) {
                                bgColor = "bg-destructive/10 border-destructive/30";
                              }
                              
                              return (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded-md border ${bgColor} transition-colors`}
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="font-mono text-sm flex-shrink-0">
                                      {String.fromCharCode(65 + optIndex)})
                                    </span>
                                    <span className="flex-1 text-sm">
                                      {option.replace(/^[A-D]\)\s*/, "")}
                                    </span>
                                    {isCorrectAnswer && (
                                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                                    )}
                                    {isUserAnswer && !isCorrect && (
                                      <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          <div className="bg-muted/50 p-4 rounded-md border">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <span className="w-1 h-4 bg-primary rounded" />
                              Explanation
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            {/* Sidebar AdSense - Desktop Only */}
            {/* <div className="hidden lg:block hidden" > */}
              <div className="py-6 hidden">
              {/* <div className="sticky top-24">
                <AdSensePlaceholder variant="rectangle" />
              </div> */}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 .NET Quiz. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
