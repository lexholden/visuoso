import * as Docker from 'dockerode'
// import { } from 'process'
import { fstat, writeFileSync, appendFileSync } from 'fs'
import { join } from 'path'
import { PassThrough } from 'stream'
import { Executor } from '../interfaces'
import { Logger } from '../utils/Logger'

export class DockerExecutor implements Executor {
  static DOCKER_CONTAINER_NAME = 'screenshot-tester'

  docker = new Docker()
  container

  async initialize() {
    await this.startOrCreateContainer()
    await this.configureLogger()
  }

  async startOrCreateContainer() {
    const containers = await this.docker.listContainers({ all: true })
    const container = containers.find(cont => cont.Names.join('') === `/${DockerExecutor.DOCKER_CONTAINER_NAME}`)

    if (container) {
      Logger.log(`we have a container ${container.Image}:${container.Id} (${container.Status})`)
      // logger(`we have a container ${JSON.stringify(container, null, 2)}\n\n`)
      this.container = await this.docker.getContainer(container.Id)
    } else {
      Logger.log('got nothing! lets create')
      this.container = await this.docker.createContainer({
        name: DockerExecutor.DOCKER_CONTAINER_NAME,
        Image: 'buildkite/puppeteer',
        Tty: true,
        Cmd: ['/bin/bash'],
        Volumes: {
          '/home/node/visuoso/dist': {},
          '/home/node/visuoso/test': {},
        },
        HostConfig: {
          Binds: [
            `${join(__dirname, '..', '..', 'dist')}:/home/node/visuoso/dist`,
            `${join(__dirname, '..', '..', 'test')}:/home/node/visuoso/test`,
          ],
        },
      })
    }

    if (!container || container.State !== 'running') { await this.container.start({}) }
    return this.container
  }

  async configureLogger() {
    // create a single stream for stdin and stdout
    const logStream = new PassThrough();
    const stream = await this.container.logs({ follow: true, stdout: true, stderr: true })

    logStream.on('data', (chunk) => Logger.log(chunk.toString('utf8')))
    stream.on('end', () => { logStream.end('CLOSING TASK') })
    this.container.modem.demuxStream(stream, process.stdout, process.stderr)
  }

  async execute(command: string[], env: string[]) {
    Logger.log(`EXECUTING CMD: ${command.join(' ')} ${env.join(' ')}`)
    const exec = await this.container.exec({
      Cmd: command,
      Env: env,
      AttachStdout: true,
      AttachStderr: true,
    })

    const [stream, data] = await Promise.all([exec.start(), exec.inspect()])
    stream.on('data', (chunk) => Logger.log(chunk.toString('utf8')))
    // console.log(stream, data)
    return data
  }

  async captureScreenshot(title: string) {
    if (!this.container) { await this.initialize() }
    Logger.log(`attempting to capture a screenshot ${title}`)
    const response = await this.execute(
      ['node', '/home/node/visuoso/dist/cli.js'],
      [`SCREENSHOT_NAME=${title}`],
    )
    // console.log(response)
    return response
  }
}
