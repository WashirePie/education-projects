export enum EValidationTypes
{
  textValidation = 'TEXT_VALIDATION',
  textDateValidation = 'TEXT_DATE_VALIDATION'
}

export interface IValidationBaseParams
{
  sourceName: string
  source: string
}

export type ValidationParams = {
  [EValidationTypes.textValidation]: {
    regex: RegExp | 'default',
    minChar?: number,
    maxChar?: number,
    duplicatesArray?: Array<string>
  },
  [EValidationTypes.textDateValidation]: null
}

export type ValidationReturns = {
  [EValidationTypes.textValidation]: {
    responseMessage: string,
    payload: string | null,
  },
  [EValidationTypes.textDateValidation]: {
    responseMessage: string,
    payload: Date | null,
  }
}

export type Validations = {
  [EValidationTypes.textValidation] (s: IValidationBaseParams, p: ValidationParams[EValidationTypes.textValidation]): ValidationReturns[EValidationTypes.textValidation]
  [EValidationTypes.textDateValidation] (s: IValidationBaseParams, p: ValidationParams[EValidationTypes.textDateValidation]): ValidationReturns[EValidationTypes.textDateValidation]
}

const validations: Validations = {
  [EValidationTypes.textValidation] (s: IValidationBaseParams, p: ValidationParams[EValidationTypes.textValidation]): ValidationReturns[EValidationTypes.textValidation]
  {
    let res: string = ''
    const appendMessage = (message: string) => res += res ? `, ${message}` : message
      
    // Validate length
    if (p.minChar != undefined && s.source.length < p.minChar) 
      appendMessage(`should contain at least ${p.minChar} characters`)
    if (p.maxChar != undefined && s.source.length > p.maxChar) 
      appendMessage(`should not exceed ${p.maxChar} characters`)

    // Validate content
    if (p.regex != undefined)
    {
      if (p.regex == 'default') 
      {
        if (!/^[a-z\-_\s\döäü]*$/i.test(s.source)) 
          appendMessage(`should only contain letters, numbers, spaces, underscores or hyphens`)
      }
      else
      {
        if (!p.regex.test(s.source)) 
          appendMessage(`should match ${p.regex.toString()}`)
      }
    }

    // Validate no-duplicate. To handle case-sensitivity, values are compared in uppercase
    if (p.duplicatesArray != undefined && p.duplicatesArray.length)
    {
      if (p.duplicatesArray.map(i => i = i.toUpperCase()).includes(s.source.toUpperCase()))
        appendMessage('should not contain duplicates')

    }
    
    if (res)
      return {
        responseMessage: `'${s.sourceName}' ${res}`,
        payload: null
      }
    return {
      responseMessage: '',
      payload: s.source
    }
  },
  [EValidationTypes.textDateValidation] (s: IValidationBaseParams, p: ValidationParams[EValidationTypes.textDateValidation]): ValidationReturns[EValidationTypes.textDateValidation]
  {
    // Validate date format
    const match = (/^([\d]{1,2})\.([\d]{1,2})\.([\d]{4})$/g).exec(s.source)
    if (match)
    {
      // Validate date, swap month and day
      const d = new Date(`${match[2]}.${match[1]}.${match[3]}`)
 
      if (isValidDate(d)) 
        return {
          responseMessage: '',
          payload: d
        }
        return {
        responseMessage: `'${s.sourceName}' shoule be a valid date`,
        payload: null
      }
    }
    return {
      responseMessage: `'${s.sourceName}' should match 'dd-mm-YYYY'`,
      payload: null
    }
  }
}


const validate = <K extends EValidationTypes, P extends ValidationParams[K], R extends ValidationReturns[K]>(type: K, s: IValidationBaseParams, p: P): R =>
{
  /* @ts-ignore */
  return validations[type](s, p) as R
}

export function useValidation()
{
  return validate
}

export const isValidDate = (d: Date): boolean => d instanceof Date && !isNaN(d.getTime())