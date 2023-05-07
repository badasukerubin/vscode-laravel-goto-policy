import { ExtensionContext, commands, languages, window } from "vscode";
import HoverProvider from "./providers/HoverProvider";
import LinkProvider from "./providers/LinkProvider";

export function activate(context: ExtensionContext) {
  const language = ["php"];

  const hover = languages.registerHoverProvider(language, new HoverProvider());
  const link = languages.registerDocumentLinkProvider(
    language,
    new LinkProvider()
  );

  context.subscriptions.push(hover, link);
}

export function deactivate() {}
