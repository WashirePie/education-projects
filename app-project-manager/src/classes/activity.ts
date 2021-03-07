import { Type } from "class-transformer";
import { DocumentRef } from "./document";
import { Employee } from "./employee";
import { ExternalCostResource, IResource, PersonnelResource, Resource } from "./resource";


/**
 * Encapsulates a project related activity
 *
 * @export
 * @class Activity
 */
export class Activity {
  /**
   * Creates an instance of Activity.
   * @param {string} aId
   * @param {string} title
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {Array<IResource>} resources
   * @param {Employee} responsibility
   * @param {Array<DocumentRef>} [documents=[]]
   * @memberof Activity
   */
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

  /**
   * Title
   *
   * @readonly
   * @type {string}
   * @memberof Activity
   */
  public get title(): string { return this._title; }
  private _title: string;

  /**
   * Unique identifier 
   * 
   * @readonly
   * @type {string}
   * @memberof Activity
   */
  public get aId(): string { return this._aId; }
  private _aId: string;

  /**
   * Startdate
   *
   * @readonly
   * @type {Date}
   * @memberof Activity
   */
  public get startDate(): Date { return this._startDate; }
  private _startDate: Date;

  /**
   * Enddate
   *
   * @private
   * @type {Date}
   * @memberof Activity
   */
  private _endDate: Date;
  public get endDate(): Date {
    return this._endDate;
  }

  /**
   * Responsible Employee
   *
   * @readonly
   * @property
   * @type {Employee}
   * @memberof Activity
   */
  @Type(() => Employee)
  private _responsibility: Employee;
  public get responsibility(): Employee { return this._responsibility; }

  /**
   * Assigned Resources
   *
   * @property
   * @type {Array<IResource>}
   * @memberof Activity
   */
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
  public get resources(): Array<IResource> { return this._resources; }
  public set resources(v: Array<IResource>) { this._resources = v; }

  /**
   * Progress
   * Clamped to a range between 0 and 100
   * Other getters are available: @isFinished
   *
   * @property
   * @type {number}
   * @memberof Activity
   */
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
  get isFinished(): boolean { return this.progress >= 100 }

  /**
   * Assigned Documents
   *
   * @property
   * @type {Array<DocumentRef>}
   * @memberof Activity
   */
  @Type(() => DocumentRef)
  private _documents: Array<DocumentRef>;
  public get documents(): Array<DocumentRef> { return this._documents; }

  /**
   * Invoke a selection dialog and assign the selected documents
   * to this
   * 
   * @async
   * @method addDocuments
   * @memberof Activity
   */
  public async addDocuments() {
    // Remove dupes
    let selected: Array<DocumentRef> = await DocumentRef.promptSelection()
    this._documents = [...this._documents, ...selected].filter((v, i, a) => a.findIndex(t => (t.path === v.path)) === i)
  }

  /**
   * Remove @doc from this
   * 
   * @method removeDocument
   * @param {DocumentRef} doc
   * @memberof Activity
   */
  public removeDocument(doc: DocumentRef) {
    this._documents = this._documents.filter(d => d.path != doc.path)
  }

  /**
   * Get all external cost resources of this
   * 
   * @method getExternalCostResources
   * @returns {Array<ExternalCostResource>} All assigned resources of type external cost resource
   * @memberof Activity
   */
  getExternalCostResources = (): Array<ExternalCostResource> => this.resources.filter(r => r instanceof ExternalCostResource) as Array<ExternalCostResource>

  /**
   * Get all personnel resources of this
   * 
   * @method getPersonnelResources
   * @returns {Array<ExternalCostResource>} All assigned resources of type personnel resource
   * @memberof Activity
   */
  getPersonnelResources = (): Array<PersonnelResource> => this.resources.filter(r => r instanceof PersonnelResource) as Array<PersonnelResource>

  /**
   * Get cost sum of all external cost resources of this.
   * Does not account for different units
   * 
   * @method getTotalCost
   * @returns {number} 
   * @memberof Activity
   */
  getTotalCost = (): number => {
    let externalCostResources = this.getExternalCostResources()
    return externalCostResources.length ? externalCostResources.map(e => e.plan).reduce((a, c) => a + c) : 0
  }

  /**
   * Get hour sum of all personnel resources of this.
   * Does not account for different units
   * 
   * @method getTotalWorkload
   * @returns {number} 
   * @memberof Activity
   */
  getTotalWorkload = (): number => {
    let personnelResources = this.getPersonnelResources()
    return personnelResources.length ? personnelResources.map(e => e.plan).reduce((a, c) => a + c) : 0
  }
}
