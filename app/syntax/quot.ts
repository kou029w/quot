import { styleTags, tags as t } from "@lezer/highlight";
import {
  HighlightStyle,
  LRLanguage,
  syntaxHighlighting,
} from "@codemirror/language";
import { parser } from "./quot.grammar.js";

export const quotLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        Heading: t.heading,
        AutoLink: t.link,
        Code: t.monospace,
      }),
    ],
  }),
});

export const quotHighlighting = syntaxHighlighting(
  HighlightStyle.define([
    {
      tag: t.heading,
      fontWeight: "bold",
      fontSize: "1.25em",
      ".cm-line:has(> &)": {
        marginBlockEnd: "0.5em",
      },
    },
    {
      tag: t.link,
      class: "auto-link",
    },
    {
      tag: t.monospace,
      borderStyle: "solid",
      borderColor: "var(--nc-bg-3)",
      borderWidth: "1px",
      borderRadius: "0.25em",
      padding: "0.2em 0.4em",
      fontSize: "0.9em",
      fontFamily: "var(--nc-font-mono)",
    },
  ])
);
