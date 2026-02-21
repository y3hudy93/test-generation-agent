import { exec } from "child_process";

export function runVitest(): Promise<{
  success: boolean
  output: string
}> {
  return new Promise((resolve) => {
    exec("npx vitest run", (error, stdout, stderr) => {
      if (error) {
        resolve({
          success: false,
          output: stderr || stdout,
        })
      } else {
        resolve({
          success: true,
          output: stdout,
        })
      }
    })
  })
};