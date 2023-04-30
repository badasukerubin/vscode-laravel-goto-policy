import { workspace } from "vscode";

export default class Helpers {
  static parseAbilityAndArgument(ability: string, argument: string): string {
    const policyFile = argument.replace(/::class/, "Policy");

    return policyFile;
  }

  static getPolicyPath(policyFile: string): string {
    const policyPath = `App/Policies/${policyFile}`;

    return policyPath;
  }

  static async asyncGetAbilityFragment(
    ability: string,
    policyPath: string
  ): Promise<number> {
    const abilityMethod = `function ${ability}(`;

    return await workspace.openTextDocument(policyPath).then((document) => {
      const index = document.getText().indexOf(abilityMethod);

      return document.positionAt(index).line;
    });
  }

  static getAbilityFragment(ability: string, policyPath: string): number {
    let line: string;
    let lineNumber = 0;
    const lineByLine = require("n-readlines");
    const file = new lineByLine(policyPath);
    const abilityMethod = `function ${ability}(`;

    while ((line = file.next())) {
      lineNumber++;
      line = line.toString();

      if (line.toString().includes(abilityMethod)) {
        return lineNumber;
      }
    }

    return -1;
  }
}
