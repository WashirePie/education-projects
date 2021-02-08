import { Employee } from "./employee";

export interface Activity
{
  progress: number;
  startDate: Date;
  endDate: Date;
  documents: Array<null>;
  responsibility: Employee;
  resources: Array<Resoruce>;
}