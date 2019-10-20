import * as puppeteer from 'puppeteer'
import { Executor } from '../interfaces'
import { createWriteStream, writeFileSync, appendFileSync } from 'fs'
import { Logger } from '../utils/Logger'

export class LocalExecutor implements Executor {
  browser

  async initialize() {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      handleNodeExit: [],
    })
    const browserVersion = await this.browser.version()
    Logger.log(`started ${browserVersion}`)
  }

  async captureScreenshot(title: string, options) {
    if (!this.browser) { await this.initialize() }

    const { HTML_PATH, IMG_PATH, BUFFER_PATH } = options
    const page = await this.browser.newPage()
    page.on('console', msg => Logger.log(['PAGE LOG:', msg.text()]))
    const stuff = await page.goto(`file://${ HTML_PATH }`, { waitUntil: 'networkidle2' })
    const screen = await page.screenshot({ path: IMG_PATH })
    writeFileSync(BUFFER_PATH, JSON.stringify(screen), { encoding: 'binary' })
    return this.browser.close()
  }
}
