import {
  $createLineBreakNode,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  createEditor,
} from "lexical";
import { registerPlainText } from "@lexical/plain-text";
import { onCleanup, onMount } from "solid-js";
import type Pages from "../protocol/pages";
import "./editor.css";

const editor = createEditor();

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
    if (root.getFirstChild()) return;
    const paragraphNode = $createParagraphNode();
    const text = props.text
      .split("\n")
      .flatMap((line) => [$createTextNode(line), $createLineBreakNode()])
      .slice(0, -1);
    paragraphNode.append(...text);
    root.append(paragraphNode);
  };
  onCleanup(registerPlainText(editor, initialEditorState));
  onMount(() => {
    onCleanup(
      editor.registerTextContentListener((text) => {
        const [title] = text.split("\n");
        props.onUpdatePage({ id: props.id, title: title ?? "", text });
      })
    );
    editor.focus();
  });
  return <article ref={ref} class="editor" contenteditable />;
};
