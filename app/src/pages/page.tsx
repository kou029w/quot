import { createResource } from "solid-js";
import type Pages from "../protocol/pages";
import Editor from "../components/editor";
import beforeunload from "../helpers/beforeunload";
import throttle from "../helpers/throttle";

const intervalMs = 333;
const { block, unblock } = beforeunload();

async function updatePage(
  id: number,
  content: Pages.RequestContentPage
): Promise<boolean> {
  const res = await fetch(
    new URL(`/pages?id=eq.${id}`, import.meta.env.QUOT_API_URL),
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    }
  );
  return res.ok;
}

async function fetchPage(id: number): Promise<Pages.RequestContentPage> {
  const res = await fetch(
    new URL(`/pages?id=eq.${id}`, import.meta.env.QUOT_API_URL)
  );
  const data = (await res.json()) as Pages.Response;
  return data[0]!;
}

export default (props: { id: number }) => {
  const [page, { refetch }] = createResource(props.id, fetchPage);
  const throttledUpdate = throttle(
    async (id: number, content: Pages.RequestContentPage) => {
      if (await updatePage(id, content)) {
        unblock();
        refetch();
        window.history.replaceState({}, "", `/${id}`);
      }
    },
    intervalMs
  );

  function onUpdatePage(content: Pages.RequestContentPage) {
    block();
    throttledUpdate(props.id, content);
  }

  return (
    <main>
      <Editor id={props.id} onUpdatePage={onUpdatePage} />
      <pre>{() => JSON.stringify(page(), null, " ")}</pre>
    </main>
  );
};
