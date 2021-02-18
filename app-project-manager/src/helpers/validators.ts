export enum EValidationTypes
{
  textValidation = 'TEXT_VALIDATION',
  numberValidation = 'NUMBER_VALIDATION',
  dateValidation = 'TEXT_DATE_VALIDATION'
}

export interface IValidationBaseParams
{
  sourceName: string
  source: string | number | Date
}

export type ValidationParams = {
  [EValidationTypes.textValidation]: {
    regex: RegExp | 'default',
    minChar?: number,
    maxChar?: number,
    duplicatesArray?: Array<string>
  },
  [EValidationTypes.dateValidation]: {
    minDate?: Date | null,
    maxDate?: Date | null,
  },
  [EValidationTypes.numberValidation]: {
    max?: number,
    min?: number
  },

}

export type ValidationReturns = {
  [EValidationTypes.textValidation]: {
    responseMessage: string,
    payload: string | null,
  },
  [EValidationTypes.dateValidation]: {
    responseMessage: string,
    payload: Date | null,
  },
  [EValidationTypes.numberValidation]: {
    responseMessage: string,
    payload: number | null,
  }
}

export type Validations = {
  [EValidationTypes.textValidation]   (s: IValidationBaseParams, p: ValidationParams[EValidationTypes.textValidation]):   ValidationReturns[EValidationTypes.textValidation]
  [EValidationTypes.dateValidation]   (s: IValidationBaseParams, p: ValidationParams[EValidationTypes.dateValidation]):   ValidationReturns[EValidationTypes.dateValidation]
  [EValidationTypes.numberValidation] (s: IValidationBaseParams, p: ValidationParams[EValidationTypes.numberValidation]): ValidationReturns[EValidationTypes.numberValidation]
}

const validations: Validations = {
  [EValidationTypes.textValidation] (s: IValidationBaseParams, p: ValidationParams[EValidationTypes.textValidation]): ValidationReturns[EValidationTypes.textValidation]
  {
    let text = s.source as string
    let res: string = ''
    const appendMessage = (message: string) => res += res ? `, ${message}` : message
      
    // Validate length
    if (p.minChar != undefined && text.length < p.minChar) 
      appendMessage(`should contain at least ${p.minChar} characters`)
    if (p.maxChar != undefined && text.length > p.maxChar) 
      appendMessage(`should not exceed ${p.maxChar} characters`)

    // Validate content
    if (p.regex != undefined)
    {
      if (p.regex == 'default') 
      {
        if (!/^[a-z\-_\s\döäü]*$/i.test(text)) 
          appendMessage(`should only contain letters, numbers, spaces, underscores or hyphens`)
      }
      else
      {
        if (!p.regex.test(text)) 
          appendMessage(`should match ${p.regex.toString()}`)
      }
    }

    // Validate no-duplicate. To handle case-sensitivity, values are compared in uppercase
    if (p.duplicatesArray != undefined && p.duplicatesArray.length)
    {
      if (p.duplicatesArray.map(i => i = i.toUpperCase()).includes(text.toUpperCase()))
        appendMessage('should not contain duplicates')

    }
    
    if (res)
      return {
        responseMessage: `'${s.sourceName}' ${res}`,
        payload: null
      }
    return {
      responseMessage: '',
      payload: text
    }
  },

  [EValidationTypes.dateValidation] (s: IValidationBaseParams, p: ValidationParams[EValidationTypes.dateValidation]): ValidationReturns[EValidationTypes.dateValidation]
  {
    let date = s.source as Date
    let res: string = ''
    const appendMessage = (message: string) => res += res ? `, ${message}` : message

    // // Validate date format
    // const match = (/^([\d]{1,2})\.([\d]{1,2})\.([\d]{4})$/g).exec(s.source)
    // if (match)
    // {
    //   // Validate date, swap month and day
    //   const d = new Date(`${match[2]}.${match[1]}.${match[3]}`)
 
    if (!isValidDate(date)) 
      appendMessage('shoule be a valid date')

    if (p.maxDate && date > p.maxDate)
      appendMessage(`should not be later than ${p.maxDate.toLocaleDateString()}`)

    if (p.minDate && date < p.minDate)
      appendMessage(`should not be before ${p.minDate.toLocaleDateString()}`)

    if (res)
      return {
        responseMessage: `'${s.sourceName}' ${res}`,
        payload: null
      }
    return {
      responseMessage: '',
      payload: date
    }
  },

  [EValidationTypes.numberValidation] (s: IValidationBaseParams, p: ValidationParams[EValidationTypes.numberValidation]): ValidationReturns[EValidationTypes.numberValidation]
  {
    let number = s.source as number
    let res: string = ''
    const appendMessage = (message: string) => res += res ? `, ${message}` : message
    
    if (p.max && number > p.max)
    appendMessage(`should not be greater than ${p.max}`)

    if (p.min && number < p.min)
      appendMessage(`should not be less than ${p.min}`)

    if (res)
      return {
        responseMessage: `'${s.sourceName}' ${res}`,
        payload: null
      }
    return {
      responseMessage: '',
      payload: number
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