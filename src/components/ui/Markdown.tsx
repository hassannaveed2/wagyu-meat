import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";

/** Renders admin-authored Markdown. Raw HTML is not rendered (react-markdown's default). */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-wagyu", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: (props) => (
            <div className="my-5 overflow-x-auto">
              <table className="w-full border-collapse text-sm" {...props} />
            </div>
          ),
          th: (props) => <th className="border-b border-line bg-paper-2 px-3 py-2 text-left font-medium text-ink" {...props} />,
          td: (props) => <td className="border-b border-line px-3 py-2" {...props} />,
          blockquote: (props) => <blockquote className="my-5 border-l-2 border-gold bg-gold-soft/40 px-4 py-3 text-ink" {...props} />,
          a: ({ href, ...props }) => <a href={href} rel="noopener noreferrer" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
