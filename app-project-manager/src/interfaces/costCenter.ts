export interface ICostCenter
{
  title: string;
  id: string;
}

export class CostCenter implements ICostCenter
{
  title: string
  id: string

  constructor(_title: string, _id: string)
  {
    this.title = _title
    this.id = _id
  }
}