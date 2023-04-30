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
  private fargment: number = 1;

  provideDocumentLinks(
    document: TextDocument,
    token: CancellationToken
  ): ProviderResult<DocumentLink[]> {
    try {
      const documentLinks: DocumentLink[] = [];
      const config = workspace.getConfiguration("laravel_goto_policy");
      const policyRegex = new RegExp(config.policyRegex);
      const abilityRegex = new RegExp(config.abilityRegex);
      const argumentRegex = new RegExp(config.argumentRegex);
      const workspacePath = workspace.getWorkspaceFolder(document.uri)?.uri
        .fsPath;

      let index = 0;

      while (index < document.lineCount) {
        const line = document.lineAt(index);
        const policyLineText = line.text.match(policyRegex);

        if (policyLineText !== null) {
          for (let policyText of policyLineText) {
            const ability = policyText.match(abilityRegex)?.[0] as string;
            const argument = policyText.match(argumentRegex)?.[0] as string;
            const policyFile = Helpers.parseAbilityAndArgument(
              ability,
              argument
            );
            const policyPath = Helpers.getPolicyPath(policyFile);
            const policyFullPath = `${workspacePath}/${policyPath}.php`;
            const fragment = Helpers.getAbilityFragment(
              ability,
              policyFullPath
            ).then((fragment) => {
              this.fargment = fragment + 1;
            });

            const policyPathUri = Uri.file(policyFullPath).with({
              fragment: `L${this.fargment}`,
            });

            if (!existsSync(policyPathUri.path)) {
              continue;
            }

            const start = new Position(
              line.lineNumber,
              line.text.indexOf(policyText)
            );
            const end = start.translate(0, policyText.length);

            const range = new Range(start, end);

            const documentLink = new DocumentLink(range, policyPathUri);

            documentLinks.push(documentLink);
          }
        }

        index++;
      }

      return documentLinks;
    } catch (exception) {
      console.log(exception);
    }
  }
}
