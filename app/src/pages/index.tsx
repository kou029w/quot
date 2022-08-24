import { createResource } from "solid-js";
import type Pages from "../protocol/pages";

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
      <pre>{() => JSON.stringify(pages(), null, " ")}</pre>
    </main>
  );
};
