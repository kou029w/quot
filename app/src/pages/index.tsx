import { createResource } from "solid-js";

type PagesResponse = Array<{
  id: number;
  title: string;
  text: string;
  created: string;
  updated: string;
}>;

async function fetchPages(): Promise<PagesResponse> {
  const res = await fetch(
    new URL("/pages?order=updated.desc", import.meta.env.QUOT_API_URL)
  );
  const data = await res.json();
  return data as PagesResponse;
}

export default () => {
  const [pages] = createResource("pages", fetchPages);

  return (
    <main>
      <pre>{() => JSON.stringify(pages(), null, " ")}</pre>
    </main>
  );
};
