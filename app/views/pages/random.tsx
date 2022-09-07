import { createEffect, createResource } from "solid-js";
import type Pages from "../../protocol/pages";
import random from "../helpers/random";

async function randomPage(): Promise<Pages.ResponsePage> {
  const jwt = window.localStorage.getItem("jwt");
  const res = await fetch(
    `${import.meta.env.QUOT_API_ENDPOINT}/pages?order=random&limit=1`,
    { headers: jwt ? { authorization: `Bearer ${jwt}` } : {} }
  );
  const data = (await res.json()) as Pages.Response;
  return data[0]!;
}

export default () => {
  const [page] = createResource(random(), randomPage);
  createEffect(() => {
    if (!page.loading) window.location.replace(`/${page()!.id.toString(16)}`);
  });
  return null;
};
