import path from "path";
import fs from "fs";
import { findUntestedFiles } from "./scanFiles";
import { generateTestForFile } from "./generateTest";
import { runVitest } from "./runVitest";
import { fixFailingTest } from "./generateTest";
import { getFileCoverageDetails } from "./readCoverage";

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

            // Calculate the expected test file path (assuming same directory)
            const testFilePath = filePath.replace(".ts", ".test.ts")

            // Initial test generation using the OpenAI agent
            let testCode = await generateTestForFile(filePath)

            // Save the newly generated test code to disk
            fs.writeFileSync(testFilePath, testCode)

            let attempts = 0
            const maxAttempts = 3

            // Retry loop for fixing failing tests or improving coverage
            while (attempts < maxAttempts) {
                console.log(`Running Vitest (attempt ${attempts + 1})...`)

                // Run the test suite and capture output
                const result = await runVitest()

                if (!result.success) {
                    console.log("Test failed. Fixing...\n")

                    // Feed the failure back to the LLM to request a fix
                    testCode = await fixFailingTest(
                        filePath,
                        testCode,
                        result.output
                    )

                    // Overwrite with the corrected version
                    fs.writeFileSync(testFilePath, testCode)

                    attempts++
                    continue
                }

                console.log("Test passed")

                // Define the desired coverage threshold
                const COVERAGE_THRESHOLD = 98;

                // Parse the coverage report to check if we met the goal
                const coverageDetails =
                    getFileCoverageDetails(filePath)

                console.log(
                    `Coverage: ${coverageDetails.percentage}%`
                )

                if (coverageDetails.percentage >= COVERAGE_THRESHOLD) {
                    console.log("Coverage threshold met\n")
                    break
                }

                console.log(
                    "Coverage below threshold. Improving tests..."
                )

                // Read source code to provide context for missing branches
                const sourceCode = fs.readFileSync(filePath, "utf-8")

                // Identify exactly which lines (branches) are not covered
                const missingBranchesSnippet =
                    coverageDetails.uncoveredBranchLines
                        .map((line) => {
                            const lines = sourceCode.split("\n")
                            return `Line ${line}: ${lines[line - 1]}`
                        })
                        .join("\n")

                // Instruct the LLM to explicitly cover the missing branches
                testCode = await fixFailingTest(
                    filePath,
                    testCode,
                    `The following branches are not covered:\n${missingBranchesSnippet}\nWrite additional tests to cover them.`
                )

                // Save the improved test suite
                fs.writeFileSync(testFilePath, testCode)

                attempts++
            }

            if (attempts === maxAttempts) {
                console.log(
                    "Max attempts reached. Test still failing.\n"
                );
            }
        }


        console.log("Test generation completed.");
    } catch (error) {
        console.error("Agent error:", error)
    }
}

// Start the agent
run()