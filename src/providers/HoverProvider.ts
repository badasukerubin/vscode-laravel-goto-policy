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

      const policyText = document.getText(policyHoverRange);
      const abilityText = policyText.match(this.abilityRegex)?.[0] as string;
      const argumentText = policyText.match(this.argumentRegex)?.[0] as string;

      const ability = Helpers.getAbility(abilityText);
      const argument = Helpers.getArgument(argumentText);

      const policyFile = Helpers.parseArgument(argument);
      const policyPath = Helpers.getPolicyPath(policyFile);

      const markdownStrings = ability.map((ability) => {
        return new MarkdownString(`**${ability}**: ${policyPath}::${ability}`);
      });

      return new Hover(markdownStrings);
    } catch (exception) {
      console.log(exception);
    }
  }
}
