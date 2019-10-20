import * as puppeteer from 'puppeteer'
import { createWriteStream, writeFileSync, appendFileSync } from 'fs'
import { join } from 'path'
import { Logger } from './utils/Logger'

// process.stdin.on('data', (chunk) => { logger('STUFF', chunk) })
process.on('exit', (code) => { Logger.log(['EXITING', code]) })
process.on('uncaughtException', (err) => { Logger.log(['ERR', err]) })

const { SCREENSHOT_NAME } = process.env
const FILE = SCREENSHOT_NAME || 'TestImage'
const HTML_PATH = join(__dirname, '..', 'test', 'html', `${FILE}.html`)
const IMG_PATH = join(__dirname, '..', 'test', 'screenshots', `${FILE}.png`)
const BUFFER_PATH = join(__dirname, '..', 'test', 'buffers', `${FILE}.json`)

Logger.log(`ABOUT TO CAPTURE ${HTML_PATH} => ${IMG_PATH}`);

(async() => {
  let browser
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      handleNodeExit: [],
    })
    const browserVersion = await browser.version()
    Logger.log(`started ${browserVersion}`)
    const page = await browser.newPage()
    page.on('console', msg => Logger.log(['PAGE LOG:', msg.text()]))
    // // const stuff = await page.goto('http://google.com', { waitUntil: 'networkidle2' });
    const stuff = await page.goto(`file://${ HTML_PATH }`, { waitUntil: 'networkidle2' })
    const screen = await page.screenshot({ path: IMG_PATH })
    writeFileSync(BUFFER_PATH, JSON.stringify(screen), { encoding: 'binary' })
    // Logger.log(screen)
    // console.log(screen.length, screen.toJSON())
    return browser.close()
  } catch (err) {
    // console.log(err)
    Logger.log(err)
    browser.close()
    process.exit(1)
  }
})().then(d => {
  Logger.log('DONE, EXITING', d)
  process.exit()
})

process.stdin.resume()
