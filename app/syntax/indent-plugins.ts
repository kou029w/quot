import { indentWithTab } from "@codemirror/commands";
import { indentService, indentUnit, syntaxTree } from "@codemirror/language";
import {
  type DecorationSet,
  type EditorView,
  type ViewUpdate,
  Decoration,
  ViewPlugin,
  WidgetType,
  keymap,
} from "@codemirror/view";

class IndentWidget extends WidgetType {
  constructor(readonly bullet: boolean) {
    super();
  }
  toDOM() {
    const indent = document.createElement("span");
    indent.textContent = this.bullet ? "•" : " ";
    indent.style.paddingInline = "0.5em";
    return indent;
  }
}

function indentDecorations(view: EditorView) {
  const decorations: Array<{
    from: number;
    to: number;
    value: Decoration;
  }> = [];
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter(node) {
        if (node.name === "Indent") {
          const next = view.state.doc.sliceString(node.to, node.to + 1);
          const decoration = Decoration.widget({
            widget: new IndentWidget(/^[^ \t]?$/.test(next)),
          });
          decorations.push(decoration.range(node.from));
        }
      },
    });
  }
  return Decoration.set(decorations);
}

const indentDecorationsPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = indentDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = indentDecorations(update.view);
      }
    }
  },
  {
    decorations(v) {
      return v.decorations;
    },
  }
);

const indentPlugins = [
  keymap.of([indentWithTab]),
  indentUnit.of(" "),
  indentService.of((context, pos) => {
    const previousLine = context.lineAt(pos, -1).text;
    if (previousLine.trim() === "") return null;
    return /^[ \t]*/.exec(previousLine)?.[0]?.length ?? null;
  }),
  indentDecorationsPlugin,
];

export default indentPlugins;
