import { DocumentRef } from "./document";
import { Employee } from "./employee";
import { Phase } from "./phase";
import { ExternalCostResource, IResource, PersonnelResource } from "./resource";

export class Activity
{
  id: string
  title: string
  startDate: Date
  endDate: Date
  resources: Array<IResource>
  responsibility: Employee
  
  documents: Array<DocumentRef> = []

  constructor(
    _id: string,
    _title: string,
    _startDate: Date,
    _endDate: Date,
    _resources: Array<IResource>,
    _responsibility: Employee
  )
  {
    this.id = _id
    this.title = _title
    this.startDate = _startDate
    this.endDate = _endDate
    this.resources = _resources
    this.responsibility = _responsibility
    
    this._progress = 0
  }
  
  private _progress : number;
  public get progress() : number {
    return this._progress;
  }
  public set progress(v : number) {
    this._progress = v;
  }  

  getExternalCostResources = (): Array<ExternalCostResource> => this.resources.filter(r => r instanceof ExternalCostResource) as Array<ExternalCostResource>
  getPersonnelResources = (): Array<PersonnelResource> => this.resources.filter(r => r instanceof PersonnelResource) as Array<PersonnelResource>
  getTotalCost = (): number => 
  {
    let externalCostResources = this.getExternalCostResources()
    return externalCostResources.length ? externalCostResources.map(e => e.plan).reduce((a, c) => a + c) : 0
  }
  getTotalWorkload = (): number => 
  {
    let personnelResources = this.getPersonnelResources()
    return personnelResources.length ? personnelResources.map(e => e.plan).reduce((a, c) => a + c) : 0
  }

}