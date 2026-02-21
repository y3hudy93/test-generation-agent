import path from "path";
import fs from "fs";
import { findUntestedFiles } from "./scanFiles";
import { generateTestForFile } from "./generateTest";
import { runVitest } from "./runVitest";
import { fixFailingTest } from "./generateTest";

/**
 * Main agent loop to generate and validate tests for untested files.
 * It scans for files, generates tests, runs them, and attempts auto-fixes on failure.
 */
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

        // Process each untested file sequentially
        for (const filePath of untestedFiles) {
            console.log("Generating test for:", filePath)

            const testFilePath = filePath.replace(".ts", ".test.ts")

            // Initial test generation
            let testCode = await generateTestForFile(filePath)

            // Save the generated test code
            fs.writeFileSync(testFilePath, testCode)

            let attempts = 0
            const maxAttempts = 3

            // Retry loop for fixing failing tests
            while (attempts < maxAttempts) {
                console.log(`Running Vitest (attempt ${attempts + 1})...`)

                // Run the newly created test
                const result = await runVitest()

                if (result.success) {
                    console.log("Test passed\n")
                    break
                }

                console.log("Test failed. Fixing...\n")

                // Request an auto-fix based on the error output
                testCode = await fixFailingTest(
                    filePath,
                    testCode,
                    result.output
                )

                // Update the test file with the fixed code
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

// Start the agent
run()