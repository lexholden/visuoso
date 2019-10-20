import { ScreenshotTester } from './ScreenshotTester'
import { generateImage } from 'jsdom-screenshot'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

describe('ScreenshotTester', () => {
  jest.setTimeout(1000 * 60 * 60)
  expect.extend({ toMatchImageSnapshot })

  it('should share a docker instance between multiple screenshot testers', async() => {
    const screen = await ScreenshotTester.captureScreenshot('TestImage', '<html><head><style>body { padding: 30px; font-family: Helvetica }</style></head><body><h1>Hello Buddy</h1></body></html>');
    (expect(screen) as any).toMatchImageSnapshot()
    // (expect(await ScreenshotTester.captureScreenshot('Another Test Image', '<html><body><h1>I Like Pears</h1></body></html>')) as any).toMatchImageSnapshot();
  })
})
