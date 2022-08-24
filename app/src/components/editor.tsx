import type Pages from "../protocol/pages";
import "./editor.css";

export default (props: {
  id: number;
  onUpdatePage: (content: Pages.RequestContentPage) => void;
}) => {
  return (
    <textarea
      id={String(props.id)}
      class="editor"
      autofocus
      onInput={(e) => {
        const text = e.currentTarget.value;
        const lines = text.split("\n");
        props.onUpdatePage({ id: props.id, title: lines[0] ?? "", text });
        e.currentTarget.setAttribute("rows", String(Math.max(2, lines.length)));
      }}
    ></textarea>
  );
};
