import { join } from 'path'
import { createWriteStream, fstat, writeFileSync, readFileSync } from 'fs'
// import { spawn } from 'child_process'
// import { generateImage } from 'jsdom-screenshot'
// import * as simulant from 'jsdom-simulant'
import { Executor } from './interfaces'
import { LocalExecutor } from './executors/LocalExecutor'
import { DockerExecutor } from './executors/DockerExecutor'
import { Logger } from './utils/Logger'

const serverpath = join(__dirname, '..', 'test')

export class ScreenshotTester {
  static executor: DockerExecutor

  static async initialize() {
    Logger.log('\nINITIALIZING THE SCREENSHOT TESTER')
    ScreenshotTester.executor = new DockerExecutor() // TODO Support Docker
    await ScreenshotTester.executor.initialize()
  }

  static async captureScreenshot(title: string, html: string, config?: any) {
    if (!this.executor) { await this.initialize() }
    const fileName = `${title}.html`
    const file = writeFileSync(join(serverpath, `html`, fileName), html)
    const screenshot = await ScreenshotTester.executor.captureScreenshot(title)
    const IMG_PATH = join(__dirname, '..', 'test', 'screenshots', `${title}.png`)
    // const BUFFER_PATH = join(__dirname, '..', 'test', 'buffers', `${title}.json`)
    const buffer = readFileSync(IMG_PATH)
    // console.log(buffer)
    // return Buffer.from(buffer)
    return buffer
  }
}
