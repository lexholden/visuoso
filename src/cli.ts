import * as puppeteer from 'puppeteer'
import { createWriteStream, writeFileSync, appendFileSync } from 'fs'
import { join } from 'path'
import { Logger } from './utils/Logger'
import { LocalExecutor } from './executors/LocalExecutor'

// process.stdin.on('data', (chunk) => { logger('STUFF', chunk) })
process.on('exit', (code) => { Logger.log(['EXITING', code]) })
process.on('uncaughtException', (err) => { Logger.log(['ERR', err]) })

const { SCREENSHOT_NAME } = process.env
const FILE = SCREENSHOT_NAME || 'TestImage'
const HTML_PATH = join(__dirname, '..', 'test', 'html', `${FILE}.html`)
const IMG_PATH = join(__dirname, '..', 'test', 'screenshots', `${FILE}.png`)
const BUFFER_PATH = join(__dirname, '..', 'test', 'buffers', `${FILE}.json`)
const executor = new LocalExecutor()

Logger.log(`ABOUT TO CAPTURE ${HTML_PATH} => ${IMG_PATH}`);

(async() => {
  try {
    await executor.initialize()
    await executor.captureScreenshot(SCREENSHOT_NAME, {
      HTML_PATH,
      IMG_PATH,
      BUFFER_PATH,
    })
  } catch (err) {
    Logger.log(err)
    process.exit(1)
  }
})().then(d => {
  Logger.log('DONE, EXITING', d)
  process.exit()
})

process.stdin.resume()
