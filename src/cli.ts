import * as puppeteer from 'puppeteer'
import { createWriteStream, writeFileSync, appendFileSync } from 'fs'
import { join } from 'path'
import { Logger } from './utils/Logger'
import { LocalExecutor } from './executors/LocalExecutor'
import { ScreenshotTester } from './ScreenshotTester'

// process.stdin.on('data', (chunk) => { logger('STUFF', chunk) })
process.on('exit', (code) => { Logger.log(['EXITING', code]) })
process.on('uncaughtException', (err) => { Logger.log(['ERR', err]) })

const { SCREENSHOT_NAME } = process.env
const FILE = SCREENSHOT_NAME || 'TestImage'
const options = ScreenshotTester.generateOptions(FILE)
const executor = new LocalExecutor()

Logger.log(`ABOUT TO CAPTURE ${options.HTML_PATH} => ${options.IMG_PATH}`);

(async() => {
  try {
    await executor.initialize()
    await executor.captureScreenshot(SCREENSHOT_NAME, options)
  } catch (err) {
    Logger.log(err)
    process.exit(1)
  }
})().then(d => {
  Logger.log('DONE, EXITING', d)
  process.exit()
})

process.stdin.resume()
