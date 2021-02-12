export interface IPrimerSelectItem
{
  name: string
  payload: any
}

export interface IPrimerSelectMultipleItem extends IPrimerSelectItem
{
  note: string
  state: false
}