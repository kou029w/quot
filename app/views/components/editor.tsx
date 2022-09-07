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
import { onCleanup, onMount } from "solid-js";
import type Pages from "../../protocol/pages";
import "./editor.css";

const editor = createEditor({ nodes: [HeadingNode] });

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
    for (const [i, text] of props.text.split("\n").entries()) {
      const line = i === 0 ? $createHeadingNode("h2") : $createParagraphNode();
      const indent = text.match(/^\s*/)?.[0]?.length ?? 0;
      line.setIndent(indent);
      line.append($createTextNode(text.slice(indent)));
      root.append(line);
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
  return <article ref={ref} class="editor" contenteditable />;
};
