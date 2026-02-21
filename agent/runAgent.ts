import path from "path"
import fs from "fs"
import { findUntestedFiles } from "./scanFiles"
import { generateTestForFile } from "./generateTest"

async function run() {
    try {
        console.log("Scanning for untested files...\n")

        const untestedFiles = findUntestedFiles()

        if (untestedFiles.length === 0) {
            console.log("No untested files found.")
            return
        }

        console.log(
            `Found ${untestedFiles.length} untested file(s):\n`
        )

        untestedFiles.forEach((file) =>
            console.log(" -", path.relative(process.cwd(), file))
        )

        console.log("\nGenerating tests...\n")

        for (const filePath of untestedFiles) {
            console.log(
                "Generating test for:",
                path.basename(filePath)
            )

            const testCode = await generateTestForFile(filePath)

            const testFilePath = filePath.replace(
                ".ts",
                ".test.ts"
            )

            fs.writeFileSync(testFilePath, testCode)

            console.log(
                "Test created:",
                path.basename(testFilePath),
                "\n"
            )
        }

        console.log("Test generation completed.")
    } catch (error) {
        console.error("Agent error:", error)
    }
}

run()