import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getAllPosts, Post } from "../lib/blogLoader";
import { Button } from "@/components/ui/button";
import { Code2, Sun, Moon, ArrowLeft } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { AdSensePlaceholder } from "@/components/adsense-placeholder";

function getSummary(content: string, maxLength = 160) {
  if (!content) return "";

  // Split into lines, remove empty ones
  const lines = content
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  // Take first meaningful paragraph
  let text = lines[0];

  // Remove markdown syntax
  text = text
    .replace(/^#+\s*/g, "")          // headings
    .replace(/[*_`>]/g, "")          // markdown chars
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // links

  // Trim safely to maxLength
  if (text.length > maxLength) {
    text = text.slice(0, maxLength);
    text = text.slice(0, text.lastIndexOf(" "));
    text += "…";
  }

  return text;
}

function getBlogsMetaDescription() {
  return "Deep dive blogs on .NET, C#, async/await, interviews and system design.";
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.title = "Blogs | MockDotNet";

    const description = getBlogsMetaDescription();

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, []);

  const POSTS_PER_PAGE = 5;
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  useEffect(() => {
    getAllPosts().then((p) => {
      setPosts(p);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading blogs...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
              <Code2 className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">MockDotNet</span>
            </Link>
          </div>

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Blogs</h1>

        {/* Future AdSense Placeholder */}
        <div className="my-12 hidden">
          <AdSensePlaceholder variant="banner" />
        </div>

        {posts.length === 0 && (
          <div className="text-muted-foreground">No blogs available.</div>
        )}

        <div className="space-y-8">
          {posts.slice(0, visibleCount).map((post) => (
            <article
              key={post.slug}
              className="p-4 sm:p-6 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition space-y-3"
            >
              <Link href={`/blogs/${post.slug}`}>
                <h2 className="text-lg sm:text-xl font-semibold cursor-pointer hover:text-primary text-foreground leading-snug">
                  {post.title}
                </h2>
              </Link>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                <span>{post.date}</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-muted border border-border rounded-full text-xs text-foreground uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
                {getSummary(post.content)}
              </p>

              <Link
                href={`/blogs/${post.slug}`}
                className="text-primary text-sm font-medium inline-block mt-4 hover:underline"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
        {visibleCount < posts.length && (
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              onClick={() => setVisibleCount(v => v + POSTS_PER_PAGE)}
              className="px-6"
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}