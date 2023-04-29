import {
  HoverProvider as BaseHoverProvider,
  Hover,
  MarkdownString,
  Position,
  ProviderResult,
  TextDocument,
  workspace,
} from "vscode";
import Helpers from "../helpers";

export default class HoverProvider implements BaseHoverProvider {
  public provideHover(
    document: TextDocument,
    position: Position
  ): ProviderResult<Hover> {
    const config = workspace.getConfiguration("laravel_goto_policy");
    const abilityRegex = new RegExp(config.abilityRegex);
    const argumentRegex = new RegExp(config.argumentRegex);
    const abilityHoverRange = document.getWordRangeAtPosition(
      position,
      abilityRegex
    );

    console.log(123);

    if (!abilityHoverRange) {
      console.log("no abilityHoverRange");

      return;
    }

    const ability = document.getText(abilityHoverRange);
    const policyText = document.lineAt(position.line).text.trim();
    const argument = policyText.match(argumentRegex)?.[0] as string;
    const policyFile = Helpers.parseAbilityAndArgument(ability, argument);

    const policyPath = Helpers.getPolicyPath(policyFile);

    console.log("HoverProvider.provideHover", ability, policyPath);

    return new Hover(new MarkdownString(`*${policyFile}*: ${policyPath}`));
  }
}
