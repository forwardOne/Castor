// src/components/CodeBlock.tsx
// 自力で思い付かずVibe-Codingした
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
}

export const CodeBlock: React.FC<CodeProps> = ({ className, children }) => {
  const codeRef = React.useRef<HTMLPreElement>(null);

  // language-xxx が付いている → コードブロック
  const isBlock = className && /language-/.test(className);

  const handleCopy = async () => {
    const text = codeRef.current?.innerText ?? "";
    await navigator.clipboard.writeText(text);
  };

  // インラインコードはそのまま返す
  if (!isBlock) {
    return (
      <code className={className}>
        {children}
      </code>
    );
  }

  // コードブロック
  return (
    <div className="my-4">
      <pre ref={codeRef} className="relative group overflow-x-auto w-95 xs:w-95 lg:w-lg xl:w-2xl rounded-md">
        <code className={className}>{children}</code>
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="icon-sm"
          className="absolute right-1 top-1 p-1 text-zinc-500"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </pre>
    </div>
  );
};
