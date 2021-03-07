import { Phase } from "./phase";


/**
 * Specifies an approach model for a project to be based on
 *
 * @export
 * @class ApproachModel
 */
export class ApproachModel {
  /**
   * Creates an instance of ApproachModel.
   * @param {string} title
   * @param {Array<string>} phases
   * @memberof ApproachModel
   */
  constructor(title: string, phases: Array<string>) {
    this._title = title
    this._phases = phases
  }

  /**
   * Title
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof ApproachModel
   */
  private _title: string;
  public get title(): string { return this._title; }


  /**
   * Phases as array of strings. Order is relevant
   *
   * @readonly
   * @property
   * @type {Array<string>}
   * @memberof ApproachModel
   */
  private _phases: Array<string>;
  public get phases(): Array<string> { return this._phases; }

  /**
   * Generate new phases based on this
   *
   * @method scaffold
   * @return {Array<Phase>} Array of generated phases
   * @memberof ApproachModel
   */
  scaffold(): Array<Phase> {
    return this.phases.map(p => new Phase(p))
  }
}