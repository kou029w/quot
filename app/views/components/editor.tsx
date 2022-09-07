import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isElementNode,
  createEditor,
} from "lexical";
import { registerHistory, createEmptyHistoryState } from "@lexical/history";
import {
  $createHeadingNode,
  HeadingNode,
  registerRichText,
} from "@lexical/rich-text";
import { $createAutoLinkNode, AutoLinkNode } from "@lexical/link";
import { onCleanup, onMount } from "solid-js";
import type Pages from "../../protocol/pages";
import "./editor.css";

const urlMatcher = /https?:\/\/[^\s]+/;
const editor = createEditor({ nodes: [HeadingNode, AutoLinkNode] });

function ref(el: HTMLElement) {
  editor.setRootElement(el);
}

export default (props: {
  id: number;
  title: string;
  text: string;
  onUpdatePage: (content: Pages.RequestContentPage) => void;
}) => {
  const initialEditorState = () => {
    const root = $getRoot();
    const [title, ...lines] = props.text.split("\n");
    const titleNode = $createHeadingNode("h2");
    titleNode.append($createTextNode(title));
    root.append(titleNode);
    for (const line of lines) {
      const lineNode = $createParagraphNode();
      const indent = line.match(/^\s*/)?.[0]?.length ?? 0;
      lineNode.setIndent(indent);
      let text = line.slice(indent);
      let match: RegExpMatchArray | null = null;
      while ((match = text.match(urlMatcher))) {
        const offset = text.slice(0, match.index!);
        const input = match[0]!;
        const link = $createAutoLinkNode(input);
        link.append($createTextNode(match[0]));
        lineNode.append($createTextNode(offset), link);
        text = text.slice(offset.length + input.length);
      }
      lineNode.append($createTextNode(text));
      root.append(lineNode);
    }
  };
  onCleanup(registerRichText(editor, initialEditorState));
  onCleanup(registerHistory(editor, createEmptyHistoryState(), 333));
  onCleanup(
    editor.registerUpdateListener(() =>
      editor.update(() => {
        const root = $getRoot();
        const defaultTitle = new Date()
          .toLocaleDateString(navigator.language, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replaceAll("/", "-");
        const [titleNode, ...lineNodes] = root.getChildren();
        const title =
          titleNode?.getTextContent().trim() ||
          (lineNodes.length === 0 ? "" : defaultTitle);
        const lines = lineNodes.map((line) => {
          const indent = $isElementNode(line) ? line.getIndent() : 0;
          return `${" ".repeat(indent)}${line.getTextContent()}`;
        });
        const text = [title, ...lines].join("\n");
        props.onUpdatePage({ id: props.id, title, text });
      })
    )
  );
  onMount(() => editor.focus());
  return (
    <article
      ref={ref}
      onclick={(e) => {
        const el = e.target.parentElement;
        if (el instanceof HTMLAnchorElement) {
          window.open(el.href, "_blank", "noreferrer");
        }
      }}
      class="editor"
      contenteditable
    />
  );
};
