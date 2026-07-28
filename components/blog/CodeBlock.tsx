import { useRef, useState } from "react";

/**
 * Replaces the default <pre> rendering for fenced code blocks in MDX.
 *
 * Wraps the highlighted <pre> in a relatively-positioned container and adds a
 * round copy-to-clipboard button in the top-right corner. The code text is read
 * from the live DOM (innerText of the <pre>), which is more reliable than trying
 * to reconstruct it from the MDX children (rehype-highlight splits tokens into
 * many nested <span> nodes).
 */
export default function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // Revert the icon back to the copy glyph after a short confirmation window.
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can reject on insecure origins / permissions; fail silently.
    }
  };

  return (
    <div className="code-block-wrap">
      <pre ref={preRef} {...props} />
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Code copied" : "Copy code"}
        title={copied ? "Copied" : "Copy"}
        className="code-copy-btn"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
