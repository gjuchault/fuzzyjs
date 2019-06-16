// XRegExp('\\p{Latin}')
const latinCharacter = /[\u0041-\u005A\u0061-\u007A\u00AA\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A-\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA7FF\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A]/

export const isLeading = (prevChar: string, char: string) => {
  const precededBySeparator =
    prevChar === '-' ||
    prevChar === '_' ||
    prevChar === ' ' ||
    prevChar === '.' ||
    prevChar === '/' ||
    prevChar === '\\'

  const isCharLeading = char.toUpperCase() === char && latinCharacter.test(char)

  return precededBySeparator || isCharLeading
}
