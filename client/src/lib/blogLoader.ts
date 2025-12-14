// client/src/lib/blogLoader.ts
export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  tags: string[];
};

export type Post = PostMeta & {
  content: string; // raw markdown body
};

// Load all markdown files in the blogs folder as raw strings
const modules = import.meta.glob('../blogs/*.md', { as: 'raw' });

function parseFrontmatter(raw: string): { meta: any | null; body: string } {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) return { meta: null, body: raw };
  const fm = fmMatch[1];
  const body = raw.slice(fmMatch[0].length);

  const meta: any = {};
  for (const line of fm.split('\n')) {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let value = m[2].trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      let arr: string[] = [];
      try {
        arr = JSON.parse(value.replace(/"\s*,\s*"/g, '","'));
      } catch {
        arr = value.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      }
      meta[key] = arr;
    } else {
      meta[key] = value;
    }
  }

  return { meta, body };
}

export async function getAllPosts(): Promise<Post[]> {
  const keys = Object.keys(modules);
  const posts: Post[] = [];
  await Promise.all(
    keys.map(async (k) => {
      const loader = (modules as any)[k] as () => Promise<string>;
      const raw = await loader();
      const { meta, body } = parseFrontmatter(raw);

      
      if (!meta || !meta.slug || !meta.title) {
        console.warn('Skipping file (missing meta):', k);
        return;
      }
      posts.push({
        slug: meta.slug,
        title: meta.title,
        date: meta.date || '1970-01-01',
        tags: meta.tags || [],
        content: body.trim(),
      });
    })
  );
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find(p => p.slug === slug) || null;
}