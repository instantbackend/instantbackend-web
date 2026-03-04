import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <header>
        <Link href="/blog" className="text-sm font-medium text-brand-600 hover:underline">
          ← Blog
        </Link>
        <time className="mt-2 block text-sm text-slate-500">{post.date}</time>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">{post.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{post.description}</p>
      </header>

      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:text-slate-50">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <footer className="border-t border-slate-200 pt-6">
        <Link href="/blog" className="text-brand-600 font-medium hover:underline">
          ← Back to blog
        </Link>
      </footer>
    </article>
  );
}
