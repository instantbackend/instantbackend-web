"use client";

import { useMemo } from "react";
import { useInstantBackend } from "@/contexts/instant-backend-context";
import { CodeBlock, type CodeLanguage } from "@/components/code-block";

interface ApiKeyCodeBlockProps {
  code: string;
  language?: CodeLanguage;
  className?: string;
}

export function ApiKeyCodeBlock({
  code,
  language,
  className,
}: ApiKeyCodeBlockProps) {
  const { apiKey, isAuthenticated } = useInstantBackend();
  const resolvedCode = useMemo(() => {
    if (!isAuthenticated || !apiKey) {
      const notice = [
        "// Sign up to get your API key:",
        "// https://www.instantbackend.dev/register",
        "",
      ].join("\n");
      return `${notice}${code}`;
    }
    return code.replaceAll("YOUR_API_KEY", apiKey);
  }, [apiKey, code, isAuthenticated]);

  return <CodeBlock code={resolvedCode} language={language} className={className} />;
}
