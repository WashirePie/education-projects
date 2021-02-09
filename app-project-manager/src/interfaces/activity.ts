import { DocumentRef } from "./document";
import { Employee } from "./employee";
import { Resource } from "./resource";

export interface Activity
{
  id: string;
  progress: number;
  startDate: Date;
  endDate: Date;
  documents: Array<DocumentRef>;
  responsibility: Employee;
  resources: Array<Resource>;
}