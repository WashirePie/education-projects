import { Activity } from "./activity";

export interface Milestone
{
  activities: Array<Activity['id']>;
}