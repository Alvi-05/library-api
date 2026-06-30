export class Logger {
  public static info(message: string, meta?: any): void {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : "");
  }

  public static error(message: string, meta?: any): void {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : "");
  }
}