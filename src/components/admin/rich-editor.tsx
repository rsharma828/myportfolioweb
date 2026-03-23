"use client";

import { uploadFileAction } from "@/app/admin/actions";
import { statsFromHtml } from "@/lib/reading-stats";
import { VideoBlock } from "@/lib/tiptap-video-block";
import { cn } from "@/lib/utils";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type RichEditorProps = {
  name: string;
  defaultHtml?: string;
  uploadPrefix: string;
  assetBaseUrl: string;
  placeholder?: string;
  /** default = full toolbar; compact = small toolbar; medium* = Medium-style (bubble menu, no top bar) */
  variant?: "default" | "compact" | "medium" | "mediumCompact";
  /** Show word count + est. read time (medium layout). Default: true for `medium`, false for `mediumCompact`. */
  showReadingStats?: boolean;
  /** Floating “+” on empty lines to insert blocks (Medium-style). Default: true for medium variants. */
  showFloatingInsert?: boolean;
  className?: string;
  id?: string;
};

function publicUrlForKey(assetBaseUrl: string, key: string): string {
  const k = key.replace(/^\//, "");
  if (key.startsWith("http://") || key.startsWith("https://")) return key;
  const base = assetBaseUrl.replace(/\/$/, "");
  if (!base) return key;
  return `${base}/${k}`;
}

async function uploadBinaryFile(
  uploadPrefix: string,
  assetBaseUrl: string,
  file: File,
): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const sub =
    file.type.startsWith("video/") && !uploadPrefix.includes("/video")
      ? `${uploadPrefix.replace(/\/$/, "")}/video`
      : uploadPrefix.replace(/\/$/, "");
  fd.append("prefix", sub);
  const key = await uploadFileAction(fd);
  return publicUrlForKey(assetBaseUrl, key);
}

function BubbleToolbar({
  editor,
  onPickImage,
}: {
  editor: Editor;
  onPickImage: () => void;
}) {
  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const next = window.prompt("Link URL", prev ?? "https://");
    if (next === null) return;
    if (next === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: next }).run();
  }, [editor]);

  const Btn = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md px-1.5 text-sm transition-colors",
        active ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
      )}
    >
      {children}
    </button>
  );

  return (
    <BubbleMenu
      editor={editor}
      className="flex flex-wrap items-center gap-0.5 rounded-lg border border-zinc-200 bg-white px-1 py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
    >
      <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Btn>
      <Btn
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="text-xs font-semibold underline">U</span>
      </Btn>
      <span className="mx-0.5 h-5 w-px bg-zinc-200 dark:bg-zinc-700" aria-hidden />
      <Btn title="Link" active={editor.isActive("link")} onClick={setLink}>
        <Link2 className="h-4 w-4" />
      </Btn>
      <Btn title="Image" onClick={onPickImage}>
        <ImageIcon className="h-4 w-4" />
      </Btn>
      <span className="mx-0.5 h-5 w-px bg-zinc-200 dark:bg-zinc-700" aria-hidden />
      <Btn
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Btn>
      <Btn
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Btn>
      <Btn
        title="Ordered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Btn>
      <Btn
        title="Code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code2 className="h-4 w-4" />
      </Btn>
    </BubbleMenu>
  );
}

function ClassicToolbar({
  editor,
  onPickImage,
  compact,
}: {
  editor: Editor;
  onPickImage: () => void;
  compact: boolean;
}) {
  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const next = window.prompt("Link URL", prev ?? "https://");
    if (next === null) return;
    if (next === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: next }).run();
  }, [editor]);

  const Btn = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-sm transition-colors",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 px-2 py-1.5">
        <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Btn>
        <Btn
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Btn>
        <Btn
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Btn>
        <Btn title="Link" active={editor.isActive("link")} onClick={setLink}>
          <Link2 className="h-4 w-4" />
        </Btn>
        <Btn title="Image" onClick={onPickImage}>
          <ImageIcon className="h-4 w-4" />
        </Btn>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 px-2 py-2">
      <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Btn>
      <Btn
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Btn>
      <Btn
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Btn>
      <Btn
        title="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code2 className="h-4 w-4" />
      </Btn>
      <span className="mx-1 h-6 w-px bg-border" aria-hidden />
      <Btn
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Btn>
      <Btn
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Btn>
      <Btn
        title="Ordered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Btn>
      <Btn
        title="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 className="h-4 w-4" />
      </Btn>
      <Btn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </Btn>
      <span className="mx-1 h-6 w-px bg-border" aria-hidden />
      <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </Btn>
      <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </Btn>
      <Btn title="Link" active={editor.isActive("link")} onClick={setLink}>
        <Link2 className="h-4 w-4" />
      </Btn>
      <Btn title="Image" onClick={onPickImage}>
        <ImageIcon className="h-4 w-4" />
      </Btn>
    </div>
  );
}

