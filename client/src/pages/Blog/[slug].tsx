import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { getPostBySlug, getAllPosts, Post } from "../../lib/blogLoader";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Code2, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

function getMetaDescription(content: string, maxLength = 160) {
  if (!content) return "";
  const text = content
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)[0] || "";

  const clean = text
    .replace(/^#+\s*/g, "")
    .replace(/[*_`>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  return clean.length > maxLength
    ? clean.slice(0, clean.lastIndexOf(" ", maxLength)) + "…"
    : clean;
}

export default function BlogDetailPage() {
  const [match, params] = useRoute("/blogs/:slug");
  const slug = params?.slug;

  const { theme, toggleTheme } = useTheme();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug).then(p => {
      setPost(p);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    getAllPosts().then(posts => {
      const uniquePostsMap = new Map<string, Post>();
      // Filter out current post and map by slug to remove duplicates
      posts.forEach(p => {
        if (p.slug !== slug && !uniquePostsMap.has(p.slug)) {
          uniquePostsMap.set(p.slug, p);
        }
      });
      // Sort by date descending and take first 5
      const sortedUniquePosts = Array.from(uniquePostsMap.values())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      setRecentPosts(sortedUniquePosts);
    });
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    document.title = `${post.title} | MockDotNet`;

    const description = getMetaDescription(post.content);

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [post]);

  if (!match) return <div className="p-6 text-destructive">404 Not Found</div>;
  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;
  if (!post) return <div className="p-6 text-destructive">Post not found.</div>;

  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let codeBlockLang: string | null = null;
    let codeBuffer: string[] = [];

    const flushCodeBlock = () => {
      if (codeBuffer.length === 0) return;
      elements.push(
        <SyntaxHighlighter
          key={elements.length}
          language={codeBlockLang || "csharp"}
          style={oneLight}
          showLineNumbers
          wrapLongLines
          customStyle={{
            borderRadius: "0.75rem",
            margin: "1.5rem 0",
            padding: "1rem",
            backgroundColor: "#f3f4f6",
            border: "1px solid #e5e7eb",
            fontSize: "0.8rem",
          }}
        >
          {codeBuffer.join("\n")}
        </SyntaxHighlighter>
      );
      codeBuffer = [];
      codeBlockLang = null;
    };

    const renderInline = (text: string): JSX.Element[] => {
      const inlineRegex = /(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(`([^`]+)`)/g;
      const parts: JSX.Element[] = [];
      let lastIndex = 0;
      let match;

      while ((match = inlineRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(
            <span key={parts.length} className="text-foreground">
              {text.slice(lastIndex, match.index)}
            </span>
          );
        }

        // Markdown link
        if (match[1]) {
          parts.push(
            <a
              key={parts.length}
              href={match[3]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              {match[2]}
            </a>
          );
        }
        // Inline code
        else if (match[4]) {
          parts.push(
            <code
              key={parts.length}
              className="bg-muted text-foreground px-1.5 py-0.5 rounded-md font-mono text-xs sm:text-sm"
            >
              {match[5]}
            </code>
          );
        }

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        parts.push(
          <span key={parts.length} className="text-foreground">
            {text.slice(lastIndex)}
          </span>
        );
      }

      return parts;
    };

    lines.forEach((line) => {
      const codeFence = line.match(/^```(\w*)/);
      if (codeFence) {
        if (codeBlockLang === null) {
          codeBlockLang = codeFence[1] || "csharp";
        } else {
          flushCodeBlock();
        }
        return;
      }

      if (codeBlockLang !== null) {
        codeBuffer.push(line);
        return;
      }

      // Handle conclusion
      if (line.startsWith("> CONCLUSION:")) {
        elements.push(
          <p
            key={elements.length}
            className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-3 rounded-md my-4 font-semibold"
          >
            {line.replace("> CONCLUSION:", "").trim()}
          </p>
        );
        return;
      }

      // Handle headings
      const headingMatch = line.match(/^(#{1,3})\s*(.*)/);
      if (headingMatch) {
        const extracted = headingMatch[2].trim();
        if (extracted.startsWith("Q:")) {
          elements.push(
            <p
              key={elements.length}
              className="my-4 text-sm sm:text-base leading-relaxed font-normal text-foreground italic"
            >
              {extracted}
            </p>
          );
          return;
        }
        if (extracted.startsWith("A:")) {
          elements.push(
            <p
              key={elements.length}
              className="my-4 text-sm sm:text-base leading-relaxed font-normal text-foreground"
            >
              {extracted}
            </p>
          );
          return;
        }

        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const headingClass =
          level === 1
            ? "text-4xl font-medium mt-8 mb-4 text-foreground bg-primary/5 p-2 rounded-md"
            : level === 2
            ? "text-3xl font-normal mt-6 mb-3 text-foreground bg-primary/5 p-2 rounded-md"
            : "text-2xl font-normal mt-4 mb-2 text-foreground bg-primary/5 p-1 rounded-md";

        elements.push(<div key={elements.length} className={headingClass}>{text}</div>);
        return;
      }

      // Handle lists
      if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
        const listItems = [];
        let i = lines.indexOf(line);
        while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
          listItems.push(lines[i].replace(/^\s*[-*]\s+|\d+\.\s+/, ""));
          i++;
        }
        elements.push(
          <ul key={elements.length} className="list-disc list-inside my-4 space-y-1 bg-muted/10 dark:bg-muted/20 p-3 rounded-md">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-foreground text-sm sm:text-base leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
        // Skip processed lines
        for (let j = lines.indexOf(line) + 1; j < i; j++) lines[j] = "";
        return;
      }

      elements.push(
        <p
          key={elements.length}
          className="my-4 text-sm sm:text-base leading-relaxed font-normal text-foreground"
        >
          {renderInline(line)}
        </p>
      );
    });

    flushCodeBlock();

    return elements;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
    
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Code2 className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">MockDotNet</span>
          </Link>
          
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
      
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10 overflow-x-hidden">
        <div className="flex-1 min-w-0">
          <Link
            href="/blogs"
            className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Back to Blogs
          </Link>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-foreground">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-muted-foreground text-sm mb-6">
            <span>{post.date}</span>
          </div>

          <div className="flex gap-2 mb-6">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-muted px-3 py-1 rounded-full border border-border uppercase tracking-wide text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="prose max-w-full ml-0 mr-0 prose-headings:font-medium prose-headings:text-foreground
prose-headings:mt-6 prose-headings:mb-3
prose-p:text-sm sm:prose-p:text-base prose-p:leading-relaxed prose-p:my-4
prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-md
prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-0 prose-blockquote:text-muted
prose-img:rounded-lg prose-img:shadow-sm prose-img:max-w-full overflow-x-auto">
            {post ? renderMarkdown(post.content) : null}
          </div>
        </div>
        <aside className="w-full lg:w-64 lg:sticky lg:top-24 space-y-6">
          <div className="hidden lg:block">
            <h3 className="font-semibold text-lg text-foreground mb-2">Recent Posts</h3>
            <ul className="space-y-1">
              {recentPosts.map(p => (
                <li key={p.slug}>
                  <Link
                    href={`/blogs/${p.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}