export interface ICostType
{
  title: string;
  id: string;
}

export class CostType implements ICostType
{
  title: string
  id: string

  constructor(_title: string, _id: string)
  {
    this.title = _title
    this.id = _id
  }
}