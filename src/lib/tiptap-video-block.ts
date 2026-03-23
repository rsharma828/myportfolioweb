import { mergeAttributes, Node } from "@tiptap/core";

/** Block-level uploaded video — stored as `<video>` in HTML output. */
export const VideoBlock = Node.create({
  name: "videoBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: "true",
        playsInline: "true",
        class: "w-full max-w-full rounded-lg my-6 border border-border bg-black/5",
      }),
    ];
  },
});
