import { Activity } from "./activity";
import { DocumentRef } from "./document";
import { Milestone } from "./milestone";
import { EProjectState } from "./project";

export interface Phase
{
  title: string;
  progress: number;
  activities: Array<Activity>;
  milestones: Array<Milestone>;
  startDate: Date;
  endDate: Date;
  approvalDate: Date;
  state: EProjectState;
  documents: Array<DocumentRef> | null;
}