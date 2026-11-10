"use client";

import { useEffect, useState } from "react";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  Minus,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TiptapEditorProps = {
  name: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
};

/**
 * Normalizes rich content copied from Google Docs, MS Word, and web pages
 * into clean, standard semantic HTML tags that Tiptap parses perfectly.
 */
function normalizePastedHtml(html: string): string {
  if (!html) return html;

  let clean = html;

  // 1. Remove Google Docs internal wrapper (<b style="font-weight:normal;" id="docs-internal-guid-...">)
  clean = clean.replace(
    /<b\s+[^>]*id="docs-internal-guid-[^"]*"[^>]*>([\s\S]*?)<\/b>/gi,
    "$1"
  );

  // 2. Normalize bold formatting from Google Docs (<span style="font-weight: 700"> -> <strong>)
  clean = clean.replace(
    /<span[^>]*style="[^"]*font-weight:\s*(?:700|bold)[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    "<strong>$1</strong>"
  );
  clean = clean.replace(/<b\b[^>]*>([\s\S]*?)<\/b>/gi, "<strong>$1</strong>");

  // 3. Normalize italic formatting (<span style="font-style: italic"> -> <em>)
  clean = clean.replace(
    /<span[^>]*style="[^"]*font-style:\s*italic[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    "<em>$1</em>"
  );
  clean = clean.replace(/<i\b[^>]*>([\s\S]*?)<\/i>/gi, "<em>$1</em>");

  // 4. Normalize strikethrough (<span style="text-decoration: line-through"> -> <s>)
  clean = clean.replace(
    /<span[^>]*style="[^"]*text-decoration:\s*line-through[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    "<s>$1</s>"
  );
  clean = clean.replace(/<strike\b[^>]*>([\s\S]*?)<\/strike>/gi, "<s>$1</s>");

  // 5. Clean Google Docs comments and fragments
  clean = clean.replace(/<!--[\s\S]*?-->/g, "");

  // 6. Strip noisy inline Google Docs styles while preserving tags
  clean = clean.replace(
    /<(p|h[1-6]|li|ul|ol)\s+[^>]*dir="ltr"[^>]*>/gi,
    "<$1>"
  );

  return clean;
}

export function TiptapEditor({
  name,
  defaultValue = "",
  className,
  placeholder,
}: TiptapEditorProps) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-medium hover:text-primary-hover",
        },
      }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      setHtml(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none min-h-[260px] px-4 py-3.5 focus:outline-none text-ink leading-relaxed",
          "[&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mt-4 [&_h2]:mb-2",
          "[&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-3 [&_h3]:mb-1.5",
          "[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-caption"
        ),
      },
      transformPastedHTML(pastedHtml) {
        return normalizePastedHtml(pastedHtml);
      },
    },
  });

  // Sync initial defaultValue if loaded dynamically
  useEffect(() => {
    if (editor && defaultValue && editor.isEmpty) {
      editor.commands.setContent(defaultValue);
    }
  }, [editor, defaultValue]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL:", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className={cn("rounded-xl border border-line bg-surface shadow-2xs overflow-hidden", className)}>
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-line bg-bg/50 px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={editor?.isActive("bold") ? "secondary" : "ghost"}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor?.isActive("italic") ? "secondary" : "ghost"}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor?.isActive("strike") ? "secondary" : "ghost"}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className="h-8 w-8 p-0"
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-line/80 mx-1" />

          <Button
            type="button"
            size="sm"
            variant={editor?.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-8 px-2 text-xs font-semibold"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4 mr-0.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor?.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            className="h-8 px-2 text-xs font-semibold"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4 mr-0.5" />
          </Button>

          <div className="h-4 w-px bg-line/80 mx-1" />

          <Button
            type="button"
            size="sm"
            variant={editor?.isActive("bulletList") ? "secondary" : "ghost"}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0"
            title="Bulleted List"
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor?.isActive("orderedList") ? "secondary" : "ghost"}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor?.isActive("blockquote") ? "secondary" : "ghost"}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className="h-8 w-8 p-0"
            title="Quote block"
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            className="h-8 w-8 p-0"
            title="Divider Line"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-line/80 mx-1" />

          <Button
            type="button"
            size="sm"
            variant={editor?.isActive("link") ? "secondary" : "ghost"}
            onClick={setLink}
            className="h-8 w-8 p-0"
            title="Insert / Edit Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          {editor?.isActive("link") && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor?.chain().focus().unsetLink().run()}
              className="h-8 w-8 p-0"
              title="Remove Link"
            >
              <Unlink className="h-4 w-4 text-caption" />
            </Button>
          )}
        </div>

        {/* GOOGLE DOCS / WORD COMPATIBILITY PILL */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-caption font-medium pr-1">
          <Sparkles className="h-3 w-3 text-primary" />
          <span>Google Docs &amp; Word formatted paste active</span>
        </div>
      </div>

      {/* EDITOR CONTENT AREA */}
      <EditorContent editor={editor} />

      {/* Hidden input for standard HTML form submission */}
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}
