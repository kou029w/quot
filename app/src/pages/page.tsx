import { createResource } from "solid-js";
import Editor from "../components/editor";

type PageResponse = {
  id: number;
  title: string;
  text: string;
  created: string;
  updated: string;
};

async function fetchPage(id: number): Promise<PageResponse> {
  const res = await fetch(
    new URL(`/pages?id=eq.${id}`, import.meta.env.QUOT_API_URL)
  );
  const [data] = await res.json();
  return data as PageResponse;
}

export default (props: { id: number }) => {
  const [page] = createResource(props.id, fetchPage);

  return (
    <main>
      <Editor id={props.id} />
      <pre>{() => JSON.stringify(page(), null, " ")}</pre>
    </main>
  );
};
