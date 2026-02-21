import { exec } from "child_process";

/**
 * Executes the Vitest test suite using the CLI.
 * 
 * @returns A promise that resolves with the success status and the console output (stdout or stderr).
 */
export function runVitest(): Promise<{
    success: boolean
    output: string
}> {
    return new Promise((resolve) => {
        // Run 'npx vitest run' to execute tests once without watch mode
        exec("npx vitest run", (error, stdout, stderr) => {
            if (error) {
                // If the command fails (e.g., tests fail), return the error output
                resolve({
                    success: false,
                    output: stderr || stdout,
                })
            } else {
                // If tests pass, return the standard output
                resolve({
                    success: true,
                    output: stdout,
                })
            }
        })
    })
};