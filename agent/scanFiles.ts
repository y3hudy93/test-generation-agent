import fs from "fs"
import path from "path"

/**
 * Path to the library directory where source files are located.
 */
const LIB_PATH = path.join(process.cwd(), "lib")

/**
 * Scans the library directory to find TypeScript files that do not have a corresponding test file.
 * 
 * @returns An array of absolute paths to untested TypeScript files.
 */
export function findUntestedFiles(): string[] {
    // Read all files from the library directory
    const files = fs.readdirSync(LIB_PATH)

    // Filter for source TypeScript files, excluding test files (.test.ts)
    const tsFiles = files.filter(
        (file) =>
            file.endsWith(".ts") &&
            !file.endsWith(".test.ts")
    )

    // Identify source files that lack a matching test file
    const untested = tsFiles.filter((file) => {
        const testFile = file.replace(".ts", ".test.ts")
        return !files.includes(testFile)
    })

    // Convert the filenames to absolute paths
    return untested.map((file) =>
        path.join(LIB_PATH, file)
    )
}