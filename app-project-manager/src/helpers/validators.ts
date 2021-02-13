export const genericTextValidation = (type: string,
  value: string,
  minChar: number,
  maxChar: number,
  checkContent: true = true,
  duplicatesArray: Array<string> = [],
  sourcesArray: Array<string> = []) =>
{
  let response = ''
  const append = (message: string) => response += response ? `, ${message}` : message

  // Validate length
  if (value.length < minChar)
    append(`should contain at least ${minChar} characters`)
  if (value.length > maxChar)
    append(`should not exceed ${maxChar} characters`)

  // Validate content
  if (!/^[a-z\-_\s\döäü]*$/i.test(value) && checkContent)
    append('should only contain letters, numbers, spaces, underscores or hyphens')

  // Optional: Check for duplicates
  // To handle case-sensitivity, values are compared in uppercase
  if (duplicatesArray.length)
  {
    if (duplicatesArray.map(i => i = i.toUpperCase()).includes(value.toUpperCase()))
      append('should not contain duplicates')
  }

  // Optional: Check for at least one match
  // To handle case-sensitivity, values are compared in uppercase
  if (sourcesArray.length)
  {
    if (!sourcesArray.map(i => i = i.toUpperCase()).includes(value.toUpperCase()))
      append('should be equal to a predefined value')
  }

  return response ? `'${type}' ${response}` : ''
}

export const customTextValidation = (type: string, value: string, regex = /^[a-z\-_\s\döäü]*$/i) =>
{
  let response = ''
  const append = (message: string) => response += response ? `, ${message}` : message

  regex = new RegExp(regex)

  // Validate content
  if (!regex.test(value))
    append(`should match '${regex.toString()}'`)

  return response ? `'${type}' ${response}` : ''
}

export const dateValidation = (type: string, value: string) =>
{
  let response = ''
  const append = (message: string) => response += response ? `, ${message}` : message

  // Validate content
  if (!/[\d]{1,2}\.[\d]{1,2}\.[\d]{4}/g.test(value))
    append(`should match 'dd-mm-YYYY'`)

  return response ? `'${type}' ${response}` : ''
}