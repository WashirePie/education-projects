import { Activity } from "./activity";

export class Milestone
{
  name: string
  reviewDate: Date
  activities: Array<Activity['id']>

  constructor(_name: string, _reviewDate: Date, watch: Array<Activity['id']>)
  {
    this.name = _name
    this.reviewDate = _reviewDate
    this.activities = watch
  }
}