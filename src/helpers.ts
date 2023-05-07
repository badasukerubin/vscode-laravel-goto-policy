import { workspace } from "vscode";

export default class Helpers {
  static config = workspace.getConfiguration("laravel_goto_policy");

  static getAbility(ability: string): string[] {
    ability = ability.replace(/['"]+/g, "");

    if (ability.startsWith("[")) {
      ability = ability.replace("[", "").replace("]", "");

      return ability.split(",").map((ability) => {
        return ability.trim();
      });
    } else {
      return [ability];
    }
  }

  static getArgument(argument: string): string {
    argument = argument.replace(/['"]+/g, "");

    if (argument.startsWith("[")) {
      argument = argument.replace("[", "").replace("]", "");

      return argument.split(",")?.[0];
    } else {
      return argument;
    }
  }

  static parseArgument(argument: string): string {
    if (argument.includes("::class")) {
      return argument.replace(/::class/, "Policy");
    }

    if (argument.startsWith("$")) {
      if (argument.startsWith("$this->")) {
        argument = argument.replace("this->", "");
      }

      if (argument.includes("->")) {
        argument = argument.split("->").pop() as string;
      }

      return argument
        .replace("$", "")
        .replace(/^\w/, (c) => c.toUpperCase())
        .concat("Policy");
    }

    return argument;
  }

  static getPolicyFilePath(policyFile: string): string {
    const policyPath = this.config.policyPath ?? "app/Policies";
    const policyFilePath = `${policyPath}/${policyFile}`;

    return policyFilePath;
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
    let lineNumber = 1;
    const lineByLine = require("n-readlines");
    const file = new lineByLine(policyPath);
    const abilityMethod = `function ${ability}(`;

    while ((line = file.next())) {
      lineNumber++;
      line = line.toString();

      if (line.toString().includes(abilityMethod)) {
        return lineNumber - 1;
      }
    }

    return lineNumber;
  }
}
