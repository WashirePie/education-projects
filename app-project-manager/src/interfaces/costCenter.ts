export interface CostCenter
{
  title: string;
  id: string;
}

const emptyCostCenter: CostCenter = {
  title: '',
  id: ''
}

/**
 * @summary Helper function to do runtime Typechecking. It's <b>only</b> used in conjunction with
 * Vuex. Vuex TS support is too involved for such a small project
 * @param {any} [obj] Object to be checked
 * @returns {boolean} True if typecheck succeeded
 */
export const isCostCenter = (obj: any): obj is CostCenter => Object.keys(obj).every(k => Object.keys(emptyCostCenter).includes(k))