import { TextDocument, workspace } from "vscode";

export default class Helpers {
  static parseAbilityAndArgument(ability: string, argument: string): string {
    const policyFile = argument.replace(/::class/, "Policy");

    return policyFile;
  }

  static getPolicyPath(policyFile: string): string {
    const policyPath = `App/Policies/${policyFile}`;

    return policyPath;
  }
}
