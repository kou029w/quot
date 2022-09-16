import { onCleanup, onMount } from "solid-js";
import { minimalSetup } from "codemirror";
import { emacsStyleKeymap, indentWithTab } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import { EditorView, keymap } from "@codemirror/view";
import type Pages from "../../protocol/pages";
import "./editor.css";
import { quotHighlighting, quotLanguage } from "../../syntax/quot";

export default (props: {
  id: number;
  title: string;
  text: string;
  onUpdatePage: (content: Pages.RequestContentPage) => void;
}) => {
  let ref: HTMLElement;
  onMount(() => {
    const view = new EditorView({
      doc: props.text,
      selection: { anchor: props.text.length },
      parent: ref,
      extensions: [
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          const defaultTitle = new Date()
            .toLocaleDateString(navigator.language, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replaceAll("/", "-");
          const [heading, ...lines] = update.state.doc.toJSON();
          const title =
            heading?.trim() || (lines.length === 0 ? "" : defaultTitle);
          const text = [title, ...lines].join("\n");
          props.onUpdatePage({ id: props.id, title, text });
        }),
        EditorView.lineWrapping,
        indentUnit.of(" "),
        keymap.of([indentWithTab, ...emacsStyleKeymap]),
        minimalSetup,
        quotLanguage,
        quotHighlighting,
      ],
    });
    ref.addEventListener("click", (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (e.target.classList.contains("auto-link") && e.target.textContent) {
        window.open(e.target.textContent, "_blank", "noreferrer");
      }
    });
    onCleanup(() => view.destroy());
    view.focus();
  });
  return (
    <article
      ref={(el) => (ref = el)}
      id={props.id.toString(16)}
      class="editor"
    />
  );
};
