import { toLatin } from './toLatin'

export const isLeading = (prevChar: string, char: string) => {
  const precededBySeparator =
    prevChar === '-' ||
    prevChar === '_' ||
    prevChar === ' ' ||
    prevChar === '.' ||
    prevChar === '/' ||
    prevChar === '\\'

  const isCharLeading = char.toUpperCase() === char && /\w/.test(toLatin(char))

  return precededBySeparator || isCharLeading
}
