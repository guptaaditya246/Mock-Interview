import { useEffect, useState } from "react";
import { getAllPosts } from "@/lib/blogLoader";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { AdSensePlaceholder } from "@/components/adsense-placeholder";
import { quizTopics, type QuizTopic, type QuizConfig } from "@shared/schema";
import { Moon, Sun, Code2, Clock, Target, Sparkles } from "lucide-react";


export default function Home() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic>(quizTopics[0]);
  const [questionCount, setQuestionCount] = useState<number>(20);

  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);

  useEffect(() => {
    getAllPosts().then((blogs) => {
      const sorted = [...blogs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      setLatestBlogs(sorted);
    });
  }, []);

  const handleStartQuiz = () => {
    const config: QuizConfig = {
      topic: selectedTopic,
      questionCount: Math.min(Math.max(questionCount, 5), 50),
    };
    sessionStorage.setItem("quizConfig", JSON.stringify(config));
    setLocation("/quiz");
  };

  const quickPickCounts = [10, 20, 30];
  
  

function WorkInProgressPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
   
    const hasSeen = localStorage.getItem('wip-seen-nov2025');
    if (!hasSeen) {
      setShow(true);
    }
  }, []); 
  if (!show) return null;

  const handleOk = () => {
    localStorage.setItem('wip-seen-nov2025', 'true');
    setShow(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#1e1b4b',
        color: 'white',
        padding: '24px 32px',
        borderRadius: '16px',
        maxWidth: '340px',
        textAlign: 'center',
        border: '2px solid #a78bfa',
        boxShadow: '0 0 30px rgba(167,139,250,0.5)'
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '18px' }}>Work in Progress</h3>
        <p style={{ margin: '0 0 20px', fontSize: '15px', lineHeight: '1.5' }}>
          Prepare for Enterprise-grade .NET scenarios. <br />
          The .NET questions companies actually ask.<br />
          Free forever. Of course!
          <br /><br />
          <b>Please bookmark this site!</b>
        </p>
        <button
          onClick={handleOk}
          style={{
            background: '#a78bfa',
            color: 'white',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '50px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          OK, Got it!
        </button>
      </div>
    </div>
  );
}





  return (
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
          <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">MockDotNet</span>
          </a>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="hover-elevate"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      {/* AdSense Top Banner */}
      <div className="py-6 hidden">
        <AdSensePlaceholder variant="banner" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Join 50,000+ developers preparing for interviews</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent leading-tight">
              Free .NET Mock Interview
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Test your knowledge with real-world .NET questions. Get instant feedback and improve your skills.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="hover-elevate transition-all">
              <CardHeader className="pb-3">
                <Clock className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-base">Timed Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  30 seconds per question to simulate real interview pressure
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate transition-all">
              <CardHeader className="pb-3">
                <Code2 className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-base">Real Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  100+ questions from actual .NET interviews
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate transition-all">
              <CardHeader className="pb-3">
                <Target className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-base">Instant Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed explanations for every answer
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Configuration Card */}
          <Card className="shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Configure Your Quiz</CardTitle>
              <CardDescription>
                Choose a topic and number of questions to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Selection */}
              <div className="space-y-3">
                <Label htmlFor="topic-select" className="text-base font-medium">
                  Select Topic
                </Label>
                <Select value={selectedTopic} onValueChange={(v) => setSelectedTopic(v as QuizTopic)}>
                  <SelectTrigger 
                    id="topic-select" 
                    className="w-full text-lg h-12"
                    data-testid="select-topic"
                  >
                    <SelectValue placeholder="Choose a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {quizTopics.map((topic) => (
                      <SelectItem key={topic} value={topic} className="text-base">
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Question Count */}
              <div className="space-y-3">
                <Label htmlFor="question-count" className="text-base font-medium">
                  Number of Questions (5-50)
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="question-count"
                    type="number"
                    min={5}
                    max={50}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value) || 20)}
                    className="text-lg h-12"
                    data-testid="input-question-count"
                  />
                </div>
                
                {/* Quick Pick Badges */}
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Quick pick:</span>
                  {quickPickCounts.map((count) => (
                    <Badge
                      key={count}
                      variant={questionCount === count ? "default" : "outline"}
                      className="cursor-pointer hover-elevate active-elevate-2"
                      onClick={() => setQuestionCount(count)}
                      data-testid={`badge-quick-${count}`}
                    >
                      {count}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <Button
                size="lg"
                className="w-full text-lg h-14 mt-4"
                onClick={handleStartQuiz}
                data-testid="button-start-quiz"
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>

          {/* Stats Banner */}
          <div className="text-center text-sm text-muted-foreground py-4">
            <p>
              Currently selected: <strong className="text-foreground">{selectedTopic}</strong> with{" "}
              <strong className="text-foreground">{questionCount}</strong> questions
            </p>
          </div>
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Latest Blogs
                </h3>
              </div>

              <div className="space-y-3">
                {latestBlogs.map((post) => (
                  <a
                    key={post.slug}
                    href={`/blogs/${post.slug}`}
                    className="block rounded-lg border p-3 hover:bg-muted transition-colors"
                  >
                    <p className="text-sm font-medium leading-snug">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {post.tags?.slice(0, 2).join(" · ")}
                    </p>
                  </a>
                ))}
              </div>

              <a
                href="/blogs"
                className="block w-full text-center rounded-lg border border-primary text-primary py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Read all blogs
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 .NET Quiz. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="/about.html" className="hover:text-foreground transition-colors">About</a>
              <a href="/privacy.html" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/contact.html" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
