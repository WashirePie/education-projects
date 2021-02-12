import { DocumentRef } from "./document";
import { Employee } from "./employee";
import { IResource } from "./resource";

export interface IActivity
{
  id: string;
  progress: number;
  startDate: Date;
  endDate: Date;
  documents: Array<DocumentRef> | null;
  responsibility: Employee;
  resources: Array<IResource>;
}

export class Activity implements IActivity
{
  id: string
  startDate: Date
  endDate: Date
  resources: Array<IResource>
  responsibility: Employee
  
  documents: Array<DocumentRef> = []
  progress: number = 0

  constructor(
    _id: string,
    _startDate: Date,
    _endDate: Date,
    _resources: Array<IResource>,
    _responsibility: Employee
  )
  {
    this.id = _id
    this.startDate = _startDate
    this.endDate = _endDate
    this.resources = _resources
    this.responsibility = _responsibility
  }
}