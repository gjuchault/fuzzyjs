import { ScoreContext } from '../match'

export const pushScore = (previousContext: ScoreContext, context: ScoreContext) => {
  if (!context) {
    throw new TypeError('Expecting context to be defined')
  }

  if (!context.match) {
    return context.currentScore - 1
  }

  let increment = 0

  if (previousContext && previousContext.match) {
    increment += 5
  }

  if (context.leading) {
    increment += 10
  }

  return context.currentScore + increment
}
