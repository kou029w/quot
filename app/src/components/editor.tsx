import "./editor.css";
import beforeunload from "../helpers/beforeunload";
import throttle from "../helpers/throttle";

const intervalMs = 333;

const { block, unblock } = beforeunload();

const updatePage = throttle(async function (params: {
  id: number;
  title: string;
  text: string;
}) {
  const res = await fetch(
    new URL(`/pages?id=eq.${params.id}`, import.meta.env.QUOT_API_URL),
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(params),
    }
  );
  if (res.ok) unblock();
},
intervalMs);

export default (props: { id: number }) => {
  return (
    <textarea
      id={String(props.id)}
      class="editor"
      autofocus
      onInput={(e) => {
        const text = e.currentTarget.value;
        const lines = text.split("\n");
        block();
        updatePage({ id: props.id, title: lines[0] ?? "", text });
        e.currentTarget.setAttribute("rows", String(Math.max(2, lines.length)));
      }}
    ></textarea>
  );
};
