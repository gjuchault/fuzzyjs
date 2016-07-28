import { MatchRange } from '../match'

export const pushRange = (ranges: Array<MatchRange>, sourcePos: number): Array<MatchRange> => {
  const lastRange = ranges[ranges.length - 1]

  if (lastRange && lastRange.stop === sourcePos) {
    return [
      ...ranges.slice(0, -1),
      {
        start: lastRange.start,
        stop: sourcePos + 1
      }
    ]
  } else {
    return [...ranges, { start: sourcePos, stop: sourcePos + 1 }]
  }
}
