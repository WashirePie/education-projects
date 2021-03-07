
/**
 * Specifies a cost type for external resources
 *
 * @export
 * @class CostType
 */
export class CostType {
  /**
   * Creates an instance of CostType.
   * @param {string} title
   * @param {string} id
   * @memberof CostType
   */
  constructor(title: string, id: string) {
    this._title = title
    this._cId = id
  }

  /**
   * Title
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof CostType
   */
  private _title: string;
  public get title(): string { return this._title; }

  /**
   * Unique identifier
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof CostType
   */
  private _cId: string;
  public get cId(): string { return this._cId; }
}