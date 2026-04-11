"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export default function KatexCopyMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; tex: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const closeMenu = useCallback(() => {
    setMenu(null);
    setCopied(false);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const katexEl = target.closest(".katex");
      if (!katexEl) return;

      const annotation = katexEl.querySelector(
        'annotation[encoding="application/x-tex"]'
      );
      if (!annotation?.textContent) return;

      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY, tex: annotation.textContent });
      setCopied(false);
    };

    container.addEventListener("contextmenu", handleContextMenu);
    return () => container.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const handleClick = () => closeMenu();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [menu, closeMenu]);

  const handleCopy = async () => {
    if (!menu) return;
    await navigator.clipboard.writeText(menu.tex);
    setCopied(true);
    setTimeout(closeMenu, 800);
  };

  return (
    <div ref={containerRef}>
      {children}
      {menu && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg py-1 min-w-[180px]"
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCopy}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {copied ? "Copied!" : "Copy LaTeX Source"}
          </button>
        </div>
      )}
    </div>
  );
}
