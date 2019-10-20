import { join } from 'path'
import { createWriteStream, fstat, writeFileSync, readFileSync } from 'fs'
// import { spawn } from 'child_process'
// import { generateImage } from 'jsdom-screenshot'
// import * as simulant from 'jsdom-simulant'
import { Executor, ExecutorScreenshotOptions } from './interfaces'
import { LocalExecutor } from './executors/LocalExecutor'
import { DockerExecutor } from './executors/DockerExecutor'
import { Logger } from './utils/Logger'

const serverpath = join(__dirname, '..', 'test')

export class ScreenshotTester {
  static executor: Executor

  static async initialize() {
    Logger.log('\nINITIALIZING THE SCREENSHOT TESTER')
    if (process.env.CI) {
      ScreenshotTester.executor = new LocalExecutor()
    } else {
      ScreenshotTester.executor = new DockerExecutor() // TODO Support Docker
    }

    await ScreenshotTester.executor.initialize()
  }

  static generateOptions(FILE: string): ExecutorScreenshotOptions {
    return {
      HTML_PATH: join(__dirname, '..', 'test', 'html', `${FILE}.html`),
      IMG_PATH: join(__dirname, '..', 'test', 'screenshots', `${FILE}.png`),
      BUFFER_PATH: join(__dirname, '..', 'test', 'buffers', `${FILE}.json`),
    }
  }

  static async captureScreenshot(title: string, html: string, config?: any) {
    if (!this.executor) { await this.initialize() }
    const fileName = `${title}.html`
    const options = ScreenshotTester.generateOptions(title)
    const file = writeFileSync(join(serverpath, `html`, fileName), html)
    const screenshot = await ScreenshotTester.executor.captureScreenshot(title, options)
    // const BUFFER_PATH = join(__dirname, '..', 'test', 'buffers', `${title}.json`)
    const buffer = readFileSync(options.IMG_PATH)
    // console.log(buffer)
    return buffer
  }
}
