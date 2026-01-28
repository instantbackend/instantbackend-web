import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-csharp";

export type CodeLanguage =
  | "javascript"
  | "typescript"
  | "bash"
  | "json"
  | "kotlin"
  | "swift"
  | "csharp";

interface CodeBlockProps {
  code: string;
  language?: CodeLanguage;
  className?: string;
}

export function CodeBlock({ code, language = "javascript", className = "" }: CodeBlockProps) {
  const grammar = Prism.languages[language] || Prism.languages.javascript;
  const highlighted = Prism.highlight(code.trimEnd(), grammar, language);

  return (
    <pre
      className={`overflow-auto rounded-lg bg-slate-900 p-4 text-sm leading-relaxed text-slate-100 ${className}`}
    >
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}
