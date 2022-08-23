import "./editor.css";

export default () => (
  <textarea
    class="editor"
    autofocus
    onInput={(e) => {
      e.currentTarget.setAttribute(
        "rows",
        String(Math.max(2, e.currentTarget.value.split("\n").length))
      );
    }}
  ></textarea>
);
