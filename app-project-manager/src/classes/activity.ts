import { DocumentRef } from "./document";
import { Employee } from "./employee";
import { ExternalCostResource, IResource, PersonnelResource } from "./resource";

export class Activity {
  id: string
  title: string
  startDate: Date
  endDate: Date
  resources: Array<IResource>
  responsibility: Employee

  constructor(
    _id: string,
    _title: string,
    _startDate: Date,
    _endDate: Date,
    _resources: Array<IResource>,
    _responsibility: Employee,
    _documents: Array<DocumentRef> = []
  ) {
    this.id = _id
    this.title = _title
    this.startDate = _startDate
    this.endDate = _endDate
    this.resources = _resources
    this.responsibility = _responsibility
    this._documents = _documents

    this._progress = 0
  }

  private _progress: number;
  public get progress(): number {
    return this._progress;
  }
  public set progress(v: number) {
    let value = <unknown>v

    v = parseFloat(<string>value) | 0
    this._progress = v > 100 ? 100
      : v < 0 ? 0
        : v
  }

  private _documents: Array<DocumentRef>;
  public get documents(): Array<DocumentRef> {
    return this._documents;
  }
  public async addDocuments() {
    // Remove dupes
    let selected: Array<DocumentRef> = await DocumentRef.promptSelection()
    this._documents = [...this._documents, ...selected].filter((v, i, a) => a.findIndex(t => (t.path === v.path)) === i)
  }
  public removeDocument(doc: DocumentRef) {
    this._documents = this._documents.filter(d => d.path != doc.path)
  }

  get isFinished(): boolean { return this.progress >= 100 }

  getExternalCostResources = (): Array<ExternalCostResource> => this.resources.filter(r => r instanceof ExternalCostResource) as Array<ExternalCostResource>
  getPersonnelResources = (): Array<PersonnelResource> => this.resources.filter(r => r instanceof PersonnelResource) as Array<PersonnelResource>
  getTotalCost = (): number => {
    let externalCostResources = this.getExternalCostResources()
    return externalCostResources.length ? externalCostResources.map(e => e.plan).reduce((a, c) => a + c) : 0
  }
  getTotalWorkload = (): number => {
    let personnelResources = this.getPersonnelResources()
    return personnelResources.length ? personnelResources.map(e => e.plan).reduce((a, c) => a + c) : 0
  }

}