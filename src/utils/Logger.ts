import { appendFileSync } from 'fs'
import { join } from 'path'

export class Logger {
  static log(...args) {
    return appendFileSync(
      join(__dirname, '..', '..', 'test', 'log.txt'),
      args
        .map(arg => {
          switch (typeof arg) {
            case 'object': return JSON.stringify(arg, null, 2)
            default: return arg
          }
        })
        .join('\n')
        .concat('\n')
    )
  }
}
