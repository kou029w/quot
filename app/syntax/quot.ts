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
        Indent: t.separator,
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
      marginBlockEnd: "0.5em",
    },
    {
      tag: t.separator,
      letterSpacing: "1.5em",
      "&:last-child:after": {
        content: `"•"`,
        marginInline: "-0.9em",
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
