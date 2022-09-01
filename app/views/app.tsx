import "./app.css";
import { createSignal } from "solid-js";
import Index from "./pages/index";
import Page from "./pages/page";
import random from "./helpers/random";

const routes = {
  "/": Index,
};

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

  return () => (
    <>
      <header>
        <h1>
          <a href="/">Quot</a>
        </h1>
        <nav>
          <a href="/new">📄</a>
        </nav>
      </header>
      {routes[pathname()] ?? (
        <Page id={parseInt(pathname().slice(1), 16) || random()} />
      )}
    </>
  );
};
