import "./app.css";
import { createSignal } from "solid-js";
import Index from "./pages/index";
import Page from "./pages/page";
import random from "./helpers/random";
import { decodeJwt } from "jose";

const routes = {
  "/": Index,
};

async function updateUser(jwt: string): Promise<boolean> {
  const decoded = decodeJwt(jwt);
  const id = decoded.sub ?? "";
  if (!id) return false;
  const res = await fetch(
    `${import.meta.env.QUOT_API_ENDPOINT}/users?id=eq.${encodeURIComponent(
      id
    )}`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${jwt}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ id }),
    }
  );
  return res.ok;
}

export default () => {
  const [pathname, setPathname] = createSignal(
    document.location.pathname as keyof typeof routes
  );

  document.body.addEventListener("click", (e) => {
    if (
      e.target instanceof HTMLAnchorElement &&
      e.target.origin === document.location.origin &&
      e.target.pathname in routes // TODO: support params ... solid router を入れよう
    ) {
      e.preventDefault();
      window.history.pushState({}, "", e.target.href);
      setPathname(e.target.pathname as keyof typeof routes);
    }
  });

  window.addEventListener("popstate", () => {
    setPathname(document.location.pathname as keyof typeof routes);
  });

  if (window.location.hash) {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const jwt = params.get("jwt");
    if (jwt) {
      window.history.replaceState({}, "", ".");
      window.localStorage.setItem("jwt", jwt);
      updateUser(jwt);
    }
  }

  const authenticated = Boolean(window.localStorage.getItem("jwt"));

  return () => (
    <>
      <header>
        <h1>
          <a href="/">Quot</a>
        </h1>
        <nav>
          <a href={authenticated ? "/new" : "/login"}>📄</a>
        </nav>
      </header>
      {routes[pathname()] ?? (
        <Page id={parseInt(pathname().slice(1), 16) || random()} />
      )}
    </>
  );
};
