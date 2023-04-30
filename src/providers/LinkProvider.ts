import {
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
import Provider from "./Provider";

export default class LinkProvider
  extends Provider
  implements DocumentLinkProvider
{
  private fragment: number = 1;

  provideDocumentLinks(document: TextDocument): ProviderResult<DocumentLink[]> {
    try {
      const documentLinks: DocumentLink[] = [];
      const workspacePath = workspace.getWorkspaceFolder(document.uri)?.uri
        .fsPath;

      let index = 0;

      while (index < document.lineCount) {
        const line = document.lineAt(index);
        const policyLineText = line.text.match(this.policyRegex);

        if (policyLineText !== null) {
          for (let policyText of policyLineText) {
            const ability = policyText.match(this.abilityRegex)?.[0] as string;
            const argument = policyText.match(
              this.argumentRegex
            )?.[0] as string;
            const policyFile = Helpers.parseAbilityAndArgument(
              ability,
              argument
            );
            const policyPath = Helpers.getPolicyPath(policyFile);
            const policyFullPath = `${workspacePath}/${policyPath}.php`;
            const fragment = Helpers.getAbilityFragment(
              ability,
              policyFullPath
            );
            this.fragment = fragment;

            const policyPathUri = Uri.file(policyFullPath).with({
              fragment: `L${this.fragment}`,
            });

            console.log(policyPathUri);

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
