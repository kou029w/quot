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
  ])
);
