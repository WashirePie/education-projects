import { Type } from "class-transformer";
import { DocumentRef } from "./document";
import { Employee } from "./employee";
import { ExternalCostResource, IResource, PersonnelResource, Resource } from "./resource";

export class Activity {
  constructor(
    aId: string,
    title: string,
    startDate: Date,
    endDate: Date,
    resources: Array<IResource>,
    responsibility: Employee,
    documents: Array<DocumentRef> = []
  ) {
    this._aId = aId
    this._title = title
    this._startDate = startDate
    this._endDate = endDate
    this._resources = resources
    this._responsibility = responsibility
    this._documents = documents

    this._progress = 0
  }

  private _title: string;
  public get title(): string {
    return this._title;
  }

  private _aId: string;
  public get aId(): string {
    return this._aId;
  }

  private _startDate: Date;
  public get startDate(): Date {
    return this._startDate;
  }

  private _endDate: Date;
  public get endDate(): Date {
    return this._endDate;
  }

  @Type(() => Employee)
  private _responsibility: Employee;
  public get responsibility(): Employee {
    return this._responsibility;
  }
  public set responsibility(v: Employee) {
    this._responsibility = v;
  }

  @Type(() => Resource, {
    discriminator: {
      property: '__type',
      subTypes: [
        { value: PersonnelResource, name: 'personellResource' },
        { value: ExternalCostResource, name: 'externalCostResource' }
      ],
    },
  })
  private _resources: Array<IResource>;
  public get resources(): Array<IResource> {
    return this._resources;
  }
  public set resources(v: Array<IResource>) {
    this._resources = v;
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

  @Type(() => DocumentRef)
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
