import slugify from '@sindresorhus/slugify'

export const isLeading = (prevChar: string, char: string) => {
  const precededBySeparator = ['-', '_', ' ', '.', '/', '\\'].indexOf(prevChar) > -1
  const isCharLeading = char.toUpperCase() === char && /\w/.test(slugify(char))

  isCharLeading

  return precededBySeparator || isCharLeading
}
