import type { JSX } from "solid-js";
import "./cards.css";

export default (props: { children: JSX.Element }) => (
  <div class="cards">{props.children}</div>
);
