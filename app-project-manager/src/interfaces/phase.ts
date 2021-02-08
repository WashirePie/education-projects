import { EProjectState } from "./project";

export interface Phase
{
  title: string;
  id: string;
  progress: number;
  activities: Array<Activity>;
  milestones: Array<Milestone>;
  startDate: Date;
  endDate: Date;
  approvalDate: Date;
  state: EProjectState;
  documents: Array<null>;
}

//COMBAK
/*
  Implement interfaces:
    Resource
      -> Human Resource
      -> External Cost Resource
    DocumentRef (might be a class?)
*/