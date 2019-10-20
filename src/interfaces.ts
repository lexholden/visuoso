export interface Executor {
  initialize(): Promise<any>
  captureScreenshot(title: string, options?: ExecutorScreenshotOptions): Promise<any>
}

export interface ExecutorScreenshotOptions {
  HTML_PATH?: string
  IMG_PATH?: string
  BUFFER_PATH?: string
}
