import { Phase } from "./phase";

export class ApproachModel {
  constructor(title: string, phases: Array<string>) {
    this._title = title
    this._phases = phases
  }

  private _title: string;
  public get title(): string {
    return this._title;
  }

  private _phases: Array<string>;
  public get phases(): Array<string> {
    return this._phases;
  }

  scaffold(): Array<Phase> {
    return this.phases.map(p => new Phase(p))
  }
}