/** Left-rail “+” on empty lines — insert blocks without hunting the toolbar (Medium-style). */
function FloatingInsertMenu({
  editor,
  onPickMedia,
}: {
  editor: Editor;
  onPickMedia: () => void;
}) {
  const Fab = ({
    title,
    onClick,
    children,
  }: {
    title: string;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {children}
    </button>
  );

  return (
    <FloatingMenu
      editor={editor}
      options={{ placement: "left-start", offset: 8 }}
      shouldShow={({ editor: ed }) => {
        const { selection } = ed.state;
        if (!selection.empty) return false;
        const { $from } = selection;
        const parent = $from.parent;
        if (!parent.type.name || parent.type.name === "doc") return false;
        if (parent.type.name !== "paragraph") return false;
        return parent.content.size === 0;
      }}
      className="flex items-center gap-0.5 rounded-full border border-zinc-200 bg-white/95 px-1 py-0.5 shadow-md backdrop-blur-sm dark:border-zinc-600 dark:bg-zinc-900/95"
    >
      <span className="pl-1 pr-0.5 text-zinc-400" aria-hidden>
        <Plus className="h-4 w-4" />
      </span>
      <Fab title="Heading" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </Fab>
      <Fab title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </Fab>
      <Fab title="Bulleted list" onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </Fab>
      <Fab title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </Fab>
      <Fab title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code2 className="h-4 w-4" />
      </Fab>
      <Fab title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </Fab>
      <Fab title="Image" onClick={onPickMedia}>
        <ImageIcon className="h-4 w-4" />
      </Fab>
      <Fab title="Video" onClick={onPickMedia}>
        <Video className="h-4 w-4" />
      </Fab>
    </FloatingMenu>
  );
}

export function RichEditor({
  name,
  defaultHtml = "",
  uploadPrefix,
  assetBaseUrl,
  placeholder = "Write something…",
  variant = "default",
  showReadingStats,
  showFloatingInsert,
  className,
  id,
}: RichEditorProps) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const uploadPrefixRef = useRef(uploadPrefix);
  const assetBaseRef = useRef(assetBaseUrl);
  const reactId = useId();
  const editorId = id ?? `${reactId}-editor`;

  uploadPrefixRef.current = uploadPrefix;
  assetBaseRef.current = assetBaseUrl;

  const isMedium = variant === "medium" || variant === "mediumCompact";
  const showStats = showReadingStats ?? variant === "medium";
  const showFloatMenu = showFloatingInsert ?? isMedium;

  const [readingStats, setReadingStats] = useState({ words: 0, minutes: 0 });

  const syncHidden = useCallback((ed: Editor) => {
    if (hiddenRef.current) hiddenRef.current.value = ed.getHTML();
  }, []);

  const extensions = [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      codeBlock: { HTMLAttributes: { class: "rounded-md bg-muted p-4 font-mono text-sm" } },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      HTMLAttributes: {
        class: "text-primary underline underline-offset-4",
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: "rounded-lg border max-w-full h-auto my-6",
      },
    }),
    VideoBlock,
    Placeholder.configure({
      placeholder,
      emptyEditorClass:
        "is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground/60 before:float-left before:pointer-events-none before:h-0",
    }),
  ];

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions,
      content: defaultHtml || "<p></p>",
      onCreate: ({ editor: ed }) => {
        editorRef.current = ed;
        syncHidden(ed);
      },
      onDestroy: () => {
        editorRef.current = null;
      },
      editorProps: {
        attributes: {
          id: editorId,
          class: cn(
            "focus:outline-none min-h-[inherit] max-w-none",
            isMedium
              ? cn(
                  "prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-headings:font-semibold",
                  variant === "mediumCompact" ? "min-h-[200px] px-0 py-2 prose-sm" : "min-h-[min(70vh,720px)] px-0 py-4 text-lg",
                )
              : cn(
                  "prose prose-sm dark:prose-invert max-w-none px-3 py-3",
                  variant === "compact" ? "min-h-[140px]" : "min-h-[320px]",
                ),
          ),
        },
        handleDrop: (_view, event, _slice, moved) => {
          if (moved) return false;
          const dataTransfer = event.dataTransfer;
          if (!dataTransfer?.files?.length) return false;
          const file = dataTransfer.files[0];
          if (!file) return false;
          event.preventDefault();
          const ed = editorRef.current;
          if (!ed) return false;
          void (async () => {
            if (file.type.startsWith("image/")) {
              const url = await uploadBinaryFile(uploadPrefixRef.current, assetBaseRef.current, file);
              ed.chain().focus().setImage({ src: url, alt: "" }).run();
            } else if (file.type.startsWith("video/")) {
              const url = await uploadBinaryFile(uploadPrefixRef.current, assetBaseRef.current, file);
              ed.chain().focus().insertContent({ type: "videoBlock", attrs: { src: url } }).run();
              ed.chain().focus().insertContent("<p></p>").run();
            }
            syncHidden(ed);
          })();
          return true;
        },
        handlePaste: (_view, event) => {
          const file = event.clipboardData?.files?.[0];
          if (!file?.type.startsWith("image/")) return false;
          event.preventDefault();
          const ed = editorRef.current;
          if (!ed) return false;
          void (async () => {
            const url = await uploadBinaryFile(uploadPrefixRef.current, assetBaseRef.current, file);
            ed.chain().focus().setImage({ src: url, alt: "" }).run();
            syncHidden(ed);
          })();
          return true;
        },
        handleKeyDown: (_view, event) => {
          if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            const ed = editorRef.current;
            if (!ed) return true;
            const prev = ed.getAttributes("link").href as string | undefined;
            const next = window.prompt("Link URL", prev ?? "https://");
            if (next === null) return true;
            if (next === "") ed.chain().focus().extendMarkRange("link").unsetLink().run();
            else ed.chain().focus().extendMarkRange("link").setLink({ href: next }).run();
            syncHidden(ed);
            return true;
          }
          return false;
        },
      },
      onUpdate: ({ editor: ed }) => {
        syncHidden(ed);
        if (showStats) setReadingStats(statsFromHtml(ed.getHTML()));
      },
    },
    [editorId, placeholder, variant, syncHidden, isMedium, showStats],
  );

  const onPickImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !editor) return;
      if (file.type.startsWith("image/")) {
        const url = await uploadBinaryFile(uploadPrefix, assetBaseUrl, file);
        editor.chain().focus().setImage({ src: url, alt: "" }).run();
      } else if (file.type.startsWith("video/")) {
        const url = await uploadBinaryFile(uploadPrefix, assetBaseUrl, file);
        editor.chain().focus().insertContent({ type: "videoBlock", attrs: { src: url } }).run();
        editor.chain().focus().insertContent("<p></p>").run();
      }
      syncHidden(editor);
    },
    [editor, uploadPrefix, assetBaseUrl, syncHidden],
  );

  useEffect(() => {
    if (hiddenRef.current && editor) {
      hiddenRef.current.value = editor.getHTML();
      if (showStats) setReadingStats(statsFromHtml(editor.getHTML()));
    }
  }, [editor, showStats]);

  const compact = variant === "compact";
  const showClassicToolbar = !isMedium && editor;

  return (
    <div
      className={cn(
        isMedium ? "bg-transparent" : "rounded-lg border bg-background shadow-sm overflow-hidden",
        className,
      )}
    >
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultHtml} />
      <input ref={imageInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
      {showClassicToolbar ? <ClassicToolbar editor={editor} onPickImage={onPickImage} compact={compact} /> : null}
      {editor && isMedium ? (
        <>
          <BubbleToolbar editor={editor} onPickImage={onPickImage} />
          {showFloatMenu ? <FloatingInsertMenu editor={editor} onPickMedia={onPickImage} /> : null}
          <p className="sr-only">
            After selecting text, use the floating toolbar for formatting. Use the plus menu on an empty line to insert
            blocks. Drag images or video files into the editor.
          </p>
        </>
      ) : null}
      <div className={cn(!isMedium && "bg-muted/20", isMedium ? "pb-8" : "", compact ? "min-h-[160px]" : !isMedium ? "min-h-[360px]" : "")}>
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <div
            className={cn(
              "text-sm text-muted-foreground",
              isMedium ? "min-h-[40vh] py-12" : compact ? "min-h-[140px] px-3 py-8" : "min-h-[320px] px-3 py-8",
            )}
          >
            Loading editor…
          </div>
        )}
      </div>
      {isMedium ? (
        <div className="space-y-1.5 text-center">
          {showStats ? (
            <p className="text-xs tabular-nums text-muted-foreground">
              {readingStats.words.toLocaleString()} words · {readingStats.minutes} min read
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground/80">
            Select text for formatting · <kbd className="rounded border border-border px-1 py-0.5 font-mono text-[10px]">⌘K</kbd>{" "}
            / <kbd className="rounded border border-border px-1 py-0.5 font-mono text-[10px]">Ctrl+K</kbd> link · Empty line{" "}
            <span className="inline-flex items-center gap-0.5">
              <Plus className="inline h-3 w-3" /> insert
            </span>{" "}
            · Drag & drop media · Paste images
          </p>
        </div>
      ) : !compact ? (
        <div className="flex items-center justify-end gap-2 border-t px-2 py-2 text-xs text-muted-foreground">
          <span>Drag images in or paste screenshots. Rich text is saved as HTML.</span>
        </div>
      ) : null}
    </div>
  );
}
