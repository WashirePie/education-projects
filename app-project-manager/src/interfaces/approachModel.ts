import { Phase } from "./phase";
import { EProjectState } from "./project";

export interface IApproachModel 
{
  title: string;
  phases: Array<string>;
}

export class ApproachModel implements IApproachModel
{
  title: string
  phases: Array<string>

  constructor(_title: string, _phases: Array<string>)
  {
    this.title = _title
    this.phases = _phases
  }

  scaffold(): Array<Phase>
  {
    return this.phases.map(p => new Phase(p))
  }
}