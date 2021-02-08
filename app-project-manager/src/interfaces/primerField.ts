export interface PrimerSelectItem
{
  name: string
  payload: any
}

export interface PrimerSelectMultipleItem extends PrimerSelectItem
{
  note: string
  state: false
}