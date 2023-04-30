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
    try {
      const config = workspace.getConfiguration("laravel_goto_policy");
      const policyRegex = new RegExp(config.policyRegex);
      const abilityRegex = new RegExp(config.abilityRegex);
      const argumentRegex = new RegExp(config.argumentRegex);

      const policyHoverRange = document.getWordRangeAtPosition(
        position,
        policyRegex
      );

      if (!policyHoverRange) {
        return;
      }

      const policy = document.getText(policyHoverRange);
      const ability = policy.match(abilityRegex)?.[0] as string;
      const argument = policy.match(argumentRegex)?.[0] as string;

      const policyFile = Helpers.parseAbilityAndArgument(ability, argument);
      const policyPath = Helpers.getPolicyPath(policyFile);

      return new Hover(new MarkdownString(`*${policyFile}*: ${policyPath}`));
    } catch (exception) {
      console.log(exception);
    }
  }
}
