import {
  HoverProvider as BaseHoverProvider,
  Hover,
  MarkdownString,
  Position,
  ProviderResult,
  TextDocument,
} from "vscode";
import Helpers from "../helpers";
import Provider from "./Provider";

export default class HoverProvider
  extends Provider
  implements BaseHoverProvider
{
  public provideHover(
    document: TextDocument,
    position: Position
  ): ProviderResult<Hover> {
    try {
      const policyHoverRange = document.getWordRangeAtPosition(
        position,
        this.policyRegex
      );

      if (!policyHoverRange) {
        return;
      }

      const policy = document.getText(policyHoverRange);
      const ability = policy.match(this.abilityRegex)?.[0] as string;
      const argument = policy.match(this.argumentRegex)?.[0] as string;

      const policyFile = Helpers.parseAbilityAndArgument(ability, argument);
      const policyPath = Helpers.getPolicyPath(policyFile);

      return new Hover(new MarkdownString(`*${policyFile}*: ${policyPath}`));
    } catch (exception) {
      console.log(exception);
    }
  }
}
