export interface IDocumentRef
{
  name: string;
  path: string;
}

export class DocumentRef implements IDocumentRef
{
  name: string
  path: string

  constructor(_name: string, _path: string)
  {
    this.name = _name
    this.path = _path
  }
}