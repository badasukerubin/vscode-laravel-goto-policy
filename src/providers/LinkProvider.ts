import {
  CancellationToken,
  DocumentLink,
  DocumentLinkProvider,
  Position,
  ProviderResult,
  Range,
  TextDocument,
  Uri,
  workspace,
} from "vscode";
import Helpers from "../helpers";
import { existsSync } from "fs";

export default class LinkProvider implements DocumentLinkProvider {
  provideDocumentLinks(
    document: TextDocument,
    token: CancellationToken
  ): ProviderResult<DocumentLink[]> {
    const documentLinks: DocumentLink[] = [];
    const config = workspace.getConfiguration("laravel_goto_policy");
    const workspacePath = workspace.getWorkspaceFolder(document.uri)?.uri
      .fsPath;

    const argumentRegex = new RegExp(config.argumentRegex);
    let index = 0;

    while (index < document.lineCount) {
      const line = document.lineAt(index);
      const result = line.text.match(argumentRegex);

      if (result !== null) {
        for (let item of result) {
          const policyFile = Helpers.parseAbilityAndArgument("item", item);
          const policyPath = Helpers.getPolicyPath(policyFile);
          const policyPathUri = Uri.file(`${workspacePath}/${policyPath}.php`);

          console.log(policyPathUri);

          if (!existsSync(policyPathUri.path)) {
            continue;
          }

          const start = new Position(line.lineNumber, line.text.indexOf(item));
          const end = start.translate(0, item.length);

          const range = new Range(start, end);

          const documentLink = new DocumentLink(range, policyPathUri);

          documentLinks.push(documentLink);
        }
      }

      index++;
    }

    return documentLinks;
  }
}
