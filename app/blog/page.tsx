import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Articles on building apps with AI coding agents and InstantBackend. Cursor, Claude, ChatGPT, and backend for AI-generated apps.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Blog
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          AI agents and backend
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          How to build apps with Cursor, Claude, and ChatGPT using InstantBackend. No custom backend.
        </p>
      </section>

      <ul className="space-y-6 border-t border-slate-200 pt-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-card transition hover:border-brand-200 hover:shadow-md"
            >
              <time className="text-sm text-slate-500">{post.date}</time>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {post.title}
              </h2>
              <p className="mt-2 text-slate-600">{post.description}</p>
              <span className="mt-2 inline-block text-sm font-medium text-brand-600">
                Read more →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-center text-sm text-slate-500">
        <Link href="/ai-prompts" className="text-brand-600 hover:underline">
          Use this prompt
        </Link>
        {" · "}
        <Link href="/docs" className="text-brand-600 hover:underline">
          Docs
        </Link>
      </p>
    </div>
  );
}
