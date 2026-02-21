import fs from "fs"
import path from "path"

/**
 * Resolves a path alias (specifically '@/') to an absolute file path.
 * 
 * @param importPath - The import string to resolve.
 * @returns The resolved absolute path or the original path if no alias is found.
 */
function resolveAlias(importPath: string): string {
    if (importPath.startsWith("@/")) {
        // Replace the '@/' alias with the current working directory path
        return path.join(process.cwd(), importPath.replace("@/", ""))
    }

    return importPath
}

/**
 * Scans a file for specific type imports and returns their absolute paths.
 * Currently filters for imports starting with '@/types'.
 * 
 * @param filePath - The absolute path of the file to analyze.
 * @returns An array of absolute paths to related type definition files.
 */
export function collectRelatedFiles(filePath: string): string[] {
    // Read the content of the target file
    const content = fs.readFileSync(filePath, "utf-8")

    // Regex to match 'from' imports in TypeScript/JavaScript files
    const importRegex = /from\s+["'](.+)["']/g

    const relatedFiles: string[] = []
    let match

    // Iterate over all matches of the import regex
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1]

        // Only process imports that point to the types directory via alias
        if (importPath.startsWith("@/types")) {
            // Resolve the alias and append the .ts extension
            const resolved = resolveAlias(importPath) + ".ts"

            // Add to list if the file actually exists on disk
            if (fs.existsSync(resolved)) {
                relatedFiles.push(resolved)
            }
        }
    }

    return relatedFiles
}