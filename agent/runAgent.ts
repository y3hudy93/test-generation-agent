import path from "path";
import fs from "fs";
import { findUntestedFiles } from "./scanFiles";
import { generateTestForFile } from "./generateTest";
import { runVitest } from "./runVitest";
import { fixFailingTest } from "./generateTest";

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
            console.log("Generating test for:", filePath)

            const testFilePath = filePath.replace(".ts", ".test.ts")

            let testCode = await generateTestForFile(filePath)

            fs.writeFileSync(testFilePath, testCode)

            let attempts = 0
            const maxAttempts = 3

            while (attempts < maxAttempts) {
                console.log(`Running Vitest (attempt ${attempts + 1})...`)

                const result = await runVitest()

                if (result.success) {
                    console.log("Test passed\n")
                    break
                }

                console.log("Test failed. Fixing...\n")

                testCode = await fixFailingTest(
                    filePath,
                    testCode,
                    result.output
                )

                fs.writeFileSync(testFilePath, testCode)

                attempts++
            }

            if (attempts === maxAttempts) {
                console.log(
                    "Max attempts reached. Test still failing.\n"
                )
            }
        }

        console.log("Test generation completed.")
    } catch (error) {
        console.error("Agent error:", error)
    }
}

run()