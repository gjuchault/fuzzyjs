export interface FuzzyOptions {
  caseSensitive?: boolean;
  before?: string;
  after?: string;
}

export interface FuzzyResult {
  score: number;
  result: string;
}

declare function test(pattern: string, str: string, caseSensitive?: boolean): boolean;
declare function match(pattern: string, str: string, options?: FuzzyOptions): FuzzyResult;
declare function filter(pattern: string, strs: Array<string>, options?: FuzzyOptions): Array<string>;

export { test, match, filter };
