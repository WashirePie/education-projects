import { Activity } from "./activity";

export class Milestone
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