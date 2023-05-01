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

  const disposable = commands.registerCommand(
    "vscode-laravel-goto-policy.helloWorld",
    () => {
      window.showInformationMessage(
        "Hello World from vscode-laravel-goto-policy!"
      );
    }
  );

  context.subscriptions.push(hover, link, disposable);
}

export function deactivate() {}
