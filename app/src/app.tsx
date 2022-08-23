import "./app.css";
import { createSignal } from "solid-js";
import Index from "./pages/index";
import Page from "./pages/page";

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
        <a href="/new">📄</a>
      </header>
      {routes[pathname()] ?? <Page id={Number(pathname().slice(1))} />}
    </>
  );
};
