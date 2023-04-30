import { WorkspaceConfiguration, workspace } from "vscode";

export default class Provider {
  protected config: WorkspaceConfiguration;
  protected policyRegex: RegExp;
  protected abilityRegex: RegExp;
  protected argumentRegex: RegExp;

  constructor() {
    this.config = this.getConfig();
    this.policyRegex = new RegExp(this.config.policyRegex);
    this.abilityRegex = new RegExp(this.config.abilityRegex);
    this.argumentRegex = new RegExp(this.config.argumentRegex);
  }

  private getConfig(): WorkspaceConfiguration {
    return workspace.getConfiguration("laravel_goto_policy");
  }
}
