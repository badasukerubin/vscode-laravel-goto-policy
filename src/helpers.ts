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

  static async getAbilityFragment(
    ability: string,
    policyPath: string
  ): Promise<number> {
    const abilityMethod = `function ${ability}(`;

    return await workspace.openTextDocument(policyPath).then((document) => {
      const index = document.getText().indexOf(abilityMethod);

      return document.positionAt(index).line;
    });
  }
}
