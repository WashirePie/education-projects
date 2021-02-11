export interface ApproachModel 
{
  title: string;
  phases: Array<string>;
}

const emptyApproachModel: ApproachModel = {
  title: '',
  phases: ['']
}

/**
 * @summary Helper function to do runtime Typechecking. It's <b>only</b> used in conjunction with
 * Vuex. Vuex TS support is too involved for such a small project
 * @param {any} [obj] Object to be checked
 * @returns {boolean} True if typecheck succeeded
 */
export const isApproachModel = (obj: any): obj is ApproachModel => Object.keys(obj).every(k => Object.keys(emptyApproachModel).includes(k))