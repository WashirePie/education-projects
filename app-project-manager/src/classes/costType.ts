export class CostType {
  constructor(title: string, id: string) {
    this._title = title
    this._cId = id
  }

  private _title: string;
  public get title(): string {
    return this._title;
  }

  private _cId: string;
  public get cId(): string {
    return this._cId;
  }
}