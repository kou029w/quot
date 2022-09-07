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
        const lines = root
          .getChildren()
          .map(
            (line) =>
              `${" ".repeat(
                $isElementNode(line) ? line.getIndent() : 0
              )}${line.getTextContent()}`
          );
        const title = lines[0];
        const text = lines.join("\n");
        props.onUpdatePage({ id: props.id, title: title ?? "", text });
      })
    )
  );
  onMount(() => editor.focus());
  return <article ref={ref} class="editor" contenteditable />;
};
