import { createResource } from "solid-js";
import type Pages from "../../protocol/pages";
import Editor from "../components/editor";
import beforeunload from "../helpers/beforeunload";
import throttle from "../helpers/throttle";

const { block, unblock } = beforeunload();

async function updatePage(
  id: number,
  content: Pages.RequestContentPage
): Promise<boolean> {
  const res = await fetch(
    `${import.meta.env.QUOT_API_URL}/api/pages?id=eq.${id}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    }
  );
  return res.ok;
}

async function deletePage(id: number): Promise<boolean> {
  const res = await fetch(
    `${import.meta.env.QUOT_API_URL}/api/pages?id=eq.${id}`,
    { method: "DELETE" }
  );
  return res.ok;
}

async function fetchPage(id: number): Promise<Pages.ResponsePage> {
  const res = await fetch(
    `${import.meta.env.QUOT_API_URL}/api/pages?id=eq.${id}`
  );
  const data = (await res.json()) as Pages.Response;
  return data[0]!;
}

export default (props: { id: number }) => {
  const [page] = createResource(props.id, fetchPage);
  const throttledUpdate = throttle(
    async (id: number, content: Pages.RequestContentPage) => {
      if (await (content.text ? updatePage(id, content) : deletePage(id))) {
        unblock();
        window.history.replaceState(
          {},
          "",
          `/${content.text ? id.toString(16) : "new"}`
        );
      }
    }
  );

  function onUpdatePage(content: Pages.RequestContentPage) {
    block();
    throttledUpdate(props.id, content);
  }

  return (
    <main>
      {() =>
        !page.loading && (
          <Editor
            id={props.id}
            title=""
            text=""
            {...page()}
            onUpdatePage={onUpdatePage}
          />
        )
      }
    </main>
  );
};
