"use client";

type AiChatMarkdownProps = {
  text: string;
};

const cleanMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
};

export default function AiChatMarkdown({ text }: AiChatMarkdownProps) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, index) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
          return <div key={index} className="h-1" aria-hidden="true" />;
        }

        if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
          return (
            <div key={index} className="flex gap-2">
              <span
                aria-hidden="true"
                className="mt-[7px] size-1 shrink-0 rounded-full bg-current"
              />

              <span>{cleanMarkdown(trimmedLine.slice(2))}</span>
            </div>
          );
        }

        const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.*)$/);

        if (numberedMatch) {
          return (
            <div key={index} className="flex gap-2">
              <span className="shrink-0 font-medium">{numberedMatch[1]}.</span>

              <span>{cleanMarkdown(numberedMatch[2])}</span>
            </div>
          );
        }

        return <p key={index}>{cleanMarkdown(trimmedLine)}</p>;
      })}
    </div>
  );
}
