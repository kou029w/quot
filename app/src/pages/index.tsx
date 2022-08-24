import { createResource, For } from "solid-js";
import type Pages from "../protocol/pages";
import Cards from "../components/cards";
import Card from "../components/card";

async function fetchPages(): Promise<Pages.Response> {
  const res = await fetch(
    new URL("/pages?order=updated.desc", import.meta.env.QUOT_API_URL)
  );
  const data = (await res.json()) as Pages.Response;
  return data;
}

export default () => {
  const [pages] = createResource("pages", fetchPages);

  return (
    <main>
      {() => (
        <Cards>
          <For each={pages()}>
            {(page) => (
              <a href={`/${page.id}`}>
                <Card {...page} />
              </a>
            )}
          </For>
        </Cards>
      )}
    </main>
  );
};
