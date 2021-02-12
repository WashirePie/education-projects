import { Activity } from "./activity";

export interface IMilestone
{
  title: string
  reviewDate: Date
  activities: Array<Activity['id']>;
}

export class Milestone implements IMilestone
{
  title: string
  reviewDate: Date
  activities: Array<Activity['id']>

  constructor(_title: string, _reviewDate: Date, watch: Array<Activity['id']>)
  {
    this.title = _title
    this.reviewDate = _reviewDate
    this.activities = watch
  }
}